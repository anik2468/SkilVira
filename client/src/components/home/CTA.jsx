import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="bg-[#0F172A] py-24 text-white">
      <div className="mx-auto max-w-5xl px-6 text-center">

        <h2 className="text-5xl font-bold">
          Ready to Launch Your Career?
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-300">
          Join thousands of students, recruiters, and universities building
          their future with SkilVira.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-5">

          <Link
            to="/register/student"
            className="rounded-xl bg-[#D4AF37] px-8 py-4 text-lg font-semibold text-white transition hover:scale-105"
          >
            Get Started
          </Link>

          <Link
            to="/choose-role"
            className="rounded-xl border border-white px-8 py-4 text-lg font-semibold transition hover:bg-white hover:text-black"
          >
            Explore Portal
          </Link>

        </div>

      </div>
    </section>
  );
};

export default CTA;