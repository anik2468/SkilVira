import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
  FiMenu,
  FiX,
} from "react-icons/fi";

import StudentSidebar from "../components/student/StudentSidebar";
import StudentNavbar from "../components/student/StudentNavbar";

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={[
          "fixed left-0 top-0 z-50 h-screen transition-transform duration-300 lg:sticky lg:z-30 lg:block lg:translate-x-0",
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        <StudentSidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Top Bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={
              sidebarOpen
                ? "Close navigation"
                : "Open navigation"
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
          >
            {sidebarOpen ? (
              <FiX size={22} />
            ) : (
              <FiMenu size={22} />
            )}
          </button>

          <div className="ml-3">
            <h1 className="text-lg font-bold text-slate-900">
              Skil<span className="text-[#D4AF37]">Vira</span>
            </h1>

            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Student Portal
            </p>
          </div>
        </div>

        {/* Desktop / Existing Navbar */}
        <StudentNavbar />

        {/* Page Content */}
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;