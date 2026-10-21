import { Link } from "react-router-dom";
import Hero from "../../components/home/Hero";
import FeaturedInternships from "../../components/home/FeaturedInternships";
import GalleryBrochure from "../../components/home/GalleryBrochure";
import PopularCategories from "../../components/home/PopularCategories";
import WhySkilvira from "../../components/home/WhySkilvira";
import HowItWorks from "../../components/home/HowItWorks";
import Testimonials from "../../components/home/Testimonials";
import FAQ from "../../components/home/FAQ";
import CTA from "../../components/home/CTA";

const Home = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">

      {/* =====================================================
          GLOBAL ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-180px] top-[120px] h-[420px] w-[420px] rounded-full bg-[#D4AF37]/10 blur-[120px]" />

        <div className="absolute right-[-180px] top-[650px] h-[420px] w-[420px] rounded-full bg-[#D4AF37]/10 blur-[120px]" />

        <div className="absolute left-[35%] top-[1450px] h-[320px] w-[320px] rounded-full bg-[#D4AF37]/5 blur-[100px]" />
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative">
        <div className="absolute inset-x-0 top-0 -z-10 h-[700px] bg-gradient-to-b from-[#FCFAF2] via-white to-white" />

        <div className="absolute left-1/2 top-16 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full border border-[#D4AF37]/10" />

        <div className="absolute left-1/2 top-24 -z-10 h-[380px] w-[380px] -translate-x-1/2 rounded-full border border-[#D4AF37]/10" />

        <Hero />
      </section>

      {/* =====================================================
          PREMIUM TRUST STRIP
      ===================================================== */}

      <section className="relative border-y border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />
              </div>

              <div>
                <p className="text-sm font-black tracking-tight text-slate-900">
                  Built for ambitious learners
                </p>

                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  Learn. Build. Apply. Grow.
                </p>
              </div>
            </div>

            <div className="hidden h-8 w-px bg-slate-200 lg:block" />

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
              <span>Courses</span>
              <span>Internships</span>
              <span>Career</span>
              <span>Communities</span>
            </div>

            <div className="hidden h-8 w-px bg-slate-200 lg:block" />

            <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#D4AF37]" />

              <span className="text-xs font-black text-slate-700">
                One platform. Multiple possibilities.
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="relative bg-white py-20 sm:py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PopularCategories />
        </div>
      </section>

      {/* =====================================================
          FEATURED INTERNSHIPS
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#FBFBF8] py-20 sm:py-24">
        <div className="absolute -right-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#D4AF37]/8 blur-[100px]" />

        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FeaturedInternships />
        </div>
      </section>

      <GalleryBrochure />

      {/* =====================================================
          WHY SKILVIRA
      ===================================================== */}

      <section className="relative bg-white py-20 sm:py-24">
        <div className="absolute left-[-120px] top-1/3 h-72 w-72 rounded-full bg-[#D4AF37]/7 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <WhySkilvira />
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="relative overflow-hidden bg-black py-20 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.10),transparent_30%)]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HowItWorks />
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#FBFBF8] py-20 sm:py-24">
        <div className="absolute right-[-100px] top-[20%] h-72 w-72 rounded-full bg-[#D4AF37]/8 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Testimonials />
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="relative bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FAQ />
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="relative overflow-hidden bg-white pb-10 pt-6 sm:pb-14">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.16)]">

            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D4AF37]/20 blur-[80px]" />

            <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-[90px]" />

            <div className="relative">
              <CTA />
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM BRAND SIGNATURE
      ===================================================== */}

      <section className="bg-black">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">

            <p className="text-xs font-semibold text-white/40">
              © {new Date().getFullYear()} SkilVira. Built for the next generation.
            </p>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D4AF37]/80">
                Learn • Build • Grow
              </span>
            </div>

          </div>
        </div>
      </section>


      {/* SKILVIRA_CONTACT_FOOTER */}
      <footer className="relative overflow-hidden bg-[#0A0A0A] text-white">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <Link to="/" className="text-2xl font-black tracking-tight">
              Skil<span className="text-[#D4AF37]">Vira</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
              Learn new skills, discover opportunities and build your career with SkilVira.
            </p>
          </div>

          <div>
            <h2 className="font-black text-[#D4AF37]">Explore</h2>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-white/70">
              <Link className="hover:text-[#D4AF37]" to="/">Home</Link>
              <Link className="hover:text-[#D4AF37]" to="/courses">Courses</Link>
              <Link className="hover:text-[#D4AF37]" to="/internships">Internships</Link>
            </div>
          </div>

          <div>
            <h2 className="font-black text-[#D4AF37]">Contact & Support</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Need help with your course, internship, account or payment?
              Visit our Contact & Support page.
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-flex items-center rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-black text-black transition hover:bg-[#E4C454]"
            >
              Contact Support →
            </Link>
          </div>

          <div>
            <h2 className="font-black text-[#D4AF37]">Quick Links</h2>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-white/70">
              <Link className="hover:text-[#D4AF37]" to="/choose-role">Login / Register</Link>
              <Link className="hover:text-[#D4AF37]" to="/contact">Company Details</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/40">
          © {new Date().getFullYear()} SkilVira. All rights reserved.
          <span className="mx-2 text-[#D4AF37]">•</span>
          Learn · Build · Grow
        </div>
      </footer>

    </main>
  );
};

export default Home;