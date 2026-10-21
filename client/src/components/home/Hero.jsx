import { useNavigate } from "react-router-dom";
import Hero3D from "./Hero3D";

import Button from "../ui/Button";
import SearchBar from "./SearchBar";
import FloatingCards from "./FloatingCards";
import Stats from "./Stats";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative isolate overflow-hidden bg-white">

      {/* =====================================================
          BACKGROUND ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-180px] top-[-140px] h-[500px] w-[500px] rounded-full bg-[#D4AF37]/10 blur-[120px]" />

        <div className="absolute right-[-180px] top-[20%] h-[500px] w-[500px] rounded-full bg-[#D4AF37]/8 blur-[130px]" />

        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/10" />

        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/10" />
      </div>

      {/* =====================================================
          3D BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 z-0 opacity-80">
        <Hero3D />
      </div>

      {/* =====================================================
          HERO CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col items-center justify-center gap-14 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:min-h-[88vh] lg:flex-row lg:justify-between lg:gap-10 lg:px-8 lg:pb-20">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div className="w-full max-w-2xl text-center lg:text-left">

          {/* Premium badge */}
          <div className="flex justify-center lg:justify-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-4 py-2 shadow-sm backdrop-blur-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_0_5px_rgba(212,175,55,0.10)]" />

              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#8D7414] sm:text-sm">
                Build Skills. Build Career.
              </span>

              <span className="text-sm">
                🚀
              </span>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-[76px]">

            Learn Skills

            <span className="block">
              Get Real
            </span>

            <span className="block">
              <span className="relative inline-block">
                <span className="relative z-10 text-[#D4AF37]">
                  Experience
                </span>

                <span className="absolute bottom-1 left-0 right-0 -z-0 h-3 rounded-full bg-[#D4AF37]/10 sm:h-4" />
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg lg:mx-0 lg:text-xl">
            SkilVira helps students learn industry-ready skills,
            discover real internships, complete practical courses,
            and build a stronger career journey — all in one place.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-2xl">
            <SearchBar />
          </div>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">

            <Button onClick={() => navigate("/internships")}>
              Explore Internships
            </Button>

            <Button variant="outline" onClick={() => navigate("/courses")}>
              Start Learning
            </Button>

          </div>

          {/* Quick trust line */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-bold text-slate-400 lg:justify-start">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              Industry-focused learning
            </span>

            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              Real opportunities
            </span>

            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              Career growth
            </span>
          </div>

          {/* Stats */}
          <div className="mt-9">
            <Stats />
          </div>
        </div>

        {/* =====================================================
            RIGHT VISUAL
        ===================================================== */}

        <div className="relative flex w-full max-w-xl items-center justify-center lg:max-w-[560px]">

          {/* Glow behind visual */}
          <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/12 blur-[90px] sm:h-[430px] sm:w-[430px]" />

          {/* Decorative rings */}
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/15 sm:h-[420px] sm:w-[420px]" />

          <div className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/10 sm:h-[330px] sm:w-[330px]" />

          {/* Floating visual */}
          <div className="relative z-10 w-full">
            <FloatingCards />
          </div>

          {/* Small premium floating label */}
          <div className="absolute bottom-1 left-0 z-20 hidden rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md sm:block lg:-left-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                <span className="text-sm">
                  ✦
                </span>
              </div>

              <div>
                <p className="text-xs font-black text-slate-900">
                  Career focused
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                  Learn → Build → Grow
                </p>
              </div>
            </div>
          </div>

          {/* Another visual label */}
          <div className="absolute right-0 top-5 z-20 hidden rounded-2xl border border-[#D4AF37]/20 bg-black px-4 py-3 text-white shadow-2xl sm:block lg:-right-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D4AF37] text-black">
                ✓
              </span>

              <div>
                <p className="text-xs font-black">
                  Real Opportunities
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-white/50">
                  Internships & projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM SCROLL INDICATOR
      ===================================================== */}

      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
          Discover SkilVira
        </span>

        <span className="h-8 w-px bg-gradient-to-b from-[#D4AF37] to-transparent" />
      </div>

    </section>
  );
};

export default Hero;