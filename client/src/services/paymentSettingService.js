import api from "./api";

// =====================================================
// PAYMENT SETTINGS SERVICE
// Employee / Control payment configuration
// =====================================================

/**
 * Get active payment settings
 */
export const getPaymentSettings = async () => {
  try {
    const response = await api.get(
      "/payment-settings"
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "getPaymentSettings error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Update payment settings
 */
export const updatePaymentSettings = async (data) => {
  try {
    const response = await api.put(
      "/payment-settings",
      data
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "updatePaymentSettings error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Upload QR code
 */
export const uploadPaymentQR = async (file) => {
  try {
    if (!file) {
      throw new Error("QR image is required");
    }

    const formData = new FormData();

    formData.append("qrCode", file);

    const response = await api.post(
      "/payment-settings/qr",
      formData
    );

    return response?.data?.data || response?.data || null;
  } catch (error) {
    console.error(
      "uploadPaymentQR error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Remove QR code
 */
export const removePaymentQR = async () => {
  try {
    const response = await api.delete(
      "/payment-settings/qr"
    );

    return response?.data || {};
  } catch (error) {
    console.error(
      "removePaymentQR error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

export default {
  getPaymentSettings,
  updatePaymentSettings,
  uploadPaymentQR,
  removePaymentQR,
};