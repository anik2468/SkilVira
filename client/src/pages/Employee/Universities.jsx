import { useEffect, useState } from "react";
import api from "../../services/api";


const Universities = () => {


const [universities,setUniversities] =
useState([]);


const [loading,setLoading] =
useState(true);







useEffect(()=>{

loadUniversities();

},[]);








const loadUniversities = async()=>{


try{


const {data} =
await api.get(
"/universities"
);



setUniversities(
data.universities || []
);



}catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};







return (

<div className="space-y-8">





<div>


<h1 className="text-3xl font-bold">

Partner Colleges

</h1>


<p className="mt-2 text-gray-500">

Manage college partnerships and campus network.

</p>


</div>









<div className="rounded-2xl bg-white p-8 shadow">



{

loading ?


<p>

Loading universities...

</p>




:


universities.length===0 ?



<div className="rounded-xl border border-dashed p-10 text-center">


<div className="text-5xl">

🎓

</div>



<h2 className="mt-4 text-2xl font-bold">

No Colleges Added

</h2>



<p className="mt-2 text-gray-500">

Partner colleges will appear here.

</p>



</div>





:



<div className="overflow-x-auto">


<table className="w-full">


<thead className="bg-gray-100">


<tr>


<th className="p-4 text-left">

College Name

</th>


<th>

University

</th>


<th>

Location

</th>


<th>

Status

</th>


</tr>


</thead>







<tbody>


{

universities.map((college)=>(


<tr

key={college._id}

className="border-b hover:bg-gray-50"

>


<td className="p-4">


<div className="font-semibold">

{college.name}

</div>


<p className="text-sm text-gray-500">

{college.email}

</p>


</td>






<td>

{college.university || "-"}

</td>






<td>

{college.location || "-"}

</td>







<td>


<span className="rounded-full bg-green-100 px-3 py-1 text-green-700">

Verified

</span>


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


export default Universities;