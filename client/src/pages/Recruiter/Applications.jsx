import { useEffect, useMemo, useState } from "react";

import {
  FiMail,
  FiFileText,
  FiExternalLink,
} from "react-icons/fi";


import {
  getRecruiterApplications,
  updateApplicationStatus,
} from "../../services/applicationService";



const Applications = () => {


const user =
JSON.parse(
localStorage.getItem("user")
);



const [applications,setApplications]=
useState([]);


const [loading,setLoading]=
useState(true);



const [search,setSearch]=
useState("");



const [statusFilter,setStatusFilter]=
useState("All");





useEffect(()=>{

loadApplications();

},[]);





const loadApplications = async()=>{

try{


const res =
await getRecruiterApplications(
user.id
);


setApplications(
res.applications || []
);



}catch(error){

console.log(error);


}finally{

setLoading(false);

}

};







const updateStatus = async(
id,
status
)=>{


try{


await updateApplicationStatus(
id,
{
status,
}
);



setApplications((prev)=>

prev.map((app)=>

app._id===id

?

{
...app,
status,
}

:

app

)

);



}catch(error){

console.log(error);

alert(
"Unable to update status"
);

}


};








const filteredApplications =
useMemo(()=>{


return applications.filter((item)=>{


const text =
search.toLowerCase();



const searchMatch =

item.student?.name
?.toLowerCase()
.includes(text)

||

item.student?.email
?.toLowerCase()
.includes(text)

||

item.internship?.title
?.toLowerCase()
.includes(text);



const statusMatch =

statusFilter==="All"

||

item.status===statusFilter;



return searchMatch && statusMatch;



});


},[
applications,
search,
statusFilter
]);







if(loading){

return(

<div className="flex h-[70vh] items-center justify-center">

<h2 className="text-2xl font-bold">
Loading Applications...
</h2>

</div>

);

}







return(


<div className="space-y-8">





<div>

<h1 className="text-4xl font-bold">
Applications
</h1>


<p className="mt-2 text-gray-500">
Manage student internship applications.
</p>


</div>







<div className="rounded-2xl bg-white p-5 shadow flex flex-col gap-4 md:flex-row">


<input

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

placeholder="Search student..."

className="flex-1 rounded-xl border p-3"

/>




<select

value={statusFilter}

onChange={(e)=>
setStatusFilter(e.target.value)
}

className="rounded-xl border p-3"

>

<option>All</option>

<option>Pending</option>

<option>Reviewed</option>

<option>Shortlisted</option>

<option>Interview</option>

<option>Selected</option>

<option>Rejected</option>


</select>



</div>







{
filteredApplications.length===0 ?


<div className="rounded-2xl bg-white p-12 text-center shadow">

<h2 className="text-2xl font-bold">
No Applications Found
</h2>


</div>


:


<div className="space-y-6">


{
filteredApplications.map((item)=>(


<div

key={item._id}

className="rounded-2xl bg-white p-6 shadow"

>


<div className="flex justify-between">


<div>


<h2 className="text-2xl font-bold">

{item.student?.name}

</h2>



<p className="text-[#D4AF37]">

{item.internship?.title}

</p>


<div className="mt-3 text-gray-600 space-y-2">


<p className="flex gap-2 items-center">

<FiMail/>

{item.student?.email}

</p>




{
item.resume &&

<p>

<FiFileText/>

<a

href={item.resume}

target="_blank"

className="text-blue-600 ml-2"

>

View Resume

</a>

</p>

}




{
item.portfolio &&

<p>

<FiExternalLink/>

<a

href={item.portfolio}

target="_blank"

className="text-blue-600 ml-2"

>

Portfolio

</a>

</p>

}



</div>


</div>




<span className="rounded-full bg-gray-100 px-4 py-2 h-fit">

{item.status}

</span>



</div>







<div className="mt-6 flex flex-wrap gap-3">


<button

onClick={()=>updateStatus(item._id,"Reviewed")}

className="rounded-xl bg-gray-700 px-5 py-2 text-white"

>

Review

</button>



<button

onClick={()=>updateStatus(item._id,"Shortlisted")}

className="rounded-xl bg-blue-600 px-5 py-2 text-white"

>

Shortlist

</button>



<button

onClick={()=>updateStatus(item._id,"Interview")}

className="rounded-xl bg-yellow-500 px-5 py-2 text-white"

>

Interview

</button>



<button

onClick={()=>updateStatus(item._id,"Selected")}

className="rounded-xl bg-green-600 px-5 py-2 text-white"

>

Select

</button>



<button

onClick={()=>updateStatus(item._id,"Rejected")}

className="rounded-xl bg-red-600 px-5 py-2 text-white"

>

Reject

</button>



</div>



</div>


))

}


</div>


}



</div>


);


};


export default Applications;