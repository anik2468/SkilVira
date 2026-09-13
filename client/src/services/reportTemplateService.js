import api from "./api";


// =====================================================
// REPORT TEMPLATE SERVICE
// =====================================================


// =====================================
// Create Report Template
// =====================================

export const createReportTemplate = async (
  formData
) => {
  const { data } = await api.post(
    "/report-templates",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};


// =====================================
// Get All Report Templates
// =====================================

export const getReportTemplates = async (
  params = {}
) => {
  const { data } = await api.get(
    "/report-templates",
    {
      params,
    }
  );

  return data;
};


// =====================================
// Get Report Template By ID
// =====================================

export const getReportTemplateById = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Report template ID is required"
    );
  }

  const { data } = await api.get(
    `/report-templates/${id}`
  );

  return data;
};


// =====================================
// Update Report Template
// =====================================

export const updateReportTemplate = async (
  id,
  formData
) => {
  if (!id) {
    throw new Error(
      "Report template ID is required"
    );
  }

  const { data } = await api.put(
    `/report-templates/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};


// =====================================
// Delete / Deactivate Report Template
// =====================================

export const deleteReportTemplate = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Report template ID is required"
    );
  }

  const { data } = await api.delete(
    `/report-templates/${id}`
  );

  return data;
};


// =====================================
// Activate Report Template
// =====================================

export const activateReportTemplate = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Report template ID is required"
    );
  }

  const { data } = await api.put(
    `/report-templates/${id}/activate`
  );

  return data;
};


// =====================================
// Default Export
// =====================================

export default {
  createReportTemplate,
  getReportTemplates,
  getReportTemplateById,
  updateReportTemplate,
  deleteReportTemplate,
  activateReportTemplate,
};