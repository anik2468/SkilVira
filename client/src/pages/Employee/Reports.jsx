import { API_ORIGIN, API_URL } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";

import {
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiEye,
  FiFileText,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiXCircle,
  FiSave,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  API_ORIGIN;

const Reports = () => {
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({});

  const [processingId, setProcessingId] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  // =====================================================
  // LOAD REPORTS
  // =====================================================

  const loadReports = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [pendingResponse, approvedResponse] =
        await Promise.all([
          api.get("/generated-report/pending"),
          api.get("/generated-report/approved"),
        ]);

      const pendingReports = Array.isArray(
        pendingResponse?.data?.reports
      )
        ? pendingResponse.data.reports
        : [];

      const approvedReports = Array.isArray(
        approvedResponse?.data?.reports
      )
        ? approvedResponse.data.reports
        : [];

      const mergedMap = new Map();

      [
        ...pendingReports,
        ...approvedReports,
      ].forEach((report) => {
        if (report?._id) {
          mergedMap.set(report._id, report);
        }
      });

      setReports(
        Array.from(mergedMap.values()).sort(
          (a, b) =>
            new Date(
              b?.createdAt || 0
            ).getTime() -
            new Date(
              a?.createdAt || 0
            ).getTime()
        )
      );
    } catch (err) {
      console.error(
        "Load generated reports error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load generated reports."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getStatus = (report) => {
    return String(
      report?.status || "pending"
    ).toLowerCase();
  };

  const getStudentName = (report) => {
    return (
      report?.student?.name ||
      report?.data?.studentName ||
      "Student"
    );
  };

  const getStudentEmail = (report) => {
    return (
      report?.student?.email ||
      "No email"
    );
  };

  const getProgramName = (report) => {
    return (
      report?.course?.title ||
      report?.data?.courseName ||
      report?.internship?.title ||
      "Program"
    );
  };

  const getReportId = (report) => {
    return (
      report?.reportId ||
      report?.data?.reportId ||
      report?._id ||
      "-"
    );
  };

  const getIssueDate = (report) => {
    return (
      report?.data?.issueDate ||
      report?.createdAt ||
      null
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "-";
    }

    return value.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const reportFileUrl = (file) => {
    if (!file) return "";

    if (
      file.startsWith("http://") ||
      file.startsWith("https://")
    ) {
      return file;
    }

    return `${API_BASE}${file}`;
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredReports = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return reports.filter((report) => {
      const studentName =
        getStudentName(report)
          .toLowerCase();

      const studentEmail =
        getStudentEmail(report)
          .toLowerCase();

      const programName =
        getProgramName(report)
          .toLowerCase();

      const reportId =
        String(getReportId(report))
          .toLowerCase();

      const status =
        getStatus(report);

      const matchesSearch =
        !query ||
        studentName.includes(query) ||
        studentEmail.includes(query) ||
        programName.includes(query) ||
        reportId.includes(query);

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

  // =====================================================
  // EDIT
  // =====================================================

  const startEditing = (report) => {
    setEditingId(report?._id);

    setEditData({
      studentName:
        report?.data?.studentName ||
        report?.student?.name ||
        "",

      courseName:
        report?.data?.courseName ||
        report?.course?.title ||
        report?.internship?.title ||
        "",

      marks:
        report?.data?.marks || "",

      grade:
        report?.data?.grade || "",

      attendance:
        report?.data?.attendance || "",

      duration:
        report?.data?.duration || "",

      performance:
        report?.data?.performance || "",

      feedback:
        report?.data?.feedback || "",

      issueDate:
        report?.data?.issueDate ||
        "",

      reportId:
        report?.reportId ||
        report?.data?.reportId ||
        "",

      instructorName:
        report?.data?.instructorName ||
        "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveChanges = async (id) => {
    if (!id) return;

    try {
      setProcessingId(id);
      setError("");

      await api.put(
        `/generated-report/${id}/update`,
        {
          data: editData,
        }
      );

      setSuccess(
        "Report details updated successfully."
      );

      cancelEditing();

      await loadReports(true);

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "Update report error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update report."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // APPROVE
  // =====================================================

  const approveReport = async (id) => {
    if (!id) return;

    const confirmed =
      window.confirm(
        "Approve this report and send it to the student?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(id);
      setError("");

      await api.put(
        `/generated-report/${id}/approve`
      );

      setSuccess(
        "Report approved and processed successfully."
      );

      setSelectedReport(null);

      await loadReports(true);

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "Approve report error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to approve report."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // REVISION
  // =====================================================

  const requestRevision = async (id) => {
    if (!id) return;

    const remark =
      window.prompt(
        "Enter revision instructions for the report:"
      );

    if (!remark?.trim()) {
      return;
    }

    try {
      setProcessingId(id);
      setError("");

      await api.put(
        `/generated-report/${id}/revision`,
        {
          remark: remark.trim(),
        }
      );

      setSuccess(
        "Revision request sent successfully."
      );

      setSelectedReport(null);

      await loadReports(true);

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "Request report revision error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to request report revision."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // REJECT
  // =====================================================

  const rejectReport = async (id) => {
    if (!id) return;

    const reason =
      window.prompt(
        "Enter rejection reason:"
      );

    if (!reason?.trim()) {
      return;
    }

    try {
      setProcessingId(id);
      setError("");

      await api.put(
        `/generated-report/${id}/reject`,
        {
          reason: reason.trim(),
        }
      );

      setSuccess(
        "Report rejected successfully."
      );

      setSelectedReport(null);

      await loadReports(true);

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "Reject report error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to reject report."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // STATS
  // =====================================================

  const stats = useMemo(() => {
    return {
      total: reports.length,

      pending: reports.filter(
        (item) =>
          getStatus(item) === "pending"
      ).length,

      revision: reports.filter(
        (item) =>
          getStatus(item) === "revision"
      ).length,

      approved: reports.filter(
        (item) =>
          getStatus(item) === "approved"
      ).length,

      rejected: reports.filter(
        (item) =>
          getStatus(item) === "rejected"
      ).length,
    };
  }, [reports]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <FiRefreshCw
            size={42}
            className="mx-auto animate-spin text-[#D4AF37]"
          />

          <p className="mt-4 font-semibold text-gray-800">
            Loading Reports...
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Fetching generated report verification queue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiFileText size={14} />
              Report Operations
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Report Verification
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/60 sm:text-base">
              Review generated student reports before
              approval, rejection or final delivery.
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

      {/* ================================================= */}
      {/* ALERTS */}
      {/* ================================================= */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiXCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto font-bold"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm text-green-700">
          <FiCheckCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total"
          value={stats.total}
          icon={<FiFileText size={21} />}
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<FiClock size={21} />}
        />

        <StatCard
          title="Revision"
          value={stats.revision}
          icon={<FiRefreshCw size={21} />}
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<FiCheckCircle size={21} />}
        />

        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<FiXCircle size={21} />}
        />
      </div>

      {/* ================================================= */}
      {/* MAIN TABLE */}
      {/* ================================================= */}

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Generated Reports
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search and verify generated reports.
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
                  placeholder="Search student, report ID..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
                />
              </div>

              <div className="flex flex-wrap rounded-xl bg-gray-100 p-1">
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
                    "revision"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "revision"
                    )
                  }
                >
                  Revision
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
              {filteredReports.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {reports.length}
            </span>{" "}
            reports
          </p>
        </div>

        {filteredReports.length === 0 ? (
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
                      Program
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Report ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Date
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
                  {filteredReports.map(
                    (report) => {
                      const id =
                        report?._id;

                      const status =
                        getStatus(report);

                      const processing =
                        processingId === id;

                      return (
                        <tr
                          key={id}
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
                                  {getStudentName(
                                    report
                                  )}
                                </p>

                                <p className="mt-1 truncate text-xs text-gray-500">
                                  {getStudentEmail(
                                    report
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="max-w-[230px]">
                              <p className="truncate text-sm font-semibold text-gray-800">
                                {getProgramName(
                                  report
                                )}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="break-all font-mono text-xs font-semibold text-gray-600">
                              {getReportId(
                                report
                              )}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-500">
                            {formatDate(
                              getIssueDate(
                                report
                              )
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={
                                status
                              }
                            />
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
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

                              {(status ===
                                "pending" ||
                                status ===
                                  "revision") && (
                                <>
                                  <button
                                    type="button"
                                    disabled={
                                      processing
                                    }
                                    onClick={() =>
                                      approveReport(
                                        id
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <FiCheckCircle
                                      size={14}
                                    />

                                    Approve
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      processing
                                    }
                                    onClick={() =>
                                      requestRevision(
                                        id
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/5 px-3 py-2 text-xs font-semibold text-[#9b7a0c] transition hover:bg-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <FiRefreshCw
                                      size={14}
                                    />

                                    Revision
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      processing
                                    }
                                    onClick={() =>
                                      rejectReport(
                                        id
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <FiXCircle
                                      size={14}
                                    />

                                    Reject
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
              {filteredReports.map(
                (report) => {
                  const id =
                    report?._id;

                  const status =
                    getStatus(report);

                  const processing =
                    processingId === id;

                  return (
                    <div
                      key={id}
                      className="p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                          <FiUser
                            size={17}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-gray-900">
                            {getStudentName(
                              report
                            )}
                          </h3>

                          <p className="mt-1 truncate text-sm text-gray-500">
                            {getStudentEmail(
                              report
                            )}
                          </p>

                          <div className="mt-4 rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Program
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-800">
                              {getProgramName(
                                report
                              )}
                            </p>

                            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Report ID
                            </p>

                            <p className="mt-1 break-all font-mono text-xs font-semibold text-gray-700">
                              {getReportId(
                                report
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

                      <div className="mt-4 grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedReport(
                              report
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700"
                        >
                          <FiEye
                            size={15}
                          />
                          View Details
                        </button>

                        {(status ===
                          "pending" ||
                          status ===
                            "revision") && (
                          <>
                            <button
                              type="button"
                              disabled={
                                processing
                              }
                              onClick={() =>
                                approveReport(
                                  id
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
                            >
                              <FiCheckCircle
                                size={15}
                              />
                              Approve
                            </button>

                            <button
                              type="button"
                              disabled={
                                processing
                              }
                              onClick={() =>
                                requestRevision(
                                  id
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37] bg-[#D4AF37]/5 px-3 py-2.5 text-xs font-semibold text-[#9b7a0c] disabled:opacity-50"
                            >
                              <FiRefreshCw
                                size={15}
                              />
                              Request Revision
                            </button>

                            <button
                              type="button"
                              disabled={
                                processing
                              }
                              onClick={() =>
                                rejectReport(
                                  id
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
                            >
                              <FiXCircle
                                size={15}
                              />
                              Reject
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

      {/* ================================================= */}
      {/* DETAILS MODAL */}
      {/* ================================================= */}

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          editing={
            editingId ===
            selectedReport._id
          }
          editData={editData}
          processingId={processingId}
          onEdit={() =>
            startEditing(
              selectedReport
            )
          }
          onChange={handleEditChange}
          onSave={() =>
            saveChanges(
              selectedReport._id
            )
          }
          onCancel={cancelEditing}
          onApprove={() =>
            approveReport(
              selectedReport._id
            )
          }
          onRevision={() =>
            requestRevision(
              selectedReport._id
            )
          }
          onReject={() =>
            rejectReport(
              selectedReport._id
            )
          }
          onClose={() => {
            cancelEditing();
            setSelectedReport(null);
          }}
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

  if (status === "revision") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#9b7a0c]">
        <FiRefreshCw size={13} />
        Revision
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
// REPORT DETAILS MODAL
// =====================================================

const ReportDetailsModal = ({
  report,
  editing,
  editData,
  processingId,
  onEdit,
  onChange,
  onSave,
  onCancel,
  onApprove,
  onRevision,
  onReject,
  onClose,
}) => {
  const id = report?._id;
  const processing =
    processingId === id;

  const fileUrl =
    report?.reportFile
      ? reportFileUrlHelper(
          report.reportFile
        )
      : "";

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
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-gray-900">
              Report Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {getProgramNameHelper(
                report
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* Student */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiUser size={21} />
              </div>

              <div>
                <p className="font-bold text-gray-900">
                  {getStudentNameHelper(
                    report
                  )}
                </p>

                <p className="text-sm text-gray-500">
                  {getStudentEmailHelper(
                    report
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          {editing ? (
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
              <div className="mb-5 flex items-center gap-2">
                <FiEdit3
                  className="text-[#D4AF37]"
                  size={18}
                />

                <h3 className="font-bold text-gray-900">
                  Edit Report Details
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Student Name"
                  name="studentName"
                  value={
                    editData.studentName ||
                    ""
                  }
                  onChange={onChange}
                />

                <Field
                  label="Course / Program"
                  name="courseName"
                  value={
                    editData.courseName ||
                    ""
                  }
                  onChange={onChange}
                />

                <Field
                  label="Marks"
                  name="marks"
                  value={
                    editData.marks || ""
                  }
                  onChange={onChange}
                />

                <Field
                  label="Grade"
                  name="grade"
                  value={
                    editData.grade || ""
                  }
                  onChange={onChange}
                />

                <Field
                  label="Attendance"
                  name="attendance"
                  value={
                    editData.attendance ||
                    ""
                  }
                  onChange={onChange}
                />

                <Field
                  label="Duration"
                  name="duration"
                  value={
                    editData.duration || ""
                  }
                  onChange={onChange}
                />

                <Field
                  label="Performance"
                  name="performance"
                  value={
                    editData.performance ||
                    ""
                  }
                  onChange={onChange}
                />

                <Field
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  value={
                    editData.issueDate ||
                    ""
                  }
                  onChange={onChange}
                />

                <Field
                  label="Report ID"
                  name="reportId"
                  value={
                    editData.reportId || ""
                  }
                  onChange={onChange}
                />

                <Field
                  label="Instructor Name"
                  name="instructorName"
                  value={
                    editData.instructorName ||
                    ""
                  }
                  onChange={onChange}
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Feedback
                  </label>

                  <textarea
                    name="feedback"
                    value={
                      editData.feedback ||
                      ""
                    }
                    onChange={onChange}
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-gray-900">
                  Report Information
                </h3>

                <StatusBadge
                  status={getStatusHelper(
                    report
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Info
                  label="Program"
                  value={getProgramNameHelper(
                    report
                  )}
                />

                <Info
                  label="Report ID"
                  value={
                    report?.reportId ||
                    report?.data
                      ?.reportId ||
                    "-"
                  }
                />

                <Info
                  label="Issue Date"
                  value={formatDateHelper(
                    report?.data
                      ?.issueDate
                  )}
                />

                <Info
                  label="Marks"
                  value={
                    report?.data?.marks
                  }
                />

                <Info
                  label="Grade"
                  value={
                    report?.data?.grade
                  }
                />

                <Info
                  label="Attendance"
                  value={
                    report?.data
                      ?.attendance
                  }
                />

                <Info
                  label="Duration"
                  value={
                    report?.data
                      ?.duration
                  }
                />

                <Info
                  label="Performance"
                  value={
                    report?.data
                      ?.performance
                  }
                />

                <Info
                  label="Instructor"
                  value={
                    report?.data
                      ?.instructorName
                  }
                />

                <div className="sm:col-span-2 lg:col-span-3">
                  <Info
                    label="Feedback"
                    value={
                      report?.data
                        ?.feedback
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Existing employee remark */}
          {report?.employeeRemark && (
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#9b7a0c]">
                Employee Remark
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-700">
                {report.employeeRemark}
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-gray-900">
                  Generated Report
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Preview the generated file when available.
                </p>
              </div>

              {fileUrl ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                >
                  <FiEye size={17} />
                  Preview Report
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-400">
                  <FiFileText size={17} />
                  Preview not generated
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={processing}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiSave size={17} />

                  {processing
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  disabled={processing}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onEdit}
                  disabled={processing}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-50"
                >
                  <FiEdit3 size={17} />
                  Edit Details
                </button>

                {(getStatusHelper(
                  report
                ) === "pending" ||
                  getStatusHelper(
                    report
                  ) === "revision") && (
                  <>
                    <button
                      type="button"
                      onClick={onApprove}
                      disabled={processing}
                      className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiCheckCircle
                        size={17}
                      />

                      {processing
                        ? "Processing..."
                        : "Approve & Send"}
                    </button>

                    <button
                      type="button"
                      onClick={onRevision}
                      disabled={processing}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37] bg-[#D4AF37]/5 px-5 py-3 text-sm font-semibold text-[#9b7a0c] transition hover:bg-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiRefreshCw
                        size={17}
                      />

                      Request Revision
                    </button>

                    <button
                      type="button"
                      onClick={onReject}
                      disabled={processing}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiXCircle
                        size={17}
                      />

                      Reject
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// FIELD
// =====================================================

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
      />
    </div>
  );
};

// =====================================================
// INFO
// =====================================================

const Info = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = ({
  hasSearch,
  hasFilter,
}) => {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
        <FiFileText size={28} />
      </div>

      <h3 className="mt-5 text-xl font-bold text-gray-900">
        No Reports Found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasSearch || hasFilter
          ? "No generated reports match your current search or status filter."
          : "There are currently no generated reports in the verification list."}
      </p>
    </div>
  );
};

// =====================================================
// HELPERS FOR MODAL
// =====================================================

const getStatusHelper = (report) => {
  return String(
    report?.status || "pending"
  ).toLowerCase();
};

const getStudentNameHelper = (
  report
) => {
  return (
    report?.student?.name ||
    report?.data?.studentName ||
    "Student"
  );
};

const getStudentEmailHelper = (
  report
) => {
  return (
    report?.student?.email ||
    "No email"
  );
};

const getProgramNameHelper = (
  report
) => {
  return (
    report?.course?.title ||
    report?.data?.courseName ||
    report?.internship?.title ||
    "Program"
  );
};

const formatDateHelper = (date) => {
  if (!date) return "-";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "-";
  }

  return value.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const reportFileUrlHelper = (
  file
) => {
  if (!file) return "";

  if (
    file.startsWith("http://") ||
    file.startsWith("https://")
  ) {
    return file;
  }

  const base =
    import.meta.env.VITE_API_URL ||
    API_ORIGIN;

  return `${base}${file}`;
};

export default Reports;