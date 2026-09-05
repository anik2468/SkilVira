import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
getMyCourses
} from "../../services/enrollmentService";



const MyCourses = ()=>{


const navigate = useNavigate();


const [courses,setCourses]=useState([]);

const [loading,setLoading]=useState(true);





useEffect(()=>{

loadCourses();

},[]);






const loadCourses=async()=>{


try{


const user =
JSON.parse(
localStorage.getItem("user")
);



const data =
await getMyCourses(
user?._id || user?.id
);



setCourses(
data.enrollments || []
);



}catch(error){

console.log(error);

}

finally{

setLoading(false);

}


};






if(loading){

return (

<div className="flex h-[60vh] items-center justify-center">

<h2 className="text-2xl font-bold">

Loading Courses...

</h2>

</div>

);

}






return (


<div className="p-6">



<h1 className="text-3xl font-bold">

My Courses

</h1>



<p className="mt-2 text-gray-500">

Continue your learning journey with SkilVira

</p>







{

courses.length===0 ?



(

<div className="mt-8 rounded-2xl bg-white p-10 text-center shadow">


<h2 className="text-xl font-semibold">

No enrolled courses yet

</h2>


<p className="mt-2 text-gray-500">

Explore courses and start learning.

</p>



</div>

)



:



(

<div className="mt-8 grid gap-6 md:grid-cols-3">



{

courses.map((item)=>(



<div

key={item._id}

className="overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-xl"

>



<img

src={

item.course?.thumbnail

?

`http://localhost:5000${item.course.thumbnail}`

:

"https://via.placeholder.com/500x300"

}

className="h-48 w-full object-cover"

/>





<div className="p-5">



<h2 className="text-xl font-bold">

{item.course?.title}

</h2>




<div className="mt-3 flex justify-between text-sm text-gray-500">


<span>

{item.course?.category}

</span>



<span>

{item.course?.duration}

</span>


</div>







<p className="mt-5 text-sm text-gray-500">

Course Progress

</p>



<div className="mt-2 h-3 rounded-full bg-gray-200">


<div

className="h-3 rounded-full bg-[#D4AF37]"

style={{

width:`${item.progress || 0}%`

}}

/>



</div>





<p className="mt-2 text-sm font-semibold">

{item.progress || 0}% Completed

</p>







<button


onClick={()=>navigate(

`/student/learn/${item.course?._id}`

)}


className="mt-5 w-full rounded-xl bg-[#D4AF37] py-3 font-semibold text-white"

>


Continue Learning


</button>





</div>



</div>



))


}



</div>



)

}



</div>


);


};


export default MyCourses;