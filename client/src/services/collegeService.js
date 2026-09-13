import api from "./api";


// =====================================================
// COLLEGE / UNIVERSITY SERVICE
// =====================================================


// ======================================
// Get Colleges
// Existing function preserved
// ======================================

export const getColleges = async () => {
  const { data } = await api.get(
    "/colleges"
  );

  return data;
};


// ======================================
// Get College By ID
// ======================================

export const getCollegeById = async (
  id
) => {
  if (!id) {
    throw new Error(
      "College ID is required"
    );
  }

  const { data } = await api.get(
    `/colleges/${id}`
  );

  return data;
};


// ======================================
// Create College
// ======================================

export const createCollege = async (
  body
) => {
  if (!body) {
    throw new Error(
      "College data is required"
    );
  }

  const { data } = await api.post(
    "/colleges",
    body
  );

  return data;
};


// ======================================
// Update College
// ======================================

export const updateCollege = async (
  id,
  body
) => {
  if (!id) {
    throw new Error(
      "College ID is required"
    );
  }

  if (!body) {
    throw new Error(
      "College data is required"
    );
  }

  const { data } = await api.put(
    `/colleges/${id}`,
    body
  );

  return data;
};


// ======================================
// Delete College
// ======================================

export const deleteCollege = async (
  id
) => {
  if (!id) {
    throw new Error(
      "College ID is required"
    );
  }

  const { data } = await api.delete(
    `/colleges/${id}`
  );

  return data;
};


// ======================================
// Verify College
// Existing function preserved
// ======================================

export const verifyCollege = async (
  id
) => {
  if (!id) {
    throw new Error(
      "College ID is required"
    );
  }

  const { data } = await api.put(
    `/colleges/verify/${id}`
  );

  return data;
};


// ======================================
// Block College
// Existing function preserved
// ======================================

export const blockCollege = async (
  id
) => {
  if (!id) {
    throw new Error(
      "College ID is required"
    );
  }

  const { data } = await api.put(
    `/colleges/block/${id}`
  );

  return data;
};


// ======================================
// Unblock College
// ======================================

export const unblockCollege = async (
  id
) => {
  if (!id) {
    throw new Error(
      "College ID is required"
    );
  }

  const { data } = await api.put(
    `/colleges/unblock/${id}`
  );

  return data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  getColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege,
  verifyCollege,
  blockCollege,
  unblockCollege,
};