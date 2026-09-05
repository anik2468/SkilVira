import { useEffect, useState } from "react";
import api from "../../services/api";


const Companies = () => {


const [companies,setCompanies] =
useState([]);


const [loading,setLoading] =
useState(true);





useEffect(()=>{

loadCompanies();

},[]);







const loadCompanies = async()=>{


try{


const {data} =
await api.get("/companies");


setCompanies(
data.companies || []
);



}catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};







return (

<div className="rounded-2xl bg-white p-8 shadow">



<div className="mb-6">


<h1 className="text-3xl font-bold">

Partner Companies

</h1>


<p className="text-gray-500">

Manage verified companies and partnerships.

</p>


</div>







{

loading ?


<p className="text-center text-gray-500">

Loading companies...

</p>



:


companies.length===0 ?



<div className="rounded-xl border p-8 text-center">


<div className="text-5xl">

🏢

</div>


<h2 className="mt-4 text-2xl font-bold">

No Companies Found

</h2>


<p className="mt-2 text-gray-500">

Registered companies will appear here.

</p>



</div>





:


<div className="overflow-x-auto">


<table className="w-full">


<thead className="bg-gray-100">


<tr>


<th className="p-4 text-left">

Company

</th>


<th>

Industry

</th>


<th>

Website

</th>


<th>

Status

</th>


</tr>


</thead>






<tbody>


{

companies.map((company)=>(



<tr

key={company._id}

className="border-b hover:bg-gray-50"

>



<td className="p-4">


<div className="flex items-center gap-3">


<img

src={

company.logo

?

`http://localhost:5000${company.logo}`

:

`https://ui-avatars.com/api/?name=${company.name}`

}

className="h-12 w-12 rounded-full object-cover"

/>


<div>


<p className="font-semibold">

{company.name}

</p>


<p className="text-sm text-gray-500">

{company.email}

</p>


</div>


</div>


</td>







<td>

{company.industry || "-"}

</td>







<td>


{company.website ? (

<a

href={company.website}

target="_blank"

className="text-blue-600"

>

Visit

</a>

)

:

"-"

}



</td>







<td>


<span className="rounded-full bg-green-100 px-3 py-1 text-green-700">

Verified

</span>


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


export default Companies;