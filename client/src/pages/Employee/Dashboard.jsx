import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

import {
  FiUsers,
  FiBriefcase,
  FiCheckCircle,
  FiUser,
  FiRefreshCw,
  FiTrendingUp,
  FiArrowUpRight,
  FiClock,
  FiActivity,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";

const Dashboard = () => {
  const [stats, setStats] = useState({
    profileCompleted: 0,
    pendingRecruiters: 0,
    pendingAmbassadors: 0,
    pendingInternships: 0,
    totalUsers: 0,
    totalCompanies: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        throw new Error(
          "Employee session not found."
        );
      }

      const user =
        JSON.parse(storedUser);

      const userId =
        user?.id || user?._id;

      if (!userId) {
        throw new Error(
          "Employee ID not found."
        );
      }

      const response =
        await api.get(
          `/employee/dashboard/${userId}`
        );

      const data =
        response?.data || {};

      setStats({
        profileCompleted:
          Number(
            data?.stats?.profileCompleted
          ) || 0,

        pendingRecruiters:
          Number(
            data?.stats?.pendingRecruiters
          ) || 0,

        pendingAmbassadors:
          Number(
            data?.stats?.pendingAmbassadors
          ) || 0,

        pendingInternships:
          Number(
            data?.stats?.pendingInternships
          ) || 0,

        totalUsers:
          Number(
            data?.stats?.totalUsers
          ) || 0,

        totalCompanies:
          Number(
            data?.stats?.totalCompanies
          ) || 0,
      });
    } catch (err) {
      console.error(
        "Employee dashboard error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load employee dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const cards = [
    {
      title: "Pending Recruiters",
      value: stats.pendingRecruiters,
      description:
        "Recruiter approvals waiting",
      icon: <FiUsers size={22} />,
      path: "/employee/recruiters",
    },
    {
      title: "Pending Ambassadors",
      value: stats.pendingAmbassadors,
      description:
        "Ambassador reviews waiting",
      icon: <FiUser size={22} />,
      path: "/employee/ambassadors",
    },
    {
      title: "Pending Internships",
      value: stats.pendingInternships,
      description:
        "Internships awaiting review",
      icon: <FiBriefcase size={22} />,
      path: "/employee/internships",
    },
    {
      title: "Profile Completion",
      value: `${stats.profileCompleted}%`,
      description:
        "Your employee profile",
      icon: <FiCheckCircle size={22} />,
      path: "/employee/profile",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 animate-spin items-center justify-center rounded-2xl border-4 border-gray-200 border-t-[#D4AF37]">
            <FiRefreshCw
              size={21}
              className="text-[#D4AF37]"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Loading Employee Dashboard...
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Fetching the latest operational data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8 lg:p-10">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#D4AF37]/10 blur-2xl" />

        <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiShield size={13} />
              SkilVira Operations
            </div>

            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Employee
              <span className="text-[#D4AF37]">
                {" "}Dashboard
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
              Monitor platform operations, review pending requests and keep SkilVira running smoothly.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadDashboard(true)
            }
            disabled={refreshing}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh Data"}
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiAlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />
          <span>{error}</span>
        </div>
      )}

      {/* Action Cards */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Operational Queue
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Items currently requiring employee attention.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.path}
              className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  {card.icon}
                </div>

                <FiArrowUpRight
                  size={18}
                  className="text-gray-300 transition group-hover:text-[#D4AF37]"
                />
              </div>

              <p className="mt-5 text-sm font-semibold text-gray-500">
                {card.title}
              </p>

              <div className="mt-1 flex items-end gap-2">
                <h3 className="text-3xl font-bold text-gray-900">
                  {card.value}
                </h3>

                {card.title !==
                  "Profile Completion" &&
                  Number(card.value) > 0 && (
                    <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-amber-600">
                      <FiClock size={12} />
                      Action needed
                    </span>
                  )}
              </div>

              <p className="mt-2 text-xs text-gray-400">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Platform Snapshot */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiActivity size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Platform Snapshot
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current platform scale visible to the operations team.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotCard
            icon={<FiUsers size={20} />}
            label="Total Users"
            value={stats.totalUsers}
          />

          <SnapshotCard
            icon={<FiBriefcase size={20} />}
            label="Total Companies"
            value={stats.totalCompanies}
          />

          <SnapshotCard
            icon={<FiBriefcase size={20} />}
            label="Pending Internships"
            value={stats.pendingInternships}
          />

          <SnapshotCard
            icon={<FiUser size={20} />}
            label="Pending Ambassadors"
            value={stats.pendingAmbassadors}
          />
        </div>
      </section>

      {/* Workload + Quick Actions */}
      <div className="grid gap-6 xl:grid-cols-5">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6 xl:col-span-3">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Review Workload
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current pending items by operational category.
            </p>
          </div>

          <div className="space-y-5">
            <WorkloadRow
              label="Recruiter Approvals"
              value={stats.pendingRecruiters}
              maxValue={Math.max(
                stats.pendingRecruiters,
                stats.pendingAmbassadors,
                stats.pendingInternships,
                1
              )}
              icon={<FiUsers size={17} />}
              link="/employee/recruiters"
            />

            <WorkloadRow
              label="Ambassador Reviews"
              value={stats.pendingAmbassadors}
              maxValue={Math.max(
                stats.pendingRecruiters,
                stats.pendingAmbassadors,
                stats.pendingInternships,
                1
              )}
              icon={<FiUser size={17} />}
              link="/employee/ambassadors"
            />

            <WorkloadRow
              label="Internship Reviews"
              value={stats.pendingInternships}
              maxValue={Math.max(
                stats.pendingRecruiters,
                stats.pendingAmbassadors,
                stats.pendingInternships,
                1
              )}
              icon={<FiBriefcase size={17} />}
              link="/employee/internships"
            />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6 xl:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Jump to the areas that need attention.
            </p>
          </div>

          <div className="space-y-3">
            <QuickAction
              to="/employee/recruiters"
              icon={<FiUsers size={19} />}
              title="Review Recruiters"
              value={stats.pendingRecruiters}
            />

            <QuickAction
              to="/employee/internships"
              icon={<FiBriefcase size={19} />}
              title="Review Internships"
              value={stats.pendingInternships}
            />

            <QuickAction
              to="/employee/ambassadors"
              icon={<FiUser size={19} />}
              title="Manage Ambassadors"
              value={stats.pendingAmbassadors}
            />

            <QuickAction
              to="/employee/profile"
              icon={<FiCheckCircle size={19} />}
              title="Open My Profile"
              value={`${stats.profileCompleted}%`}
              hideBadge
            />
          </div>
        </section>
      </div>

      {/* Bottom Insight */}
      <section className="overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] text-black">
            <FiTrendingUp size={23} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Keep SkilVira moving
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Review pending requests regularly and maintain accurate, trustworthy platform operations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const SnapshotCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#D4AF37] shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-gray-500">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

const WorkloadRow = ({
  label,
  value,
  maxValue,
  icon,
  link,
}) => {
  const percentage =
    maxValue > 0
      ? Math.min(
          100,
          (Number(value) /
            Number(maxValue)) *
            100
        )
      : 0;

  return (
    <Link
      to={link}
      className="group block rounded-xl border border-gray-100 p-4 transition hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
            {icon}
          </div>

          <span className="truncate text-sm font-semibold text-gray-800">
            {label}
          </span>
        </div>

        <span className="text-sm font-bold text-gray-900">
          {value}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </Link>
  );
};

const QuickAction = ({
  to,
  icon,
  title,
  value,
  hideBadge = false,
}) => {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#D4AF37] shadow-sm">
          {icon}
        </div>

        <span className="truncate text-sm font-semibold text-gray-800">
          {title}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {!hideBadge && (
          <span className="rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-xs font-bold text-[#D4AF37]">
            {value}
          </span>
        )}

        {hideBadge && (
          <span className="text-sm font-bold text-[#D4AF37]">
            {value}
          </span>
        )}

        <FiArrowUpRight
          size={17}
          className="text-gray-300 transition group-hover:text-[#D4AF37]"
        />
      </div>
    </Link>
  );
};

export default Dashboard;