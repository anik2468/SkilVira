import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiFileText,
  FiList,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiVideo,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";

import {
  createLesson,
  getCourseLessons,
} from "../../services/lessonService";

const GOLD = "#D4AF37";

const CourseLessons = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    notesUrl: "",
    duration: "",
    order: 0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      loadLessons();
    }
  }, [id]);

  const loadLessons = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getCourseLessons(id);

      const list =
        data?.lessons ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      const safeList = Array.isArray(list)
        ? list
        : [];

      safeList.sort(
        (a, b) =>
          Number(a?.order || 0) -
          Number(b?.order || 0)
      );

      setLessons(safeList);
    } catch (err) {
      console.error(
        "COURSE LESSONS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load course lessons."
      );

      setLessons([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleChange = (e) => {
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

  const submitLesson = async () => {
    if (!form.title.trim()) {
      setError("Lesson title is required.");
      return;
    }

    if (!id) {
      setError("Course ID is missing.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createLesson({
        title: form.title.trim(),
        description:
          form.description.trim(),
        videoUrl:
          form.videoUrl.trim(),
        notesUrl:
          form.notesUrl.trim(),
        duration:
          form.duration.trim(),
        course: id,
        order: Number(form.order || 0),
      });

      setForm({
        title: "",
        description: "",
        videoUrl: "",
        notesUrl: "",
        duration: "",
        order:
          lessons.length + 1,
      });

      setSuccess(
        "Lesson added successfully."
      );

      await loadLessons();

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "CREATE LESSON ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create lesson."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLessons = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) return lessons;

    return lessons.filter((lesson) => {
      const text = [
        lesson?.title,
        lesson?.description,
        lesson?.duration,
        lesson?.order,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [lessons, search]);

  const totalDuration = useMemo(() => {
    return lessons.reduce(
      (total, lesson) => {
        const duration =
          lesson?.duration;

        const number =
          parseFloat(duration);

        return Number.isFinite(number)
          ? total + number
          : total;
      },
      0
    );
  }, [lessons]);

  if (loading) {
    return <CourseLessonsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white"
            >
              <FiArrowLeft />
              Back to Courses
            </button>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <FiBookOpen
                    size={14}
                    style={{ color: GOLD }}
                  />

                  <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                    Course Content Studio
                  </span>
                </div>

                <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl">
                  Course Lessons
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                  Build the learning journey for this course by adding
                  structured video lessons, notes and ordered modules.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  loadLessons(true)
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
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Total Lessons"
            value={lessons.length}
            icon={<FiList />}
            tone="gold"
          />

          <MetricCard
            label="Video Lessons"
            value={
              lessons.filter(
                (lesson) =>
                  Boolean(
                    lesson?.videoUrl
                  )
              ).length
            }
            icon={<FiVideo />}
            tone="blue"
          />

          <MetricCard
            label="Notes Available"
            value={
              lessons.filter(
                (lesson) =>
                  Boolean(
                    lesson?.notesUrl
                  )
              ).length
            }
            icon={<FiFileText />}
            tone="green"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">

          {/* CREATE */}
          <section className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Lesson Builder
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Add New Lesson
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Add the next learning unit to this course.
              </p>
            </div>

            <div className="space-y-4">
              <Field
                label="Lesson Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to JavaScript"
                required
              />

              <div>
                <label className="mb-2 block text-sm font-black text-gray-800">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe what students will learn..."
                  className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium leading-6 outline-none focus:border-[#D4AF37] focus:bg-white"
                />
              </div>

              <Field
                label="Video URL"
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="https://..."
                icon={<FiVideo />}
              />

              <Field
                label="Notes URL"
                name="notesUrl"
                value={form.notesUrl}
                onChange={handleChange}
                placeholder="https://.../notes.pdf"
                icon={<FiFileText />}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 25 min"
                  icon={<FiClock />}
                />

                <Field
                  label="Lesson Order"
                  name="order"
                  type="number"
                  value={form.order}
                  onChange={handleChange}
                  placeholder="1"
                />
              </div>

              <button
                type="button"
                onClick={submitLesson}
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black disabled:opacity-50"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiPlus />

                {submitting
                  ? "Adding Lesson..."
                  : "Add Lesson"}
              </button>
            </div>
          </section>

          {/* LIST */}
          <section className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Curriculum
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Lesson Library
                </h2>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <FiSearch
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search lessons..."
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {filteredLessons.length ===
            0 ? (
              <EmptyLessons
                hasSearch={Boolean(
                  search.trim()
                )}
              />
            ) : (
              <div className="space-y-3">
                {filteredLessons.map(
                  (lesson, index) => (
                    <LessonCard
                      key={
                        lesson?._id ||
                        index
                      }
                      lesson={lesson}
                    />
                  )
                )}
              </div>
            )}

            {lessons.length > 0 && (
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#FAFAF8] p-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    Curriculum summary
                  </p>

                  <p className="mt-1 text-sm font-black text-gray-800">
                    {lessons.length} lessons
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-400">
                    Numeric duration total
                  </p>

                  <p className="mt-1 text-sm font-black text-gray-800">
                    {totalDuration || 0}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

const LessonCard = ({
  lesson,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4 transition hover:bg-white hover:shadow-md sm:p-5">
    <div className="flex items-start gap-4">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-black"
        style={{
          backgroundColor: GOLD,
        }}
      >
        <span className="text-sm font-black">
          {Number(
            lesson?.order || 0
          )}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-black text-gray-900">
              {lesson?.title ||
                "Untitled Lesson"}
            </h3>

            {lesson?.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                {lesson.description}
              </p>
            )}
          </div>

          {lesson?.duration && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-600">
              <FiClock />
              {lesson.duration}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {lesson?.videoUrl && (
            <a
              href={lesson.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black text-blue-700"
            >
              <FiVideo />
              Video
              <FiExternalLink />
            </a>
          )}

          {lesson?.notesUrl && (
            <a
              href={lesson.notesUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700"
            >
              <FiFileText />
              Notes
              <FiExternalLink />
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  required = false,
}) => (
  <div>
    <label className="mb-2 flex items-center gap-2 text-sm font-black text-gray-800">
      {icon && (
        <span className="text-gray-400">
          {icon}
        </span>
      )}

      {label}

      {required && (
        <span className="text-red-500">
          *
        </span>
      )}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
    />
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
    blue:
      "bg-blue-50 text-blue-600",
    green:
      "bg-emerald-50 text-emerald-600",
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

const EmptyLessons = ({
  hasSearch,
}) => (
  <div className="rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-14 text-center">
    <FiBookOpen
      className="mx-auto text-gray-300"
      size={34}
    />

    <h3 className="mt-4 text-xl font-black text-gray-950">
      {hasSearch
        ? "No Matching Lessons"
        : "No Lessons Yet"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {hasSearch
        ? "Try a different lesson search."
        : "Add the first lesson from the Lesson Builder."}
    </p>
  </div>
);

const CourseLessonsSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1500px] animate-pulse space-y-6">
      <div className="h-64 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[650px] rounded-[30px] bg-white" />
        <div className="h-[650px] rounded-[30px] bg-white" />
      </div>
    </div>
  </div>
);

export default CourseLessons;