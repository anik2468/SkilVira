import { useEffect, useState } from "react";

import {
FiUpload
} from "react-icons/fi";

import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

import {
updateInternship,
} from "../../services/internshipService";

import {
uploadFile
} from "../../services/uploadService";



const categories = [
"Web Development",
"App Development",
"AI/ML",
"Cyber Security",
"Data Science",
"UI/UX",
"Cloud",
"DevOps",
"Marketing",
"HR",
];


const internshipTypes = [
"Internship",
"Full Time",
"Part Time",
];


const modes = [
"Online",
"Offline",
"Hybrid",
];




const EditInternshipModal = ({
internship,
onClose,
onSuccess,
})=>{


const [loading,setLoading]=useState(false);

const [uploading,setUploading]=useState(false);



const [form,setForm]=useState({


title:"",
company:"",
category:"",
internshipType:"",
workMode:"",
location:"",
duration:"",
price:"",
lastDate:"",
skills:"",
description:"",
requirements:"",
perks:"",
internshipImage:"",
status:"Open",

});






useEffect(()=>{


if(internship){


setForm({


...internship,


lastDate:
internship.lastDate
?
internship.lastDate.substring(0,10)
:
"",



skills:
internship.skills
?
internship.skills.join(", ")
:
"",



internshipImage:
internship.internshipImage || "",


});


}



},[internship]);







const handleChange=(e)=>{


setForm({

...form,

[e.target.name]:e.target.value,

});


};








const handleImageUpload=async(e)=>{


const file=e.target.files[0];


if(!file)
return;



try{


setUploading(true);


const data =
await uploadFile(file);



setForm({

...form,

internshipImage:data.url,

});


}catch(error){

console.log(error);

alert(
"Image upload failed"
);

}

finally{

setUploading(false);

}


};









const handleSubmit=async(e)=>{


e.preventDefault();


try{


setLoading(true);



await updateInternship(

internship._id,

{


...form,


skills:

form.skills

.split(",")

.map(skill=>skill.trim())

.filter(Boolean),


}

);



alert(
"Internship updated successfully"
);



onSuccess();

onClose();



}catch(error){


console.log(error);


alert(
"Failed to update internship"
);


}

finally{

setLoading(false);

}


};







return (


<div className="mx-auto my-10 w-full max-w-5xl rounded-2xl bg-white p-8 shadow-2xl">



<div className="mb-8 flex justify-between">


<h2 className="text-3xl font-bold">

Edit Internship

</h2>



<button

onClick={onClose}

className="text-2xl"

>

✕

</button>



</div>





<form

onSubmit={handleSubmit}

className="grid grid-cols-2 gap-5"

>




<div className="col-span-2">


<label className="mb-2 block font-semibold">

Internship Thumbnail

</label>



{

form.internshipImage &&

<img

src={form.internshipImage}

className="mb-3 h-40 w-full rounded-xl object-cover"

/>

}



<label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3">


<FiUpload/>


{

uploading
?
"Uploading..."
:
"Change Image"

}



<input

type="file"

accept="image/*"

hidden

onChange={handleImageUpload}

/>



</label>


</div>







<Input

label="Title"

name="title"

value={form.title}

onChange={handleChange}

/>




<Input

label="Company"

name="company"

value={form.company}

onChange={handleChange}

/>





<Select

label="Category"

name="category"

value={form.category}

onChange={handleChange}

options={categories}

/>





<Select

label="Internship Type"

name="internshipType"

value={form.internshipType}

onChange={handleChange}

options={internshipTypes}

/>




<Select

label="Work Mode"

name="workMode"

value={form.workMode}

onChange={handleChange}

options={modes}

/>




<Input

label="Location"

name="location"

value={form.location}

onChange={handleChange}

/>




<Input

label="Duration"

name="duration"

value={form.duration}

onChange={handleChange}

/>




<Input

label="Price"

name="price"

value={form.price}

onChange={handleChange}

/>




<Input

type="date"

label="Last Date"

name="lastDate"

value={form.lastDate}

onChange={handleChange}

/>




<Input

label="Skills"

name="skills"

value={form.skills}

onChange={handleChange}

/>





<div className="col-span-2">


<Textarea

label="Description"

name="description"

value={form.description}

onChange={handleChange}

/>


</div>




<div className="col-span-2">


<Textarea

label="Requirements"

name="requirements"

value={form.requirements}

onChange={handleChange}

/>


</div>





<div className="col-span-2">


<Textarea

label="Perks"

name="perks"

value={form.perks}

onChange={handleChange}

/>


</div>





<div className="col-span-2 flex justify-end gap-4">


<button

type="button"

onClick={onClose}

className="rounded-xl border px-6 py-3"

>

Cancel

</button>




<button

disabled={loading}

className="rounded-xl bg-[#D4AF37] px-6 py-3 text-white"

>

{

loading
?
"Updating..."
:
"Update Internship"

}


</button>



</div>





</form>


</div>


);


};


export default EditInternshipModal;