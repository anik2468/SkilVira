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
  updatePaymentSettings
);


// =====================================================
// UPLOAD QR
// =====================================================

router.post(
  "/qr",
  auth,
  upload.single("qrCode"),
  uploadPaymentQR
);


// =====================================================
// REMOVE QR
// =====================================================

router.delete(
  "/qr",
  auth,
  removePaymentQR
);


export default router;