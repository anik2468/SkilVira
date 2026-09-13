import { useEffect, useMemo, useState } from "react";
import {
  FiFileText,
  FiSearch,
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiMail,
  FiBriefcase,
  FiEye,
  FiMoreVertical,
  FiAlertCircle,
} from "react-icons/fi";

import api from "../../services/api";

const Applications = () => {
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [error, setError] =
    useState("");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

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

      const response = await api.get(
        "/employee/applications"
      );

      const data =
        response?.data || {};

      setApplications(
        Array.isArray(data?.applications)
          ? data.applications
          : []
      );
    } catch (err) {
      console.error(
        "Load applications error:",
        err
      );

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

  const getStatus = (application) => {
    return String(
      application?.status ||
        application?.applicationStatus ||
        "pending"
    ).toLowerCase();
  };

  const approveApplication = async (id) => {
    const confirmed = window.confirm(
      "Approve this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        `approve-${id}`
      );

      setError("");

      await api.put(
        `/employee/applications/approve/${id}`
      );

      await loadApplications(true);
    } catch (err) {
      console.error(
        "Approve application error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to approve application."
      );
    } finally {
      setActionLoading("");
    }
  };

  const rejectApplication = async (id) => {
    const confirmed = window.confirm(
      "Reject this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        `reject-${id}`
      );

      setError("");

      await api.put(
        `/employee/applications/reject/${id}`
      );

      await loadApplications(true);
    } catch (err) {
      console.error(
        "Reject application error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to reject application."
      );
    } finally {
      setActionLoading("");
    }
  };

  const filteredApplications = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return applications.filter(
      (application) => {
        const studentName =
          application?.student?.name
            ?.toLowerCase() ||
          application?.user?.name
            ?.toLowerCase() ||
          "";

        const studentEmail =
          application?.student?.email
            ?.toLowerCase() ||
          application?.user?.email
            ?.toLowerCase() ||
          "";

        const internshipTitle =
          application?.internship?.title
            ?.toLowerCase() ||
          application?.internshipTitle
            ?.toLowerCase() ||
          "";

        const company =
          typeof application?.company ===
          "string"
            ? application.company.toLowerCase()
            : application?.internship?.company
                ?.name
                ?.toLowerCase() ||
              application?.internship?.company
                ?.toLowerCase() ||
              "";

        const status =
          getStatus(application);

        const matchesSearch =
          !query ||
          studentName.includes(query) ||
          studentEmail.includes(query) ||
          internshipTitle.includes(
            query
          ) ||
          company.includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    applications,
    search,
    statusFilter,
  ]);

  const pendingCount =
    applications.filter(
      (item) =>
        getStatus(item) ===
        "pending"
    ).length;

  const approvedCount =
    applications.filter(
      (item) =>
        getStatus(item) ===
        "approved"
    ).length;

  const rejectedCount =
    applications.filter(
      (item) =>
        getStatus(item) ===
        "rejected"
    ).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiFileText size={13} />
              Application Operations
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Applications
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/60 sm:text-base">
              Review student internship applications and manage their
              operational status.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadApplications(true)
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={applications.length}
          icon={<FiFileText size={21} />}
        />

        <StatCard
          title="Pending"
          value={pendingCount}
          icon={<FiClock size={21} />}
        />

        <StatCard
          title="Approved"
          value={approvedCount}
          icon={<FiCheckCircle size={21} />}
        />

        <StatCard
          title="Rejected"
          value={rejectedCount}
          icon={<FiXCircle size={21} />}
        />
      </div>

      {/* Application Queue */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Toolbar */}
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Application Queue
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review student applications and take the required action.
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
                  placeholder="Search student or internship..."
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
                    statusFilter === "approved"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "approved"
                    )
                  }
                >
                  Approved
                </FilterButton>

                <FilterButton
                  active={
                    statusFilter === "rejected"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "rejected"
                    )
                  }
                >
                  Rejected
                </FilterButton>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredApplications.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {applications.length}
            </span>{" "}
            applications
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <LoadingState />
        ) : filteredApplications.length ===
          0 ? (
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
              <table className="w-full min-w-[1100px]">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Internship
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Company
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map(
                    (application) => {
                      const id =
                        application?._id;

                      const status =
                        getStatus(
                          application
                        );

                      const approving =
                        actionLoading ===
                        `approve-${id}`;

                      const rejecting =
                        actionLoading ===
                        `reject-${id}`;

                      const busy =
                        approving ||
                        rejecting;

                      return (
                        <tr
                          key={id}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <Avatar
                                application={
                                  application
                                }
                              />

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-900">
                                  {getStudentName(
                                    application
                                  )}
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                  <FiMail
                                    size={12}
                                  />
                                  {getStudentEmail(
                                    application
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                                <FiBriefcase
                                  size={16}
                                />
                              </div>

                              <span className="max-w-[220px] truncate text-sm font-semibold text-gray-800">
                                {getInternshipTitle(
                                  application
                                )}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm font-medium text-gray-600">
                            {getCompanyName(
                              application
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={status}
                            />
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedApplication(
                                    application
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                              >
                                <FiEye
                                  size={14}
                                />
                                View
                              </button>

                              {status ===
                                "pending" && (
                                <>
                                  <button
                                    type="button"
                                    disabled={
                                      busy
                                    }
                                    onClick={() =>
                                      approveApplication(
                                        id
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <FiCheckCircle
                                      size={14}
                                    />

                                    {approving
                                      ? "Approving..."
                                      : "Approve"}
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      busy
                                    }
                                    onClick={() =>
                                      rejectApplication(
                                        id
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <FiXCircle
                                      size={14}
                                    />

                                    {rejecting
                                      ? "Rejecting..."
                                      : "Reject"}
                                  </button>
                                </>
                              )}
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
              {filteredApplications.map(
                (application) => {
                  const id =
                    application?._id;

                  const status =
                    getStatus(
                      application
                    );

                  const approving =
                    actionLoading ===
                    `approve-${id}`;

                  const rejecting =
                    actionLoading ===
                    `reject-${id}`;

                  const busy =
                    approving ||
                    rejecting;

                  return (
                    <div
                      key={id}
                      className="p-5"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar
                          application={
                            application
                          }
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate font-semibold text-gray-900">
                                {getStudentName(
                                  application
                                )}
                              </h3>

                              <p className="mt-1 break-all text-sm text-gray-500">
                                {getStudentEmail(
                                  application
                                )}
                              </p>
                            </div>

                            <FiMoreVertical
                              size={18}
                              className="shrink-0 text-gray-300"
                            />
                          </div>

                          <div className="mt-4 rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Internship
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-800">
                              {getInternshipTitle(
                                application
                              )}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {getCompanyName(
                                application
                              )}
                            </p>
                          </div>

                          <div className="mt-3">
                            <StatusBadge
                              status={status}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedApplication(
                              application
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700"
                        >
                          <FiEye
                            size={15}
                          />
                          View Details
                        </button>

                        {status ===
                          "pending" && (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                approveApplication(
                                  id
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-xs font-semibold text-green-700 disabled:opacity-50"
                            >
                              <FiCheckCircle
                                size={15}
                              />

                              {approving
                                ? "Approving..."
                                : "Approve"}
                            </button>

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                rejectApplication(
                                  id
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                            >
                              <FiXCircle
                                size={15}
                              />

                              {rejecting
                                ? "Rejecting..."
                                : "Reject"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </section>

      {/* Details Modal */}
      {selectedApplication && (
        <ApplicationDetailsModal
          application={
            selectedApplication
          }
          onClose={() =>
            setSelectedApplication(null)
          }
        />
      )}
    </div>
  );
};


// =====================================================
// HELPERS
// =====================================================

const getStudentName = (
  application
) => {
  return (
    application?.student?.name ||
    application?.user?.name ||
    application?.name ||
    "Student"
  );
};

const getStudentEmail = (
  application
) => {
  return (
    application?.student?.email ||
    application?.user?.email ||
    application?.email ||
    "No email"
  );
};

const getInternshipTitle = (
  application
) => {
  return (
    application?.internship?.title ||
    application?.internshipTitle ||
    application?.title ||
    "Internship"
  );
};

const getCompanyName = (
  application
) => {
  if (
    typeof application?.company ===
    "string"
  ) {
    return application.company;
  }

  return (
    application?.company?.name ||
    application?.internship?.company?.name ||
    application?.internship?.company ||
    "Company"
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
// FILTER
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
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
        <FiCheckCircle size={13} />
        Approved
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
        <FiXCircle size={13} />
        Rejected
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
// AVATAR
// =====================================================

const Avatar = ({
  application,
}) => {
  const avatar =
    application?.student?.avatar ||
    application?.user?.avatar ||
    application?.avatar;

  const name = getStudentName(
    application
  );

  const avatarUrl = avatar
    ? avatar.startsWith("http")
      ? avatar
      : `http://localhost:5000${avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=D4AF37&color=fff&size=120`;

  return (
    <img
      src={avatarUrl}
      alt={name}
      className="h-12 w-12 shrink-0 rounded-full border-2 border-white bg-gray-100 object-cover shadow-sm"
      onError={(event) => {
        event.currentTarget.src =
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=D4AF37&color=fff&size=120`;
      }}
    />
  );
};


// =====================================================
// LOADING
// =====================================================

const LoadingState = () => {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-5 py-10">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 animate-spin items-center justify-center rounded-2xl border-4 border-gray-200 border-t-[#D4AF37]">
          <FiRefreshCw
            size={18}
            className="text-[#D4AF37]"
          />
        </div>

        <p className="mt-4 font-semibold text-gray-900">
          Loading applications...
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Fetching application records.
        </p>
      </div>
    </div>
  );
};


// =====================================================
// EMPTY
// =====================================================

const EmptyState = ({
  hasSearch,
  hasFilter,
}) => {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-5 py-10">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          <FiFileText size={25} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-gray-900">
          No applications found
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {hasSearch
            ? "Try another student or internship search."
            : hasFilter
              ? "No applications match the selected status."
              : "No applications are available yet."}
        </p>
      </div>
    </div>
  );
};


// =====================================================
// DETAILS MODAL
// =====================================================

const ApplicationDetailsModal = ({
  application,
  onClose,
}) => {
  const status = String(
    application?.status ||
      application?.applicationStatus ||
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
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Application Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review complete application information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
            <Avatar
              application={
                application
              }
            />

            <div className="min-w-0">
              <h3 className="font-bold text-gray-900">
                {getStudentName(
                  application
                )}
              </h3>

              <p className="mt-1 break-all text-sm text-gray-500">
                {getStudentEmail(
                  application
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem
              label="Internship"
              value={getInternshipTitle(
                application
              )}
              icon={
                <FiBriefcase
                  size={16}
                />
              }
            />

            <DetailItem
              label="Company"
              value={getCompanyName(
                application
              )}
              icon={
                <FiBriefcase
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
                "approved" ? (
                  <FiCheckCircle
                    size={16}
                  />
                ) : status ===
                  "rejected" ? (
                  <FiXCircle
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
              label="Application ID"
              value={
                application?._id ||
                "-"
              }
              icon={
                <FiFileText
                  size={16}
                />
              }
            />
          </div>

          {application?.coverLetter && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Cover Letter
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {application.coverLetter}
              </p>
            </div>
          )}

          {application?.portfolio && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Portfolio
              </p>

              <p className="mt-2 break-all text-sm font-medium text-gray-700">
                {application.portfolio}
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

export default Applications;