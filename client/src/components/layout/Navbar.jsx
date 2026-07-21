import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-[#D4AF37] flex items-center justify-center text-white text-xl font-bold">
            S
          </div>

          <div>
            <h1 className="text-2xl font-bold text-black">
              Skil<span className="text-[#D4AF37]">vira</span>
            </h1>

            <p className="text-xs text-gray-500">
              Empowering Careers
            </p>
          </div>
        </div>

        {/* Menu */}
        <ul className="hidden lg:flex items-center gap-8 font-medium">

          <li>
            <a href="/" className="hover:text-[#D4AF37]">
              Home
            </a>
          </li>

          <li>
            <a href="/" className="hover:text-[#D4AF37]">
              Internships
            </a>
          </li>

          <li>
            <a href="/" className="hover:text-[#D4AF37]">
              Companies
            </a>
          </li>

          <li>
            <a href="/" className="hover:text-[#D4AF37]">
              Colleges
            </a>
          </li>

          <li>
            <a href="/" className="hover:text-[#D4AF37]">
              About
            </a>
          </li>

        </ul>

        {/* Right */}
        <div className="flex items-center gap-4">

          <button className="font-semibold hover:text-[#D4AF37]">
            Login
          </button>

         <Link
            to="/choose-role"
           className="rounded-xl bg-[#D4AF37] px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
          Get Started
         </Link>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;