import express from "express";

import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";


const router = express.Router();


// ================================
// Courses
// ================================


// Create Course
router.post(
  "/",
  createCourse
);


// Get All Courses
router.get(
  "/",
  getCourses
);


// Get Single Course
router.get(
  "/:id",
  getCourse
);


// Update Course
router.put(
  "/:id",
  updateCourse
);


// Delete Course
router.delete(
  "/:id",
  deleteCourse
);


export default router;