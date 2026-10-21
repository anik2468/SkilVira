import { API_ORIGIN, API_URL } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";

import {
  FiAward,
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
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  API_ORIGIN;

const EMPTY_EDIT_DATA = {
  studentName: "",
  courseName: "",
  marks: "",
  grade: "",
  duration: "",
  attendance: "",
  performance: "",
  feedback: "",
  issueDate: "",
  certificateId: "",
};

const CertificateVerification = () => {
  const [certificates, setCertificates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] =
    useState(EMPTY_EDIT_DATA);

  const [selectedCertificate, setSelectedCertificate] =
    useState(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  // =====================================================
  // LOAD PENDING CERTIFICATES
  // =====================================================

  const loadCertificates = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/generated-certificates/pending"
      );

      setCertificates(data?.certificates || []);
    } catch (error) {
      console.error(
        "Load certificates error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load certificate verification queue."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // START EDITING
  // =====================================================

  const startEditing = (certificate) => {
    setEditingId(certificate?._id || null);

    setEditData({
      studentName:
        certificate?.data?.studentName ||
        certificate?.student?.name ||
        "",

      courseName:
        certificate?.data?.courseName ||
        certificate?.course?.title ||
        certificate?.internship?.title ||
        "",

      marks: certificate?.data?.marks || "",

      grade: certificate?.data?.grade || "",

      duration:
        certificate?.data?.duration || "",

      attendance:
        certificate?.data?.attendance || "",

      performance:
        certificate?.data?.performance || "",

      feedback:
        certificate?.data?.feedback || "",

      issueDate:
        certificate?.data?.issueDate || "",

      certificateId:
        certificate?.certificateId ||
        certificate?.data?.certificateId ||
        "",
    });
  };

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // CANCEL EDITING
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
        `/generated-certificates/${id}/update`,
        {
          data: editData,
        }
      );

      if (data?.success === false) {
        throw new Error(
          data?.message ||
            "Failed to update certificate."
        );
      }

      alert(
        "Certificate details updated successfully."
      );

      cancelEditing();
      setSelectedCertificate(null);

      await loadCertificates();
    } catch (error) {
      console.error(
        "Update certificate error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update certificate."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // REQUEST REVISION
  // =====================================================

  const requestRevision = async (
    certificate
  ) => {
    const remark = window.prompt(
      "Enter correction/revision instructions:"
    );

    if (!remark?.trim()) {
      return;
    }

    try {
      setProcessingId(
        certificate?._id
      );

      const { data } = await api.put(
        `/generated-certificates/${certificate._id}/revision`,
        {
          remark: remark.trim(),
        }
      );

      if (data?.success === false) {
        throw new Error(
          data?.message ||
            "Failed to request revision."
        );
      }

      alert(
        "Certificate revision requested successfully."
      );

      setSelectedCertificate(null);

      await loadCertificates();
    } catch (error) {
      console.error(
        "Request certificate revision error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to request revision."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // APPROVE
  // =====================================================

  const approveCertificate = async (
    certificate
  ) => {
    const studentName =
      certificate?.student?.name ||
      certificate?.data?.studentName ||
      "this student";

    const confirmed = window.confirm(
      `Approve certificate for ${studentName}?\n\n` +
        "Only approved certificates can be publicly verified."
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(
        certificate?._id
      );

      const { data } = await api.put(
        `/generated-certificates/${certificate._id}/approve`
      );

      if (data?.success === false) {
        throw new Error(
          data?.message ||
            "Failed to approve certificate."
        );
      }

      alert(
        data?.message ||
          "Certificate approved successfully."
      );

      setSelectedCertificate(null);

      await loadCertificates();
    } catch (error) {
      console.error(
        "Approve certificate error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to approve certificate."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // REJECT
  // =====================================================

  const rejectCertificate = async (
    certificate
  ) => {
    const reason = window.prompt(
      "Enter rejection reason:"
    );

    if (!reason?.trim()) {
      return;
    }

    try {
      setProcessingId(
        certificate?._id
      );

      const { data } = await api.put(
        `/generated-certificates/${certificate._id}/reject`,
        {
          reason: reason.trim(),
        }
      );

      if (data?.success === false) {
        throw new Error(
          data?.message ||
            "Failed to reject certificate."
        );
      }

      alert(
        data?.message ||
          "Certificate rejected successfully."
      );

      setSelectedCertificate(null);

      await loadCertificates();
    } catch (error) {
      console.error(
        "Reject certificate error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to reject certificate."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredCertificates = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return certificates;
    }

    return certificates.filter(
      (certificate) => {
        const studentName =
          certificate?.student?.name ||
          certificate?.data?.studentName ||
          "";

        const studentEmail =
          certificate?.student?.email ||
          "";

        const courseName =
          certificate?.course?.title ||
          certificate?.internship?.title ||
          certificate?.data?.courseName ||
          "";

        const certificateId =
          certificate?.certificateId ||
          certificate?.data?.certificateId ||
          "";

        const searchable = [
          studentName,
          studentEmail,
          courseName,
          certificateId,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(
          keyword
        );
      }
    );
  }, [certificates, search]);

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
      value.startsWith("/") ? "" : "/"
    }${value}`;
  };

  // =====================================================
  // VERIFICATION URL
  // =====================================================

  const getVerificationUrl = (
    certificate
  ) => {
    const credentialId =
      certificate?.certificateId ||
      certificate?.data?.certificateId;

    if (!credentialId) {
      return "";
    }

    const frontendBase =
      import.meta.env.VITE_FRONTEND_URL ||
      window.location.origin;

    return `${frontendBase}/verify-certificate/${encodeURIComponent(
      credentialId
    )}`;
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
  // PROGRAM
  // =====================================================

  const getProgramName = (certificate) => {
    return (
      certificate?.course?.title ||
      certificate?.internship?.title ||
      certificate?.data?.courseName ||
      "Program"
    );
  };

  // =====================================================
  // OPEN REVIEW
  // =====================================================

  const openReview = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const closeReview = () => {
    if (processingId) {
      return;
    }

    setSelectedCertificate(null);
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
            Loading certificate verification queue...
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
              <FiAward className="text-[#D4AF37]" />
            </span>

            Certificate Verification
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Review, edit and approve automatically
            generated certificates before publication.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCertificates}
          disabled={Boolean(processingId)}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw />

          Refresh
        </button>
      </div>

      {/* =================================================
          SEARCH + COUNT
      ================================================== */}

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-xl">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search student, email, course, certificate ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[#D4AF37] focus:bg-white"
          />
        </div>

        <div className="w-fit rounded-2xl bg-[#FFF8E7] px-5 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Pending Reviews
          </p>

          <p className="mt-1 text-2xl font-black text-slate-900">
            {filteredCertificates.length}
          </p>
        </div>
      </div>

      {/* =================================================
          EMPTY
      ================================================== */}

      {filteredCertificates.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <FiAward className="mx-auto text-6xl text-[#D4AF37]" />

          <h2 className="mt-5 text-2xl font-black text-slate-900">
            {search
              ? "No Matching Certificates"
              : "No Pending Certificates"}
          </h2>

          <p className="mt-2 text-sm font-medium text-slate-500">
            {search
              ? "Try another student, course or certificate ID."
              : "New generated certificates waiting for verification will appear here."}
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
           CERTIFICATE LIST
        ================================================== */

        <div className="space-y-6">
          {filteredCertificates.map(
            (certificate) => {
              const editing =
                editingId ===
                certificate?._id;

              const isProcessing =
                processingId ===
                certificate?._id;

              const certificateFile =
                getFileUrl(
                  certificate?.certificateFile
                );

              const qrCode =
                getFileUrl(
                  certificate?.qrCode
                );

              const verificationUrl =
                getVerificationUrl(
                  certificate
                );

              return (
                <div
                  key={certificate?._id}
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
                            {certificate?.student
                              ?.name ||
                              certificate?.data
                                ?.studentName ||
                              "Student"}
                          </h2>

                          <p className="break-all text-sm font-medium text-slate-500">
                            {certificate?.student
                              ?.email ||
                              "No email"}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-400">
                            {getProgramName(
                              certificate
                            )}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full px-4 py-2 text-xs font-black capitalize ${getStatusClasses(
                          certificate?.status
                        )}`}
                      >
                        {certificate?.status ||
                          "pending"}
                      </span>
                    </div>

                    {/* PROGRAM */}
                    <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Course / Internship
                      </p>

                      <h3 className="mt-1 text-xl font-black text-slate-900">
                        {getProgramName(
                          certificate
                        )}
                      </h3>

                      {certificate?.template?.name && (
                        <p className="mt-1 text-sm text-slate-500">
                          Template:{" "}
                          <span className="font-semibold">
                            {
                              certificate
                                .template
                                .name
                            }
                          </span>
                        </p>
                      )}
                    </div>

                    {/* EDIT MODE */}
                    {editing ? (
                      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                        <div className="mb-5">
                          <h3 className="text-lg font-black text-slate-900">
                            Edit Certificate Details
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Update the generated certificate
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
                              handleChange
                            }
                          />

                          <Field
                            label="Course Name"
                            name="courseName"
                            value={
                              editData.courseName
                            }
                            onChange={
                              handleChange
                            }
                          />

                          <Field
                            label="Marks"
                            name="marks"
                            value={editData.marks}
                            onChange={
                              handleChange
                            }
                          />

                          <Field
                            label="Grade"
                            name="grade"
                            value={editData.grade}
                            onChange={
                              handleChange
                            }
                          />

                          <Field
                            label="Duration"
                            name="duration"
                            value={
                              editData.duration
                            }
                            onChange={
                              handleChange
                            }
                          />

                          <Field
                            label="Attendance"
                            name="attendance"
                            value={
                              editData.attendance
                            }
                            onChange={
                              handleChange
                            }
                          />

                          <Field
                            label="Performance"
                            name="performance"
                            value={
                              editData.performance
                            }
                            onChange={
                              handleChange
                            }
                          />

                          <Field
                            label="Issue Date"
                            name="issueDate"
                            value={
                              editData.issueDate
                            }
                            onChange={
                              handleChange
                            }
                          />

                          <Field
                            label="Certificate ID"
                            name="certificateId"
                            value={
                              editData.certificateId
                            }
                            onChange={
                              handleChange
                            }
                          />

                          <div className="md:col-span-2 lg:col-span-3">
                            <label
                              htmlFor={`feedback-${certificate._id}`}
                              className="mb-2 block text-sm font-bold text-slate-700"
                            >
                              Feedback
                            </label>

                            <textarea
                              id={`feedback-${certificate._id}`}
                              name="feedback"
                              value={
                                editData.feedback
                              }
                              onChange={
                                handleChange
                              }
                              rows={4}
                              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
                              placeholder="Enter feedback"
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
                            certificate?.data
                              ?.studentName ||
                            certificate
                              ?.student?.name
                          }
                        />

                        <Info
                          label="Course"
                          value={
                            certificate?.data
                              ?.courseName ||
                            certificate
                              ?.course?.title ||
                            certificate
                              ?.internship?.title
                          }
                        />

                        <Info
                          label="Marks"
                          value={
                            certificate?.data
                              ?.marks
                          }
                        />

                        <Info
                          label="Grade"
                          value={
                            certificate?.data
                              ?.grade
                          }
                        />

                        <Info
                          label="Duration"
                          value={
                            certificate?.data
                              ?.duration
                          }
                        />

                        <Info
                          label="Attendance"
                          value={
                            certificate?.data
                              ?.attendance
                          }
                        />

                        <Info
                          label="Performance"
                          value={
                            certificate?.data
                              ?.performance
                          }
                        />

                        <Info
                          label="Issue Date"
                          value={
                            certificate?.data
                              ?.issueDate
                          }
                        />

                        <Info
                          label="Certificate ID"
                          value={
                            certificate?.certificateId ||
                            certificate?.data
                              ?.certificateId
                          }
                        />

                        <Info
                          label="Feedback"
                          value={
                            certificate?.data
                              ?.feedback
                          }
                        />
                      </div>
                    )}

                    {/* DOCUMENT / QR */}
                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                      {/* CERTIFICATE */}
                      {certificateFile && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="flex items-center gap-2 font-black text-slate-900">
                                <FiAward className="text-[#D4AF37]" />

                                Generated Certificate
                              </h3>

                              <p className="mt-1 text-xs text-slate-500">
                                Review the generated draft
                                certificate.
                              </p>
                            </div>

                            <a
                              href={
                                certificateFile
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                            >
                              <FiEye />

                              Open
                            </a>
                          </div>

                          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            {isPdf(
                              certificate?.certificateFile
                            ) ? (
                              <iframe
                                title="Certificate Preview"
                                src={
                                  certificateFile
                                }
                                className="h-[420px] w-full"
                              />
                            ) : (
                              <img
                                src={
                                  certificateFile
                                }
                                alt="Generated certificate"
                                className="max-h-[420px] w-full object-contain"
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* QR */}
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="flex items-center gap-2 font-black text-slate-900">
                              <FiCheckCircle className="text-[#D4AF37]" />

                              Verification QR
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              QR generated automatically for
                              this certificate.
                            </p>
                          </div>

                          {qrCode && (
                            <a
                              href={
                                qrCode
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                            >
                              <FiEye />

                              Open
                            </a>
                          )}
                        </div>

                        {qrCode ? (
                          <div className="mt-4 flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-6">
                            <img
                              src={qrCode}
                              alt="Certificate verification QR"
                              className="h-64 w-64 object-contain"
                            />
                          </div>
                        ) : (
                          <div className="mt-4 flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
                            <div>
                              <p className="font-bold text-slate-700">
                                QR preview unavailable
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                The certificate may still have
                                its QR configuration stored in
                                the template.
                              </p>
                            </div>
                          </div>
                        )}

                        {verificationUrl && (
                          <div className="mt-4 rounded-xl border border-[#D4AF37]/20 bg-[#FFF8E7] p-4">
                            <p className="text-xs font-black uppercase tracking-wide text-[#9A7814]">
                              Public Verification URL
                            </p>

                            <p className="mt-2 break-all text-xs font-semibold text-slate-700">
                              {verificationUrl}
                            </p>

                            <a
                              href={
                                verificationUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#9A7814] hover:underline"
                            >
                              <FiExternalLink />

                              Open Verification Page
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {editing ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              saveChanges(
                                certificate?._id
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
                            startEditing(
                              certificate
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
                          approveCertificate(
                            certificate
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
                          : "Approve"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          requestRevision(
                            certificate
                          )
                        }
                        disabled={
                          isProcessing
                        }
                        className="flex items-center gap-2 rounded-xl border border-[#D4AF37] px-5 py-3 text-sm font-black text-[#9A7B14] transition hover:bg-[#FFF8E7] disabled:opacity-60"
                      >
                        <FiRefreshCw />

                        Request Revision
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          rejectCertificate(
                            certificate
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
                            certificate
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

      {selectedCertificate && (
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
                  Certificate Review
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Review certificate data, document and
                  verification QR.
                </p>
              </div>

              <button
                type="button"
                onClick={closeReview}
                disabled={Boolean(
                  processingId
                )}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
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
                    selectedCertificate
                      ?.data
                      ?.studentName ||
                    selectedCertificate
                      ?.student?.name
                  }
                />

                <Info
                  label="Email"
                  value={
                    selectedCertificate
                      ?.student?.email
                  }
                />

                <Info
                  label="Course"
                  value={getProgramName(
                    selectedCertificate
                  )}
                />

                <Info
                  label="Marks"
                  value={
                    selectedCertificate
                      ?.data?.marks
                  }
                />

                <Info
                  label="Grade"
                  value={
                    selectedCertificate
                      ?.data?.grade
                  }
                />

                <Info
                  label="Duration"
                  value={
                    selectedCertificate
                      ?.data?.duration
                  }
                />

                <Info
                  label="Attendance"
                  value={
                    selectedCertificate
                      ?.data?.attendance
                  }
                />

                <Info
                  label="Performance"
                  value={
                    selectedCertificate
                      ?.data?.performance
                  }
                />

                <Info
                  label="Issue Date"
                  value={
                    selectedCertificate
                      ?.data?.issueDate
                  }
                />

                <Info
                  label="Certificate ID"
                  value={
                    selectedCertificate
                      ?.certificateId ||
                    selectedCertificate
                      ?.data?.certificateId
                  }
                />

                <Info
                  label="Status"
                  value={
                    selectedCertificate?.status
                  }
                  valueClass="capitalize"
                />

                <Info
                  label="Template"
                  value={
                    selectedCertificate
                      ?.template?.name
                  }
                />

                <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2 lg:col-span-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Feedback
                  </p>

                  <p className="mt-1 whitespace-pre-line text-sm font-semibold text-slate-800">
                    {selectedCertificate
                      ?.data?.feedback ||
                      "-"}
                  </p>
                </div>
              </div>

              {/* DOCUMENT */}
              {getFileUrl(
                selectedCertificate?.certificateFile
              ) && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">
                        <FiAward className="text-[#D4AF37]" />

                        Certificate Document
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Draft document generated by the
                        certificate system.
                      </p>
                    </div>

                    <a
                      href={getFileUrl(
                        selectedCertificate?.certificateFile
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <FiExternalLink />

                      Open
                    </a>
                  </div>

                  {isPdf(
                    selectedCertificate?.certificateFile
                  ) ? (
                    <iframe
                      title="Certificate document"
                      src={getFileUrl(
                        selectedCertificate?.certificateFile
                      )}
                      className="h-[650px] w-full rounded-2xl border border-slate-200 bg-white"
                    />
                  ) : (
                    <div className="flex justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
                      <img
                        src={getFileUrl(
                          selectedCertificate?.certificateFile
                        )}
                        alt="Certificate"
                        className="max-h-[650px] w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* QR */}
              {getFileUrl(
                selectedCertificate?.qrCode
              ) && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Verification QR
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Generated automatically and linked to
                        the public certificate verification page.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <img
                        src={getFileUrl(
                          selectedCertificate?.qrCode
                        )}
                        alt="Verification QR"
                        className="h-48 w-48 object-contain"
                      />
                    </div>
                  </div>

                  {getVerificationUrl(
                    selectedCertificate
                  ) && (
                    <div className="mt-4 rounded-xl bg-[#FFF8E7] p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-[#9A7814]">
                        Verification URL
                      </p>

                      <p className="mt-2 break-all text-xs font-semibold text-slate-700">
                        {getVerificationUrl(
                          selectedCertificate
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCertificate(null);

                    startEditing(
                      selectedCertificate
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
                    approveCertificate(
                      selectedCertificate
                    )
                  }
                  disabled={Boolean(
                    processingId
                  )}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-black text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {processingId ? (
                    <FiRefreshCw className="animate-spin" />
                  ) : (
                    <FiCheckCircle />
                  )}

                  Approve Certificate
                </button>

                <button
                  type="button"
                  onClick={() =>
                    requestRevision(
                      selectedCertificate
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
                    rejectCertificate(
                      selectedCertificate
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

export default CertificateVerification;