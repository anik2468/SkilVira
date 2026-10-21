import mongoose from "mongoose";


const courseSchema = new mongoose.Schema(

{


// ==========================
// Basic Info
// ==========================


title:{

type:String,

required:true,

trim:true,

},



description:{

type:String,

default:"",

},




category:{

type:String,

default:"Development",

},




level:{

type:String,

enum:[

"Beginner",

"Intermediate",

"Advanced"

],

default:"Beginner",

},




duration:{

type:String,

default:"",

},




price: {
  type: Number,
  default: 0,
},

  studentReferralDiscountEnabled: { type: Boolean, default: false },
  studentReferralDiscountType: { type: String, enum: ["percent", "fixed"], default: "percent" },
  studentReferralDiscountValue: { type: Number, default: 0, min: 0 },
  ambassadorCommissionEnabled: { type: Boolean, default: true },
  ambassadorCommissionType: { type: String, enum: ["percent", "fixed"], default: "percent" },
  ambassadorCommissionValue: { type: Number, default: 15, min: 0 },


registrationDeadline: {
  type: Date,
  default: null,
},

startDate: {
  type: Date,
  default: null,
},

endDate: {
  type: Date,
  default: null,
},




thumbnail:{

type:String,

default:"",

},





// ==========================
// Content
// ==========================


modules:[

{

type:String,

}

],




totalLessons:{

type:Number,

default:0,

},





// ==========================
// Instructor
// ==========================


createdBy:{

type:mongoose.Schema.Types.ObjectId,

ref:"User",

required:true,

},





// ==========================
// Status
// ==========================


status:{

type:String,

enum:[

"active",

"inactive",

],

default:"active",

},





isFeatured:{

type:Boolean,

default:false,

},




views:{

type:Number,

default:0,

},




// ==========================
// Soft Delete
// ==========================


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

"Course",

courseSchema

);