import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

import {
  getUsers,
  approveRecruiter,
  rejectRecruiter,
  blockUser,
  unblockUser,
  deleteUser,
} from "../../services/controlService";



const Recruiters = () => {


  const [recruiters,setRecruiters] = useState([]);

  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");




  useEffect(()=>{

    loadRecruiters();

  },[]);




  const loadRecruiters = async()=>{

    try{

      setLoading(true);


      const data = await getUsers();


      setRecruiters(

        (data.users || []).filter(
          (u)=>u.role==="recruiter"
        )

      );


    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);

    }

  };





  const approve = async(id)=>{

    try{

      await approveRecruiter(id);

      loadRecruiters();

    }catch(error){

      console.log(error);

    }

  };





  const reject = async(id)=>{

    try{

      await rejectRecruiter(id);

      loadRecruiters();

    }catch(error){

      console.log(error);

    }

  };





  const block = async(id)=>{

    try{

      await blockUser(id);

      loadRecruiters();

    }catch(error){

      console.log(error);

    }

  };





  const unblock = async(id)=>{

    try{

      await unblockUser(id);

      loadRecruiters();

    }catch(error){

      console.log(error);

    }

  };





  const remove = async(id)=>{


    if(!window.confirm("Delete recruiter?"))
      return;


    try{

      await deleteUser(id);

      loadRecruiters();


    }catch(error){

      console.log(error);

    }

  };






  const filtered = recruiters.filter((item)=>

    item.name
    ?.toLowerCase()
    .includes(search.toLowerCase())

    ||

    item.email
    ?.toLowerCase()
    .includes(search.toLowerCase())

  );







  return (

    <div className="space-y-8">



      <div className="flex justify-between items-center">


        <div>

          <h1 className="text-3xl font-bold">
            Recruiter Management
          </h1>


          <p className="text-gray-500">
            Manage company recruiters and approvals.
          </p>


        </div>



        <div className="rounded-xl bg-green-100 px-5 py-3 text-green-700">

          Total: {recruiters.length}

        </div>


      </div>






      <div className="rounded-2xl bg-white p-8 shadow">



        <div className="relative mb-6 max-w-md">


          <FiSearch className="absolute left-4 top-4 text-gray-400"/>


          <input

            placeholder="Search recruiter..."

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

            className="w-full rounded-xl border p-3 pl-12"

          />


        </div>





        {
          loading ? (

            <p className="text-center">
              Loading recruiters...
            </p>


          ) : filtered.length===0 ? (


            <p className="text-center text-gray-500">
              No recruiters found.
            </p>


          ) : (



          <div className="overflow-x-auto">


          <table className="w-full">


          <thead className="bg-gray-100">


          <tr>

          <th className="p-4 text-left">
            Recruiter
          </th>

          <th>
            Email
          </th>

          <th>
            Approval
          </th>

          <th>
            Status
          </th>

          <th>
            Action
          </th>


          </tr>


          </thead>





          <tbody>


          {
            filtered.map((item)=>(


            <tr
              key={item._id}
              className="border-b hover:bg-gray-50"
            >


            <td className="p-4">


            <div className="flex items-center gap-3">


            <img

            src={
              item.avatar
              ?
              `http://localhost:5000${item.avatar}`
              :
              `https://ui-avatars.com/api/?name=${item.name}`
            }

            className="h-12 w-12 rounded-full"

            />


            <div>

            <p className="font-semibold">
              {item.name}
            </p>


            <p className="text-sm text-gray-500">
              Recruiter
            </p>


            </div>


            </div>


            </td>





            <td>
              {item.email}
            </td>





            <td>

            <span className={
              item.recruiterApproved
              ?
              "rounded-full bg-green-100 px-3 py-1 text-green-700"
              :
              "rounded-full bg-yellow-100 px-3 py-1 text-yellow-700"
            }>


            {
              item.recruiterApproved
              ?
              "Approved"
              :
              "Pending"
            }


            </span>


            </td>





            <td>

            <span className={
              item.status==="blocked"
              ?
              "rounded-full bg-red-100 px-3 py-1 text-red-700"
              :
              "rounded-full bg-green-100 px-3 py-1 text-green-700"
            }>

            {item.status || "active"}

            </span>


            </td>







            <td className="space-x-2">



            {
              item.recruiterApproved

              ?

              <button

              onClick={()=>reject(item._id)}

              className="rounded-lg bg-red-600 px-3 py-2 text-white"

              >

              Reject

              </button>


              :

              <button

              onClick={()=>approve(item._id)}

              className="rounded-lg bg-green-600 px-3 py-2 text-white"

              >

              Approve

              </button>

            }





            {
              item.status==="blocked"

              ?

              <button

              onClick={()=>unblock(item._id)}

              className="rounded-lg bg-blue-600 px-3 py-2 text-white"

              >

              Unblock

              </button>


              :

              <button

              onClick={()=>block(item._id)}

              className="rounded-lg bg-yellow-500 px-3 py-2 text-white"

              >

              Block

              </button>

            }





            <button

            onClick={()=>remove(item._id)}

            className="rounded-lg bg-red-700 px-3 py-2 text-white"

            >

            Delete

            </button>



            </td>



            </tr>


            ))
          }


          </tbody>


          </table>


          </div>


          )

        }


      </div>


    </div>

  );

};


export default Recruiters;