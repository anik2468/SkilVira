import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";


const CreateInternship = () => {


const navigate = useNavigate();


const [loading,setLoading] =
useState(false);





const [form,setForm] = useState({

company:"SkilVira",

companyLogo:"",

internshipImage:"",

companyWebsite:"",

title:"",

category:"",

internshipType:"Internship",

workMode:"Online",

location:"",

duration:"",

price:"",

openings:1,

lastDate:"",

skills:"",

description:"",

responsibilities:"",

requirements:"",

perks:"",

benefits:
"Certificate, Internship Report, Attendance Report"

});







const changeHandler=(e)=>{


setForm({

...form,

[e.target.name]:
e.target.value

});


};







const submitHandler = async(e)=>{


e.preventDefault();


try{


setLoading(true);



await api.post(

"/internships/skilvira/create",

{

...form,


price:String(form.price),


openings:Number(form.openings),



skills:
form.skills
.split(",")
.map(
(item)=>item.trim()
)
.filter(Boolean),




benefits:
form.benefits
.split(",")
.map(
(item)=>item.trim()
)
.filter(Boolean),



sourceType:"skilvira"


}

);





alert(
"SkilVira Internship Published Successfully"
);



navigate(
"/employee/internships"
);



}catch(error){


console.log(error);



alert(

error?.response?.data?.message ||

"Unable to create internship"

);



}

finally{

setLoading(false);

}


};








return (

<div className="rounded-2xl bg-white p-8 shadow">



<h1 className="mb-8 text-3xl font-bold">

Create SkilVira Paid Internship

</h1>






<form

onSubmit={submitHandler}

className="grid gap-5 md:grid-cols-2"

>






<input

name="companyLogo"

placeholder="Company Logo URL"

value={form.companyLogo}

onChange={changeHandler}

className="rounded-xl border p-3"

/>






<input

name="internshipImage"

placeholder="Internship Banner URL"

value={form.internshipImage}

onChange={changeHandler}

className="rounded-xl border p-3"

/>






<input

name="companyWebsite"

placeholder="Company Website"

value={form.companyWebsite}

onChange={changeHandler}

className="rounded-xl border p-3"

/>






<input

name="title"

placeholder="Internship Title"

value={form.title}

onChange={changeHandler}

required

className="rounded-xl border p-3"

/>






<input

name="category"

placeholder="Category"

value={form.category}

onChange={changeHandler}

required

className="rounded-xl border p-3"

/>








<select

name="internshipType"

value={form.internshipType}

onChange={changeHandler}

className="rounded-xl border p-3"

>

<option>
Internship
</option>

<option>
Full Time
</option>

<option>
Part Time
</option>


</select>







<select

name="workMode"

value={form.workMode}

onChange={changeHandler}

className="rounded-xl border p-3"

>


<option>
Online
</option>

<option>
Offline
</option>

<option>
Hybrid
</option>


</select>








<input

name="location"

placeholder="Location"

value={form.location}

onChange={changeHandler}

required

className="rounded-xl border p-3"

/>








<input

name="duration"

placeholder="Duration"

value={form.duration}

onChange={changeHandler}

required

className="rounded-xl border p-3"

/>







<input

name="price"

placeholder="Price ₹"

value={form.price}

onChange={changeHandler}

required

className="rounded-xl border p-3"

/>








<input

type="number"

name="openings"

value={form.openings}

onChange={changeHandler}

className="rounded-xl border p-3"

/>








<input

type="date"

name="lastDate"

value={form.lastDate}

onChange={changeHandler}

required

className="rounded-xl border p-3"

/>







<textarea

name="skills"

placeholder="React, Node, Python"

value={form.skills}

onChange={changeHandler}

className="rounded-xl border p-3 md:col-span-2"

/>







<textarea

name="benefits"

placeholder="Certificate, Report"

value={form.benefits}

onChange={changeHandler}

className="rounded-xl border p-3 md:col-span-2"

/>








<textarea

name="description"

placeholder="Description"

value={form.description}

onChange={changeHandler}

rows="5"

required

className="rounded-xl border p-3 md:col-span-2"

/>








<textarea

name="responsibilities"

placeholder="Responsibilities"

value={form.responsibilities}

onChange={changeHandler}

rows="4"

className="rounded-xl border p-3 md:col-span-2"

/>








<textarea

name="requirements"

placeholder="Requirements"

value={form.requirements}

onChange={changeHandler}

rows="4"

required

className="rounded-xl border p-3 md:col-span-2"

/>








<textarea

name="perks"

placeholder="Perks"

value={form.perks}

onChange={changeHandler}

rows="3"

className="rounded-xl border p-3 md:col-span-2"

/>








<button

disabled={loading}

className="rounded-xl bg-[#D4AF37] px-8 py-3 font-semibold text-white md:col-span-2"

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