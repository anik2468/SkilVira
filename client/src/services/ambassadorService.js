import api from "./api";


// =====================================================
// AMBASSADOR SERVICE
// =====================================================


// ======================================
// Ambassador Dashboard
// Existing function preserved
// ======================================

export const getDashboard = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.get(
    `/ambassadors/dashboard/${userId}`
  );

  return data;
};


// ======================================
// Ambassador Profile
// Existing function preserved
// ======================================

export const getProfile = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.get(
    `/ambassadors/${userId}`
  );

  return data;
};


// ======================================
// Save Ambassador Profile
// Existing function preserved
// ======================================

export const saveProfile = async (
  userId,
  body
) => {
  if (!userId) {
    throw new Error(
      "User ID is required"
    );
  }

  if (!body) {
    throw new Error(
      "Profile data is required"
    );
  }

  const { data } = await api.put(
    `/ambassadors/${userId}`,
    body
  );

  return data;
};


// ======================================
// Leaderboard
// Existing function preserved
// ======================================

export const getLeaderboard = async () => {
  const { data } = await api.get(
    "/ambassadors/leaderboard"
  );

  return data;
};


// =====================================================
// REFERRAL HELPERS
// =====================================================


// ======================================
// Get / Generate Referral Code
// ======================================

export const getReferralCode = async (
  userId
) => {
  if (!userId) {
    throw new Error(
      "User ID is required"
    );
  }

  const { data } = await api.get(
    `/referral/generate/${userId}`
  );

  return data;
};


// ======================================
// Validate Referral Code
// ======================================

export const validateReferralCode = async (
  referralCode
) => {
  if (!referralCode) {
    throw new Error(
      "Referral code is required"
    );
  }

  const { data } = await api.post(
    "/referral/validate",
    {
      referralCode,
    }
  );

  return data;
};


// ======================================
// Referral Stats
// ======================================

export const getReferralStats = async () => {
  const { data } = await api.get(
    "/ambassador/referrals"
  );

  return data;
};


// ======================================
// Ambassador Students
// ======================================

export const getAmbassadorStudents = async () => {
  const { data } = await api.get(
    "/ambassador/students"
  );

  return data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

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