import express from "express";

import {
  generateReferralCode,
  validateReferral,
  trackReferralClick,
} from "../controllers/referralController.js";

const router =
  express.Router();

// ======================================
// CLICK TRACKING
// IMPORTANT: This route redirects
// to student registration.
// ======================================

router.get(
  "/click/:code",
  trackReferralClick
);

// ======================================
// AUTO GENERATE / ENSURE CODE
// ======================================

router.get(
  "/generate/:id",
  generateReferralCode
);

// ======================================
// VALIDATE REFERRAL
// ======================================

router.post(
  "/validate",
  validateReferral
);

export default router;