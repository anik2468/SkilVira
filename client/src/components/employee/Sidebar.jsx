import { NavLink } from "react-router-dom";

import {
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiBookOpen,
  FiFileText,
  FiUser,
  FiCheckCircle,
  FiLogOut,
} from "react-icons/fi";


const menu = [

  {
    name:"Dashboard",
    path:"/employee/dashboard",
    icon:<FiGrid />,
  },

  {
    name:"Recruiter Approval",
    path:"/employee/recruiters",
    icon:<FiCheckCircle />,
  },

  {
    name:"Ambassador Approval",
    path:"/employee/ambassadors",
    icon:<FiUsers />,
  },

  {
    name:"Internship Approval",
    path:"/employee/internships",
    icon:<FiBriefcase />,
  },

  {
    name:"Users",
    path:"/employee/users",
    icon:<FiUsers />,
  },

  {
    name:"Companies",
    path:"/employee/companies",
    icon:<FiBriefcase />,
  },

  {
    name:"Universities",
    path:"/employee/universities",
    icon:<FiBookOpen />,
  },

  {
    name:"Reports",
    path:"/employee/reports",
    icon:<FiFileText />,
  },

  {
    name:"Communities",
    path:"/employee/communities",
    icon:<FiUsers />,
  },

  {
    name:"Profile",
    path:"/employee/profile",
    icon:<FiUser />,
  },

];



const Sidebar = () => {


return (

<aside className="w-72 border-r bg-white">


<div className="border-b p-6">

<h1 className="text-3xl font-bold">

<span className="text-[#D4AF37]">
Skil
</span>
vira

</h1>


<p className="text-sm text-gray-500">
Employee Panel
</p>


</div>



<nav className="space-y-2 p-4">


{
menu.map((item)=>(

<NavLink

key={item.name}

to={item.path}

className={({isActive})=>

`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
isActive
?"bg-[#D4AF37] text-white"
:"hover:bg-gray-100"
}`

}

>

{item.icon}

<span>
{item.name}
</span>


</NavLink>


))
}



</nav>



<div className="absolute bottom-5 w-72 px-4">


<button

onClick={()=>{

localStorage.removeItem("token");
localStorage.removeItem("user");

window.location.href="/";

}}

className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 hover:bg-red-50"

>

<FiLogOut />

Logout

</button>


</div>


</aside>


);


};


export default Sidebar;