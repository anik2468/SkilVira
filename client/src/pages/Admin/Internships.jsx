import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";

import {
  getInternships,
  deleteInternship,
} from "../../services/internshipService";

import {
  approveInternship,
  rejectInternship,
} from "../../services/controlService";


import AddInternshipModal from "../../components/admin/AddInternshipModal";
import EditInternshipModal from "../../components/admin/EditInternshipModal";


const Internships = () => {


const [internships,setInternships] = useState([]);

const [loading,setLoading] = useState(true);

const [showModal,setShowModal] = useState(false);

const [showEditModal,setShowEditModal] = useState(false);

const [selectedInternship,setSelectedInternship] = useState(null);

const [search,setSearch] = useState("");




useEffect(()=>{

fetchInternships();

},[]);





const fetchInternships = async()=>{

try{

setLoading(true);

const data = await getInternships();

setInternships(
data.internships || []
);


}catch(error){

console.log(error);

}finally{

setLoading(false);

}

};






const handleDelete = async(id)=>{


if(!window.confirm("Delete this internship?"))
return;


try{

await deleteInternship(id);

alert("Internship deleted");

fetchInternships();


}catch(error){

console.log(error);

}

};






const handleApprove = async(id)=>{


try{

await approveInternship(id);

alert("Internship Approved");

fetchInternships();


}catch(error){

console.log(error);

}

};






const handleReject = async(id)=>{


try{

await rejectInternship(id);

alert("Internship Rejected");

fetchInternships();


}catch(error){

console.log(error);

}

};







const filteredInternships =
internships.filter((item)=>

item.title
?.toLowerCase()
.includes(
search.toLowerCase()
)

);






return (

<>

<div className="p-6">


<div className="mb-8 flex items-center justify-between">


<div>

<h1 className="text-3xl font-bold">
Internship Management
</h1>


<p className="text-gray-500">
Manage internships approval and publishing.
</p>


</div>




<button

onClick={()=>setShowModal(true)}

className="rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-white"

>

+ Add Internship

</button>



</div>







<div className="mb-6 relative w-96">


<FiSearch className="absolute left-4 top-4 text-gray-400"/>


<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Search internship..."

className="w-full rounded-xl border py-3 pl-12 pr-4"

/>


</div>








<div className="overflow-hidden rounded-2xl bg-white shadow">


<table className="w-full">


<thead className="bg-gray-100">


<tr>

<th className="p-4 text-left">
Title
</th>

<th>
Company
</th>

<th>
Status
</th>

<th>
Approval
</th>

<th>
Action
</th>


</tr>


</thead>







<tbody>


{
loading ? (

<tr>

<td
colSpan="5"
className="p-8 text-center"
>

Loading...

</td>

</tr>


)


:


filteredInternships.map((item)=>(


<tr

key={item._id}

className="border-t"

>



<td className="p-4 font-semibold">

{item.title}

</td>





<td>

{item.company}

</td>





<td>

{item.status}

</td>






<td>

<span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">

{item.approvalStatus || "Pending"}

</span>

</td>







<td className="space-x-2">





<button

onClick={()=>handleApprove(item._id)}

className="rounded-lg bg-green-600 px-3 py-2 text-white"

>

Approve

</button>





<button

onClick={()=>handleReject(item._id)}

className="rounded-lg bg-red-600 px-3 py-2 text-white"

>

Reject

</button>







<button

onClick={()=>{

setSelectedInternship(item);

setShowEditModal(true);

}}

className="rounded-lg p-2 hover:bg-blue-100"

>

<FiEdit2 className="text-blue-600"/>

</button>







<button

onClick={()=>handleDelete(item._id)}

className="rounded-lg p-2 hover:bg-red-100"

>

<FiTrash2 className="text-red-600"/>

</button>




</td>






</tr>


))


}



</tbody>


</table>


</div>



</div>








{

showModal && (

<AddInternshipModal

onClose={()=>setShowModal(false)}

onSuccess={()=>{

fetchInternships();

setShowModal(false);

}}

/>

)

}







{

showEditModal && selectedInternship && (

<EditInternshipModal

internship={selectedInternship}

onClose={()=>{

setShowEditModal(false);

setSelectedInternship(null);

}}

onSuccess={()=>{

fetchInternships();

setShowEditModal(false);

setSelectedInternship(null);

}}

/>

)

}



</>

);

};


export default Internships;