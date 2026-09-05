import api from "./api";

export const getDashboard = async (userId) => {
  const { data } = await api.get(`/ambassadors/dashboard/${userId}`);
  return data;
};

export const getProfile = async (userId) => {
  const { data } = await api.get(`/ambassadors/${userId}`);
  return data;
};

export const saveProfile = async (userId, body) => {
  const { data } = await api.put(`/ambassadors/${userId}`, body);
  return data;
};

export const getLeaderboard = async () => {
  const { data } = await api.get("/ambassadors/leaderboard");
  return data;
};