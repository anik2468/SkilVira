import express from "express";

import {
  getStudentDashboard,
  getStudentStats,
  getStudentProfileSummary,
} from "../controllers/studentController.js";

const router = express.Router();

// ===========================
// Dashboard
// ===========================
router.get("/dashboard/:userId", getStudentDashboard);

// ===========================
// Student Stats
// ===========================
router.get("/stats/:userId", getStudentStats);

// ===========================
// Profile Summary
// ===========================
router.get(
  "/profile-summary/:userId",
  getStudentProfileSummary
);

export default router;