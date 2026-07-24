import express from "express";
import {
  createInternship,
  getInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
} from "../controllers/internshipController.js";

const router = express.Router();

// Get all & Create
router
  .route("/")
  .get(getInternships)
  .post(createInternship);

// Get one, Update & Delete
router
  .route("/:id")
  .get(getInternshipById)
  .put(updateInternship)
  .delete(deleteInternship);

export default router;