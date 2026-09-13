import mongoose from "mongoose";


const generatedCertificateSchema = new mongoose.Schema(

{

student:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true,
},



course:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course",
default:null,
},



internship:{
type:mongoose.Schema.Types.ObjectId,
ref:"Internship",
default:null,
},



template:{
type:mongoose.Schema.Types.ObjectId,
ref:"CertificateTemplate",
required:true,
},




// Dynamic Data Employee Edit Kar Sakta Hai

data:{


studentName:{
type:String,
default:"",
},


courseName:{
type:String,
default:"",
},


marks:{
type:String,
default:"",
},


grade:{
type:String,
default:"",
},


duration:{
type:String,
default:"",
},


attendance:{
type:String,
default:"",
},


performance:{
type:String,
default:"",
},


feedback:{
type:String,
default:"",
},


issueDate:{
type:String,
default:"",
},


certificateId:{
type:String,
default:"",
},


},






certificateFile:{
type:String,
default:"",
},



reportFile:{
type:String,
default:"",
},






// Employee Verification

status:{

type:String,

enum:[

"pending",
"approved",
"rejected",
"revision"

],

default:"pending",

},




verifiedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
default:null,
},



verifiedAt:{
type:Date,
default:null,
},





employeeRemark:{

type:String,

default:"",

},




// Email

emailSent:{

type:Boolean,

default:false,

},



emailSentAt:{

type:Date,

default:null,

},




certificateId:{
type:String,
unique:true,
},



qrCode:{
type:String,
default:"",
},



},

{
timestamps:true,
}

);



export default mongoose.model(
"GeneratedCertificate",
generatedCertificateSchema
);