import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiAward,
  FiBriefcase,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiRefreshCw,
  FiShield,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
  FiAlertCircle,
  FiArrowUpRight,
  FiGrid,
} from "react-icons/fi";

import { Link } from "react-router-dom";
import { getAdminDashboard } from "../../services/dashboardService";

const GOLD = "#D4AF37";

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    recruiters: 0,
    colleges: 0,
    admins: 0,
    internships: 0,
    applications: 0,
    certificates: 0,
    payments: 0,
    netRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getAdminDashboard();

      const incoming = data?.stats || {};

      setStats({
        students: Number(incoming.students || 0),
        recruiters: Number(incoming.recruiters || 0),
        colleges: Number(incoming.colleges || 0),
        admins: Number(incoming.admins || 0),
        internships: Number(incoming.internships || 0),
        applications: Number(incoming.applications || 0),
        certificates: Number(incoming.certificates || 0),
        payments: Number(incoming.payments || 0),
        netRevenue: Number(incoming.netRevenue || 0),
      });
    } catch (err) {
      console.error("ADMIN DASHBOARD ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applicationRate = useMemo(() => {
    if (!stats.students) return 0;

    return Math.min(
      100,
      Math.round(
        (stats.applications / stats.students) * 100
      )
    );
  }, [stats.students, stats.applications]);

  const certificateRate = useMemo(() => {
    if (!stats.students) return 0;

    return Math.min(
      100,
      Math.round(
        (stats.certificates / stats.students) * 100
      )
    );
  }, [stats.students, stats.certificates]);

  const ecosystemTotal = useMemo(() => {
    return (
      stats.students +
      stats.recruiters +
      stats.colleges +
      stats.internships
    );
  }, [stats]);

  const cards = [
    {
      title: "Students",
      value: formatNumber(stats.students),
      helper: "Registered learners",
      icon: <FiUsers />,
      tone: "gold",
    },
    {
      title: "Recruiters",
      value: formatNumber(stats.recruiters),
      helper: "Hiring partners",
      icon: <FiBriefcase />,
      tone: "blue",
    },
    {
      title: "Colleges",
      value: formatNumber(stats.colleges),
      helper: "Institution network",
      icon: <FiGrid />,
      tone: "purple",
    },
    {
      title: "Internships",
      value: formatNumber(stats.internships),
      helper: "Available opportunities",
      icon: <FiActivity />,
      tone: "green",
    },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* =========================================================
            HERO
        ========================================================= */}

        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiShield
                  size={14}
                  style={{ color: GOLD }}
                />

                <span className="text-xs font-black uppercase tracking-[0.22em] text-gray-300">
                  SkilVira Control Center
                </span>
              </div>

              <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-6xl">
                Platform Command Center
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                Monitor the complete SkilVira ecosystem from one
                place — students, recruiters, internships,
                applications, payments and certificates.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <StatusChip
                  icon={<FiCheckCircle />}
                  text="Platform Operational"
                />

                <StatusChip
                  icon={<FiUsers />}
                  text={`${formatNumber(
                    ecosystemTotal
                  )} Core Records`}
                />
              </div>
            </div>

            <div className="lg:justify-self-end">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
                      Administration
                    </p>

                    <p className="mt-2 text-xl font-black">
                      Live Platform Snapshot
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fetchStats(true)}
                    disabled={refreshing}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
                  >
                    <FiRefreshCw
                      className={
                        refreshing
                          ? "animate-spin"
                          : ""
                      }
                    />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MiniDarkMetric
                    label="Applications"
                    value={stats.applications}
                  />

                  <MiniDarkMetric
                    label="Certificates"
                    value={stats.certificates}
                  />

                  <MiniDarkMetric
                    label="Payments"
                    value={stats.payments}
                  />

                  <MiniDarkMetric
                    label="Admins"
                    value={stats.admins}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* =========================================================
            CORE STATS
        ========================================================= */}

        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.2em]"
                style={{ color: GOLD }}
              >
                Platform Overview
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950 sm:text-3xl">
                Core ecosystem
              </h2>
            </div>

            <p className="text-sm font-semibold text-gray-500">
              Live data from admin dashboard
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <MetricCard
                key={card.title}
                {...card}
              />
            ))}
          </div>
        </section>

        {/* =========================================================
            OPERATIONS + PERFORMANCE
        ========================================================= */}

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

          {/* Operational metrics */}
          <section className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Operations
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Platform workload
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  The latest available counts across the major
                  platform workflows.
                </p>
              </div>

              <div
                className="hidden h-12 w-12 items-center justify-center rounded-2xl text-black sm:flex"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiActivity size={22} />
              </div>
            </div>

            <div className="mt-7 space-y-6">
              <ProgressRow
                label="Applications"
                value={stats.applications}
                max={Math.max(
                  stats.applications,
                  stats.internships,
                  1
                )}
                icon={<FiFileText />}
              />

              <ProgressRow
                label="Certificates"
                value={stats.certificates}
                max={Math.max(
                  stats.certificates,
                  stats.students,
                  1
                )}
                icon={<FiAward />}
              />

              <ProgressRow
                label="Recruiter Network"
                value={stats.recruiters}
                max={Math.max(
                  stats.recruiters,
                  stats.students,
                  1
                )}
                icon={<FiBriefcase />}
              />

              <ProgressRow
                label="College Network"
                value={stats.colleges}
                max={Math.max(
                  stats.colleges,
                  stats.students,
                  1
                )}
                icon={<FiGrid />}
              />
            </div>
          </section>

          {/* Financial + trust */}
          <section className="rounded-[30px] bg-black p-6 text-white shadow-2xl sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Commercial Snapshot
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Revenue & trust
                </h2>
              </div>

              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiCreditCard size={22} />
              </div>
            </div>

            <div className="mt-7 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
                Net revenue · approved payments
              </p>

              <p className="mt-2 text-4xl font-black">
                ₹ {formatNumber(stats.netRevenue)}
              </p>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                Student discounts are already reflected in the paid amount;
                recorded ambassador commission is deducted.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DarkSummary
                label="Applications"
                value={stats.applications}
                icon={<FiFileText />}
              />

              <DarkSummary
                label="Certificates"
                value={stats.certificates}
                icon={<FiAward />}
              />

              <DarkSummary
                label="Students"
                value={stats.students}
                icon={<FiUsers />}
              />

              <DarkSummary
                label="Recruiters"
                value={stats.recruiters}
                icon={<FiUserCheck />}
              />
            </div>
          </section>
        </div>

        {/* =========================================================
            PERFORMANCE CARDS
        ========================================================= */}

        <section className="grid gap-4 md:grid-cols-3">

          <InsightCard
            title="Application Activity"
            value={`${applicationRate}%`}
            subtitle="Applications relative to registered students"
            icon={<FiTrendingUp />}
            progress={applicationRate}
          />

          <InsightCard
            title="Certificate Reach"
            value={`${certificateRate}%`}
            subtitle="Certificates relative to registered students"
            icon={<FiAward />}
            progress={certificateRate}
          />

          <InsightCard
            title="Opportunity Density"
            value={formatNumber(stats.internships)}
            subtitle="Internship opportunities currently represented"
            icon={<FiBriefcase />}
            progress={Math.min(
              100,
              stats.students
                ? Math.round(
                    (stats.internships /
                      stats.students) *
                      100
                  )
                : 0
            )}
          />
        </section>

        {/* =========================================================
            QUICK ACTIONS
        ========================================================= */}

        <section className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Control Center
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Quick management
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              Jump directly into platform operations
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              to="/control/students"
              icon={<FiUsers />}
              title="Manage Students"
              description="Review and manage learner accounts."
            />

            <QuickAction
              to="/control/recruiters"
              icon={<FiBriefcase />}
              title="Manage Recruiters"
              description="Review recruiter accounts and access."
            />

            <QuickAction
              to="/control/internships"
              icon={<FiActivity />}
              title="Manage Internships"
              description="Review opportunities on the platform."
            />

            <QuickAction
              to="/control/applications"
              icon={<FiFileText />}
              title="Review Applications"
              description="Monitor internship application activity."
            />
          </div>
        </section>

        {/* =========================================================
            ADMIN CONTROL PANEL
        ========================================================= */}

        <section className="grid gap-6 lg:grid-cols-3">

          <ControlPanel
            title="People"
            icon={<FiUsers />}
            links={[
              {
                to: "/control/students",
                label: "Students",
                value: stats.students,
              },
              {
                to: "/control/recruiters",
                label: "Recruiters",
                value: stats.recruiters,
              },
              {
                to: "/control/colleges",
                label: "Colleges",
                value: stats.colleges,
              },
            ]}
          />

          <ControlPanel
            title="Opportunities"
            icon={<FiBriefcase />}
            links={[
              {
                to: "/control/internships",
                label: "Internships",
                value: stats.internships,
              },
              {
                to: "/control/applications",
                label: "Applications",
                value: stats.applications,
              },
              {
                to: "/control/courses",
                label: "Courses",
                value: "Manage",
              },
            ]}
          />

          <ControlPanel
            title="Credentials"
            icon={<FiAward />}
            links={[
              {
                to: "/control/certificates",
                label: "Certificates",
                value: stats.certificates,
              },
              {
                to: "/control/certificate-templates",
                label: "Templates",
                value: "Manage",
              },
              {
                to: "/control/settings",
                label: "Settings",
                value: "Open",
              },
            ]}
          />
        </section>

        {/* =========================================================
            FOOTER STATUS
        ========================================================= */}

        <section className="rounded-3xl border border-gray-200 bg-white px-5 py-5 shadow-sm sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiCheckCircle />
              </div>

              <div>
                <p className="text-sm font-black text-gray-900">
                  Admin dashboard connected
                </p>

                <p className="text-xs text-gray-500">
                  Statistics are loaded from the existing dashboard
                  service.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-2.5 text-xs font-black text-gray-700 hover:bg-white disabled:opacity-50"
            >
              <FiRefreshCw
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh statistics
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

/* =========================================================
   COMPONENTS
========================================================= */

const MetricCard = ({
  title,
  value,
  helper,
  icon,
  tone,
}) => {
  const tones = {
    gold: {
      icon: "bg-[#D4AF37]/10 text-[#8D7414]",
    },
    blue: {
      icon: "bg-blue-50 text-blue-600",
    },
    purple: {
      icon: "bg-purple-50 text-purple-600",
    },
    green: {
      icon: "bg-emerald-50 text-emerald-600",
    },
  };

  return (
    <div className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-gray-950">
            {value}
          </p>

          <p className="mt-2 text-xs text-gray-400">
            {helper}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            tones[tone]?.icon ||
            tones.gold.icon
          } transition group-hover:scale-105`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const MiniDarkMetric = ({
  label,
  value,
}) => (
  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
      {label}
    </p>

    <p className="mt-2 text-xl font-black text-white">
      {formatNumber(value)}
    </p>
  </div>
);

const DarkSummary = ({
  label,
  value,
  icon,
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-semibold text-gray-500">
        {label}
      </p>

      <span style={{ color: GOLD }}>
        {icon}
      </span>
    </div>

    <p className="mt-2 text-xl font-black">
      {formatNumber(value)}
    </p>
  </div>
);

const ProgressRow = ({
  label,
  value,
  max,
  icon,
}) => {
  const percentage =
    max > 0
      ? Math.min(
          100,
          Math.round((value / max) * 100)
        )
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              backgroundColor:
                "rgba(212,175,55,0.10)",
              color: GOLD,
            }}
          >
            {icon}
          </div>

          <span className="text-sm font-bold text-gray-700">
            {label}
          </span>
        </div>

        <span className="text-sm font-black text-gray-900">
          {formatNumber(value)}
        </span>
      </div>

      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: GOLD,
          }}
        />
      </div>
    </div>
  );
};

const InsightCard = ({
  title,
  value,
  subtitle,
  icon,
  progress,
}) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-gray-500">
          {title}
        </p>

        <p className="mt-2 text-3xl font-black text-gray-950">
          {value}
        </p>
      </div>

      <div
        className="flex h-11 w-11 items-center justify-center rounded-2xl text-black"
        style={{
          backgroundColor: GOLD,
        }}
      >
        {icon}
      </div>
    </div>

    <p className="mt-3 text-xs leading-5 text-gray-500">
      {subtitle}
    </p>

    <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(
            100,
            Math.max(0, progress || 0)
          )}%`,
          backgroundColor: GOLD,
        }}
      />
    </div>
  </div>
);

const QuickAction = ({
  to,
  icon,
  title,
  description,
}) => (
  <Link
    to={to}
    className="group rounded-2xl border border-gray-200 bg-[#FAFAF8] p-5 transition hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:bg-white hover:shadow-md"
  >
    <div className="flex items-start justify-between gap-3">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl text-black transition group-hover:scale-105"
        style={{
          backgroundColor: GOLD,
        }}
      >
        {icon}
      </div>

      <FiArrowUpRight className="text-gray-300 transition group-hover:text-gray-700" />
    </div>

    <h3 className="mt-4 text-sm font-black text-gray-900">
      {title}
    </h3>

    <p className="mt-1 text-xs leading-5 text-gray-500">
      {description}
    </p>
  </Link>
);

const ControlPanel = ({
  title,
  icon,
  links,
}) => (
  <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex items-center gap-3">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl text-black"
        style={{
          backgroundColor: GOLD,
        }}
      >
        {icon}
      </div>

      <h2 className="text-xl font-black text-gray-950">
        {title}
      </h2>
    </div>

    <div className="mt-5 space-y-2">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4 transition hover:bg-white hover:shadow-sm"
        >
          <span className="text-sm font-bold text-gray-700">
            {link.label}
          </span>

          <span className="flex items-center gap-2 text-xs font-black text-gray-500">
            {typeof link.value === "number"
              ? formatNumber(link.value)
              : link.value}

            <FiChevronRight />
          </span>
        </Link>
      ))}
    </div>
  </section>
);

const StatusChip = ({
  icon,
  text,
}) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-gray-300">
    <span style={{ color: GOLD }}>
      {icon}
    </span>
    {text}
  </span>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1600px] animate-pulse space-y-6">
      <div className="h-[330px] rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-96 rounded-[30px] bg-white" />
        <div className="h-96 rounded-[30px] bg-gray-900" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-44 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="h-64 rounded-[30px] bg-white" />

      <div className="grid gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-64 rounded-3xl bg-white"
          />
        ))}
      </div>
    </div>
  </div>
);

const formatNumber = (value) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-IN").format(
    number
  );
};

export default Dashboard;