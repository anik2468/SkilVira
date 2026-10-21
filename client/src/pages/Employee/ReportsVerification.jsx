import { API_ORIGIN, API_URL } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";

import {
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiEye,
  FiSave,
  FiRefreshCw,
  FiFileText,
  FiSearch,
  FiUser,
  FiX,
  FiExternalLink,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(
    /\/api\/?$/,
    ""
  ) || API_ORIGIN;

const EMPTY_EDIT_DATA = {
  studentName: "",
  courseName: "",
  marks: "",
  grade: "",
  attendance: "",
  performance: "",
  feedback: "",
  duration: "",
  issueDate: "",
  reportId: "",
  instructorName: "",
};

const ReportsVerification = () => {
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] =
    useState(EMPTY_EDIT_DATA);

  const [selectedReport, setSelectedReport] =
    useState(null);

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/generated-report/pending"
      );

      setReports(
        data?.reports ||
          data?.generatedReports ||
          []
      );
    } catch (error) {
      console.error(
        "Load generated reports error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load report verification queue."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const startEdit = (report) => {
    setEditingId(report?._id || null);

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

      marks: report?.data?.marks || "",

      grade: report?.data?.grade || "",

      attendance:
        report?.data?.attendance || "",

      performance:
        report?.data?.performance || "",

      feedback:
        report?.data?.feedback || "",

      duration:
        report?.data?.duration || "",

      issueDate:
        report?.data?.issueDate || "",

      reportId:
        report?.data?.reportId ||
        report?.reportId ||
        "",

      instructorName:
        report?.data?.instructorName ||
        "",
    });
  };

  // =====================================================
  // CHANGE
  // =====================================================

  const changeHandler = (event) => {
    const {
      name,
      value,
    } = event.target;

    setEditData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEditing = () => {
    setEditingId(null);
    setEditData(EMPTY_EDIT_DATA);
  };

  // =====================================================
  // SAVE CHANGES
  // =====================================================

  const saveChanges = async (id) => {
    try {
      setProcessingId(id);

      const { data } = await api.put(
        `/generated-report/${id}/update`,
        {
          data: editData,
        }
      );

      if (data?.success === false) {
        throw new Error(
          data?.message ||
            "Failed to update report."
        );
      }

      alert(
        "Report details updated successfully."
      );

      cancelEditing();
      setSelectedReport(null);

      await loadReports();
    } catch (error) {
      console.error(
        "Update report error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update report."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // REQUEST REVISION
  // =====================================================

  const requestRevision = async (report) => {
    const remark = window.prompt(
      "Enter correction/revision instructions:"
    );

    if (!remark?.trim()) {
      return;
    }

    try {
      setProcessingId(
        report?._id
      );

      const { data } = await api.put(
        `/generated-report/${report._id}/revision`,
        {
          remark: remark.trim(),
        }
      );

      if (data?.success === false) {
        throw new Error(
          data?.message ||
            "Failed to request report revision."
        );
      }

      alert(
        "Report revision requested successfully."
      );

      setSelectedReport(null);

      await loadReports();
    } catch (error) {
      console.error(
        "Request report revision error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to request report revision."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // APPROVE
  // =====================================================

  const approveReport = async (report) => {
    const studentName =
      report?.student?.name ||
      report?.data?.studentName ||
      "this student";

    const confirmed =
      window.confirm(
        `Approve report for ${studentName}?\n\n` +
          "The approved report will become the final verified report."
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(
        report?._id
      );

      const { data } = await api.put(
        `/generated-report/${report._id}/approve`
      );

      if (data?.success === false) {
        throw new Error(
          data?.message ||
            "Failed to approve report."
        );
      }

      alert(
        data?.message ||
          "Report approved successfully."
      );

      setSelectedReport(null);

      await loadReports();
    } catch (error) {
      console.error(
        "Approve report error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to approve report."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // REJECT
  // =====================================================

  const rejectReport = async (report) => {
    const reason = window.prompt(
      "Enter rejection reason:"
    );

    if (!reason?.trim()) {
      return;
    }

    try {
      setProcessingId(
        report?._id
      );

      const { data } = await api.put(
        `/generated-report/${report._id}/reject`,
        {
          reason: reason.trim(),
        }
      );

      if (data?.success === false) {
        throw new Error(
          data?.message ||
            "Failed to reject report."
        );
      }

      alert(
        data?.message ||
          "Report rejected successfully."
      );

      setSelectedReport(null);

      await loadReports();
    } catch (error) {
      console.error(
        "Reject report error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to reject report."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredReports = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return reports;
    }

    return reports.filter(
      (report) => {
        const studentName =
          report?.student?.name ||
          report?.data?.studentName ||
          "";

        const studentEmail =
          report?.student?.email ||
          "";

        const courseName =
          report?.course?.title ||
          report?.internship?.title ||
          report?.data?.courseName ||
          "";

        const reportId =
          report?.reportId ||
          report?.data?.reportId ||
          "";

        const instructor =
          report?.data?.instructorName ||
          "";

        const searchable = [
          studentName,
          studentEmail,
          courseName,
          reportId,
          instructor,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(
          keyword
        );
      }
    );
  }, [reports, search]);

  // =====================================================
  // FILE URL
  // =====================================================

  const getFileUrl = (file) => {
    if (!file) {
      return "";
    }

    let value = file;

    if (typeof file === "object") {
      value =
        file?.url ||
        file?.path ||
        file?.location ||
        file?.secure_url ||
        "";
    }

    if (!value) {
      return "";
    }

    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    return `${API_BASE}${
      value.startsWith("/")
        ? ""
        : "/"
    }${value}`;
  };

  // =====================================================
  // PROGRAM NAME
  // =====================================================

  const getProgramName = (report) => {
    return (
      report?.course?.title ||
      report?.internship?.title ||
      report?.data?.courseName ||
      "Program"
    );
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusClasses = (status) => {
    switch (status) {
      case "revision":
        return "bg-orange-100 text-orange-700";

      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // =====================================================
  // OPEN REVIEW
  // =====================================================

  const openReview = (report) => {
    setSelectedReport(report);
  };

  const closeReview = () => {
    if (processingId) {
      return;
    }

    setSelectedReport(null);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FiRefreshCw className="animate-spin text-5xl text-[#D4AF37]" />

          <p className="text-sm font-semibold text-slate-500">
            Loading report verification queue...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-8">
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF8E7]">
              <FiFileText className="text-[#D4AF37]" />
            </span>

            Report Verification
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Review, edit and approve generated student
            reports before final verification.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReports}
          disabled={Boolean(processingId)}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw />

          Refresh
        </button>
      </div>

      {/* =================================================
          SEARCH
      ================================================== */}

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-xl">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search student, email, program, report ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[#D4AF37] focus:bg-white"
          />
        </div>

        <div className="w-fit rounded-2xl bg-[#FFF8E7] px-5 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Pending Reports
          </p>

          <p className="mt-1 text-2xl font-black text-slate-900">
            {filteredReports.length}
          </p>
        </div>
      </div>

      {/* =================================================
          EMPTY
      ================================================== */}

      {filteredReports.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <FiCheckCircle className="mx-auto text-6xl text-green-500" />

          <h2 className="mt-5 text-2xl font-black text-slate-900">
            {search
              ? "No Matching Reports"
              : "No Pending Reports"}
          </h2>

          <p className="mt-2 text-sm font-medium text-slate-500">
            {search
              ? "Try another student, program or report ID."
              : "Generated reports waiting for verification will appear here."}
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-black text-black"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        /* =================================================
           REPORT LIST
        ================================================== */

        <div className="space-y-6">
          {filteredReports.map(
            (report) => {
              const isEditing =
                editingId ===
                report?._id;

              const isProcessing =
                processingId ===
                report?._id;

              const reportFile =
                getFileUrl(
                  report?.reportFile
                );

              return (
                <div
                  key={report?._id}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
                >
                  <div className="p-6">
                    {/* TOP */}
                    <div className="flex flex-col gap-5 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF8E7]">
                          <FiUser className="text-xl text-[#D4AF37]" />
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-xl font-black text-slate-900">
                            {report?.student
                              ?.name ||
                              report?.data
                                ?.studentName ||
                              "Student"}
                          </h2>

                          <p className="break-all text-sm font-medium text-slate-500">
                            {report?.student
                              ?.email ||
                              "No email"}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-400">
                            {getProgramName(
                              report
                            )}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full px-4 py-2 text-xs font-black capitalize ${getStatusClasses(
                          report?.status
                        )}`}
                      >
                        {report?.status ||
                          "pending"}
                      </span>
                    </div>

                    {/* SUMMARY */}
                    <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Info
                        label="Program"
                        value={getProgramName(
                          report
                        )}
                      />

                      <Info
                        label="Report ID"
                        value={
                          report?.reportId ||
                          report?.data
                            ?.reportId
                        }
                      />

                      <Info
                        label="Instructor"
                        value={
                          report?.data
                            ?.instructorName
                        }
                      />

                      <Info
                        label="Issue Date"
                        value={
                          report?.data
                            ?.issueDate
                        }
                      />
                    </div>

                    {/* EDIT */}
                    {isEditing ? (
                      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                        <div className="mb-5">
                          <h3 className="text-lg font-black text-slate-900">
                            Edit Report Details
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Update the generated report
                            information.
                          </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <Field
                            label="Student Name"
                            name="studentName"
                            value={
                              editData.studentName
                            }
                            onChange={
                              changeHandler
                            }
                          />

                          <Field
                            label="Course Name"
                            name="courseName"
                            value={
                              editData.courseName
                            }
                            onChange={
                              changeHandler
                            }
                          />

                          <Field
                            label="Marks"
                            name="marks"
                            value={
                              editData.marks
                            }
                            onChange={
                              changeHandler
                            }
                          />

                          <Field
                            label="Grade"
                            name="grade"
                            value={
                              editData.grade
                            }
                            onChange={
                              changeHandler
                            }
                          />

                          <Field
                            label="Attendance"
                            name="attendance"
                            value={
                              editData.attendance
                            }
                            onChange={
                              changeHandler
                            }
                          />

                          <Field
                            label="Performance"
                            name="performance"
                            value={
                              editData.performance
                            }
                            onChange={
                              changeHandler
                            }
                          />

                          <Field
                            label="Duration"
                            name="duration"
                            value={
                              editData.duration
                            }
                            onChange={
                              changeHandler
                            }
                          />

                          <Field
                            label="Issue Date"
                            name="issueDate"
                            value={
                              editData.issueDate
                            }
                            onChange={
                              changeHandler
                            }
                          />

                          <Field
                            label="Report ID"
                            name="reportId"
                            value={
                              editData.reportId
                            }
                            onChange={
                              changeHandler
                            }
                          />

                          <Field
                            label="Instructor Name"
                            name="instructorName"
                            value={
                              editData.instructorName
                            }
                            onChange={
                              changeHandler
                            }
                          />

                          <div className="md:col-span-2 lg:col-span-3">
                            <label
                              htmlFor={`feedback-${report._id}`}
                              className="mb-2 block text-sm font-bold text-slate-700"
                            >
                              Feedback
                            </label>

                            <textarea
                              id={`feedback-${report._id}`}
                              name="feedback"
                              value={
                                editData.feedback
                              }
                              onChange={
                                changeHandler
                              }
                              rows={4}
                              placeholder="Enter report feedback"
                              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* DETAILS */
                      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Info
                          label="Student Name"
                          value={
                            report?.data
                              ?.studentName ||
                            report?.student
                              ?.name
                          }
                        />

                        <Info
                          label="Course"
                          value={
                            report?.data
                              ?.courseName ||
                            report?.course
                              ?.title ||
                            report?.internship
                              ?.title
                          }
                        />

                        <Info
                          label="Marks"
                          value={
                            report?.data
                              ?.marks
                          }
                        />

                        <Info
                          label="Grade"
                          value={
                            report?.data
                              ?.grade
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
                          label="Performance"
                          value={
                            report?.data
                              ?.performance
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
                          label="Issue Date"
                          value={
                            report?.data
                              ?.issueDate
                          }
                        />

                        <Info
                          label="Report ID"
                          value={
                            report?.reportId ||
                            report?.data
                              ?.reportId
                          }
                        />

                        <Info
                          label="Instructor"
                          value={
                            report?.data
                              ?.instructorName
                          }
                        />

                        <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2 lg:col-span-2">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Feedback
                          </p>

                          <p className="mt-1 whitespace-pre-line text-sm font-semibold text-slate-800">
                            {report?.data
                              ?.feedback ||
                              "-"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* REPORT FILE */}
                    {reportFile && (
                      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="flex items-center gap-2 font-black text-slate-900">
                              <FiFileText className="text-[#D4AF37]" />

                              Generated Report
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Review the current generated
                              report before verification.
                            </p>
                          </div>

                          <a
                            href={reportFile}
                            target="_blank"
                            rel="noreferrer"
                            className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                          >
                            <FiExternalLink />

                            Open Report
                          </a>
                        </div>

                        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                          {isPdf(
                            report?.reportFile
                          ) ? (
                            <iframe
                              title="Generated Report Preview"
                              src={reportFile}
                              className="h-[520px] w-full"
                            />
                          ) : (
                            <div className="flex min-h-[420px] items-center justify-center p-5">
                              <img
                                src={reportFile}
                                alt="Generated report"
                                className="max-h-[520px] max-w-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              saveChanges(
                                report?._id
                              )
                            }
                            disabled={
                              isProcessing
                            }
                            className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-black text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isProcessing ? (
                              <FiRefreshCw className="animate-spin" />
                            ) : (
                              <FiSave />
                            )}

                            {isProcessing
                              ? "Saving..."
                              : "Save Changes"}
                          </button>

                          <button
                            type="button"
                            onClick={
                              cancelEditing
                            }
                            disabled={
                              isProcessing
                            }
                            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            startEdit(
                              report
                            )
                          }
                          disabled={
                            isProcessing
                          }
                          className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FiEdit3 />

                          Edit Details
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          approveReport(
                            report
                          )
                        }
                        disabled={
                          isProcessing
                        }
                        className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isProcessing ? (
                          <FiRefreshCw className="animate-spin" />
                        ) : (
                          <FiCheckCircle />
                        )}

                        {isProcessing
                          ? "Processing..."
                          : "Approve Report"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          requestRevision(
                            report
                          )
                        }
                        disabled={
                          isProcessing
                        }
                        className="flex items-center gap-2 rounded-xl border border-[#D4AF37] px-5 py-3 text-sm font-black text-[#9A7814] transition hover:bg-[#FFF8E7] disabled:opacity-60"
                      >
                        <FiRefreshCw />

                        Request Revision
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          rejectReport(
                            report
                          )
                        }
                        disabled={
                          isProcessing
                        }
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:opacity-60"
                      >
                        <FiXCircle />

                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openReview(
                            report
                          )
                        }
                        className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                      >
                        <FiEye />

                        Full Review
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* =================================================
          FULL REVIEW MODAL
      ================================================== */}

      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={closeReview}
        >
          <div
            className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Report Review
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Review report data and generated document
                  before final verification.
                </p>
              </div>

              <button
                type="button"
                onClick={closeReview}
                disabled={Boolean(
                  processingId
                )}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* DETAILS */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Info
                  label="Student"
                  value={
                    selectedReport?.data
                      ?.studentName ||
                    selectedReport?.student
                      ?.name
                  }
                />

                <Info
                  label="Email"
                  value={
                    selectedReport?.student
                      ?.email
                  }
                />

                <Info
                  label="Program"
                  value={getProgramName(
                    selectedReport
                  )}
                />

                <Info
                  label="Marks"
                  value={
                    selectedReport?.data
                      ?.marks
                  }
                />

                <Info
                  label="Grade"
                  value={
                    selectedReport?.data
                      ?.grade
                  }
                />

                <Info
                  label="Attendance"
                  value={
                    selectedReport?.data
                      ?.attendance
                  }
                />

                <Info
                  label="Performance"
                  value={
                    selectedReport?.data
                      ?.performance
                  }
                />

                <Info
                  label="Duration"
                  value={
                    selectedReport?.data
                      ?.duration
                  }
                />

                <Info
                  label="Issue Date"
                  value={
                    selectedReport?.data
                      ?.issueDate
                  }
                />

                <Info
                  label="Report ID"
                  value={
                    selectedReport?.reportId ||
                    selectedReport?.data
                      ?.reportId
                  }
                />

                <Info
                  label="Instructor"
                  value={
                    selectedReport?.data
                      ?.instructorName
                  }
                />

                <Info
                  label="Status"
                  value={
                    selectedReport?.status
                  }
                  valueClass="capitalize"
                />

                <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2 lg:col-span-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Feedback
                  </p>

                  <p className="mt-1 whitespace-pre-line text-sm font-semibold text-slate-800">
                    {selectedReport?.data
                      ?.feedback ||
                      "-"}
                  </p>
                </div>
              </div>

              {/* REPORT */}
              {getFileUrl(
                selectedReport?.reportFile
              ) && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">
                        <FiFileText className="text-[#D4AF37]" />

                        Generated Report
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Current generated report document.
                      </p>
                    </div>

                    <a
                      href={getFileUrl(
                        selectedReport?.reportFile
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <FiExternalLink />

                      Open
                    </a>
                  </div>

                  {isPdf(
                    selectedReport?.reportFile
                  ) ? (
                    <iframe
                      title="Report Review"
                      src={getFileUrl(
                        selectedReport?.reportFile
                      )}
                      className="h-[650px] w-full rounded-2xl border border-slate-200 bg-white"
                    />
                  ) : (
                    <div className="flex justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-5">
                      <img
                        src={getFileUrl(
                          selectedReport?.reportFile
                        )}
                        alt="Generated report"
                        className="max-h-[650px] w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReport(null);
                    startEdit(
                      selectedReport
                    );
                  }}
                  disabled={Boolean(
                    processingId
                  )}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <FiEdit3 />

                  Edit Details
                </button>

                <button
                  type="button"
                  onClick={() =>
                    approveReport(
                      selectedReport
                    )
                  }
                  disabled={Boolean(
                    processingId
                  )}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-black text-white hover:bg-green-700 disabled:opacity-60"
                >
                  <FiCheckCircle />

                  Approve Report
                </button>

                <button
                  type="button"
                  onClick={() =>
                    requestRevision(
                      selectedReport
                    )
                  }
                  disabled={Boolean(
                    processingId
                  )}
                  className="flex items-center gap-2 rounded-xl border border-[#D4AF37] px-6 py-3 text-sm font-black text-[#9A7814] hover:bg-[#FFF8E7] disabled:opacity-60"
                >
                  <FiRefreshCw />

                  Request Revision
                </button>

                <button
                  type="button"
                  onClick={() =>
                    rejectReport(
                      selectedReport
                    )
                  }
                  disabled={Boolean(
                    processingId
                  )}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60"
                >
                  <FiXCircle />

                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-bold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
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
  valueClass = "",
}) => {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 break-words text-sm font-semibold text-slate-800 ${valueClass}`}
      >
        {value || "-"}
      </p>
    </div>
  );
};

// =====================================================
// PDF CHECK
// =====================================================

const isPdf = (file) => {
  if (!file) {
    return false;
  }

  let value = file;

  if (typeof file === "object") {
    value =
      file?.url ||
      file?.path ||
      file?.location ||
      "";
  }

  return /\.pdf(\?.*)?$/i.test(
    String(value)
  );
};

export default ReportsVerification;