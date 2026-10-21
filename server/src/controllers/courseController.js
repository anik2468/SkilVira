import Course from "../models/Course.js";



// ======================================
// Create Course
// ======================================

export const createCourse = async(req,res)=>{


try{


const {

title,

description,

category,

level,

duration,

price,

registrationDeadline,

startDate,

endDate,

thumbnail,

modules,

isFeatured,

}=req.body;




if(!title){


return res.status(400).json({

success:false,

message:"Course title required"

});


}





const course = await Course.create({

title,

description,

category,

level,

duration,

price,

registrationDeadline,

startDate,

endDate,

thumbnail,

modules,

isFeatured,


createdBy:
req.user?.id || null,


});






res.status(201).json({

success:true,

message:
"Course created successfully",

course,

});





}catch(error){


console.log(error);


res.status(500).json({

success:false,

message:error.message

});


}


};









// ======================================
// Get All Courses
// ======================================


export const getCourses = async(req,res)=>{


try{


const courses =

await Course.find({

isDeleted:false,

})

.populate(
"createdBy",
"name email"
)

.sort({

createdAt:-1

});




res.json({

success:true,

courses,

});




}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ======================================
// Get Active Courses Public
// ======================================


export const getActiveCourses = async(req,res)=>{


try{


const courses =

await Course.find({

status:"active",

isDeleted:false,

})

.sort({

isFeatured:-1,

createdAt:-1

});




res.json({

success:true,

courses

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ======================================
// Get Single Course
// ======================================


export const getCourse = async(req,res)=>{


try{


const course =

await Course.findOne({

_id:req.params.id,

isDeleted:false,

})

.populate(
"createdBy",
"name email"
);





if(!course){


return res.status(404).json({

success:false,

message:"Course not found"

});


}





course.views += 1;

await course.save();





res.json({

success:true,

course

});





}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ======================================
// Update Course
// ======================================


export const updateCourse = async(req,res)=>{


try{


const course =

await Course.findByIdAndUpdate(

req.params.id,

req.body,

{

new:true

}

);





res.json({

success:true,

message:"Course updated",

course

});





}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ======================================
// Delete Course Soft Delete
// ======================================


export const deleteCourse = async(req,res)=>{


try{


await Course.findByIdAndUpdate(

req.params.id,

{

isDeleted:true,

status:"inactive"

}

);





res.json({

success:true,

message:"Course deleted"

});





}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};