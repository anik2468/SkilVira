import express from "express";
import {
  getStudentProfile,
  saveStudentProfile,
  deleteStudentProfile,
} from "../controllers/studentProfileController.js";

const router = express.Router();

// Get Student Profile
router.get("/:userId", getStudentProfile);

// Create / Update Student Profile
router.post("/:userId", saveStudentProfile);

// Delete Student Profile
router.delete("/:userId", deleteStudentProfile);

export default router;