import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiBriefcase,
  FiBookmark,
  FiAward,
  FiUser,
  FiBookOpen,
  FiArrowRight,
  FiMapPin,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiCreditCard,
  FiRefreshCw,
  FiChevronRight,
  FiTrendingUp,
} from "react-icons/fi";

import { getDashboardStats } from "../../services/dashboardService";

const API_BASE = API_ORIGIN;

const getAuthToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    ""
  );
};

const Dashboard = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const [dashboard, setDashboard] = useState(null);
  const [statusData, setStatusData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const userId = user?.id || user?._id;

      const [dashboardResult, statusResult] = await Promise.allSettled([
        getDashboardStats(userId),
        fetch(`${API_BASE}/api/student-status`, {
          headers: {
            "Content-Type": "application/json",
            ...(getAuthToken()
              ? {
                  Authorization: `Bearer ${getAuthToken()}`,
                }
              : {}),
          },
        }),
      ]);

      if (dashboardResult.status === "fulfilled") {
        setDashboard(dashboardResult.value);
      }

      if (statusResult.status === "fulfilled") {
        const response = statusResult.value;
        const result = await response.json();

        if (response.ok) {
          setStatusData(result?.data || []);
        }
      }

      if (
        dashboardResult.status === "rejected" &&
        statusResult.status === "rejected"
      ) {
        throw new Error("Unable to load dashboard");
      }
    } catch (err) {
      console.error("Student dashboard error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-white">
        <div className="space-y-8">
          <div className="animate-pulse rounded-3xl bg-gray-100 p-8">
            <div className="h-8 w-2/3 rounded bg-gray-200" />
            <div className="mt-4 h-5 w-1/2 rounded bg-gray-200" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl bg-gray-100 p-6"
              >
                <div className="h-9 w-9 rounded bg-gray-200" />
                <div className="mt-5 h-8 w-20 rounded bg-gray-200" />
                <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="h-72 animate-pulse rounded-2xl bg-gray-100 xl:col-span-2" />
            <div className="h-72 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || {};

  const activeEnrollments = statusData.filter(
    (item) =>
      item?.enrollment &&
      item?.enrollment?.status !== "Cancelled"
  );

  const completedEnrollments = statusData.filter(
    (item) => item?.enrollment?.status === "Completed"
  );

  const approvedOfferLetters = statusData.filter(
    (item) => item?.offerLetter?.status === "approved"
  );

  const approvedCertificates = statusData.filter(
    (item) => item?.certificate?.status === "approved"
  );

  const approvedReports = statusData.filter(
    (item) => item?.report?.status === "approved"
  );

  const currentEnrollment =
    activeEnrollments.length > 0
      ? activeEnrollments[0]
      : statusData.length > 0
      ? statusData[0]
      : null;

  const currentProgress = Number(
    currentEnrollment?.enrollment?.progress || 0
  );

  const recentStatuses = statusData.slice(0, 3);

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-8">
      {/* Error */}
      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Welcome */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#D4AF37] to-yellow-500 p-7 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-white/80">
              Student Dashboard
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Welcome Back, {user?.name || "Student"} 👋
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
              Track your learning, applications, offer letters,
              certificates and career opportunities from one place.
            </p>
          </div>

          <button
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={<FiBriefcase />}
          value={stats.applied || 0}
          title="Applications"
        />

        <StatCard
          icon={<FiBookOpen />}
          value={stats.courses || 0}
          title="My Courses"
        />

        <StatCard
          icon={<FiBookmark />}
          value={stats.saved || 0}
          title="Saved"
        />

        <StatCard
          icon={<FiAward />}
          value={stats.certificates || 0}
          title="Certificates"
        />

        <StatCard
          icon={<FiUser />}
          value={`${stats.profileCompletion || 0}%`}
          title="Profile"
        />
      </div>

      {/* Quick Status */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <QuickStatusCard
          icon={<FiCreditCard />}
          title="Active Enrollments"
          value={activeEnrollments.length}
          link="/student/status"
          text="Track your programs"
        />

        <QuickStatusCard
          icon={<FiFileText />}
          title="Offer Letters"
          value={approvedOfferLetters.length}
          link="/student/offer-letters"
          text="View approved letters"
        />

        <QuickStatusCard
          icon={<FiAward />}
          title="Certificates"
          value={approvedCertificates.length}
          link="/student/my-documents"
          text="View your certificates"
        />

        <QuickStatusCard
          icon={<FiCheckCircle />}
          title="Completed"
          value={completedEnrollments.length}
          link="/student/status"
          text="Completed programs"
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Current Learning */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Current Learning
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Continue where you left off.
              </p>
            </div>

            <Link
              to="/student/my-courses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-[#9B7B16]"
            >
              View All
              <FiArrowRight />
            </Link>
          </div>

          {dashboard?.myCourses?.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {dashboard.myCourses.slice(0, 3).map((item) => {
                const progress = Number(item?.progress || 0);

                return (
                  <div
                    key={item._id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:border-[#D4AF37]/50 hover:shadow-md"
                  >
                    <div className="relative">
                      {item?.course?.thumbnail ? (
                        <img
                          src={`${API_BASE}${item.course.thumbnail}`}
                          alt={item?.course?.title || "Course"}
                          className="h-36 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-36 w-full items-center justify-center bg-gray-100 text-[#D4AF37]">
                          <FiBookOpen size={34} />
                        </div>
                      )}

                      <div className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#8B6E12] shadow-sm">
                        {progress}%
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="line-clamp-2 font-bold text-gray-900">
                        {item?.course?.title ||
                          item?.course?.name ||
                          "Course"}
                      </h3>

                      <div className="mt-4">
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            Progress
                          </span>

                          <span className="font-semibold text-gray-900">
                            {progress}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#D4AF37] transition-all"
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(100, progress)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <Link
                        to="/student/my-courses"
                        className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#D4AF37] py-2.5 text-sm font-semibold text-white transition hover:bg-[#b99520]"
                      >
                        Continue
                        <FiArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<FiBookOpen size={26} />}
              title="No enrolled courses yet"
              text="Your purchased courses will appear here."
              link="/student/courses"
              button="Explore Courses"
            />
          )}
        </div>

        {/* Current Program Status */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Current Status
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your latest enrollment journey.
            </p>
          </div>

          {currentEnrollment ? (
            <div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {currentEnrollment?.type === "internship"
                    ? "Internship"
                    : "Course"}
                </p>

                <h3 className="mt-1 line-clamp-2 font-bold text-gray-900">
                  {currentEnrollment?.program?.name ||
                    "Program"}
                </h3>

                {currentEnrollment?.program?.company && (
                  <p className="mt-1 text-sm text-[#D4AF37]">
                    {currentEnrollment.program.company}
                  </p>
                )}

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Progress
                    </span>

                    <span className="text-sm font-bold text-gray-900">
                      {currentProgress}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[#D4AF37] transition-all"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, currentProgress)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {currentEnrollment.steps
                  ?.slice(0, 4)
                  .map((step, index) => (
                    <MiniStatus
                      key={`${step.label}-${index}`}
                      label={step.label}
                      status={step.status}
                    />
                  ))}
              </div>

              <Link
                to="/student/status"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#9B7B16]"
              >
                View Full Journey
                <FiArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <EmptyState
              icon={<FiClock size={26} />}
              title="No active enrollment"
              text="Your application status will appear here."
              link="/student/status"
              button="Check Status"
            />
          )}
        </div>
      </div>

      {/* Documents + Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Documents */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                My Documents
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your approved career documents.
              </p>
            </div>

            <Link
              to="/student/my-documents"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-[#9B7B16]"
            >
              View All
              <FiArrowRight />
            </Link>
          </div>

          <div className="space-y-3">
            <DocumentRow
              icon={<FiFileText />}
              title="Offer Letters"
              count={approvedOfferLetters.length}
              link="/student/offer-letters"
            />

            <DocumentRow
              icon={<FiAward />}
              title="Certificates"
              count={approvedCertificates.length}
              link="/student/my-documents"
            />

            <DocumentRow
              icon={<FiFileText />}
              title="Internship Reports"
              count={approvedReports.length}
              link="/student/my-documents"
            />
          </div>
        </div>

        {/* Recent Application Status */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Applications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest payment and enrollment activity.
              </p>
            </div>

            <Link
              to="/student/status"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-[#9B7B16]"
            >
              All
              <FiArrowRight />
            </Link>
          </div>

          {recentStatuses.length ? (
            <div className="space-y-3">
              {recentStatuses.map((item) => (
                <Link
                  key={item.id}
                  to="/student/status"
                  className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                    {item?.type === "internship" ? (
                      <FiBriefcase />
                    ) : (
                      <FiBookOpen />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-gray-900">
                      {item?.program?.name || "Program"}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Payment:{" "}
                      <span className="font-semibold capitalize">
                        {item?.payment?.status || "pending"}
                      </span>
                    </p>
                  </div>

                  <FiChevronRight className="shrink-0 text-gray-400" />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FiBriefcase size={26} />}
              title="No applications yet"
              text="Your applications will appear here."
              link="/student/internships"
              button="Explore Internships"
            />
          )}
        </div>
      </div>

      {/* Latest Internships */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-[#D4AF37]" size={20} />

              <h2 className="text-2xl font-bold text-gray-900">
                Latest Internships
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Real opportunities currently available on the platform.
            </p>
          </div>

          <Link
            to="/student/internships"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-[#9B7B16]"
          >
            View All
            <FiArrowRight />
          </Link>
        </div>

        {dashboard?.latestInternships?.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {dashboard.latestInternships
              .slice(0, 4)
              .map((item) => (
                <Link
                  key={item._id}
                  to={`/student/internships/${item._id}`}
                  className="rounded-xl border border-gray-200 p-5 transition hover:border-[#D4AF37]/50 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-gray-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 font-semibold text-[#D4AF37]">
                        {item.company}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                      <FiBriefcase />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <FiMapPin />
                      {item.location || "Remote"}
                    </span>

                    {item.workMode && (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {item.workMode}
                      </span>
                    )}

                    <span className="font-semibold text-gray-800">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        ) : (
          <div className="rounded-xl bg-gray-50 p-8 text-center text-sm text-gray-500">
            No internships available right now.
          </div>
        )}
      </div>

      {/* Profile Progress */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiUser />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Profile Completion
              </h2>

              <p className="text-sm text-gray-500">
                Complete your profile for better opportunities.
              </p>
            </div>
          </div>

          <span className="text-xl font-bold text-[#D4AF37]">
            {stats.profileCompletion || 0}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
            style={{
              width: `${Math.max(
                0,
                Math.min(100, Number(stats.profileCompletion || 0))
              )}%`,
            }}
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            A complete profile helps improve internship recommendations.
          </p>

          <Link
            to="/student/profile"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b99520]"
          >
            Complete Profile
            <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Components ----------------------------- */

const StatCard = ({ icon, value, title }) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-2xl text-[#D4AF37]">
        {icon}
      </div>

      <h2 className="text-3xl font-bold text-gray-900">
        {value}
      </h2>

      <p className="mt-1 text-sm text-gray-500">{title}</p>
    </div>
  );
};

const QuickStatusCard = ({
  icon,
  title,
  value,
  link,
  text,
}) => {
  return (
    <Link
      to={link}
      className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>

        <FiArrowRight
          className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#D4AF37]"
        />
      </div>

      <p className="mt-5 text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-800">
        {title}
      </p>

      <p className="mt-1 text-xs text-gray-500">{text}</p>
    </Link>
  );
};

const DocumentRow = ({
  icon,
  title,
  count,
  link,
}) => {
  return (
    <Link
      to={link}
      className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-gray-500">
          {count} approved
        </p>
      </div>

      <FiChevronRight className="text-gray-400" />
    </Link>
  );
};

const MiniStatus = ({ label, status }) => {
  const isComplete = status === "completed";
  const isProcessing = status === "processing";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          isComplete
            ? "bg-green-100 text-green-600"
            : isProcessing
            ? "bg-[#D4AF37]/10 text-[#D4AF37]"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {isComplete ? (
          <FiCheckCircle size={15} />
        ) : (
          <FiClock size={15} />
        )}
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">
          {label}
        </p>
      </div>

      <span
        className={`text-[11px] font-bold ${
          isComplete
            ? "text-green-600"
            : isProcessing
            ? "text-[#9B7B16]"
            : "text-gray-400"
        }`}
      >
        {isComplete
          ? "Done"
          : isProcessing
          ? "Review"
          : "Pending"}
      </span>
    </div>
  );
};

const EmptyState = ({
  icon,
  title,
  text,
  link,
  button,
}) => {
  return (
    <div className="rounded-xl bg-gray-50 p-7 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-gray-900">
        {title}
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
        {text}
      </p>

      {link && button && (
        <Link
          to={link}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b99520]"
        >
          {button}
          <FiArrowRight size={15} />
        </Link>
      )}
    </div>
  );
};

export default Dashboard;