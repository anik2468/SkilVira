import express from "express";

import auth from "../middleware/auth.js";
import uploadDocument from "../middleware/uploadDocument.js";

import {
  createReportTemplate,
  getReportTemplates,
  getReportTemplateById,
  updateReportTemplate,
  deleteReportTemplate,
  activateReportTemplate,
} from "../controllers/reportTemplateController.js";

const router = express.Router();


// CREATE
router.post(
  "/",
  auth,
  uploadDocument.single("reportTemplate"),
  createReportTemplate
);


// GET ALL
router.get(
  "/",
  auth,
  getReportTemplates
);


// GET SINGLE
router.get(
  "/:id",
  auth,
  getReportTemplateById
);


// UPDATE
router.put(
  "/:id",
  auth,
  uploadDocument.single("reportTemplate"),
  updateReportTemplate
);


// DELETE
router.delete(
  "/:id",
  auth,
  deleteReportTemplate
);


// ACTIVATE
router.put(
  "/:id/activate",
  auth,
  activateReportTemplate
);

export default router;