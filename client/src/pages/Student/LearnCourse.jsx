import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
FiPlay,
FiCheckCircle,
} from "react-icons/fi";


import {
getCourseLessons
} from "../../services/lessonService";


import {
completeLesson,
getCourseProgress
} from "../../services/enrollmentService";



const LearnCourse = ()=>{


const {id}=useParams();


const user =
JSON.parse(
localStorage.getItem("user")
);



const [lessons,setLessons]=useState([]);

const [completedLessons,setCompletedLessons]=useState([]);

const [loading,setLoading]=useState(true);

const [selectedLesson,setSelectedLesson]=useState(null);

const [progress,setProgress]=useState(0);





useEffect(()=>{

loadCourse();

},[]);





const loadCourse=async()=>{


try{


const lessonData =
await getCourseLessons(id);



setLessons(
lessonData.lessons || []
);



if(lessonData.lessons?.length){

setSelectedLesson(
lessonData.lessons[0]
);

}



const progressData =
await getCourseProgress(
user?._id || user?.id,
id
);



const completed =
progressData.completedLessons || [];



setCompletedLessons(
completed.map(
(item)=>item.lesson
)
);



const percentage =
lessonData.lessons?.length
?
Math.round(
(completed.length /
lessonData.lessons.length)
*
100
)
:
0;



setProgress(percentage);



}catch(error){

console.log(error);

}

finally{

setLoading(false);

}


};







const handleComplete=async()=>{


try{


await completeLesson({

student:user?._id || user?.id,

course:id,

lesson:selectedLesson._id

});



alert(
"Lesson completed"
);



loadCourse();



}catch(error){

console.log(error);

}



};







if(loading){

return (

<div className="p-8">

Loading Course...

</div>

);

}







return (

<div className="p-6">





<div className="mb-6">


<h1 className="text-3xl font-bold">

Learning Course

</h1>



<div className="mt-4">

<p className="text-gray-500">

Course Progress : {progress}%

</p>



<div className="mt-2 h-3 rounded-full bg-gray-200">

<div

className="h-3 rounded-full bg-[#D4AF37]"

style={{

width:`${progress}%`

}}

></div>


</div>


</div>


</div>







<div className="grid gap-6 lg:grid-cols-3">






<div className="lg:col-span-2 rounded-2xl bg-black p-5">



{

selectedLesson ?


<>


{

selectedLesson.videoUrl ?


<iframe

src={selectedLesson.videoUrl}

className="h-[450px] w-full rounded-xl"

allowFullScreen

/>

:

<div className="flex h-[450px] items-center justify-center text-white">

Video not available

</div>


}




<h2 className="mt-5 text-xl font-bold text-white">

{selectedLesson.title}

</h2>




<p className="mt-2 text-gray-300">

{selectedLesson.description}

</p>





<button

onClick={handleComplete}

disabled={
completedLessons.includes(
selectedLesson._id
)
}

className="mt-5 flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-white disabled:bg-gray-500"

>


<FiCheckCircle/>


{

completedLessons.includes(
selectedLesson._id
)

?

"Completed"

:

"Mark Complete"

}


</button>



</>


:

<div className="text-white">

Select Lesson

</div>


}



</div>









<div className="rounded-2xl bg-white p-5 shadow">


<h2 className="mb-5 text-xl font-bold">

Lessons

</h2>




{

lessons.length===0

?

<p>

No lessons available

</p>


:


lessons.map((lesson,index)=>(



<button

key={lesson._id}

onClick={()=>setSelectedLesson(lesson)}

className={`mb-3 flex w-full items-center gap-3 rounded-xl border p-4 text-left

${
selectedLesson?._id===lesson._id
?
"border-[#D4AF37] bg-yellow-50"
:
""
}

`}

>


{

completedLessons.includes(
lesson._id
)

?

<FiCheckCircle className="text-green-600"/>

:

<FiPlay/>

}



<div>

<h3 className="font-semibold">

{index+1}. {lesson.title}

</h3>


<p className="text-sm text-gray-500">

{lesson.duration}

</p>


</div>



</button>


))


}



</div>







</div>



</div>

);


};



export default LearnCourse;