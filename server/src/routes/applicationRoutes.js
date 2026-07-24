import express from "express";
import {
  applyInternship,
  getStudentApplications,
  getAllApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", applyInternship);

router.get("/student/:studentId", getStudentApplications);

router.get("/", getAllApplications);

router.put("/:id", updateApplicationStatus);

export default router;