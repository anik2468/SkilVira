import { FiAward, FiBriefcase, FiTrendingUp } from "react-icons/fi";

const FloatingCards = () => {
  return (
    <div className="relative h-[500px] w-[500px]">

      {/* Student Circle */}
      <div className="absolute left-1/2 top-1/2 flex h-56 w-56 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D77A] shadow-2xl">
        <span className="text-8xl">👨‍💻</span>
      </div>

      {/* Internship Card */}
      <div className="absolute left-0 top-10 w-56 rounded-2xl bg-white p-5 shadow-xl">
        <FiBriefcase className="text-3xl text-[#D4AF37]" />
        <h3 className="mt-3 text-lg font-bold">Web Development</h3>
        <p className="text-gray-500">₹1500 / month</p>
        <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
          Remote
        </span>
      </div>

      {/* Certificate Card */}
      <div className="absolute right-0 top-24 w-52 rounded-2xl bg-white p-5 shadow-xl">
        <FiAward className="text-3xl text-[#D4AF37]" />
        <h3 className="mt-3 font-bold">Verified Certificate</h3>
        <p className="text-gray-500">QR Verified</p>
      </div>

      {/* Stats Card */}
      <div className="absolute bottom-10 left-1/2 w-60 -translate-x-1/2 rounded-2xl bg-white p-5 shadow-xl">
        <FiTrendingUp className="text-3xl text-[#D4AF37]" />
        <h3 className="mt-2 text-xl font-bold">95%</h3>
        <p className="text-gray-500">Application Success</p>
      </div>

    </div>
  );
};

export default FloatingCards;