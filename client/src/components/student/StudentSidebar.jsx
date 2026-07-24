import { NavLink } from "react-router-dom";

const StudentSidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-8">
        Skil<span className="text-yellow-400">Vira</span>
      </h1>

      <nav className="space-y-3">
        <NavLink to="/student/dashboard">Dashboard</NavLink>
        <br />
        <NavLink to="/student/internships">Internships</NavLink>
        <br />
        <NavLink to="/student/applications">Applications</NavLink>
        <br />
        <NavLink to="/student/saved">Saved</NavLink>
        <br />
        <NavLink to="/student/profile">Profile</NavLink>
      </nav>
    </aside>
  );
};

export default StudentSidebar;