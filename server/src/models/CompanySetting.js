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