import express from "express";

import {
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
} from "../controllers/studentProfileController.js";

const router = express.Router();

// Create Profile
router.post("/", createStudentProfile);

// Get Profile
router.get("/:userId", getStudentProfile);

// Update Profile
router.put("/:userId", updateStudentProfile);

export default router;