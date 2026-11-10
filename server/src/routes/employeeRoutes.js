import express from "express";

import auth from "../middleware/auth.js";
import User from "../models/User.js";
import mongoose from "mongoose";

import {
  getEmployeeProfile,
  saveEmployeeProfile,
  employeeDashboard,
  getEmployees,
  getPendingRecruiters,
  approveRecruiter,
  rejectRecruiter,
  getPendingAmbassadors,
  approveAmbassador,
  rejectAmbassador,
  getPendingInternships,
  approveInternship,
  rejectInternship,
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
} from "../controllers/employeeController.js";

const router = express.Router();

const getRole = (req) =>
  String(req.user?.role || "").toLowerCase();

const getUserId = (req) =>
  String(req.user?.id || req.user?._id || "");

const isControlRole = (req) =>
  getRole(req) === "control";

const requireStaff = (req, res, next) => {
  if (["employee", "control"].includes(getRole(req))) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Employee or Control Admin access is required.",
  });
};

const selfOrControl = (req, res, next) => {
  const requestedId = String(req.params.userId || "");

  if (
    isControlRole(req) ||
    (getRole(req) === "employee" &&
      requestedId === getUserId(req))
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "You can only access your own employee profile.",
  });
};

const authorizeManagedUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const target = await User.findById(req.params.id).select(
      "role status isDeleted"
    );

    if (!target || target.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const targetRole = String(target.role || "").toLowerCase();

    if (
      targetRole === "control" ||
      ["admin", "superadmin", "super_admin"].includes(targetRole)
    ) {
      return res.status(403).json({
        success: false,
        message: "Employee accounts cannot block or delete Control/Admin accounts.",
      });
    }

    if (
      getRole(req) === "employee" &&
      !["student", "recruiter", "ambassador"].includes(targetRole)
    ) {
      return res.status(403).json({
        success: false,
        message: "Employees cannot manage employee accounts.",
      });
    }

    if (String(target._id) === getUserId(req)) {
      return res.status(403).json({
        success: false,
        message: "You cannot block or delete your own account here.",
      });
    }

    req.targetUser = target;

    return next();
  } catch (error) {
    console.error("EMPLOYEE USER AUTHORIZATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to authorize this user action.",
    });
  }
};

router.use(auth, requireStaff);

// Dashboard
router.get(
  "/dashboard/:userId",
  selfOrControl,
  employeeDashboard
);

// User management
router.get("/users", getAllUsers);

router.put(
  "/users/block/:id",
  authorizeManagedUser,
  blockUser
);

router.put(
  "/users/unblock/:id",
  authorizeManagedUser,
  unblockUser
);

router.delete(
  "/users/delete/:id",
  authorizeManagedUser,
  deleteUser
);

// Recruiter review
router.get("/recruiters/pending", getPendingRecruiters);
router.put("/recruiters/approve/:id", approveRecruiter);
router.put("/recruiters/reject/:id", rejectRecruiter);

// Ambassador review
router.get("/ambassadors/pending", getPendingAmbassadors);
router.put("/ambassadors/approve/:id", approveAmbassador);
router.put("/ambassadors/reject/:id", rejectAmbassador);

// Internship review
router.get("/internships/pending", getPendingInternships);
router.put("/internships/approve/:id", approveInternship);
router.put("/internships/reject/:id", rejectInternship);


// Compatibility routes used by the employee frontend
const setCurrentEmployeeTarget = (req, res, next) => {
  if (!req.params.userId) {
    req.params.userId = String(req.user?.id || req.user?._id || "");
  }

  if (!req.params.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  return next();
};

router
  .route("/profile")
  .get(setCurrentEmployeeTarget, selfOrControl, getEmployeeProfile)
  .put(setCurrentEmployeeTarget, selfOrControl, saveEmployeeProfile);

router
  .route("/profile/:userId")
  .get(selfOrControl, getEmployeeProfile)
  .put(selfOrControl, saveEmployeeProfile);

// Employee profile list and current user's profile
router.get("/", getEmployees);

router
  .route("/:userId")
  .get(selfOrControl, getEmployeeProfile)
  .put(selfOrControl, saveEmployeeProfile);

export default router;