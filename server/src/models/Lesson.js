import mongoose from "mongoose";


const lessonSchema = new mongoose.Schema({

course:{

type:mongoose.Schema.Types.ObjectId,

ref:"Course",

required:true,

},


title:{

type:String,

required:true,

},


description:{

type:String,

default:"",

},


videoUrl:{

type:String,

default:"",

},


notesUrl:{

type:String,

default:"",

},


duration:{

type:String,

default:"",

},


order:{

type:Number,

default:0,

},


isPublished:{

type:Boolean,

default:true,

},


},{

timestamps:true

});



export default mongoose.model(
"Lesson",
lessonSchema
);