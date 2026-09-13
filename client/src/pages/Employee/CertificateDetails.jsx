import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const GOLD = "#D4AF37";

const safeArray = (value) => {
  if (Array.isArray(value)) return value;
  return [];
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "ST";

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const getStatusMeta = (status) => {
  const value = String(status || "").toLowerCase();

  if (["approved", "generated", "completed"].includes(value)) {
    return {
      label: status || "Approved",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    };
  }

  if (["rejected", "declined"].includes(value)) {
    return {
      label: status || "Rejected",
      className: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    };
  }

  if (["revision", "revision_requested"].includes(value)) {
    return {
      label: status || "Revision Requested",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    };
  }

  return {
    label: status || "Pending",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  };
};

export default function CertificateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCertificate = async () => {
    if (!id) {
      setError("Certificate ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/generated-certificates/${id}`);

      const data =
        response?.data?.data ||
        response?.data?.certificate ||
        response?.data ||
        null;

      setCertificate(data);
    } catch (err) {
      console.error("Certificate details error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load certificate details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const handleApprove = async () => {
    if (!certificate?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to approve this certificate?"
    );

    if (!confirmed) return;

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      await api.put(`/generated-certificates/${certificate._id}/approve`);

      setSuccess(
        "Certificate approved successfully."
      );

      await fetchCertificate();
    } catch (err) {
      console.error("Approve certificate error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to approve certificate."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!certificate?._id) return;

    const reason =
      window.prompt(
        "Enter rejection reason:"
      );

    if (reason === null) return;

    if (!reason.trim()) {
      setError("Rejection reason is required.");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      await api.put(
        `/generated-certificates/${certificate._id}/reject`,
        {
          reason: reason.trim(),
        }
      );

      setSuccess(
        "Certificate rejected successfully."
      );

      await fetchCertificate();
    } catch (err) {
      console.error("Reject certificate error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to reject certificate."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleRevision = async () => {
    if (!certificate?._id) return;

    const reason =
      window.prompt(
        "Enter revision instructions for the certificate:"
      );

    if (reason === null) return;

    if (!reason.trim()) {
      setError("Revision instructions are required.");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      await api.put(
        `/generated-certificates/${certificate._id}/revision`,
        {
          reason: reason.trim(),
        }
      );

      setSuccess(
        "Revision request submitted successfully."
      );

      await fetchCertificate();
    } catch (err) {
      console.error("Certificate revision error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to request revision."
      );
    } finally {
      setProcessing(false);
    }
  };

  const openPdf = () => {
    const pdfUrl =
      certificate?.pdfUrl ||
      certificate?.fileUrl ||
      certificate?.certificateUrl ||
      certificate?.documentUrl;

    if (!pdfUrl) {
      setError("Certificate PDF is not available.");
      return;
    }

    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const student =
    certificate?.student ||
    certificate?.user ||
    certificate?.studentId ||
    {};

  const course =
    certificate?.course ||
    certificate?.courseId ||
    {};

  const internship =
    certificate?.internship ||
    certificate?.internshipId ||
    {};

  const studentName =
    student?.name ||
    student?.fullName ||
    certificate?.studentName ||
    certificate?.name ||
    "Student";

  const studentEmail =
    student?.email ||
    certificate?.studentEmail ||
    "—";

  const studentPhone =
    student?.phone ||
    student?.mobile ||
    certificate?.studentPhone ||
    "—";

  const courseTitle =
    course?.title ||
    course?.name ||
    certificate?.courseTitle ||
    "—";

  const internshipTitle =
    internship?.title ||
    internship?.name ||
    certificate?.internshipTitle ||
    "";

  const statusMeta = getStatusMeta(certificate?.status);

  const skills = safeArray(
    certificate?.skills ||
      course?.skills ||
      internship?.skills
  );

  const achievements = safeArray(
    certificate?.achievements ||
      certificate?.highlights ||
      certificate?.achievementsList
  );

  const completionPercentage =
    certificate?.completionPercentage ??
    certificate?.progress ??
    100;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center px-6">
        <div className="text-center">
          <div
            className="mx-auto h-12 w-12 rounded-full border-4 border-gray-200 border-t-[#D4AF37] animate-spin"
          />
          <p className="mt-4 text-gray-600 font-medium">
            Loading certificate details...
          </p>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black"
          >
            ← Back
          </button>

          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 text-2xl">
              !
            </div>

            <h2 className="text-2xl font-black text-gray-900">
              Certificate Not Found
            </h2>

            <p className="mt-2 text-gray-500">
              {error || "The requested certificate could not be found."}
            </p>

            <button
              onClick={() => navigate("/employee/certificates")}
              className="mt-7 rounded-xl px-5 py-3 font-bold text-white shadow-sm"
              style={{ backgroundColor: GOLD }}
            >
              Back to Certificates
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black"
            >
              ← Back
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950">
                Certificate Details
              </h1>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${statusMeta.className}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${statusMeta.dot}`}
                />
                {statusMeta.label}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Review, verify and take action on this certificate.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={openPdf}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={
                !(
                  certificate?.pdfUrl ||
                  certificate?.fileUrl ||
                  certificate?.certificateUrl ||
                  certificate?.documentUrl
                )
              }
            >
              View PDF
            </button>

            {String(certificate?.status || "").toLowerCase() !==
              "approved" && (
              <>
                <button
                  onClick={handleRevision}
                  disabled={processing}
                  className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                >
                  Request Revision
                </button>

                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  Reject
                </button>

                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="rounded-xl px-5 py-3 text-sm font-bold text-white shadow-md hover:opacity-95 disabled:opacity-50"
                  style={{
                    backgroundColor: GOLD,
                  }}
                >
                  {processing
                    ? "Processing..."
                    : "Approve Certificate"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {success}
          </div>
        )}

        {/* Top identity */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-black text-white shadow-xl">
          <div className="relative p-6 sm:p-8">
            <div
              className="absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: GOLD }}
            />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-black"
                  style={{ backgroundColor: GOLD }}
                >
                  {getInitials(studentName)}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                    Certificate Holder
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    {studentName}
                  </h2>

                  <p className="mt-1 text-sm text-gray-300">
                    {studentEmail}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Completion
                  </p>
                  <p className="mt-1 text-xl font-black">
                    {completionPercentage}%
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Issued
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {formatDate(
                      certificate?.issuedAt ||
                        certificate?.createdAt
                    )}
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:col-span-1">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Certificate ID
                  </p>
                  <p className="mt-1 truncate text-sm font-bold">
                    {certificate?.certificateNumber ||
                      certificate?.certificateId ||
                      certificate?._id ||
                      "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Left */}
          <div className="space-y-6">
            {/* Certificate Overview */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Certificate Overview
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950">
                  Program & completion information
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
                  <p className="text-xs font-semibold text-gray-500">
                    Course
                  </p>
                  <p className="mt-1 font-bold text-gray-900">
                    {courseTitle}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
                  <p className="text-xs font-semibold text-gray-500">
                    Internship
                  </p>
                  <p className="mt-1 font-bold text-gray-900">
                    {internshipTitle || "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
                  <p className="text-xs font-semibold text-gray-500">
                    Start Date
                  </p>
                  <p className="mt-1 font-bold text-gray-900">
                    {formatDate(
                      certificate?.startDate ||
                        certificate?.startedAt ||
                        course?.startDate
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
                  <p className="text-xs font-semibold text-gray-500">
                    Completion Date
                  </p>
                  <p className="mt-1 font-bold text-gray-900">
                    {formatDate(
                      certificate?.completionDate ||
                        certificate?.completedAt ||
                        certificate?.endDate
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* Skills */}
            {skills.length > 0 && (
              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{ color: GOLD }}
                  >
                    Skills
                  </p>
                  <h2 className="mt-1 text-xl font-black text-gray-950">
                    Skills covered
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={`${String(skill)}-${index}`}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700"
                    >
                      {typeof skill === "string"
                        ? skill
                        : skill?.name || skill?.title || "Skill"}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{ color: GOLD }}
                  >
                    Highlights
                  </p>
                  <h2 className="mt-1 text-xl font-black text-gray-950">
                    Achievements & milestones
                  </h2>
                </div>

                <div className="space-y-3">
                  {achievements.map((item, index) => (
                    <div
                      key={`${index}-${String(item)}`}
                      className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4"
                    >
                      <div
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-black"
                        style={{ backgroundColor: GOLD }}
                      >
                        ✓
                      </div>

                      <p className="text-sm font-medium leading-6 text-gray-700">
                        {typeof item === "string"
                          ? item
                          : item?.title ||
                            item?.description ||
                            "Achievement"}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            {certificate?.description && (
              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{ color: GOLD }}
                  >
                    Description
                  </p>

                  <h2 className="mt-1 text-xl font-black text-gray-950">
                    Certificate description
                  </h2>
                </div>

                <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                  {certificate.description}
                </p>
              </section>
            )}
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Status card */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                    Current Status
                  </p>

                  <h2 className="mt-1 text-xl font-black text-gray-950">
                    {statusMeta.label}
                  </h2>
                </div>

                <div
                  className={`rounded-2xl border px-3 py-2 text-xs font-bold ${statusMeta.className}`}
                >
                  {statusMeta.label}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">
                    Completion
                  </span>

                  <span className="text-sm font-black text-gray-900">
                    {completionPercentage}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          Number(completionPercentage) || 0
                        )
                      )}%`,
                      backgroundColor: GOLD,
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Student info */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Student
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950">
                  Student information
                </h2>
              </div>

              <div className="space-y-4">
                <InfoRow
                  label="Full Name"
                  value={studentName}
                />

                <InfoRow
                  label="Email"
                  value={studentEmail}
                />

                <InfoRow
                  label="Phone"
                  value={studentPhone}
                />

                <InfoRow
                  label="Student ID"
                  value={
                    student?._id ||
                    student?.studentId ||
                    certificate?.studentId ||
                    "—"
                  }
                />
              </div>
            </section>

            {/* Timeline */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Timeline
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950">
                  Certificate activity
                </h2>
              </div>

              <div className="space-y-5">
                <TimelineItem
                  title="Certificate Created"
                  date={formatDate(certificate?.createdAt)}
                  active
                />

                {certificate?.updatedAt && (
                  <TimelineItem
                    title="Last Updated"
                    date={formatDate(certificate.updatedAt)}
                    active
                  />
                )}

                {certificate?.approvedAt && (
                  <TimelineItem
                    title="Certificate Approved"
                    date={formatDate(certificate.approvedAt)}
                    active
                  />
                )}

                {certificate?.rejectedAt && (
                  <TimelineItem
                    title="Certificate Rejected"
                    date={formatDate(certificate.rejectedAt)}
                    active={false}
                  />
                )}

                {certificate?.issuedAt && (
                  <TimelineItem
                    title="Certificate Issued"
                    date={formatDate(certificate.issuedAt)}
                    active
                  />
                )}
              </div>
            </section>

            {/* Rejection / revision reason */}
            {(certificate?.rejectionReason ||
              certificate?.revisionReason ||
              certificate?.reviewNote) && (
              <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                  Review Note
                </p>

                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-amber-900">
                  {certificate?.rejectionReason ||
                    certificate?.revisionReason ||
                    certificate?.reviewNote}
                </p>
              </section>
            )}

            {/* Actions */}
            <section className="rounded-3xl bg-black p-6 text-white shadow-xl">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Employee Actions
              </p>

              <h2 className="mt-2 text-xl font-black">
                Review this certificate
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Verify the details carefully before approving the final
                certificate.
              </p>

              <div className="mt-5 grid gap-3">
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="w-full rounded-xl px-4 py-3 font-bold text-black disabled:opacity-50"
                  style={{ backgroundColor: GOLD }}
                >
                  {processing
                    ? "Processing..."
                    : "Approve Certificate"}
                </button>

                <button
                  onClick={handleRevision}
                  disabled={processing}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-bold text-white hover:bg-white/10 disabled:opacity-50"
                >
                  Request Revision
                </button>

                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="w-full rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 font-bold text-red-300 hover:bg-red-400/15 disabled:opacity-50"
                >
                  Reject Certificate
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
      <p className="text-xs font-semibold text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-gray-800">
        {value || "—"}
      </p>
    </div>
  );
}

function TimelineItem({ title, date, active = true }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`h-3 w-3 rounded-full ${
            active ? "bg-[#D4AF37]" : "bg-gray-300"
          }`}
        />

        <div className="mt-1 h-full min-h-7 w-px bg-gray-200" />
      </div>

      <div className="pb-2">
        <p className="text-sm font-bold text-gray-800">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {date}
        </p>
      </div>
    </div>
  );
}