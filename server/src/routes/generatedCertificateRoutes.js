import express from "express";

import {
  createGeneratedCertificate,
  getPendingCertificates,
  getGeneratedCertificateById,
  updateCertificateDetails,
  requestCertificateRevision,
  approveCertificate,
  rejectCertificate,
  verifyCertificatePublic,
} from "../controllers/generatedCertificateController.js";

import auth from "../middleware/auth.js";

const router =
  express.Router();

// =====================================================
// PUBLIC VERIFICATION
// IMPORTANT: BEFORE /:id
// =====================================================

router.get(
  "/verify/:credentialId",
  verifyCertificatePublic
);

// =====================================================
// GENERATE
// =====================================================

router.post(
  "/generate",
  auth,
  createGeneratedCertificate
);

// =====================================================
// EMPLOYEE PENDING
// =====================================================

router.get(
  "/pending",
  auth,
  getPendingCertificates
);

// =====================================================
// SINGLE
// =====================================================

router.get(
  "/:id",
  auth,
  getGeneratedCertificateById
);

// =====================================================
// UPDATE
// =====================================================

router.put(
  "/:id/update",
  auth,
  updateCertificateDetails
);

// =====================================================
// REVISION
// =====================================================

router.put(
  "/:id/revision",
  auth,
  requestCertificateRevision
);

// =====================================================
// APPROVE
// =====================================================

router.put(
  "/:id/approve",
  auth,
  approveCertificate
);

// =====================================================
// REJECT
// =====================================================

router.put(
  "/:id/reject",
  auth,
  rejectCertificate
);

export default router;