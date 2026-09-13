import api from "./api";

// =====================================================
// STUDENT OFFER LETTER SERVICE
// =====================================================

/**
 * Get all approved offer letters of logged-in student
 */
export const getMyOfferLetters = async () => {
  try {
    const response = await api.get(
      "/student-offer-letters"
    );

    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error(
      "getMyOfferLetters error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Get one approved offer letter
 */
export const getMyOfferLetterById = async (id) => {
  try {
    if (!id) {
      throw new Error("Offer letter ID is required");
    }

    const response = await api.get(
      `/student-offer-letters/${id}`
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "getMyOfferLetterById error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

export default {
  getMyOfferLetters,
  getMyOfferLetterById,
};