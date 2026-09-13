import api from "./api";


// =====================================================
// CERTIFICATE TEMPLATE SERVICE
// =====================================================


// ======================================
// Create Certificate Template
// Existing API preserved
// ======================================

export const createCertificateTemplate = async (
  formData
) => {
  const { data } = await api.post(
    "/certificate-template",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};


// ======================================
// Get All Templates
// Existing API preserved
// ======================================

export const getCertificateTemplates = async () => {
  const { data } = await api.get(
    "/certificate-template"
  );

  return data;
};


// ======================================
// Get Active Template
// Existing API preserved
// ======================================

export const getActiveTemplate = async () => {
  const { data } = await api.get(
    "/certificate-template/active"
  );

  return data;
};


// ======================================
// Delete Template
// Existing API preserved
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
    `/certificate-template/${id}`
  );

  return data;
};


// =====================================================
// NEW TEMPLATE MANAGEMENT APIs
// =====================================================


// ======================================
// Get Templates - New Plural Endpoint
// ======================================

export const getAllCertificateTemplates = async (
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
// Get Template By ID
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
// Create Template - New Endpoint
// ======================================

export const createNewCertificateTemplate = async (
  formData
) => {
  if (!formData) {
    throw new Error(
      "Certificate template data is required"
    );
  }

  const { data } = await api.post(
    "/certificate-templates",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
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
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};


// ======================================
// Delete / Deactivate Template
// ======================================

export const removeCertificateTemplate = async (
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
  // Existing functions
  createCertificateTemplate,
  getCertificateTemplates,
  getActiveTemplate,
  deleteCertificateTemplate,

  // New functions
  getAllCertificateTemplates,
  getCertificateTemplateById,
  createNewCertificateTemplate,
  updateCertificateTemplate,
  removeCertificateTemplate,
  activateCertificateTemplate,
};