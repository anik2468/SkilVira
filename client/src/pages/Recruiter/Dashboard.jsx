import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  FileText,
  PlusCircle,
  Building2,
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowUpRight,
  TrendingUp,
  Eye,
  RefreshCw,
  Sparkles,
  UserCheck,
  CircleDot,
} from "lucide-react";

import { recruiterDashboard } from "../../services/recruiterService";

const GOLD = "#D4AF37";

const statusStyles = {
  Selected: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  Rejected: {
    className: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  Shortlisted: {
    className: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  Interview: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  Pending: {
    className: "border-gray-200 bg-gray-50 text-gray-700",
    dot: "bg-gray-400",
  },
};

const approvalStyles = {
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-red-200 bg-red-50 text-red-700",
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to parse user:", err);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user?.id || user?._id) {
      loadDashboard();
    } else {
      setLoading(false);
      setError("Recruiter session not found.");
    }
  }, [user]);

  const loadDashboard = async (isRefresh = false) => {
    const userId = user?.id || user?._id;

    if (!userId) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await recruiterDashboard(userId);

      setDashboard(res || {});
    } catch (err) {
      console.error("Recruiter dashboard error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load recruiter dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const source = dashboard?.stats || {};

    return [
      {
        title: "Total Internships",
        value: source?.totalInternships ?? 0,
        icon: Briefcase,
        tone: "gold",
        description: "Internship posts",
      },
      {
        title: "Applications",
        value: source?.applications ?? 0,
        icon: FileText,
        tone: "blue",
        description: "Student applications",
      },
      {
        title: "Shortlisted",
        value: source?.shortlisted ?? 0,
        icon: Users,
        tone: "purple",
        description: "Candidates shortlisted",
      },
      {
        title: "Selected",
        value: source?.selected ?? 0,
        icon: CheckCircle2,
        tone: "green",
        description: "Candidates selected",
      },
      {
        title: "Pending Approval",
        value: source?.pendingInternships ?? 0,
        icon: Clock3,
        tone: "amber",
        description: "Posts awaiting review",
      },
      {
        title: "Rejected Posts",
        value: source?.rejectedInternships ?? 0,
        icon: XCircle,
        tone: "red",
        description: "Rejected internships",
      },
    ];
  }, [dashboard]);

  const recentApplications = Array.isArray(
    dashboard?.latestApplications
  )
    ? dashboard.latestApplications
    : [];

  const recentInternships = Array.isArray(
    dashboard?.internships
  )
    ? dashboard.internships.slice(0, 5)
    : [];

  const applicationTotal =
    dashboard?.stats?.applications ?? 0;

  const selectedCount =
    dashboard?.stats?.selected ?? 0;

  const shortlistedCount =
    dashboard?.stats?.shortlisted ?? 0;

  const conversionRate =
    applicationTotal > 0
      ? Math.round(
          (selectedCount / applicationTotal) * 100
        )
      : 0;

  const shortlistRate =
    applicationTotal > 0
      ? Math.round(
          (shortlistedCount / applicationTotal) * 100
        )
      : 0;

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <XCircle size={26} />
          </div>

          <h2 className="mt-5 text-2xl font-black text-gray-950">
            Recruiter Session Missing
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Please login again to access your recruiter dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[30px] bg-black px-6 py-7 text-white shadow-2xl sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

          <div className="relative flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Sparkles
                  size={14}
                  style={{ color: GOLD }}
                />

                <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                  Recruiter Command Center
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Welcome back
                {user?.name
                  ? `, ${user.name.split(" ")[0]}`
                  : ""}
                .
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Track your hiring pipeline, manage internships and
                review student applications from one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/recruiter/internships/create"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black shadow-lg transition hover:opacity-95"
                  style={{ backgroundColor: GOLD }}
                >
                  <PlusCircle size={18} />
                  Post Internship
                </Link>

                <Link
                  to="/recruiter/applications"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <FileText size={18} />
                  Review Applications
                </Link>

                <button
                  onClick={() => loadDashboard(true)}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-200 transition hover:bg-white/10 disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={
                      refreshing ? "animate-spin" : ""
                    }
                  />
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid w-full max-w-md grid-cols-2 gap-3">
              <HeroMetric
                label="Applications"
                value={applicationTotal}
                icon={<FileText size={18} />}
              />

              <HeroMetric
                label="Selected"
                value={selectedCount}
                icon={<UserCheck size={18} />}
              />

              <HeroMetric
                label="Shortlisted"
                value={shortlistedCount}
                icon={<Users size={18} />}
              />

              <HeroMetric
                label="Selection Rate"
                value={`${conversionRate}%`}
                icon={<TrendingUp size={18} />}
              />
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>

            <button
              onClick={() => loadDashboard(true)}
              className="w-fit rounded-xl bg-white px-4 py-2 text-xs font-black text-red-700 shadow-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stats */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Performance Overview
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Your hiring dashboard
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((item) => (
              <StatCard
                key={item.title}
                item={item}
              />
            ))}
          </div>
        </section>

        {/* Pipeline + Quick actions */}
        <section className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Hiring Pipeline
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Candidate progress
                </h2>
              </div>

              <span className="text-xs font-semibold text-gray-400">
                Based on available dashboard data
              </span>
            </div>

            <div className="mt-7 space-y-6">
              <PipelineBar
                label="Applications"
                value={applicationTotal}
                total={Math.max(applicationTotal, 1)}
                percentage={100}
                tone="gray"
              />

              <PipelineBar
                label="Shortlisted"
                value={shortlistedCount}
                total={Math.max(applicationTotal, 1)}
                percentage={shortlistRate}
                tone="blue"
              />

              <PipelineBar
                label="Selected"
                value={selectedCount}
                total={Math.max(applicationTotal, 1)}
                percentage={conversionRate}
                tone="gold"
              />
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <MiniMetric
                label="Applications"
                value={applicationTotal}
              />

              <MiniMetric
                label="Shortlisted"
                value={shortlistedCount}
              />

              <MiniMetric
                label="Selected"
                value={selectedCount}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-black p-6 text-white shadow-xl sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Quick Actions
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Get things done
                </h2>
              </div>

              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-black"
                style={{ backgroundColor: GOLD }}
              >
                <ArrowUpRight size={21} />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <QuickAction
                to="/recruiter/internships/create"
                icon={<PlusCircle size={19} />}
                title="Post Internship"
                description="Create a new internship opening"
              />

              <QuickAction
                to="/recruiter/applications"
                icon={<FileText size={19} />}
                title="Review Applications"
                description="Manage student candidates"
              />

              <QuickAction
                to="/recruiter/internships"
                icon={<Briefcase size={19} />}
                title="Manage Internships"
                description="Edit and monitor your posts"
              />

              <QuickAction
                to="/recruiter/company"
                icon={<Building2 size={19} />}
                title="Company Profile"
                description="Keep company information updated"
              />

              <QuickAction
                to="/recruiter/students"
                icon={<Users size={19} />}
                title="Browse Students"
                description="Explore available student talent"
              />
            </div>
          </div>
        </section>

        {/* Recent Applications */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Candidate Activity
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Recent Applications
              </h2>
            </div>

            <Link
              to="/recruiter/applications"
              className="inline-flex items-center gap-1 text-sm font-black text-gray-700 hover:text-black"
            >
              View all
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <EmptyState
              icon={<FileText size={28} />}
              title="No Applications Yet"
              description="Student applications will appear here when candidates apply to your internships."
              actionLabel="Manage Applications"
              actionTo="/recruiter/applications"
            />
          ) : (
            <div className="mt-6 space-y-3">
              {recentApplications.map((item) => (
                <ApplicationItem
                  key={item?._id}
                  item={item}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Internships */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Internship Portfolio
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Recent Internships
              </h2>
            </div>

            <Link
              to="/recruiter/internships"
              className="inline-flex items-center gap-1 text-sm font-black text-gray-700 hover:text-black"
            >
              Manage all
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {recentInternships.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={28} />}
              title="No Internships Posted"
              description="Create your first internship to start attracting student applications."
              actionLabel="Post Internship"
              actionTo="/recruiter/internships/create"
            />
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {recentInternships.map((item) => (
                <InternshipItem
                  key={item?._id}
                  item={item}
                />
              ))}
            </div>
          )}
        </section>

        {/* Footer snapshot */}
        <section className="grid gap-4 md:grid-cols-3">
          <SnapshotCard
            icon={<Eye size={19} />}
            title="Profile Visibility"
            value={
              dashboard?.profileCompleted
                ? "Completed"
                : "Needs Update"
            }
            description="Keep your recruiter profile current."
            to="/recruiter/profile"
          />

          <SnapshotCard
            icon={<Building2 size={19} />}
            title="Company Presence"
            value={
              dashboard?.companyProfileCompleted
                ? "Verified"
                : "Review Profile"
            }
            description="Maintain an accurate company profile."
            to="/recruiter/company"
          />

          <SnapshotCard
            icon={<CircleDot size={19} />}
            title="Pending Reviews"
            value={
              dashboard?.stats?.pendingInternships ?? 0
            }
            description="Internship posts awaiting approval."
            to="/recruiter/internships"
          />
        </section>
      </div>
    </div>
  );
};

const HeroMetric = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-gray-400">
          {label}
        </span>

        <span style={{ color: GOLD }}>
          {icon}
        </span>
      </div>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>
    </div>
  );
};

const StatCard = ({
  item,
}) => {
  const Icon = item.icon;

  const tones = {
    gold: {
      icon: "bg-[#D4AF37]/10 text-[#8D7414]",
      border: "hover:border-[#D4AF37]/40",
    },
    blue: {
      icon: "bg-blue-50 text-blue-600",
      border: "hover:border-blue-200",
    },
    purple: {
      icon: "bg-purple-50 text-purple-600",
      border: "hover:border-purple-200",
    },
    green: {
      icon: "bg-emerald-50 text-emerald-600",
      border: "hover:border-emerald-200",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600",
      border: "hover:border-amber-200",
    },
    red: {
      icon: "bg-red-50 text-red-600",
      border: "hover:border-red-200",
    },
  };

  const tone = tones[item.tone] || tones.gold;

  return (
    <div
      className={`rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${tone.border}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {item.title}
          </p>

          <h3 className="mt-3 text-3xl font-black tracking-tight text-gray-950">
            {item.value}
          </h3>

          <p className="mt-1 text-xs font-medium text-gray-400">
            {item.description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone.icon}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
};

const PipelineBar = ({
  label,
  value,
  percentage,
  tone,
}) => {
  const barColors = {
    gray: "bg-gray-500",
    blue: "bg-blue-500",
    gold: "bg-[#D4AF37]",
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="text-sm font-bold text-gray-800">
            {label}
          </span>

          <span className="ml-2 text-xs font-semibold text-gray-400">
            {value}
          </span>
        </div>

        <span className="text-xs font-black text-gray-600">
          {percentage}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all ${barColors[tone]}`}
          style={{
            width: `${Math.min(
              100,
              Math.max(0, percentage)
            )}%`,
          }}
        />
      </div>
    </div>
  );
};

const MiniMetric = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
      <p className="text-xs font-semibold text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-gray-900">
        {value}
      </p>
    </div>
  );
};

const QuickAction = ({
  to,
  icon,
  title,
  description,
}) => {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 transition hover:border-white/20 hover:bg-white/10"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-black"
        style={{ backgroundColor: GOLD }}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-white">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-gray-400">
          {description}
        </p>
      </div>

      <ArrowUpRight
        size={17}
        className="shrink-0 text-gray-500 transition group-hover:text-white"
      />
    </Link>
  );
};

const ApplicationItem = ({
  item,
}) => {
  const status =
    statusStyles[item?.status] ||
    statusStyles.Pending;

  const studentName =
    item?.student?.name ||
    item?.student?.fullName ||
    "Student";

  const internshipTitle =
    item?.internship?.title ||
    item?.internship?.name ||
    "Internship";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-[#FCFCFA] p-4 transition hover:border-gray-200 hover:bg-white sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-black"
          style={{ backgroundColor: GOLD }}
        >
          {getInitials(studentName)}
        </div>

        <div className="min-w-0">
          <p className="truncate font-black text-gray-900">
            {studentName}
          </p>

          <p className="mt-1 truncate text-sm text-gray-500">
            {internshipTitle}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-400">
            Application ID
          </p>

          <p className="mt-1 max-w-[160px] truncate text-xs font-bold text-gray-700">
            {item?._id || "—"}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${status.dot}`}
          />
          {item?.status || "Pending"}
        </span>
      </div>
    </div>
  );
};

const InternshipItem = ({
  item,
}) => {
  const approval =
    item?.approvalStatus || "Pending";

  return (
    <div className="rounded-2xl border border-gray-100 bg-[#FCFCFA] p-5 transition hover:border-gray-200 hover:bg-white hover:shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-lg font-black text-gray-900">
            {item?.title || "Untitled Internship"}
          </p>

          <p className="mt-1 text-sm font-medium text-gray-500">
            {item?.company || "Company"}
          </p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${
            approvalStyles[approval] ||
            approvalStyles.Pending
          }`}
        >
          {approval}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <InfoBox
          label="Type"
          value={item?.type || "Internship"}
        />

        <InfoBox
          label="Applications"
          value={
            item?.applicationCount ??
            item?.applications?.length ??
            0
          }
        />
      </div>
    </div>
  );
};

const SnapshotCard = ({
  icon,
  title,
  value,
  description,
  to,
}) => {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-black"
          style={{ backgroundColor: GOLD }}
        >
          {icon}
        </div>

        <ArrowUpRight
          size={18}
          className="text-gray-300 transition group-hover:text-gray-800"
        />
      </div>

      <p className="mt-5 text-sm font-semibold text-gray-500">
        {title}
      </p>

      <h3 className="mt-1 text-xl font-black text-gray-950">
        {value}
      </h3>

      <p className="mt-1 text-xs leading-5 text-gray-400">
        {description}
      </p>
    </Link>
  );
};

const InfoBox = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black text-gray-800">
        {value}
      </p>
    </div>
  );
};

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
}) => {
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-12 text-center">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-black"
        style={{ backgroundColor: GOLD }}
      >
        {icon}
      </div>

      <h3 className="mt-4 text-xl font-black text-gray-950">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {description}
      </p>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-black"
          style={{ backgroundColor: GOLD }}
        >
          {actionLabel}
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
};

const getInitials = (
  name = ""
) => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "ST";

  return words
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase()
    )
    .join("");
};

const DashboardSkeleton = () => {
  return (
    <div className="min-h-[80vh] bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="rounded-[30px] bg-gray-800 p-10">
          <div className="h-5 w-40 rounded bg-gray-700" />
          <div className="mt-5 h-12 max-w-xl rounded bg-gray-700" />
          <div className="mt-3 h-5 max-w-2xl rounded bg-gray-700" />
          <div className="mt-6 h-11 w-44 rounded-xl bg-gray-700" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-36 rounded-3xl bg-white"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 rounded-3xl bg-white" />
          <div className="h-80 rounded-3xl bg-white" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;