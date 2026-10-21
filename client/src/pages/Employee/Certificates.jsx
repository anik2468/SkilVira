import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiAward,
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiUser,
  FiMail,
  FiBriefcase,
  FiFileText,
  FiShield,
  FiArrowUpRight,
  FiMoreVertical,
  FiAlertCircle,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE = API_ORIGIN;

const Certificates = () => {
  const [certificates, setCertificates] =
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

  const [selectedCertificate, setSelectedCertificate] =
    useState(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      /*
       * Employee certificate queue.
       * The endpoint can return:
       * { certificates: [...] }
       * or the array directly.
       */
      const response = await api.get(
        "/generated-certificates/pending"
      );

      const data =
        response?.data || {};

      const list =
        Array.isArray(data?.certificates)
          ? data.certificates
          : Array.isArray(data)
            ? data
            : [];

      setCertificates(list);
    } catch (err) {
      console.error(
        "Load certificates error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load certificates."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatus = (certificate) => {
    return String(
      certificate?.status ||
        certificate?.approvalStatus ||
        "pending"
    ).toLowerCase();
  };

  const approveCertificate = async (id) => {
    const confirmed = window.confirm(
      "Approve this certificate?"
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
        `/generated-certificates/${id}/approve`
      );

      await loadCertificates(true);
    } catch (err) {
      console.error(
        "Approve certificate error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to approve certificate."
      );
    } finally {
      setActionLoading("");
    }
  };

  const rejectCertificate = async (id) => {
    const confirmed = window.confirm(
      "Reject this certificate?"
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
        `/generated-certificates/${id}/reject`
      );

      await loadCertificates(true);
    } catch (err) {
      console.error(
        "Reject certificate error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to reject certificate."
      );
    } finally {
      setActionLoading("");
    }
  };

  const filteredCertificates = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return certificates.filter(
      (certificate) => {
        const studentName =
          certificate?.student?.name
            ?.toLowerCase() ||
          certificate?.user?.name
            ?.toLowerCase() ||
          certificate?.studentName
            ?.toLowerCase() ||
          "";

        const studentEmail =
          certificate?.student?.email
            ?.toLowerCase() ||
          certificate?.user?.email
            ?.toLowerCase() ||
          "";

        const courseName =
          certificate?.course?.title
            ?.toLowerCase() ||
          certificate?.courseName
            ?.toLowerCase() ||
          certificate?.internship?.title
            ?.toLowerCase() ||
          certificate?.internshipTitle
            ?.toLowerCase() ||
          "";

        const certificateNumber =
          String(
            certificate?.certificateNumber ||
              certificate?.certificateId ||
              certificate?.serialNumber ||
              ""
          ).toLowerCase();

        const status =
          getStatus(certificate);

        const matchesSearch =
          !query ||
          studentName.includes(query) ||
          studentEmail.includes(query) ||
          courseName.includes(query) ||
          certificateNumber.includes(
            query
          );

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
    certificates,
    search,
    statusFilter,
  ]);

  const pendingCount =
    certificates.filter(
      (item) =>
        getStatus(item) === "pending"
    ).length;

  const approvedCount =
    certificates.filter(
      (item) =>
        getStatus(item) === "approved"
    ).length;

  const rejectedCount =
    certificates.filter(
      (item) =>
        getStatus(item) === "rejected"
    ).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiShield size={13} />
              Certificate Operations
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Certificate Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/60 sm:text-base">
              Review generated certificates and manage their verification
              status before final delivery.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadCertificates(true)
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
          title="Total Certificates"
          value={certificates.length}
          icon={<FiAward size={21} />}
        />

        <StatCard
          title="Pending Review"
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

      {/* Queue */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Toolbar */}
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Certificate Queue
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review certificate records and take the appropriate action.
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
                  placeholder="Search student or certificate..."
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
                    statusFilter ===
                    "pending"
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
                    statusFilter ===
                    "approved"
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
                    statusFilter ===
                    "rejected"
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
              {filteredCertificates.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {certificates.length}
            </span>{" "}
            certificates
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <LoadingState />
        ) : filteredCertificates.length ===
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
              <table className="w-full min-w-[1050px]">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Program
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Certificate ID
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
                  {filteredCertificates.map(
                    (certificate) => {
                      const id =
                        certificate?._id;

                      const status =
                        getStatus(
                          certificate
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
                              <CertificateAvatar
                                certificate={
                                  certificate
                                }
                              />

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-900">
                                  {getStudentName(
                                    certificate
                                  )}
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                  <FiMail
                                    size={12}
                                  />

                                  {getStudentEmail(
                                    certificate
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
                                {getProgramName(
                                  certificate
                                )}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="break-all font-mono text-xs font-semibold text-gray-600">
                              {getCertificateId(
                                certificate
                              )}
                            </span>
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
                                  setSelectedCertificate(
                                    certificate
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
                                      approveCertificate(
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
                                      rejectCertificate(
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
              {filteredCertificates.map(
                (certificate) => {
                  const id =
                    certificate?._id;

                  const status =
                    getStatus(
                      certificate
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
                        <CertificateAvatar
                          certificate={
                            certificate
                          }
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate font-semibold text-gray-900">
                                {getStudentName(
                                  certificate
                                )}
                              </h3>

                              <p className="mt-1 break-all text-sm text-gray-500">
                                {getStudentEmail(
                                  certificate
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
                              Program
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-800">
                              {getProgramName(
                                certificate
                              )}
                            </p>

                            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Certificate ID
                            </p>

                            <p className="mt-1 break-all font-mono text-xs font-semibold text-gray-700">
                              {getCertificateId(
                                certificate
                              )}
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

                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCertificate(
                              certificate
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
                                approveCertificate(
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
                                rejectCertificate(
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
      {selectedCertificate && (
        <CertificateDetailsModal
          certificate={
            selectedCertificate
          }
          onClose={() =>
            setSelectedCertificate(
              null
            )
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
  certificate
) => {
  return (
    certificate?.student?.name ||
    certificate?.user?.name ||
    certificate?.studentName ||
    "Student"
  );
};

const getStudentEmail = (
  certificate
) => {
  return (
    certificate?.student?.email ||
    certificate?.user?.email ||
    certificate?.studentEmail ||
    "No email"
  );
};

const getProgramName = (
  certificate
) => {
  return (
    certificate?.course?.title ||
    certificate?.courseName ||
    certificate?.internship?.title ||
    certificate?.internshipTitle ||
    certificate?.programName ||
    "Program"
  );
};

const getCertificateId = (
  certificate
) => {
  return (
    certificate?.certificateNumber ||
    certificate?.certificateId ||
    certificate?.serialNumber ||
    certificate?._id ||
    "-"
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
// STATUS
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

const CertificateAvatar = ({
  certificate,
}) => {
  const avatar =
    certificate?.student?.avatar ||
    certificate?.user?.avatar ||
    certificate?.avatar;

  const name = getStudentName(
    certificate
  );

  const avatarUrl = avatar
    ? avatar.startsWith("http")
      ? avatar
      : `${API_BASE}${avatar}`
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
          Loading certificates...
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Fetching certificate records.
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
          <FiAward size={25} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-gray-900">
          No certificates found
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {hasSearch
            ? "Try another student, program or certificate ID."
            : hasFilter
              ? "No certificates match the selected status."
              : "No certificate records are available yet."}
        </p>
      </div>
    </div>
  );
};


// =====================================================
// DETAILS MODAL
// =====================================================

const CertificateDetailsModal = ({
  certificate,
  onClose,
}) => {
  const status =
    String(
      certificate?.status ||
        certificate?.approvalStatus ||
        "pending"
    ).toLowerCase();

  const file =
    certificate?.fileUrl ||
    certificate?.certificateUrl ||
    certificate?.file ||
    certificate?.documentUrl;

  const fileUrl = file
    ? file.startsWith("http")
      ? file
      : `${API_BASE}${file}`
    : null;

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
              Certificate Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review certificate information.
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
            <CertificateAvatar
              certificate={
                certificate
              }
            />

            <div className="min-w-0">
              <h3 className="font-bold text-gray-900">
                {getStudentName(
                  certificate
                )}
              </h3>

              <p className="mt-1 break-all text-sm text-gray-500">
                {getStudentEmail(
                  certificate
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem
              label="Program"
              value={getProgramName(
                certificate
              )}
              icon={
                <FiBriefcase
                  size={16}
                />
              }
            />

            <DetailItem
              label="Certificate ID"
              value={getCertificateId(
                certificate
              )}
              icon={
                <FiFileText
                  size={16}
                />
              }
            />

            <DetailItem
              label="Status"
              value={capitalize(
                status
              )}
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
              label="Created"
              value={
                certificate?.createdAt
                  ? formatDate(
                      certificate.createdAt
                    )
                  : "-"
              }
              icon={
                <FiClock size={16} />
              }
            />
          </div>

          {certificate?.remarks && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Remarks
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {certificate.remarks}
              </p>
            </div>
          )}

          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c29f32]"
            >
              <FiEye size={17} />
              Open Certificate
            </a>
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


// =====================================================
// CAPITALIZE
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

export default Certificates;