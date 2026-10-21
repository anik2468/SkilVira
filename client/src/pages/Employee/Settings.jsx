import { Link } from "react-router-dom";
import { FiUser, FiCreditCard, FiTag, FiSettings, FiArrowUpRight } from "react-icons/fi";

const options = [
  { title: "Edit Profile", description: "Update your employee details.", path: "/employee/profile", icon: FiUser },
  { title: "Payment Settings", description: "Manage payment configuration.", path: "/employee/payment-settings", icon: FiCreditCard },
  { title: "Referral Discount & Commission", description: "Manage authorized referral pricing.", path: "/employee/referral-settings", icon: FiTag },
  { title: "Contact & Support", description: "Manage public company contact information.", path: "/employee/contact-settings", icon: FiSettings },
];

export default function EmployeeSettings() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black text-slate-950">Employee Settings</h1>
        <p className="mt-2 text-sm text-slate-500">Manage your profile and available settings.</p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {options.map(({ title, description, path, icon: Icon }) => (
            <Link key={path} to={path} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37] hover:shadow-md">
              <div className="flex items-center justify-between">
                <Icon size={23} className="text-[#9A7B14]" />
                <FiArrowUpRight />
              </div>
              <h2 className="mt-4 text-lg font-black text-slate-900">{title}</h2>
              <p className="mt-2 text-sm text-slate-500">{description}</p>
              <span className="mt-4 block text-sm font-bold text-[#9A7B14]">Open →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
