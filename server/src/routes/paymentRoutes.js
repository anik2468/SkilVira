import express from "express";

import auth from "../middleware/auth.js";
import uploadPayment from "../middleware/uploadPayment.js";

import {
  // =================================
  // Razorpay
  // =================================
  createOrder,
  verifyPayment,

  // =================================
  // Manual Payment
  // =================================
  createManualPayment,
  getPendingPayments,
  getPaymentById,
  approveManualPayment,
  rejectManualPayment,

  // =================================
  // Student Payment History
  // =================================
  getStudentPayments,
  getMyPayments,
} from "../controllers/paymentController.js";


const router = express.Router();


// =====================================================
// RAZORPAY PAYMENT
// =====================================================

// Create Razorpay Order
router.post(
  "/create-order",
  auth,
  createOrder
);


// Verify Razorpay Payment
router.post(
  "/verify",
  auth,
  verifyPayment
);


// =====================================================
// MANUAL PAYMENT
// =====================================================

// Student submits:
// - Payment screenshot
// - Transaction ID
// - Payment method
// - Course / Internship
router.post(
  "/manual",
  auth,
  uploadPayment.single("paymentScreenshot"),
  createManualPayment
);


// =====================================================
// EMPLOYEE / CONTROL PAYMENT VERIFICATION
// =====================================================

// Pending manual payments
router.get(
  "/pending",
  auth,
  getPendingPayments
);


// =====================================================
// STUDENT PAYMENT HISTORY
// IMPORTANT:
// These routes must come BEFORE /:id
// =====================================================

// Logged-in student
router.get(
  "/my",
  auth,
  getMyPayments
);


// Specific student history
router.get(
  "/student/:studentId",
  auth,
  getStudentPayments
);


// =====================================================
// SINGLE PAYMENT
// IMPORTANT:
// Keep dynamic /:id AFTER fixed routes
// =====================================================

// Single payment details
router.get(
  "/:id",
  auth,
  getPaymentById
);


// =====================================================
// APPROVE / REJECT
// =====================================================

// Approve manual payment
router.put(
  "/:id/approve",
  auth,
  approveManualPayment
);


// Reject manual payment
router.put(
  "/:id/reject",
  auth,
  rejectManualPayment
);


export default router;