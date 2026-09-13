import api from "./api";

// =====================================================
// STUDENT STATUS SERVICE
// =====================================================

/**
 * Get complete status of all student's purchases/applications
 *
 * Flow:
 * Payment
 * -> Enrollment
 * -> Offer Letter
 * -> Learning
 * -> Certificate
 * -> Report
 */
export const getMyStatus = async () => {
  try {
    const response = await api.get("/student-status");

    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error(
      "getMyStatus error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Get status of one payment / application
 */
export const getMyStatusById = async (id) => {
  try {
    if (!id) {
      throw new Error("Status ID is required");
    }

    const response = await api.get(
      `/student-status/${id}`
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "getMyStatusById error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

export default {
  getMyStatus,
  getMyStatusById,
};