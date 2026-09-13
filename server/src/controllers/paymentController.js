import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";

import Payment from "../models/Payment.js";
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import AmbassadorProfile from "../models/AmbassadorProfile.js";

import OfferLetterTemplate from "../models/OfferLetterTemplate.js";
import GeneratedOfferLetter from "../models/GeneratedOfferLetter.js";

import {
  createNotification,
} from "../services/notificationService.js";


// =====================================================
// RAZORPAY
// KEPT FOR FUTURE / ONLINE PAYMENT
// =====================================================

const razorpay = new Razorpay({

  key_id:
    process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env.RAZORPAY_KEY_SECRET,

});


// =====================================================
// HELPER
// =====================================================

const getUserId = (req) => {

  return (
    req.user?.id ||
    req.user?._id ||
    req.user?.userId ||
    null
  );

};


// =====================================================
// GET ACTIVE OFFER LETTER TEMPLATE
// =====================================================

const findOfferLetterTemplate = async ({
  course,
  internship,
  session = null,
}) => {

  let template = null;


  // =========================================
  // INTERNSHIP SPECIFIC
  // =========================================

  if (internship) {

    let query =
      OfferLetterTemplate.findOne({

        internshipId:
          internship,

        isActive:
          true,

      }).sort({

        createdAt:
          -1,

      });


    if (session) {
      query = query.session(session);
    }


    template =
      await query;


    if (template) {
      return template;
    }

  }


  // =========================================
  // COURSE SPECIFIC
  // =========================================

  if (course) {

    let query =
      OfferLetterTemplate.findOne({

        courseId:
          course,

        isActive:
          true,

      }).sort({

        createdAt:
          -1,

      });


    if (session) {
      query = query.session(session);
    }


    template =
      await query;


    if (template) {
      return template;
    }

  }


  // =========================================
  // GENERIC INTERNSHIP
  // =========================================

  if (internship) {

    let query =
      OfferLetterTemplate.findOne({

        type:
          "internship",

        internshipId:
          null,

        isActive:
          true,

      }).sort({

        createdAt:
          -1,

      });


    if (session) {
      query = query.session(session);
    }


    template =
      await query;


    if (template) {
      return template;
    }

  }


  // =========================================
  // GENERIC COURSE
  // =========================================

  if (course) {

    let query =
      OfferLetterTemplate.findOne({

        type:
          "course",

        courseId:
          null,

        isActive:
          true,

      }).sort({

        createdAt:
          -1,

      });


    if (session) {
      query = query.session(session);
    }


    template =
      await query;


    if (template) {
      return template;
    }

  }


  return null;

};


// =====================================================
// CREATE OFFER LETTER AFTER PAYMENT APPROVAL
// =====================================================

const createOfferLetterForPayment = async ({
  payment,
  enrollment,
  session,
}) => {

  const template =
    await findOfferLetterTemplate({

      course:
        payment.course,

      internship:
        payment.internship,

      session,

    });


  // -----------------------------------------
  // No template
  // -----------------------------------------

  if (!template) {

    return {
      offer: null,
      templateMissing: true,
    };

  }


  // -----------------------------------------
  // Existing offer
  // -----------------------------------------

  let offer =
    await GeneratedOfferLetter.findOne({

      student:
        payment.student,

      course:
        payment.course || null,

      internship:
        payment.internship || null,

    }).session(session);


  if (!offer) {

    const student =
      await User.findById(
        payment.student
      )
        .select(
          "name email"
        )
        .session(session);


    let courseData = null;

    let internshipData = null;


    // ---------------------------------------
    // Course
    // ---------------------------------------

    if (payment.course) {

      courseData =
        await Course.findById(
          payment.course
        )
          .select(
            "title duration"
          )
          .session(session);

    }


    // ---------------------------------------
    // Internship
    // ---------------------------------------

    if (payment.internship) {

      internshipData =
        await Internship.findById(
          payment.internship
        )
          .select(
            "title company duration location workMode"
          )
          .session(session);

    }


    const offerId =
      `OFF-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()}`;


    const issueDate =
      new Date()
        .toISOString()
        .split("T")[0];


    offer =
      new GeneratedOfferLetter({

        student:
          payment.student,

        course:
          payment.course ||
          null,

        internship:
          payment.internship ||
          null,

        template:
          template._id,

        data: {

          studentName:
            student?.name || "",

          role:
            "",

          companyName:
            internshipData?.company || "",

          duration:
            internshipData?.duration ||
            courseData?.duration ||
            "",

          joiningDate:
            issueDate,

          endDate:
            "",

          stipend:
            "",

          location:
            internshipData?.location ||
            "",

          workMode:
            internshipData?.workMode ||
            "",

          offerId,

          issueDate,

          reportingManager:
            "",

        },

        status:
          "pending",

      });


    await offer.save({
      session,
    });

  }


  // -----------------------------------------
  // Link to enrollment
  // -----------------------------------------

  enrollment.offerLetter =
    offer._id;

  enrollment.offerLetterGenerated =
    true;


  await enrollment.save({
    session,
  });


  // -----------------------------------------
  // Link to payment
  // -----------------------------------------

  payment.offerLetter =
    offer._id;

  payment.offerLetterGenerated =
    true;


  await payment.save({
    session,
  });


  return {
    offer,
    templateMissing: false,
  };

};


// =====================================================
// COMMON PAYMENT APPROVAL PROCESS
// USED BY MANUAL + RAZORPAY
// =====================================================

const activateApprovedPayment = async ({
  paymentId,
  verifiedBy,
  session,
}) => {

  const payment =
    await Payment.findOne({

      _id:
        paymentId,

      isDeleted:
        false,

    }).session(session);


  if (!payment) {

    const error =
      new Error(
        "Payment not found."
      );

    error.statusCode =
      404;

    throw error;

  }


  if (
    payment.status ===
    "approved"
  ) {

    const error =
      new Error(
        "Payment is already approved."
      );

    error.statusCode =
      400;

    throw error;

  }


  if (
    payment.status ===
    "rejected"
  ) {

    const error =
      new Error(
        "Rejected payment cannot be approved directly."
      );

    error.statusCode =
      400;

    throw error;

  }


  // =========================================
  // ENROLLMENT
  // =========================================

  let enrollment =
    await Enrollment.findOne({

      student:
        payment.student,

      course:
        payment.course ||
        null,

      internship:
        payment.internship ||
        null,

      isDeleted:
        false,

    }).session(session);


  if (
    enrollment &&
    enrollment.status ===
      "Active"
  ) {

    const error =
      new Error(
        "Student is already enrolled in this program."
      );

    error.statusCode =
      409;

    throw error;

  }


  // =========================================
  // PAYMENT APPROVED
  // =========================================

  payment.status =
    "approved";

  payment.verifiedBy =
    verifiedBy;

  payment.verifiedAt =
    new Date();

  payment.rejectionReason =
    "";


  await payment.save({
    session,
  });


  // =========================================
  // ENROLLMENT CREATE / RESTORE
  // =========================================

  if (!enrollment) {

    enrollment =
      new Enrollment({

        student:
          payment.student,

        course:
          payment.course ||
          null,

        internship:
          payment.internship ||
          null,

        payment:
          payment._id,

        enrollmentDate:
          new Date(),

        startDate:
          new Date(),

        status:
          "Active",

        progress:
          0,

      });

  } else {

    enrollment.payment =
      payment._id;

    enrollment.status =
      "Active";

    enrollment.progress =
      0;

    enrollment.enrollmentDate =
      new Date();

    enrollment.startDate =
      new Date();

    enrollment.completionDate =
      null;

  }


  await enrollment.save({
    session,
  });


  // =========================================
  // INTERNSHIP APPLICATION
  // =========================================

  if (
    payment.type ===
    "internship"
  ) {

    const internship =
      await Internship.findById(
        payment.internship
      ).session(session);


    if (!internship) {

      const error =
        new Error(
          "Internship not found."
        );

      error.statusCode =
        404;

      throw error;

    }


    const existingApplication =
      await Application.findOne({

        student:
          payment.student,

        internship:
          payment.internship,

      }).session(session);


    if (!existingApplication) {

      const application =
        new Application({

          student:
            payment.student,

          internship:
            payment.internship,

          recruiter:
            internship.recruiter,

          resume:
            "Paid Internship",

          coverLetter:
            "Paid Internship Application",

          portfolio:
            "",

          status:
            "Pending",

        });


      await application.save({
        session,
      });


      internship.applicants =
        Number(
          internship.applicants || 0
        ) + 1;


      await internship.save({
        session,
      });

    }

  }


  // =========================================
  // OFFER LETTER
  // =========================================

  const offerResult =
    await createOfferLetterForPayment({

      payment,

      enrollment,

      session,

    });


  // =========================================
  // REFERRAL REWARD
  // =========================================

  if (
    payment.ambassador
  ) {

    const profile =
      await AmbassadorProfile.findOne({

        user:
          payment.ambassador,

      }).session(session);


    if (profile) {

      profile.successfulReferrals =
        Number(
          profile.successfulReferrals ||
          0
        ) + 1;


      profile.totalReferrals =
        Number(
          profile.totalReferrals ||
          0
        );


      profile.rewardPoints =
        Number(
          profile.rewardPoints ||
          0
        ) + 100;


      await profile.save({
        session,
      });

    }

  }


  return {

    payment,
    enrollment,

    offer:
      offerResult.offer,

    templateMissing:
      offerResult.templateMissing,

  };

};


// =====================================================
// RAZORPAY: CREATE ORDER
// KEPT FOR FUTURE ONLINE PAYMENTS
// =====================================================

export const createOrder = async (
  req,
  res
) => {

  try {

    const {

      student,

      type,

      course,

      internship,

      amount,

      referralCode,

    } = req.body;


    if (
      !student ||
      !type ||
      amount === undefined
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Required fields missing.",

      });

    }


    let finalAmount =
      Number(amount);


    let discountAmount =
      0;


    let ambassador =
      null;


    // =========================================
    // REFERRAL
    // =========================================

    if (
      referralCode
    ) {

      ambassador =
        await User.findOne({

          referralCode:
            referralCode
              .trim()
              .toUpperCase(),

          role:
            "ambassador",

          ambassadorApproved:
            true,

        });


      if (ambassador) {

        discountAmount =
          Math.round(
            finalAmount * 0.10
          );


        finalAmount =
          finalAmount -
          discountAmount;

      }

    }


    // =========================================
    // COURSE
    // =========================================

    if (
      type ===
      "course"
    ) {

      const courseData =
        await Course.findById(
          course
        );


      if (!courseData) {

        return res.status(404).json({

          success:
            false,

          message:
            "Course not found.",

        });

      }

    }


    // =========================================
    // INTERNSHIP
    // =========================================

    if (
      type ===
      "internship"
    ) {

      const internshipData =
        await Internship.findById(
          internship
        );


      if (!internshipData) {

        return res.status(404).json({

          success:
            false,

          message:
            "Internship not found.",

        });

      }

    }


    // =========================================
    // RAZORPAY ORDER
    // =========================================

    const order =
      await razorpay.orders.create({

        amount:
          Math.round(
            finalAmount * 100
          ),

        currency:
          "INR",

        receipt:
          `skilvira_${Date.now()}`,

      });


    // =========================================
    // SAVE PAYMENT
    // =========================================

    const payment =
      await Payment.create({

        student,

        type,

        course:
          type === "course"
            ? course
            : null,

        internship:
          type === "internship"
            ? internship
            : null,

        referralCode:
          referralCode
            ? referralCode
                .trim()
                .toUpperCase()
            : "",

        ambassador:
          ambassador?._id ||
          null,

        originalAmount:
          Number(amount),

        discountAmount,

        finalAmount,

        razorpayOrderId:
          order.id,

        status:
          "pending",

      });


    return res.status(200).json({

      success:
        true,

      order,

      paymentId:
        payment._id,

      discountAmount,

      finalAmount,

    });

  } catch (error) {

    console.error(
      "RAZORPAY CREATE ORDER ERROR:",
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        error.message,

    });

  }

};


// =====================================================
// RAZORPAY: VERIFY PAYMENT
// =====================================================

export const verifyPayment = async (
  req,
  res
) => {

  const session =
    await mongoose.startSession();


  try {

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

      paymentId,

    } = req.body;


    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;


    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");


    if (
      expectedSignature !==
      razorpay_signature
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Payment verification failed.",

      });

    }


    let result = null;


    await session.withTransaction(
      async () => {

        const payment =
          await Payment.findById(
            paymentId
          ).session(session);


        if (!payment) {

          const error =
            new Error(
              "Payment not found."
            );

          error.statusCode =
            404;

          throw error;

        }


        payment.razorpayPaymentId =
          razorpay_payment_id;

        payment.razorpaySignature =
          razorpay_signature;


        await payment.save({
          session,
        });


        result =
          await activateApprovedPayment({

            paymentId,

            verifiedBy:
              getUserId(req),

            session,

          });

      }
    );


    await notifyOfferLetterReview(
      result
    );


    return res.status(200).json({

      success:
        true,

      message:
        result.templateMissing

          ? "Payment verified and enrollment activated, but offer letter template is missing."

          : "Payment verified, enrollment activated and offer letter sent for employee review.",

      payment:
        result.payment,

      enrollment:
        result.enrollment,

      offerLetterId:
        result.offer?._id ||
        null,

      templateMissing:
        result.templateMissing,

    });

  } catch (error) {

    console.error(
      "RAZORPAY VERIFY ERROR:",
      error
    );


    return res.status(
      error.statusCode ||
      500
    ).json({

      success:
        false,

      message:
        error.message,

    });

  } finally {

    await session.endSession();

  }

};


// =====================================================
// MANUAL PAYMENT SUBMIT
// STUDENT
// =====================================================

export const createManualPayment = async (
  req,
  res
) => {

  try {

    const studentId =
      getUserId(req);


    if (!studentId) {

      return res.status(401).json({

        success:
          false,

        message:
          "Authentication required.",

      });

    }


    const {

      type,

      course,

      internship,

      originalAmount,

      discountAmount,

      finalAmount,

      paymentMethod,

      transactionReference,

      paymentNote,

      referralCode,

    } = req.body;


    if (
      !["course", "internship"].includes(type)
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Invalid payment type.",

      });

    }


    let item = null;


    // =========================================
    // ITEM
    // =========================================

    if (
      type ===
      "course"
    ) {

      if (!course) {

        return res.status(400).json({

          success:
            false,

          message:
            "Course is required.",

        });

      }


      item =
        await Course.findOne({

          _id:
            course,

          isDeleted: {
            $ne: true,
          },

        });


    } else {

      if (!internship) {

        return res.status(400).json({

          success:
            false,

          message:
            "Internship is required.",

        });

      }


      item =
        await Internship.findOne({

          _id:
            internship,

          isDeleted: {
            $ne: true,
          },

        });

    }


    if (!item) {

      return res.status(404).json({

        success:
          false,

        message:
          `${type === "course" ? "Course" : "Internship"} not found.`,

      });

    }


    // =========================================
    // AMOUNT
    // =========================================

    const original =
      Number(originalAmount);


    if (
      !Number.isFinite(original)
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Invalid original amount.",

      });

    }


    const actualPrice =
      Number(
        item.price || 0
      );


    if (
      Math.abs(
        original -
        actualPrice
      ) > 0.01
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Invalid program amount.",

      });

    }


    // =========================================
    // REFERRAL
    // =========================================

    let ambassador =
      null;


    let serverDiscount =
      0;


    if (
      referralCode &&
      referralCode.trim()
    ) {

      ambassador =
        await User.findOne({

          referralCode:
            referralCode
              .trim()
              .toUpperCase(),

          role:
            "ambassador",

          ambassadorApproved:
            true,

        });


      if (ambassador) {

        serverDiscount =
          Math.round(
            original * 0.10
          );

      }

    }


    const serverFinal =
      Math.max(
        original -
        serverDiscount,
        0
      );


    // =========================================
    // VALIDATE CLIENT VALUES
    // =========================================

    if (
      Math.abs(
        Number(discountAmount || 0) -
        serverDiscount
      ) > 0.01
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Invalid referral discount.",

      });

    }


    if (
      Math.abs(
        Number(finalAmount) -
        serverFinal
      ) > 0.01
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Invalid final amount.",

      });

    }


    // =========================================
    // TRANSACTION REFERENCE
    // =========================================

    if (
      !transactionReference ||
      !transactionReference.trim()
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Transaction ID is required.",

      });

    }


    // =========================================
    // SCREENSHOT
    // =========================================

    if (!req.file) {

      return res.status(400).json({

        success:
          false,

        message:
          "Payment screenshot is required.",

      });

    }


    // =========================================
    // DUPLICATE PENDING
    // =========================================

    const duplicate =
      await Payment.findOne({

        student:
          studentId,

        course:
          type === "course"
            ? course
            : null,

        internship:
          type === "internship"
            ? internship
            : null,

        status:
          "pending",

        isDeleted:
          false,

      });


    if (duplicate) {

      return res.status(409).json({

        success:
          false,

        message:
          "Payment for this program is already under verification.",

      });

    }


    // =========================================
    // ALREADY ENROLLED
    // =========================================

    const enrolled =
      await Enrollment.findOne({

        student:
          studentId,

        course:
          type === "course"
            ? course
            : null,

        internship:
          type === "internship"
            ? internship
            : null,

        status: {
          $in: [
            "Active",
            "Completed",
          ],
        },

        isDeleted:
          false,

      });


    if (enrolled) {

      return res.status(409).json({

        success:
          false,

        message:
          "You are already enrolled in this program.",

      });

    }


    // =========================================
    // SCREENSHOT PATH
    // =========================================

    const screenshotPath =
      `/uploads/payments/${req.file.filename}`;


    // =========================================
    // CREATE PAYMENT
    // =========================================

    const payment =
      await Payment.create({

        student:
          studentId,

        type,

        course:
          type === "course"
            ? course
            : null,

        internship:
          type === "internship"
            ? internship
            : null,

        originalAmount:
          original,

        discountAmount:
          serverDiscount,

        finalAmount:
          serverFinal,

        referralCode:
          ambassador
            ? referralCode
                .trim()
                .toUpperCase()
            : "",

        ambassador:
          ambassador?._id ||
          null,

        paymentMethod:
          paymentMethod ||
          "upi",

        paymentScreenshot:
          screenshotPath,

        transactionReference:
          transactionReference.trim(),

        paymentNote:
          paymentNote?.trim() ||
          "",

        status:
          "pending",

        isDeleted:
          false,

      });


    // =========================================
    // STAFF NOTIFICATION
    // =========================================

    await notifyStaffPayment(
      payment,
      studentId,
      item.title ||
        "Program"
    );


    return res.status(201).json({

      success:
        true,

      message:
        "Payment submitted successfully and is waiting for verification.",

      payment,

    });

  } catch (error) {

    console.error(
      "MANUAL PAYMENT ERROR:",
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        error.message ||

        "Failed to submit payment.",

    });

  }

};


// =====================================================
// APPROVE MANUAL PAYMENT
// =====================================================

export const approveManualPayment = async (
  req,
  res
) => {

  const session =
    await mongoose.startSession();


  try {

    let result = null;


    await session.withTransaction(
      async () => {

        result =
          await activateApprovedPayment({

            paymentId:
              req.params.id,

            verifiedBy:
              getUserId(req),

            session,

          });

      }
    );


    await notifyOfferLetterReview(
      result
    );


    return res.status(200).json({

      success:
        true,

      message:
        result.templateMissing

          ? "Payment approved and enrollment activated, but no offer letter template is assigned."

          : "Payment approved, enrollment activated and offer letter sent for employee review.",

      payment:
        result.payment,

      enrollment:
        result.enrollment,

      offerLetterId:
        result.offer?._id ||
        null,

      templateMissing:
        result.templateMissing,

    });

  } catch (error) {

    console.error(
      "APPROVE MANUAL PAYMENT ERROR:",
      error
    );


    return res.status(
      error.statusCode ||
      500
    ).json({

      success:
        false,

      message:
        error.message ||

        "Failed to approve payment.",

    });

  } finally {

    await session.endSession();

  }

};


// =====================================================
// REJECT MANUAL PAYMENT
// =====================================================

export const rejectManualPayment = async (
  req,
  res
) => {

  try {

    const payment =
      await Payment.findOne({

        _id:
          req.params.id,

        isDeleted:
          false,

      });


    if (!payment) {

      return res.status(404).json({

        success:
          false,

        message:
          "Payment not found.",

      });

    }


    if (
      payment.status ===
      "approved"
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          "Approved payment cannot be rejected.",

      });

    }


    const reason =
      req.body.reason?.trim();


    if (!reason) {

      return res.status(400).json({

        success:
          false,

        message:
          "Rejection reason is required.",

      });

    }


    payment.status =
      "rejected";


    payment.rejectionReason =
      reason;


    payment.verifiedBy =
      getUserId(req);


    payment.verifiedAt =
      new Date();


    await payment.save();


    try {

      await createNotification({

        recipient:
          payment.student,

        type:
          "payment",

        title:
          "Payment Rejected",

        message:
          `Your payment was rejected. Reason: ${reason}`,

        referenceId:
          payment._id,

        referenceModel:
          "Payment",

        link:
          "/student/payments",

      });

    } catch (notificationError) {

      console.error(
        "PAYMENT REJECTION NOTIFICATION ERROR:",
        notificationError
      );

    }


    return res.status(200).json({

      success:
        true,

      message:
        "Payment rejected successfully.",

      payment,

    });

  } catch (error) {

    console.error(
      "REJECT PAYMENT ERROR:",
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        error.message ||

        "Failed to reject payment.",

    });

  }

};


// =====================================================
// GET PENDING PAYMENTS
// =====================================================

export const getPendingPayments = async (
  req,
  res
) => {

  try {

    const payments =
      await Payment.find({

        status:
          "pending",

        isDeleted:
          false,

      })

        .populate(
          "student",
          "name email avatar"
        )

        .populate(
          "course",
          "title price thumbnail"
        )

        .populate(
          "internship",
          "title company price internshipImage"
        )

        .populate(
          "ambassador",
          "name email referralCode"
        )

        .populate(
          "verifiedBy",
          "name email"
        )

        .sort({

          createdAt:
            -1,

        });


    return res.status(200).json({

      success:
        true,

      count:
        payments.length,

      payments,

    });

  } catch (error) {

    console.error(
      "GET PENDING PAYMENTS ERROR:",
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        "Failed to fetch pending payments.",

      error:
        error.message,

    });

  }

};


// =====================================================
// GET SINGLE PAYMENT
// =====================================================

export const getPaymentById = async (
  req,
  res
) => {

  try {

    const payment =
      await Payment.findOne({

        _id:
          req.params.id,

        isDeleted:
          false,

      })

        .populate(
          "student",
          "name email avatar"
        )

        .populate(
          "course"
        )

        .populate(
          "internship"
        )

        .populate(
          "ambassador",
          "name email referralCode"
        )

        .populate(
          "verifiedBy",
          "name email"
        );


    if (!payment) {

      return res.status(404).json({

        success:
          false,

        message:
          "Payment not found.",

      });

    }


    return res.status(200).json({

      success:
        true,

      payment,

    });

  } catch (error) {

    console.error(
      "GET PAYMENT ERROR:",
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        "Failed to fetch payment.",

      error:
        error.message,

    });

  }

};


// =====================================================
// STUDENT PAYMENT HISTORY
// =====================================================

export const getStudentPayments = async (
  req,
  res
) => {

  try {

    const payments =
      await Payment.find({

        student:
          req.params.studentId,

        isDeleted:
          false,

      })

        .populate("course")

        .populate("internship")

        .populate("offerLetter")

        .sort({

          createdAt:
            -1,

        });


    return res.json({

      success:
        true,

      payments,

    });

  } catch (error) {

    console.error(
      "GET STUDENT PAYMENTS ERROR:",
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        error.message,

    });

  }

};


// =====================================================
// MY PAYMENTS
// =====================================================

export const getMyPayments = async (
  req,
  res
) => {

  try {

    const studentId =
      getUserId(req);


    if (!studentId) {

      return res.status(401).json({

        success:
          false,

        message:
          "Authentication required.",

      });

    }


    const payments =
      await Payment.find({

        student:
          studentId,

        isDeleted:
          false,

      })

        .populate(
          "course",
          "title price thumbnail"
        )

        .populate(
          "internship",
          "title company price internshipImage"
        )

        .populate(
          "offerLetter"
        )

        .sort({

          createdAt:
            -1,

        });


    return res.status(200).json({

      success:
        true,

      count:
        payments.length,

      payments,

    });

  } catch (error) {

    console.error(
      "GET MY PAYMENTS ERROR:",
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        "Failed to fetch payment history.",

      error:
        error.message,

    });

  }

};


// =====================================================
// NOTIFY STAFF ABOUT PAYMENT
// =====================================================

const notifyStaffPayment = async (
  payment,
  studentId,
  programName
) => {

  try {

    const student =
      await User.findById(
        studentId
      ).select(
        "name"
      );


    const staff =
      await User.find({

        role: {
          $in: [
            "employee",
            "control",
          ],
        },

        isDeleted: {
          $ne: true,
        },

      }).select(
        "_id"
      );


    for (
      const person
      of staff
    ) {

      try {

        await createNotification({

          recipient:
            person._id,

          type:
            "payment",

          title:
            "New Payment Verification",

          message:
            `${student?.name || "A student"} submitted payment for ${programName}. Please verify the screenshot and transaction ID.`,

          referenceId:
            payment._id,

          referenceModel:
            "Payment",

          link:
            "/employee/payments",

        });

      } catch (notificationError) {

        console.error(
          "STAFF PAYMENT NOTIFICATION ERROR:",
          notificationError
        );

      }

    }

  } catch (error) {

    console.error(
      "NOTIFY STAFF ERROR:",
      error
    );

  }

};


// =====================================================
// NOTIFY STAFF ABOUT OFFER LETTER
// =====================================================

const notifyOfferLetterReview = async (
  result
) => {

  try {

    const payment =
      result.payment;


    if (
      !payment ||
      !result.offer
    ) {

      return;

    }


    const student =
      await User.findById(
        payment.student
      ).select(
        "name"
      );


    const program =
      payment.course ||
      payment.internship;


    const staff =
      await User.find({

        role: {
          $in: [
            "employee",
            "control",
          ],
        },

        isDeleted: {
          $ne: true,
        },

      }).select(
        "_id"
      );


    for (
      const person
      of staff
    ) {

      try {

        await createNotification({

          recipient:
            person._id,

          type:
            "offer_letter",

          title:
            "Offer Letter Review Required",

          message:
            `Offer letter for ${student?.name || "student"} is ready for review.`,

          referenceId:
            result.offer._id,

          referenceModel:
            "GeneratedOfferLetter",

          link:
            "/employee/offer-letters",

        });

      } catch (notificationError) {

        console.error(
          "OFFER LETTER NOTIFICATION ERROR:",
          notificationError
        );

      }

    }

  } catch (error) {

    console.error(
      "OFFER LETTER REVIEW NOTIFICATION ERROR:",
      error
    );

  }

};