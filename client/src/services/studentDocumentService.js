import api from "./api";

// =====================================================
// STUDENT DOCUMENT SERVICE
// =====================================================

/**
 * Get all approved documents
 */
export const getMyDocuments = async () => {
  try {
    const response = await api.get("/student-documents");

    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error(
      "getMyDocuments error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Get student's approved certificates
 */
export const getMyCertificates = async () => {
  try {
    const response = await api.get(
      "/student-documents/certificates"
    );

    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error(
      "getMyCertificates error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Get student's approved reports
 */
export const getMyReports = async () => {
  try {
    const response = await api.get(
      "/student-documents/reports"
    );

    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error(
      "getMyReports error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Get one certificate by ID
 */
export const getMyCertificateById = async (id) => {
  try {
    if (!id) {
      throw new Error("Certificate ID is required");
    }

    const response = await api.get(
      `/student-documents/certificates/${id}`
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "getMyCertificateById error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Get one report by ID
 */
export const getMyReportById = async (id) => {
  try {
    if (!id) {
      throw new Error("Report ID is required");
    }

    const response = await api.get(
      `/student-documents/reports/${id}`
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "getMyReportById error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

export default {
  getMyDocuments,
  getMyCertificates,
  getMyReports,
  getMyCertificateById,
  getMyReportById,
};