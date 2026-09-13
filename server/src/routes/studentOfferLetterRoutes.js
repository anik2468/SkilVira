import express from "express";
import auth from "../middleware/auth.js";

import {
  getMyOfferLetters,
  getMyOfferLetterById,
} from "../controllers/studentOfferLetterController.js";

const router = express.Router();

// Student's approved offer letters
router.get("/", auth, getMyOfferLetters);

// Single approved offer letter
router.get("/:id", auth, getMyOfferLetterById);

export default router;