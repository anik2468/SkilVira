import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import {
  FiFileText,
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiUser,
  FiEye,
  FiMoreVertical,
} from "react-icons/fi";

const Reports = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const { data } = await api.get("/reports");

      setStats({
        total: Number(data?.stats?.total) || 0,
        pending:
          Number(data?.stats?.pending) || 0,
        resolved:
          Number(data?.stats?.resolved) || 0,
      });

      setReports(
        Array.isArray(data?.reports)
          ? data.reports
          : []
      );
    } catch (err) {
      console.error(
        "Load reports error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const normalizedStatus = (report) =>
    String(
      report?.status || "pending"
    ).toLowerCase();

  const filteredReports = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return reports.filter((report) => {
      const userName =
        report?.user?.name
          ?.toLowerCase() || "";

      const userEmail =
        report?.user?.email
          ?.toLowerCase() || "";

      const message =
        report?.message
          ?.toLowerCase() || "";

      const type =
        report?.type
          ?.toLowerCase() || "";

      const status =
        normalizedStatus(report);

      const matchesSearch =
        !query ||
        userName.includes(query) ||
        userEmail.includes(query) ||
        message.includes(query) ||
        type.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    reports,
    search,
    statusFilter,
  ]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiAlertCircle size={13} />
              Platform Support
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Reports Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/60 sm:text-base">
              Monitor reported issues and complaints submitted across the
              SkilVira platform.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadReports(true)
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
              : "Refresh"}
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Reports"
          value={stats.total}
          icon={<FiFileText size={21} />}
        />

        <StatCard
          title="Pending Reports"
          value={stats.pending}
          icon={<FiClock size={21} />}
        />

        <StatCard
          title="Resolved Reports"
          value={stats.resolved}
          icon={
            <FiCheckCircle size={21} />
          }
        />
      </div>

      {/* Reports */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Reports
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review issues reported by platform users.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-80">
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
                  placeholder="Search reports..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
                />
              </div>

              <div className="flex rounded-xl bg-gray-100 p-1">
                <FilterButton
                  active={
                    statusFilter === "all"
                  }
                  onClick={() =>
                    setStatusFilter("all")
                  }
                >
                  All
                </FilterButton>

                <FilterButton
                  active={
                    statusFilter === "pending"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "pending"
                    )
                  }
                >
                  Pending
                </FilterButton>

                <FilterButton
                  active={
                    statusFilter === "resolved"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "resolved"
                    )
                  }
                >
                  Resolved
                </FilterButton>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredReports.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {reports.length}
            </span>{" "}
            reports
          </p>
        </div>

        {loading ? (
          <LoadingState />
        ) : filteredReports.length === 0 ? (
          <EmptyState
            hasSearch={Boolean(
              search.trim()
            )}
            hasFilter={
              statusFilter !== "all"
            }
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Issue
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map(
                    (report) => {
                      const status =
                        normalizedStatus(
                          report
                        );

                      return (
                        <tr
                          key={
                            report?._id
                          }
                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                                <FiUser
                                  size={17}
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-900">
                                  {report?.user
                                    ?.name ||
                                    "N/A"}
                                </p>

                                <p className="mt-1 truncate text-xs text-gray-500">
                                  {report?.user
                                    ?.email ||
                                    "No email"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="max-w-[350px] px-6 py-5">
                            <p className="truncate text-sm font-medium text-gray-700">
                              {report?.message ||
                                "-"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={
                                status
                              }
                            />
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-500">
                            {report?.createdAt
                              ? formatDate(
                                  report.createdAt
                                )
                              : "-"}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedReport(
                                    report
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                              >
                                <FiEye
                                  size={14}
                                />
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredReports.map(
                (report) => {
                  const status =
                    normalizedStatus(
                      report
                    );

                  return (
                    <div
                      key={
                        report?._id
                      }
                      className="p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                          <FiUser
                            size={17}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate font-semibold text-gray-900">
                                {report?.user
                                  ?.name ||
                                  "N/A"}
                              </h3>

                              <p className="mt-1 truncate text-sm text-gray-500">
                                {report?.user
                                  ?.email ||
                                  "No email"}
                              </p>
                            </div>

                            <FiMoreVertical
                              size={18}
                              className="shrink-0 text-gray-300"
                            />
                          </div>

                          <div className="mt-4 rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Reported Issue
                            </p>

                            <p className="mt-1 text-sm leading-6 text-gray-700">
                              {report?.message ||
                                "-"}
                            </p>

                            <div className="mt-3">
                              <StatusBadge
                                status={
                                  status
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedReport(
                            report
                          )
                        }
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700"
                      >
                        <FiEye
                          size={15}
                        />
                        View Report
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </section>

      {/* Details Modal */}
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() =>
            setSelectedReport(null)
          }
        />
      )}
    </div>
  );
};


// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>

        <FiMoreVertical
          size={17}
          className="text-gray-300"
        />
      </div>

      <p className="mt-5 text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
};


// =====================================================
// FILTER BUTTON
// =====================================================

const FilterButton = ({
  active,
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
        active
          ? "bg-white text-[#D4AF37] shadow-sm"
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
};


// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({
  status,
}) => {
  if (status === "resolved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
        <FiCheckCircle size={13} />
        Resolved
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
      <FiClock size={13} />
      Pending
    </span>
  );
};


// =====================================================
// DETAILS MODAL
// =====================================================

const ReportDetailsModal = ({
  report,
  onClose,
}) => {
  const status =
    String(
      report?.status ||
        "pending"
    ).toLowerCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Report Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Platform issue information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem
              label="User"
              value={
                report?.user?.name ||
                "N/A"
              }
              icon={
                <FiUser size={16} />
              }
            />

            <DetailItem
              label="Email"
              value={
                report?.user?.email ||
                "N/A"
              }
              icon={
                <FiFileText
                  size={16}
                />
              }
            />

            <DetailItem
              label="Status"
              value={
                status
                  .charAt(0)
                  .toUpperCase() +
                status.slice(1)
              }
              icon={
                status ===
                "resolved" ? (
                  <FiCheckCircle
                    size={16}
                  />
                ) : (
                  <FiClock
                    size={16}
                  />
                )
              }
            />

            <DetailItem
              label="Report Date"
              value={
                report?.createdAt
                  ? formatDate(
                      report.createdAt
                    )
                  : "-"
              }
              icon={
                <FiClock size={16} />
              }
            />
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Reported Issue
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {report?.message ||
                "No issue description provided."}
            </p>
          </div>

          {report?.type && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Report Type
              </p>

              <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
                {report.type}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// =====================================================
// DETAIL ITEM
// =====================================================

const DetailItem = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-[#D4AF37]">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
};


// =====================================================
// DATE
// =====================================================

const formatDate = (date) => {
  try {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return "-";
  }
};

export default Reports;