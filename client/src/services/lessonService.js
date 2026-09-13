import api from "./api";


// =====================================================
// LESSON SERVICE
// =====================================================


// ======================================
// Create Lesson
// ======================================

export const createLesson = async (
  body
) => {
  if (!body) {
    throw new Error(
      "Lesson data is required"
    );
  }

  const { data } = await api.post(
    "/lessons",
    body
  );

  return data;
};


// ======================================
// Get Course Lessons
// ======================================

export const getCourseLessons = async (
  courseId
) => {
  if (!courseId) {
    throw new Error(
      "Course ID is required"
    );
  }

  const { data } = await api.get(
    `/lessons/course/${courseId}`
  );

  return data;
};


// ======================================
// Alias (Compatibility)
// ======================================

export const getLessonsByCourse = async (
  courseId
) => {
  if (!courseId) {
    throw new Error(
      "Course ID is required"
    );
  }

  const { data } = await api.get(
    `/lessons/course/${courseId}`
  );

  return data;
};


// ======================================
// Get Single Lesson
// ======================================

export const getLesson = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Lesson ID is required"
    );
  }

  const { data } = await api.get(
    `/lessons/${id}`
  );

  return data;
};


// ======================================
// Update Lesson
// ======================================

export const updateLesson = async (
  id,
  body
) => {
  if (!id) {
    throw new Error(
      "Lesson ID is required"
    );
  }

  if (!body) {
    throw new Error(
      "Lesson data is required"
    );
  }

  const { data } = await api.put(
    `/lessons/${id}`,
    body
  );

  return data;
};


// ======================================
// Delete Lesson
// ======================================

export const deleteLesson = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Lesson ID is required"
    );
  }

  const { data } = await api.delete(
    `/lessons/${id}`
  );

  return data;
};


// ======================================
// Complete Lesson Progress
// Existing API preserved
// ======================================

export const completeLesson = async (
  body
) => {
  if (!body) {
    throw new Error(
      "Lesson progress data is required"
    );
  }

  const { data } = await api.post(
    "/lesson-progress/complete",
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
    `/lesson-progress/${studentId}/${courseId}`
  );

  return data;
};


// =====================================================
// ENROLLMENT-BASED PROGRESS APIs
// =====================================================


// ======================================
// Complete Lesson For Enrollment
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


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  createLesson,
  getCourseLessons,
  getLessonsByCourse,
  getLesson,
  updateLesson,
  deleteLesson,
  completeLesson,
  getCourseProgress,
  completeEnrollmentLesson,
  getEnrollmentProgress,
};