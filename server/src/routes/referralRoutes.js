import express from "express";

import auth from "../middleware/auth.js";

import {
  generateReferralCode,
  validateReferral,
  trackReferralClick,
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

const requireOwnAccountOrControl = (req, res, next) => {
  const role = getRole(req);
  const currentId = getUserId(req);
  const requestedId = String(req.params.id || "");

  if (
    role === "control" ||
    (role === "ambassador" &&
      currentId &&
      currentId === requestedId)
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "You cannot generate another user's referral code.",
  });
};

// Public: referral links can be opened without login
router.get("/click/:code", trackReferralClick);

// Logged-in ambassador can generate/obtain their referral code
router.get(
  "/generate/:id",
  auth,
  requireOwnAccountOrControl,
  generateReferralCode
);

// Public: used during registration and checkout
router.post("/validate", validateReferral);

export default router;