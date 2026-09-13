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


// =====================================================
// GENERATE REPORT
// =====================================================

router.post(
  "/generate",
  auth,
  createGeneratedReport
);


// =====================================================
// PENDING REPORTS
// EMPLOYEE REVIEW
// =====================================================

router.get(
  "/pending",
  auth,
  getPendingReports
);


// =====================================================
// APPROVED REPORTS
// =====================================================

router.get(
  "/approved",
  auth,
  getApprovedReports
);


// =====================================================
// SINGLE REPORT
// =====================================================

router.get(
  "/:id",
  auth,
  getGeneratedReportById
);


// =====================================================
// EDIT REPORT
// =====================================================

router.put(
  "/:id/update",
  auth,
  updateGeneratedReport
);


// =====================================================
// REQUEST REVISION
// =====================================================

router.put(
  "/:id/revision",
  auth,
  requestReportRevision
);


// =====================================================
// APPROVE
// =====================================================

router.put(
  "/:id/approve",
  auth,
  approveGeneratedReport
);


// =====================================================
// REJECT
// =====================================================

router.put(
  "/:id/reject",
  auth,
  rejectGeneratedReport
);


export default router;
