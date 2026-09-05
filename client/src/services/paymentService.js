import api from "./api";


// ======================================
// Create Razorpay Order
// ======================================

export const createPaymentOrder = async(data)=>{

  const res = await api.post(
    "/payments/create-order",
    data
  );

  return res.data;

};




// ======================================
// Verify Payment
// ======================================

export const verifyPayment = async(data)=>{

  const res = await api.post(
    "/payments/verify",
    data
  );

  return res.data;

};




// ======================================
// Student Payment History
// ======================================

export const getStudentPayments = async(studentId)=>{


  const res = await api.get(
    `/payments/student/${studentId}`
  );


  return res.data;

};