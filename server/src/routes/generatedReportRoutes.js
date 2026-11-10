import express from "express";

import {
  createGeneratedReport,
  getPendingReports,
  getGeneratedReportById,
  updateGeneratedReport,
  requestReportRevision,
  approveGeneratedReport,
  rejectGeneratedReport,
  getApprovedReports,
} from "../controllers/generatedReportController.js";

import auth from "../middleware/auth.js";


const router = express.Router();

const STAFF_ROLES = ["employee", "admin", "control"];

router.use(auth, (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();

  if (!STAFF_ROLES.includes(role)) {
    return res.status(403).json({
      success: false,
      message: "Only authorized staff can access report verification.",
    });
  }

  next();
});


// =====================================================
// GENERATE REPORT
// =====================================================

router.post(
  "/generate",
  createGeneratedReport
);


// =====================================================
// PENDING REPORTS
// EMPLOYEE REVIEW
// =====================================================

router.get(
  "/pending",
  getPendingReports
);


// =====================================================
// APPROVED REPORTS
// =====================================================

router.get(
  "/approved",
  getApprovedReports
);


// =====================================================
// SINGLE REPORT
// =====================================================

router.get(
  "/:id",
  getGeneratedReportById
);


// =====================================================
// EDIT REPORT
// =====================================================

router.put(
  "/:id/update",
  updateGeneratedReport
);


// =====================================================
// REQUEST REVISION
// =====================================================

router.put(
  "/:id/revision",
  requestReportRevision
);


// =====================================================
// APPROVE
// =====================================================

router.put(
  "/:id/approve",
  approveGeneratedReport
);


// =====================================================
// REJECT
// =====================================================

router.put(
  "/:id/reject",
  rejectGeneratedReport
);


export default router;
