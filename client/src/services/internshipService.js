import api from "./api";


// =====================================================
// INTERNSHIP SERVICE
// =====================================================


// =====================================================
// PUBLIC / STUDENT
// =====================================================


// ======================================
// All Internships
// ======================================

export const getInternships = async (
  params = {}
) => {
  const { data } = await api.get(
    "/internships",
    {
      params,
    }
  );

  return data;
};


// ======================================
// Internship Details
// ======================================

export const getInternshipById = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Internship ID is required"
    );
  }

  const { data } = await api.get(
    `/internships/${id}`
  );

  return data;
};


// ======================================
// Featured Internships
// ======================================

export const getFeaturedInternships = async (
  params = {}
) => {
  const { data } = await api.get(
    "/internships/featured",
    {
      params,
    }
  );

  return data;
};


// ======================================
// Latest Internships
// ======================================

export const getLatestInternships = async (
  params = {}
) => {
  const { data } = await api.get(
    "/internships/latest",
    {
      params,
    }
  );

  return data;
};


// ======================================
// Internship Search
// ======================================

export const searchInternships = async (
  params = {}
) => {
  const { data } = await api.get(
    "/internships",
    {
      params,
    }
  );

  return data;
};


// =====================================================
// RECRUITER
// =====================================================


// ======================================
// Recruiter's Internships
// ======================================

export const getRecruiterInternships = async (
  recruiterId
) => {
  if (!recruiterId) {
    throw new Error(
      "Recruiter ID is required"
    );
  }

  const { data } = await api.get(
    `/internships/recruiter/${recruiterId}`
  );

  return data;
};


// ======================================
// Create Internship
// ======================================

export const createInternship = async (
  body
) => {
  if (!body) {
    throw new Error(
      "Internship data is required"
    );
  }

  const { data } = await api.post(
    "/internships",
    body
  );

  return data;
};


// ======================================
// Update Internship
// ======================================

export const updateInternship = async (
  id,
  body
) => {
  if (!id) {
    throw new Error(
      "Internship ID is required"
    );
  }

  if (!body) {
    throw new Error(
      "Internship data is required"
    );
  }

  const { data } = await api.put(
    `/internships/${id}`,
    body
  );

  return data;
};


// ======================================
// Delete Internship
// ======================================

export const deleteInternship = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Internship ID is required"
    );
  }

  const { data } = await api.delete(
    `/internships/${id}`
  );

  return data;
};


// ======================================
// Create Internship With Image
// ======================================

export const createInternshipWithImage = async (
  formData
) => {
  if (!formData) {
    throw new Error(
      "Internship data is required"
    );
  }

  const { data } = await api.post(
    "/internships",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};


// ======================================
// Update Internship With Image
// ======================================

export const updateInternshipWithImage =
  async (
    id,
    formData
  ) => {
    if (!id) {
      throw new Error(
        "Internship ID is required"
      );
    }

    if (!formData) {
      throw new Error(
        "Internship data is required"
      );
    }

    const { data } = await api.put(
      `/internships/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  };


// =====================================================
// ADMIN / CONTROL
// =====================================================


// ======================================
// Approve Internship
// ======================================

export const approveInternship = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Internship ID is required"
    );
  }

  const { data } = await api.put(
    `/internships/approve/${id}`
  );

  return data;
};


// ======================================
// Reject Internship
// ======================================

export const rejectInternship = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Internship ID is required"
    );
  }

  const { data } = await api.put(
    `/internships/reject/${id}`
  );

  return data;
};


// ======================================
// Feature Internship
// ======================================

export const featureInternship = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Internship ID is required"
    );
  }

  const { data } = await api.put(
    `/internships/feature/${id}`
  );

  return data;
};


// ======================================
// Unfeature Internship
// ======================================

export const unfeatureInternship = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Internship ID is required"
    );
  }

  const { data } = await api.put(
    `/internships/unfeature/${id}`
  );

  return data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  // Public / Student
  getInternships,
  getInternshipById,
  getFeaturedInternships,
  getLatestInternships,
  searchInternships,

  // Recruiter
  getRecruiterInternships,
  createInternship,
  updateInternship,
  deleteInternship,
  createInternshipWithImage,
  updateInternshipWithImage,

  // Admin / Control
  approveInternship,
  rejectInternship,
  featureInternship,
  unfeatureInternship,
};