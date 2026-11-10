import { Link } from "react-router-dom";
import { FiUser, FiArrowUpRight } from "react-icons/fi";

export default function EmployeeSettings() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-black text-slate-950">Employee Settings</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your personal employee account.
        </p>

        <Link
          to="/employee/profile"
          className="mt-7 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <FiUser size={24} className="text-[#9A7B14]" />
            <div>
              <h2 className="text-lg font-black text-slate-900">Edit Profile</h2>
              <p className="mt-1 text-sm text-slate-500">
                Update your employee details.
              </p>
            </div>
          </div>
          <FiArrowUpRight />
        </Link>
      </div>
    </main>
  );
}
