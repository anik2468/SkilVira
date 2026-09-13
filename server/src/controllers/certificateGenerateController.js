import Certificate from "../models/Certificate.js";
import CertificateTemplate from "../models/CertificateTemplate.js";
import User from "../models/User.js";

import {
generateCertificate
} from "../services/certificateGenerator.js";

import path from "path";




// ======================================
// Generate Student Certificate
// ======================================


export const generateStudentCertificate = async(req,res)=>{


try{


const {
studentId,
courseId
}=req.body;





// ===============================
// Student
// ===============================


const student =
await User.findById(studentId);



if(!student){


return res.status(404).json({

success:false,

message:"Student not found"

});


}







// ===============================
// Template
// ===============================


const template =
await CertificateTemplate.findOne({

isActive:true

})
.sort({

createdAt:-1

});





if(!template){


return res.status(404).json({

success:false,

message:"Certificate template not found"

});


}







// ===============================
// Course
// ===============================


const Course =
(await import("../models/Course.js"))
.default;



const course =
await Course.findById(courseId);





if(!course){


return res.status(404).json({

success:false,

message:"Course not found"

});


}






// ===============================
// Template Path
// ===============================


const templatePath =

path.join(

process.cwd(),

template.templateFile

);







// ===============================
// Generate Certificate
// ===============================


const generated =

await generateCertificate({

templatePath,


positions:
template.positions || {},



studentName:

student.name,



courseName:

course.title,



issueDate:

new Date()
.toLocaleDateString(),


});







// ===============================
// Save Certificate
// ===============================


const certificate =

await Certificate.create({

student:studentId,


title:

course.title,



issuer:

"SkilVira",



issueDate:

new Date(),



credentialId:

generated.credentialId,



credentialUrl:

generated.verifyUrl,



certificateFile:

generated.certificateFile,



skills:

course.modules || [],



verified:true,


});







res.status(201).json({

success:true,


message:

"Certificate generated successfully",



certificate


});





}catch(error){


console.error(error);



res.status(500).json({

success:false,

message:error.message

});


}


};