import api from "./api";


// ================================
// Get All Courses
// ================================
export const getCourses = async () => {

  const { data } =
    await api.get("/courses");

  return data;

};




// ================================
// Create Course
// ================================
export const createCourse = async (body) => {

  const { data } =
    await api.post(
      "/courses",
      body
    );

  return data;

};




// ================================
// Get Single Course
// ================================
export const getCourse = async (id) => {

  const { data } =
    await api.get(
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

  const { data } =
    await api.put(
      `/courses/${id}`,
      body
    );

  return data;

};




// ================================
// Delete Course
// ================================
export const deleteCourse = async (id) => {

  const { data } =
    await api.delete(
      `/courses/${id}`
    );

  return data;

};