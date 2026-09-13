import api from "./api";


// =====================================================
// REPORT SERVICE
// =====================================================


// =====================================
// Create Generated Report
// =====================================

export const createGeneratedReport = async (
  payload
) => {
  const { data } = await api.post(
    "/generated-report/generate",
    payload
  );

  return data;
};


// =====================================
// Get Pending Reports
// =====================================

export const getPendingReports = async () => {
  const { data } = await api.get(
    "/generated-report/pending"
  );

  return data;
};


// =====================================
// Get Approved Reports
// =====================================

export const getApprovedReports = async () => {
  const { data } = await api.get(
    "/generated-report/approved"
  );

  return data;
};


// =====================================
// Get Report By ID
// =====================================

export const getReportById = async (id) => {
  if (!id) {
    throw new Error("Report ID is required");
  }

  const { data } = await api.get(
    `/generated-report/${id}`
  );

  return data;
};


// =====================================
// Update Report
// =====================================

export const updateReport = async (
  id,
  payload
) => {
  if (!id) {
    throw new Error("Report ID is required");
  }

  const { data } = await api.put(
    `/generated-report/${id}/update`,
    payload
  );

  return data;
};


// =====================================
// Request Report Revision
// =====================================

export const requestReportRevision = async (
  id,
  payload = {}
) => {
  if (!id) {
    throw new Error("Report ID is required");
  }

  const { data } = await api.put(
    `/generated-report/${id}/revision`,
    payload
  );

  return data;
};


// =====================================
// Approve Report
// =====================================

export const approveReport = async (
  id,
  payload = {}
) => {
  if (!id) {
    throw new Error("Report ID is required");
  }

  const { data } = await api.put(
    `/generated-report/${id}/approve`,
    payload
  );

  return data;
};


// =====================================
// Reject Report
// =====================================

export const rejectReport = async (
  id,
  payload = {}
) => {
  if (!id) {
    throw new Error("Report ID is required");
  }

  const { data } = await api.put(
    `/generated-report/${id}/reject`,
    payload
  );

  return data;
};


// =====================================
// Default Export
// =====================================

export default {
  createGeneratedReport,
  getPendingReports,
  getApprovedReports,
  getReportById,
  updateReport,
  requestReportRevision,
  approveReport,
  rejectReport,
};