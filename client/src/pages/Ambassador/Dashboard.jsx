import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  FiCopy,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiLink,
} from "react-icons/fi";


const Dashboard = () => {


const [data,setData] = useState({

stats:{},

referral:{},

students:[]

});


const [loading,setLoading] = useState(true);



useEffect(()=>{

load();

},[]);






const load = async()=>{


try{


const user =
JSON.parse(
localStorage.getItem("user")
);




const res =
await api.get(
`/ambassador/dashboard/${user.id}`
);




setData(res.data);



}catch(error){


console.log(error);


}

finally{

setLoading(false);

}


};







const copyLink = ()=>{


navigator.clipboard.writeText(
data.referral?.link
);


alert(
"Referral link copied"
);


};






if(loading){

return (

<div className="p-8 text-xl font-bold">

Loading Dashboard...

</div>

);

}







return (


<div className="space-y-8">





<h1 className="text-4xl font-bold">

Ambassador Dashboard

</h1>









{/* Referral Link */}


<div className="rounded-3xl bg-white p-6 shadow">


<div className="flex items-center gap-3">

<FiLink className="text-3xl text-[#D4AF37]"/>


<h2 className="text-2xl font-bold">

Your Referral Link

</h2>


</div>





<div className="mt-5 flex flex-col gap-3 md:flex-row">


<input

readOnly

value={
data.referral?.link || ""
}

className="flex-1 rounded-xl border p-3"

/>



<button

onClick={copyLink}

className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-white"

>


<FiCopy/>

Copy

</button>



</div>



<p className="mt-3 text-gray-500">

Code:
<span className="font-bold text-[#D4AF37]">

 {data.referral?.code}

</span>

</p>



</div>









{/* Stats */}


<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">





<div className="rounded-2xl bg-white p-6 shadow">

<FiUsers className="text-3xl text-[#D4AF37]"/>

<h2 className="mt-3 text-4xl font-bold">

{
data.stats?.totalReferrals || 0
}

</h2>

<p>

Total Students

</p>

</div>






<div className="rounded-2xl bg-white p-6 shadow">

<FiTrendingUp className="text-3xl text-[#D4AF37]"/>

<h2 className="mt-3 text-4xl font-bold">

{
data.stats?.successfulReferrals || 0
}

</h2>

<p>

Enrollments

</p>

</div>







<div className="rounded-2xl bg-white p-6 shadow">

<FiAward className="text-3xl text-[#D4AF37]"/>

<h2 className="mt-3 text-4xl font-bold">

{
data.stats?.certificates || 0
}

</h2>

<p>

Certificates

</p>

</div>







<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="text-4xl font-bold">

{
data.stats?.rewardPoints || 0
}

</h2>


<p>

Reward Points

</p>


</div>








<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="text-4xl font-bold">

#
{
data.stats?.rank || 0
}

</h2>


<p>

Rank

</p>


</div>






</div>









{/* Students */}


<div className="rounded-3xl bg-white p-6 shadow">


<h2 className="mb-5 text-2xl font-bold">

Referred Students

</h2>





{

data.students?.length===0

?

<p className="text-gray-500">

No students joined yet.

</p>


:


<div className="overflow-x-auto">


<table className="w-full">


<thead>

<tr className="border-b text-left">

<th className="p-3">

Name

</th>


<th className="p-3">

Email

</th>


<th className="p-3">

Joined Date

</th>


</tr>


</thead>




<tbody>


{

data.students.map((student)=>(


<tr

key={student._id}

className="border-b"

>


<td className="p-3 font-semibold">

{
student.name
}

</td>


<td className="p-3">

{
student.email
}

</td>


<td className="p-3">

{
new Date(
student.createdAt
)
.toLocaleDateString()
}

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


export default Dashboard;