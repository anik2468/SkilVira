import { FiBell, FiSearch, FiUser } from "react-icons/fi";

const RecruiterNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">

      {/* Search */}
      <div className="relative w-full max-w-md">

        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none focus:border-[#D4AF37]"
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        <button className="relative rounded-full p-2 hover:bg-gray-100">

          <FiBell size={22} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        <div className="flex items-center gap-3">

          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D4AF37] text-white">
              <FiUser />
            </div>
          )}

          <div>

            <h3 className="font-semibold">
              {user?.name || "Recruiter"}
            </h3>

            <p className="text-sm text-gray-500">
              Recruiter
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default RecruiterNavbar;