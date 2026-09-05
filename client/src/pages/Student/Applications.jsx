import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiBriefcase,
  FiCalendar,
  FiEye,
  FiExternalLink,
  FiFileText,
} from "react-icons/fi";

import {
  getMyApplications,
} from "../../services/applicationService";



const Applications = () => {


const [applications,setApplications] =
useState([]);


const [loading,setLoading] =
useState(true);



const user =
JSON.parse(
localStorage.getItem("user")
);





useEffect(()=>{

fetchApplications();

},[]);





const fetchApplications = async()=>{


try{


const res =
await getMyApplications(
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







const getStatusColor=(status)=>{


switch(status){


case "Selected":

return "bg-green-100 text-green-700";


case "Rejected":

return "bg-red-100 text-red-700";


case "Shortlisted":

return "bg-blue-100 text-blue-700";


case "Interview":

return "bg-purple-100 text-purple-700";


case "Reviewed":

return "bg-yellow-100 text-yellow-700";


default:

return "bg-gray-100 text-gray-700";


}


};







if(loading){

return (

<div className="flex h-[70vh] items-center justify-center">

<h2 className="text-2xl font-semibold">

Loading Applications...

</h2>

</div>

);

}







return (

<div className="space-y-8">



<div>

<h1 className="text-4xl font-bold">

My Applications

</h1>


<p className="mt-2 text-gray-500">

Track your internship application status.

</p>


</div>







{
applications.length===0 ?


<div className="rounded-2xl bg-white p-12 text-center shadow">


<FiBriefcase

size={70}

className="mx-auto text-gray-300"

/>


<h2 className="mt-6 text-2xl font-bold">

No Applications Yet

</h2>



<p className="mt-2 text-gray-500">

Start applying for internships.

</p>



<Link

to="/student/internships"

className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-8 py-3 font-semibold text-white"

>

Browse Internships

</Link>


</div>



:


<div className="grid gap-6">


{
applications.map((application)=>(


<div

key={application._id}

className="rounded-2xl bg-white p-6 shadow"

>



<div className="flex justify-between">


<div>


<h2 className="text-2xl font-bold">

{application.internship?.title}

</h2>


<p className="text-[#D4AF37]">

{application.internship?.company}

</p>


</div>




<span

className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(application.status)}`}

>

{application.status}

</span>



</div>







<div className="mt-5 text-gray-600 flex items-center gap-2">

<FiCalendar/>

Applied on:

{" "}

{
new Date(
application.createdAt
).toLocaleDateString()
}


</div>







<div className="mt-6 flex flex-wrap gap-4">


<Link

to={`/student/internships/${application.internship?._id}`}

className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-white"

>

<FiEye/>

View Internship

</Link>





{
application.resume &&

<a

href={application.resume}

target="_blank"

rel="noreferrer"

className="flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold"

>

<FiFileText/>

Resume

</a>

}






{
application.portfolio &&

<a

href={application.portfolio}

target="_blank"

rel="noreferrer"

className="flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold"

>

<FiExternalLink/>

Portfolio

</a>

}



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