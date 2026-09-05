import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  FiSearch,
  FiTrash2,
  FiLock,
  FiUnlock,
} from "react-icons/fi";


const Users = () => {


const [users,setUsers] =
useState([]);


const [loading,setLoading] =
useState(true);


const [search,setSearch] =
useState("");







useEffect(()=>{

loadUsers();

},[]);








const loadUsers = async()=>{


try{


const {data} =
await api.get(
"/users"
);



setUsers(
data.users || []
);



}catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};









const blockUser = async(id)=>{


try{


await api.put(
`/users/block/${id}`
);


loadUsers();


}catch(error){

console.log(error);

}

};









const unblockUser = async(id)=>{


try{


await api.put(
`/users/unblock/${id}`
);


loadUsers();


}catch(error){

console.log(error);

}

};









const deleteUser = async(id)=>{


if(!confirm(
"Delete this user?"
))

return;



try{


await api.delete(
`/users/${id}`
);


loadUsers();


}catch(error){

console.log(error);

}

};









const filteredUsers =
users.filter((user)=>

user.name
?.toLowerCase()
.includes(
search.toLowerCase()
)

||
user.email
?.toLowerCase()
.includes(
search.toLowerCase()
)

);









return (

<div className="space-y-8">





<div>


<h1 className="text-4xl font-bold">

User Management

</h1>


<p className="mt-2 text-gray-500">

Manage all SkilVira users.

</p>


</div>








<div className="rounded-2xl bg-white p-6 shadow">



<div className="relative mb-6 max-w-md">


<FiSearch

className="absolute left-4 top-4 text-gray-400"

/>


<input

placeholder="Search users..."

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

className="w-full rounded-xl border p-3 pl-12"

/>


</div>









{

loading ?


<p>

Loading users...

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

Role

</th>


<th>

Status

</th>


<th>

Actions

</th>


</tr>


</thead>







<tbody>


{

filteredUsers.map((user)=>(


<tr

key={user._id}

className="border-b hover:bg-gray-50"

>



<td className="p-4">


<div>

<p className="font-semibold">

{user.name}

</p>


<p className="text-sm text-gray-500">

{user.email}

</p>

</div>


</td>







<td>


<span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">

{user.role}

</span>


</td>








<td>


<span

className={

user.status==="blocked"

?

"rounded-full bg-red-100 px-3 py-1 text-red-700"

:

"rounded-full bg-green-100 px-3 py-1 text-green-700"

}

>

{user.status}

</span>


</td>








<td className="space-x-3">


{

user.status==="blocked"

?


<button

onClick={()=>unblockUser(user._id)}

className="rounded-lg bg-green-600 p-2 text-white"

>

<FiUnlock/>

</button>



:


<button

onClick={()=>blockUser(user._id)}

className="rounded-lg bg-yellow-500 p-2 text-white"

>

<FiLock/>

</button>



}







<button

onClick={()=>deleteUser(user._id)}

className="rounded-lg bg-red-600 p-2 text-white"

>

<FiTrash2/>

</button>





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


export default Users;