import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
FiSearch,
FiMapPin,
FiClock,
FiBookmark,
FiBriefcase,
FiCreditCard
} from "react-icons/fi";


import { getInternships } from "../../services/internshipService";



const Internships = () => {


const [internships,setInternships] =
useState([]);


const [loading,setLoading] =
useState(true);


const [search,setSearch] =
useState("");



const [mode,setMode] =
useState("All");





useEffect(()=>{

loadInternships();

},[]);




const loadInternships = async()=>{


try{


const res =
await getInternships();


setInternships(
res.internships || []
);



}catch(error){

console.log(error);

}
finally{

setLoading(false);

}


};







const filtered =
useMemo(()=>{


return internships.filter((item)=>{


const keyword =

item.title
?.toLowerCase()
.includes(search.toLowerCase())

||

item.company
?.toLowerCase()
.includes(search.toLowerCase())

;



const modeMatch =

mode==="All"

||

item.workMode===mode;



return keyword && modeMatch;



});


},[
internships,
search,
mode
]);







if(loading){

return(

<div className="flex h-[70vh] items-center justify-center">

<h2 className="text-2xl font-bold">

Loading Internships...

</h2>

</div>

)

}






return(


<div className="space-y-8">


<div>

<h1 className="text-4xl font-bold">

SkilVira Internships

</h1>


<p className="mt-2 text-gray-500">

Paid internships with certificate and industry experience.

</p>


</div>





<div className="rounded-2xl bg-white p-6 shadow flex gap-4">


<div className="flex-1">


<input

placeholder="Search internship..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="w-full rounded-xl border p-3"

/>


</div>



<select

value={mode}

onChange={(e)=>setMode(e.target.value)}

className="rounded-xl border px-5"

>

<option>All</option>

<option>Online</option>

<option>Offline</option>

<option>Hybrid</option>


</select>


</div>







<div className="grid gap-6">


{
filtered.map((item)=>(


<div

key={item._id}

className="rounded-2xl bg-white shadow overflow-hidden"

>




{
item.internshipImage &&

<img

src={item.internshipImage}

className="h-48 w-full object-cover"

/>

}




<div className="p-6">



<div className="flex justify-between">


<div>


<h2 className="text-2xl font-bold">

{item.title}

</h2>


<p className="text-[#D4AF37] text-lg">

{item.company}

</p>


</div>



<span className="rounded-full bg-green-100 px-4 py-2 text-green-700">

Paid Internship

</span>


</div>







<div className="mt-5 flex flex-wrap gap-5 text-gray-600">


<span className="flex gap-2 items-center">

<FiMapPin/>

{item.location}

</span>




<span className="flex gap-2 items-center">

<FiClock/>

{item.duration}

</span>





<span className="flex gap-2 items-center">

<FiCreditCard/>

₹{item.price}

</span>



</div>







<div className="mt-5 flex gap-3">


<span className="rounded-full bg-blue-100 px-4 py-2 text-blue-700">

{item.workMode}

</span>



<span className="rounded-full bg-yellow-100 px-4 py-2 text-yellow-700">

{item.category}

</span>


</div>







<div className="mt-5">


<h3 className="font-bold">

You will get:

</h3>


<div className="mt-2 flex flex-wrap gap-2">


{
item.benefits?.map((b,index)=>(

<span

key={index}

className="rounded-full bg-gray-100 px-3 py-1"

>

✓ {b}

</span>


))

}



</div>


</div>







<div className="mt-6 flex justify-between">


<button className="rounded-xl border p-3">

<FiBookmark/>

</button>



<Link

to={`/student/internships/${item._id}`}

className="rounded-xl bg-[#D4AF37] px-6 py-3 text-white font-semibold"

>

View Details

</Link>



</div>





</div>


</div>



))


}


</div>





</div>


);


};


export default Internships;