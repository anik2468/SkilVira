import { useEffect, useMemo, useState } from "react";
import {
  FiMail,
  FiFileText,
  FiExternalLink,
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiMessageSquare,
  FiEye,
  FiX,
} from "react-icons/fi";

import {
  getRecruiterApplications,
  updateApplicationStatus,
} from "../../services/applicationService";

const GOLD = "#D4AF37";

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Reviewed",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

const STATUS_META = {
  Pending: {
    label: "Pending",
    className:
      "border-gray-200 bg-gray-50 text-gray-700",
    dot: "bg-gray-400",
  },
  Reviewed: {
    label: "Reviewed",
    className:
      "border-slate-200 bg-slate-50 text-slate-700",
    dot: "bg-slate-500",
  },
  Shortlisted: {
    label: "Shortlisted",
    className:
      "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  Interview: {
    label: "Interview",
    className:
      "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  Selected: {
    label: "Selected",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  Rejected: {
    label: "Rejected",
    className:
      "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
};

const Applications = () => {
  const [user, setUser] = useState(null);

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error(
        "Failed to parse recruiter user:",
        err
      );
    }
  }, []);

  useEffect(() => {
    if (user?.id || user?._id) {
      loadApplications();
    } else if (user === null) {
      return;
    } else {
      setLoading(false);
      setError("Recruiter session not found.");
    }
  }, [user]);

  const loadApplications = async (
    isRefresh = false
  ) => {
    const userId = user?.id || user?._id;

    if (!userId) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res =
        await getRecruiterApplications(userId);

      const list =
        res?.applications ||
        res?.data?.applications ||
        (Array.isArray(res) ? res : []);

      setApplications(
        Array.isArray(list) ? list : []
      );
    } catch (err) {
      console.error(
        "Recruiter applications error:",
        err
      );

      setApplications([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateStatus = async (
    id,
    status
  ) => {
    if (!id || !status) return;

    try {
      setUpdatingId(id);
      setError("");
      setSuccess("");

      await updateApplicationStatus(id, {
        status,
      });

      setApplications((prev) =>
        prev.map((app) =>
          app?._id === id
            ? {
                ...app,
                status,
              }
            : app
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
        `Application status updated to ${status}.`
      );
    } catch (err) {
      console.error(
        "Application status update error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplications = useMemo(() => {
    const text =
      search.trim().toLowerCase();

    return applications.filter((item) => {
      const studentName =
        item?.student?.name ||
        item?.student?.fullName ||
        "";

      const studentEmail =
        item?.student?.email || "";

      const internshipTitle =
        item?.internship?.title ||
        item?.internship?.name ||
        "";

      const company =
        item?.internship?.company ||
        item?.company ||
        "";

      const searchableText = `
        ${studentName}
        ${studentEmail}
        ${internshipTitle}
        ${company}
      `.toLowerCase();

      const searchMatch =
        !text ||
        searchableText.includes(text);

      const statusMatch =
        statusFilter === "All" ||
        item?.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [
    applications,
    search,
    statusFilter,
  ]);

  const stats = useMemo(() => {
    return {
      total: applications.length,

      pending: applications.filter(
        (item) =>
          item?.status === "Pending"
      ).length,

      reviewed: applications.filter(
        (item) =>
          item?.status === "Reviewed"
      ).length,

      shortlisted: applications.filter(
        (item) =>
          item?.status === "Shortlisted"
      ).length,

      interview: applications.filter(
        (item) =>
          item?.status === "Interview"
      ).length,

      selected: applications.filter(
        (item) =>
          item?.status === "Selected"
      ).length,

      rejected: applications.filter(
        (item) =>
          item?.status === "Rejected"
      ).length,
    };
  }, [applications]);

  if (loading) {
    return <ApplicationsSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <FiXCircle size={26} />
          </div>

          <h2 className="mt-5 text-2xl font-black text-gray-950">
            Recruiter Session Missing
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Please login again to manage applications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <section className="relative overflow-hidden rounded-[30px] bg-black px-6 py-7 text-white shadow-2xl sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiFileText
                  size={14}
                  style={{ color: GOLD }}
                />

                <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                  Hiring Pipeline
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Applications
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Review candidates, update application stages
                and move the right talent through your hiring
                pipeline.
              </p>
            </div>

            <button
              onClick={() => loadApplications(true)}
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-200 transition hover:bg-white/10 disabled:opacity-50"
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
                : "Refresh Applications"}
            </button>
          </div>
        </section>

        {/* Alerts */}
        {error && (
          <div className="flex flex-col gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>

            <button
              onClick={() =>
                loadApplications(true)
              }
              className="w-fit rounded-xl bg-white px-4 py-2 text-xs font-black text-red-700 shadow-sm"
            >
              Retry
            </button>
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={<FiFileText size={20} />}
            tone="gold"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<FiClock size={20} />}
            tone="amber"
          />

          <StatCard
            title="Shortlisted"
            value={stats.shortlisted}
            icon={<FiUser size={20} />}
            tone="blue"
          />

          <StatCard
            title="Selected"
            value={stats.selected}
            icon={<FiCheckCircle size={20} />}
            tone="green"
          />
        </section>

        {/* Pipeline */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Application Pipeline
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-950">
              Hiring stage overview
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            <PipelineItem
              label="Pending"
              value={stats.pending}
              tone="gray"
            />

            <PipelineItem
              label="Reviewed"
              value={stats.reviewed}
              tone="slate"
            />

            <PipelineItem
              label="Shortlisted"
              value={stats.shortlisted}
              tone="blue"
            />

            <PipelineItem
              label="Interview"
              value={stats.interview}
              tone="amber"
            />

            <PipelineItem
              label="Selected"
              value={stats.selected}
              tone="green"
            />

            <PipelineItem
              label="Rejected"
              value={stats.rejected}
              tone="red"
            />
          </div>
        </section>

        {/* Filters */}
        <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-xl">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search student, email, internship or company..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-gray-800 outline-none transition focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(
                (status) => {
                  const active =
                    statusFilter === status;

                  return (
                    <button
                      key={status}
                      onClick={() =>
                        setStatusFilter(status)
                      }
                      className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
                        active
                          ? "text-black shadow-sm"
                          : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                      style={
                        active
                          ? {
                              backgroundColor:
                                GOLD,
                            }
                          : undefined
                      }
                    >
                      {status}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Candidate Records
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                {statusFilter === "All"
                  ? "All Applications"
                  : `${statusFilter} Applications`}
              </h2>
            </div>

            <p className="text-sm font-semibold text-gray-500">
              {filteredApplications.length} result
              {filteredApplications.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          {filteredApplications.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(search.trim()) ||
                statusFilter !== "All"
              }
              onReset={() => {
                setSearch("");
                setStatusFilter("All");
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredApplications.map(
                (item) => (
                  <ApplicationCard
                    key={item?._id}
                    item={item}
                    updatingId={updatingId}
                    onUpdateStatus={updateStatus}
                    onView={() =>
                      setSelectedApplication(
                        item
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>

      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          updatingId={updatingId}
          onUpdateStatus={updateStatus}
          onClose={() =>
            setSelectedApplication(null)
          }
        />
      )}
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  tone,
}) => {
  const tones = {
    gold: "bg-[#D4AF37]/10 text-[#8D7414]",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-black tracking-tight text-gray-950">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            tones[tone] || tones.gold
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const PipelineItem = ({
  label,
  value,
  tone,
}) => {
  const colors = {
    gray: {
      bg: "bg-gray-50",
      text: "text-gray-700",
    },
    slate: {
      bg: "bg-slate-50",
      text: "text-slate-700",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-700",
    },
    green: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-700",
    },
  };

  const color =
    colors[tone] || colors.gray;

  return (
    <div
      className={`rounded-2xl border border-gray-100 p-4 ${color.bg}`}
    >
      <p
        className={`text-xs font-black uppercase tracking-wide ${color.text}`}
      >
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-black ${color.text}`}
      >
        {value}
      </p>
    </div>
  );
};

const ApplicationCard = ({
  item,
  updatingId,
  onUpdateStatus,
  onView,
}) => {
  const studentName =
    item?.student?.name ||
    item?.student?.fullName ||
    "Student";

  const email =
    item?.student?.email ||
    "No email available";

  const internship =
    item?.internship?.title ||
    item?.internship?.name ||
    "Internship";

  const company =
    item?.internship?.company ||
    item?.company ||
    "";

  const status =
    STATUS_META[item?.status] ||
    STATUS_META.Pending;

  const isUpdating =
    updatingId === item?._id;

  return (
    <div className="rounded-3xl border border-gray-100 bg-[#FCFCFA] p-5 transition hover:border-gray-200 hover:bg-white hover:shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-black"
            style={{ backgroundColor: GOLD }}
          >
            {getInitials(studentName)}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-gray-950">
                {studentName}
              </h3>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${status.dot}`}
                />

                {status.label}
              </span>
            </div>

            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <FiMail size={14} />
              {email}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
                <FiBriefcase size={13} />
                {internship}
              </span>

              {company && (
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">
                  {company}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 xl:justify-end">
          <button
            onClick={onView}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:border-gray-300 hover:text-black"
          >
            <FiEye />
            View
          </button>

          {item?.resume && (
            <a
              href={item.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:border-[#D4AF37] hover:text-black"
            >
              <FiFileText />
              Resume
            </a>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-5">
        <div className="flex flex-wrap gap-2">
          <ActionButton
            label="Review"
            onClick={() =>
              onUpdateStatus(
                item?._id,
                "Reviewed"
              )
            }
            disabled={isUpdating}
            active={item?.status === "Reviewed"}
            tone="gray"
          />

          <ActionButton
            label="Shortlist"
            onClick={() =>
              onUpdateStatus(
                item?._id,
                "Shortlisted"
              )
            }
            disabled={isUpdating}
            active={
              item?.status === "Shortlisted"
            }
            tone="blue"
          />

          <ActionButton
            label="Interview"
            onClick={() =>
              onUpdateStatus(
                item?._id,
                "Interview"
              )
            }
            disabled={isUpdating}
            active={item?.status === "Interview"}
            tone="amber"
          />

          <ActionButton
            label="Select"
            onClick={() =>
              onUpdateStatus(
                item?._id,
                "Selected"
              )
            }
            disabled={isUpdating}
            active={item?.status === "Selected"}
            tone="green"
          />

          <ActionButton
            label="Reject"
            onClick={() =>
              onUpdateStatus(
                item?._id,
                "Rejected"
              )
            }
            disabled={isUpdating}
            active={item?.status === "Rejected"}
            tone="red"
          />
        </div>

        {isUpdating && (
          <p className="mt-3 text-xs font-semibold text-gray-400">
            Updating application status...
          </p>
        )}
      </div>
    </div>
  );
};

const ActionButton = ({
  label,
  onClick,
  disabled,
  active,
  tone,
}) => {
  const tones = {
    gray: active
      ? "bg-gray-800 text-white"
      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",

    blue: active
      ? "bg-blue-600 text-white"
      : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",

    amber: active
      ? "bg-amber-500 text-white"
      : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",

    green: active
      ? "bg-emerald-600 text-white"
      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",

    red: active
      ? "bg-red-600 text-white"
      : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border px-4 py-2.5 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]}`}
    >
      {label}
    </button>
  );
};

const ApplicationModal = ({
  application,
  updatingId,
  onUpdateStatus,
  onClose,
}) => {
  const studentName =
    application?.student?.name ||
    application?.student?.fullName ||
    "Student";

  const email =
    application?.student?.email ||
    "—";

  const internship =
    application?.internship?.title ||
    application?.internship?.name ||
    "—";

  const company =
    application?.internship?.company ||
    application?.company ||
    "—";

  const status =
    STATUS_META[
      application?.status
    ] || STATUS_META.Pending;

  const isUpdating =
    updatingId === application?._id;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        {/* Modal header */}
        <div className="bg-black px-6 py-7 text-white sm:px-8">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                {getInitials(studentName)}
              </div>

              <div className="min-w-0">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Candidate Details
                </p>

                <h2 className="mt-1 truncate text-2xl font-black">
                  {studentName}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {email}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <FiX size={19} />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          {/* Application overview */}
          <div>
            <div className="mb-4">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Application
              </p>

              <h3 className="mt-1 text-xl font-black text-gray-950">
                Application overview
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBox
                label="Internship"
                value={internship}
              />

              <InfoBox
                label="Company"
                value={company}
              />

              <InfoBox
                label="Current Status"
                value={status.label}
              />

              <InfoBox
                label="Application ID"
                value={
                  application?._id || "—"
                }
              />
            </div>
          </div>

          {/* Documents */}
          <div>
            <div className="mb-4">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Candidate Materials
              </p>

              <h3 className="mt-1 text-xl font-black text-gray-950">
                Submitted documents
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {application?.resume ? (
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4 transition hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiFileText />
                    </span>

                    <div>
                      <p className="text-sm font-black text-gray-800">
                        Resume
                      </p>

                      <p className="text-xs text-gray-400">
                        Open submitted resume
                      </p>
                    </div>
                  </div>

                  <FiExternalLink className="text-gray-400" />
                </a>
              ) : (
                <DocumentUnavailable
                  label="Resume"
                />
              )}

              {application?.portfolio ? (
                <a
                  href={
                    application.portfolio
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4 transition hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <FiExternalLink />
                    </span>

                    <div>
                      <p className="text-sm font-black text-gray-800">
                        Portfolio
                      </p>

                      <p className="text-xs text-gray-400">
                        Open candidate portfolio
                      </p>
                    </div>
                  </div>

                  <FiExternalLink className="text-gray-400" />
                </a>
              ) : (
                <DocumentUnavailable
                  label="Portfolio"
                />
              )}
            </div>
          </div>

          {/* Cover letter */}
          {application?.coverLetter && (
            <div>
              <div className="mb-4">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Candidate Message
                </p>

                <h3 className="mt-1 text-xl font-black text-gray-950">
                  Cover letter
                </h3>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-5">
                <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                  {application.coverLetter}
                </p>
              </div>
            </div>
          )}

          {/* Status actions */}
          <div className="border-t border-gray-100 pt-6">
            <div className="mb-4 flex items-center gap-2">
              <FiMessageSquare className="text-gray-400" />

              <p className="text-sm font-black text-gray-900">
                Update Application Status
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <ActionButton
                label="Review"
                onClick={() =>
                  onUpdateStatus(
                    application?._id,
                    "Reviewed"
                  )
                }
                disabled={isUpdating}
                active={
                  application?.status ===
                  "Reviewed"
                }
                tone="gray"
              />

              <ActionButton
                label="Shortlist"
                onClick={() =>
                  onUpdateStatus(
                    application?._id,
                    "Shortlisted"
                  )
                }
                disabled={isUpdating}
                active={
                  application?.status ===
                  "Shortlisted"
                }
                tone="blue"
              />

              <ActionButton
                label="Interview"
                onClick={() =>
                  onUpdateStatus(
                    application?._id,
                    "Interview"
                  )
                }
                disabled={isUpdating}
                active={
                  application?.status ===
                  "Interview"
                }
                tone="amber"
              />

              <ActionButton
                label="Select"
                onClick={() =>
                  onUpdateStatus(
                    application?._id,
                    "Selected"
                  )
                }
                disabled={isUpdating}
                active={
                  application?.status ===
                  "Selected"
                }
                tone="green"
              />

              <ActionButton
                label="Reject"
                onClick={() =>
                  onUpdateStatus(
                    application?._id,
                    "Rejected"
                  )
                }
                disabled={isUpdating}
                active={
                  application?.status ===
                  "Rejected"
                }
                tone="red"
              />
            </div>

            {isUpdating && (
              <p className="mt-3 text-xs font-semibold text-gray-400">
                Updating application...
              </p>
            )}
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-5">
            <button
              onClick={onClose}
              className="rounded-xl px-5 py-3 text-sm font-black text-black"
              style={{
                backgroundColor: GOLD,
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
      <p className="text-xs font-semibold text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-black text-gray-800">
        {value}
      </p>
    </div>
  );
};

const DocumentUnavailable = ({
  label,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        <FiFileText />
      </span>

      <div>
        <p className="text-sm font-black text-gray-700">
          {label}
        </p>

        <p className="text-xs text-gray-400">
          Not provided
        </p>
      </div>
    </div>
  );
};

const EmptyState = ({
  hasFilters,
  onReset,
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-14 text-center">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
        style={{ backgroundColor: GOLD }}
      >
        <FiFileText size={27} />
      </div>

      <h3 className="mt-5 text-2xl font-black text-gray-950">
        {hasFilters
          ? "No Matching Applications"
          : "No Applications Yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasFilters
          ? "Try changing your search or status filter."
          : "Student applications will appear here when candidates apply to your internships."}
      </p>

      {hasFilters && (
        <button
          onClick={onReset}
          className="mt-5 rounded-xl px-5 py-3 text-sm font-black text-black"
          style={{ backgroundColor: GOLD }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

const ApplicationsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-56 rounded-[30px] bg-gray-900" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-3xl bg-white"
            />
          ))}
        </div>

        <div className="h-48 rounded-3xl bg-white" />

        <div className="h-20 rounded-3xl bg-white" />

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-48 rounded-3xl bg-white"
            />
          ))}
        </div>
      </div>
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

export default Applications;