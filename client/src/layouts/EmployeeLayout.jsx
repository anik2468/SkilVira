import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/employee/Sidebar";
import Topbar from "../components/employee/Topbar";

const EmployeeLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={closeSidebar}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;