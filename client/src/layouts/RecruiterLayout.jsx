import { useState } from "react";
import { Outlet } from "react-router-dom";

import RecruiterSidebar from "../components/recruiter/RecruiterSidebar";
import RecruiterNavbar from "../components/recruiter/RecruiterNavbar";

const RecruiterLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F8F6]">
      <RecruiterSidebar
        mobileOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <RecruiterNavbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;