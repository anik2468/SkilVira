import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
createLesson,
getCourseLessons
} from "../../services/lessonService";



const CourseLessons = ()=>{


const { id } = useParams();



const [lessons,setLessons]=useState([]);

const [loading,setLoading]=useState(true);



const [form,setForm]=useState({

title:"",
description:"",
videoUrl:"",
notesUrl:"",
duration:"",
order:0,

});





useEffect(()=>{

loadLessons();

},[]);





const loadLessons=async()=>{


try{


const data =
await getCourseLessons(id);


setLessons(
data.lessons || []
);



}catch(error){

console.log(error);

}

finally{

setLoading(false);

}


};






const handleChange=(e)=>{


setForm({

...form,

[e.target.name]:e.target.value,

});


};







const submitLesson=async()=>{


try{


await createLesson({

...form,

course:id,

order:Number(form.order),

});



alert(
"Lesson added"
);



setForm({

title:"",
description:"",
videoUrl:"",
notesUrl:"",
duration:"",
order:0,

});



loadLessons();



}catch(error){

console.log(error);

}


};







return (

<div className="p-6">


<h1 className="text-3xl font-bold">

Course Lessons

</h1>




<div className="mt-6 grid gap-8 md:grid-cols-2">



<div className="rounded-xl bg-white p-6 shadow">


<h2 className="mb-4 text-xl font-bold">

Add Lesson

</h2>



<input

name="title"

placeholder="Lesson Title"

value={form.title}

onChange={handleChange}

className="mb-3 w-full rounded border p-3"

/>



<textarea

name="description"

placeholder="Description"

value={form.description}

onChange={handleChange}

className="mb-3 w-full rounded border p-3"

/>




<input

name="videoUrl"

placeholder="Video URL"

value={form.videoUrl}

onChange={handleChange}

className="mb-3 w-full rounded border p-3"

/>




<input

name="notesUrl"

placeholder="Notes PDF URL"

value={form.notesUrl}

onChange={handleChange}

className="mb-3 w-full rounded border p-3"

/>




<input

name="duration"

placeholder="Duration"

value={form.duration}

onChange={handleChange}

className="mb-3 w-full rounded border p-3"

/>




<input

name="order"

placeholder="Order"

value={form.order}

onChange={handleChange}

className="mb-3 w-full rounded border p-3"

/>





<button

onClick={submitLesson}

className="rounded-xl bg-[#D4AF37] px-5 py-3 text-white"

>

Add Lesson

</button>



</div>








<div className="rounded-xl bg-white p-6 shadow">


<h2 className="mb-4 text-xl font-bold">

Lessons

</h2>



{

loading ?

"Loading..."

:


lessons.length===0 ?

"No lessons added"


:


lessons.map((lesson)=>(


<div

key={lesson._id}

className="mb-3 rounded-xl border p-4"

>


<h3 className="font-bold">

{lesson.title}

</h3>


<p className="text-sm text-gray-500">

{lesson.duration}

</p>



</div>


))


}



</div>



</div>


</div>

);


};



export default CourseLessons;