import { useEffect, useState } from "react";

import {
FiBookOpen,
FiTrash2,
FiPlus,
} from "react-icons/fi";


import {
getCourses,
createCourse,
deleteCourse,
} from "../../services/courseService";



const Courses = ()=>{


const [courses,setCourses]=useState([]);

const [loading,setLoading]=useState(true);



const [form,setForm]=useState({

title:"",
description:"",
category:"Development",
duration:"",
price:0,
thumbnail:"",
modules:"",

});





useEffect(()=>{

loadCourses();

},[]);







const loadCourses=async()=>{


try{


const data =
await getCourses();


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








const changeHandler=(e)=>{


setForm({

...form,

[e.target.name]:
e.target.value

});


};









const submitCourse=async()=>{


try{


if(!form.title){

return alert(
"Course title required"
);

}



await createCourse({

...form,

price:
Number(form.price),


modules:
form.modules
.split(",")


});





alert(
"Course created successfully"
);



setForm({

title:"",
description:"",
category:"Development",
duration:"",
price:0,
thumbnail:"",
modules:"",

});



loadCourses();



}catch(error){


console.log(error);


alert(
"Course creation failed"
);


}



};









const removeCourse=async(id)=>{


if(!confirm(
"Delete course?"
))

return;




try{


await deleteCourse(id);


loadCourses();


}catch(error){

console.log(error);

}


};








return (

<div className="space-y-8 p-6">



<div>


<h1 className="text-4xl font-bold">

Courses

</h1>


<p className="text-gray-500 mt-2">

Manage SkilVira courses

</p>


</div>









<div className="rounded-3xl bg-white p-8 shadow">



<h2 className="mb-6 text-2xl font-bold flex gap-2 items-center">

<FiPlus/>

Create Course

</h2>





<div className="grid gap-4 md:grid-cols-2">



<input

name="title"

placeholder="Course Title"

value={form.title}

onChange={changeHandler}

className="rounded-xl border p-3"

/>





<input

name="category"

placeholder="Category"

value={form.category}

onChange={changeHandler}

className="rounded-xl border p-3"

/>






<input

name="duration"

placeholder="Duration"

value={form.duration}

onChange={changeHandler}

className="rounded-xl border p-3"

/>






<input

name="price"

type="number"

placeholder="Price"

value={form.price}

onChange={changeHandler}

className="rounded-xl border p-3"

/>






<input

name="thumbnail"

placeholder="Thumbnail URL"

value={form.thumbnail}

onChange={changeHandler}

className="rounded-xl border p-3"

/>






<input

name="modules"

placeholder="Modules (comma separated)"

value={form.modules}

onChange={changeHandler}

className="rounded-xl border p-3"

/>




</div>







<textarea

name="description"

placeholder="Course Description"

value={form.description}

onChange={changeHandler}

rows="5"

className="mt-4 w-full rounded-xl border p-3"

/>







<button

onClick={submitCourse}

className="
mt-5
rounded-xl
bg-[#D4AF37]
px-8
py-3
text-white
font-semibold
"

>


Create Course


</button>



</div>









<div className="rounded-3xl bg-white p-8 shadow">


<h2 className="mb-6 text-2xl font-bold">

Existing Courses

</h2>





{

loading

?

<p>
Loading...
</p>


:


courses.length===0

?

<p className="text-gray-500">

No courses found.

</p>



:


<div className="grid gap-5 md:grid-cols-3">


{

courses.map((course)=>(


<div

key={course._id}

className="rounded-2xl border p-5"

>


<FiBookOpen className="text-4xl text-[#D4AF37]"/>



<h3 className="mt-3 text-xl font-bold">

{course.title}

</h3>



<p className="text-gray-500">

{course.category}

</p>




<p className="mt-2 font-semibold text-[#D4AF37]">

₹{course.price}

</p>






<button

onClick={()=>removeCourse(course._id)}

className="
mt-4
flex
items-center
gap-2
rounded-lg
bg-red-500
px-4
py-2
text-white
"

>

<FiTrash2/>

Delete

</button>



</div>


))


}


</div>


}



</div>






</div>

);


};


export default Courses;