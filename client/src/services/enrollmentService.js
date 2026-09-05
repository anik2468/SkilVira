import api from "./api";



// ======================================
// Get My Courses
// ======================================

export const getMyCourses = async(studentId)=>{

const {data}=await api.get(

`/enrollment/my-courses/${studentId}`

);

return data;

};





// ======================================
// Complete Lesson
// ======================================

export const completeLesson = async(body)=>{

const {data}=await api.post(

"/enrollment/lesson-complete",

body

);

return data;

};





// ======================================
// Get Course Progress
// ======================================

export const getCourseProgress = async(
studentId,
courseId
)=>{


const {data}=await api.get(

`/enrollment/progress/${studentId}/${courseId}`

);


return data;


};