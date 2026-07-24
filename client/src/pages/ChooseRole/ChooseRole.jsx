import {
  FiUser,
  FiBriefcase,
  FiBookOpen,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const roles = [
  {
    title: "Student",
    path: "student",
    icon: <FiUser size={42} />,
  },
  {
    title: "Recruiter",
    path: "recruiter",
    icon: <FiBriefcase size={42} />,
  },
  {
    title: "College Ambassador",
    path: "ambassador",
    icon: <FiBookOpen size={42} />,
  },
  {
    title: "Employee",
    path: "employee",
    icon: <FiUsers size={42} />,
  },
];

const ChooseRole = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
      <div className="w-full max-w-7xl">

        <h1 className="mb-3 text-center text-5xl font-bold">
          Welcome to <span className="text-[#D4AF37]">SkilVira</span>
        </h1>

        <p className="mb-14 text-center text-gray-500">
          Choose how you want to continue.
        </p>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {roles.map((role) => (
            <Link
              key={role.path}
              to={`/login/${role.path}`}
              className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm transition-all hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-xl"
            >
              <div className="mb-6 flex justify-center text-[#D4AF37]">
                {role.icon}
              </div>

              <h2 className="text-2xl font-bold">
                {role.title}
              </h2>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ChooseRole;