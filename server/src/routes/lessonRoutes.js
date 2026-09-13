import express from "express";

import {

createLesson,

getCourseLessons

} from "../controllers/lessonController.js";


const router = express.Router();



router.post(
"/",
createLesson
);



router.get(
"/course/:courseId",
getCourseLessons
);



export default router;