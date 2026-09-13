import api from "./api";

// =====================================================
// NOTIFICATION SERVICE
// =====================================================

/**
 * Get logged-in user's notifications
 */
export const getNotifications = async (params = {}) => {
  try {
    const response = await api.get(
      "/notifications",
      {
        params,
      }
    );

    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error(
      "getNotifications error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Mark one notification as read
 */
export const markNotificationRead = async (id) => {
  try {
    if (!id) {
      throw new Error("Notification ID is required");
    }

    const response = await api.put(
      `/notifications/${id}/read`
    );

    return response?.data || {};
  } catch (error) {
    console.error(
      "markNotificationRead error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async () => {
  try {
    const response = await api.put(
      "/notifications/read-all"
    );

    return response?.data || {};
  } catch (error) {
    console.error(
      "markAllNotificationsRead error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (id) => {
  try {
    if (!id) {
      throw new Error("Notification ID is required");
    }

    const response = await api.delete(
      `/notifications/${id}`
    );

    return response?.data || {};
  } catch (error) {
    console.error(
      "deleteNotification error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

export default {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};