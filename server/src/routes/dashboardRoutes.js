import express from "express";

import auth from "../middleware/auth.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { getAdminDashboardStats } from "../controllers/adminDashboardController.js";

const router = express.Router();

const getRole = (req) =>
  String(req.user?.role || req.user?.userRole || "").toLowerCase();

const getUserId = (req) =>
  String(req.user?.id || req.user?._id || req.user?.userId || "");

const requireControl = (req, res, next) => {
  if (getRole(req) !== "control") {
    return res.status(403).json({
      success: false,
      message: "Control administrator access is required.",
    });
  }

  return next();
};

const requireSelfOrStaff = (req, res, next) => {
  const role = getRole(req);
  const requestedId = String(req.params.userId || "");

  if (
    ["control", "employee"].includes(role) ||
    (requestedId && requestedId === getUserId(req))
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "You can only access your own dashboard data.",
  });
};

// Must come before /:userId so "admin" is not treated as a student ID.
router.get(
  "/admin",
  auth,
  requireControl,
  getAdminDashboardStats
);

// Existing student dashboard API
router.get(
  "/:userId",
  auth,
  requireSelfOrStaff,
  getDashboardStats
);

// Existing compatibility endpoints
router.get(
  "/stats/:userId",
  auth,
  requireSelfOrStaff,
  getDashboardStats
);

router.get(
  "/stats",
  auth,
  getDashboardStats
);

export default router;