import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  FiMapPin,
  FiClock,
  FiCreditCard,
  FiCalendar,
  FiBriefcase,
} from "react-icons/fi";

import { getInternshipById } from "../../services/internshipService";
import ApplyInternshipModal from "../../components/student/ApplyInternshipModal";


const InternshipDetails = () => {


const { id } = useParams();


const [internship,setInternship] =
useState(null);


const [loading,setLoading] =
useState(true);


const [showModal,setShowModal] =
useState(false);



const user =
JSON.parse(localStorage.getItem("user"));




useEffect(()=>{

loadInternship();

},[]);





const loadInternship = async()=>{


try{


const data =
await getInternshipById(id);


setInternship(data.internship);



}catch(error){

console.log(error);

}
finally{

setLoading(false);

}


};






if(loading){

return (

<div className="p-8 text-center text-xl">

Loading Internship...

</div>

);

}






if(!internship){

return (

<div className="p-8 text-center">

Internship not found.

</div>

);

}







return (

<>


<div className="space-y-8">



{
internship.internshipImage && (

<div className="overflow-hidden rounded-2xl shadow">

<img

src={internship.internshipImage}

className="h-72 w-full object-cover"

/>

</div>

)

}






<div className="rounded-2xl bg-white p-8 shadow">


<div className="flex justify-between">


<div>


<h1 className="text-4xl font-bold">

{internship.title}

</h1>



<p className="mt-2 text-xl text-[#D4AF37]">

{internship.company}

</p>



{
internship.sourceType==="skilvira" && (

<span className="mt-4 inline-block rounded-full bg-purple-100 px-4 py-2 text-purple-700">

⭐ SkilVira Official Paid Internship

</span>

)

}


</div>


<FiBriefcase className="text-4xl text-gray-400"/>


</div>







<div className="mt-6 flex flex-wrap gap-6 text-gray-600">


<span className="flex items-center gap-2">

<FiMapPin/>

{internship.location}

</span>




<span className="flex items-center gap-2">

<FiClock/>

{internship.duration}

</span>





<span className="flex items-center gap-2">

<FiCreditCard/>

₹{internship.price}

</span>





<span className="flex items-center gap-2">

<FiCalendar/>

{
new Date(
internship.lastDate
).toLocaleDateString()
}

</span>


</div>






<div className="mt-6 flex gap-3 flex-wrap">


<span className="rounded-full bg-blue-100 px-5 py-2 text-blue-700 font-semibold">

{internship.workMode}

</span>



<span className="rounded-full bg-green-100 px-5 py-2 text-green-700 font-semibold">

Paid Internship

</span>




<span className="rounded-full bg-yellow-100 px-5 py-2 text-yellow-700 font-semibold">

{internship.category}

</span>


</div>



</div>








<div className="rounded-2xl bg-white p-8 shadow">


<h2 className="mb-4 text-2xl font-bold">

Description

</h2>


<p className="leading-8 text-gray-600">

{internship.description}

</p>


</div>








<div className="rounded-2xl bg-white p-8 shadow">


<h2 className="mb-4 text-2xl font-bold">

Requirements

</h2>


<p className="leading-8 text-gray-600">

{internship.requirements}

</p>


</div>







<div className="rounded-2xl bg-white p-8 shadow">


<h2 className="mb-4 text-2xl font-bold">

You Will Receive

</h2>



<div className="flex flex-wrap gap-3">


{
internship.benefits?.map(
(item,index)=>(


<span

key={index}

className="rounded-full bg-green-100 px-4 py-2 text-green-700"

>

✓ {item}

</span>


)

)

}


</div>


</div>








<div className="flex justify-end">


<button

onClick={()=>{


if(!user){


window.location.href =
`/login/student?redirect=/student/internships/${id}`;


return;


}



if(user.role==="student"){


setShowModal(true);


}



}}

className="rounded-xl bg-[#D4AF37] px-8 py-4 text-lg font-semibold text-white"

>


{

Number(internship.price)>0

?

`Pay ₹${internship.price} & Apply`

:

"Apply Now"

}


</button>



</div>





</div>









{
showModal && (


<ApplyInternshipModal


internship={internship}


studentId={user?.id}


onClose={()=>setShowModal(false)}


/>


)

}



</>


);


};


export default InternshipDetails;