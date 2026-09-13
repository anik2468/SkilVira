import api from "./api";


// =====================================================
// DASHBOARD SERVICE
// =====================================================


// ======================================
// Student Dashboard
// Existing function preserved
// ======================================

export const getDashboardStats = async (userId) => {
  if (!userId) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.get(
    `/dashboard/${userId}`
  );

  return data;
};


// ======================================
// Admin Dashboard
// Existing function preserved
// ======================================

export const getAdminDashboard = async () => {
  const { data } = await api.get(
    "/dashboard/admin"
  );

  return data;
};


// =====================================================
// STUDENT DASHBOARD HELPERS
// =====================================================


// ======================================
// Refresh Student Dashboard
// ======================================

export const refreshStudentDashboard = async (
  userId
) => {
  return getDashboardStats(userId);
};


// ======================================
// Student Dashboard Stats Only
// ======================================

export const getStudentDashboardStats = async (
  userId
) => {
  const data = await getDashboardStats(userId);

  return data?.stats || {};
};


// ======================================
// Student Dashboard Courses
// ======================================

export const getStudentDashboardCourses = async (
  userId
) => {
  const data = await getDashboardStats(userId);

  return data?.myCourses || [];
};


// ======================================
// Student Dashboard Latest Internships
// ======================================

export const getStudentDashboardInternships =
  async (userId) => {
    const data = await getDashboardStats(userId);

    return data?.latestInternships || [];
  };


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  getDashboardStats,
  getAdminDashboard,
  refreshStudentDashboard,
  getStudentDashboardStats,
  getStudentDashboardCourses,
  getStudentDashboardInternships,
};