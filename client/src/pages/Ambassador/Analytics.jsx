import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiAward,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiLink,
  FiRefreshCw,
  FiTrendingUp,
  FiUsers,
  FiUserPlus,
  FiAlertCircle,
} from "react-icons/fi";

import api from "../../services/api";

const GOLD = "#D4AF37";

const Analytics = () => {
  const [user, setUser] = useState(null);

  const [data, setData] = useState({
    stats: {},
    referral: {},
    students: [],
  });

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        setLoading(false);
        setError(
          "Ambassador session not found. Please login again."
        );
        return;
      }

      setUser(
        JSON.parse(storedUser)
      );
    } catch (err) {
      console.error(
        "Analytics user parse error:",
        err
      );

      setLoading(false);
      setError(
        "Unable to read ambassador session."
      );
    }
  }, []);

  useEffect(() => {
    if (user?.id || user?._id) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async (
    isRefresh = false
  ) => {
    const userId =
      user?.id || user?._id;

    if (!userId) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await api.get(
          `/ambassador/dashboard/${userId}`
        );

      const result =
        response?.data?.data ||
        response?.data ||
        {};

      setData({
        stats:
          result?.stats || {},
        referral:
          result?.referral || {},
        students:
          Array.isArray(
            result?.students
          )
            ? result.students
            : [],
      });
    } catch (err) {
      console.error(
        "Ambassador analytics error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load ambassador analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const analytics = useMemo(() => {
    const stats =
      data?.stats || {};

    const students =
      Array.isArray(
        data?.students
      )
        ? data.students
        : [];

    const referrals = Number(
      stats?.totalReferrals || 0
    );

    const enrollments = Number(
      stats?.successfulReferrals ||
        0
    );

    const certificates = Number(
      stats?.certificates || 0
    );

    const rewardPoints = Number(
      stats?.rewardPoints || 0
    );

    const rank = Number(
      stats?.rank || 0
    );

    const conversionRate =
      referrals > 0
        ? Math.round(
            (enrollments /
              referrals) *
              100
          )
        : 0;

    const certificateRate =
      enrollments > 0
        ? Math.round(
            (certificates /
              enrollments) *
              100
          )
        : 0;

    const referredStudentCount =
      students.length;

    return {
      referrals,
      enrollments,
      certificates,
      rewardPoints,
      rank,
      conversionRate,
      certificateRate,
      referredStudentCount,
    };
  }, [data]);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8F8F6] px-6">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <FiAlertCircle
              size={26}
            />
          </div>

          <h2 className="mt-5 text-2xl font-black text-gray-950">
            Ambassador Session Missing
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Please login again to access your analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[32px] bg-black px-6 py-7 text-white shadow-2xl sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D4AF37]/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-white/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiBarChart2
                  size={14}
                  style={{
                    color: GOLD,
                  }}
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Ambassador Analytics
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Performance Analytics
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Understand your referral impact, enrollment performance,
                certificate progress and reward growth.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadAnalytics(true)
              }
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
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
                : "Refresh Analytics"}
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Primary metrics */}
        <section>
          <div className="mb-4">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{
                color: GOLD,
              }}
            >
              Key Metrics
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-950">
              Your ambassador performance
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Referrals"
              value={
                analytics.referrals
              }
              icon={<FiUsers />}
              tone="gold"
              description="Students referred"
            />

            <MetricCard
              title="Enrollments"
              value={
                analytics.enrollments
              }
              icon={
                <FiCheckCircle />
              }
              tone="green"
              description="Successful conversions"
            />

            <MetricCard
              title="Conversion Rate"
              value={`${analytics.conversionRate}%`}
              icon={
                <FiTrendingUp />
              }
              tone="blue"
              description="Referral to enrollment"
            />

            <MetricCard
              title="Reward Points"
              value={
                analytics.rewardPoints
              }
              icon={<FiAward />}
              tone="purple"
              description="Current rewards"
            />
          </div>
        </section>

        {/* Main analytics */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

          {/* Funnel */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Referral Funnel
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Conversion journey
                </h2>
              </div>

              <span className="text-xs font-semibold text-gray-400">
                Based on available platform data
              </span>
            </div>

            <div className="mt-8 space-y-6">

              <FunnelStep
                number="01"
                title="Referrals"
                value={
                  analytics.referrals
                }
                percentage={100}
                tone="gray"
                description="Students connected through your referral"
              />

              <FunnelStep
                number="02"
                title="Enrollments"
                value={
                  analytics.enrollments
                }
                percentage={
                  analytics.conversionRate
                }
                tone="blue"
                description="Referrals that converted successfully"
              />

              <FunnelStep
                number="03"
                title="Certificates"
                value={
                  analytics.certificates
                }
                percentage={
                  analytics.certificateRate
                }
                tone="gold"
                description="Successful referrals reaching certificate stage"
              />
            </div>
          </div>

          {/* Score */}
          <div className="rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-7">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{
                color: GOLD,
              }}
            >
              Ambassador Score
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Performance snapshot
            </h2>

            <div className="mt-8 flex justify-center">
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[14px] border-white/10">
                <div
                  className="absolute inset-[-14px] rounded-full border-[14px] border-transparent"
                  style={{
                    borderTopColor:
                      GOLD,
                    borderRightColor:
                      GOLD,
                    transform: `rotate(${Math.min(
                      320,
                      analytics.conversionRate *
                        3.2
                    )}deg)`,
                  }}
                />

                <div className="text-center">
                  <p className="text-4xl font-black">
                    {analytics.conversionRate}%
                  </p>

                  <p className="mt-1 text-xs font-semibold text-gray-400">
                    Conversion
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <DarkMetric
                label="Rank"
                value={
                  analytics.rank
                    ? `#${analytics.rank}`
                    : "—"
                }
              />

              <DarkMetric
                label="Certificates"
                value={
                  analytics.certificates
                }
              />

              <DarkMetric
                label="Referrals"
                value={
                  analytics.referrals
                }
              />

              <DarkMetric
                label="Enrollments"
                value={
                  analytics.enrollments
                }
              />
            </div>
          </div>
        </section>

        {/* Reward section */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Reward Performance
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Rewards & recognition
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-black text-[#8D7414]">
              <FiAward />
              {analytics.rewardPoints} points
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <RewardCard
              icon={<FiStarFallback />}
              label="Reward Points"
              value={
                analytics.rewardPoints
              }
              description="Current earned reward points."
            />

            <RewardCard
              icon={<FiTrendingUp />}
              label="Successful Referrals"
              value={
                analytics.enrollments
              }
              description="Referrals resulting in enrollment."
            />

            <RewardCard
              icon={<FiCheckCircle />}
              label="Certificate Impact"
              value={
                analytics.certificates
              }
              description="Referred students reaching certification."
            />
          </div>
        </section>

        {/* Student activity */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Recent Referral Activity
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Student activity
              </h2>
            </div>

            <Link
              to="/ambassador/students"
              className="inline-flex items-center gap-1 text-sm font-black text-gray-700 hover:text-black"
            >
              View all students
              <FiArrowUpRight />
            </Link>
          </div>

          {data.students.length ===
          0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-12 text-center">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-black"
                style={{
                  backgroundColor:
                    GOLD,
                }}
              >
                <FiUsers size={26} />
              </div>

              <h3 className="mt-4 text-xl font-black text-gray-950">
                No Referral Activity Yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Once students join through your referral, their activity
                will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {data.students
                .slice(0, 9)
                .map((student) => (
                  <StudentActivityCard
                    key={
                      student?._id
                    }
                    student={
                      student
                    }
                  />
                ))}
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section>
          <div className="mb-4">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{
                color: GOLD,
              }}
            >
              Next Actions
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-950">
              Grow your impact
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <QuickAction
              to="/ambassador/referrals"
              icon={<FiLink />}
              title="Referral Center"
              description="Share and monitor your referral activity."
            />

            <QuickAction
              to="/ambassador/students"
              icon={<FiUsers />}
              title="Student Network"
              description="Review students connected through you."
            />

            <QuickAction
              to="/ambassador/communities"
              icon={<FiUserPlus />}
              title="Communities"
              description="Build and engage with your student network."
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  icon,
  tone,
  description,
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
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-gray-950">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            tones[tone]
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const FunnelStep = ({
  number,
  title,
  value,
  percentage,
  tone,
  description,
}) => {
  const barColors = {
    gray: "bg-gray-500",
    blue: "bg-blue-500",
    gold: "bg-[#D4AF37]",
  };

  return (
    <div className="flex gap-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-black"
        style={{
          backgroundColor:
            tone === "gold"
              ? GOLD
              : "#F3F4F6",
        }}
      >
        {number}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-gray-900">
              {title}
            </p>

            <p className="mt-0.5 text-xs text-gray-400">
              {description}
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-black text-gray-900">
              {value}
            </p>

            <p className="text-[11px] font-bold text-gray-400">
              {percentage}%
            </p>
          </div>
        </div>

        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${
              barColors[tone]
            }`}
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  percentage
                )
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const DarkMetric = ({
  label,
  value,
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
    <p className="text-[10px] font-black uppercase tracking-wide text-gray-500">
      {label}
    </p>

    <p className="mt-1 text-xl font-black">
      {value}
    </p>
  </div>
);

const RewardCard = ({
  icon,
  label,
  value,
  description,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-5">
    <div
      className="flex h-11 w-11 items-center justify-center rounded-xl text-black"
      style={{
        backgroundColor:
          GOLD,
      }}
    >
      {icon}
    </div>

    <p className="mt-4 text-sm font-semibold text-gray-500">
      {label}
    </p>

    <p className="mt-1 text-2xl font-black text-gray-950">
      {value}
    </p>

    <p className="mt-1 text-xs leading-5 text-gray-400">
      {description}
    </p>
  </div>
);

const StudentActivityCard = ({
  student,
}) => {
  const name =
    student?.name ||
    student?.fullName ||
    "Student";

  return (
    <div className="rounded-2xl border border-gray-100 bg-[#FCFCFA] p-4 transition hover:bg-white hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black text-black"
          style={{
            backgroundColor:
              GOLD,
          }}
        >
          {getInitials(name)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-black text-gray-900">
            {name}
          </p>

          <p className="truncate text-xs text-gray-500">
            {student?.email ||
              "No email available"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs font-semibold text-gray-400">
          Joined
        </span>

        <span className="text-xs font-bold text-gray-700">
          {formatDate(
            student?.createdAt
          )}
        </span>
      </div>
    </div>
  );
};

const QuickAction = ({
  to,
  icon,
  title,
  description,
}) => (
  <Link
    to={to}
    className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
  >
    <div className="flex items-start justify-between">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-2xl text-black"
        style={{
          backgroundColor:
            GOLD,
        }}
      >
        {icon}
      </div>

      <FiArrowUpRight className="text-gray-300 transition group-hover:text-gray-800" />
    </div>

    <h3 className="mt-5 text-lg font-black text-gray-950">
      {title}
    </h3>

    <p className="mt-1 text-sm leading-6 text-gray-500">
      {description}
    </p>
  </Link>
);

const AnalyticsSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      <div className="h-56 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="h-32 rounded-3xl bg-white"
            />
          )
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[430px] rounded-3xl bg-white" />
        <div className="h-[430px] rounded-3xl bg-gray-900" />
      </div>

      <div className="h-56 rounded-3xl bg-white" />
    </div>
  </div>
);

const getInitials = (
  name = ""
) => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "ST";
  }

  return words
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase()
    )
    .join("");
};

const formatDate = (
  value
) => {
  if (!value) return "—";

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const FiStarFallback = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2.8l2.87 5.81 6.41.93-4.64 4.52 1.1 6.39L12 17.44l-5.74 3.01 1.1-6.39L2.72 9.54l6.41-.93L12 2.8z" />
  </svg>
);

export default Analytics;