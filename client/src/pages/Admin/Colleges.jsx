import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

import {
  getColleges,
  verifyCollege as verifyCollegeApi,
  blockCollege as blockCollegeApi,
} from "../../services/collegeService";



const Colleges = () => {


const [colleges,setColleges] = useState([]);

const [loading,setLoading] = useState(true);

const [search,setSearch] = useState("");





useEffect(()=>{

loadColleges();

},[]);






const loadColleges = async()=>{


try{


setLoading(true);


const data = await getColleges();



setColleges(
  data.colleges || []
);



}catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};








const verifyCollege = async(id)=>{


try{


await verifyCollegeApi(id);


loadColleges();



}catch(error){

console.log(error);

}

};







const blockCollege = async(id)=>{


try{


await blockCollegeApi(id);


loadColleges();



}catch(error){

console.log(error);

}

};







const filteredColleges = colleges.filter(
(college)=>

`${college.name}
${college.location}
${college.university}`
.toLowerCase()
.includes(
search.toLowerCase()
)

);








return (

<div className="space-y-8">



<div className="flex items-center justify-between">


<div>

<h1 className="text-3xl font-bold">
College Management
</h1>


<p className="text-gray-500">
Manage registered colleges and verification.
</p>


</div>



<div className="rounded-xl bg-purple-100 px-5 py-3 font-bold text-purple-700">

Total : {colleges.length}

</div>


</div>








<div className="rounded-2xl bg-white p-8 shadow">



<div className="relative mb-6 max-w-md">


<FiSearch className="absolute left-4 top-4 text-gray-400"/>


<input

placeholder="Search college..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="w-full rounded-xl border p-3 pl-12"

/>


</div>







{

loading ?


<p className="text-center">
Loading colleges...
</p>



:


filteredColleges.length===0 ?


<p className="text-center text-gray-500">
No colleges found.
</p>




:


<div className="overflow-x-auto">


<table className="w-full">


<thead className="bg-gray-100">


<tr>

<th className="p-4 text-left">
College
</th>


<th>
Location
</th>


<th>
University
</th>


<th>
Status
</th>


<th>
Action
</th>


</tr>


</thead>







<tbody>


{

filteredColleges.map((college)=>(


<tr

key={college._id}

className="border-b hover:bg-gray-50"

>


<td className="p-4">


<div className="flex items-center gap-3">


{

college.logo &&

<img

src={college.logo}

className="h-10 w-10 rounded-full object-cover"

/>

}



<div>

<p className="font-semibold">

{college.name}

</p>


<p className="text-sm text-gray-500">
College
</p>


</div>


</div>


</td>





<td>
{college.location || "-"}
</td>




<td>
{college.university || "-"}
</td>





<td>

<span

className={

college.verified

?

"rounded-full bg-green-100 px-3 py-1 text-green-700"

:

"rounded-full bg-yellow-100 px-3 py-1 text-yellow-700"

}

>

{
college.verified
?
"Verified"
:
"Pending"
}

</span>


</td>






<td className="space-x-2">


{

!college.verified &&

<button

onClick={()=>verifyCollege(college._id)}

className="rounded-lg bg-green-600 px-4 py-2 text-white"

>

Verify

</button>

}



<button

onClick={()=>blockCollege(college._id)}

className="rounded-lg bg-red-600 px-4 py-2 text-white"

>

Block

</button>



</td>



</tr>


))

}


</tbody>


</table>


</div>


}



</div>


</div>

);

};


export default Colleges;