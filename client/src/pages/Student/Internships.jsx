import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiSearch,
  FiMapPin,
  FiClock,
  FiBookmark,
  FiBriefcase,
  FiCreditCard,
  FiRefreshCw,
  FiArrowRight,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";

import {
  getInternships,
} from "../../services/internshipService";

const API_BASE = "http://localhost:5000";


// =====================================================
// HELPERS
// =====================================================

const getFileUrl = (file) => {
  if (!file) return "";

  if (
    file.startsWith("http://") ||
    file.startsWith("https://")
  ) {
    return file;
  }

  if (file.startsWith("/")) {
    return `${API_BASE}${file}`;
  }

  return `${API_BASE}/${file}`;
};


const formatPrice = (price) => {
  const value = Number(price || 0);

  return `₹${value.toLocaleString("en-IN")}`;
};


const formatDate = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


// =====================================================
// COMPONENT
// =====================================================

const Internships = () => {
  const [internships, setInternships] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [mode, setMode] =
    useState("All");


  // ======================================
  // Load Internships
  // ======================================

  const loadInternships = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await getInternships();

      const list =
        response?.internships ||
        response?.data ||
        [];

      setInternships(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (err) {
      console.error(
        "loadInternships error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load internships."
      );

      setInternships([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadInternships();
  }, []);


  // ======================================
  // Filter
  // ======================================

  const filtered = useMemo(() => {
    const keyword =
      search
        .trim()
        .toLowerCase();

    return internships.filter(
      (item) => {
        const title =
          String(
            item?.title || ""
          ).toLowerCase();

        const company =
          String(
            item?.company || ""
          ).toLowerCase();

        const category =
          String(
            item?.category || ""
          ).toLowerCase();

        const skills =
          Array.isArray(item?.skills)
            ? item.skills.join(" ").toLowerCase()
            : String(
                item?.skills || ""
              ).toLowerCase();

        const matchesSearch =
          !keyword ||
          title.includes(keyword) ||
          company.includes(keyword) ||
          category.includes(keyword) ||
          skills.includes(keyword);

        const matchesMode =
          mode === "All" ||
          String(
            item?.workMode || ""
          ).toLowerCase() ===
            mode.toLowerCase();

        return (
          matchesSearch &&
          matchesMode
        );
      }
    );
  }, [
    internships,
    search,
    mode,
  ]);


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-10 w-80 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-5 w-[28rem] max-w-full animate-pulse rounded bg-gray-100" />
        </div>

        <div className="h-24 animate-pulse rounded-2xl bg-gray-100" />

        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-48 bg-gray-200" />

                <div className="space-y-4 p-6">
                  <div className="h-6 w-3/4 rounded bg-gray-200" />

                  <div className="h-4 w-1/3 rounded bg-gray-100" />

                  <div className="h-4 w-full rounded bg-gray-100" />

                  <div className="h-4 w-2/3 rounded bg-gray-100" />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1.5">
            <FiBriefcase
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-xs font-semibold text-[#8B6E12]">
              Career Opportunities
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            SkilVira Internships
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Explore currently available internship
            opportunities and gain practical industry
            experience.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            loadInternships(true)
          }
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>


      {/* Error */}
      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              loadInternships(true)
            }
            className="font-semibold underline underline-offset-2"
          >
            Try Again
          </button>
        </div>
      )}


      {/* Search / Filter */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search internship, company, category or skill..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
            />
          </div>

          {/* Work Mode */}
          <select
            value={mode}
            onChange={(event) =>
              setMode(
                event.target.value
              )
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
          >
            <option value="All">
              All Work Modes
            </option>

            <option value="Online">
              Online
            </option>

            <option value="Offline">
              Offline
            </option>

            <option value="Hybrid">
              Hybrid
            </option>
          </select>
        </div>
      </div>


      {/* Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-bold text-gray-900">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="font-bold text-gray-900">
            {internships.length}
          </span>{" "}
          internships
        </p>
      </div>


      {/* Empty */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100 sm:p-16">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiBriefcase size={36} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            {internships.length === 0
              ? "No Internships Available"
              : "No Matching Internships"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            {internships.length === 0
              ? "There are no approved internships available at the moment."
              : "Try changing your search or work mode filter."}
          </p>

          {(search || mode !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setMode("All");
              }}
              className="mt-5 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b99520]"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filtered.map((item) => {
            const image =
              getFileUrl(
                item?.internshipImage
              );

            const benefits =
              Array.isArray(
                item?.benefits
              )
                ? item.benefits
                : [];

            const skills =
              Array.isArray(
                item?.skills
              )
                ? item.skills
                : [];

            return (
              <article
                key={item._id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                {image && (
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={image}
                      alt={
                        item?.title ||
                        "Internship"
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-green-700 shadow">
                      Paid Internship
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                        {item?.title ||
                          "Internship"}
                      </h2>

                      <p className="mt-1 text-base font-semibold text-[#D4AF37]">
                        {item?.company ||
                          "Company"}
                      </p>
                    </div>

                    {!image && (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                        <FiBriefcase
                          size={21}
                        />
                      </div>
                    )}
                  </div>


                  {/* Meta */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <MetaItem
                      icon={
                        <FiMapPin />
                      }
                      value={
                        item?.location ||
                        "Remote"
                      }
                    />

                    <MetaItem
                      icon={
                        <FiClock />
                      }
                      value={
                        item?.duration ||
                        "Flexible"
                      }
                    />

                    <MetaItem
                      icon={
                        <FiCreditCard />
                      }
                      value={
                        formatPrice(
                          item?.price
                        )
                      }
                    />

                    <MetaItem
                      icon={
                        <FiUsers />
                      }
                      value={
                        item?.openings
                          ? `${item.openings} openings`
                          : "Openings available"
                      }
                    />
                  </div>


                  {/* Tags */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item?.workMode && (
                      <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#8B6E12]">
                        {item.workMode}
                      </span>
                    )}

                    {item?.category && (
                      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                        {item.category}
                      </span>
                    )}

                    {item?.internshipType && (
                      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold capitalize text-gray-600">
                        {item.internshipType}
                      </span>
                    )}
                  </div>


                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="mt-5">
                      <p className="text-sm font-bold text-gray-900">
                        Skills
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {skills
                          .slice(0, 6)
                          .map(
                            (
                              skill,
                              index
                            ) => (
                              <span
                                key={`${skill}-${index}`}
                                className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600"
                              >
                                {skill}
                              </span>
                            )
                          )}
                      </div>
                    </div>
                  )}


                  {/* Benefits */}
                  {benefits.length >
                    0 && (
                    <div className="mt-5">
                      <p className="text-sm font-bold text-gray-900">
                        You will get
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {benefits
                          .slice(0, 5)
                          .map(
                            (
                              benefit,
                              index
                            ) => (
                              <span
                                key={`${benefit}-${index}`}
                                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                              >
                                ✓{" "}
                                {benefit}
                              </span>
                            )
                          )}
                      </div>
                    </div>
                  )}


                  {/* Last Date */}
                  {item?.lastDate && (
                    <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                      <FiCalendar
                        className="text-[#D4AF37]"
                        size={15}
                      />

                      <span>
                        Apply by{" "}
                        <span className="font-semibold text-gray-800">
                          {formatDate(
                            item.lastDate
                          )}
                        </span>
                      </span>
                    </div>
                  )}


                  {/* Actions */}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="button"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 hover:text-[#8B6E12]"
                      title="Save Internship"
                    >
                      <FiBookmark
                        size={18}
                      />
                    </button>

                    <Link
                      to={`/student/internships/${item._id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b99520]"
                    >
                      View Details
                      <FiArrowRight
                        size={16}
                      />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};


// =====================================================
// META ITEM
// =====================================================

const MetaItem = ({
  icon,
  value,
}) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="text-[#D4AF37]">
        {icon}
      </span>

      <span className="truncate">
        {value}
      </span>
    </div>
  );
};


export default Internships;