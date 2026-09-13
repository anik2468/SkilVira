import Lesson from "../models/Lesson.js";


// Create Lesson

export const createLesson = async(req,res)=>{

try{


const lesson =
await Lesson.create(req.body);


res.status(201).json({

success:true,

lesson

});


}catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};




// Get Course Lessons

export const getCourseLessons = async(req,res)=>{

try{


const lessons =
await Lesson.find({

course:req.params.courseId,

isPublished:true

})
.sort({
order:1
});



res.json({

success:true,

lessons

});



}catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};