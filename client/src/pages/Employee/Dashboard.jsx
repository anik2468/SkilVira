import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

import {
  FiUsers,
  FiBriefcase,
  FiCheckCircle,
  FiUser,
  FiRefreshCw,
  FiTrendingUp,
} from "react-icons/fi";


const Dashboard = () => {


const [stats,setStats] = useState({

profileCompleted:0,

pendingRecruiters:0,

pendingAmbassadors:0,

pendingInternships:0,

totalUsers:0,

totalCompanies:0,

});



const [loading,setLoading] =
useState(false);





useEffect(()=>{

loadDashboard();

},[]);







const loadDashboard = async()=>{


try{


setLoading(true);


const user =
JSON.parse(
localStorage.getItem("user")
);



const {data} =
await api.get(
`/employee/dashboard/${user.id}`
);



setStats({

profileCompleted:
data.stats?.profileCompleted || 0,


pendingRecruiters:
data.stats?.pendingRecruiters || 0,


pendingAmbassadors:
data.stats?.pendingAmbassadors || 0,


pendingInternships:
data.stats?.pendingInternships || 0,


totalUsers:
data.stats?.totalUsers || 0,


totalCompanies:
data.stats?.totalCompanies || 0,

});



}catch(error){

console.log(error);

}

finally{

setLoading(false);

}


};







const cards=[


{
title:"Pending Recruiters",
value:stats.pendingRecruiters,
icon:<FiUsers/>,
path:"/employee/recruiters",
},


{
title:"Pending Ambassadors",
value:stats.pendingAmbassadors,
icon:<FiUser/>,
path:"/employee/ambassadors",
},


{
title:"Pending Internships",
value:stats.pendingInternships,
icon:<FiBriefcase/>,
path:"/employee/internships",
},


{
title:"Profile Completion",
value:`${stats.profileCompleted}%`,
icon:<FiCheckCircle/>,
path:"/employee/profile",
},


];








return (

<div className="space-y-8">



<div className="flex items-center justify-between">


<div>

<h1 className="text-4xl font-bold">

Employee Dashboard

</h1>


<p className="mt-2 text-gray-500">

Manage SkilVira operations and approvals.

</p>


</div>





<button

onClick={loadDashboard}

className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white"

>

<FiRefreshCw/>

Refresh

</button>



</div>







{
loading &&

<p className="text-gray-500">

Loading Dashboard...

</p>

}








<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">



{

cards.map((card)=>(


<Link

key={card.title}

to={card.path}

className="rounded-2xl bg-white p-6 shadow hover:-translate-y-1 transition"


>


<div className="mb-4 text-3xl text-[#D4AF37]">

{card.icon}

</div>



<h2 className="text-4xl font-bold">

{card.value}

</h2>


<p className="mt-2 text-gray-500">

{card.title}

</p>


</Link>


))

}


</div>








<div className="grid gap-6 md:grid-cols-2">





<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="mb-4 text-2xl font-bold">

Platform Overview

</h2>



<div className="space-y-4">


<div className="flex justify-between">

<span>
Total Users
</span>

<b>
{stats.totalUsers}
</b>

</div>



<div className="flex justify-between">

<span>
Companies
</span>

<b>
{stats.totalCompanies}
</b>

</div>



</div>


</div>








<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="mb-4 text-2xl font-bold">

Quick Actions

</h2>



<div className="space-y-3">



<Link

to="/employee/recruiters"

className="block rounded-xl border p-4 hover:bg-gray-50"

>

👥 Approve Recruiters

</Link>




<Link

to="/employee/internships"

className="block rounded-xl border p-4 hover:bg-gray-50"

>

💼 Review Internships

</Link>





<Link

to="/employee/ambassadors"

className="block rounded-xl border p-4 hover:bg-gray-50"

>

🎓 Manage Ambassadors

</Link>



</div>


</div>






</div>







<div className="rounded-2xl bg-gradient-to-r from-[#D4AF37] to-yellow-600 p-8 text-white">


<div className="flex items-center gap-4">


<FiTrendingUp className="text-5xl"/>


<div>


<h2 className="text-2xl font-bold">

SkilVira Growth

</h2>


<p>

Keep reviewing applications and maintaining platform quality.

</p>


</div>


</div>


</div>





</div>

);

};


export default Dashboard;