import express from "express";


import {

getMyCourses,

completeLesson,

getCourseProgress

} from "../controllers/enrollmentController.js";



const router = express.Router();





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