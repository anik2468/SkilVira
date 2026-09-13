import mongoose from "mongoose";


const lessonProgressSchema = new mongoose.Schema(
{

student:{

type:mongoose.Schema.Types.ObjectId,

ref:"User",

required:true,

index:true,

},



course:{

type:mongoose.Schema.Types.ObjectId,

ref:"Course",

required:true,

},



lesson:{

type:mongoose.Schema.Types.ObjectId,

ref:"Lesson",

required:true,

},



completed:{

type:Boolean,

default:false,

},



completedAt:{

type:Date,

default:null,

},



},

{

timestamps:true,

}

);



export default mongoose.model(
"LessonProgress",
lessonProgressSchema
);