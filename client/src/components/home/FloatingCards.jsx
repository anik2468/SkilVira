import {
  FiAward,
  FiBriefcase,
  FiBookOpen,
} from "react-icons/fi";

import { motion } from "framer-motion";



const FloatingCards = () => {


return (

<div className="relative h-[500px] w-[500px]">


{/* Center Rocket */}


<motion.div

animate={{
y:[0,-20,0],
rotate:[0,5,-5,0]
}}

transition={{
duration:5,
repeat:Infinity,
ease:"easeInOut"
}}

className="
absolute
left-1/2
top-1/2
flex
h-60
w-60
-translate-x-1/2
-translate-y-1/2
items-center
justify-center
rounded-full
bg-gradient-to-br
from-[#D4AF37]
to-[#F4D77A]
shadow-2xl
"

>


<span className="text-8xl">

🚀

</span>


</motion.div>





{/* Learning Card */}


<motion.div

initial={{
opacity:0,
x:-50
}}

animate={{
opacity:1,
x:0,
y:[0,-15,0]
}}

transition={{
duration:1.5,
y:{
duration:4,
repeat:Infinity
}
}}

className="
absolute
left-0
top-12
w-60
rounded-3xl
border
bg-white/80
p-6
shadow-2xl
backdrop-blur
rotate-[-8deg]
"

>


<FiBookOpen className="text-4xl text-[#D4AF37]" />


<h3 className="mt-4 text-xl font-bold">

Skill Learning

</h3>


<p className="mt-2 text-gray-500">

Industry focused courses

</p>


</motion.div>








{/* Certificate Card */}


<motion.div

initial={{
opacity:0,
x:50
}}

animate={{
opacity:1,
x:0,
y:[0,15,0]
}}

transition={{
duration:1.5,
y:{
duration:5,
repeat:Infinity
}
}}

className="
absolute
right-0
top-24
w-56
rounded-3xl
border
bg-white/80
p-6
shadow-2xl
backdrop-blur
rotate-[8deg]
"

>


<FiAward className="text-4xl text-[#D4AF37]" />


<h3 className="mt-4 font-bold">

Verified Certificate

</h3>


<p className="mt-2 text-gray-500">

QR Based Verification

</p>


</motion.div>







{/* Internship Card */}


<motion.div

animate={{
y:[0,-10,0]
}}

transition={{
duration:4,
repeat:Infinity
}}

className="
absolute
bottom-10
left-1/2
w-64
-translate-x-1/2
rounded-3xl
border
bg-white/80
p-6
shadow-2xl
backdrop-blur
"

>


<FiBriefcase className="text-4xl text-[#D4AF37]" />


<h3 className="mt-3 text-xl font-bold">

Career Opportunities

</h3>


<p className="mt-2 text-gray-500">

Learn → Practice → Grow

</p>


</motion.div>



</div>

);


};


export default FloatingCards;