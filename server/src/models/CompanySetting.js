import mongoose from "mongoose";


const companySettingSchema = new mongoose.Schema(

{

companyName:{
type:String,
default:"SkilVira",
},


logo:{
type:String,
default:"",
},


brochure:{
type:String,
default:"",
},

gallery: {
  type: [String],
  default: [],
},


qrCode:{
type:String,
default:"",
},


about:{
type:String,
default:"",
},


email:{
type:String,
default:"",
},


phone:{
type:String,
default:"",
},


address:{
type:String,
default:"",
},


website:{
type:String,
default:"",
},


supportEmail: { type: String, default: "", trim: true },
instagram: { type: String, default: "", trim: true },
linkedin: { type: String, default: "", trim: true },
youtube: { type: String, default: "", trim: true },
facebook: { type: String, default: "", trim: true },
twitter: { type: String, default: "", trim: true },
mapUrl: { type: String, default: "", trim: true },
supportHours: { type: String, default: "", trim: true },

updatedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
},


},

{
timestamps:true,
}


);



export default mongoose.model(
"CompanySetting",
companySettingSchema
);