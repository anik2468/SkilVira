import { useEffect, useState } from "react";
import api from "../../services/api";


const Internships = () => {


const [internships,setInternships] =
useState([]);


const [loading,setLoading] =
useState(true);





useEffect(()=>{

loadInternships();

},[]);







const loadInternships = async()=>{


try{


const {data} =
await api.get(
"/employee/internships/pending"
);



setInternships(
data.internships || []
);



}catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};







const approve = async(id)=>{


try{


await api.put(
`/employee/internships/approve/${id}`
);



alert(
"Internship Approved"
);



loadInternships();



}catch(error){

console.log(error);

}

};







const reject = async(id)=>{


try{


await api.put(
`/employee/internships/reject/${id}`
);



alert(
"Internship Rejected"
);



loadInternships();



}catch(error){

console.log(error);

}

};








return (

<div className="space-y-8">





<div className="flex items-center justify-between">


<div>


<h1 className="text-3xl font-bold">

Internship Management

</h1>


<p className="mt-2 text-gray-500">

Approve recruiter internships and create SkilVira internships.

</p>


</div>





<a

href="/employee/internships/create"

className="rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-white"

>

+ Create SkilVira Internship

</a>



</div>









<div className="rounded-2xl bg-white p-8 shadow">


<div className="mb-6 flex justify-between">


<h2 className="text-2xl font-bold">

Pending Recruiter Internships

</h2>



<span className="rounded-full bg-yellow-100 px-4 py-2 text-yellow-700">

{internships.length} Pending

</span>


</div>









{

loading ?


<p>

Loading...

</p>




:


internships.length===0 ?



<p className="text-gray-500">

No pending internships.

</p>




:

<div className="space-y-5">



{

internships.map((item)=>(


<div

key={item._id}

className="rounded-xl border p-5"

>


<div className="flex flex-col justify-between gap-5 md:flex-row">





<div>


<h3 className="text-xl font-bold">

{item.title}

</h3>



<p className="mt-1">

Company: {item.company}

</p>



<p className="text-gray-500">

Recruiter:

{" "}

{item.recruiter?.name || "N/A"}

</p>




<div className="mt-3 flex gap-3">


<span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">

{item.workMode || "Online"}

</span>



<span className="rounded-full bg-green-100 px-3 py-1 text-green-700">

{item.category}

</span>



</div>



</div>









<div className="flex items-center gap-3">



<button

onClick={()=>approve(item._id)}

className="rounded-lg bg-green-600 px-4 py-2 text-white"

>

Approve

</button>





<button

onClick={()=>reject(item._id)}

className="rounded-lg bg-red-600 px-4 py-2 text-white"

>

Reject

</button>




</div>







</div>



</div>



))

}



</div>



}



</div>






</div>

);

};


export default Internships;