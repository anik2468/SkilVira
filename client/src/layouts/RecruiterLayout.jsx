import { Outlet } from "react-router-dom";
import RecruiterSidebar from "../components/recruiter/RecruiterSidebar";
import RecruiterNavbar from "../components/recruiter/RecruiterNavbar";

const RecruiterLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <RecruiterSidebar />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Navbar */}
        <RecruiterNavbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default RecruiterLayout;