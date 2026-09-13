import api from "./api";


// =====================================================
// COURSE SERVICE
// =====================================================


// ================================
// Get All Courses
// ================================

export const getCourses = async () => {
  const { data } = await api.get(
    "/courses"
  );

  return data;
};


// ================================
// Create Course
// ================================

export const createCourse = async (
  body
) => {
  if (!body) {
    throw new Error(
      "Course data is required"
    );
  }

  const { data } = await api.post(
    "/courses",
    body
  );

  return data;
};


// ================================
// Get Single Course
// ================================

export const getCourse = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Course ID is required"
    );
  }

  const { data } = await api.get(
    `/courses/${id}`
  );

  return data;
};


// ================================
// Update Course
// ================================

export const updateCourse = async (
  id,
  body
) => {
  if (!id) {
    throw new Error(
      "Course ID is required"
    );
  }

  if (!body) {
    throw new Error(
      "Course data is required"
    );
  }

  const { data } = await api.put(
    `/courses/${id}`,
    body
  );

  return data;
};


// ================================
// Delete Course
// ================================

export const deleteCourse = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Course ID is required"
    );
  }

  const { data } = await api.delete(
    `/courses/${id}`
  );

  return data;
};


// =====================================================
// STUDENT / COURSE HELPERS
// =====================================================


// ================================
// Get Published Courses
// ================================

export const getPublishedCourses = async (
  params = {}
) => {
  const { data } = await api.get(
    "/courses",
    {
      params: {
        ...params,
        status: "published",
      },
    }
  );

  return data;
};


// ================================
// Search Courses
// ================================

export const searchCourses = async (
 params = {}
) => {
  const { data } = await api.get(
    "/courses",
    {
      params,
    }
  );

  return data;
};


// ================================
// Get Course Lessons
// ================================

export const getCourseLessons = async (
 courseId
) => {
  if (!courseId) {
    throw new Error(
      "Course ID is required"
    );
  }

  const { data } = await api.get(
    `/courses/${courseId}/lessons`
  );

  return data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getPublishedCourses,
  searchCourses,
  getCourseLessons,
};