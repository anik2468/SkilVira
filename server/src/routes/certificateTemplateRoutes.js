import express from "express";

import uploadCertificate from "../middleware/uploadCertificate.js";

import {
  createTemplate,
  getTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from "../controllers/certificateTemplateController.js";

const router = express.Router();

// =====================================================
// CREATE
// =====================================================

router.post(
  "/",
  uploadCertificate.single(
    "certificateTemplate"
  ),
  createTemplate
);

// =====================================================
// ACTIVE
// =====================================================

router.get(
  "/active",
  getTemplate
);

// =====================================================
// ALL
// =====================================================

router.get(
  "/",
  getTemplates
);

// =====================================================
// SINGLE
// IMPORTANT: before /:id mutation routes
// =====================================================

router.get(
  "/:id",
  getTemplateById
);

// =====================================================
// UPDATE
// =====================================================

router.put(
  "/:id",
  uploadCertificate.single(
    "certificateTemplate"
  ),
  updateTemplate
);

// =====================================================
// DELETE / DEACTIVATE
// =====================================================

router.delete(
  "/:id",
  deleteTemplate
);

export default router;