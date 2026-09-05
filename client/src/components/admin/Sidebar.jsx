import { NavLink } from "react-router-dom";


import {
  FiGrid,
  FiBriefcase,
  FiUsers,
  FiBookOpen,
  FiFileText,
  FiAward,
  FiSettings,
  FiLogOut,
  FiUserCheck,
} from "react-icons/fi";



const Sidebar = () => {


  const user = JSON.parse(
    localStorage.getItem("user")
  );


  const role = user?.role || "student";



  const menus = {


    student: [

      {
        name: "Dashboard",
        icon: <FiGrid />,
        path: "/student/dashboard",
      },

      {
        name: "Internships",
        icon: <FiBriefcase />,
        path: "/student/internships",
      },

      {
        name: "Applications",
        icon: <FiFileText />,
        path: "/student/applications",
      },

      {
        name: "Saved",
        icon: <FiAward />,
        path: "/student/saved",
      },

      {
        name: "My Courses",
        icon: <FiBookOpen />,
        path: "/student/my-courses",
      },

      {
        name: "Certificates",
        icon: <FiAward />,
        path: "/student/certificates",
      },

      {
        name: "Profile",
        icon: <FiUsers />,
        path: "/student/profile",
      },

      {
        name: "Settings",
        icon: <FiSettings />,
        path: "/student/settings",
      },

    ],



    employee: [

      {
        name: "Dashboard",
        icon: <FiGrid />,
        path: "/employee/dashboard",
      },

      {
        name: "Users",
        icon: <FiUsers />,
        path: "/employee/users",
      },

      {
        name: "Companies",
        icon: <FiBriefcase />,
        path: "/employee/companies",
      },

      {
        name: "Universities",
        icon: <FiBookOpen />,
        path: "/employee/universities",
      },

      {
        name: "Reports",
        icon: <FiFileText />,
        path: "/employee/reports",
      },

      {
        name: "Communities",
        icon: <FiUsers />,
        path: "/employee/communities",
      },

      {
        name: "Profile",
        icon: <FiSettings />,
        path: "/employee/profile",
      },

    ],




    control: [

      {
        name: "Dashboard",
        icon: <FiGrid />,
        path: "/control/dashboard",
      },

      {
        name: "Courses",
        icon: <FiBookOpen />,
        path: "/control/courses",
      },

      {
        name: "Certificate Templates",
        icon: <FiAward />,
        path: "/control/certificate-templates",
      },

      {
        name: "Internships",
        icon: <FiBriefcase />,
        path: "/control/internships",
      },

      {
        name: "Recruiters",
        icon: <FiUserCheck />,
        path: "/control/recruiters",
      },

      {
        name: "Students",
        icon: <FiUsers />,
        path: "/control/students",
      },

      {
        name: "Applications",
        icon: <FiFileText />,
        path: "/control/applications",
      },

      {
        name: "Certificates",
        icon: <FiAward />,
        path: "/control/certificates",
      },

      {
        name: "Colleges",
        icon: <FiBookOpen />,
        path: "/control/colleges",
      },

      {
        name: "Create User",
        icon: <FiUsers />,
        path: "/control/create-user",
      },

      {
        name: "Settings",
        icon: <FiSettings />,
        path: "/control/settings",
      },

    ],


  };




 const items =
  role === "admin"
    ? menus.control
    : menus[role] || [];





  const logout = () => {


    localStorage.removeItem("token");


    localStorage.removeItem("user");


    window.location.href = "/";


  };





  return (


    <aside className="relative min-h-screen w-72 border-r bg-white">



      <div className="border-b p-6">


        <h1 className="text-3xl font-bold">


          <span className="text-[#D4AF37]">
            Skil
          </span>

          vira


        </h1>



        <p className="mt-1 text-sm capitalize text-gray-500">

          {role} Panel

        </p>


      </div>





      <nav className="space-y-2 p-4">


        {items.map((item)=>(


          <NavLink

            key={item.path}

            to={item.path}

            className={({isActive})=>

              `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
              
              isActive

              ? "bg-[#D4AF37] text-white"

              : "hover:bg-gray-100"

              }`

            }

          >


            {item.icon}


            <span>
              {item.name}
            </span>


          </NavLink>


        ))}


      </nav>






      <div className="absolute bottom-5 w-full px-4">


        <button

          onClick={logout}

          className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 hover:bg-red-50"

        >

          <FiLogOut />

          Logout


        </button>


      </div>





    </aside>


  );


};



export default Sidebar;