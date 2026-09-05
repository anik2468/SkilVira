import {
FiBriefcase,
FiUsers,
FiShield,
FiBookOpen
} from "react-icons/fi";


const stats=[

{
icon:<FiBriefcase/>,
title:"Internships",
value:"Launching Soon"
},


{
icon:<FiBookOpen/>,
title:"Courses",
value:"Coming Soon"
},


{
icon:<FiUsers/>,
title:"Students",
value:"Growing"
},


{
icon:<FiShield/>,
title:"Verified Platform",
value:"Secure"
}


];



const Stats=()=>{


return(

<div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">


{

stats.map((item,index)=>(

<div
key={index}
className="
rounded-2xl
border
bg-white
p-5
shadow-sm
hover:shadow-lg
transition
"
>


<div className="text-3xl text-[#D4AF37]">

{item.icon}

</div>


<h3 className="mt-3 font-bold">

{item.title}

</h3>


<p className="text-[#D4AF37] font-semibold">

{item.value}

</p>


</div>


))

}


</div>

);


};


export default Stats;