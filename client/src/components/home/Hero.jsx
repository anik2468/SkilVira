import Hero3D from "./Hero3D";

import Button from "../ui/Button";
import SearchBar from "./SearchBar";
import FloatingCards from "./FloatingCards";
import Stats from "./Stats";



const Hero = () => {


return (

<section className="relative overflow-hidden bg-white">


{/* 3D Background */}

<Hero3D />




{/* Content */}

<div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-between px-6 py-16 lg:flex-row">






{/* Left Content */}


<div className="max-w-xl">



<span className="
rounded-full 
bg-yellow-100 
px-4 
py-2 
text-sm 
font-semibold 
text-[#D4AF37]
">

🚀 Build Skills. Build Career.

</span>







<h1 className="
mt-8 
text-5xl 
font-extrabold 
leading-tight 
text-[#111827]
lg:text-7xl
">


Learn Skills

<br />


Get Real


<span className="text-[#D4AF37]">

 Experience

</span>


</h1>







<p className="
mt-6 
text-lg 
text-gray-600
">


SkilVira helps students learn industry skills, explore internships, complete courses, and build a successful career journey.


</p>







<SearchBar />







<div className="mt-6 flex flex-wrap gap-4">



<Button>

Explore Internships

</Button>




<Button variant="outline">

Start Learning

</Button>



</div>







<Stats />





</div>









{/* Right Content */}


<div className="
mt-12 
flex 
justify-center 
lg:mt-0
">


<FloatingCards />


</div>








</div>



</section>


);


};


export default Hero;