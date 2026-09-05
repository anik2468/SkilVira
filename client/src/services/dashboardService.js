import api from "./api";


// ================================
// Student Dashboard
// ================================

export const getDashboardStats = async (userId) => {

  const { data } = await api.get(
    `/dashboard/${userId}`
  );

  return data;

};



// ================================
// Admin Dashboard
// ================================

export const getAdminDashboard = async () => {

  const { data } = await api.get(
    "/dashboard/admin"
  );

  return data;

};