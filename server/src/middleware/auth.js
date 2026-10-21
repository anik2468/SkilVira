import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";

const isValidId = (id) =>
  mongoose.Types.ObjectId.isValid(String(id || ""));

const auth = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const userId =
      decoded.id || decoded._id || decoded.userId;

    if (!isValidId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // Read the current user record so blocking/removal takes effect
    // even if an older JWT is still within its expiration period.
    const user = await User.findById(userId).select(
      "_id name email role status isDeleted"
    );

    if (
      !user ||
      user.isDeleted ||
      ["blocked", "deleted", "inactive"].includes(
        String(user.status || "").toLowerCase()
      )
    ) {
      return res.status(401).json({
        success: false,
        message: "This account is inactive or has been disabled.",
      });
    }

    req.user = {
      ...decoded,
      id: String(user._id),
      _id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const role = String(user.role || "").toLowerCase();
    const method = req.method.toUpperCase();
    const path = String(req.originalUrl || req.path)
      .split("?")[0]
      .slice(0, 500);

    // Record employee mutations plus meaningful section reads.
    // Skip frequent dashboard/notification polling to reduce noise.
    const mutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

    const meaningfulRead =
      method === "GET" &&
      !/\/dashboard(?:\/|$)/i.test(path) &&
      !/\/notifications(?:\/|$)/i.test(path) &&
      !/\/profile(?:\/|$)/i.test(path);

    if (
      ["employee", "control", "admin", "superadmin", "super_admin"].includes(role) &&
      (mutation || meaningfulRead)
    ) {
      const actorId = user._id;
      const ip = String(req.ip || "").slice(0, 100);
      const userAgent = String(
        req.headers["user-agent"] || ""
      ).slice(0, 500);

      const body = req.body && typeof req.body === "object" ? req.body : {};
      const safeKeys = Object.keys(body).filter(
        (key) => !/password|token|secret|signature|otp|screenshot|authorization|cookie|proof|document|image|file/i.test(key)
      ).slice(0, 30);
      const submittedValues = {};
      for (const key of safeKeys) {
        const value = body[key];
        if (value == null || ["string", "number", "boolean"].includes(typeof value)) {
          submittedValues[key] = typeof value === "string" ? value.slice(0, 200) : value;
        } else if (Array.isArray(value)) {
          submittedValues[key] = `[${value.length} item(s)]`;
        } else {
          submittedValues[key] = "[object]";
        }
      }

      const match = path.match(/\/(courses|internships|company-settings|payments?)(?:\/([a-f\d]{24}))?/i);
      const key = match?.[1]?.toLowerCase() || "";
      const entityId = match?.[2] || "";
      const entityType = {
        courses: "Course",
        internships: "Internship",
        "company-settings": "Company settings",
        payment: "Payment",
        payments: "Payment",
      }[key] || "";
      const lowerPath = path.toLowerCase();
      const referralChange = safeKeys.some(
        (name) => /studentReferralDiscount|ambassadorCommission/i.test(name)
      ) || lowerPath.includes("referral-settings");

      let action = `${method} ${path}`;
      if (referralChange) {
        action = "Referral discount/commission settings updated";
      } else if (key === "company-settings") {
        action = "Company contact settings updated";
      } else if (key === "courses") {
        if (/publish/i.test(lowerPath) || body.isPublished === true ||
            ["published", "live"].includes(String(body.status || "").toLowerCase())) {
          action = "Course published";
        } else if (method === "POST" && !entityId) action = "Course created";
        else if (method === "DELETE") action = "Course deleted";
        else if (method === "GET") action = "Course details viewed";
        else action = "Course updated";
      } else if (key === "internships") {
        if (/publish/i.test(lowerPath) || body.isPublished === true ||
            ["published", "live"].includes(String(body.status || "").toLowerCase())) {
          action = "Internship launched/published";
        } else if (method === "POST" && !entityId) action = "Internship created";
        else if (method === "DELETE") action = "Internship deleted";
        else if (method === "GET") action = "Internship details viewed";
        else action = "Internship updated";
      } else if (/payment/i.test(lowerPath) && /approve/i.test(lowerPath)) {
        action = "Payment approved";
      }

      res.once("finish", () => {
        ActivityLog.create({
          actor: actorId,
          actorRole: role,
          action,
          entityType,
          entityId,
          details: { changedFields: safeKeys, submittedValues },
          method,
          path,
          statusCode: res.statusCode,
          success: res.statusCode < 400,
          ip,
          userAgent,
        }).catch((error) => {
          // An audit-log failure must not break the main API response.
          console.error("EMPLOYEE ACTIVITY LOG ERROR:", error.message);
        });
      });
    }

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token has expired. Please log in again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    console.error("AUTH MIDDLEWARE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication could not be verified.",
    });
  }
};

export default auth;