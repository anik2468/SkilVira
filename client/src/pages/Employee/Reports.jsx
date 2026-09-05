import { useEffect, useState } from "react";
import api from "../../services/api";


const Reports = () => {


const [stats,setStats] =
useState({

total:0,

pending:0,

resolved:0,

});


const [reports,setReports] =
useState([]);



const [loading,setLoading] =
useState(true);







useEffect(()=>{

loadReports();

},[]);







const loadReports = async()=>{


try{


const {data} =
await api.get(
"/reports"
);



setStats({

total:
data.stats?.total || 0,


pending:
data.stats?.pending || 0,


resolved:
data.stats?.resolved || 0,

});



setReports(
data.reports || []
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

Reports Management

</h1>


<p className="mt-2 text-gray-500">

Monitor platform issues and complaints.

</p>


</div>








<div className="grid gap-6 md:grid-cols-3">





<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="text-4xl font-bold">

{stats.total}

</h2>


<p className="mt-2 text-gray-500">

Total Reports

</p>


</div>








<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="text-4xl font-bold text-yellow-600">

{stats.pending}

</h2>


<p className="mt-2 text-gray-500">

Pending Reports

</p>


</div>








<div className="rounded-2xl bg-white p-6 shadow">


<h2 className="text-4xl font-bold text-green-600">

{stats.resolved}

</h2>


<p className="mt-2 text-gray-500">

Resolved Reports

</p>


</div>






</div>









<div className="rounded-2xl bg-white p-8 shadow">


<h2 className="mb-6 text-2xl font-bold">

Recent Reports

</h2>







{

loading ?


<p>

Loading reports...

</p>




:


reports.length===0 ?


<p className="text-gray-500">

No reports available.

</p>




:


<div className="overflow-x-auto">


<table className="w-full">


<thead className="bg-gray-100">


<tr>


<th className="p-4 text-left">

User

</th>


<th>

Issue

</th>


<th>

Status

</th>


</tr>


</thead>






<tbody>


{

reports.map((report)=>(


<tr

key={report._id}

className="border-b"

>


<td className="p-4">

{report.user?.name || "N/A"}

</td>


<td>

{report.message || "-"}

</td>


<td>


<span

className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700"

>

{report.status || "Pending"}

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







</div>

);

};


export default Reports;