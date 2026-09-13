import express from "express";

import auth from "../middleware/auth.js";
import uploadDocument from "../middleware/uploadDocument.js";

import {
  createOfferLetterTemplate,
  getOfferLetterTemplates,
  getOfferLetterTemplateById,
  updateOfferLetterTemplate,
  deleteOfferLetterTemplate,
  activateOfferLetterTemplate,
} from "../controllers/offerLetterTemplateController.js";


const router = express.Router();


// =====================================================
// CREATE
// =====================================================

router.post(
  "/",
  auth,
  uploadDocument.single("offerLetter"),
  createOfferLetterTemplate
);


// =====================================================
// GET ALL
// =====================================================

router.get(
  "/",
  auth,
  getOfferLetterTemplates
);


// =====================================================
// SINGLE
// =====================================================

router.get(
  "/:id",
  auth,
  getOfferLetterTemplateById
);


// =====================================================
// UPDATE
// =====================================================

router.put(
  "/:id",
  auth,
  uploadDocument.single("offerLetter"),
  updateOfferLetterTemplate
);


// =====================================================
// DELETE / DEACTIVATE
// =====================================================

router.delete(
  "/:id",
  auth,
  deleteOfferLetterTemplate
);


// =====================================================
// ACTIVATE
// =====================================================

router.put(
  "/:id/activate",
  auth,
  activateOfferLetterTemplate
);


export default router;