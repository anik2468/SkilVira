import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

import {
  getUsers,
  blockUser,
  unblockUser,
  deleteUser,
} from "../../services/controlService";


const Students = () => {


  const [students,setStudents] = useState([]);

  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");




  useEffect(()=>{

    loadStudents();

  },[]);




  const loadStudents = async()=>{

    try{

      setLoading(true);


      const data = await getUsers();


      setStudents(

        (data.users || []).filter(
          (user)=>user.role==="student"
        )

      );


    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);

    }

  };





  const handleBlock = async(id)=>{

    try{

      await blockUser(id);

      loadStudents();

    }catch(error){

      console.log(error);

    }

  };





  const handleUnblock = async(id)=>{

    try{

      await unblockUser(id);

      loadStudents();

    }catch(error){

      console.log(error);

    }

  };





  const handleDelete = async(id)=>{


    if(
      !window.confirm(
        "Delete this student?"
      )
    )
    return;



    try{

      await deleteUser(id);

      loadStudents();


    }catch(error){

      console.log(error);

    }


  };






  const filteredStudents = students.filter(
    (student)=>

      student.name
      ?.toLowerCase()
      .includes(search.toLowerCase())

      ||

      student.email
      ?.toLowerCase()
      .includes(search.toLowerCase())

  );







  return (

    <div className="space-y-8">



      <div className="flex items-center justify-between">


        <div>

          <h1 className="text-3xl font-bold">
            Student Management
          </h1>


          <p className="text-gray-500">
            Manage all registered students.
          </p>


        </div>



        <div className="rounded-xl bg-blue-100 px-5 py-3 text-blue-700">

          Total: {students.length}

        </div>


      </div>





      <div className="rounded-2xl bg-white p-8 shadow">



        <div className="relative mb-6 max-w-md">


          <FiSearch className="absolute left-4 top-4 text-gray-400"/>


          <input

            placeholder="Search student..."

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

            className="w-full rounded-xl border p-3 pl-12"

          />


        </div>





        {
          loading ? (

            <p className="text-center">
              Loading students...
            </p>


          ) : filteredStudents.length===0 ? (


            <p className="text-center text-gray-500">
              No students found.
            </p>


          ) : (



          <div className="overflow-x-auto">


          <table className="w-full">


          <thead className="bg-gray-100">

          <tr>

          <th className="p-4 text-left">
            Student
          </th>

          <th>
            Email
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
            filteredStudents.map((student)=>(


            <tr
              key={student._id}
              className="border-b hover:bg-gray-50"
            >


            <td className="p-4">

            <div className="flex items-center gap-3">


            <img

            src={
              student.avatar
              ?
              `http://localhost:5000${student.avatar}`
              :
              `https://ui-avatars.com/api/?name=${student.name}`
            }

            className="h-12 w-12 rounded-full object-cover"

            />


            <div>

            <p className="font-semibold">
              {student.name}
            </p>


            <p className="text-sm text-gray-500">
              Student
            </p>


            </div>


            </div>

            </td>





            <td>
              {student.email}
            </td>





            <td>

            <span

            className={
              student.status==="blocked"
              ?
              "rounded-full bg-red-100 px-3 py-1 text-red-700"
              :
              "rounded-full bg-green-100 px-3 py-1 text-green-700"
            }

            >

            {student.status || "active"}

            </span>

            </td>






            <td className="space-x-3">


            {
              student.status==="blocked"

              ?

              <button

              onClick={()=>handleUnblock(student._id)}

              className="rounded-lg bg-green-600 px-4 py-2 text-white"

              >

              Unblock

              </button>


              :


              <button

              onClick={()=>handleBlock(student._id)}

              className="rounded-lg bg-yellow-500 px-4 py-2 text-white"

              >

              Block

              </button>

            }





            <button

            onClick={()=>handleDelete(student._id)}

            className="rounded-lg bg-red-600 px-4 py-2 text-white"

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


export default Students;