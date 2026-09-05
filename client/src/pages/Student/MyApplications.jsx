import { useEffect, useState } from "react";
import {
  FiFileText,
  FiExternalLink,
  FiCalendar,
} from "react-icons/fi";

import {
  getStudentApplications,
} from "../../services/applicationService";



const MyApplications = () => {


const user =
JSON.parse(
localStorage.getItem("user")
);



const [applications,setApplications] =
useState([]);


const [loading,setLoading] =
useState(true);





useEffect(()=>{

loadApplications();

},[]);






const loadApplications = async()=>{


try{


const res =
await getStudentApplications(
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







const statusStyle = (status)=>{


switch(status){


case "Selected":

return "bg-green-100 text-green-700";


case "Rejected":

return "bg-red-100 text-red-700";


case "Shortlisted":

return "bg-blue-100 text-blue-700";


case "Interview":

return "bg-yellow-100 text-yellow-700";


case "Reviewed":

return "bg-purple-100 text-purple-700";


default:

return "bg-gray-100 text-gray-700";


}



};







if(loading){

return (

<div className="flex h-[70vh] items-center justify-center">

<h2 className="text-2xl font-bold">
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


<h2 className="text-2xl font-bold">
No Applications Yet
</h2>


<p className="mt-2 text-gray-500">
Apply for internships to see them here.
</p>


</div>



:


<div className="space-y-6">


{
applications.map((item)=>(


<div

key={item._id}

className="rounded-2xl bg-white p-6 shadow"

>



<div className="flex flex-col gap-4 md:flex-row md:justify-between">


<div>


<h2 className="text-2xl font-bold">

{item.internship?.title}

</h2>


<p className="text-lg text-[#D4AF37]">

{item.internship?.company}

</p>


</div>




<span

className={`rounded-full px-4 py-2 h-fit font-semibold ${statusStyle(item.status)}`}

>

{item.status}

</span>



</div>







<div className="mt-5 space-y-3 text-gray-600">


<p className="flex items-center gap-2">

<FiCalendar/>

Applied:

{" "}

{
new Date(
item.createdAt
).toLocaleDateString()
}

</p>





{
item.resume &&

<p className="flex items-center gap-2">

<FiFileText/>

<a

href={item.resume}

target="_blank"

className="text-blue-600 hover:underline"

>

View Resume

</a>


</p>

}





{
item.portfolio &&

<p className="flex items-center gap-2">


<FiExternalLink/>


<a

href={item.portfolio}

target="_blank"

className="text-blue-600 hover:underline"

>

Portfolio

</a>


</p>

}



</div>







{
item.coverLetter &&

<div className="mt-5 rounded-xl bg-gray-50 p-4">


<h3 className="font-bold">
Cover Letter
</h3>


<p className="mt-2 text-gray-600">

{item.coverLetter}

</p>


</div>

}



</div>



))

}



</div>



}



</div>

);


};


export default MyApplications;