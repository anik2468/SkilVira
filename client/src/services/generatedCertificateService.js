import api from "./api";


// =====================================================
// GENERATED CERTIFICATE SERVICE
// =====================================================


// =====================================
// Get Pending Certificates
// Existing function preserved
// =====================================

export const getPendingCertificates = async () => {
  const { data } = await api.get(
    "/generated-certificates/pending"
  );

  return data;
};


// =====================================
// Get Generated Certificate By ID
// =====================================

export const getGeneratedCertificateById = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Generated certificate ID is required"
    );
  }

  const { data } = await api.get(
    `/generated-certificates/${id}`
  );

  return data;
};


// =====================================
// Create Generated Certificate
// =====================================

export const createGeneratedCertificate = async (
  payload
) => {
  const { data } = await api.post(
    "/generated-certificates/generate",
    payload
  );

  return data;
};


// =====================================
// Update Certificate Details
// Existing function name preserved
// =====================================

export const updateCertificateDetails = async (
  id,
  payload
) => {
  if (!id) {
    throw new Error(
      "Generated certificate ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-certificates/${id}/update`,
    payload
  );

  return data;
};


// =====================================
// Generic Update Function
// =====================================

export const updateGeneratedCertificate = async (
  id,
  payload
) => {
  return updateCertificateDetails(
    id,
    payload
  );
};


// =====================================
// Request Certificate Revision
// =====================================

export const requestCertificateRevision = async (
  id,
  payload = {}
) => {
  if (!id) {
    throw new Error(
      "Generated certificate ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-certificates/${id}/revision`,
    payload
  );

  return data;
};


// =====================================
// Approve Certificate
// Existing function name preserved
// =====================================

export const approveCertificate = async (
  id,
  payload = {}
) => {
  if (!id) {
    throw new Error(
      "Generated certificate ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-certificates/${id}/approve`,
    payload
  );

  return data;
};


// =====================================
// Alias for New Components
// =====================================

export const approveGeneratedCertificate = async (
  id,
  payload = {}
) => {
  return approveCertificate(
    id,
    payload
  );
};


// =====================================
// Reject Certificate
// Existing function name preserved
// =====================================

export const rejectCertificate = async (
  id,
  reason
) => {
  if (!id) {
    throw new Error(
      "Generated certificate ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-certificates/${id}/reject`,
    {
      reason,
    }
  );

  return data;
};


// =====================================
// Alias for New Components
// =====================================

export const rejectGeneratedCertificate = async (
  id,
  payload = {}
) => {
  const reason =
    typeof payload === "string"
      ? payload
      : payload?.reason || "";

  return rejectCertificate(
    id,
    reason
  );
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  getPendingCertificates,
  getGeneratedCertificateById,
  createGeneratedCertificate,
  updateCertificateDetails,
  updateGeneratedCertificate,
  requestCertificateRevision,
  approveCertificate,
  approveGeneratedCertificate,
  rejectCertificate,
  rejectGeneratedCertificate,
};