import express from "express";

import {
  getAmbassadorProfile,
  saveAmbassadorProfile,
  ambassadorDashboard,
  getLeaderboard,
  getAmbassadorStudents,
} from "../controllers/ambassadorController.js";

import {
  getReferralSummary,
} from "../controllers/referralController.js";

const router =
  express.Router();

// ======================================
// DASHBOARD
// ======================================

router.get(
  "/dashboard/:userId",
  ambassadorDashboard
);

// ======================================
// STUDENTS
// ======================================

router.get(
  "/students/:userId",
  getAmbassadorStudents
);

// ======================================
// REFERRALS
// ======================================

router.get(
  "/referrals/:userId",
  getReferralSummary
);

// ======================================
// LEADERBOARD
// ======================================

router.get(
  "/leaderboard",
  getLeaderboard
);

// ======================================
// PROFILE
// ======================================

// New frontend route
router
  .route(
    "/profile/:userId"
  )
  .get(getAmbassadorProfile)
  .put(saveAmbassadorProfile);

// Existing route preserved
router
  .route("/:userId")
  .get(getAmbassadorProfile)
  .put(saveAmbassadorProfile);

export default router;