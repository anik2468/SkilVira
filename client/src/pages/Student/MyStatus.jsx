import { API_ORIGIN } from "../../services/urlConfig.js";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiAward,
  FiBriefcase,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiRefreshCw,
  FiX,
  FiBookOpen,
  FiAlertCircle,
  FiArrowRight,
  FiExternalLink,
} from "react-icons/fi";

import {
  getMyStatus,
} from "../../services/studentStatusService";

const API_BASE = API_ORIGIN;


// =====================================================
// HELPERS
// =====================================================

const getFileUrl = (filePath) => {
  if (!filePath) {
    return "";
  }

  if (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://")
  ) {
    return filePath;
  }

  if (filePath.startsWith("/")) {
    return `${API_BASE}${filePath}`;
  }

  return `${API_BASE}/${filePath}`;
};


const formatDate = (date) => {
  if (!date) {
    return "—";
  }

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


const formatCurrency = (value) => {
  const number = Number(value || 0);

  return `₹${number.toLocaleString("en-IN")}`;
};


const normalizeStatus = (status) => {
  const value = String(
    status || "pending"
  ).toLowerCase();

  if (
    value.includes("complete") ||
    value === "approved"
  ) {
    return "completed";
  }

  if (
    value.includes("reject") ||
    value.includes("cancel")
  ) {
    return "rejected";
  }

  if (
    value.includes("process") ||
    value.includes("review")
  ) {
    return "processing";
  }

  return "pending";
};


// =====================================================
// STATUS CONFIG
// =====================================================

const statusConfig = {
  completed: {
    label: "Completed",
    icon: FiCheck,
    className:
      "border-green-200 bg-green-50 text-green-700",
    dot: "bg-green-500",
  },

  processing: {
    label: "In Review",
    icon: FiClock,
    className:
      "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#8B6E12]",
    dot: "bg-[#D4AF37]",
  },

  pending: {
    label: "Pending",
    icon: FiClock,
    className:
      "border-gray-200 bg-gray-50 text-gray-600",
    dot: "bg-gray-400",
  },

  rejected: {
    label: "Rejected",
    icon: FiX,
    className:
      "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
};


// =====================================================
// STEP ICON
// =====================================================

const StepIcon = ({
  label,
}) => {
  const value =
    String(label || "")
      .toLowerCase();

  if (value.includes("payment")) {
    return <FiCreditCard size={18} />;
  }

  if (
    value.includes("enrollment")
  ) {
    return <FiBookOpen size={18} />;
  }

  if (
    value.includes("offer")
  ) {
    return <FiFileText size={18} />;
  }

  if (
    value.includes("learning") ||
    value.includes("course")
  ) {
    return <FiBookOpen size={18} />;
  }

  if (
    value.includes("certificate")
  ) {
    return <FiAward size={18} />;
  }

  if (
    value.includes("report")
  ) {
    return <FiFileText size={18} />;
  }

  return <FiCheck size={18} />;
};


// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({
  status,
}) => {
  const normalized =
    normalizeStatus(status);

  const config =
    statusConfig[
      normalized
    ] || statusConfig.pending;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
};


// =====================================================
// TIMELINE STEP
// =====================================================

const TimelineStep = ({
  step,
  last,
}) => {
  const normalized =
    normalizeStatus(
      step?.status
    );

  const config =
    statusConfig[
      normalized
    ] || statusConfig.pending;

  const rawProgress =
    Number(
      step?.data?.progress ??
        step?.progress ??
        0
    );

  const progress =
    Number.isFinite(
      rawProgress
    )
      ? Math.max(
          0,
          Math.min(
            100,
            rawProgress
          )
        )
      : 0;

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.className}`}
        >
          <StepIcon
            label={step?.label}
          />
        </div>

        {!last && (
          <div className="h-full min-h-8 w-px bg-gray-200" />
        )}
      </div>

      <div
        className={`min-w-0 flex-1 ${
          last ? "pb-0" : "pb-6"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-bold text-gray-900">
            {step?.label ||
              "Status"}
          </h4>

          <StatusBadge
            status={
              step?.status
            }
          />
        </div>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          {step?.message ||
            "Status information is not available."}
        </p>

        {step?.data?.progress !==
          undefined && (
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-gray-500">
                Course progress
              </span>

              <span className="font-bold text-gray-900">
                {progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// =====================================================
// INFO ROW
// =====================================================

const InfoRow = ({
  label,
  value,
}) => {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
};


// =====================================================
// DOCUMENT LINK
// =====================================================

const DocumentLink = ({
  title,
  description,
  icon,
  file,
}) => {
  const url = getFileUrl(file);

  if (!url) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <FiExternalLink
        className="shrink-0 text-gray-400"
      />
    </a>
  );
};


// =====================================================
// STATUS CARD
// =====================================================

const StatusCard = ({
  item,
}) => {
  const [
    expanded,
    setExpanded,
  ] = useState(false);

  const programName =
    item?.program?.name ||
    item?.course?.title ||
    item?.internship?.title ||
    "Program";

  const company =
    item?.program?.company ||
    item?.internship?.company ||
    item?.company;

  const progressValue =
    Number(
      item?.enrollment?.progress ??
        item?.progress ??
        0
    );

  const progress =
    Number.isFinite(
      progressValue
    )
      ? Math.max(
          0,
          Math.min(
            100,
            progressValue
          )
        )
      : 0;

  const finalAmount =
    item?.amount?.final ??
    item?.payment?.finalAmount ??
    item?.payment?.amount ??
    0;

  const steps =
    Array.isArray(item?.steps)
      ? item.steps
      : [];

  const isInternship =
    item?.type ===
      "internship" ||
    item?.program?.isInternship ===
      true;

  const enrollmentStatus =
    normalizeStatus(
      item?.enrollment?.status
    );


  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Card Header */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              {isInternship ? (
                <FiBriefcase
                  size={22}
                />
              ) : (
                <FiBookOpen
                  size={22}
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {isInternship
                  ? "Internship"
                  : "Course"}
              </p>

              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                {programName}
              </h2>

              {company && (
                <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                  <FiBriefcase
                    size={14}
                  />

                  <span className="truncate">
                    {company}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 lg:shrink-0">
            <div className="rounded-xl bg-gray-50 px-4 py-2.5 text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Paid
              </p>

              <p className="text-sm font-bold text-gray-900">
                {formatCurrency(
                  finalAmount
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setExpanded(
                  (prev) => !prev
                )
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-[#D4AF37] hover:text-[#9B7B16]"
              title={
                expanded
                  ? "Collapse"
                  : "View status"
              }
            >
              {expanded ? (
                <FiChevronUp
                  size={18}
                />
              ) : (
                <FiChevronDown
                  size={18}
                />
              )}
            </button>
          </div>
        </div>


        {/* Progress */}
        {item?.enrollment && (
          <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Overall Progress
                </p>

                <p className="mt-0.5 text-sm font-bold text-gray-900">
                  {progress >= 100
                    ? "Program Completed"
                    : "Program In Progress"}
                </p>
              </div>

              <span className="text-lg font-bold text-[#9B7B16]">
                {progress}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>


      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-100 bg-white px-5 py-6 sm:px-6">
          {/* Timeline Header */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900">
                Application Journey
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Track every stage of your
                enrollment.
              </p>
            </div>

            <span className="hidden rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1.5 text-xs font-semibold text-[#8B6E12] sm:block">
              Status Tracking
            </span>
          </div>


          {/* Timeline */}
          {steps.length > 0 ? (
            <div>
              {steps.map(
                (step, index) => (
                  <TimelineStep
                    key={`${step?.label || "step"}-${index}`}
                    step={step}
                    last={
                      index ===
                      steps.length - 1
                    }
                  />
                )
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-gray-50 p-5 text-sm text-gray-500">
              Detailed timeline is not
              available yet.
            </div>
          )}


          {/* Payment */}
          <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-4 font-bold text-gray-900">
              Payment Details
            </h4>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoRow
                label="Payment Method"
                value={
                  item?.payment?.method
                    ? String(
                        item.payment.method
                      ).replace(
                        /_/g,
                        " "
                      )
                    : "—"
                }
              />

              <InfoRow
                label="Transaction ID"
                value={
                  item?.payment
                    ?.transactionReference ||
                  item?.payment
                    ?.transactionId
                }
              />

              <InfoRow
                label="Submitted"
                value={formatDate(
                  item?.payment
                    ?.submittedAt
                )}
              />

              <InfoRow
                label="Approved"
                value={formatDate(
                  item?.payment
                    ?.approvedAt
                )}
              />
            </div>

            {item?.payment
              ?.rejectionReason && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span className="font-bold">
                  Rejection reason:
                </span>{" "}
                {
                  item.payment
                    .rejectionReason
                }
              </div>
            )}
          </div>


          {/* Enrollment */}
          {item?.enrollment && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
              <h4 className="mb-4 font-bold text-gray-900">
                Enrollment Details
              </h4>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <div className="mt-1">
                    <StatusBadge
                      status={
                        enrollmentStatus
                      }
                    />
                  </div>
                </div>

                <InfoRow
                  label="Enrollment Date"
                  value={formatDate(
                    item.enrollment
                      .enrollmentDate
                  )}
                />

                <InfoRow
                  label="Start Date"
                  value={formatDate(
                    item.enrollment
                      .startDate
                  )}
                />

                <InfoRow
                  label="Completion Date"
                  value={formatDate(
                    item.enrollment
                      .completionDate
                  )}
                />
              </div>
            </div>
          )}


          {/* Documents */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DocumentLink
              title="Offer Letter"
              description="View approved offer letter"
              icon={<FiFileText />}
              file={
                item?.offerLetter
                  ?.offerLetterFile ||
                item?.offerLetter?.file
              }
            />

            <DocumentLink
              title="Certificate"
              description="View approved certificate"
              icon={<FiAward />}
              file={
                item?.certificate
                  ?.certificateFile ||
                item?.certificate?.file
              }
            />

            <DocumentLink
              title="Performance Report"
              description="View approved report"
              icon={<FiFileText />}
              file={
                item?.report
                  ?.reportFile ||
                item?.report?.file
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};


// =====================================================
// MAIN COMPONENT
// =====================================================

const MyStatus = () => {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


  // ======================================
  // Fetch
  // ======================================

  const fetchStatus = async (
    refresh = false
  ) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await getMyStatus();

      const data =
        response?.data ||
        response;

      const list =
        response?.status ||
        response?.items ||
        data?.status ||
        data?.items ||
        data ||
        [];

      setItems(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (err) {
      console.error(
        "fetchStatus error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch your status."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    fetchStatus();
  }, []);


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-9 w-48 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 h-5 w-[32rem] max-w-full animate-pulse rounded bg-gray-100" />
        </div>

        <div className="space-y-5">
          {[1, 2].map(
            (item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6"
              >
                <div className="h-6 w-1/3 rounded bg-gray-200" />

                <div className="mt-4 h-4 w-1/4 rounded bg-gray-100" />

                <div className="mt-7 h-3 rounded bg-gray-100" />

                <div className="mt-5 h-20 rounded bg-gray-100" />
              </div>
            )
          )}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1.5">
            <FiClock
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-xs font-semibold text-[#8B6E12]">
              Application Tracking
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My Status
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Track your payment, enrollment, offer letter,
            learning progress and final documents.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            fetchStatus(true)
          }
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
          <div className="flex items-start gap-2">
            <FiAlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchStatus(true)
            }
            className="font-semibold underline underline-offset-2"
          >
            Try Again
          </button>
        </div>
      )}


      {/* Empty */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiFileText size={28} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            No Applications Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Once you purchase a course or internship
            and submit payment, its complete status
            will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {items.map(
            (item, index) => (
              <StatusCard
                key={
                  item?.id ||
                  item?._id ||
                  `${item?.type || "program"}-${index}`
                }
                item={item}
              />
            )
          )}
        </div>
      )}


      {/* Footer Note */}
      {items.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
          <FiArrowRight
            className="mt-0.5 shrink-0 text-[#D4AF37]"
          />

          <p className="text-sm leading-6 text-gray-600">
            Your enrollment becomes active only after
            the payment is verified and approved. Final
            certificates and reports are generated after
            the eligible program is completed and go
            through the required verification process.
          </p>
        </div>
      )}
    </div>
  );
};


export default MyStatus;