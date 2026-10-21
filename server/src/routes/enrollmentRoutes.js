import express from "express";
import auth from "../middleware/auth.js";


import {

getMyCourses,

completeLesson,

getCourseProgress,
  enrollInFreeCourse
} from "../controllers/enrollmentController.js";



const router = express.Router();

router.post("/free-course/:courseId", auth, enrollInFreeCourse);






router.get(
"/my-courses/:studentId",
getMyCourses
);





router.post(
"/lesson-complete",
completeLesson
);





router.get(
"/progress/:studentId/:courseId",
getCourseProgress
);





export default router;