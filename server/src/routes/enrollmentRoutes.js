import express from "express";
import auth from "../middleware/auth.js";

import {
  getMyCourses,
  completeLesson,
  getCourseProgress,
  enrollInFreeCourse,
} from "../controllers/enrollmentController.js";

const router = express.Router();

router.post("/free-course/:courseId", auth, enrollInFreeCourse);

// Both forms are supported for existing frontend compatibility.
router.get("/my-courses", auth, getMyCourses);
router.get("/my-courses/:studentId", auth, getMyCourses);

router.post("/lesson-complete", auth, completeLesson);
router.get("/progress/:studentId/:courseId", auth, getCourseProgress);

export default router;
