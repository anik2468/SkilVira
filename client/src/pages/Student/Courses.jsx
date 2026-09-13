import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiBookOpen,
  FiClock,
  FiSearch,
  FiRefreshCw,
  FiArrowRight,
  FiTag,
} from "react-icons/fi";

import {
  getCourses,
} from "../../services/courseService";

const API_BASE = "http://localhost:5000";


// =====================================================
// HELPERS
// =====================================================

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_BASE}${image}`;
  }

  return `${API_BASE}/${image}`;
};


// =====================================================
// COMPONENT
// =====================================================

const Courses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("all");


  // ======================================
  // Load Courses
  // ======================================

  const loadCourses = async (
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
        await getCourses();

      const list =
        response?.courses ||
        response?.data ||
        [];

      setCourses(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (err) {
      console.error(
        "loadCourses error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load courses."
      );

      setCourses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadCourses();
  }, []);


  // ======================================
  // Categories
  // ======================================

  const categories = useMemo(() => {
    const values = courses
      .map(
        (course) =>
          course?.category
      )
      .filter(Boolean);

    return [
      "all",
      ...Array.from(
        new Set(values)
      ),
    ];
  }, [courses]);


  // ======================================
  // Filter Courses
  // ======================================

  const filteredCourses = useMemo(() => {
    const keyword =
      search
        .trim()
        .toLowerCase();

    return courses.filter(
      (course) => {
        const title =
          String(
            course?.title || ""
          ).toLowerCase();

        const courseCategory =
          String(
            course?.category || ""
          ).toLowerCase();

        const description =
          String(
            course?.description || ""
          ).toLowerCase();

        const matchesSearch =
          !keyword ||
          title.includes(keyword) ||
          courseCategory.includes(keyword) ||
          description.includes(keyword);

        const matchesCategory =
          category === "all" ||
          String(
            course?.category || ""
          ).toLowerCase() ===
            String(category).toLowerCase();

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    courses,
    search,
    category,
  ]);


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-8 p-1">
        <div>
          <div className="h-9 w-72 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-gray-100" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
              >
                <div className="h-48 animate-pulse bg-gray-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />

                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />

                  <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }


  // ======================================
  // Render
  // ======================================

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1.5">
            <FiBookOpen
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-xs font-semibold text-[#8B6E12]">
              Learning
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Available Courses
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Build practical skills with
            courses available on SkilVira.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadCourses(true)}
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
            onClick={() => loadCourses(true)}
            className="font-semibold underline underline-offset-2"
          >
            Try Again
          </button>
        </div>
      )}


      {/* Search + Filter */}
      {courses.length > 0 && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search courses..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
              />
            </div>

            {/* Category */}
            {categories.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 lg:max-w-[55%]">
                {categories.map(
                  (item) => {
                    const active =
                      category ===
                      item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setCategory(
                            item
                          )
                        }
                        className={[
                          "whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition",
                          active
                            ? "bg-[#D4AF37] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                        ].join(" ")}
                      >
                        {item ===
                        "all"
                          ? "All Courses"
                          : item}
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>
      )}


      {/* Count */}
      {courses.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {
                filteredCourses.length
              }
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-900">
              {courses.length}
            </span>{" "}
            courses
          </p>
        </div>
      )}


      {/* No Courses */}
      {courses.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100 sm:p-16">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiBookOpen size={36} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            No Courses Available
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            There are no courses available
            at the moment. Please check
            again later.
          </p>
        </div>
      ) : filteredCourses.length ===
        0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <FiSearch size={28} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            No Matching Courses
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try another search term or
            category.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
            }}
            className="mt-5 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b99520]"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Course Grid */
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map(
            (course) => {
              const imageUrl =
                getImageUrl(
                  course?.thumbnail
                );

              return (
                <article
                  key={course._id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={
                          course?.title ||
                          "Course"
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#D4AF37]">
                        <FiBookOpen
                          size={42}
                        />
                      </div>
                    )}

                    {course?.category && (
                      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#8B6E12] shadow">
                        <FiTag
                          size={12}
                        />

                        {course.category}
                      </div>
                    )}
                  </div>


                  {/* Content */}
                  <div className="p-5">
                    <h2 className="line-clamp-2 text-xl font-bold text-gray-900">
                      {course?.title ||
                        "Untitled Course"}
                    </h2>

                    {course?.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                        {
                          course.description
                        }
                      </p>
                    )}


                    {/* Meta */}
                    <div className="mt-5 flex items-center justify-between gap-4 text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <FiClock
                          size={16}
                          className="text-[#D4AF37]"
                        />

                        {course?.duration ||
                          "Flexible"}
                      </span>

                      <span className="text-lg font-bold text-gray-900">
                        {course?.price !==
                        undefined &&
                        course?.price !==
                        null
                          ? `₹${Number(
                              course.price
                            ).toLocaleString(
                              "en-IN"
                            )}`
                          : "Free"}
                      </span>
                    </div>


                    {/* CTA */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/student/courses/${course._id}`
                        )
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-3 text-sm font-bold text-white transition hover:bg-[#b99520]"
                    >
                      View Course

                      <FiArrowRight
                        size={16}
                      />
                    </button>
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;