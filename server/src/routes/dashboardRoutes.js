import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

// Student Dashboard
router.get("/stats/:userId", getDashboardStats);

// Optional (Backward Compatibility)
router.get("/stats", getDashboardStats);

export default router;