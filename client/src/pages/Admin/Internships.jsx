import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiAlertCircle,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiExternalLink,
  FiFileText,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";

import {
  getInternships,
  deleteInternship,
} from "../../services/internshipService";

import {
  approveInternship,
  rejectInternship,
} from "../../services/controlService";

import AddInternshipModal from "../../components/admin/AddInternshipModal";
import EditInternshipModal from "../../components/admin/EditInternshipModal";

const GOLD = "#D4AF37";

const Internships = () => {
  const [internships, setInternships] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedInternship, setSelectedInternship] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [processingId, setProcessingId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data =
        await getInternships();

      const list =
        data?.internships ||
        data?.data ||
        (Array.isArray(data)
          ? data
          : []);

      setInternships(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (err) {
      console.error(
        "ADMIN INTERNSHIPS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load internships."
      );

      setInternships([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (
    id
  ) => {
    if (!id) return;

    const confirmed =
      window.confirm(
        "Delete this internship?"
      );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteInternship(id);

      setInternships((prev) =>
        prev.filter(
          (item) =>
            item?._id !== id
        )
      );

      setSuccess(
        "Internship deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "DELETE INTERNSHIP ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete internship."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleApprove = async (
    id
  ) => {
    if (!id) return;

    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      await approveInternship(id);

      setInternships((prev) =>
        prev.map((item) =>
          item?._id === id
            ? {
                ...item,
                approvalStatus:
                  "Approved",
              }
            : item
        )
      );

      setSuccess(
        "Internship approved successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "APPROVE INTERNSHIP ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to approve internship."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (
    id
  ) => {
    if (!id) return;

    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      await rejectInternship(id);

      setInternships((prev) =>
        prev.map((item) =>
          item?._id === id
            ? {
                ...item,
                approvalStatus:
                  "Rejected",
              }
            : item
        )
      );

      setSuccess(
        "Internship rejected successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2200);
    } catch (err) {
      console.error(
        "REJECT INTERNSHIP ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to reject internship."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const stats = useMemo(() => {
    const approved =
      internships.filter(
        (item) =>
          String(
            item?.approvalStatus || ""
          ).toLowerCase() ===
          "approved"
      ).length;

    const pending =
      internships.filter(
        (item) =>
          !String(
            item?.approvalStatus || ""
          ).toLowerCase() ||
          String(
            item?.approvalStatus || ""
          ).toLowerCase() ===
            "pending"
      ).length;

    const rejected =
      internships.filter(
        (item) =>
          String(
            item?.approvalStatus || ""
          ).toLowerCase() ===
          "rejected"
      ).length;

    const applicants =
      internships.reduce(
        (sum, item) =>
          sum +
          Number(
            item?.applicants || 0
          ),
        0
      );

    return {
      total: internships.length,
      approved,
      pending,
      rejected,
      applicants,
    };
  }, [internships]);

  const filteredInternships =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return internships.filter(
        (item) => {
          const text = [
            item?.title,
            item?.company,
            item?.description,
            item?.location,
            item?.workMode,
            item?.approvalStatus,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !query ||
            text.includes(query);

          const status =
            String(
              item?.approvalStatus ||
                "Pending"
            ).toLowerCase();

          const matchesFilter =
            filter === "All" ||
            status ===
              filter.toLowerCase();

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      internships,
      search,
      filter,
    ]);

  if (loading) {
    return <InternshipsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiBriefcase
                  size={14}
                  style={{
                    color: GOLD,
                  }}
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Opportunity Control
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Internship Management
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                Manage internship publishing, approvals and opportunity
                quality across the SkilVira platform.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  fetchInternships(
                    true
                  )
                }
                disabled={
                  refreshing
                }
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
              >
                <FiRefreshCw
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowModal(true)
                }
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black"
                style={{
                  backgroundColor:
                    GOLD,
                }}
              >
                <FiPlus />
                Add Internship
              </button>
            </div>
          </div>
        </section>

        {/* ALERTS */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            {success}
          </div>
        )}

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Total"
            value={stats.total}
            icon={<FiBriefcase />}
            tone="gold"
          />

          <MetricCard
            label="Approved"
            value={stats.approved}
            icon={<FiCheckCircle />}
            tone="green"
          />

          <MetricCard
            label="Pending"
            value={stats.pending}
            icon={<FiClock />}
            tone="amber"
          />

          <MetricCard
            label="Rejected"
            value={stats.rejected}
            icon={<FiXCircle />}
            tone="red"
          />

          <MetricCard
            label="Applicants"
            value={stats.applicants}
            icon={<FiUsers />}
            tone="blue"
          />
        </div>

        {/* PIPELINE */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Publishing Pipeline
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-950">
              Opportunity health
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <PipelineBox
              title="Pending Review"
              value={stats.pending}
              icon={<FiClock />}
              description="Waiting for admin decision."
            />

            <PipelineBox
              title="Approved"
              value={stats.approved}
              icon={<FiCheckCircle />}
              description="Ready to be visible as approved opportunities."
            />

            <PipelineBox
              title="Total Applicants"
              value={stats.applicants}
              icon={<FiUsers />}
              description="Applications represented across internships."
            />
          </div>
        </section>

        {/* FILTER */}
        <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-2xl">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search internship, company, location or work mode..."
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Pending",
                "Approved",
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

        {/* TABLE */}
        <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Opportunity Directory
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-950 sm:text-2xl">
                Internship records
              </h2>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-600">
              {filteredInternships.length} result
              {filteredInternships.length !==
              1
                ? "s"
                : ""}
            </span>
          </div>

          {filteredInternships.length ===
          0 ? (
            <EmptyState
              hasFilters={
                Boolean(
                  search.trim()
                ) ||
                filter !== "All"
              }
              clear={() => {
                setSearch("");
                setFilter("All");
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FAFAF8]">
                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Internship
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Company
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Applicants
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Approval
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wide text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInternships.map(
                    (item) => (
                      <InternshipRow
                        key={
                          item?._id
                        }
                        item={item}
                        processingId={
                          processingId
                        }
                        deletingId={
                          deletingId
                        }
                        onApprove={
                          handleApprove
                        }
                        onReject={
                          handleReject
                        }
                        onDelete={
                          handleDelete
                        }
                        onEdit={() => {
                          setSelectedInternship(
                            item
                          );
                          setShowEditModal(
                            true
                          );
                        }}
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* ADD MODAL */}
      {showModal && (
        <AddInternshipModal
          onClose={() =>
            setShowModal(false)
          }
          onSuccess={() => {
            fetchInternships();
            setShowModal(false);

            setSuccess(
              "Internship created successfully."
            );

            setTimeout(() => {
              setSuccess("");
            }, 2200);
          }}
        />
      )}

      {/* EDIT MODAL */}
      {showEditModal &&
        selectedInternship && (
          <EditInternshipModal
            internship={
              selectedInternship
            }
            onClose={() => {
              setShowEditModal(
                false
              );
              setSelectedInternship(
                null
              );
            }}
            onSuccess={() => {
              fetchInternships();

              setShowEditModal(
                false
              );

              setSelectedInternship(
                null
              );

              setSuccess(
                "Internship updated successfully."
              );

              setTimeout(() => {
                setSuccess("");
              }, 2200);
            }}
          />
        )}
    </div>
  );
};

const InternshipRow = ({
  item,
  processingId,
  deletingId,
  onApprove,
  onReject,
  onDelete,
  onEdit,
}) => {
  const status =
    item?.approvalStatus ||
    "Pending";

  const normalized =
    String(status).toLowerCase();

  const approved =
    normalized ===
    "approved";

  const rejected =
    normalized ===
    "rejected";

  return (
    <tr className="border-b border-gray-100 transition hover:bg-[#FCFCFA]">
      <td className="px-5 py-5">
        <div className="flex items-center gap-3">
          {item?.internshipImage ? (
            <img
              src={getAssetUrl(
                item.internshipImage
              )}
              alt={
                item?.title ||
                "Internship"
              }
              className="h-12 w-12 rounded-xl bg-black object-cover"
            />
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-black"
              style={{
                backgroundColor:
                  GOLD,
              }}
            >
              <FiBriefcase />
            </div>
          )}

          <div className="min-w-0">
            <p className="max-w-[270px] truncate text-sm font-black text-gray-900">
              {item?.title ||
                "Untitled Internship"}
            </p>

            <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
              {item?.location && (
                <span>
                  {item.location}
                </span>
              )}

              {item?.workMode && (
                <span>
                  · {item.workMode}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      <td className="px-5 py-5">
        <p className="font-semibold text-gray-700">
          {item?.company ||
            "Company unavailable"}
        </p>

        {item?.recruiter?.name && (
          <p className="mt-1 text-xs text-gray-400">
            Recruiter:{" "}
            {item.recruiter.name}
          </p>
        )}
      </td>

      <td className="px-5 py-5">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-2 text-xs font-black text-gray-600">
          <FiUsers />
          {Number(
            item?.applicants || 0
          )}
        </span>
      </td>

      <td className="px-5 py-5">
        <StatusBadge
          status={status}
          approved={approved}
          rejected={rejected}
        />
      </td>

      <td className="px-5 py-5">
        <div className="flex justify-end gap-2">
          {!approved &&
            !rejected && (
              <button
                type="button"
                disabled={
                  processingId ===
                  item?._id
                }
                onClick={() =>
                  onApprove(
                    item?._id
                  )
                }
                className="rounded-xl px-3 py-2 text-xs font-black text-black disabled:opacity-50"
                style={{
                  backgroundColor:
                    GOLD,
                }}
              >
                Approve
              </button>
            )}

          {!rejected &&
            !approved && (
              <button
                type="button"
                disabled={
                  processingId ===
                  item?._id
                }
                onClick={() =>
                  onReject(
                    item?._id
                  )
                }
                className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            )}

          <button
            type="button"
            onClick={onEdit}
            className="rounded-xl border border-gray-200 bg-white p-2.5 text-blue-600 hover:border-blue-200"
          >
            <FiEdit2 />
          </button>

          <button
            type="button"
            disabled={
              deletingId ===
              item?._id
            }
            onClick={() =>
              onDelete(
                item?._id
              )
            }
            className="rounded-xl bg-red-50 p-2.5 text-red-600 disabled:opacity-50"
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
};

const StatusBadge = ({
  status,
  approved,
  rejected,
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${
      approved
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : rejected
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-amber-200 bg-amber-50 text-amber-700"
    }`}
  >
    {approved ? (
      <FiCheckCircle />
    ) : rejected ? (
      <FiXCircle />
    ) : (
      <FiClock />
    )}

    {status}
  </span>
);

const MetricCard = ({
  label,
  value,
  icon,
  tone,
}) => {
  const tones = {
    gold:
      "bg-[#D4AF37]/10 text-[#8D7414]",
    green:
      "bg-emerald-50 text-emerald-600",
    amber:
      "bg-amber-50 text-amber-600",
    red:
      "bg-red-50 text-red-600",
    blue:
      "bg-blue-50 text-blue-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
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
            tones[tone]
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const PipelineBox = ({
  title,
  value,
  icon,
  description,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-5">
    <div className="flex items-center gap-3">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl text-black"
        style={{
          backgroundColor: GOLD,
        }}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-black text-gray-900">
          {title}
        </p>

        <p className="text-2xl font-black text-gray-950">
          {value}
        </p>
      </div>
    </div>

    <p className="mt-4 text-xs leading-5 text-gray-500">
      {description}
    </p>
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
      <FiBriefcase size={28} />
    </div>

    <h3 className="mt-5 text-xl font-black text-gray-950">
      {hasFilters
        ? "No Matching Internships"
        : "No Internships Found"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {hasFilters
        ? "Try changing your search or approval filter."
        : "Create an internship to begin building the opportunity directory."}
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

const InternshipsSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1600px] animate-pulse space-y-6">
      <div className="h-64 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map(
          (item) => (
            <div
              key={item}
              className="h-32 rounded-3xl bg-white"
            />
          )
        )}
      </div>

      <div className="h-72 rounded-3xl bg-white" />
      <div className="h-20 rounded-3xl bg-white" />
      <div className="h-[550px] rounded-3xl bg-white" />
    </div>
  </div>
);

const getAssetUrl = (
  value
) => {
  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `http://localhost:5000${value}`;
};

export default Internships;