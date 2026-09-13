import api from "./api";


// =====================================================
// PAYMENT SERVICE
// =====================================================


// ======================================
// Create Razorpay Order
// Existing function preserved
// ======================================

export const createPaymentOrder = async (
  data
) => {
  const res = await api.post(
    "/payments/create-order",
    data
  );

  return res.data;
};


// ======================================
// Verify Razorpay Payment
// Existing function preserved
// ======================================

export const verifyPayment = async (
  data
) => {
  const res = await api.post(
    "/payments/verify",
    data
  );

  return res.data;
};


// ======================================
// Student Payment History
// Existing function preserved
// ======================================

export const getStudentPayments = async (
  studentId
) => {
  if (!studentId) {
    throw new Error(
      "Student ID is required"
    );
  }

  const res = await api.get(
    `/payments/student/${studentId}`
  );

  return res.data;
};


// =====================================================
// MANUAL PAYMENT SYSTEM
// =====================================================


// ======================================
// Create Manual Payment
// Student submits transaction + screenshot
// ======================================

export const createManualPayment = async (
  formData
) => {
  if (!formData) {
    throw new Error(
      "Payment data is required"
    );
  }

  const res = await api.post(
    "/payments/manual",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};


// ======================================
// Get Logged-in Student Payments
// ======================================

export const getMyPayments = async () => {
  const res = await api.get(
    "/payments/my"
  );

  return res.data;
};


// ======================================
// Get Payment By ID
// ======================================

export const getPaymentById = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Payment ID is required"
    );
  }

  const res = await api.get(
    `/payments/${id}`
  );

  return res.data;
};


// =====================================================
// EMPLOYEE PAYMENT VERIFICATION
// =====================================================


// ======================================
// Get Pending Payments
// ======================================

export const getPendingPayments = async () => {
  const res = await api.get(
    "/payments/pending"
  );

  return res.data;
};


// ======================================
// Approve Manual Payment
// ======================================

export const approveManualPayment = async (
  id,
  payload = {}
) => {
  if (!id) {
    throw new Error(
      "Payment ID is required"
    );
  }

  const res = await api.put(
    `/payments/${id}/approve`,
    payload
  );

  return res.data;
};


// ======================================
// Reject Manual Payment
// ======================================

export const rejectManualPayment = async (
  id,
  reason
) => {
  if (!id) {
    throw new Error(
      "Payment ID is required"
    );
  }

  const res = await api.put(
    `/payments/${id}/reject`,
    {
      rejectionReason:
        reason || "",
    }
  );

  return res.data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  // Razorpay
  createPaymentOrder,
  verifyPayment,

  // Student
  getStudentPayments,
  getMyPayments,
  getPaymentById,
  createManualPayment,

  // Employee
  getPendingPayments,
  approveManualPayment,
  rejectManualPayment,
};