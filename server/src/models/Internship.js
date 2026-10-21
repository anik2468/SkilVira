import mongoose from "mongoose";


const internshipSchema = new mongoose.Schema(

{

  recruiter: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true,

    index:true,

  },



  sourceType: {

    type:String,

    enum:[
      "recruiter",
      "skilvira"
    ],

    default:"recruiter",

    index:true,

  },



  company: {

    type:String,

    required:true,

    trim:true,

  },


  companyLogo: {

    type:String,

    default:"",

  },


  companyWebsite: {

    type:String,

    default:"",

  },


  internshipImage: {

    type:String,

    default:"",

  },



  title: {

    type:String,

    required:true,

    trim:true,

  },


  category: {

    type:String,

    required:true,

    trim:true,

    index:true,

  },


  internshipType: {

    type:String,

    enum:[
      "Internship",
      "Full Time",
      "Part Time"
    ],

    default:"Internship",

  },


  workMode: {

    type:String,

    enum:[
      "Online",
      "Offline",
      "Hybrid"
    ],

    default:"Online",

  },


  location: {

    type:String,

    required:true,

    trim:true,

  },


  duration: {

    type:String,

    required:true,

  },


  price: {

    type:Number,

    required:true,

  },

  studentReferralDiscountEnabled: { type: Boolean, default: false },
  studentReferralDiscountType: { type: String, enum: ["percent", "fixed"], default: "percent" },
  studentReferralDiscountValue: { type: Number, default: 0, min: 0 },
  ambassadorCommissionEnabled: { type: Boolean, default: true },
  ambassadorCommissionType: { type: String, enum: ["percent", "fixed"], default: "percent" },
  ambassadorCommissionValue: { type: Number, default: 15, min: 0 },



  openings: {

    type:Number,

    default:1,

    min:1,

  },


  lastDate: {

    type:Date,

    required:true,

  },



  skills:[

    {

      type:String,

      trim:true,

    }

  ],



  description: {

    type:String,

    required:true,

  },


  responsibilities: {

    type:String,

    default:"",

  },


  requirements: {

    type:String,

    required:true,

  },


  perks: {

    type:String,

    default:"",

  },



  benefits:[

    {

      type:String,

      trim:true,

    }

  ],



  approvalStatus: {

    type:String,

    enum:[
      "Pending",
      "Approved",
      "Rejected"
    ],

    default:"Pending",

    index:true,

  },



  status: {

    type:String,

    enum:[
      "Open",
      "Closed"
    ],

    default:"Open",

  },



  featured: {

    type:Boolean,

    default:false,

  },


  views: {

    type:Number,

    default:0,

  },


  applicants: {

    type:Number,

    default:0,

  },


  bookmarks: {

    type:Number,

    default:0,

  },


  slug: {

    type:String,

    default:"",

    trim:true,

  },


  isDeleted: {

    type:Boolean,

    default:false,

    index:true,

  },


},

{

timestamps:true,

}

);



export default mongoose.model(
"Internship",
internshipSchema
);