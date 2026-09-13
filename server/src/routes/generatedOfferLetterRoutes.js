import express from "express";

import auth from "../middleware/auth.js";

import {
  createGeneratedOfferLetter,
  getPendingOfferLetters,
  getGeneratedOfferLetterById,
  updateGeneratedOfferLetter,
  requestOfferLetterRevision,
  approveGeneratedOfferLetter,
  rejectGeneratedOfferLetter,
  getApprovedOfferLetters,
} from "../controllers/generatedOfferLetterController.js";


const router = express.Router();


// =====================================================
// CREATE
// =====================================================

router.post(
  "/generate",
  auth,
  createGeneratedOfferLetter
);


// =====================================================
// EMPLOYEE REVIEW QUEUE
// =====================================================

router.get(
  "/pending",
  auth,
  getPendingOfferLetters
);


// =====================================================
// APPROVED
// =====================================================

router.get(
  "/approved",
  auth,
  getApprovedOfferLetters
);


// =====================================================
// SINGLE
// IMPORTANT: Keep this AFTER /pending and /approved
// =====================================================

router.get(
  "/:id",
  auth,
  getGeneratedOfferLetterById
);


// =====================================================
// EDIT
// =====================================================

router.put(
  "/:id/update",
  auth,
  updateGeneratedOfferLetter
);


// =====================================================
// REVISION
// =====================================================

router.put(
  "/:id/revision",
  auth,
  requestOfferLetterRevision
);


// =====================================================
// APPROVE
// =====================================================

router.put(
  "/:id/approve",
  auth,
  approveGeneratedOfferLetter
);


// =====================================================
// REJECT
// =====================================================

router.put(
  "/:id/reject",
  auth,
  rejectGeneratedOfferLetter
);


export default router;