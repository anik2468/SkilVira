import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../services/courseService";
import {
  FiArrowUpRight,
  FiBarChart2,
  FiCloud,
  FiCode,
  FiCpu,
  FiDatabase,
  FiPenTool,
  FiShield,
  FiSmartphone,
  FiLayers,
} from "react-icons/fi";

const categoryIcon = (title) => {
  const value = title.toLowerCase();
  if (value.includes("web") || value.includes("software") || value.includes("program")) return <FiCode />;
  if (value.includes("ai") || value.includes("machine learning")) return <FiCpu />;
  if (value.includes("app") || value.includes("mobile")) return <FiSmartphone />;
  if (value.includes("design")) return <FiPenTool />;
  if (value.includes("cloud")) return <FiCloud />;
  if (value.includes("security")) return <FiShield />;
  if (value.includes("data")) return <FiDatabase />;
  if (value.includes("marketing")) return <FiBarChart2 />;
  return <FiLayers />;
};

const PopularCategories = () => {

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;

    getCourses()
      .then((response) => {
        const list = response?.courses || response?.data?.courses || response?.data || [];
        if (!Array.isArray(list)) {
          if (active) setCategories([]);
          return;
        }

        const unique = new Map();

        list.forEach((course) => {
          const raw = course?.category?.name || course?.category?.title ||
            course?.categoryName || course?.category;
          const title = typeof raw === "string" ? raw.trim() : "";

          if (title && !unique.has(title.toLowerCase())) {
            unique.set(title.toLowerCase(), {
              title,
              icon: categoryIcon(title),
              description: `Explore courses and build practical skills in ${title}.`,
              tag: title.length > 12 ? `${title.slice(0, 12)}…` : title,
            });
          }
        });

        if (active) setCategories([...unique.values()]);
      })
      .catch((error) => {
        console.error("Unable to load course categories:", error);
        if (active) setCategories([]);
      });

    return () => { active = false; };
  }, []);
  const openCategory = (title) =>
    navigate(`/courses?search=${encodeURIComponent(title)}`);

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D4AF37]/6 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B14] sm:text-xs">
              Explore your path
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Popular{" "}
            <span className="text-[#D4AF37]">
              Categories
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Explore skill areas that can help you learn faster,
            build practical experience and move closer to your
            career goals.
          </p>
        </div>

        {/* Category Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(
            (item, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => openCategory(item.title)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openCategory(item.title);
                  }
                }}
                aria-label={`Explore ${item.title} courses`}
                className="group relative cursor-pointer overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 text-left shadow-[0_10px_35px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/35 hover:shadow-[0_24px_55px_rgba(15,23,42,0.10)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] sm:p-7"
              >
                {/* Card glow */}
                <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-[#D4AF37]/8 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Number */}
                <div className="absolute right-5 top-5 text-[10px] font-black tracking-[0.18em] text-slate-200">
                  0{index + 1}
                </div>

                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF6E8] text-[#B28F16] transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-black group-hover:shadow-[0_10px_25px_rgba(212,175,55,0.22)]">
                  <span className="text-[25px]">
                    {item.icon}
                  </span>
                </div>

                {/* Tag */}
                <div className="mt-5">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                    {item.tag}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mt-4 text-lg font-black leading-6 text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-2.5 text-xs leading-5 text-slate-500 sm:text-sm">
                  {item.description}
                </p>

                {/* Bottom action */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#9A7B14]">
                    Explore
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all duration-300 group-hover:border-[#D4AF37]/40 group-hover:bg-[#D4AF37] group-hover:text-black">
                    <FiArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Bottom message */}
        <div className="mt-9 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-[#FCFCF9] px-4 py-2.5 text-center">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

            <span className="text-[10px] font-bold text-slate-500 sm:text-xs">
              Learn a skill. Build proof. Create opportunities.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;