import api from "./api";


// =====================================================
// ENROLLMENT SERVICE
// =====================================================


// ======================================
// Get My Courses
// Existing API preserved
// ======================================

export const getMyCourses = async (
  studentId
) => {
  if (!studentId) {
    throw new Error(
      "Student ID is required"
    );
  }

  const { data } = await api.get(
    `/enrollment/my-courses/${studentId}`
  );

  return data;
};


// ======================================
// Complete Lesson
// Existing API preserved
// ======================================

export const completeLesson = async (
  body
) => {
  if (!body) {
    throw new Error(
      "Lesson completion data is required"
    );
  }

  const { data } = await api.post(
    "/enrollment/lesson-complete",
    body
  );

  return data;
};


// ======================================
// Get Course Progress
// Existing API preserved
// ======================================

export const getCourseProgress = async (
  studentId,
  courseId
) => {
  if (!studentId) {
    throw new Error(
      "Student ID is required"
    );
  }

  if (!courseId) {
    throw new Error(
      "Course ID is required"
    );
  }

  const { data } = await api.get(
    `/enrollment/progress/${studentId}/${courseId}`
  );

  return data;
};


// =====================================================
// NEW ENROLLMENT APIs
// =====================================================


// ======================================
// Get My Enrollments
// ======================================

export const getMyEnrollments = async () => {
  const { data } = await api.get(
    "/enrollment/my-courses"
  );

  return data;
};


// ======================================
// Get Enrollment By ID
// ======================================

export const getEnrollmentById = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Enrollment ID is required"
    );
  }

  const { data } = await api.get(
    `/enrollment/${id}`
  );

  return data;
};


// ======================================
// Complete Lesson - New Format
// ======================================

export const completeEnrollmentLesson = async (
  enrollmentId,
  lessonId,
  payload = {}
) => {
  if (!enrollmentId) {
    throw new Error(
      "Enrollment ID is required"
    );
  }

  if (!lessonId) {
    throw new Error(
      "Lesson ID is required"
    );
  }

  const { data } = await api.post(
    `/enrollment/${enrollmentId}/lessons/${lessonId}/complete`,
    payload
  );

  return data;
};


// ======================================
// Get Enrollment Progress
// ======================================

export const getEnrollmentProgress = async (
  enrollmentId
) => {
  if (!enrollmentId) {
    throw new Error(
      "Enrollment ID is required"
    );
  }

  const { data } = await api.get(
    `/enrollment/${enrollmentId}/progress`
  );

  return data;
};


// ======================================
// Complete Enrollment
// ======================================

export const completeEnrollment = async (
  enrollmentId
) => {
  if (!enrollmentId) {
    throw new Error(
      "Enrollment ID is required"
    );
  }

  const { data } = await api.put(
    `/enrollment-completion/${enrollmentId}/complete`
  );

  return data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  // Existing
  getMyCourses,
  completeLesson,
  getCourseProgress,

  // New
  getMyEnrollments,
  getEnrollmentById,
  completeEnrollmentLesson,
  getEnrollmentProgress,
  completeEnrollment,
};