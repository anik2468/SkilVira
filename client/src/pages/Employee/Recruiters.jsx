import { useEffect, useState } from "react";
import api from "../../services/api";


const Recruiters = () => {


const [recruiters,setRecruiters] =
useState([]);


const [loading,setLoading] =
useState(true);


const [actionLoading,setActionLoading] =
useState("");





useEffect(()=>{

loadRecruiters();

},[]);







const loadRecruiters = async()=>{


try{


setLoading(true);


const {data} =
await api.get(
"/employee/recruiters/pending"
);



setRecruiters(
data.recruiters || []
);



}catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};







const approve = async(id)=>{


if(!window.confirm(
"Approve this recruiter?"
))

return;



try{


setActionLoading(id);



await api.put(
`/employee/recruiters/approve/${id}`
);



alert(
"Recruiter Approved"
);



loadRecruiters();



}catch(error){

console.log(error);

}

finally{

setActionLoading("");

}

};







const reject = async(id)=>{


if(!window.confirm(
"Reject this recruiter?"
))

return;



try{


setActionLoading(id);



await api.put(
`/employee/recruiters/reject/${id}`
);



alert(
"Recruiter Rejected"
);



loadRecruiters();



}catch(error){

console.log(error);

}

finally{

setActionLoading("");

}

};









return (

<div className="rounded-2xl bg-white p-8 shadow">



<div className="mb-6 flex justify-between">


<div>

<h1 className="text-3xl font-bold">

Recruiter Approval

</h1>


<p className="text-gray-500">

Review and approve recruiter accounts.

</p>


</div>



<div className="rounded-xl bg-yellow-100 px-5 py-3 text-yellow-700">

Pending: {recruiters.length}

</div>



</div>







{

loading ?


<p className="text-center text-gray-500">

Loading recruiters...

</p>



:


recruiters.length===0 ?



<p className="text-center text-gray-500">

No pending recruiters.

</p>



:


<div className="overflow-x-auto">


<table className="w-full">


<thead className="bg-gray-100">


<tr>


<th className="p-4 text-left">

Recruiter

</th>


<th>

Email

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

recruiters.map((item)=>(


<tr

key={item._id}

className="border-b hover:bg-gray-50"

>



<td className="p-4">


<div className="flex items-center gap-3">


<img

src={

item.avatar

?

`http://localhost:5000${item.avatar}`

:

`https://ui-avatars.com/api/?name=${item.name}`

}

className="h-10 w-10 rounded-full"

/>


<div>


<p className="font-semibold">

{item.name}

</p>


<p className="text-sm text-gray-500">

Recruiter

</p>


</div>



</div>


</td>







<td>

{item.email}

</td>








<td>


<span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">

Pending

</span>


</td>








<td className="space-x-3">


<button

disabled={actionLoading===item._id}

onClick={()=>approve(item._id)}

className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-50"

>

{

actionLoading===item._id

?

"Processing..."

:

"Approve"

}


</button>






<button

disabled={actionLoading===item._id}

onClick={()=>reject(item._id)}

className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"

>

Reject

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

);

};


export default Recruiters;