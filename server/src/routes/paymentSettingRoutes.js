import express from "express";

import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

import {
  getPaymentSettings,
  updatePaymentSettings,
  uploadPaymentQR,
  removePaymentQR,
} from "../controllers/paymentSettingController.js";


const router = express.Router();

const requireControl = (req, res, next) => {
  const role = String(req.user?.role || req.user?.userRole || "").toLowerCase();

  if (role !== "control") {
    return res.status(403).json({
      success: false,
      message: "Only Super Admin can change payment settings.",
    });
  }

  return next();
};



// =====================================================
// GET PAYMENT SETTINGS
// =====================================================

router.get(
  "/",
  auth,
  getPaymentSettings
);


// =====================================================
// UPDATE PAYMENT SETTINGS
// =====================================================

router.put(
  "/",
  auth,
  requireControl,
  updatePaymentSettings
);


// =====================================================
// UPLOAD QR
// =====================================================

router.post(
  "/qr",
  auth,
  requireControl,
  upload.single("qrCode"),
  uploadPaymentQR
);


// =====================================================
// REMOVE QR
// =====================================================

router.delete(
  "/qr",
  auth,
  requireControl,
  removePaymentQR
);


export default router;