import { FiMail, FiUser, FiShield, FiCalendar } from "react-icons/fi";


const Profile = () => {


const user =
JSON.parse(
localStorage.getItem("user")
);





return (

<div className="space-y-8">





<div>


<h1 className="text-3xl font-bold">

Employee Profile

</h1>


<p className="mt-2 text-gray-500">

Manage your employee account details.

</p>


</div>








<div className="overflow-hidden rounded-3xl bg-white shadow">



<div className="h-40 bg-gradient-to-r from-[#D4AF37] to-yellow-600" />





<div className="relative px-8 pb-8">





<div className="-mt-20 flex items-end gap-6">





<img

src={

user?.avatar

?

`http://localhost:5000${user.avatar}`

:

`https://ui-avatars.com/api/?name=${user?.name}`

}

className="h-36 w-36 rounded-full border-8 border-white object-cover shadow"

alt="profile"

/>






<div className="pb-4">


<h2 className="text-3xl font-bold">

{user?.name || "Employee"}

</h2>



<p className="text-[#D4AF37]">

SkilVira Employee

</p>



</div>





</div>









<div className="mt-10 grid gap-6 md:grid-cols-2">





<div className="rounded-xl border p-5">


<div className="flex items-center gap-3">


<FiUser className="text-[#D4AF37]"/>


<div>


<p className="text-sm text-gray-500">

Name

</p>


<p className="font-semibold">

{user?.name}

</p>


</div>


</div>


</div>







<div className="rounded-xl border p-5">


<div className="flex items-center gap-3">


<FiMail className="text-[#D4AF37]"/>


<div>


<p className="text-sm text-gray-500">

Email

</p>


<p className="font-semibold">

{user?.email}

</p>


</div>


</div>


</div>








<div className="rounded-xl border p-5">


<div className="flex items-center gap-3">


<FiShield className="text-[#D4AF37]"/>


<div>


<p className="text-sm text-gray-500">

Role

</p>


<p className="font-semibold capitalize">

{user?.role}

</p>


</div>


</div>


</div>








<div className="rounded-xl border p-5">


<div className="flex items-center gap-3">


<FiCalendar className="text-[#D4AF37]"/>


<div>


<p className="text-sm text-gray-500">

Joined

</p>


<p className="font-semibold">

{

user?.createdAt

?

new Date(
user.createdAt
).toLocaleDateString()

:

"-"

}

</p>


</div>


</div>


</div>







</div>






</div>





</div>






</div>

);

};


export default Profile;