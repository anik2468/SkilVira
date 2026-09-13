import api from "./api";


// =====================================================
// UPLOAD SERVICE
// =====================================================


// ======================================
// Normal Upload
// ======================================

export const uploadFile = async (file) => {
  if (!file) {
    throw new Error(
      "File is required"
    );
  }

  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const { data } = await api.post(
    "/upload",
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


// ======================================
// Certificate Template Upload
// Existing function preserved
// ======================================

export const uploadCertificateTemplate =
  async (file) => {
    if (!file) {
      throw new Error(
        "Certificate template file is required"
      );
    }

    const formData = new FormData();

    formData.append(
      "certificateTemplate",
      file
    );

    const { data } = await api.post(
      "/certificate-templates",
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


// ======================================
// Offer Letter Template Upload
// ======================================

export const uploadOfferLetterTemplate =
  async (file) => {
    if (!file) {
      throw new Error(
        "Offer letter template file is required"
      );
    }

    const formData = new FormData();

    formData.append(
      "offerLetter",
      file
    );

    const { data } = await api.post(
      "/offer-letter-templates",
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


// ======================================
// Report Template Upload
// ======================================

export const uploadReportTemplate =
  async (file) => {
    if (!file) {
      throw new Error(
        "Report template file is required"
      );
    }

    const formData = new FormData();

    formData.append(
      "reportTemplate",
      file
    );

    const { data } = await api.post(
      "/report-templates",
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


// ======================================
// Payment Screenshot Upload
// ======================================

export const uploadPaymentScreenshot =
  async (file) => {
    if (!file) {
      throw new Error(
        "Payment screenshot is required"
      );
    }

    const formData = new FormData();

    formData.append(
      "paymentScreenshot",
      file
    );

    const { data } = await api.post(
      "/payments/manual",
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


// ======================================
// Resume Upload
// ======================================

export const uploadResume = async (
  file
) => {
  if (!file) {
    throw new Error(
      "Resume file is required"
    );
  }

  const formData = new FormData();

  formData.append(
    "resume",
    file
  );

  const { data } = await api.post(
    "/upload/resume",
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


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  uploadFile,
  uploadCertificateTemplate,
  uploadOfferLetterTemplate,
  uploadReportTemplate,
  uploadPaymentScreenshot,
  uploadResume,
};