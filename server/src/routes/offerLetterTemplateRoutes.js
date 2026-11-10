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

const STAFF_ROLES = new Set(["employee", "admin", "control"]);

const requireTemplateStaff = (req, res, next) => {
  const role = String(req.user?.role || req.user?.userRole || "").toLowerCase();

  if (!STAFF_ROLES.has(role)) {
    return res.status(403).json({
      success: false,
      message: "Only authorized staff can manage templates.",
    });
  }

  return next();
};

router.use(auth, requireTemplateStaff);


// =====================================================
// CREATE
// =====================================================

router.post(
  "/",
  uploadDocument.single("offerLetter"),
  createOfferLetterTemplate
);


// =====================================================
// GET ALL
// =====================================================

router.get(
  "/",
  getOfferLetterTemplates
);


// =====================================================
// SINGLE
// =====================================================

router.get(
  "/:id",
  getOfferLetterTemplateById
);


// =====================================================
// UPDATE
// =====================================================

router.put(
  "/:id",
  uploadDocument.single("offerLetter"),
  updateOfferLetterTemplate
);


// =====================================================
// DELETE / DEACTIVATE
// =====================================================

router.delete(
  "/:id",
  deleteOfferLetterTemplate
);


// =====================================================
// ACTIVATE
// =====================================================

router.put(
  "/:id/activate",
  activateOfferLetterTemplate
);


export default router;