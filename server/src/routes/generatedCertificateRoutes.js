import express from "express";

import {
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

const STAFF_ROLES = ["employee", "admin", "control"];

const allowRoles = (...roles) => (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();

  if (!roles.includes(role)) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action.",
    });
  }

  next();
};

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


// =====================================================
// EMPLOYEE PENDING
// =====================================================

router.get(
  "/pending",
  auth,
  allowRoles(...STAFF_ROLES),
  getPendingCertificates
);

// =====================================================
// SINGLE
// =====================================================

router.get(
  "/:id",
  auth,
  allowRoles("student", ...STAFF_ROLES),
  getGeneratedCertificateById
);

// =====================================================
// UPDATE
// =====================================================

router.put(
  "/:id/update",
  auth,
  allowRoles(...STAFF_ROLES),
  updateCertificateDetails
);

// =====================================================
// REVISION
// =====================================================

router.put(
  "/:id/revision",
  auth,
  allowRoles(...STAFF_ROLES),
  requestCertificateRevision
);

// =====================================================
// APPROVE
// =====================================================

router.put(
  "/:id/approve",
  auth,
  allowRoles(...STAFF_ROLES),
  approveCertificate
);

// =====================================================
// REJECT
// =====================================================

router.put(
  "/:id/reject",
  auth,
  allowRoles(...STAFF_ROLES),
  rejectCertificate
);

export default router;