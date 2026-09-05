import { useEffect, useState } from "react";
import api from "../../services/api";


const Communities = () => {


const [communities,setCommunities] =
useState([]);


const [loading,setLoading] =
useState(true);






useEffect(()=>{

loadCommunities();

},[]);







const loadCommunities = async()=>{


try{


const {data} =
await api.get(
"/communities"
);



setCommunities(
data.communities || []
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

Community Management

</h1>


<p className="mt-2 text-gray-500">

Manage student, ambassador and professional communities.

</p>


</div>









<div className="grid gap-6 md:grid-cols-3">



<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="text-4xl font-bold">

{communities.length}

</h2>


<p className="mt-2 text-gray-500">

Total Communities

</p>


</div>







<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="text-4xl font-bold text-blue-600">

{
communities.filter(
(item)=>item.type==="student"
).length
}

</h2>


<p className="mt-2 text-gray-500">

Student Communities

</p>


</div>







<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="text-4xl font-bold text-green-600">

{
communities.filter(
(item)=>item.type==="professional"
).length
}

</h2>


<p className="mt-2 text-gray-500">

Professional Communities

</p>


</div>



</div>








<div className="rounded-2xl bg-white p-8 shadow">


<h2 className="mb-6 text-2xl font-bold">

Communities List

</h2>






{

loading ?


<p>

Loading communities...

</p>




:


communities.length===0 ?



<div className="rounded-xl border border-dashed p-10 text-center">


<div className="text-5xl">

🌐

</div>



<h3 className="mt-4 text-2xl font-bold">

No Communities Created

</h3>



<p className="mt-2 text-gray-500">

Community system will appear here.

</p>



</div>






:


<div className="space-y-4">



{

communities.map((community)=>(


<div

key={community._id}

className="rounded-xl border p-5"

>



<h3 className="text-xl font-bold">

{community.name}

</h3>



<p className="mt-2 text-gray-500">

{community.description}

</p>



<div className="mt-3">


<span className="rounded-full bg-purple-100 px-3 py-1 text-purple-700">

{community.type || "General"}

</span>


</div>




</div>



))


}



</div>



}



</div>





</div>

);

};


export default Communities;