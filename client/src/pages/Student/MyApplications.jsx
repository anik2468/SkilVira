import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useState } from "react";
import {
  FiFileText,
  FiExternalLink,
  FiCalendar,
  FiBriefcase,
  FiRefreshCw,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

import {
  getMyApplications,
} from "../../services/applicationService";

const API_BASE = API_ORIGIN;


// =====================================================
// HELPERS
// =====================================================

const getUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    return null;
  }
};


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


const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


// =====================================================
// STATUS
// =====================================================

const getStatusConfig = (status) => {
  const normalized =
    String(status || "")
      .trim()
      .toLowerCase();

  switch (normalized) {
    case "selected":
      return {
        label: "Selected",
        icon: FiCheckCircle,
        className:
          "border-green-200 bg-green-50 text-green-700",
      };

    case "rejected":
      return {
        label: "Rejected",
        icon: FiXCircle,
        className:
          "border-red-200 bg-red-50 text-red-700",
      };

    case "shortlisted":
      return {
        label: "Shortlisted",
        icon: FiCheckCircle,
        className:
          "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#8B6E12]",
      };

    case "interview":
      return {
        label: "Interview",
        icon: FiCalendar,
        className:
          "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#8B6E12]",
      };

    case "reviewed":
      return {
        label: "Reviewed",
        icon: FiBriefcase,
        className:
          "border-gray-200 bg-gray-50 text-gray-700",
      };

    case "pending":
      return {
        label: "Pending",
        icon: FiClock,
        className:
          "border-gray-200 bg-gray-50 text-gray-600",
      };

    default:
      return {
        label: status || "Applied",
        icon: FiClock,
        className:
          "border-gray-200 bg-gray-50 text-gray-700",
      };
  }
};


// =====================================================
// MAIN
// =====================================================

const MyApplications = () => {
  const user = getUser();

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


  // ======================================
  // Load Applications
  // ======================================

  const loadApplications = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const studentId =
        user?.id ||
        user?._id ||
        user?.userId;

      if (!studentId) {
        throw new Error(
          "Student account could not be identified."
        );
      }

      const response =
        await getMyApplications(
          studentId
        );

      setApplications(
        response?.applications ||
          response?.data ||
          []
      );
    } catch (err) {
      console.error(
        "loadApplications error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load applications."
      );

      setApplications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadApplications();
  }, []);


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="h-6 w-64 rounded bg-gray-200" />

              <div className="mt-3 h-4 w-32 rounded bg-gray-100" />

              <div className="mt-6 h-4 w-48 rounded bg-gray-100" />

              <div className="mt-6 h-10 w-32 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }


  // ======================================
  // Render
  // ======================================

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1.5">
            <FiFileText
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-xs font-semibold text-[#8B6E12]">
              Application Tracking
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My Applications
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Track all your internship applications
            and their latest status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadApplications(true)}
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
          <span>{error}</span>

          <button
            type="button"
            onClick={() => loadApplications(true)}
            className="font-semibold underline underline-offset-2"
          >
            Try Again
          </button>
        </div>
      )}


      {/* Empty */}
      {applications.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100 sm:p-14">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiBriefcase size={36} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            No Applications Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Apply for internships to start
            tracking your applications here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((item) => {
            const status =
              getStatusConfig(
                item?.status
              );

            const StatusIcon =
              status.icon;

            const internship =
              item?.internship || {};

            const internshipId =
              internship?._id ||
              internship?.id;

            const resumeUrl =
              getFileUrl(
                item?.resume
              );

            const portfolioUrl =
              getFileUrl(
                item?.portfolio
              );

            return (
              <div
                key={item?._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
              >
                {/* Main */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    {/* Internship */}
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                        <FiBriefcase
                          size={22}
                        />
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                          {internship?.title ||
                            "Internship"}
                        </h2>

                        <p className="mt-1 font-semibold text-[#D4AF37]">
                          {internship?.company ||
                            "Company"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                          {internship?.location && (
                            <span className="flex items-center gap-1.5">
                              <FiMapPin
                                size={14}
                              />
                              {internship.location}
                            </span>
                          )}

                          {internship?.workMode && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                              {internship.workMode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <span
                      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold ${status.className}`}
                    >
                      <StatusIcon
                        size={14}
                      />

                      {status.label}
                    </span>
                  </div>


                  {/* Details */}
                  <div className="mt-6 grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoItem
                      icon={<FiCalendar />}
                      label="Applied On"
                      value={formatDate(
                        item?.createdAt
                      )}
                    />

                    <InfoItem
                      icon={<FiFileText />}
                      label="Application Status"
                      value={
                        item?.status ||
                        "Applied"
                      }
                    />

                    <InfoItem
                      icon={<FiClock />}
                      label="Last Updated"
                      value={formatDate(
                        item?.updatedAt ||
                          item?.createdAt
                      )}
                    />
                  </div>


                  {/* Cover Letter */}
                  {item?.coverLetter && (
                    <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
                      <h3 className="text-sm font-bold text-gray-900">
                        Cover Letter
                      </h3>

                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                        {item.coverLetter}
                      </p>
                    </div>
                  )}
                </div>


                {/* Actions */}
                <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/70 p-4 sm:flex-row sm:flex-wrap">
                  {internshipId && (
                    <a
                      href={`/student/internships/${internshipId}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b99520]"
                    >
                      <FiBriefcase size={16} />
                      View Internship
                    </a>
                  )}

                  {resumeUrl && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12]"
                    >
                      <FiFileText size={16} />
                      View Resume
                    </a>
                  )}

                  {portfolioUrl && (
                    <a
                      href={portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12]"
                    >
                      <FiExternalLink size={16} />
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


// =====================================================
// INFO ITEM
// =====================================================

const InfoItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
        <span className="text-[#D4AF37]">
          {icon}
        </span>

        {label}
      </div>

      <p className="mt-1.5 text-sm font-semibold capitalize text-gray-800">
        {value || "—"}
      </p>
    </div>
  );
};


export default MyApplications;