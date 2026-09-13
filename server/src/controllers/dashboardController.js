import User from "../models/User.js";
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import StudentProfile from "../models/StudentProfile.js";
import Enrollment from "../models/Enrollment.js";
import Certificate from "../models/Certificate.js";




// ======================================
// Student Dashboard
// ======================================

export const getDashboardStats = async(req,res)=>{


try{


const userId =
req.params.userId || req.query.userId;



let applied = 0;
let shortlisted = 0;
let selected = 0;
let rejected = 0;
let profileCompletion = 0;
let courses = 0;
let certificates = 0;



let myCourses = [];

let recentApplications = [];




if(userId){



applied =
await Application.countDocuments({

student:userId,

isDeleted:false,

});



shortlisted =
await Application.countDocuments({

student:userId,

status:"Shortlisted",

isDeleted:false,

});



selected =
await Application.countDocuments({

student:userId,

status:"Selected",

isDeleted:false,

});



rejected =
await Application.countDocuments({

student:userId,

status:"Rejected",

isDeleted:false,

});






courses =
await Enrollment.countDocuments({

student:userId,

isDeleted:false,

});






certificates =
await Certificate.countDocuments({

student:userId,

isDeleted:false,

});







const profile =
await StudentProfile.findOne({

user:userId

});



profileCompletion =
profile?.profileCompleted || 0;







myCourses =

await Enrollment.find({

student:userId,

isDeleted:false

})

.populate("course")

.limit(4);







recentApplications =

await Application.find({

student:userId,

isDeleted:false

})

.populate("internship")

.sort({

createdAt:-1

})

.limit(5);



}








const latestInternships =

await Internship.find({

approvalStatus:"Approved",

status:"Open",

isDeleted:false,

})

.sort({

featured:-1,

createdAt:-1

})

.limit(6);








const featuredInternships =

await Internship.find({

featured:true,

approvalStatus:"Approved",

status:"Open",

isDeleted:false,

})

.limit(6);








const totalInternships =

await Internship.countDocuments({

approvalStatus:"Approved",

status:"Open",

isDeleted:false,

});







const totalStudents =

await User.countDocuments({

role:"student"

});







const totalRecruiters =

await User.countDocuments({

role:"recruiter"

});









res.status(200).json({

success:true,


stats:{


applied,

shortlisted,

selected,

rejected,


saved:0,


certificates,


courses,


profileCompletion,


totalInternships,


totalStudents,


totalRecruiters,


},



latestInternships,


featuredInternships,


myCourses,


recentApplications,



});







}catch(error){


console.log(error);


res.status(500).json({

success:false,

message:error.message

});


}


};