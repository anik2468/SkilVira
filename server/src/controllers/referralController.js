import User from "../models/User.js";
import Referral from "../models/Referral.js";
import AmbassadorProfile from "../models/AmbassadorProfile.js";
import Internship from "../models/Internship.js";
import Course from "../models/Course.js";

const FRONTEND_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173";

const normalizeCode = (code) =>
  String(code || "")
    .trim()
    .toUpperCase();

// ======================================
// Generate / Ensure Ambassador Code
// ======================================

export const generateReferralCode = async (
  req,
  res
) => {
  try {
    const ambassadorId =
      req.params.id;

    const ambassador =
      await User.findById(
        ambassadorId
      );

    if (!ambassador) {
      return res.status(404).json({
        success: false,
        message:
          "Ambassador not found.",
      });
    }

    if (
      ambassador.role !==
      "ambassador"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User is not an ambassador.",
      });
    }

    if (
      !ambassador.ambassadorApproved
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Ambassador is not approved yet.",
      });
    }

    let profile =
      await AmbassadorProfile.findOne({
        user: ambassador._id,
      });

    if (!profile) {
      profile =
        new AmbassadorProfile({
          user: ambassador._id,
        });

      await profile.save();
    }

    // Ensure User has same code.
    if (
      ambassador.referralCode !==
      profile.referralCode
    ) {
      ambassador.referralCode =
        profile.referralCode;

      await ambassador.save();
    }

    const referralLink =
      `${process.env.SERVER_PUBLIC_URL ||
        "http://localhost:5000"}/api/referrals/click/${profile.referralCode}`;

    return res.status(200).json({
      success: true,

      referralCode:
        profile.referralCode,

      referralLink,

      ambassadorId:
        ambassador._id,
    });
  } catch (error) {
    console.error(
      "GENERATE REFERRAL CODE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate referral code.",
    });
  }
};

// ======================================
// Track Referral Click
// ======================================

export const trackReferralClick = async (
  req,
  res
) => {
  try {
    const code =
      normalizeCode(
        req.params.code
      );

    if (!code) {
      return res.status(400).json({
        success: false,
        message:
          "Referral code is required.",
      });
    }

    const ambassador =
      await User.findOne({
        referralCode: code,
        role: "ambassador",
        ambassadorApproved: true,
        status: "active",
        isDeleted: {
          $ne: true,
        },
      });

    if (!ambassador) {
      return res.redirect(
        `${FRONTEND_URL}/register/student`
      );
    }

    await Referral.create({
      ambassador:
        ambassador._id,

      code,

      clicked: true,

      clickedAt: new Date(),

      status: "Active",
    });

    return res.redirect(
      `${FRONTEND_URL}/register/student?ref=${encodeURIComponent(
        code
      )}`
    );
  } catch (error) {
    console.error(
      "TRACK REFERRAL CLICK ERROR:",
      error
    );

    return res.redirect(
      `${FRONTEND_URL}/register/student`
    );
  }
};

// ======================================
// Validate Referral
// ======================================


export const validateReferral = async (req, res) => {
  try {
    const {
      code: rawCode,
      referralCode: alternateCode,
      type,
      courseId,
      internshipId,
    } = req.body || {};

    const normalizedCode = normalizeCode(rawCode || alternateCode);

    if (!normalizedCode) {
      return res.status(400).json({
        success: false,
        message: "Referral code is required.",
      });
    }

    const ambassador = await User.findOne({
      referralCode: normalizedCode,
      role: "ambassador",
      ambassadorApproved: true,
      status: "active",
      isDeleted: { $ne: true },
    });

    if (!ambassador) {
      return res.status(404).json({
        success: false,
        message: "Invalid or inactive ambassador referral code.",
      });
    }

    const productType = String(
      type || (courseId ? "course" : internshipId ? "internship" : "")
    ).toLowerCase();

    let product = null;

    if (productType === "course" && courseId) {
      product = await Course.findOne({
        _id: courseId,
        isDeleted: { $ne: true },
      });
    } else if (productType === "internship" && internshipId) {
      product = await Internship.findOne({
        _id: internshipId,
        isDeleted: { $ne: true },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Select a valid course or internship.",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Selected course or internship was not found.",
      });
    }

    const roundMoney = (value) =>
      Math.round((Number(value) + Number.EPSILON) * 100) / 100;

    const originalAmount = roundMoney(Math.max(0, Number(product.price) || 0));
    const discountType =
      product.studentReferralDiscountType === "fixed" ? "fixed" : "percent";
    const discountValue = Math.max(
      0,
      Number(product.studentReferralDiscountValue) || 0
    );

    let requestedDiscount = 0;

    if (product.studentReferralDiscountEnabled === true) {
      requestedDiscount = discountType === "fixed"
        ? discountValue
        : originalAmount * Math.min(discountValue, 100) / 100;
    }

    // Manual payment requires a positive payment amount.
    const discountAmount = roundMoney(
      Math.min(Math.max(originalAmount - 1, 0), requestedDiscount)
    );
    const finalAmount = roundMoney(originalAmount - discountAmount);

    return res.status(200).json({
      success: true,
      ambassadorId: ambassador._id,
      ambassadorName: ambassador.name,
      referralCode: normalizedCode,
      originalAmount,
      discountType,
      discountValue,
      discount: discountAmount,
      discountAmount,
      discountPercentage: discountType === "percent" ? discountValue : 0,
      finalAmount,
      message: discountAmount > 0
        ? "Referral applied successfully."
        : "Referral code is valid, but no student discount is enabled for this item.",
    });
  } catch (error) {
    console.error("VALIDATE REFERRAL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to validate referral code.",
    });
  }
};


// ======================================
// Get Referral Summary
// ======================================

export const getReferralSummary =
  async (req, res) => {
    try {
      const ambassadorId =
        req.params.userId;

      const ambassador =
        await User.findOne({
          _id: ambassadorId,
          role: "ambassador",
          isDeleted: {
            $ne: true,
          },
        });

      if (!ambassador) {
        return res.status(404).json({
          success: false,
          message:
            "Ambassador not found.",
        });
      }

      const profile =
        await AmbassadorProfile.findOne({
          user: ambassador._id,
        });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message:
            "Ambassador profile not found.",
        });
      }

      const [
        clicks,
        registrations,
        enrollmentEvents,
        certificateEvents,
      ] =
        await Promise.all([
          Referral.countDocuments({
            ambassador:
              ambassador._id,
            clicked: true,
            student: null,
            isDeleted: false,
          }),

          User.countDocuments({
            referredBy:
              ambassador._id,
            role: "student",
            isDeleted: {
              $ne: true,
            },
          }),

          Referral.countDocuments({
            ambassador:
              ambassador._id,
            enrolled: true,
            isDeleted: false,
          }),

          Referral.countDocuments({
            ambassador:
              ambassador._id,
            certificateIssued: true,
            isDeleted: false,
          }),
        ]);

      const referralLink =
        `${process.env.SERVER_PUBLIC_URL ||
          "http://localhost:5000"}/api/referrals/click/${profile.referralCode}`;

      return res.json({
        success: true,

        data: {
          referralCode:
            profile.referralCode,

          referralLink,

          analytics: {
            clicks,
            registrations,
            enrollments:
              enrollmentEvents,
            certificates:
              certificateEvents,
          },

          rewardPoints:
            profile.rewardPoints,

          rank: profile.rank,
        },
      });
    } catch (error) {
      console.error(
        "REFERRAL SUMMARY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch referral summary.",
      });
    }
  };