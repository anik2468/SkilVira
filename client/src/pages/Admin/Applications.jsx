import { useEffect, useState } from "react";

import {
  getAllApplications,
  updateApplicationStatus,
} from "../../services/applicationService";

import { FiSearch } from "react-icons/fi";


const Applications = () => {


const [applications,setApplications] =
useState([]);


const [loading,setLoading] =
useState(true);


const [search,setSearch] =
useState("");


const [filter,setFilter] =
useState("All");






useEffect(()=>{

loadApplications();

},[]);








const loadApplications = async()=>{


try{


setLoading(true);


const res =
await getAllApplications();


setApplications(
res.applications || []
);



}catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};








const updateStatus = async(id,status)=>{


try{


await updateApplicationStatus(

id,

{
status
}

);



loadApplications();



}catch(error){

console.log(error);

}

};









const filteredApplications =

applications.filter((app)=>{


const text =

`${app.student?.name}
${app.student?.email}
${app.internship?.title}`
.toLowerCase();



const matchSearch =
text.includes(
search.toLowerCase()
);



const matchStatus =

filter==="All"

?

true

:

app.status===filter;



return matchSearch && matchStatus;


});








return (

<div className="space-y-8">



<div className="flex items-center justify-between">


<div>


<h1 className="text-3xl font-bold">

Application Management

</h1>


<p className="text-gray-500">

Manage internship applications.

</p>


</div>




<div className="rounded-xl bg-[#D4AF37] px-5 py-3 font-bold text-white">

Total {applications.length}

</div>



</div>










<div className="rounded-2xl bg-white p-8 shadow">






<div className="mb-6 flex gap-4">



<div className="relative w-full max-w-md">


<FiSearch

className="absolute left-4 top-4 text-gray-400"

/>


<input

placeholder="Search application..."

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

className="w-full rounded-xl border p-3 pl-12"

/>


</div>






<select

value={filter}

onChange={(e)=>
setFilter(e.target.value)
}

className="rounded-xl border px-5"

>


<option>
All
</option>


<option>
Pending
</option>


<option>
Shortlisted
</option>


<option>
Selected
</option>


<option>
Rejected
</option>


</select>



</div>









<div className="overflow-x-auto">


<table className="w-full">


<thead className="bg-gray-100">


<tr>


<th className="p-4 text-left">

Student

</th>


<th>

Internship

</th>


<th>

Status

</th>


<th>

Resume

</th>


<th>

Action

</th>


</tr>


</thead>









<tbody>


{

loading ?


<tr>

<td

colSpan="5"

className="p-8 text-center"

>

Loading Applications...

</td>

</tr>





:


filteredApplications.length===0 ?


<tr>

<td

colSpan="5"

className="p-8 text-center text-gray-500"

>

No Applications Found

</td>

</tr>







:


filteredApplications.map((app)=>(



<tr

key={app._id}

className="border-b hover:bg-gray-50"

>






<td className="p-4">


<p className="font-semibold">

{app.student?.name}

</p>


<p className="text-sm text-gray-500">

{app.student?.email}

</p>


</td>







<td>


<p className="font-medium">

{app.internship?.title}

</p>


<p className="text-sm text-gray-500">

{app.internship?.company}

</p>


</td>









<td>


<span

className={

app.status==="Selected"

?

"rounded-full bg-green-100 px-3 py-1 text-green-700"

:

app.status==="Rejected"

?

"rounded-full bg-red-100 px-3 py-1 text-red-700"

:

app.status==="Shortlisted"

?

"rounded-full bg-blue-100 px-3 py-1 text-blue-700"

:

"rounded-full bg-yellow-100 px-3 py-1 text-yellow-700"

}

>

{app.status}

</span>


</td>








<td>


{

app.resume &&

<a

href={app.resume}

target="_blank"

className="text-blue-600 underline"

>

View Resume

</a>


}


</td>









<td className="space-x-2">





<button

onClick={()=>updateStatus(
app._id,
"Shortlisted"
)}

className="rounded-lg bg-blue-600 px-3 py-2 text-white"

>

Shortlist

</button>







<button

onClick={()=>updateStatus(
app._id,
"Selected"
)}

className="rounded-lg bg-green-600 px-3 py-2 text-white"

>

Select

</button>







<button

onClick={()=>updateStatus(
app._id,
"Rejected"
)}

className="rounded-lg bg-red-600 px-3 py-2 text-white"

>

Reject

</button>






</td>






</tr>



))


}



</tbody>


</table>


</div>






</div>






</div>

);

};


export default Applications;