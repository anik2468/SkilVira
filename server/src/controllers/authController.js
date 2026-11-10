import { isStrongPassword, PASSWORD_REQUIREMENT_MESSAGE } from "../utils/passwordPolicy.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import { sendPasswordResetEmail } from "../services/emailService.js";

import StudentProfile from "../models/StudentProfile.js";
import RecruiterProfile from "../models/RecruiterProfile.js";
import EmployeeProfile from "../models/EmployeeProfile.js";
import AmbassadorProfile from "../models/AmbassadorProfile.js";


// ========================================
// HELPERS
// ========================================

const normalizeReferralCode = (code) => {
  return String(code || "")
    .trim()
    .toUpperCase();
};


// ========================================
// REGISTER
// ========================================

export const register = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
      role,
      referralCode,
      phone,
      designation,
      department,
      companyName,
      website,
      industry,
      college,
      university,
      course,
      branch,
      semester,
      graduationYear,
      city,
      state,
    } = req.body;


    // ========================================
    // VALIDATION
    // ========================================

    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }


    // ========================================
    // ALLOWED ROLES
    // ========================================

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: PASSWORD_REQUIREMENT_MESSAGE,
      });
    }

    const allowedRoles = [
      "student",
      "recruiter",
      "ambassador",
      "employee",
    ];


    if (
      !allowedRoles.includes(role)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Registration not allowed.",
      });
    }


    const requiredProfileFields = {
      recruiter: [companyName, designation, phone],
      employee: [designation, department, phone],
      ambassador: [college, course, branch, semester, phone],
    }[role] || [];

    if (requiredProfileFields.some(
      (value) => !String(value || "").trim()
    )) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required registration details.",
      });
    }

    // ========================================
    // NORMALIZE EMAIL
    // ========================================

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();


    // ========================================
    // EXISTING USER
    // ========================================

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });


    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email already registered.",
      });
    }


    // ========================================
    // REFERRAL
    // ========================================

    let referredBy = null;

    if (
      role === "student" &&
      referralCode
    ) {
      const normalizedCode =
        normalizeReferralCode(
          referralCode
        );


      if (normalizedCode) {
        const ambassador =
          await User.findOne({
            referralCode:
              normalizedCode,

            role: "ambassador",

            ambassadorApproved: true,

            status: "active",

            isDeleted: {
              $ne: true,
            },
          });


        if (ambassador) {
          referredBy =
            ambassador._id;
        }
      }
    }


    // ========================================
    // PASSWORD
    // ========================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // ========================================
    // CREATE USER
    //
    // Referral registration tracking is
    // handled by User.js post-save hook.
    // ========================================

    const user =
      await User.create({
        name:
          name.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        role,

        referredBy,


        // Recruiter approval
        recruiterApproved:
          role === "recruiter"
            ? false
            : true,


        // Ambassador approval
        ambassadorApproved:
          role === "ambassador"
            ? false
            : true,


        companyVerified:
          false,

        emailVerified:
          false,

        phoneVerified:
          false,

        // Public employee applications require admin approval.
        status: role === "employee" ? "inactive" : "active",

        authProvider:
          "local",
      });


    // ========================================
    // STUDENT PROFILE
    // ========================================

    if (
      role === "student"
    ) {
      await StudentProfile.create({
        user:
          user._id,

        degree:
          "B.Tech",

        country:
          "India",

        profileCompleted:
          5,
      });
    }


    // ========================================
    // RECRUITER PROFILE
    // ========================================

    if (
      role === "recruiter"
    ) {
      await RecruiterProfile.create({
        user: user._id,
        companyName: String(companyName || "").trim(),
        website: String(website || "").trim(),
        industry: String(industry || "").trim(),
        headquarters: [city, state]
          .map((value) => String(value || "").trim())
          .filter(Boolean)
          .join(", "),
        phone: String(phone || "").trim(),
        email: normalizedEmail,
        hrName: name.trim(),
        hrDesignation: String(designation || "").trim(),
        profileCompleted: 20,
      });
    }


    // ========================================
    // EMPLOYEE PROFILE
    // ========================================

    if (
      role === "employee"
    ) {
      await EmployeeProfile.create({
        user: user._id,
        designation: String(designation || "").trim(),
        department: String(department || "").trim(),
        phone: String(phone || "").trim(),
        officeEmail: normalizedEmail,
        isActive: false,
        profileCompleted: 10,
      });
    }


    // ========================================
    // AMBASSADOR PROFILE
    // ========================================

    if (
      role === "ambassador"
    ) {
      const ambassadorReferralCode =
        "SKIL" +
        user._id
          .toString()
          .slice(-6)
          .toUpperCase();


      await AmbassadorProfile.create({
        user: user._id,
        referralCode: ambassadorReferralCode,
        college: String(college || "").trim(),
        university: String(university || "").trim(),
        phone: String(phone || "").trim(),
        city: String(city || "").trim(),
        state: String(state || "").trim(),
        course: String(course || "").trim(),
        branch: String(branch || "").trim(),
        semester: String(semester || "").trim(),
        graduationYear: String(graduationYear || "").trim(),
        totalReferrals: 0,
        successfulReferrals: 0,
        rewardPoints: 0,
        rank: 0,
        profileCompleted: 20,
      });


      user.referralCode =
        ambassadorReferralCode;


      await user.save();
    }


    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({
      success: true,

      message:
        role === "recruiter" ||
        role === "ambassador" ||
        role === "employee"
          ? `${role} registered successfully. Waiting for approval.`
          : "Registration successful.",

      user: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        referredBy:
          user.referredBy ||
          null,
      },
    });

  } catch (error) {
    console.error(
      "Register Error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Registration failed.",
    });
  }
};


// ========================================
// LOGIN
// ========================================

export const login = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;


    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }


    const user =
      await User.findOne({
        email:
          email
            .trim()
            .toLowerCase(),
      });


    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }


    if (
      user.isDeleted ||
      ["blocked", "deleted", "inactive"].includes(
        String(user.status || "").toLowerCase()
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "This account is inactive or has been disabled.",
      });
    }

    // ========================================
    // RECRUITER APPROVAL
    // ========================================

    if (
      user.role === "recruiter" &&
      !user.recruiterApproved
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Recruiter account under review.",
      });
    }


    // ========================================
    // AMBASSADOR APPROVAL
    // ========================================

    if (
      user.role === "ambassador" &&
      !user.ambassadorApproved
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Ambassador account under review.",
      });
    }


    // ========================================
    // PASSWORD
    // ========================================

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message:
          "Password login is not available for this account.",
      });
    }


    const matched =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!matched) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }


    // ========================================
    // JWT
    // ========================================

    const token =
      jwt.sign(
        {
          id:
            user._id,

          role:
            user.role,
        },

        process.env.JWT_SECRET,

        {
          expiresIn:
            "7d",
        }
      );


    // ========================================
    // ACTIVITY
    // ========================================

    user.lastLogin =
      new Date();

    user.lastActive =
      new Date();

    user.refreshToken =
      token;


    await user.save();

    if (user.role === "employee") {
      try {
        await ActivityLog.create({
          actor: user._id,
          actorRole: "employee",
          action: "LOGIN_SUCCESS",
          method: "POST",
          path: "/api/auth/login",
          statusCode: 200,
          success: true,
          ip: String(req.ip || "").slice(0, 100),
          userAgent: String(
            req.headers["user-agent"] || ""
          ).slice(0, 500),
        });
      } catch (activityError) {
        console.error(
          "EMPLOYEE LOGIN ACTIVITY LOG ERROR:",
          activityError.message
        );
      }
    }



    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      message:
        "Login successful.",

      token,

      user: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        referralCode:
          user.referralCode ||
          null,
      },
    });

  } catch (error) {
    console.error(
      "Login Error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Login failed.",
    });
  }
};


// ===================================
export const forgotPassword = async (req, res) => {
  const genericResponse = {
    success: true,
    message:
      "If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder.",
  };

  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    if (!email || email.length > 254) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Use FRONTEND_URL first; retain CLIENT_URL compatibility.
    const configuredFrontendUrl =
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      (process.env.NODE_ENV !== "production"
        ? "http://localhost:5173"
        : "");

    if (!configuredFrontendUrl) {
      throw new Error("FRONTEND_URL is not configured.");
    }

    const frontend = new URL(configuredFrontendUrl);

    if (
      process.env.NODE_ENV === "production" &&
      frontend.protocol !== "https:"
    ) {
      throw new Error("Production FRONTEND_URL must use HTTPS.");
    }

    if (frontend.search || frontend.hash) {
      throw new Error("FRONTEND_URL must not contain query or fragment.");
    }

    const frontendBase =
      `${frontend.origin}${frontend.pathname}`.replace(/\/+$/, "");

    // No role restriction: all eligible User roles use this flow.
    const user = await User.findOne({
      email,
      isDeleted: { $ne: true },
    });

    // Same response for unknown email addresses.
    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire =
      new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetURL =
      `${frontendBase}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        resetURL,
      });
    } catch (mailError) {
      // Invalidate the token if delivery fails.
      user.resetPasswordToken = "";
      user.resetPasswordExpire = undefined;

      try {
        await user.save();
      } catch (cleanupError) {
        console.error(
          "Password reset token cleanup failed:",
          cleanupError.message
        );
      }

      console.error(
        "Password reset email delivery failed:",
        mailError.message
      );
    }

    // Never expose the raw reset token or reset URL in the API response.
    return res.status(200).json(genericResponse);

  } catch (error) {
    console.error("Forgot Password Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset right now. Please try again later.",
    });
  }
};
// ========================================
// RESET PASSWORD
// ========================================

export const resetPassword = async (
  req,
  res
) => {
  try {
    const hashedToken =
      crypto
        .createHash("sha256")
        .update(
          req.params.token
        )
        .digest("hex");


    const user =
      await User.findOne({
        resetPasswordToken:
          hashedToken,

        resetPasswordExpire: {
          $gt:
            Date.now(),
        },
      });


    if (!user) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid or expired token.",
      });
    }


    const {
      password,
    } = req.body;


    if (!password) {
      return res.status(400).json({
        success: false,

        message:
          "Password required.",
      });
    }


    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: PASSWORD_REQUIREMENT_MESSAGE,
      });
    }

    user.password =
      await bcrypt.hash(
        password,
        10
      );


    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpire =
      undefined;


    await user.save();


    return res.status(200).json({
      success: true,

      message:
        "Password reset successful.",
    });

  } catch (error) {
    console.error(
      "Reset Password Error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to reset password.",
    });
  }
};