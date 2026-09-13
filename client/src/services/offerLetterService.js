import api from "./api";

// =====================================================
// OFFER LETTER SERVICE
// =====================================================

/**
 * Get offer letter templates
 */
export const getOfferLetterTemplates = async (params = {}) => {
  try {
    const response = await api.get(
      "/offer-letter-templates",
      {
        params,
      }
    );

    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error(
      "getOfferLetterTemplates error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Get one offer letter template
 */
export const getOfferLetterTemplateById = async (id) => {
  try {
    if (!id) {
      throw new Error(
        "Offer letter template ID is required"
      );
    }

    const response = await api.get(
      `/offer-letter-templates/${id}`
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "getOfferLetterTemplateById error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Get pending generated offer letters
 */
export const getPendingOfferLetters = async () => {
  try {
    const response = await api.get(
      "/generated-offer-letter/pending"
    );

    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error(
      "getPendingOfferLetters error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Get approved offer letters
 */
export const getApprovedOfferLetters = async () => {
  try {
    const response = await api.get(
      "/generated-offer-letter/approved"
    );

    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error(
      "getApprovedOfferLetters error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Get generated offer letter by ID
 */
export const getGeneratedOfferLetterById = async (id) => {
  try {
    if (!id) {
      throw new Error(
        "Generated offer letter ID is required"
      );
    }

    const response = await api.get(
      `/generated-offer-letter/${id}`
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "getGeneratedOfferLetterById error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Update generated offer letter
 */
export const updateGeneratedOfferLetter = async (
  id,
  data
) => {
  try {
    if (!id) {
      throw new Error(
        "Generated offer letter ID is required"
      );
    }

    const response = await api.put(
      `/generated-offer-letter/${id}/update`,
      data
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "updateGeneratedOfferLetter error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Request revision
 */
export const requestOfferLetterRevision = async (
  id,
  data
) => {
  try {
    if (!id) {
      throw new Error(
        "Generated offer letter ID is required"
      );
    }

    const response = await api.put(
      `/generated-offer-letter/${id}/revision`,
      data
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "requestOfferLetterRevision error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Approve generated offer letter
 */
export const approveOfferLetter = async (
  id,
  data = {}
) => {
  try {
    if (!id) {
      throw new Error(
        "Generated offer letter ID is required"
      );
    }

    const response = await api.put(
      `/generated-offer-letter/${id}/approve`,
      data
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "approveOfferLetter error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Reject generated offer letter
 */
export const rejectOfferLetter = async (
  id,
  data = {}
) => {
  try {
    if (!id) {
      throw new Error(
        "Generated offer letter ID is required"
      );
    }

    const response = await api.put(
      `/generated-offer-letter/${id}/reject`,
      data
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "rejectOfferLetter error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

export default {
  getOfferLetterTemplates,
  getOfferLetterTemplateById,
  getPendingOfferLetters,
  getApprovedOfferLetters,
  getGeneratedOfferLetterById,
  updateGeneratedOfferLetter,
  requestOfferLetterRevision,
  approveOfferLetter,
  rejectOfferLetter,
};