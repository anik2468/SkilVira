import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertCircle,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiExternalLink,
  FiFileText,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";

import {
  getCourses,
  createCourse,
  deleteCourse,
} from "../../services/courseService";

const GOLD = "#D4AF37";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Development",
    duration: "",
    price: 0,
    thumbnail: "",
    modules: "",
  });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    loadCourses();
  }, []);

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

      const data =
        await getCourses();

      const list =
        data?.courses ||
        data?.data ||
        (Array.isArray(data)
          ? data
          : []);

      setCourses(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (err) {
      console.error(
        "ADMIN COURSES ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load courses."
      );

      setCourses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const changeHandler = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const submitCourse = async () => {
    if (!form.title.trim()) {
      setError(
        "Course title is required."
      );
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Course description is required."
      );
      return;
    }

    if (
      !Number.isFinite(
        Number(form.price)
      ) ||
      Number(form.price) < 0
    ) {
      setError(
        "Please enter a valid course price."
      );
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      await createCourse({
        title: form.title.trim(),

        description:
          form.description.trim(),

        category:
          form.category.trim() ||
          "Development",

        duration:
          form.duration.trim(),

        price:
          Number(form.price),

        thumbnail:
          form.thumbnail.trim(),

        modules:
          form.modules
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean),
      });

      setForm({
        title: "",
        description: "",
        category: "Development",
        duration: "",
        price: 0,
        thumbnail: "",
        modules: "",
      });

      setSuccess(
        "Course created successfully."
      );

      await loadCourses();

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "CREATE COURSE ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Course creation failed."
      );
    } finally {
      setCreating(false);
    }
  };

  const removeCourse = async (id) => {
    if (!id) return;

    const confirmed =
      window.confirm(
        "Delete this course?"
      );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteCourse(id);

      setCourses((prev) =>
        prev.filter(
          (course) =>
            course?._id !== id
        )
      );

      setSelectedCourse(null);

      setSuccess(
        "Course deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "DELETE COURSE ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete course."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const categories = useMemo(() => {
    const values = courses
      .map(
        (course) =>
          course?.category
      )
      .filter(Boolean);

    return [
      ...new Set(values),
    ];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return courses.filter(
      (course) => {
        const text = [
          course?.title,
          course?.description,
          course?.category,
          course?.duration,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !query ||
          text.includes(query);

        const matchesCategory =
          categoryFilter ===
            "All" ||
          String(
            course?.category || ""
          ).toLowerCase() ===
            categoryFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    courses,
    search,
    categoryFilter,
  ]);

  const stats = useMemo(() => {
    const pricedCourses =
      courses.filter(
        (course) =>
          Number(course?.price || 0) >
          0
      ).length;

    const freeCourses =
      courses.filter(
        (course) =>
          Number(course?.price || 0) ===
          0
      ).length;

    const totalModules =
      courses.reduce(
        (sum, course) => {
          const modules =
            Array.isArray(
              course?.modules
            )
              ? course.modules.length
              : 0;

          return sum + modules;
        },
        0
      );

    return {
      total: courses.length,
      priced: pricedCourses,
      free: freeCourses,
      modules: totalModules,
    };
  }, [courses]);

  if (loading) {
    return <CoursesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiBookOpen
                  size={14}
                  style={{ color: GOLD }}
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Learning Platform Control
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Course Management
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                Create, organize and maintain the learning catalog
                powering the SkilVira student experience.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadCourses(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
            >
              <FiRefreshCw
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </section>

        {/* ALERTS */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            {success}
          </div>
        )}

        {/* STATS */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Courses"
            value={stats.total}
            icon={<FiBookOpen />}
            tone="gold"
          />

          <MetricCard
            label="Paid Courses"
            value={stats.priced}
            icon={<FiCheckCircle />}
            tone="green"
          />

          <MetricCard
            label="Free Courses"
            value={stats.free}
            icon={<FiClock />}
            tone="blue"
          />

          <MetricCard
            label="Total Modules"
            value={stats.modules}
            icon={<FiFileText />}
            tone="purple"
          />
        </section>

        {/* CREATE COURSE */}
        <section className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Course Builder
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950 sm:text-3xl">
                Create New Course
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Add the course information first. Lessons can be
                managed from the course content page after creation.
              </p>
            </div>

            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-black"
              style={{
                backgroundColor: GOLD,
              }}
            >
              <FiPlus size={22} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Course Title"
              name="title"
              value={form.title}
              onChange={changeHandler}
              placeholder="e.g. Full Stack Web Development"
              required
            />

            <Field
              label="Category"
              name="category"
              value={form.category}
              onChange={changeHandler}
              placeholder="Development"
              required
            />

            <Field
              label="Duration"
              name="duration"
              value={form.duration}
              onChange={changeHandler}
              placeholder="e.g. 12 Weeks"
            />

            <Field
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={changeHandler}
              placeholder="0"
              prefix="₹"
            />

            <Field
              label="Thumbnail URL"
              name="thumbnail"
              value={form.thumbnail}
              onChange={changeHandler}
              placeholder="https://..."
            />

            <Field
              label="Modules"
              name="modules"
              value={form.modules}
              onChange={changeHandler}
              placeholder="HTML, CSS, JavaScript, React"
            />

            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm font-black text-gray-800">
                Course Description
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={changeHandler}
                rows={6}
                placeholder="Describe the course, learning outcomes and target students..."
                className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium leading-6 outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                setForm({
                  title: "",
                  description: "",
                  category: "Development",
                  duration: "",
                  price: 0,
                  thumbnail: "",
                  modules: "",
                })
              }
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={submitCourse}
              disabled={creating}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-black disabled:opacity-50"
              style={{
                backgroundColor: GOLD,
              }}
            >
              <FiPlus />

              {creating
                ? "Creating Course..."
                : "Create Course"}
            </button>
          </div>
        </section>

        {/* FILTERS */}
        <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-2xl">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search courses by title, category or description..."
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setCategoryFilter(
                    "All"
                  )
                }
                className={`rounded-xl px-4 py-2.5 text-xs font-black ${
                  categoryFilter === "All"
                    ? "text-black"
                    : "bg-gray-100 text-gray-600"
                }`}
                style={
                  categoryFilter === "All"
                    ? {
                        backgroundColor:
                          GOLD,
                      }
                    : undefined
                }
              >
                All
              </button>

              {categories.map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setCategoryFilter(
                        category
                      )
                    }
                    className={`max-w-[180px] truncate rounded-xl px-4 py-2.5 text-xs font-black ${
                      categoryFilter ===
                      category
                        ? "text-black"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    style={
                      categoryFilter ===
                      category
                        ? {
                            backgroundColor:
                              GOLD,
                          }
                        : undefined
                    }
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* COURSE DIRECTORY */}
        <section className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Course Catalog
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Existing Courses
              </h2>
            </div>

            <span className="text-sm font-semibold text-gray-500">
              {filteredCourses.length} result
              {filteredCourses.length !==
              1
                ? "s"
                : ""}
            </span>
          </div>

          {filteredCourses.length ===
          0 ? (
            <EmptyCourseState
              hasFilters={
                Boolean(search.trim()) ||
                categoryFilter !== "All"
              }
              clear={() => {
                setSearch("");
                setCategoryFilter(
                  "All"
                );
              }}
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map(
                (course) => (
                  <CourseCard
                    key={course?._id}
                    course={course}
                    deletingId={
                      deletingId
                    }
                    onView={() =>
                      setSelectedCourse(
                        course
                      )
                    }
                    onDelete={
                      removeCourse
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>

      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          deletingId={deletingId}
          onClose={() =>
            setSelectedCourse(
              null
            )
          }
          onDelete={
            removeCourse
          }
        />
      )}
    </div>
  );
};

const CourseCard = ({
  course,
  deletingId,
  onView,
  onDelete,
}) => {
  const thumbnail =
    course?.thumbnail ||
    course?.image ||
    "";

  const price = Number(
    course?.price || 0
  );

  const modules = Array.isArray(
    course?.modules
  )
    ? course.modules
    : [];

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-[#FCFCFA] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
      <div className="relative h-44 bg-black">
        {thumbnail ? (
          <img
            src={getAssetUrl(
              thumbnail
            )}
            alt={
              course?.title ||
              "Course"
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-black"
              style={{
                backgroundColor:
                  GOLD,
              }}
            >
              <FiBookOpen size={30} />
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-gray-800">
            {course?.category ||
              "General"}
          </span>
        </div>

        <div className="absolute bottom-4 right-4">
          <span
            className="rounded-full px-3 py-1.5 text-xs font-black text-black"
            style={{
              backgroundColor: GOLD,
            }}
          >
            {price > 0
              ? `₹${price.toLocaleString(
                  "en-IN"
                )}`
              : "Free"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 min-h-[48px] text-lg font-black text-gray-950">
          {course?.title ||
            "Untitled Course"}
        </h3>

        <p className="mt-2 line-clamp-3 min-h-[66px] text-sm leading-6 text-gray-500">
          {course?.description ||
            "No course description available."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {course?.duration && (
            <span className="inline-flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600">
              <FiClock />
              {course.duration}
            </span>
          )}

          <span className="inline-flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600">
            <FiFileText />
            {modules.length} module
            {modules.length !== 1
              ? "s"
              : ""}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white px-2 py-2.5 text-xs font-black text-gray-700"
          >
            <FiExternalLink />
            View
          </button>

          <Link
            to={`/control/courses/${course?._id}/lessons`}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 px-2 py-2.5 text-xs font-black text-[#8D7414]"
          >
            <FiBookOpen />
            Lessons
          </Link>

          <button
            type="button"
            disabled={
              deletingId ===
              course?._id
            }
            onClick={() =>
              onDelete(
                course?._id
              )
            }
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-50 px-2 py-2.5 text-xs font-black text-red-700 disabled:opacity-50"
          >
            <FiTrash2 />
            {deletingId ===
            course?._id
              ? "..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseModal = ({
  course,
  deletingId,
  onClose,
  onDelete,
}) => {
  const price = Number(
    course?.price || 0
  );

  const modules = Array.isArray(
    course?.modules
  )
    ? course.modules
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Course Details
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                {course?.title ||
                  "Course"}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-xl font-bold text-gray-500"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <InfoBox
              label="Category"
              value={
                course?.category ||
                "General"
              }
            />

            <InfoBox
              label="Duration"
              value={
                course?.duration ||
                "Not available"
              }
            />

            <InfoBox
              label="Price"
              value={
                price > 0
                  ? `₹${price.toLocaleString(
                      "en-IN"
                    )}`
                  : "Free"
              }
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-5">
            <p className="text-xs font-black uppercase tracking-wide text-gray-400">
              Description
            </p>

            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
              {course?.description ||
                "No description available."}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-5">
            <p className="text-xs font-black uppercase tracking-wide text-gray-400">
              Modules
            </p>

            {modules.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">
                No modules defined.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {modules.map(
                  (module, index) => (
                    <div
                      key={`${module}-${index}`}
                      className="flex items-center gap-3 rounded-xl bg-white p-3"
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black text-black"
                        style={{
                          backgroundColor:
                            GOLD,
                        }}
                      >
                        {index + 1}
                      </span>

                      <span className="text-sm font-bold text-gray-700">
                        {module}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Link
              to={`/control/courses/${course?._id}/lessons`}
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-black text-black"
              style={{
                backgroundColor:
                  GOLD,
              }}
            >
              <FiBookOpen />
              Manage Lessons
            </Link>

            <button
              type="button"
              disabled={
                deletingId ===
                course?._id
              }
              onClick={() =>
                onDelete(
                  course?._id
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-black text-white disabled:opacity-50"
            >
              <FiTrash2 />
              Delete Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  required = false,
}) => (
  <div>
    <label className="mb-2 block text-sm font-black text-gray-800">
      {label}
      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}
    </label>

    <div className="relative">
      {prefix && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-gray-400">
          {prefix}
        </span>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white ${
          prefix ? "pl-9" : ""
        }`}
      />
    </div>
  </div>
);

const MetricCard = ({
  label,
  value,
  icon,
  tone,
}) => {
  const tones = {
    gold:
      "bg-[#D4AF37]/10 text-[#8D7414]",
    green:
      "bg-emerald-50 text-emerald-600",
    blue:
      "bg-blue-50 text-blue-600",
    purple:
      "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-gray-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({
  label,
  value,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
    <p className="text-xs font-semibold text-gray-400">
      {label}
    </p>

    <p className="mt-1 break-words text-sm font-black text-gray-800">
      {value}
    </p>
  </div>
);

const EmptyCourseState = ({
  hasFilters,
  clear,
}) => (
  <div className="rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-14 text-center">
    <FiBookOpen
      className="mx-auto text-gray-300"
      size={34}
    />

    <h3 className="mt-4 text-xl font-black text-gray-950">
      {hasFilters
        ? "No Matching Courses"
        : "No Courses Yet"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {hasFilters
        ? "Try changing your search or category filter."
        : "Create your first course using the Course Builder above."}
    </p>

    {hasFilters && (
      <button
        type="button"
        onClick={clear}
        className="mt-5 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700"
      >
        Clear Filters
      </button>
    )}
  </div>
);

const CoursesSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1600px] animate-pulse space-y-6">
      <div className="h-64 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="h-[520px] rounded-[30px] bg-white" />
      <div className="h-20 rounded-3xl bg-white" />
      <div className="h-[650px] rounded-[30px] bg-white" />
    </div>
  </div>
);

const getAssetUrl = (
  value
) => {
  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `http://localhost:5000${value}`;
};

export default Courses;