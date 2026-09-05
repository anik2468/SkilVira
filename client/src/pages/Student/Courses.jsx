import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCourses
} from "../../services/courseService";


const Courses = () => {


const [courses,setCourses] = useState([]);

const [loading,setLoading] = useState(true);

const navigate = useNavigate();



useEffect(()=>{

loadCourses();

},[]);



const loadCourses = async()=>{

try{

const data = await getCourses();

setCourses(
data.courses || []
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

<div className="p-10 text-center text-xl">

Loading Courses...

</div>

);

}



return (

<div className="p-8">


<h1 className="text-3xl font-bold">

Available Courses

</h1>


<p className="mt-2 text-gray-500">

Learn industry skills with SkilVira courses.

</p>



{

courses.length === 0 ?

(

<div className="mt-10 rounded-xl bg-white p-10 text-center shadow">

No courses available yet.

</div>

)

:

(

<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">


{

courses.map((course)=>(


<div

key={course._id}

className="overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg transition"

>


<img

src={
course.thumbnail
?
`http://localhost:5000${course.thumbnail}`
:
"https://via.placeholder.com/400x250"
}

alt={course.title}

className="h-48 w-full object-cover"

/>



<div className="p-5">


<h2 className="text-xl font-bold">

{course.title}

</h2>



<p className="mt-2 text-sm text-gray-500">

{course.category}

</p>



<div className="mt-4 flex justify-between text-sm">


<span>

⏱ {course.duration}

</span>


<span className="font-bold">

₹ {course.price}

</span>


</div>




<button

onClick={()=>navigate(
`/student/courses/${course._id}`
)}

className="mt-5 w-full rounded-xl bg-[#D4AF37] py-3 text-white"

>

View Details

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


export default Courses;