import express from "express";

import auth from "../middleware/auth.js";

import {
  markEnrollmentCompleted,
} from "../services/enrollmentCompletionService.js";

const router = express.Router();

const allowRoles = (...roles) => (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();

  if (!roles.includes(role)) {
    return res.status(403).json({
      success: false,
      message: "Only authorized staff can complete enrollments.",
    });
  }

  next();
};


// =====================================================
// COMPLETE ENROLLMENT
// =====================================================

router.put(
  "/:id/complete",
  auth,
  allowRoles("employee", "admin", "control"),
  markEnrollmentCompleted
);


export default router;