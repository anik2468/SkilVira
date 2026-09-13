import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";

import StudentProfile from "../models/StudentProfile.js";
import RecruiterProfile from "../models/RecruiterProfile.js";
import EmployeeProfile from "../models/EmployeeProfile.js";
import AmbassadorProfile from "../models/AmbassadorProfile.js";




// ========================================
// Register
// ========================================

export const register = async(req,res)=>{


try{


const {

name,

email,

password,

role,

referralCode,

}=req.body;





if(
!name ||
!email ||
!password ||
!role
){

return res.status(400).json({

success:false,

message:"All fields are required."

});

}






const allowedRoles=[

"student",

"recruiter",

"ambassador",

"employee",

];





if(!allowedRoles.includes(role)){


return res.status(403).json({

success:false,

message:"Registration not allowed."

});


}







const existingUser =
await User.findOne({

email:email.toLowerCase()

});





if(existingUser){


return res.status(409).json({

success:false,

message:"Email already registered."

});


}







let referredBy=null;



// ===============================
// Referral Check
// ===============================


if(
role==="student" &&
referralCode
){


const ambassador =
await User.findOne({

referralCode,

role:"ambassador",

ambassadorApproved:true

});





if(ambassador){


referredBy =
ambassador._id;


}



}









const hashedPassword =
await bcrypt.hash(
password,
10
);






const user =
await User.create({

name,

email:
email.toLowerCase(),

password:
hashedPassword,


role,



// Referral

referredBy,




// Approval

recruiterApproved:
role==="recruiter"
?
false
:
true,


ambassadorApproved:
role==="ambassador"
?
false
:
true,


companyVerified:false,


emailVerified:false,


phoneVerified:false,


status:"active",


authProvider:"local",


});








// =====================
// Student Profile
// =====================


if(role==="student"){


await StudentProfile.create({

user:user._id,

degree:"B.Tech",

country:"India",

profileCompleted:5,

});


}







// =====================
// Recruiter Profile
// =====================


if(role==="recruiter"){


await RecruiterProfile.create({

user:user._id,

});


}








// =====================
// Employee Profile
// =====================


if(role==="employee"){


await EmployeeProfile.create({

user:user._id,

department:"Operations",

profileCompleted:5,

});


}







// =====================
// Ambassador Profile
// =====================


if(role==="ambassador"){


const referralCode =

"SKIL" +
user._id
.toString()
.slice(-6)
.toUpperCase();




await AmbassadorProfile.create({

user:user._id,

referralCode,


totalReferrals:0,

successfulReferrals:0,

rewardPoints:0,

rank:0,

profileCompleted:5,

});





user.referralCode =
referralCode;


await user.save();



}





res.status(201).json({

success:true,


message:
role==="recruiter" ||
role==="ambassador"

?

`${role} registered successfully. Waiting for approval.`

:

"Registration successful.",



user:{


id:user._id,


name:user.name,


email:user.email,


role:user.role,


},



});





}catch(error){


console.error(
"Register Error:",
error
);



res.status(500).json({

success:false,

message:error.message

});


}



};






// ========================================
// Login
// ========================================


export const login = async(req,res)=>{


try{


const {

email,

password,

}=req.body;





const user =
await User.findOne({

email:
email.toLowerCase(),

});







if(!user){


return res.status(404).json({

success:false,

message:"User not found."

});


}







if(
user.role==="recruiter" &&
!user.recruiterApproved
){


return res.status(403).json({

success:false,

message:"Recruiter account under review."

});


}







if(
user.role==="ambassador" &&
!user.ambassadorApproved
){


return res.status(403).json({

success:false,

message:"Ambassador account under review."

});


}







const matched =
await bcrypt.compare(

password,

user.password

);







if(!matched){


return res.status(401).json({

success:false,

message:"Invalid email or password."

});


}







const token =
jwt.sign(

{

id:user._id,

role:user.role,

},

process.env.JWT_SECRET,

{

expiresIn:"7d"

}

);








user.lastLogin=new Date();

user.lastActive=new Date();

user.refreshToken=token;



await user.save();








res.status(200).json({

success:true,

message:"Login successful.",


token,


user:{


id:user._id,

name:user.name,

email:user.email,

role:user.role,


referralCode:user.referralCode || null,


}



});






}catch(error){


console.error(
"Login Error:",
error
);



res.status(500).json({

success:false,

message:error.message

});


}



};
// ========================================
// Forgot Password
// ========================================

export const forgotPassword = async (
req,
res
)=>{


try{


const {email}=req.body;



if(!email){


return res.status(400).json({

success:false,

message:"Email is required."

});


}






const user =
await User.findOne({

email:
email.toLowerCase(),

});







if(!user){


return res.status(404).json({

success:false,

message:"User not found."

});


}








const resetToken =
crypto
.randomBytes(32)
.toString("hex");







user.resetPasswordToken =

crypto
.createHash("sha256")
.update(resetToken)
.digest("hex");






user.resetPasswordExpire =

Date.now() + 
15 * 60 * 1000;






await user.save();








const resetURL =

`http://localhost:5173/reset-password/${resetToken}`;







res.status(200).json({

success:true,

message:
"Password reset link generated.",


resetURL,


});






}catch(error){


console.error(
"Forgot Password Error:",
error
);



res.status(500).json({

success:false,

message:error.message,

});


}


};











// ========================================
// Reset Password
// ========================================


export const resetPassword = async(
req,
res
)=>{


try{


const hashedToken =

crypto
.createHash("sha256")
.update(req.params.token)
.digest("hex");






const user =

await User.findOne({

resetPasswordToken:
hashedToken,


resetPasswordExpire:{
$gt:Date.now(),

},


});







if(!user){


return res.status(400).json({

success:false,

message:
"Invalid or expired token."

});


}







const {
password
}=req.body;






if(!password){


return res.status(400).json({

success:false,

message:
"Password required."

});


}







user.password =

await bcrypt.hash(
password,
10
);






user.resetPasswordToken =
undefined;



user.resetPasswordExpire =
undefined;







await user.save();







res.status(200).json({

success:true,

message:
"Password reset successful."

});





}catch(error){


console.error(
"Reset Password Error:",
error
);



res.status(500).json({

success:false,

message:error.message

});


}



};