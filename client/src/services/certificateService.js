import api from "./api";

// =====================================================
// CERTIFICATE SERVICE
// =====================================================


// ======================================
// Get All Certificates (Admin)
// ======================================

export const getCertificates = async () => {
  const { data } = await api.get(
    "/certificates"
  );

  return data;
};


// ======================================
// Student Certificates
// ======================================

export const getStudentCertificates = async (
  studentId
) => {
  if (!studentId) {
    throw new Error("Student ID is required");
  }

  const { data } = await api.get(
    `/certificates/student/${studentId}`
  );

  return data;
};


// ======================================
// Add Certificate
// ======================================

export const addCertificate = async (body) => {
  const { data } = await api.post(
    "/certificates",
    body
  );

  return data;
};


// ======================================
// Admin Verify Certificate
// ======================================

export const verifyCertificate = async (id) => {
  if (!id) {
    throw new Error("Certificate ID is required");
  }

  const { data } = await api.put(
    `/certificates/verify/${id}`
  );

  return data;
};


// ======================================
// Public QR Verification
// ======================================

export const verifyCertificateByCredential = async (
  credentialId
) => {
  if (!credentialId) {
    throw new Error(
      "Certificate credential ID is required"
    );
  }

  const { data } = await api.get(
    `/certificates/verify/${credentialId}`
  );

  return data;
};


// ======================================
// Reject Certificate
// ======================================

export const rejectCertificate = async (id) => {
  if (!id) {
    throw new Error("Certificate ID is required");
  }

  const { data } = await api.put(
    `/certificates/reject/${id}`
  );

  return data;
};


// ======================================
// Delete Certificate
// ======================================

export const deleteCertificate = async (id) => {
  if (!id) {
    throw new Error("Certificate ID is required");
  }

  const { data } = await api.delete(
    `/certificates/${id}`
  );

  return data;
};


// =====================================================
// GENERATED CERTIFICATE SYSTEM
// =====================================================


// ======================================
// Create Generated Certificate
// ======================================

export const createGeneratedCertificate = async (
  body
) => {
  const { data } = await api.post(
    "/generated-certificates/generate",
    body
  );

  return data;
};


// ======================================
// Get Pending Generated Certificates
// ======================================

export const getPendingCertificates = async () => {
  const { data } = await api.get(
    "/generated-certificates/pending"
  );

  return data;
};


// ======================================
// Get Generated Certificate By ID
// ======================================

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


// ======================================
// Update Generated Certificate
// ======================================

export const updateGeneratedCertificate = async (
  id,
  body
) => {
  if (!id) {
    throw new Error(
      "Generated certificate ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-certificates/${id}/update`,
    body
  );

  return data;
};


// ======================================
// Request Certificate Revision
// ======================================

export const requestCertificateRevision = async (
  id,
  body = {}
) => {
  if (!id) {
    throw new Error(
      "Generated certificate ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-certificates/${id}/revision`,
    body
  );

  return data;
};


// ======================================
// Approve Generated Certificate
// ======================================

export const approveGeneratedCertificate = async (
  id,
  body = {}
) => {
  if (!id) {
    throw new Error(
      "Generated certificate ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-certificates/${id}/approve`,
    body
  );

  return data;
};


// ======================================
// Reject Generated Certificate
// ======================================

export const rejectGeneratedCertificate = async (
  id,
  body = {}
) => {
  if (!id) {
    throw new Error(
      "Generated certificate ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-certificates/${id}/reject`,
    body
  );

  return data;
};


// =====================================================
// CERTIFICATE TEMPLATE SYSTEM
// =====================================================


// ======================================
// Get Certificate Templates
// ======================================

export const getCertificateTemplates = async (
  params = {}
) => {
  const { data } = await api.get(
    "/certificate-templates",
    {
      params,
    }
  );

  return data;
};


// ======================================
// Get Certificate Template By ID
// ======================================

export const getCertificateTemplateById = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Certificate template ID is required"
    );
  }

  const { data } = await api.get(
    `/certificate-templates/${id}`
  );

  return data;
};


// ======================================
// Create Certificate Template
// ======================================

export const createCertificateTemplate = async (
  formData
) => {
  const { data } = await api.post(
    "/certificate-templates",
    formData
  );

  return data;
};


// ======================================
// Update Certificate Template
// ======================================

export const updateCertificateTemplate = async (
  id,
  formData
) => {
  if (!id) {
    throw new Error(
      "Certificate template ID is required"
    );
  }

  const { data } = await api.put(
    `/certificate-templates/${id}`,
    formData
  );

  return data;
};


// ======================================
// Delete Certificate Template
// ======================================

export const deleteCertificateTemplate = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Certificate template ID is required"
    );
  }

  const { data } = await api.delete(
    `/certificate-templates/${id}`
  );

  return data;
};


// ======================================
// Activate Certificate Template
// ======================================

export const activateCertificateTemplate = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Certificate template ID is required"
    );
  }

  const { data } = await api.put(
    `/certificate-templates/${id}/activate`
  );

  return data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  // Existing
  getCertificates,
  getStudentCertificates,
  addCertificate,
  verifyCertificate,
  verifyCertificateByCredential,
  rejectCertificate,
  deleteCertificate,

  // Generated Certificate
  createGeneratedCertificate,
  getPendingCertificates,
  getGeneratedCertificateById,
  updateGeneratedCertificate,
  requestCertificateRevision,
  approveGeneratedCertificate,
  rejectGeneratedCertificate,

  // Certificate Templates
  getCertificateTemplates,
  getCertificateTemplateById,
  createCertificateTemplate,
  updateCertificateTemplate,
  deleteCertificateTemplate,
  activateCertificateTemplate,
};