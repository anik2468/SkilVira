import express from "express";

import auth from "../middleware/auth.js";

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

const router = express.Router();

const getUserId = (req) =>
  String(
    req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      ""
  );

const getRole = (req) =>
  String(
    req.user?.role ||
      req.user?.userRole ||
      ""
  ).toLowerCase();

const useCurrentUserId = (req, res, next) => {
  if (!req.params.userId) {
    req.params.userId = getUserId(req);
  }

  if (!req.params.userId) {
    return res.status(401).json({
      success: false,
      message: "Login is required.",
    });
  }

  return next();
};

const requireOwnAmbassadorAccount = (req, res, next) => {
  const role = getRole(req);
  const authenticatedId = getUserId(req);
  const requestedId = String(req.params.userId || "");

  if (
    role === "ambassador" &&
    authenticatedId &&
    requestedId === authenticatedId
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "You can only access your own ambassador account.",
  });
};

// Public leaderboard
router.get("/leaderboard", getLeaderboard);

// Dashboard
router.get(
  "/dashboard",
  auth,
  useCurrentUserId,
  requireOwnAmbassadorAccount,
  ambassadorDashboard
);

router.get(
  "/dashboard/:userId",
  auth,
  useCurrentUserId,
  requireOwnAmbassadorAccount,
  ambassadorDashboard
);

// Referred students
router.get(
  "/students",
  auth,
  useCurrentUserId,
  requireOwnAmbassadorAccount,
  getAmbassadorStudents
);

router.get(
  "/students/:userId",
  auth,
  useCurrentUserId,
  requireOwnAmbassadorAccount,
  getAmbassadorStudents
);

// Referral summary
router.get(
  "/referrals",
  auth,
  useCurrentUserId,
  requireOwnAmbassadorAccount,
  getReferralSummary
);

router.get(
  "/referrals/:userId",
  auth,
  useCurrentUserId,
  requireOwnAmbassadorAccount,
  getReferralSummary
);

// Profile
router.get(
  "/profile",
  auth,
  useCurrentUserId,
  requireOwnAmbassadorAccount,
  getAmbassadorProfile
);

router.put(
  "/profile",
  auth,
  useCurrentUserId,
  requireOwnAmbassadorAccount,
  saveAmbassadorProfile
);

router.get(
  "/profile/:userId",
  auth,
  useCurrentUserId,
  requireOwnAmbassadorAccount,
  getAmbassadorProfile
);

router.put(
  "/profile/:userId",
  auth,
  useCurrentUserId,
  requireOwnAmbassadorAccount,
  saveAmbassadorProfile
);

// Backward-compatible profile endpoints
router.get(
  "/:userId",
  auth,
  useCurrentUserId,
  requireOwnAmbassadorAccount,
  getAmbassadorProfile
);

router.put(
  "/:userId",
  auth,
  useCurrentUserId,
  requireOwnAmbassadorAccount,
  saveAmbassadorProfile
);

export default router;