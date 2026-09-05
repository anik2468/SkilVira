import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

import {
  getCertificates,
  verifyCertificate as verifyCertificateApi,
  rejectCertificate as rejectCertificateApi,
} from "../../services/certificateService";



const Certificates = () => {


  const [certificates,setCertificates] = useState([]);

  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");

  const [filter,setFilter] = useState("All");





  useEffect(()=>{

    fetchCertificates();

  },[]);






  const fetchCertificates = async()=>{

    try{

      setLoading(true);


      const data = await getCertificates();


      setCertificates(
        data.certificates || []
      );


    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);

    }

  };







  const verifyCertificate = async(id)=>{


    try{


      await verifyCertificateApi(id);


      fetchCertificates();



    }catch(error){

      console.log(error);

    }


  };







  const rejectCertificate = async(id)=>{


    try{


      await rejectCertificateApi(id);


      fetchCertificates();



    }catch(error){

      console.log(error);

    }


  };







  const filteredCertificates = certificates.filter(
    (item)=>{


      const text =

      `${item.title}
      ${item.issuer}
      ${item.student?.name}
      ${item.student?.email}`
      .toLowerCase();



      const searchMatch =
      text.includes(
        search.toLowerCase()
      );



      const statusMatch =

      filter==="All"

      ?

      true

      :

      filter==="Verified"

      ?

      item.verified

      :

      !item.verified;



      return searchMatch && statusMatch;


    }
  );









  return (

    <div className="space-y-8">



      <div className="flex items-center justify-between">


        <div>

          <h1 className="text-3xl font-bold">
            Certificate Management
          </h1>


          <p className="text-gray-500">
            Verify and manage student certificates.
          </p>


        </div>




        <div className="rounded-xl bg-[#D4AF37] px-5 py-3 font-bold text-white">

          Total {certificates.length}

        </div>


      </div>







      <div className="rounded-2xl bg-white p-8 shadow">



        <div className="mb-6 flex gap-4">



          <div className="relative w-full max-w-md">


            <FiSearch className="absolute left-4 top-4 text-gray-400"/>


            <input

              placeholder="Search certificate..."

              value={search}

              onChange={(e)=>setSearch(e.target.value)}

              className="w-full rounded-xl border p-3 pl-12"

            />


          </div>







          <select

            value={filter}

            onChange={(e)=>setFilter(e.target.value)}

            className="rounded-xl border px-5"

          >

            <option>
              All
            </option>


            <option>
              Verified
            </option>


            <option>
              Pending
            </option>


          </select>



        </div>







        {

        loading ?


        <p className="text-center">
          Loading certificates...
        </p>



        :



        filteredCertificates.length===0 ?


        <p className="text-center text-gray-500">
          No certificates found.
        </p>




        :



        <div className="overflow-x-auto">


        <table className="w-full">


        <thead className="bg-gray-100">


        <tr>


        <th className="p-4 text-left">
          Student
        </th>


        <th>
          Certificate
        </th>


        <th>
          Issuer
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

        filteredCertificates.map((item)=>(


        <tr

          key={item._id}

          className="border-b hover:bg-gray-50"

        >




        <td className="p-4">


        <p className="font-semibold">

          {item.student?.name || "Student"}

        </p>


        <p className="text-sm text-gray-500">

          {item.student?.email}

        </p>


        </td>






        <td>


        <p className="font-medium">

          {item.title}

        </p>



        {

        item.certificateUrl &&

        <a

          href={item.certificateUrl}

          target="_blank"

          className="text-blue-600 underline text-sm"

        >

          View Certificate

        </a>

        }


        </td>






        <td>

          {item.issuer}

        </td>






        <td>


        <span

        className={

        item.verified

        ?

        "rounded-full bg-green-100 px-3 py-1 text-green-700"

        :

        "rounded-full bg-yellow-100 px-3 py-1 text-yellow-700"

        }

        >

        {
          item.verified
          ?
          "Verified"
          :
          "Pending"
        }


        </span>


        </td>






        <td className="space-x-2">



        {

        !item.verified &&

        <button

          onClick={()=>verifyCertificate(item._id)}

          className="rounded-lg bg-green-600 px-3 py-2 text-white"

        >

          Verify

        </button>

        }





        <button

          onClick={()=>rejectCertificate(item._id)}

          className="rounded-lg bg-red-600 px-3 py-2 text-white"

        >

          Reject

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


export default Certificates;