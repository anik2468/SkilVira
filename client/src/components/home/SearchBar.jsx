import { FiSearch, FiMapPin } from "react-icons/fi";

const SearchBar = () => {
  return (
    <div className="mt-10 w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
      <div className="flex flex-col gap-3 md:flex-row">

        {/* Internship */}
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
          <FiSearch className="text-xl text-gray-400" />
          <input
            type="text"
            placeholder="Search by Role, Skill or Company"
            className="w-full outline-none"
          />
        </div>

        {/* Location */}
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
          <FiMapPin className="text-xl text-gray-400" />
          <input
            type="text"
            placeholder="Onsite or Remote"
            className="w-full outline-none"
          />
        </div>

        {/* Button */}
        <button className="rounded-xl bg-[#D4AF37] px-8 py-3 font-semibold text-white hover:bg-[#C89B3C] transition">
          Search
        </button>

      </div>
    </div>
  );
};

export default SearchBar;