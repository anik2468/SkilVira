import { uploadImageBuffer } from "../utils/cloudinaryUpload.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";

import Payment from "../models/Payment.js";
import Course from "../models/Course.js";
import Internship from "../models/Internship.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import Referral from "../models/Referral.js";
import AmbassadorProfile from "../models/AmbassadorProfile.js";

const getUserId = (req) =>
  req.user?.id || req.user?._id || req.user?.userId || null;

const getRole = (req) =>
  String(req.user?.role || req.user?.userRole || "").toLowerCase();

const isStaff = (req) =>
  ["employee", "control", "admin"].includes(getRole(req));

const isValidId = (id) =>
  mongoose.Types.ObjectId.isValid(String(id || ""));

const sendError = (res, error, message = "Request failed") => {
  console.error(`[PAYMENT] ${message}:`, error);
  return res.status(500).json({
    success: false,
    message,
  });
};

const getProduct = async ({ type, courseId, internshipId }) => {
  if (type === "course" && isValidId(courseId)) {
    return Course.findById(courseId);
  }

  if (type === "internship" && isValidId(internshipId)) {
    return Internship.findById(internshipId);
  }

  return null;
};

const createOrGetEnrollment = async (payment, session) => {
  let enrollment = await Enrollment.findOne({
    payment: payment._id,
    isDeleted: { $ne: true },
  }).session(session);

  let created = false;

  if (!enrollment) {
    const docs = await Enrollment.create(
      [
        {
          student: payment.student,
          course: payment.course || null,
          internship: payment.internship || null,
          payment: payment._id,
          status: "Active",
          enrollmentDate: new Date(),
        },
      ],
      { session }
    );

    enrollment = docs[0];
    created = true;
  }

  return { enrollment, created };
};

const activateApprovedPayment = async (paymentId) => {
  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      const payment = await Payment.findById(paymentId).session(session);

      if (!payment || payment.isDeleted) {
        throw new Error("Payment not found");
      }

      if (payment.status === "rejected") {
        throw new Error("Rejected payment cannot be activated");
      }

      const wasApproved = payment.status === "approved";

      payment.status = "approved";
      payment.paidAt = payment.paidAt || new Date();

      await payment.save({ session });

      const { enrollment, created } =
        await createOrGetEnrollment(payment, session);

      const student = await User.findById(payment.student).session(session);
      const ambassadorId = payment.ambassador || student?.referredBy || null;

      if (ambassadorId) {
        await Referral.findOneAndUpdate(
          {
            ambassador: ambassadorId,
            student: payment.student,
            isDeleted: { $ne: true },
          },
          {
            $set: {
              enrolled: true,
              enrolledAt: new Date(),
              enrollment: enrollment._id,
              payment: payment._id,
              status: "Used",
            },
          },
          {
            session,
            new: true,
          }
        );

        if (created && !wasApproved) {
          const profile = await AmbassadorProfile.findOne({
            user: ambassadorId,
          }).session(session);

          if (profile) {
            profile.successfulReferrals =
              Number(profile.successfulReferrals || 0) + 1;

            profile.rewardPoints =
              Number(profile.rewardPoints || 0) + 100;

            await profile.save({ session });
          }
        }
      }

      result = { payment, enrollment };
    });

    return result;
  } finally {
    await session.endSession();
  }
};

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    if (getRole(req) !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only student accounts can create payment orders.",
      });
    }

    const student = getUserId(req);

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return res.status(503).json({
        success: false,
        message: "Online payments are not configured",
      });
    }

    const {
      type,
      course,
      internship,
      amount,
      originalAmount,
      discountAmount,
      finalAmount,
      referralCode = "",
    } = req.body || {};

    const productType =
      type || (course ? "course" : internship ? "internship" : "");

    if (!["course", "internship"].includes(productType)) {
      return res.status(400).json({
        success: false,
        message: "Select a valid course or internship",
      });
    }

    if (
      (productType === "course" && !isValidId(course)) ||
      (productType === "internship" && !isValidId(internship))
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid product ID is required",
      });
    }

    const product = await getProduct({
      type: productType,
      courseId: course,
      internshipId: internship,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Selected course or internship not found",
      });
    }

    if (productType === "course") {
      if (String(product.status || "active").toLowerCase() !== "active") {
        return res.status(400).json({
          success: false,
          message: "This course is not currently available.",
        });
      }

      if (product.registrationDeadline) {
        const deadline = new Date(product.registrationDeadline);
        deadline.setUTCHours(23, 59, 59, 999);

        if (deadline.getTime() < Date.now()) {
          return res.status(400).json({
            success: false,
            message: "Registration for this course has closed.",
          });
        }
      }
    }

    // Calculate payment from authoritative server-side product settings.
    const roundMoney = (value) =>
      Math.round((Number(value) + Number.EPSILON) * 100) / 100;

    const original = roundMoney(Math.max(0, Number(product.price) || 0));

    if (original <= 0) {
      return res.status(400).json({
        success: false,
        message: "Online payment amount must be greater than zero",
      });
    }

    const normalizedCode = String(referralCode || "").trim().toUpperCase();
    let ambassador = null;

    if (normalizedCode) {
      const owner = await User.findOne({
        referralCode: normalizedCode,
        role: "ambassador",
        ambassadorApproved: true,
        status: "active",
        isDeleted: { $ne: true },
      }).select("_id");

      if (!owner) {
        return res.status(400).json({
          success: false,
          message: "Invalid or inactive ambassador referral code.",
        });
      }

      ambassador = owner._id;
    } else {
      const studentUser = await User.findById(student).select("referredBy");

      if (studentUser?.referredBy) {
        const owner = await User.findOne({
          _id: studentUser.referredBy,
          role: "ambassador",
          ambassadorApproved: true,
          status: "active",
          isDeleted: { $ne: true },
        }).select("_id");

        ambassador = owner?._id || null;
      }
    }

    const discountType =
      product.studentReferralDiscountType === "fixed" ? "fixed" : "percent";
    const discountValue = Math.max(
      0,
      Number(product.studentReferralDiscountValue) || 0
    );

    const requestedDiscount =
      normalizedCode && product.studentReferralDiscountEnabled === true
        ? discountType === "fixed"
          ? discountValue
          : original * Math.min(discountValue, 100) / 100
        : 0;

    const discount = roundMoney(
      Math.min(Math.max(original - 1, 0), requestedDiscount)
    );
    const final = roundMoney(original - discount);

    if (!Number.isFinite(final) || final <= 0 || final > original) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const suppliedAmounts = [
      [amount, final],
      [originalAmount, original],
      [discountAmount, discount],
      [finalAmount, final],
    ];

    if (suppliedAmounts.some(([supplied, expected]) =>
      supplied != null &&
      (!Number.isFinite(Number(supplied)) ||
        Math.abs(Number(supplied) - expected) > 0.01)
    )) {
      return res.status(409).json({
        success: false,
        message: "The fee or referral discount has changed. Refresh checkout and try again.",
        originalAmount: original,
        discountAmount: discount,
        finalAmount: final,
      });
    }

    const commissionType =
      product.ambassadorCommissionType === "fixed" ? "fixed" : "percent";
    const commissionValue = Math.max(
      0,
      Number(product.ambassadorCommissionValue ?? 15) || 0
    );
    const commissionEnabled = product.ambassadorCommissionEnabled !== false;

    const calculatedCommission =
      commissionType === "fixed"
        ? commissionValue
        : final * Math.min(commissionValue, 100) / 100;

    const ambassadorCommissionAmount =
      ambassador && commissionEnabled
        ? roundMoney(Math.min(final, calculatedCommission))
        : 0;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(final * 100),
      currency: "INR",
      receipt: `sv_${Date.now()}`,
    });

    const payment = await Payment.create({
      student,
      type: productType,
      course: productType === "course" ? course : null,
      internship: productType === "internship" ? internship : null,
      originalAmount: original,
      discountAmount: discount,
      finalAmount: final,
      referralCode: normalizedCode,
      ambassador,
      studentReferralDiscountType: discountType,
      studentReferralDiscountValue: discountValue,
      ambassadorCommissionType: commissionType,
      ambassadorCommissionValue: commissionValue,
      ambassadorCommissionAmount,
      razorpayOrderId: order.id,
      paymentMode: "razorpay",
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      order,
      paymentId: payment._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return sendError(res, error, "Unable to create payment order");
  }
};

// Verify Razorpay payment
export const verifyPayment = async (req, res) => {
  try {
    if (getRole(req) !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only student accounts can verify payments.",
      });
    }

    const userId = getUserId(req);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
    } = req.body || {};

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !paymentId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        success: false,
        message: "Online payments are not configured",
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment || payment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (String(payment.student) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You cannot verify another user's payment",
      });
    }

    if (payment.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Order does not match this payment",
      });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest();

    let received;

    try {
      received = Buffer.from(razorpay_signature, "hex");
    } catch {
      received = Buffer.alloc(0);
    }

    if (
      received.length !== expected.length ||
      !crypto.timingSafeEqual(received, expected)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;

    await payment.save();

    const data = await activateApprovedPayment(payment._id);

    return res.json({
      success: true,
      message: "Payment verified successfully",
      data,
    });
  } catch (error) {
    return sendError(res, error, "Payment verification failed");
  }
};

// Manual payment submission
export const createManualPayment = async (req, res) => {
  try {
    if (getRole(req) !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only student accounts can submit manual payments.",
      });
    }

    const student = getUserId(req);

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      type,
      course,
      internship,
      originalAmount,
      discountAmount = 0,
      finalAmount,
      paymentMethod = "upi",
      transactionReference = "",
      paymentNote = "",
      referralCode = "",
    } = req.body || {};

    if (!["course", "internship"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Select a valid course or internship",
      });
    }

    if (
      (type === "course" && !isValidId(course)) ||
      (type === "internship" && !isValidId(internship))
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid course or internship is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Payment screenshot is required",
      });
    }

    const product = await getProduct({
      type,
      courseId: course,
      internshipId: internship,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Selected course or internship not found",
      });
    }


    const roundMoney = (value) =>
      Math.round((Number(value) + Number.EPSILON) * 100) / 100;

    // Authoritative product price and discount are calculated on the server.
    const original = roundMoney(Math.max(0, Number(product.price) || 0));

    if (original <= 0) {
      return res.status(400).json({
        success: false,
        message: "No manual payment is required for a free item.",
      });
    }

    const normalizedCode = String(referralCode || "").trim().toUpperCase();
    let ambassador = null;

    if (normalizedCode) {
      const owner = await User.findOne({
        referralCode: normalizedCode,
        role: "ambassador",
        ambassadorApproved: true,
        status: "active",
        isDeleted: { $ne: true },
      }).select("_id");

      if (!owner) {
        return res.status(400).json({
          success: false,
          message: "Invalid or inactive ambassador referral code.",
        });
      }

      ambassador = owner._id;
    } else {
      const studentUser = await User.findById(student).select("referredBy");
      ambassador = studentUser?.referredBy || null;
    }

    const discountType =
      product.studentReferralDiscountType === "fixed" ? "fixed" : "percent";
    const discountValue = Math.max(
      0,
      Number(product.studentReferralDiscountValue) || 0
    );

    let requestedDiscount = 0;
    if (normalizedCode && product.studentReferralDiscountEnabled === true) {
      requestedDiscount = discountType === "fixed"
        ? discountValue
        : original * Math.min(discountValue, 100) / 100;
    }

    // Manual payments must remain positive; cap discounts at the payable fee.
    const discount = roundMoney(
      Math.min(Math.max(original - 1, 0), requestedDiscount)
    );
    const final = roundMoney(original - discount);

    // Avoid accepting an amount different from the fee shown at checkout.
    if (
      (originalAmount != null &&
        (!Number.isFinite(Number(originalAmount)) ||
          Math.abs(Number(originalAmount) - original) > 0.01)) ||
      (discountAmount != null &&
        (!Number.isFinite(Number(discountAmount)) ||
          Math.abs(Number(discountAmount) - discount) > 0.01)) ||
      (finalAmount != null &&
        (!Number.isFinite(Number(finalAmount)) ||
          Math.abs(Number(finalAmount) - final) > 0.01))
    ) {
      return res.status(409).json({
        success: false,
        message: "The fee or referral discount has changed. Refresh checkout and apply the referral code again.",
        originalAmount: original,
        discountAmount: discount,
        finalAmount: final,
      });
    }

    const commissionType =
      product.ambassadorCommissionType === "fixed" ? "fixed" : "percent";
    const commissionValue = Math.max(
      0,
      Number(product.ambassadorCommissionValue ?? 15) || 0
    );
    const commissionEnabled = product.ambassadorCommissionEnabled !== false;

    const calculatedCommission = commissionType === "fixed"
      ? commissionValue
      : final * Math.min(commissionValue, 100) / 100;

    const ambassadorCommissionAmount = ambassador && commissionEnabled
      ? roundMoney(Math.min(final, calculatedCommission))
      : 0;

    const allowedMethods = [
      "upi",
      "bank_transfer",
      "card",
      "cash",
      "other",
    ];

    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    if (!String(transactionReference).trim()) {
      return res.status(400).json({
        success: false,
        message: "Transaction reference is required",
      });
    }

    const uploadedScreenshot = await uploadImageBuffer(req.file, {
      folder: "skilvira/payment-proofs",
    });
    const screenshot = uploadedScreenshot.secure_url;

    const payment = await Payment.create({
      student,
      type,
      course: type === "course" ? course : null,
      internship: type === "internship" ? internship : null,
      originalAmount: original,
      discountAmount: discount,
      finalAmount: final,
      referralCode: normalizedCode,
      ambassador,
      studentReferralDiscountType: discountType,
      studentReferralDiscountValue: discountValue,
      ambassadorCommissionType: commissionType,
      ambassadorCommissionValue: commissionValue,
      ambassadorCommissionAmount,
      paymentMethod,
      paymentMode: "manual",
      transactionReference: String(transactionReference).trim(),
      paymentNote: String(paymentNote || "").trim(),
      paymentScreenshot: screenshot,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Manual payment submitted for verification",
      payment,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.status ? error.message : "Unable to submit manual payment",
    });
  }
};

// Payments waiting for staff verification
export const getPendingPayments = async (req, res) => {
  try {
    if (!isStaff(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employees or control users can review payments",
      });
    }

    // Include legacy manual submissions too: older records may have
    // a missing/default paymentMode, but still contain UTR and screenshot.
    const payments = await Payment.find({
      status: "pending",
      isDeleted: { $ne: true },
      paymentScreenshot: { $exists: true, $nin: ["", null] },
      transactionReference: { $exists: true, $nin: ["", null] },
    })
      .populate("student", "name email")
      .populate("course", "title")
      .populate("internship", "title company")
      .sort({ createdAt: 1 });

    return res.json({
      success: true,
      payments,
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    return sendError(res, error, "Unable to load pending payments");
  }
};

// Logged-in student's payment history
export const getMyPayments = async (req, res) => {
  try {
    const student = getUserId(req);

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const payments = await Payment.find({
      student,
      isDeleted: { $ne: true },
    })
      .populate("course", "title")
      .populate("internship", "title company")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      payments,
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    return sendError(res, error, "Unable to load your payments");
  }
};

// Payment history for a specific student — staff only
export const getStudentPayments = async (req, res) => {
  try {
    if (!isStaff(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employees or control users can view another student's payment history",
      });
    }

    const { studentId } = req.params;

    if (!isValidId(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const payments = await Payment.find({
      student: studentId,
      isDeleted: { $ne: true },
    })
      .populate("course", "title")
      .populate("internship", "title company")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      payments,
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    return sendError(res, error, "Unable to load student payment history");
  }
};

// Get one payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

    const payment = await Payment.findOne({
      _id: id,
      isDeleted: { $ne: true },
    })
      .populate("student", "name email")
      .populate("course", "title")
      .populate("internship", "title company");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (
      !isStaff(req) &&
      String(payment.student?._id || payment.student) !==
        String(getUserId(req))
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot view this payment",
      });
    }

    return res.json({
      success: true,
      payment,
      data: payment,
    });
  } catch (error) {
    return sendError(res, error, "Unable to load payment details");
  }
};

export const getPaymentStatus = async (req, res) =>
  getPaymentById(req, res);

// Approve a manual payment and activate its enrollment
export const approveManualPayment = async (req, res) => {
  try {
    if (!isStaff(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employees or control users can approve payments",
      });
    }

    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

    const payment = await Payment.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status === "rejected") {
      return res.status(409).json({
        success: false,
        message: "Rejected payment cannot be approved",
      });
    }

    // Backward compatibility for older records created before
    // paymentMode was included in the Mongoose schema.
    const isLegacyManualPayment =
      !payment.paymentMode &&
      Boolean(String(payment.paymentScreenshot || "").trim()) &&
      Boolean(String(payment.transactionReference || "").trim());

    if (payment.paymentMode !== "manual" && !isLegacyManualPayment) {
      return res.status(400).json({
        success: false,
        message: "This endpoint is for manual payments only",
      });
    }

    if (isLegacyManualPayment) {
      payment.paymentMode = "manual";
    }

    payment.verifiedBy = getUserId(req);
    payment.verifiedAt = new Date();

    await payment.save();

    const data = await activateApprovedPayment(payment._id);

    return res.json({
      success: true,
      message: "Payment approved and enrollment activated",
      data,
    });
  } catch (error) {
    return sendError(res, error, "Unable to approve payment");
  }
};

// Reject a manual payment
export const rejectManualPayment = async (req, res) => {
  try {
    if (!isStaff(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employees or control users can reject payments",
      });
    }

    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

    const payment = await Payment.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status === "approved") {
      return res.status(409).json({
        success: false,
        message: "An approved payment cannot be rejected",
      });
    }

    payment.status = "rejected";
    payment.rejectionReason = String(
      req.body?.rejectionReason || ""
    ).trim();
    payment.verifiedBy = getUserId(req);
    payment.verifiedAt = new Date();

    await payment.save();

    return res.json({
      success: true,
      message: "Payment rejected",
      payment,
    });
  } catch (error) {
    return sendError(res, error, "Unable to reject payment");
  }
};

export const rejectPayment = rejectManualPayment;

export default {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  createManualPayment,
  getPendingPayments,
  getPaymentById,
  approveManualPayment,
  rejectManualPayment,
  rejectPayment,
  getStudentPayments,
  getMyPayments,
};