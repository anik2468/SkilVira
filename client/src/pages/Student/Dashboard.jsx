import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiBriefcase,
  FiBookmark,
  FiAward,
  FiUser,
  FiBookOpen,
  FiArrowRight,
  FiMapPin,
} from "react-icons/fi";


import {
  getDashboardStats
} from "../../services/dashboardService";



const Dashboard = () => {


  const user =
    JSON.parse(
      localStorage.getItem("user")
    );



  const [dashboard,setDashboard] = useState(null);

  const [loading,setLoading] = useState(true);




  useEffect(()=>{

    loadDashboard();

  },[]);





  const loadDashboard = async()=>{

    try{

      const res =
        await getDashboardStats(
          user?.id || user?._id
        );


      setDashboard(res);


    }catch(error){

      console.log(error);

    }
    finally{

      setLoading(false);

    }

  };






  if(loading){

    return (

      <div className="flex h-[70vh] items-center justify-center">

        <h2 className="text-2xl font-bold">
          Loading Dashboard...
        </h2>

      </div>

    );

  }






  const stats =
    dashboard?.stats || {};





  return (

    <div className="space-y-8">





      {/* Welcome */}


      <div className="rounded-3xl bg-gradient-to-r from-[#D4AF37] to-yellow-500 p-8 text-white shadow-xl">


        <h1 className="text-4xl font-bold">

          Welcome Back, {user?.name || "Student"} 👋

        </h1>


        <p className="mt-3 text-lg">

          Learn skills, complete courses and grab your dream opportunity.

        </p>


      </div>









      {/* Stats */}


      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">



        <StatCard
          icon={<FiBriefcase />}
          value={stats.applied || 0}
          title="Applications"
        />


        <StatCard
          icon={<FiBookOpen />}
          value={stats.courses || 0}
          title="My Courses"
        />


        <StatCard
          icon={<FiBookmark />}
          value={stats.saved || 0}
          title="Saved"
        />


        <StatCard
          icon={<FiAward />}
          value={stats.certificates || 0}
          title="Certificates"
        />


        <StatCard
          icon={<FiUser />}
          value={`${stats.profileCompletion || 0}%`}
          title="Profile"
        />



      </div>









      {/* My Courses */}


      <div className="rounded-2xl bg-white p-8 shadow">


        <div className="mb-6 flex justify-between">


          <h2 className="text-3xl font-bold">
            My Courses
          </h2>



          <Link
            to="/student/my-courses"
            className="flex items-center gap-2 text-[#D4AF37]"
          >

            View All

            <FiArrowRight/>

          </Link>


        </div>





        {
          dashboard?.myCourses?.length ?

          (

            <div className="grid gap-5 md:grid-cols-4">


              {
                dashboard.myCourses.map((item)=>(


                  <div
                    key={item._id}
                    className="overflow-hidden rounded-xl border"
                  >


                    <img

                      src={
                        item.course?.thumbnail
                        ?
                        `http://localhost:5000${item.course.thumbnail}`
                        :
                        "https://via.placeholder.com/400"
                      }

                      className="h-32 w-full object-cover"

                    />



                    <div className="p-4">


                      <h3 className="font-bold">

                        {item.course?.title}

                      </h3>



                      <p className="mt-2 text-sm text-gray-500">

                        Progress {item.progress || 0}%

                      </p>



                      <Link

                        to="/student/my-courses"

                        className="mt-3 block rounded-lg bg-[#D4AF37] py-2 text-center text-white"

                      >

                        Continue

                      </Link>



                    </div>


                  </div>


                ))
              }


            </div>


          )

          :

          (

            <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">

              No enrolled courses yet.

            </div>

          )

        }


      </div>









      {/* Latest Internships */}



      <div className="rounded-2xl bg-white p-8 shadow">


        <div className="mb-6 flex justify-between">


          <h2 className="text-3xl font-bold">

            Latest Internships

          </h2>



          <Link

            to="/student/internships"

            className="flex items-center gap-2 text-[#D4AF37]"

          >

            View All

            <FiArrowRight/>

          </Link>


        </div>






        {

          dashboard?.latestInternships?.length ?

          dashboard.latestInternships.map((item)=>(


            <Link

              key={item._id}

              to={`/student/internships/${item._id}`}

              className="mb-4 block rounded-xl border p-5 hover:border-[#D4AF37]"

            >


              <h3 className="text-xl font-bold">

                {item.title}

              </h3>



              <p className="text-[#D4AF37]">

                {item.company}

              </p>




              <div className="mt-3 flex gap-5 text-sm text-gray-500">


                <span className="flex gap-2">

                  <FiMapPin/>

                  {item.location}

                </span>



                <span>

                  {item.workMode}

                </span>



                <span>

                  ₹ {item.price}

                </span>


              </div>



            </Link>


          ))


          :

          (

            <p className="text-gray-500">

              No internships available.

            </p>

          )

        }



      </div>









      {/* Profile Progress */}



      <div className="rounded-2xl bg-white p-8 shadow">


        <div className="mb-3 flex justify-between">


          <h2 className="text-2xl font-bold">

            Profile Completion

          </h2>



          <span className="font-bold text-[#D4AF37]">

            {stats.profileCompletion || 0}%

          </span>


        </div>





        <div className="h-4 rounded-full bg-gray-200">


          <div

            className="h-4 rounded-full bg-[#D4AF37] transition-all"

            style={{

              width:`${stats.profileCompletion || 0}%`

            }}

          />


        </div>




        <p className="mt-3 text-gray-500">

          Complete your profile to get better internship recommendations.

        </p>



      </div>






    </div>

  );


};





const StatCard = ({
  icon,
  value,
  title
})=>{


  return (

    <div className="rounded-2xl bg-white p-6 shadow">


      <div className="mb-4 text-4xl text-[#D4AF37]">

        {icon}

      </div>


      <h2 className="text-4xl font-bold">

        {value}

      </h2>


      <p className="text-gray-500">

        {title}

      </p>


    </div>

  );

};





export default Dashboard;