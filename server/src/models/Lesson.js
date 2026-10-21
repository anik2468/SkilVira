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
assessments: [{
  title: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ["assignment", "quiz", "test"],
    required: true
  },
  description: { type: String, default: "" },
  durationMinutes: { type: Number, default: 0, min: 0 },
  totalMarks: { type: Number, default: 0, min: 0 },
  negativeMarking: { type: Number, default: 0, min: 0 },
  maxAttempts: { type: Number, default: 1, min: 1 },
  isPublished: { type: Boolean, default: true },
  questions: [{
    prompt: { type: String, required: true },
    type: {
      type: String,
      enum: ["mcq", "multiple_select", "fill_blank"],
      required: true
    },
    options: [String],
    correctAnswers: [String],
    marks: { type: Number, required: true, min: 0.01 }
  }],
  attempts: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      values: [String]
    }],
    submissionText: { type: String, default: "" },
    score: { type: Number, default: null },
    maxMarks: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["submitted", "pending_grade", "graded"],
      default: "submitted"
    },
    feedback: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now }
  }]
}],



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