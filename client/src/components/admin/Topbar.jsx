import { FiBell } from "react-icons/fi";

const Topbar = () => {
  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">
      <div>
        <h2 className="text-2xl font-bold">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500">
          Manage your internship platform
        </p>
      </div>

      <div className="flex items-center gap-6">
        <FiBell size={22} />

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D4AF37] text-white">
            A
          </div>

          <div>
            <h3 className="font-semibold">
              Admin
            </h3>

            <p className="text-sm text-gray-500">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;