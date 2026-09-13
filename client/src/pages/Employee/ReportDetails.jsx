import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiFileText,
  FiUser,
  FiMail,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";

import api from "../../services/api";

const ReportDetails = () => {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    if (!id) {
      setError("Report ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/reports/${id}`
      );

      const data = response?.data || {};

      setReport(
        data?.report ||
          data?.data ||
          data
      );
    } catch (err) {
      console.error(
        "Load report details error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load report details."
      );
    } finally {
      setLoading(false);
    }
  };

  const status = String(
    report?.status || "pending"
  ).toLowerCase();

  const isResolved =
    status === "resolved";

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 animate-spin items-center justify-center rounded-2xl border-4 border-gray-200 border-t-[#D4AF37]">
            <FiRefreshCw
              size={18}
              className="text-[#D4AF37]"
            />
          </div>

          <p className="mt-4 font-semibold text-gray-900">
            Loading Report...
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Fetching report details.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pb-10">
        <Link
          to="/employee/reports"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#D4AF37]"
        >
          <FiArrowLeft size={16} />
          Back to Reports
        </Link>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <FiAlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <h2 className="font-bold text-red-800">
                Unable to load report
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={loadReport}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <FiRefreshCw size={15} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6 pb-10">
        <Link
          to="/employee/reports"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#D4AF37]"
        >
          <FiArrowLeft size={16} />
          Back to Reports
        </Link>

        <div className="flex min-h-[350px] items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <FiFileText size={25} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-900">
              Report not found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              The requested report could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10">
          <Link
            to="/employee/reports"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
          >
            <FiArrowLeft size={16} />
            Back to Reports
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
                <FiShield size={13} />
                Platform Support
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Report Details
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
                Review the complete information associated with this
                platform report.
              </p>
            </div>

            <StatusBadge
              status={status}
              dark
            />
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report content */}
        <section className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <FiFileText size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Reported Issue
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Details submitted by the platform user.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 sm:p-6">
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700 sm:text-base">
                  {report?.message ||
                    "No issue description was provided."}
                </p>
              </div>

              {report?.type && (
                <div className="mt-5 rounded-xl border border-gray-100 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Report Type
                  </p>

                  <p className="mt-1 text-sm font-semibold capitalize text-gray-900">
                    {report.type}
                  </p>
                </div>
              )}

              {report?.description &&
                report.description !==
                  report.message && (
                  <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Additional Description
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                      {report.description}
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Resolution */}
          {(report?.resolution ||
            report?.resolvedAt ||
            report?.resolvedBy) && (
            <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <FiCheckCircle size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Resolution
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Resolution information for this report.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {report?.resolution && (
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {report.resolution}
                  </p>
                )}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {report?.resolvedAt && (
                    <DetailItem
                      label="Resolved At"
                      value={formatDateTime(
                        report.resolvedAt
                      )}
                      icon={
                        <FiClock size={16} />
                      }
                    />
                  )}

                  {report?.resolvedBy && (
                    <DetailItem
                      label="Resolved By"
                      value={
                        typeof report.resolvedBy ===
                        "object"
                          ? report.resolvedBy?.name ||
                            report.resolvedBy?.email ||
                            "Employee"
                          : String(
                              report.resolvedBy
                            )
                      }
                      icon={
                        <FiUser size={16} />
                      }
                    />
                  )}
                </div>
              </div>
            </section>
          )}
        </section>

        {/* Side information */}
        <aside className="space-y-6">
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-100 px-5 py-5">
              <h2 className="text-lg font-bold text-gray-900">
                Reporter
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                User who submitted this report.
              </p>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                  <FiUser size={19} />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {report?.user?.name ||
                      "N/A"}
                  </p>

                  <p className="mt-1 flex items-center gap-1 break-all text-xs text-gray-500">
                    <FiMail size={12} />
                    {report?.user?.email ||
                      "No email"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-100 px-5 py-5">
              <h2 className="text-lg font-bold text-gray-900">
                Report Information
              </h2>
            </div>

            <div className="space-y-3 p-5">
              <DetailItem
                label="Status"
                value={capitalize(
                  status
                )}
                icon={
                  isResolved ? (
                    <FiCheckCircle size={16} />
                  ) : (
                    <FiClock size={16} />
                  )
                }
              />

              <DetailItem
                label="Report ID"
                value={
                  report?._id || "-"
                }
                icon={
                  <FiFileText size={16} />
                }
              />

              <DetailItem
                label="Created"
                value={
                  report?.createdAt
                    ? formatDateTime(
                        report.createdAt
                      )
                    : "-"
                }
                icon={
                  <FiClock size={16} />
                }
              />
            </div>
          </section>

          {/* Current status */}
          <section
            className={`rounded-2xl p-5 ${
              isResolved
                ? "border border-green-100 bg-green-50"
                : "border border-amber-100 bg-amber-50"
            }`}
          >
            <div className="flex items-start gap-3">
              {isResolved ? (
                <FiCheckCircle
                  size={20}
                  className="mt-0.5 shrink-0 text-green-600"
                />
              ) : (
                <FiClock
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-600"
                />
              )}

              <div>
                <p
                  className={`font-bold ${
                    isResolved
                      ? "text-green-800"
                      : "text-amber-800"
                  }`}
                >
                  {isResolved
                    ? "Report Resolved"
                    : "Report Pending"}
                </p>

                <p
                  className={`mt-1 text-sm leading-6 ${
                    isResolved
                      ? "text-green-700"
                      : "text-amber-700"
                  }`}
                >
                  {isResolved
                    ? "This report has been marked as resolved."
                    : "This report is currently waiting for resolution."}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};


// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({
  status,
  dark = false,
}) => {
  const resolved =
    status === "resolved";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        dark
          ? resolved
            ? "bg-green-400/10 text-green-300"
            : "bg-amber-400/10 text-amber-300"
          : resolved
            ? "bg-green-50 text-green-700"
            : "bg-amber-50 text-amber-700"
      }`}
    >
      {resolved ? (
        <FiCheckCircle size={13} />
      ) : (
        <FiClock size={13} />
      )}

      {capitalize(status)}
    </span>
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
// HELPERS
// =====================================================

const capitalize = (value) => {
  const text = String(
    value || ""
  );

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
};

const formatDateTime = (date) => {
  try {
    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch {
    return "-";
  }
};

export default ReportDetails;