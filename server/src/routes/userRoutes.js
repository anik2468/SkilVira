import express from "express";
import mongoose from "mongoose";

import auth from "../middleware/auth.js";
import User from "../models/User.js";

import {
  getAllUsers,
  getPendingRecruiters,
  approveRecruiter,
  rejectRecruiter,
  blockUser,
  unblockUser,
  deleteUser,
  updateAvatar,
} from "../controllers/userController.js";

const router = express.Router();

const getRole = (req) =>
  String(req.user?.role || "").toLowerCase();

const getUserId = (req) =>
  String(req.user?.id || req.user?._id || "");

const requireStaff = (req, res, next) => {
  if (["employee", "control"].includes(getRole(req))) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Employee or Control Admin access is required.",
  });
};

const getTargetUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const target = await User.findById(req.params.id).select(
      "name email role status isDeleted"
    );

    if (!target || target.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const actorRole = getRole(req);
    const targetRole = String(target.role || "").toLowerCase();
    const actorId = getUserId(req);

    if (
      targetRole === "control" ||
      ["admin", "superadmin", "super_admin"].includes(targetRole)
    ) {
      return res.status(403).json({
        success: false,
        message: "Control/Admin accounts cannot be blocked or deleted from this section.",
      });
    }

    if (actorId === String(target._id)) {
      return res.status(403).json({
        success: false,
        message: "You cannot block or delete your own account here.",
      });
    }

    if (
      actorRole === "employee" &&
      !["student", "recruiter", "ambassador"].includes(targetRole)
    ) {
      return res.status(403).json({
        success: false,
        message: "Employees cannot manage other employee accounts.",
      });
    }

    if (
      actorRole === "control" &&
      !["student", "recruiter", "ambassador", "employee"].includes(targetRole)
    ) {
      return res.status(403).json({
        success: false,
        message: "This account type cannot be modified here.",
      });
    }

    req.targetUser = target;

    return next();
  } catch (error) {
    console.error("USER TARGET AUTHORIZATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to authorize this user action.",
    });
  }
};

const requireRecruiterTarget = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter ID.",
      });
    }

    const recruiter = await User.findOne({
      _id: req.params.id,
      role: "recruiter",
      isDeleted: { $ne: true },
    }).select("_id");

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found.",
      });
    }

    return next();
  } catch (error) {
    console.error("RECRUITER AUTHORIZATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to authorize recruiter action.",
    });
  }
};

router.use(auth);

// List and recruiter-approval actions: staff only
router.get("/", requireStaff, getAllUsers);

router.get(
  "/recruiters/pending",
  requireStaff,
  getPendingRecruiters
);

router.put(
  "/recruiters/approve/:id",
  requireStaff,
  requireRecruiterTarget,
  approveRecruiter
);

router.put(
  "/recruiters/reject/:id",
  requireStaff,
  requireRecruiterTarget,
  rejectRecruiter
);

// Block/unblock: target role and ownership are checked on the backend.
router.put(
  "/block/:id",
  requireStaff,
  getTargetUser,
  blockUser
);

router.put(
  "/unblock/:id",
  requireStaff,
  getTargetUser,
  unblockUser
);

router.delete(
  "/:id",
  requireStaff,
  getTargetUser,
  deleteUser
);

// Users may change only their own avatar; Control Admin can help
// with another account's avatar if needed.
router.put("/avatar/:id", async (req, res, next) => {
  const targetId = String(req.params.id || "");
  const currentId = getUserId(req);

  if (
    getRole(req) === "control" ||
    (currentId && targetId === currentId)
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "You can only update your own profile photo.",
  });
}, updateAvatar);

export default router;