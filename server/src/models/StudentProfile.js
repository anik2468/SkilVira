import mongoose from "mongoose";


const projectSchema = new mongoose.Schema(
{
title:String,
description:String,
github:String,
live:String,
technologies:[String],
},
{
_id:false
}
);



const certificateSchema = new mongoose.Schema(
{
name:String,
issuer:String,
issueDate:Date,
credentialId:String,
credentialUrl:String,
},
{
_id:false
}
);



const experienceSchema = new mongoose.Schema(
{
company:String,
role:String,
startDate:Date,
endDate:Date,
currentlyWorking:Boolean,
description:String,
},
{
_id:false
}
);





const studentProfileSchema = new mongoose.Schema(
{


user:{

type:mongoose.Schema.Types.ObjectId,

ref:"User",

required:true,

unique:true,

index:true,

},





profilePicture:{

type:String,

default:"",

},



bio:{

type:String,

default:"",

maxlength:500,

},





phone:String,





gender:{

type:String,

enum:[
"Male",
"Female",
"Other"
],

default:null,

},




dateOfBirth:Date,


address:String,

city:String,

state:String,



country:{

type:String,

default:"India",

},



pincode:String,





college:String,

university:String,



degree:{

type:String,

default:"B.Tech",

},


branch:String,

semester:Number,

passingYear:Number,

cgpa:Number,


tenthPercentage:Number,

twelfthPercentage:Number,






skills:[String],

languages:[String],






resume:{

type:String,

default:"",

},



resumePublicId:{

type:String,

default:"",

},





projects:[projectSchema],


certificates:[certificateSchema],


experience:[experienceSchema],






github:String,

linkedin:String,

portfolio:String,

leetcode:String,

geeksforgeeks:String,

hackerrank:String,

codeforces:String,

codechef:String,







preferredRole:String,

preferredLocation:String,





workMode:{

type:String,

enum:[
"Remote",
"Hybrid",
"Onsite"
],

default:null,

},




expectedStipend:Number,

availableFrom:Date,







profileVisibility:{

type:Boolean,

default:true,

},





profileCompleted:{

type:Number,

default:0,

},





profileViews:{

type:Number,

default:0,

},




profileScore:{

type:Number,

default:0,

},





isVerified:{

type:Boolean,

default:false,

},




isDeleted:{

type:Boolean,

default:false,

},



},

{

timestamps:true,

}

);






export default mongoose.model(
"StudentProfile",
studentProfileSchema
);