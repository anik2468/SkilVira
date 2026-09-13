import api from "./api";


// =====================================================
// EMPLOYEE SERVICE
// =====================================================


// ================================
// Employee Dashboard
// ================================

export const getEmployeeDashboard = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.get(
    `/employee/dashboard/${userId}`
  );

  return data;
};


// ================================
// Pending Recruiters
// ================================

export const getPendingRecruiters = async () => {
  const { data } = await api.get(
    "/employee/recruiters/pending"
  );

  return data;
};


// ================================
// Approve Recruiter
// ================================

export const approveRecruiter = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Recruiter ID is required"
    );
  }

  const { data } = await api.put(
    `/employee/recruiters/approve/${id}`
  );

  return data;
};


// ================================
// Reject Recruiter
// ================================

export const rejectRecruiter = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Recruiter ID is required"
    );
  }

  const { data } = await api.put(
    `/employee/recruiters/reject/${id}`
  );

  return data;
};


// ================================
// Pending Internships
// ================================

export const getPendingInternships =
  async () => {
    const { data } = await api.get(
      "/employee/internships/pending"
    );

    return data;
  };


// ================================
// Approve Internship
// ================================

export const approveInternship = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Internship ID is required"
    );
  }

  const { data } = await api.put(
    `/employee/internships/approve/${id}`
  );

  return data;
};


// ================================
// Reject Internship
// ================================

export const rejectInternship = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Internship ID is required"
    );
  }

  const { data } = await api.put(
    `/employee/internships/reject/${id}`
  );

  return data;
};


// =====================================================
// PAYMENT VERIFICATION
// =====================================================


// ================================
// Pending Payments
// ================================

export const getPendingPayments = async () => {
  const { data } = await api.get(
    "/payments/pending"
  );

  return data;
};


// ================================
// Approve Payment
// ================================

export const approvePayment = async (
  id,
  payload = {}
) => {
  if (!id) {
    throw new Error(
      "Payment ID is required"
    );
  }

  const { data } = await api.put(
    `/payments/${id}/approve`,
    payload
  );

  return data;
};


// ================================
// Reject Payment
// ================================

export const rejectPayment = async (
  id,
  rejectionReason
) => {
  if (!id) {
    throw new Error(
      "Payment ID is required"
    );
  }

  const { data } = await api.put(
    `/payments/${id}/reject`,
    {
      rejectionReason:
        rejectionReason || "",
    }
  );

  return data;
};


// =====================================================
// OFFER LETTER VERIFICATION
// =====================================================


// ================================
// Pending Offer Letters
// ================================

export const getPendingOfferLetters =
  async () => {
    const { data } = await api.get(
      "/generated-offer-letter/pending"
    );

    return data;
  };


// ================================
// Get Offer Letter
// ================================

export const getOfferLetterById =
  async (id) => {
    if (!id) {
      throw new Error(
        "Offer letter ID is required"
      );
    }

    const { data } = await api.get(
      `/generated-offer-letter/${id}`
    );

    return data;
  };


// ================================
// Update Offer Letter
// ================================

export const updateOfferLetter = async (
  id,
  payload
) => {
  if (!id) {
    throw new Error(
      "Offer letter ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-offer-letter/${id}/update`,
    payload
  );

  return data;
};


// ================================
// Request Offer Letter Revision
// ================================

export const requestOfferLetterRevision =
  async (
    id,
    payload = {}
  ) => {
    if (!id) {
      throw new Error(
        "Offer letter ID is required"
      );
    }

    const { data } = await api.put(
      `/generated-offer-letter/${id}/revision`,
      payload
    );

    return data;
  };


// ================================
// Approve Offer Letter
// ================================

export const approveOfferLetter = async (
  id,
  payload = {}
) => {
  if (!id) {
    throw new Error(
      "Offer letter ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-offer-letter/${id}/approve`,
    payload
  );

  return data;
};


// ================================
// Reject Offer Letter
// ================================

export const rejectOfferLetter = async (
  id,
  payload = {}
) => {
  if (!id) {
    throw new Error(
      "Offer letter ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-offer-letter/${id}/reject`,
    payload
  );

  return data;
};


// =====================================================
// CERTIFICATE VERIFICATION
// =====================================================


// ================================
// Pending Certificates
// ================================

export const getPendingCertificates =
  async () => {
    const { data } = await api.get(
      "/generated-certificates/pending"
    );

    return data;
  };


// ================================
// Get Certificate By ID
// ================================

export const getGeneratedCertificate =
  async (id) => {
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


// ================================
// Update Certificate
// ================================

export const updateGeneratedCertificate =
  async (
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


// ================================
// Certificate Revision
// ================================

export const requestCertificateRevision =
  async (
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


// ================================
// Approve Certificate
// ================================

export const approveGeneratedCertificate =
  async (
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


// ================================
// Reject Certificate
// ================================

export const rejectGeneratedCertificate =
  async (
    id,
    payload = {}
  ) => {
    if (!id) {
      throw new Error(
        "Generated certificate ID is required"
      );
    }

    const { data } = await api.put(
      `/generated-certificates/${id}/reject`,
      payload
    );

    return data;
  };


// =====================================================
// REPORT VERIFICATION
// =====================================================


// ================================
// Pending Reports
// ================================

export const getPendingReports = async () => {
  const { data } = await api.get(
    "/generated-report/pending"
  );

  return data;
};


// ================================
// Get Report By ID
// ================================

export const getReportById = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Report ID is required"
    );
  }

  const { data } = await api.get(
    `/generated-report/${id}`
  );

  return data;
};


// ================================
// Update Report
// ================================

export const updateReport = async (
  id,
  payload
) => {
  if (!id) {
    throw new Error(
      "Report ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-report/${id}/update`,
    payload
  );

  return data;
};


// ================================
// Request Report Revision
// ================================

export const requestReportRevision = async (
  id,
  payload = {}
) => {
  if (!id) {
    throw new Error(
      "Report ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-report/${id}/revision`,
    payload
  );

  return data;
};


// ================================
// Approve Report
// ================================

export const approveReport = async (
  id,
  payload = {}
) => {
  if (!id) {
    throw new Error(
      "Report ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-report/${id}/approve`,
    payload
  );

  return data;
};


// ================================
// Reject Report
// ================================

export const rejectReport = async (
  id,
  payload = {}
) => {
  if (!id) {
    throw new Error(
      "Report ID is required"
    );
  }

  const { data } = await api.put(
    `/generated-report/${id}/reject`,
    payload
  );

  return data;
};


// =====================================================
// PAYMENT SETTINGS
// =====================================================


// ================================
// Get Payment Settings
// ================================

export const getPaymentSettings = async () => {
  const { data } = await api.get(
    "/payment-settings"
  );

  return data;
};


// ================================
// Update Payment Settings
// ================================

export const updatePaymentSettings =
  async (payload) => {
    if (!payload) {
      throw new Error(
        "Payment settings data is required"
      );
    }

    const { data } = await api.put(
      "/payment-settings",
      payload
    );

    return data;
  };


// ================================
// Upload Payment QR
// ================================

export const uploadPaymentQR = async (
  file
) => {
  if (!file) {
    throw new Error(
      "QR file is required"
    );
  }

  const formData = new FormData();

  formData.append(
    "qrCode",
    file
  );

  const { data } = await api.post(
    "/payment-settings/qr",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return data;
};


// ================================
// Remove Payment QR
// ================================

export const removePaymentQR = async () => {
  const { data } = await api.delete(
    "/payment-settings/qr"
  );

  return data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  getEmployeeDashboard,

  getPendingRecruiters,
  approveRecruiter,
  rejectRecruiter,

  getPendingInternships,
  approveInternship,
  rejectInternship,

  getPendingPayments,
  approvePayment,
  rejectPayment,

  getPendingOfferLetters,
  getOfferLetterById,
  updateOfferLetter,
  requestOfferLetterRevision,
  approveOfferLetter,
  rejectOfferLetter,

  getPendingCertificates,
  getGeneratedCertificate,
  updateGeneratedCertificate,
  requestCertificateRevision,
  approveGeneratedCertificate,
  rejectGeneratedCertificate,

  getPendingReports,
  getReportById,
  updateReport,
  requestReportRevision,
  approveReport,
  rejectReport,

  getPaymentSettings,
  updatePaymentSettings,
  uploadPaymentQR,
  removePaymentQR,
};