import express from "express";

import auth from "../middleware/auth.js";

import {
  getMyCertificates,
  getMyReports,
  getMyDocuments,
  getMyCertificateById,
  getMyReportById,
} from "../controllers/studentDocumentController.js";


const router = express.Router();


// =====================================================
// ALL MY DOCUMENTS
// =====================================================

router.get(
  "/",
  auth,
  getMyDocuments
);


// =====================================================
// MY CERTIFICATES
// =====================================================

router.get(
  "/certificates",
  auth,
  getMyCertificates
);


// =====================================================
// SINGLE CERTIFICATE
// =====================================================

router.get(
  "/certificates/:id",
  auth,
  getMyCertificateById
);


// =====================================================
// MY REPORTS
// =====================================================

router.get(
  "/reports",
  auth,
  getMyReports
);


// =====================================================
// SINGLE REPORT
// =====================================================

router.get(
  "/reports/:id",
  auth,
  getMyReportById
);


export default router;