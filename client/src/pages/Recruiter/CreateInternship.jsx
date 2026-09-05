import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createInternship } from "../../services/internshipService";
import api from "../../services/api";


const CreateInternship = () => {


const navigate = useNavigate();


const user =
JSON.parse(localStorage.getItem("user"));



const [loading,setLoading] =
useState(false);


const [uploading,setUploading] =
useState(false);




const [form,setForm]=useState({

recruiter:user?.id || "",

company:"",

companyWebsite:"",

companyLogo:"",

internshipImage:"",

title:"",

category:"Software Development",

internshipType:"Internship",

workMode:"Remote",

location:"",

duration:"",

stipend:"",

openings:1,

lastDate:"",

skills:"",

description:"",

responsibilities:"",

requirements:"",

perks:"",

});





const update=(e)=>{

setForm({

...form,

[e.target.name]:
e.target.value,

});

};






const uploadImage = async(e)=>{


try{


const file =
e.target.files[0];


if(!file) return;



const formData =
new FormData();



formData.append(
"image",
file
);



setUploading(true);



const res =
await api.post(

"/upload/avatar",

formData,

{

headers:{

"Content-Type":
"multipart/form-data",

},

}

);




setForm({

...form,

internshipImage:
res.data.url,

});



alert(
"Internship Banner Uploaded"
);



}catch(error){


console.log(error);


alert(
"Image Upload Failed"
);


}finally{


setUploading(false);


}


};






const submit=async(e)=>{


e.preventDefault();


try{


setLoading(true);



await createInternship({

...form,


openings:Number(form.openings),


skills:
form.skills
.split(",")
.map(item=>item.trim())
.filter(Boolean),


});



alert(
"Internship Created Successfully"
);



navigate(
"/recruiter/internships"
);



}catch(err){


console.log(err);


alert(

err?.response?.data?.message ||

"Unable to create internship"

);


}finally{


setLoading(false);


}


};








return (

<div className="mx-auto max-w-7xl">


<div className="mb-8">

<h1 className="text-4xl font-bold">

Post New Internship

</h1>

<p className="mt-2 text-gray-500">

Fill details and publish internship.

</p>


</div>






<form

onSubmit={submit}

className="space-y-8 rounded-2xl bg-white p-8 shadow"

>




<div className="grid gap-6 md:grid-cols-2">





{/* Banner Upload */}

<div>

<label className="mb-2 block font-medium">

Internship Banner

</label>


<input

type="file"

accept="image/*"

onChange={uploadImage}

className="w-full rounded-xl border p-3"

/>



{
uploading &&

<p className="text-gray-500">
Uploading...
</p>

}



{
form.internshipImage &&

<img

src={
`http://localhost:5000${form.internshipImage}`
}

className="mt-3 h-32 w-full rounded-xl object-cover"

alt="banner"

/>

}



</div>






<input

name="company"

placeholder="Company Name"

value={form.company}

onChange={update}

required

className="rounded-xl border p-3"

/>





<input

name="companyWebsite"

placeholder="Company Website"

value={form.companyWebsite}

onChange={update}

className="rounded-xl border p-3"

/>







<input

name="title"

placeholder="Internship Title"

value={form.title}

onChange={update}

required

className="rounded-xl border p-3"

/>







<select

name="category"

value={form.category}

onChange={update}

className="rounded-xl border p-3"

>

<option>Software Development</option>

<option>Web Development</option>

<option>AI/ML</option>

<option>Cyber Security</option>

<option>Data Science</option>

<option>UI/UX</option>

</select>







<select

name="workMode"

value={form.workMode}

onChange={update}

className="rounded-xl border p-3"

>

<option>Remote</option>

<option>Hybrid</option>

<option>Onsite</option>

</select>







<input

name="location"

placeholder="Location"

value={form.location}

onChange={update}

className="rounded-xl border p-3"

/>







<input

name="duration"

placeholder="Duration"

value={form.duration}

onChange={update}

className="rounded-xl border p-3"

/>







<input

name="stipend"

placeholder="Stipend"

value={form.stipend}

onChange={update}

className="rounded-xl border p-3"

/>







<input

type="number"

name="openings"

value={form.openings}

onChange={update}

className="rounded-xl border p-3"

/>







<input

type="date"

name="lastDate"

value={form.lastDate}

onChange={update}

className="rounded-xl border p-3"

/>





</div>







<textarea

rows="2"

name="skills"

placeholder="React, Node, MongoDB"

value={form.skills}

onChange={update}

className="w-full rounded-xl border p-3"

/>







<textarea

rows="5"

name="description"

placeholder="Description"

value={form.description}

onChange={update}

className="w-full rounded-xl border p-3"

/>







<textarea

rows="4"

name="responsibilities"

placeholder="Responsibilities"

value={form.responsibilities}

onChange={update}

className="w-full rounded-xl border p-3"

/>







<textarea

rows="4"

name="requirements"

placeholder="Requirements"

value={form.requirements}

onChange={update}

className="w-full rounded-xl border p-3"

/>







<textarea

rows="3"

name="perks"

placeholder="Perks"

value={form.perks}

onChange={update}

className="w-full rounded-xl border p-3"

/>







<button

disabled={loading}

className="rounded-xl bg-[#D4AF37] px-8 py-3 font-semibold text-white"

>


{
loading
?
"Publishing..."
:
"Publish Internship"
}


</button>





</form>


</div>

);


};


export default CreateInternship;