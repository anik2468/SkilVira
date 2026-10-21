import express from "express";
import auth from "../middleware/auth.js";

import {
  createLesson,
  getCourseLessons,
  createAssessment,
  submitAssessment,
  gradeAssignment,
} from "../controllers/lessonController.js";

const router = express.Router();

const requireStaff = (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();
  if (["employee", "control", "admin", "superadmin"].includes(role)) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Only authorized staff can manage course content.",
  });
};

router.post("/", auth, requireStaff, createLesson);
router.get("/course/:courseId", auth, getCourseLessons);

router.post("/:lessonId/assessments", auth, requireStaff, createAssessment);
router.post(
  "/:lessonId/assessments/:assessmentId/submit",
  auth,
  submitAssessment
);
router.patch(
  "/:lessonId/assessments/:assessmentId/attempts/:attemptId/grade",
  auth,
  requireStaff,
  gradeAssignment
);

export default router;
