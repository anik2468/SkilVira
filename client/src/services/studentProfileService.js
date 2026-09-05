import api from "./api";

// Get Profile
export const getStudentProfile = async (userId) => {
  const { data } = await api.get(`/student-profile/${userId}`);
  return data;
};

// Create / Update Profile
export const saveStudentProfile = async (userId, body) => {
  const { data } = await api.post(
    `/student-profile/${userId}`,
    body
  );
  return data;
};

// Delete Profile
export const deleteStudentProfile = async (userId) => {
  const { data } = await api.delete(
    `/student-profile/${userId}`
  );
  return data;
};