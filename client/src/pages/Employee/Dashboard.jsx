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
  FiCreditCard,
  FiFileText,
  FiAward,
} from "react-icons/fi";

const Dashboard = () => {
  const [stats, setStats] = useState({
    profileCompleted: 0,

    pendingRecruiters: 0,
    pendingAmbassadors: 0,
    pendingInternships: 0,

    totalUsers: 0,
    totalCompanies: 0,

    pendingPayments: 0,
    pendingOfferLetters: 0,
    pendingCertificates: 0,
    pendingReports: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [failedQueues, setFailedQueues] =
    useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

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
      setFailedQueues([]);

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

      // ---------------------------------------------------
      // Base employee dashboard
      // ---------------------------------------------------

      const dashboardPromise =
        api.get(
          `/employee/dashboard/${userId}`
        );

      // ---------------------------------------------------
      // Operational queues
      // ---------------------------------------------------

      const paymentsPromise =
        api.get("/payments/pending");

      const offerLettersPromise =
        api.get(
          "/generated-offer-letter/pending"
        );

      const certificatesPromise =
        api.get(
          "/generated-certificates/pending"
        );

      const reportsPromise =
        api.get(
          "/generated-report/pending"
        );

      const results =
        await Promise.allSettled([
          dashboardPromise,
          paymentsPromise,
          offerLettersPromise,
          certificatesPromise,
          reportsPromise,
        ]);

      // ---------------------------------------------------
      // Base dashboard result
      // ---------------------------------------------------

      const dashboardResult =
        results[0];

      if (
        dashboardResult.status ===
        "rejected"
      ) {
        throw dashboardResult.reason;
      }

      const dashboardData =
        dashboardResult.value?.data ||
        {};

      // ---------------------------------------------------
      // Existing stats
      // ---------------------------------------------------

      const nextStats = {
        profileCompleted:
          Number(
            dashboardData?.stats
              ?.profileCompleted
          ) || 0,

        pendingRecruiters:
          Number(
            dashboardData?.stats
              ?.pendingRecruiters
          ) || 0,

        pendingAmbassadors:
          Number(
            dashboardData?.stats
              ?.pendingAmbassadors
          ) || 0,

        pendingInternships:
          Number(
            dashboardData?.stats
              ?.pendingInternships
          ) || 0,

        totalUsers:
          Number(
            dashboardData?.stats
              ?.totalUsers
          ) || 0,

        totalCompanies:
          Number(
            dashboardData?.stats
              ?.totalCompanies
          ) || 0,

        pendingPayments: 0,
        pendingOfferLetters: 0,
        pendingCertificates: 0,
        pendingReports: 0,
      };

      const queueFailures = [];

      // ---------------------------------------------------
      // Payments
      // ---------------------------------------------------

      if (
        results[1].status ===
        "fulfilled"
      ) {
        const data =
          results[1].value?.data;

        nextStats.pendingPayments =
          Number(
            data?.count
          ) ||
          (
            Array.isArray(
              data?.payments
            )
              ? data.payments.length
              : 0
          );
      } else {
        queueFailures.push(
          "Payment verification"
        );
      }

      // ---------------------------------------------------
      // Offer letters
      // ---------------------------------------------------

      if (
        results[2].status ===
        "fulfilled"
      ) {
        const data =
          results[2].value?.data;

        nextStats.pendingOfferLetters =
          Number(
            data?.count
          ) ||
          (
            Array.isArray(
              data?.offerLetters
            )
              ? data.offerLetters.length
              : 0
          );
      } else {
        queueFailures.push(
          "Offer letter verification"
        );
      }

      // ---------------------------------------------------
      // Certificates
      // ---------------------------------------------------

      if (
        results[3].status ===
        "fulfilled"
      ) {
        const data =
          results[3].value?.data;

        nextStats.pendingCertificates =
          Number(
            data?.count
          ) ||
          (
            Array.isArray(
              data?.certificates
            )
              ? data.certificates.length
              : 0
          );
      } else {
        queueFailures.push(
          "Certificate verification"
        );
      }

      // ---------------------------------------------------
      // Reports
      // ---------------------------------------------------

      if (
        results[4].status ===
        "fulfilled"
      ) {
        const data =
          results[4].value?.data;

        nextStats.pendingReports =
          Number(
            data?.count
          ) ||
          (
            Array.isArray(
              data?.reports
            )
              ? data.reports.length
              : 0
          );
      } else {
        queueFailures.push(
          "Report verification"
        );
      }

      setStats(nextStats);
      setFailedQueues(
        queueFailures
      );

      if (
        queueFailures.length > 0
      ) {
        setError(
          "Some operational queues could not be loaded. Showing available data."
        );
      }
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

  // =====================================================
  // OPERATIONAL CARDS
  // =====================================================

  const operationalCards = [
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      description:
        "Manual payments waiting for verification",
      icon: <FiCreditCard size={22} />,
      path:
        "/employee/payment-verification",
      urgent:
        stats.pendingPayments > 0,
    },

    {
      title: "Offer Letters",
      value: stats.pendingOfferLetters,
      description:
        "Offer letters waiting for review",
      icon: <FiFileText size={22} />,
      path:
        "/employee/offer-letters/verification",
      urgent:
        stats.pendingOfferLetters > 0,
    },

    {
      title: "Certificates",
      value: stats.pendingCertificates,
      description:
        "Certificates waiting for verification",
      icon: <FiAward size={22} />,
      path:
        "/employee/certificates/verification",
      urgent:
        stats.pendingCertificates > 0,
    },

    {
      title: "Reports",
      value: stats.pendingReports,
      description:
        "Generated reports waiting for review",
      icon: <FiFileText size={22} />,
      path:
        "/employee/reports/verification",
      urgent:
        stats.pendingReports > 0,
    },

    {
      title: "Pending Recruiters",
      value: stats.pendingRecruiters,
      description:
        "Recruiter approvals waiting",
      icon: <FiUsers size={22} />,
      path: "/employee/recruiters",
      urgent:
        stats.pendingRecruiters > 0,
    },

    {
      title: "Pending Ambassadors",
      value: stats.pendingAmbassadors,
      description:
        "Ambassador reviews waiting",
      icon: <FiUser size={22} />,
      path: "/employee/ambassadors",
      urgent:
        stats.pendingAmbassadors > 0,
    },

    {
      title: "Pending Internships",
      value: stats.pendingInternships,
      description:
        "Internships awaiting review",
      icon: <FiBriefcase size={22} />,
      path: "/employee/internships",
      urgent:
        stats.pendingInternships > 0,
    },

    {
      title: "Profile Completion",
      value: `${stats.profileCompleted}%`,
      description:
        "Your employee profile",
      icon: <FiCheckCircle size={22} />,
      path: "/employee/profile",
      urgent: false,
      percentage: true,
    },
  ];

  // =====================================================
  // TOTAL QUEUE
  // =====================================================

  const totalPending =
    stats.pendingPayments +
    stats.pendingOfferLetters +
    stats.pendingCertificates +
    stats.pendingReports +
    stats.pendingRecruiters +
    stats.pendingAmbassadors +
    stats.pendingInternships;

  const verificationQueue = [
    {
      label: "Payment Verification",
      value: stats.pendingPayments,
      icon: <FiCreditCard size={17} />,
      link:
        "/employee/payment-verification",
    },

    {
      label: "Offer Letter Verification",
      value:
        stats.pendingOfferLetters,
      icon: <FiFileText size={17} />,
      link:
        "/employee/offer-letters/verification",
    },

    {
      label: "Certificate Verification",
      value:
        stats.pendingCertificates,
      icon: <FiAward size={17} />,
      link:
        "/employee/certificates/verification",
    },

    {
      label: "Report Verification",
      value: stats.pendingReports,
      icon: <FiFileText size={17} />,
      link:
        "/employee/reports/verification",
    },

    {
      label: "Recruiter Approvals",
      value: stats.pendingRecruiters,
      icon: <FiUsers size={17} />,
      link: "/employee/recruiters",
    },

    {
      label: "Ambassador Reviews",
      value: stats.pendingAmbassadors,
      icon: <FiUser size={17} />,
      link: "/employee/ambassadors",
    },

    {
      label: "Internship Reviews",
      value: stats.pendingInternships,
      icon: <FiBriefcase size={17} />,
      link: "/employee/internships",
    },
  ];

  // =====================================================
  // LOADING
  // =====================================================

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

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="space-y-6 pb-10">
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8 lg:p-10">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#D4AF37]/10 blur-2xl" />

        <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiShield size={13} />
              SkilVira Operations
            </div>

            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Employee
              <span className="text-[#D4AF37]">
                {" "}
                Dashboard
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Manage payments, offer letters,
              certificates, reports and other
              operational requests from one place.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
              <FiActivity
                className="text-[#D4AF37]"
                size={17}
              />

              <span className="text-sm font-semibold text-white/80">
                {totalPending} pending
                operational items
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              loadDashboard(true)
            }
            disabled={refreshing}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* ================================================= */}
      {/* ERRORS */}
      {/* ================================================= */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <FiAlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              {error}
            </p>

            {failedQueues.length > 0 && (
              <p className="mt-1 text-xs text-amber-700">
                Not loaded:{" "}
                {failedQueues.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* PRIMARY VERIFICATION QUEUE */}
      {/* ================================================= */}

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Verification Queue
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Items that directly require employee
              review or verification.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-bold text-[#9b7a0c]">
            {totalPending} Pending
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {operationalCards.map(
            (card) => (
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

                  {card.urgent && (
                    <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-amber-600">
                      <FiClock
                        size={12}
                      />
                      Action needed
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  {card.description}
                </p>
              </Link>
            )
          )}
        </div>
      </section>

      {/* ================================================= */}
      {/* PLATFORM SNAPSHOT */}
      {/* ================================================= */}

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
              Current platform scale visible to
              the operations team.
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
            icon={<FiCreditCard size={20} />}
            label="Pending Payments"
            value={stats.pendingPayments}
          />

          <SnapshotCard
            icon={<FiAward size={20} />}
            label="Pending Certificates"
            value={
              stats.pendingCertificates
            }
          />
        </div>
      </section>

      {/* ================================================= */}
      {/* WORKLOAD + QUICK ACTIONS */}
      {/* ================================================= */}

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Workload */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6 xl:col-span-3">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Review Workload
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current pending items by operational
              category.
            </p>
          </div>

          <div className="space-y-5">
            {verificationQueue.map(
              (item) => (
                <WorkloadRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  maxValue={Math.max(
                    ...verificationQueue.map(
                      (queue) =>
                        Number(
                          queue.value
                        ) || 0
                    ),
                    1
                  )}
                  icon={item.icon}
                  link={item.link}
                />
              )
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6 xl:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Jump directly to the operational queues.
            </p>
          </div>

          <div className="space-y-3">
            <QuickAction
              to="/employee/payment-verification"
              icon={
                <FiCreditCard
                  size={19}
                />
              }
              title="Verify Payments"
              value={
                stats.pendingPayments
              }
            />

            <QuickAction
              to="/employee/offer-letters/verification"
              icon={
                <FiFileText
                  size={19}
                />
              }
              title="Review Offer Letters"
              value={
                stats.pendingOfferLetters
              }
            />

            <QuickAction
              to="/employee/certificates/verification"
              icon={
                <FiAward size={19} />
              }
              title="Verify Certificates"
              value={
                stats.pendingCertificates
              }
            />

            <QuickAction
              to="/employee/reports/verification"
              icon={
                <FiFileText
                  size={19}
                />
              }
              title="Verify Reports"
              value={
                stats.pendingReports
              }
            />
          </div>
        </section>
      </div>

      {/* ================================================= */}
      {/* PROFILE + CORE APPROVALS */}
      {/* ================================================= */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Existing approvals */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Platform Approvals
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Existing employee approval responsibilities.
            </p>
          </div>

          <div className="space-y-3">
            <ApprovalLink
              to="/employee/recruiters"
              icon={<FiUsers />}
              title="Recruiter Approvals"
              value={
                stats.pendingRecruiters
              }
            />

            <ApprovalLink
              to="/employee/ambassadors"
              icon={<FiUser />}
              title="Ambassador Reviews"
              value={
                stats.pendingAmbassadors
              }
            />

            <ApprovalLink
              to="/employee/internships"
              icon={<FiBriefcase />}
              title="Internship Reviews"
              value={
                stats.pendingInternships
              }
            />
          </div>
        </section>

        {/* Profile */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Employee Profile
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep your employee information up to date.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiUser size={21} />
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">
                Profile completion
              </span>

              <span className="text-sm font-bold text-gray-900">
                {stats.profileCompleted}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      stats.profileCompleted
                    )
                  )}%`,
                }}
              />
            </div>
          </div>

          <Link
            to="/employee/profile"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Open Profile
            <FiArrowUpRight size={17} />
          </Link>
        </section>
      </div>

      {/* ================================================= */}
      {/* BOTTOM NOTE */}
      {/* ================================================= */}

      <section className="overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] text-white">
            <FiTrendingUp size={23} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Operations Center
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Payment approval activates the student
              workflow. Offer letters, certificates and
              reports remain in their respective
              verification queues until reviewed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// =====================================================
// SNAPSHOT CARD
// =====================================================

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

// =====================================================
// WORKLOAD ROW
// =====================================================

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

// =====================================================
// QUICK ACTION
// =====================================================

const QuickAction = ({
  to,
  icon,
  title,
  value,
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
        <span className="rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-xs font-bold text-[#D4AF37]">
          {value}
        </span>

        <FiArrowUpRight
          size={17}
          className="text-gray-300 transition group-hover:text-[#D4AF37]"
        />
      </div>
    </Link>
  );
};

// =====================================================
// APPROVAL LINK
// =====================================================

const ApprovalLink = ({
  to,
  icon,
  title,
  value,
}) => {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-4 transition hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>

        <span className="truncate text-sm font-semibold text-gray-800">
          {title}
        </span>
      </div>

      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
        {value}
      </span>
    </Link>
  );
};

export default Dashboard;