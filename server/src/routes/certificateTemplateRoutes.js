import express from "express";
import auth from "../middleware/auth.js";

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

const requireControl = (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();

  if (role !== "control") {
    return res.status(403).json({
      success: false,
      message: "Only Super Admin can manage certificate templates.",
    });
  }

  return next();
};


// =====================================================
// CREATE
// =====================================================

router.post(
  "/",
  auth,
  requireControl,
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
  auth,
  requireControl,
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
  auth,
  requireControl,
  deleteTemplate
);

export default router;