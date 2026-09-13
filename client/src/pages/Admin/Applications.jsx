import { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiFileText,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiExternalLink,
  FiBriefcase,
  FiCalendar,
  FiMail,
  FiPhone,
  FiArrowUpRight,
  FiAlertCircle,
} from "react-icons/fi";

import {
  getAllApplications,
  updateApplicationStatus,
} from "../../services/applicationService";

const GOLD = "#D4AF37";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await getAllApplications();

      const list =
        res?.applications ||
        res?.data ||
        (Array.isArray(res) ? res : []);

      setApplications(
        Array.isArray(list) ? list : []
      );
    } catch (err) {
      console.error(
        "ADMIN APPLICATIONS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load applications."
      );

      setApplications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateStatus = async (
    id,
    status
  ) => {
    if (!id) return;

    try {
      setUpdatingId(id);
      setError("");
      setSuccess("");

      await updateApplicationStatus(
        id,
        { status }
      );

      setApplications((prev) =>
        prev.map((application) =>
          application._id === id
            ? {
                ...application,
                status,
              }
            : application
        )
      );

      setSelectedApplication((prev) =>
        prev?._id === id
          ? {
              ...prev,
              status,
            }
          : prev
      );

      setSuccess(
        `Application marked as ${status}.`
      );

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "UPDATE APPLICATION STATUS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = useMemo(() => {
    const pending = applications.filter(
      (item) =>
        String(item?.status || "")
          .toLowerCase() === "pending"
    ).length;

    const shortlisted = applications.filter(
      (item) =>
        String(item?.status || "")
          .toLowerCase() === "shortlisted"
    ).length;

    const selected = applications.filter(
      (item) =>
        String(item?.status || "")
          .toLowerCase() === "selected"
    ).length;

    const rejected = applications.filter(
      (item) =>
        String(item?.status || "")
          .toLowerCase() === "rejected"
    ).length;

    return {
      total: applications.length,
      pending,
      shortlisted,
      selected,
      rejected,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return applications.filter(
      (application) => {
        const text = [
          application?.student?.name,
          application?.student?.email,
          application?.student?.phone,
          application?.internship?.title,
          application?.internship?.company,
          application?.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !query || text.includes(query);

        const matchesStatus =
          filter === "All" ||
          String(
            application?.status || ""
          ).toLowerCase() ===
            filter.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    applications,
    search,
    filter,
  ]);

  if (loading) {
    return <ApplicationsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiFileText
                  size={14}
                  style={{ color: GOLD }}
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Application Control
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Application Management
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                Review internship applications, monitor candidate
                movement and manage application decisions from one
                control center.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadApplications(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
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
                : "Refresh"}
            </button>
          </div>
        </section>

        {/* =====================================================
            ALERTS
        ===================================================== */}

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* =====================================================
            STATS
        ===================================================== */}

        <section>
          <div className="mb-4">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Hiring Pipeline
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-950 sm:text-3xl">
              Application overview
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="Total"
              value={stats.total}
              icon={<FiFileText />}
              tone="gold"
            />

            <MetricCard
              label="Pending"
              value={stats.pending}
              icon={<FiClock />}
              tone="amber"
            />

            <MetricCard
              label="Shortlisted"
              value={stats.shortlisted}
              icon={<FiUsers />}
              tone="blue"
            />

            <MetricCard
              label="Selected"
              value={stats.selected}
              icon={<FiCheckCircle />}
              tone="green"
            />

            <MetricCard
              label="Rejected"
              value={stats.rejected}
              icon={<FiXCircle />}
              tone="red"
            />
          </div>
        </section>

        {/* =====================================================
            SEARCH / FILTER
        ===================================================== */}

        <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-2xl">
              <FiSearchIcon />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search student, email, internship, company..."
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Pending",
                "Shortlisted",
                "Selected",
                "Rejected",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setFilter(item)
                  }
                  className={`rounded-xl px-4 py-2.5 text-xs font-black ${
                    filter === item
                      ? "text-black"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  style={
                    filter === item
                      ? {
                          backgroundColor:
                            GOLD,
                        }
                      : undefined
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-7">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Application Directory
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-950 sm:text-2xl">
                Candidate applications
              </h2>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-600">
              {filteredApplications.length} result
              {filteredApplications.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          {filteredApplications.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(search.trim()) ||
                filter !== "All"
              }
              clear={() => {
                setSearch("");
                setFilter("All");
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FAFAF8]">
                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Candidate
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Internship
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Applied
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Resume
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wide text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map(
                    (application) => (
                      <ApplicationRow
                        key={
                          application._id
                        }
                        application={
                          application
                        }
                        updatingId={
                          updatingId
                        }
                        onView={() =>
                          setSelectedApplication(
                            application
                          )
                        }
                        onUpdate={
                          updateStatus
                        }
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedApplication && (
        <ApplicationModal
          application={
            selectedApplication
          }
          updatingId={updatingId}
          onClose={() =>
            setSelectedApplication(null)
          }
          onUpdate={updateStatus}
        />
      )}
    </div>
  );
};

/* =========================================================
   ROW
========================================================= */

const ApplicationRow = ({
  application,
  updatingId,
  onView,
  onUpdate,
}) => {
  const student =
    application?.student || {};

  const internship =
    application?.internship || {};

  const status =
    application?.status ||
    "Pending";

  const resume =
    application?.resume || "";

  return (
    <tr className="border-b border-gray-100 transition hover:bg-[#FCFCFA]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-black"
            style={{
              backgroundColor: GOLD,
            }}
          >
            {getInitials(
              student?.name
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-gray-900">
              {student?.name ||
                "Unknown Student"}
            </p>

            <p className="mt-1 truncate text-xs text-gray-500">
              {student?.email ||
                "Email unavailable"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="max-w-[230px] truncate text-sm font-black text-gray-800">
          {internship?.title ||
            "Unknown Internship"}
        </p>

        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <FiBriefcase />
          {internship?.company ||
            "Company unavailable"}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-gray-600">
          {formatDate(
            application?.createdAt ||
              application?.appliedAt
          )}
        </p>
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={status} />
      </td>

      <td className="px-5 py-4">
        {resume ? (
          <a
            href={resume}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:underline"
          >
            <FiExternalLink />
            View Resume
          </a>
        ) : (
          <span className="text-xs font-semibold text-gray-400">
            Not uploaded
          </span>
        )}
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700 hover:border-[#D4AF37]"
          >
            <FiEye />
            View
          </button>

          <button
            type="button"
            disabled={
              updatingId ===
              application?._id
            }
            onClick={() =>
              onUpdate(
                application?._id,
                "Selected"
              )
            }
            className="rounded-xl px-3 py-2 text-xs font-black text-black disabled:opacity-50"
            style={{
              backgroundColor: GOLD,
            }}
          >
            Select
          </button>
        </div>
      </td>
    </tr>
  );
};

/* =========================================================
   MODAL
========================================================= */

const ApplicationModal = ({
  application,
  updatingId,
  onClose,
  onUpdate,
}) => {
  const student =
    application?.student || {};

  const internship =
    application?.internship || {};

  const status =
    application?.status ||
    "Pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">

        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Application Review
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                {student?.name ||
                  "Candidate"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {internship?.title ||
                  "Internship"}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-xl font-bold text-gray-500 hover:bg-gray-200"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-7">

          {/* Candidate + internship */}
          <div className="grid gap-4 md:grid-cols-2">
            <InfoBlock
              title="Candidate"
              icon={<FiUsers />}
            >
              <DetailLine
                icon={<FiUsers />}
                label="Name"
                value={
                  student?.name ||
                  "Not available"
                }
              />

              <DetailLine
                icon={<FiMail />}
                label="Email"
                value={
                  student?.email ||
                  "Not available"
                }
              />

              <DetailLine
                icon={<FiPhone />}
                label="Phone"
                value={
                  student?.phone ||
                  student?.mobile ||
                  "Not available"
                }
              />
            </InfoBlock>

            <InfoBlock
              title="Internship"
              icon={<FiBriefcase />}
            >
              <DetailLine
                icon={<FiBriefcase />}
                label="Title"
                value={
                  internship?.title ||
                  "Not available"
                }
              />

              <DetailLine
                icon={<FiUsers />}
                label="Company"
                value={
                  internship?.company ||
                  "Not available"
                }
              />

              <DetailLine
                icon={<FiCalendar />}
                label="Applied"
                value={formatDate(
                  application?.createdAt ||
                    application?.appliedAt
                )}
              />
            </InfoBlock>
          </div>

          {/* Documents */}
          <div className="grid gap-4 md:grid-cols-3">
            <DocumentCard
              title="Resume"
              file={application?.resume}
            />

            <DocumentCard
              title="Portfolio"
              file={application?.portfolio}
            />

            <DocumentCard
              title="Cover Letter"
              text={
                application?.coverLetter
              }
            />
          </div>

          {/* Status */}
          <section className="rounded-3xl border border-gray-200 bg-[#FAFAF8] p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-gray-400">
                  Current Status
                </p>

                <div className="mt-2">
                  <StatusBadge
                    status={status}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <ActionButton
                  label="Shortlist"
                  color="blue"
                  disabled={
                    updatingId ===
                    application?._id
                  }
                  onClick={() =>
                    onUpdate(
                      application?._id,
                      "Shortlisted"
                    )
                  }
                />

                <ActionButton
                  label="Select"
                  color="gold"
                  disabled={
                    updatingId ===
                    application?._id
                  }
                  onClick={() =>
                    onUpdate(
                      application?._id,
                      "Selected"
                    )
                  }
                />

                <ActionButton
                  label="Reject"
                  color="red"
                  disabled={
                    updatingId ===
                    application?._id
                  }
                  onClick={() =>
                    onUpdate(
                      application?._id,
                      "Rejected"
                    )
                  }
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const MetricCard = ({
  label,
  value,
  icon,
  tone,
}) => {
  const toneMap = {
    gold:
      "bg-[#D4AF37]/10 text-[#8D7414]",
    amber:
      "bg-amber-50 text-amber-600",
    blue:
      "bg-blue-50 text-blue-600",
    green:
      "bg-emerald-50 text-emerald-600",
    red:
      "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-gray-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            toneMap[tone]
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({
  status,
}) => {
  const value = String(
    status || "Pending"
  );

  const normalized =
    value.toLowerCase();

  let classes =
    "border-amber-200 bg-amber-50 text-amber-700";

  if (
    normalized ===
    "selected"
  ) {
    classes =
      "border-emerald-200 bg-emerald-50 text-emerald-700";
  } else if (
    normalized ===
    "rejected"
  ) {
    classes =
      "border-red-200 bg-red-50 text-red-700";
  } else if (
    normalized ===
    "shortlisted"
  ) {
    classes =
      "border-blue-200 bg-blue-50 text-blue-700";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${classes}`}
    >
      {getStatusIcon(
        value
      )}

      {value}
    </span>
  );
};

const ActionButton = ({
  label,
  color,
  disabled,
  onClick,
}) => {
  const classes = {
    gold:
      "bg-[#D4AF37] text-black",
    blue:
      "bg-blue-600 text-white",
    red:
      "bg-red-600 text-white",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-xs font-black disabled:opacity-50 ${classes[color]}`}
    >
      {label}
    </button>
  );
};

const InfoBlock = ({
  title,
  icon,
  children,
}) => (
  <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl text-black"
        style={{
          backgroundColor: GOLD,
        }}
      >
        {icon}
      </div>

      <h3 className="text-lg font-black text-gray-950">
        {title}
      </h3>
    </div>

    <div className="mt-4 space-y-3">
      {children}
    </div>
  </section>
);

const DetailLine = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-3 rounded-xl bg-[#FAFAF8] p-3">
    <span
      className="mt-0.5"
      style={{
        color: GOLD,
      }}
    >
      {icon}
    </span>

    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-black text-gray-800">
        {value}
      </p>
    </div>
  </div>
);

const DocumentCard = ({
  title,
  file,
  text,
}) => (
  <div className="rounded-2xl border border-gray-200 bg-[#FAFAF8] p-4">
    <p className="text-xs font-black uppercase tracking-wide text-gray-400">
      {title}
    </p>

    {file ? (
      <a
        href={file}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-blue-600 hover:border-[#D4AF37]"
      >
        <FiExternalLink />
        Open File
      </a>
    ) : text ? (
      <p className="mt-3 max-h-32 overflow-y-auto whitespace-pre-line text-xs leading-5 text-gray-600">
        {text}
      </p>
    ) : (
      <p className="mt-3 text-xs font-semibold text-gray-400">
        Not available
      </p>
    )}
  </div>
);

const EmptyState = ({
  hasFilters,
  clear,
}) => (
  <div className="px-6 py-16 text-center">
    <div
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
      style={{
        backgroundColor: GOLD,
      }}
    >
      <FiFileText size={28} />
    </div>

    <h3 className="mt-5 text-xl font-black text-gray-950">
      {hasFilters
        ? "No Matching Applications"
        : "No Applications Found"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {hasFilters
        ? "Try changing your search or status filter."
        : "Application records will appear here when students apply for internships."}
    </p>

    {hasFilters && (
      <button
        type="button"
        onClick={clear}
        className="mt-5 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700"
      >
        Clear Filters
      </button>
    )}
  </div>
);

const ApplicationsSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1600px] animate-pulse space-y-6">
      <div className="h-64 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-32 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="h-20 rounded-3xl bg-white" />
      <div className="h-[520px] rounded-3xl bg-white" />
    </div>
  </div>
);

const FiSearchIcon = () => (
  <FiSearch
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
  />
);

const getInitials = (
  name = ""
) => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "U";
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
  if (!value) {
    return "Not available";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not available";
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

const getStatusIcon = (
  status
) => {
  switch (
    String(
      status || ""
    ).toLowerCase()
  ) {
    case "selected":
      return (
        <FiCheckCircle />
      );

    case "rejected":
      return (
        <FiXCircle />
      );

    case "shortlisted":
      return <FiUsers />;

    default:
      return <FiClock />;
  }
};

export default Applications;