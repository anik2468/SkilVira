import express from "express";
import auth from "../middleware/auth.js";
import Application from "../models/Application.js";

import {
  applyInternship,
  getStudentApplications,
  getRecruiterApplications,
  getAllApplications,
  getApplicationById,
  recruiterApplicationStats,
  updateApplicationStatus,
  withdrawApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

const STAFF_ROLES = ["employee", "control", "admin"];

const allowRoles = (...roles) => (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();
  if (!roles.includes(role)) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this resource.",
    });
  }
  next();
};

const requireSelfOrStaff = (param, ownerRole) => (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();
  const requestedId = String(req.params[param] || "");
  const actorId = String(req.user?.id || "");

  if (STAFF_ROLES.includes(role)) return next();

  if (role === ownerRole && requestedId === actorId) return next();

  return res.status(403).json({
    success: false,
    message: "You can only access your own records.",
  });
};

const requireApplicationAccess = async (req, res, next) => {
  try {
    const role = String(req.user?.role || "").toLowerCase();

    const application = await Application.findById(req.params.id)
      .select("student recruiter isDeleted");

    if (!application || application.isDeleted === true) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (STAFF_ROLES.includes(role)) {
      req.application = application;
      return next();
    }

    const actorId = String(req.user?.id || "");
    const studentId = String(application.student || "");
    const recruiterId = String(application.recruiter || "");

    if (
      (role === "student" && studentId === actorId) ||
      (role === "recruiter" && recruiterId === actorId)
    ) {
      req.application = application;
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this application.",
    });
  } catch (error) {
    console.error("APPLICATION ACCESS CHECK:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not verify application access.",
    });
  }
};

router.use(auth);

// Student: application identity is always taken from the verified token.
router.post(
  "/apply",
  allowRoles("student"),
  (req, res, next) => {
    req.body = { ...(req.body || {}), student: req.user.id };
    next();
  },
  applyInternship
);

router.get(
  "/student/:studentId",
  allowRoles("student", ...STAFF_ROLES),
  requireSelfOrStaff("studentId", "student"),
  getStudentApplications
);

router.delete(
  "/:id",
  allowRoles("student", ...STAFF_ROLES),
  requireApplicationAccess,
  withdrawApplication
);

// Recruiter: only their own recruiter ID can be queried.
router.get(
  "/recruiter/stats/:recruiterId",
  allowRoles("recruiter", ...STAFF_ROLES),
  requireSelfOrStaff("recruiterId", "recruiter"),
  recruiterApplicationStats
);

router.get(
  "/recruiter/:recruiterId",
  allowRoles("recruiter", ...STAFF_ROLES),
  requireSelfOrStaff("recruiterId", "recruiter"),
  getRecruiterApplications
);

router.put(
  "/status/:id",
  allowRoles("recruiter", ...STAFF_ROLES),
  requireApplicationAccess,
  updateApplicationStatus
);

// Staff-only listing. Individual details also check record ownership.
router.get(
  "/",
  allowRoles(...STAFF_ROLES),
  getAllApplications
);

router.get(
  "/details/:id",
  allowRoles("student", "recruiter", ...STAFF_ROLES),
  requireApplicationAccess,
  getApplicationById
);

export default router;
