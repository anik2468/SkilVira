import express from "express";
import auth from "../middleware/auth.js";

import {
  createInternship,
  createSkilViraInternship,
  getInternships,
  getInternshipById,
  getRecruiterInternships,
  getPendingInternships,
  latestInternships,
  featuredInternships,
  updateInternship,
  deleteInternship,
  approveInternship,
  rejectInternship,
  featureInternship,
} from "../controllers/internshipController.js";

const router = express.Router();

const getRole = (req) =>
  String(req.user?.role || "").toLowerCase();

const requireRecruiter = (req, res, next) => {
  if (getRole(req) !== "recruiter") {
    return res.status(403).json({
      success: false,
      message: "Recruiter access is required.",
    });
  }

  return next();
};

const requireStaff = (req, res, next) => {
  if (!["employee", "control"].includes(getRole(req))) {
    return res.status(403).json({
      success: false,
      message: "Employee or Control Admin access is required.",
    });
  }

  return next();
};

// Public internship routes
router.get("/", getInternships);
router.get("/latest", latestInternships);
router.get("/featured", featuredInternships);
router.get("/:id", getInternshipById);

// Recruiter routes
router.get(
  "/recruiter/:recruiterId",
  auth,
  requireRecruiter,
  getRecruiterInternships
);

router.post("/", auth, requireRecruiter, createInternship);
router.put("/:id", auth, requireRecruiter, updateInternship);
router.delete("/:id", auth, requireRecruiter, deleteInternship);

// Employee / Control routes
router.post(
  "/skilvira/create",
  auth,
  requireStaff,
  createSkilViraInternship
);

router.get(
  "/pending/all",
  auth,
  requireStaff,
  getPendingInternships
);

router.put(
  "/approve/:id",
  auth,
  requireStaff,
  approveInternship
);

router.put(
  "/reject/:id",
  auth,
  requireStaff,
  rejectInternship
);

router.put(
  "/feature/:id",
  auth,
  requireStaff,
  featureInternship
);

export default router;
