import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiBookOpen,
  FiClock,
  FiRefreshCw,
  FiArrowRight,
  FiCheckCircle,
  FiPlayCircle,
  FiAlertCircle,
} from "react-icons/fi";

import {
  getMyCourses,
} from "../../services/enrollmentService";

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


const getStoredUser = () => {
  try {
    const stored =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    return stored
      ? JSON.parse(stored)
      : null;
  } catch (error) {
    console.error(
      "Failed to read user:",
      error
    );

    return null;
  }
};


const getProgress = (item) => {
  const progress = Number(
    item?.progress ??
      item?.completionPercentage ??
      item?.courseProgress ??
      0
  );

  return Math.min(
    100,
    Math.max(
      0,
      Number.isFinite(progress)
        ? progress
        : 0
    )
  );
};


const getEnrollmentStatus = (item) => {
  const status = String(
    item?.status ||
      item?.enrollmentStatus ||
      "active"
  ).toLowerCase();

  if (
    status === "completed" ||
    status === "complete"
  ) {
    return {
      label: "Completed",
      className:
        "bg-green-50 text-green-700",
    };
  }

  if (
    status === "pending" ||
    status === "pending_payment"
  ) {
    return {
      label: "Pending",
      className:
        "bg-yellow-50 text-yellow-700",
    };
  }

  if (
    status === "cancelled" ||
    status === "rejected" ||
    status === "inactive"
  ) {
    return {
      label:
        status.charAt(0).toUpperCase() +
        status.slice(1),
      className:
        "bg-red-50 text-red-700",
    };
  }

  return {
    label: "Active",
    className:
      "bg-blue-50 text-blue-700",
  };
};


// =====================================================
// COMPONENT
// =====================================================

const MyCourses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


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

      const user =
        getStoredUser();

      const studentId =
        user?._id ||
        user?.id;

      if (!studentId) {
        setError(
          "Student session not found. Please login again."
        );

        setCourses([]);
        return;
      }

      const response =
        await getMyCourses(
          studentId
        );

      const enrollments =
        response?.enrollments ||
        response?.data?.enrollments ||
        response?.data ||
        [];

      setCourses(
        Array.isArray(enrollments)
          ? enrollments
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
          "Failed to load your courses."
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
  // Stats
  // ======================================

  const stats = useMemo(() => {
    const total = courses.length;

    const completed =
      courses.filter(
        (item) =>
          getProgress(item) >= 100
      ).length;

    const active =
      courses.filter(
        (item) =>
          getProgress(item) < 100
      ).length;

    const averageProgress =
      total > 0
        ? Math.round(
            courses.reduce(
              (sum, item) =>
                sum +
                getProgress(item),
              0
            ) / total
          )
        : 0;

    return {
      total,
      completed,
      active,
      averageProgress,
    };
  }, [courses]);


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-9 w-56 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 h-5 w-[30rem] max-w-full animate-pulse rounded bg-gray-100" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-gray-100"
              />
            )
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-48 animate-pulse bg-gray-200" />

                <div className="space-y-4 p-5">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />

                  <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }


  // ======================================
  // UI
  // ======================================

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1.5">
            <FiBookOpen
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-xs font-semibold text-[#8B6E12]">
              Learning Dashboard
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            My Courses
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Continue your learning journey
            with SkilVira.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            loadCourses(true)
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
          <div className="flex items-start gap-2">
            <FiAlertCircle
              className="mt-0.5 shrink-0"
              size={18}
            />

            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={() =>
              loadCourses(true)
            }
            className="font-semibold underline underline-offset-2"
          >
            Try Again
          </button>
        </div>
      )}


      {/* Stats */}
      {courses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<FiBookOpen />}
            label="Enrolled Courses"
            value={stats.total}
          />

          <StatCard
            icon={<FiPlayCircle />}
            label="In Progress"
            value={stats.active}
          />

          <StatCard
            icon={<FiCheckCircle />}
            label="Completed"
            value={stats.completed}
          />
        </div>
      )}


      {/* Empty */}
      {courses.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100 sm:p-16">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiBookOpen size={36} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            No enrolled courses yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Explore available courses and
            start learning with SkilVira.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/courses"
              )
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b99520]"
          >
            Explore Courses
            <FiArrowRight />
          </button>
        </div>
      ) : (
        <>
          {/* Overall Progress */}
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Overall Learning Progress
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stats.averageProgress}%
                </p>
              </div>

              <div className="text-sm text-gray-500">
                Across {stats.total}{" "}
                enrolled{" "}
                {stats.total === 1
                  ? "course"
                  : "courses"}
              </div>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
                style={{
                  width: `${stats.averageProgress}%`,
                }}
              />
            </div>
          </div>


          {/* Course Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((item) => {
              const course =
                item?.course;

              const progress =
                getProgress(item);

              const thumbnail =
                getFileUrl(
                  course?.thumbnail
                );

              const status =
                getEnrollmentStatus(
                  item
                );

              const courseId =
                course?._id ||
                item?.courseId;

              const isCompleted =
                progress >= 100;


              return (
                <article
                  key={
                    item?._id ||
                    courseId
                  }
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={
                          course?.title ||
                          "Course"
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-50">
                        <FiBookOpen
                          size={48}
                          className="text-gray-300"
                        />
                      </div>
                    )}

                    {/* Status */}
                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
                    >
                      {status.label}
                    </span>

                    {/* Completed Overlay */}
                    {isCompleted && (
                      <div className="absolute inset-x-0 bottom-0 bg-green-600/90 px-4 py-2 text-center text-xs font-bold text-white">
                        Course Completed
                      </div>
                    )}
                  </div>


                  {/* Content */}
                  <div className="p-5">
                    <div className="min-h-[76px]">
                      <h2 className="line-clamp-2 text-xl font-bold text-gray-900">
                        {course?.title ||
                          "Course"}
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                        {course?.category && (
                          <span>
                            {
                              course.category
                            }
                          </span>
                        )}

                        {course?.duration && (
                          <span className="inline-flex items-center gap-1">
                            <FiClock
                              size={13}
                            />

                            {
                              course.duration
                            }
                          </span>
                        )}
                      </div>
                    </div>


                    {/* Progress */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700">
                          Course Progress
                        </span>

                        <span className="font-bold text-[#8B6E12]">
                          {progress}%
                        </span>
                      </div>

                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-gray-500">
                        {progress >= 100
                          ? "You have completed this course."
                          : `${progress}% completed`}
                      </p>
                    </div>


                    {/* Button */}
                    <button
                      type="button"
                      disabled={!courseId}
                      onClick={() => {
                        if (!courseId) {
                          return;
                        }

                        navigate(
                          `/student/learn/${courseId}`
                        );
                      }}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-3 font-semibold text-white transition hover:bg-[#b99520] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCompleted
                        ? "Review Course"
                        : "Continue Learning"}

                      <FiArrowRight
                        size={16}
                      />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};


// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">
          {label}
        </p>

        <p className="mt-0.5 text-2xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
};


export default MyCourses;