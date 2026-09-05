import api from "./api";



// ======================================
// Create Lesson
// ======================================

export const createLesson = async (body) => {

const { data } = await api.post(
"/lessons",
body
);

return data;

};





// ======================================
// Get Course Lessons
// ======================================

export const getCourseLessons = async (courseId) => {

const { data } = await api.get(
`/lessons/course/${courseId}`
);

return data;

};





// ======================================
// Alias (Compatibility)
// ======================================

export const getLessonsByCourse = async (courseId) => {

const { data } = await api.get(
`/lessons/course/${courseId}`
);

return data;

};





// ======================================
// Get Single Lesson
// ======================================

export const getLesson = async (id) => {

const { data } = await api.get(
`/lessons/${id}`
);

return data;

};





// ======================================
// Update Lesson
// ======================================

export const updateLesson = async (id, body) => {

const { data } = await api.put(
`/lessons/${id}`,
body
);

return data;

};





// ======================================
// Delete Lesson
// ======================================

export const deleteLesson = async (id) => {

const { data } = await api.delete(
`/lessons/${id}`
);

return data;

};





// ======================================
// Complete Lesson Progress
// ======================================

export const completeLesson = async (body) => {

const { data } = await api.post(
"/lesson-progress/complete",
body
);

return data;

};





// ======================================
// Get Course Progress
// ======================================

export const getCourseProgress = async (
studentId,
courseId
) => {

const { data } = await api.get(
`/lesson-progress/${studentId}/${courseId}`
);

return data;

};