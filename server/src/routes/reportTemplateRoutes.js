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


// CREATE
router.post(
  "/",
  uploadDocument.single("reportTemplate"),
  createReportTemplate
);


// GET ALL
router.get(
  "/",
  getReportTemplates
);


// GET SINGLE
router.get(
  "/:id",
  getReportTemplateById
);


// UPDATE
router.put(
  "/:id",
  uploadDocument.single("reportTemplate"),
  updateReportTemplate
);


// DELETE
router.delete(
  "/:id",
  deleteReportTemplate
);


// ACTIVATE
router.put(
  "/:id/activate",
  activateReportTemplate
);

export default router;