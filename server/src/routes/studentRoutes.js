import express from "express";
import { getStudentDashboard } from "../controllers/studentController.js";

const router = express.Router();

router.get("/dashboard", getStudentDashboard);

export default router;