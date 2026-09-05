import {
  FiDownload,
} from "react-icons/fi";

import { Link } from "react-router-dom";


const ProfileHeader = ({ profile }) => {


return (

<div className="overflow-hidden rounded-3xl bg-white shadow">


{/* Cover */}

<div className="h-44 bg-gradient-to-r from-[#D4AF37] via-yellow-500 to-amber-600" />



<div className="relative px-8 pb-8">



<div className="-mt-20 flex flex-col lg:flex-row lg:items-end lg:justify-between">



<div className="flex items-end gap-6">


<div>


<img

src={

profile?.profilePicture

?

`http://localhost:5000${profile.profilePicture}`

:

"https://ui-avatars.com/api/?name=Student&background=D4AF37&color=fff&size=200"

}

alt="Profile"

className="h-40 w-40 rounded-full border-8 border-white object-cover shadow-lg"

/>


</div>






<div className="pb-4">


<h1 className="text-4xl font-bold">

{profile?.user?.name || "Student"}

</h1>



<p className="mt-2 text-lg text-[#D4AF37]">

{profile?.degree || "Degree"} • {profile?.branch || "Branch"}

</p>





<div className="mt-3 flex flex-wrap gap-5 text-gray-500">


<span>

{profile?.user?.email}

</span>


<span>

{profile?.phone || "Not Added"}

</span>


<span>

{profile?.city || "City"},{" "}
{profile?.state || "State"}

</span>



</div>


</div>



</div>







<div className="mt-6 flex gap-4 lg:mt-0">


<Link

to="/student/profile/edit"

className="rounded-xl bg-[#D4AF37] px-5 py-3 text-white font-semibold"

>

Edit Profile

</Link>




<button

className="flex items-center gap-2 rounded-xl border border-[#D4AF37] px-6 py-3 font-semibold text-[#D4AF37]"

>

<FiDownload />

Resume

</button>



</div>



</div>






{/* Profile Strength */}


<div className="mt-8">


<div className="mb-2 flex justify-between">


<span className="font-semibold">

Profile Strength

</span>



<span className="font-bold text-[#D4AF37]">

{profile?.profileCompleted || 0}%

</span>


</div>




<div className="h-3 rounded-full bg-gray-200">


<div

className="h-3 rounded-full bg-[#D4AF37]"

style={{

width:`${profile?.profileCompleted || 0}%`

}}

/>


</div>


</div>





</div>

</div>

);

};


export default ProfileHeader;