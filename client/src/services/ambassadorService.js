import api from "./api";

const getStoredUserId = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    return user?.id || user?._id || user?.userId || "";
  } catch {
    return "";
  }
};

const resolveUserId = (userId) => {
  const id = userId || getStoredUserId();

  if (!id) {
    throw new Error("Ambassador user ID is required.");
  }

  return id;
};

// Dashboard
export const getDashboard = async (userId) => {
  const id = resolveUserId(userId);

  const { data } = await api.get(
    `/ambassador/dashboard/${id}`
  );

  return data;
};

// Profile
export const getProfile = async (userId) => {
  const id = resolveUserId(userId);

  const { data } = await api.get(
    `/ambassador/profile/${id}`
  );

  return data;
};

// Save profile
export const saveProfile = async (userId, body) => {
  const id = resolveUserId(userId);

  if (!body || typeof body !== "object") {
    throw new Error("Profile data is required.");
  }

  const { data } = await api.put(
    `/ambassador/profile/${id}`,
    body
  );

  return data;
};

// Public leaderboard
export const getLeaderboard = async () => {
  const { data } = await api.get(
    "/ambassador/leaderboard"
  );

  return data;
};

// Generate/get referral code
export const getReferralCode = async (userId) => {
  const id = resolveUserId(userId);

  const { data } = await api.get(
    `/referral/generate/${id}`
  );

  return data;
};

// Validate referral code
export const validateReferralCode = async (
  referralCode,
  internshipId
) => {
  if (!referralCode) {
    throw new Error("Referral code is required.");
  }

  const payload = {
    code: String(referralCode).trim(),
  };

  if (internshipId) {
    payload.internshipId = internshipId;
  }

  const { data } = await api.post(
    "/referral/validate",
    payload
  );

  return data;
};

// Referral analytics
export const getReferralStats = async (userId) => {
  const id = resolveUserId(userId);

  const { data } = await api.get(
    `/ambassador/referrals/${id}`
  );

  return data;
};

// Ambassador's referred students
export const getAmbassadorStudents = async (userId) => {
  const id = resolveUserId(userId);

  const { data } = await api.get(
    `/ambassador/students/${id}`
  );

  return data;
};

export default {
  getDashboard,
  getProfile,
  saveProfile,
  getLeaderboard,
  getReferralCode,
  validateReferralCode,
  getReferralStats,
  getAmbassadorStudents,
};