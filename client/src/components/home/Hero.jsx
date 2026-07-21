import Button from "../ui/Button";
import SearchBar from "./SearchBar";
import FloatingCards from "./FloatingCards";
import Stats from "./Stats";

const Hero = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-between px-6 py-16 lg:flex-row">

        {/* Left Content */}
        <div className="max-w-xl">

          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-[#D4AF37]">
            🚀 Bihar Trusted Internship Platform
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-[#111827] lg:text-7xl">
            Launch Your Career
            <br />
            With Real <span className="text-[#D4AF37]">Internship</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Discover internship opportunities from startups, businesses, educational institutions, and organizations. Build skills, gain experience, and grow your career with <strong>Skilvira</strong>.
          </p>

        <SearchBar />

          <div className="mt-6 flex flex-wrap gap-4">
            <Button>Explore Internships</Button>

            <Button variant="outline">
              Hire Interns
            </Button>
          </div>
                <Stats />
        </div>

        {/* Right Side */}
        <div className="mt-12 flex justify-center lg:mt-0">
  <FloatingCards />
</div>

      </div>
    </section>
  );
};

export default Hero;