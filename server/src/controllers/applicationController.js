import Application from "../models/Application.js";
import Internship from "../models/Internship.js";


// =====================================
// Apply Internship
// =====================================
export const applyInternship = async(req,res)=>{

try{


const {
 student,
 internship,
 resume,
 coverLetter,
 portfolio,
}=req.body;



if(!student || !internship || !resume){

return res.status(400).json({

success:false,

message:
"Student, Internship and Resume are required."

});

}




const internshipData =
await Internship.findById(internship);



if(!internshipData){

return res.status(404).json({

success:false,

message:
"Internship not found."

});

}




if(

internshipData.approvalStatus !== "Approved" ||

internshipData.status !== "Open" ||

internshipData.isDeleted

){

return res.status(400).json({

success:false,

message:
"This internship is not accepting applications."

});

}





const alreadyApplied =
await Application.findOne({

student,

internship,

isDeleted:false,

});



if(alreadyApplied){

return res.status(400).json({

success:false,

message:
"You have already applied for this internship."

});

}





const application =
await Application.create({

student,

internship,

recruiter:
internshipData.recruiter,

resume,

coverLetter,

portfolio,

});




internshipData.applicants += 1;

await internshipData.save();





res.status(201).json({

success:true,

message:
"Application submitted successfully.",

application,

});



}catch(error){

console.error(error);


res.status(500).json({

success:false,

message:error.message,

});

}

};







// =====================================
// Student Applications
// =====================================
export const getStudentApplications =
async(req,res)=>{


try{


const applications =
await Application.find({

student:req.params.studentId,

isDeleted:false,

})

.populate(
"internship"
)

.sort({

createdAt:-1,

});



res.json({

success:true,

applications,

});



}catch(error){

res.status(500).json({

success:false,

message:error.message,

});

}

};








// =====================================
// Recruiter Applications
// =====================================
export const getRecruiterApplications =
async(req,res)=>{


try{


const applications =
await Application.find({

recruiter:req.params.recruiterId,

isDeleted:false,

})

.populate(
"student",
"name email"
)

.populate(
"internship",
"title company"
)

.sort({

createdAt:-1,

});




res.json({

success:true,

applications,

});



}catch(error){


res.status(500).json({

success:false,

message:error.message,

});


}

};









// =====================================
// All Applications Admin
// =====================================
export const getAllApplications =
async(req,res)=>{


try{


const applications =
await Application.find({

isDeleted:false,

})

.populate(
"student",
"name email"
)

.populate(
"internship",
"title company"
)

.populate(
"recruiter",
"name email"
)

.sort({

createdAt:-1,

});




res.json({

success:true,

count:applications.length,

applications,

});



}catch(error){


res.status(500).json({

success:false,

message:error.message,

});


}

};









// =====================================
// Update Application Status
// =====================================
export const updateApplicationStatus =
async(req,res)=>{


try{


const {
status,
recruiterRemarks,
}=req.body;



const allowedStatus=[

"Pending",

"Reviewed",

"Shortlisted",

"Interview",

"Selected",

"Rejected"

];



if(!allowedStatus.includes(status)){


return res.status(400).json({

success:false,

message:
"Invalid application status."

});


}





const application =
await Application.findByIdAndUpdate(

req.params.id,

{

status,

recruiterRemarks:
recruiterRemarks || "",

},

{

new:true,

runValidators:true,

}

);




if(!application){

return res.status(404).json({

success:false,

message:
"Application not found."

});

}





res.json({

success:true,

message:
"Application status updated.",

application,

});



}catch(error){


res.status(500).json({

success:false,

message:error.message,

});


}

};









// =====================================
// Withdraw Application
// =====================================
export const withdrawApplication =
async(req,res)=>{


try{


const application =
await Application.findById(
req.params.id
);



if(!application){


return res.status(404).json({

success:false,

message:
"Application not found."

});


}



application.isDeleted=true;


await application.save();




await Internship.findByIdAndUpdate(

application.internship,

{

$inc:{

applicants:-1,

}

}

);




res.json({

success:true,

message:
"Application withdrawn successfully."

});



}catch(error){


res.status(500).json({

success:false,

message:error.message,

});


}

};









// =====================================
// Recruiter Stats
// =====================================
export const recruiterApplicationStats =
async(req,res)=>{


try{


const recruiter =
req.params.recruiterId;



const total =
await Application.countDocuments({

recruiter,

isDeleted:false,

});



const pending =
await Application.countDocuments({

recruiter,

status:"Pending",

isDeleted:false,

});



const shortlisted =
await Application.countDocuments({

recruiter,

status:"Shortlisted",

isDeleted:false,

});



const selected =
await Application.countDocuments({

recruiter,

status:"Selected",

isDeleted:false,

});



const rejected =
await Application.countDocuments({

recruiter,

status:"Rejected",

isDeleted:false,

});




res.json({

success:true,

stats:{

total,

pending,

shortlisted,

selected,

rejected,

}

});



}catch(error){


res.status(500).json({

success:false,

message:error.message,

});


}

};









// =====================================
// Application Details
// =====================================
export const getApplicationById =
async(req,res)=>{


try{


const application =
await Application.findById(

req.params.id

)

.populate(
"student",
"name email"
)

.populate(
"internship"
)

.populate(
"recruiter",
"name email"
);




if(!application){

return res.status(404).json({

success:false,

message:
"Application not found."

});

}





res.json({

success:true,

application,

});



}catch(error){


res.status(500).json({

success:false,

message:error.message,

});


}

};