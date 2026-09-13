import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiRefreshCw,
  FiShield,
  FiUser,
  FiMail,
  FiAlertCircle,
} from "react-icons/fi";

import api from "../../services/api";

const ReportResolve = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);

  const [resolution, setResolution] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

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

      const data =
        response?.data || {};

      const reportData =
        data?.report ||
        data?.data ||
        data;

      setReport(reportData || null);

      if (reportData?.resolution) {
        setResolution(
          reportData.resolution
        );
      }
    } catch (err) {
      console.error(
        "Load report for resolution error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load report."
      );
    } finally {
      setLoading(false);
    }
  };

  const resolveReport = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const message =
      resolution.trim();

    if (!message) {
      setError(
        "Please enter a resolution before resolving the report."
      );

      return;
    }

    if (!id) {
      setError("Report ID is missing.");
      return;
    }

    try {
      setSubmitting(true);

      /*
       * Resolve the report through the
       * existing reports workflow.
       */
      await api.put(
        `/reports/${id}/resolve`,
        {
          resolution: message,
        }
      );

      setSuccess(
        "Report has been resolved successfully."
      );

      await loadReport();

      setTimeout(() => {
        navigate(
          `/employee/reports/${id}`
        );
      }, 700);
    } catch (err) {
      console.error(
        "Resolve report error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to resolve report."
      );
    } finally {
      setSubmitting(false);
    }
  };

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
            Fetching the report before resolution.
          </p>
        </div>
      </div>
    );
  }

  if (error && !report) {
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

        <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
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

  const currentStatus = String(
    report?.status || "pending"
  ).toLowerCase();

  const alreadyResolved =
    currentStatus === "resolved";

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10">
          <Link
            to={`/employee/reports/${id}`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
          >
            <FiArrowLeft size={16} />
            Back to Report
          </Link>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
            <FiShield size={13} />
            Resolution Center
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Resolve Report
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
            Review the reported issue and record the resolution taken by the
            SkilVira operations team.
          </p>
        </div>
      </section>

      {/* Alerts */}
      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm text-green-700">
          <FiCheckCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiAlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report */}
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
                    Review the original issue before recording a resolution.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700 sm:text-base">
                  {report?.message ||
                    "No issue description was provided."}
                </p>
              </div>

              {report?.type && (
                <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Report Type
                  </p>

                  <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
                    {report.type}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Resolution form */}
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
                    Record what action was taken to resolve this issue.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={
                resolveReport
              }
              className="p-5 sm:p-6"
            >
              <label
                htmlFor="resolution"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Resolution Details
              </label>

              <textarea
                id="resolution"
                name="resolution"
                value={resolution}
                onChange={(event) => {
                  setResolution(
                    event.target.value
                  );

                  setError("");
                  setSuccess("");
                }}
                rows={7}
                disabled={
                  alreadyResolved ||
                  submitting
                }
                placeholder="Describe the resolution, action taken, or outcome..."
                className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-70"
              />

              <div className="mt-3 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
                <div className="flex items-start gap-3">
                  <FiShield
                    size={17}
                    className="mt-0.5 shrink-0 text-[#D4AF37]"
                  />

                  <p className="text-xs leading-5 text-gray-600">
                    Add enough detail for the action to be understandable to
                    the operations team and, where appropriate, the reporting
                    user.
                  </p>
                </div>
              </div>

              {alreadyResolved ? (
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  <FiCheckCircle size={18} />

                  This report has already been resolved.
                </div>
              ) : (
                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Link
                    to={`/employee/reports/${id}`}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !resolution.trim()
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <FiRefreshCw
                          size={17}
                          className="animate-spin"
                        />
                        Resolving...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle
                          size={17}
                        />
                        Resolve Report
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </section>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-100 px-5 py-5">
              <h2 className="text-lg font-bold text-gray-900">
                Reporter
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Account that submitted the report.
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
                Report Status
              </h2>
            </div>

            <div className="space-y-3 p-5">
              <StatusRow
                label="Current Status"
                value={
                  alreadyResolved
                    ? "Resolved"
                    : "Pending"
                }
                resolved={
                  alreadyResolved
                }
              />

              <StatusRow
                label="Report ID"
                value={
                  report?._id || "-"
                }
              />

              <StatusRow
                label="Created"
                value={
                  report?.createdAt
                    ? formatDate(
                        report.createdAt
                      )
                    : "-"
                }
              />

              {report?.resolvedAt && (
                <StatusRow
                  label="Resolved"
                  value={formatDate(
                    report.resolvedAt
                  )}
                  resolved
                />
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};


// =====================================================
// STATUS ROW
// =====================================================

const StatusRow = ({
  label,
  value,
  resolved = false,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {label ===
          "Current Status" && (
          resolved ? (
            <FiCheckCircle
              size={16}
              className="text-green-600"
            />
          ) : (
            <FiClock
              size={16}
              className="text-amber-600"
            />
          )
        )}

        <p
          className={`break-words text-sm font-semibold ${
            resolved
              ? "text-green-700"
              : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
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

export default ReportResolve;