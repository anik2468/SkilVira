import { API_ORIGIN, API_URL } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";

import {
  FiCheckCircle,
  FiEdit3,
  FiEye,
  FiFileText,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiX,
  FiXCircle,
  FiSave,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  API_ORIGIN;

const EMPTY_EDIT_DATA = {
  studentName: "",
  role: "",
  companyName: "",
  duration: "",
  joiningDate: "",
  endDate: "",
  stipend: "",
  location: "",
  workMode: "",
  offerId: "",
  issueDate: "",
  reportingManager: "",
};

const OfferLetterVerification = () => {
  const [offerLetters, setOfferLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(
    EMPTY_EDIT_DATA
  );

  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    loadOfferLetters();
  }, []);

  // =====================================================
  // LOAD PENDING OFFER LETTERS
  // =====================================================

  const loadOfferLetters = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/generated-offer-letter/pending"
      );

      setOfferLetters(data?.offerLetters || []);
    } catch (error) {
      console.error(
        "Load offer letters error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load offer letters."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const startEditing = (offer) => {
    setEditingId(offer?._id || null);

    setEditData({
      studentName:
        offer?.data?.studentName ||
        offer?.student?.name ||
        "",

      role: offer?.data?.role || "",

      companyName:
        offer?.data?.companyName ||
        offer?.internship?.company ||
        "SkilVira",

      duration:
        offer?.data?.duration ||
        offer?.internship?.duration ||
        offer?.course?.duration ||
        "",

      joiningDate:
        offer?.data?.joiningDate || "",

      endDate: offer?.data?.endDate || "",

      stipend: offer?.data?.stipend || "",

      location:
        offer?.data?.location ||
        offer?.internship?.location ||
        "",

      workMode:
        offer?.data?.workMode ||
        offer?.internship?.workMode ||
        "",

      offerId: offer?.data?.offerId || "",

      issueDate:
        offer?.data?.issueDate || "",

      reportingManager:
        offer?.data?.reportingManager || "",
    });
  };

  // =====================================================
  // HANDLE EDIT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

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
  // SAVE EDIT
  // =====================================================

  const saveChanges = async (id) => {
    try {
      setProcessingId(id);

      await api.put(
        `/generated-offer-letter/${id}/update`,
        {
          data: editData,
        }
      );

      alert(
        "Offer letter details updated successfully."
      );

      cancelEditing();
      setSelectedOffer(null);

      await loadOfferLetters();
    } catch (error) {
      console.error(
        "Save offer letter error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update offer letter."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // REQUEST REVISION
  // =====================================================

  const requestRevision = async (offer) => {
    const remark = window.prompt(
      "Enter revision instructions:"
    );

    if (!remark?.trim()) {
      return;
    }

    try {
      setProcessingId(offer._id);

      await api.put(
        `/generated-offer-letter/${offer._id}/revision`,
        {
          remark: remark.trim(),
        }
      );

      alert(
        "Revision requested successfully."
      );

      setSelectedOffer(null);

      await loadOfferLetters();
    } catch (error) {
      console.error(
        "Request revision error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to request revision."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // APPROVE
  // =====================================================

  const approveOfferLetter = async (offer) => {
    const studentName =
      offer?.student?.name ||
      offer?.data?.studentName ||
      "this student";

    const confirmed = window.confirm(
      `Approve offer letter for ${studentName}?\n\n` +
        "The approved offer letter will be sent through the configured backend workflow."
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(offer._id);

      const { data } = await api.put(
        `/generated-offer-letter/${offer._id}/approve`
      );

      alert(
        data?.message ||
          "Offer letter approved successfully."
      );

      setSelectedOffer(null);

      await loadOfferLetters();
    } catch (error) {
      console.error(
        "Approve offer letter error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to approve offer letter."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // REJECT
  // =====================================================

  const rejectOfferLetter = async (offer) => {
    const reason = window.prompt(
      "Enter rejection reason:"
    );

    if (!reason?.trim()) {
      return;
    }

    try {
      setProcessingId(offer._id);

      const { data } = await api.put(
        `/generated-offer-letter/${offer._id}/reject`,
        {
          reason: reason.trim(),
        }
      );

      alert(
        data?.message ||
          "Offer letter rejected successfully."
      );

      setSelectedOffer(null);

      await loadOfferLetters();
    } catch (error) {
      console.error(
        "Reject offer letter error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to reject offer letter."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredOfferLetters = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return offerLetters;
    }

    return offerLetters.filter((offer) => {
      const studentName =
        offer?.student?.name ||
        offer?.data?.studentName ||
        "";

      const studentEmail =
        offer?.student?.email || "";

      const company =
        offer?.data?.companyName ||
        offer?.internship?.company ||
        "";

      const role = offer?.data?.role || "";

      const offerId =
        offer?.data?.offerId || "";

      const program =
        offer?.internship?.title ||
        offer?.course?.title ||
        "";

      const searchable = [
        studentName,
        studentEmail,
        company,
        role,
        offerId,
        program,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [offerLetters, search]);

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
  // HELPERS
  // =====================================================

  const getProgramName = (offer) => {
    return (
      offer?.internship?.title ||
      offer?.course?.title ||
      "Program"
    );
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "revision":
        return "bg-orange-100 text-orange-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "approved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const openReview = (offer) => {
    setSelectedOffer(offer);
  };

  const closeReview = () => {
    if (processingId) {
      return;
    }

    setSelectedOffer(null);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FiRefreshCw className="animate-spin text-5xl text-[#D4AF37]" />

          <p className="text-sm font-semibold text-gray-500">
            Loading offer letters...
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

            Offer Letter Verification
          </h1>

          <p className="mt-2 text-sm font-medium text-gray-500">
            Review, edit and approve offer letters
            before sending them to students.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOfferLetters}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
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
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search student, company, role, offer ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[#D4AF37] focus:bg-white"
          />
        </div>

        <div className="w-fit rounded-2xl bg-[#FFF8E7] px-5 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Pending Reviews
          </p>

          <p className="mt-1 text-2xl font-black text-slate-900">
            {filteredOfferLetters.length}
          </p>
        </div>
      </div>

      {/* =================================================
          EMPTY
      ================================================== */}

      {filteredOfferLetters.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <FiCheckCircle className="mx-auto text-6xl text-green-500" />

          <h2 className="mt-5 text-2xl font-black text-slate-900">
            {search
              ? "No Matching Offer Letters"
              : "No Pending Offer Letters"}
          </h2>

          <p className="mt-2 text-sm font-medium text-gray-500">
            {search
              ? "Try another student, company, role or offer ID."
              : "Offer letters generated after approved purchases will appear here."}
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
        <div className="space-y-6">
          {filteredOfferLetters.map((offer) => {
            const editing =
              editingId === offer?._id;

            const student = offer?.student;

            const programName =
              getProgramName(offer);

            const isProcessing =
              processingId === offer?._id;

            const fileUrl = getFileUrl(
              offer?.offerLetterFile
            );

            return (
              <div
                key={offer?._id}
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
                          {student?.name ||
                            offer?.data?.studentName ||
                            "Student"}
                        </h2>

                        <p className="break-all text-sm font-medium text-gray-500">
                          {student?.email ||
                            "No email"}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-400">
                          {programName}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-xs font-black capitalize ${getStatusClasses(
                        offer?.status
                      )}`}
                    >
                      {offer?.status ||
                        "pending"}
                    </span>
                  </div>

                  {/* EDIT MODE */}
                  {editing ? (
                    <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                      <div className="mb-5">
                        <h3 className="text-lg font-black text-slate-900">
                          Edit Offer Letter Details
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Update the generated offer
                          letter information before
                          approval.
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
                          label="Role"
                          name="role"
                          value={editData.role}
                          onChange={
                            handleChange
                          }
                        />

                        <Field
                          label="Company Name"
                          name="companyName"
                          value={
                            editData.companyName
                          }
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
                          label="Joining Date"
                          name="joiningDate"
                          value={
                            editData.joiningDate
                          }
                          onChange={
                            handleChange
                          }
                        />

                        <Field
                          label="End Date"
                          name="endDate"
                          value={
                            editData.endDate
                          }
                          onChange={
                            handleChange
                          }
                        />

                        <Field
                          label="Stipend"
                          name="stipend"
                          value={
                            editData.stipend
                          }
                          onChange={
                            handleChange
                          }
                        />

                        <Field
                          label="Location"
                          name="location"
                          value={
                            editData.location
                          }
                          onChange={
                            handleChange
                          }
                        />

                        <Field
                          label="Work Mode"
                          name="workMode"
                          value={
                            editData.workMode
                          }
                          onChange={
                            handleChange
                          }
                        />

                        <Field
                          label="Offer ID"
                          name="offerId"
                          value={
                            editData.offerId
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
                          label="Reporting Manager"
                          name="reportingManager"
                          value={
                            editData.reportingManager
                          }
                          onChange={
                            handleChange
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    /* VIEW DATA */
                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Info
                        label="Student"
                        value={
                          offer?.data?.studentName ||
                          student?.name
                        }
                      />

                      <Info
                        label="Email"
                        value={
                          student?.email
                        }
                      />

                      <Info
                        label="Role"
                        value={
                          offer?.data?.role
                        }
                      />

                      <Info
                        label="Company"
                        value={
                          offer?.data?.companyName ||
                          offer?.internship?.company
                        }
                      />

                      <Info
                        label="Program"
                        value={
                          programName
                        }
                      />

                      <Info
                        label="Duration"
                        value={
                          offer?.data?.duration
                        }
                      />

                      <Info
                        label="Joining Date"
                        value={
                          offer?.data?.joiningDate
                        }
                      />

                      <Info
                        label="End Date"
                        value={
                          offer?.data?.endDate
                        }
                      />

                      <Info
                        label="Stipend"
                        value={
                          offer?.data?.stipend
                        }
                      />

                      <Info
                        label="Location"
                        value={
                          offer?.data?.location
                        }
                      />

                      <Info
                        label="Work Mode"
                        value={
                          offer?.data?.workMode
                        }
                      />

                      <Info
                        label="Offer ID"
                        value={
                          offer?.data?.offerId
                        }
                      />

                      <Info
                        label="Issue Date"
                        value={
                          offer?.data?.issueDate
                        }
                      />

                      <Info
                        label="Reporting Manager"
                        value={
                          offer?.data
                            ?.reportingManager
                        }
                      />
                    </div>
                  )}

                  {/* FILE */}
                  {fileUrl && (
                    <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="flex items-center gap-2 text-sm font-black text-slate-900">
                            <FiFileText className="text-[#D4AF37]" />

                            Generated Offer Letter
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Open the current generated
                            document for verification.
                          </p>
                        </div>

                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FiEye />

                          Preview Offer Letter
                        </a>
                      </div>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {editing ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            saveChanges(
                              offer?._id
                            )
                          }
                          disabled={isProcessing}
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
                          disabled={isProcessing}
                          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(
                            offer
                          )
                        }
                        disabled={isProcessing}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        <FiEdit3 />

                        Edit Details
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        approveOfferLetter(
                          offer
                        )
                      }
                      disabled={isProcessing}
                      className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <FiRefreshCw className="animate-spin" />
                      ) : (
                        <FiCheckCircle />
                      )}

                      {isProcessing
                        ? "Processing..."
                        : "Approve & Send"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        requestRevision(
                          offer
                        )
                      }
                      disabled={isProcessing}
                      className="flex items-center gap-2 rounded-xl border border-[#D4AF37] px-5 py-3 text-sm font-bold text-[#9A7B14] transition hover:bg-[#FFF8E7] disabled:opacity-60"
                    >
                      <FiRefreshCw />

                      Revision
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        rejectOfferLetter(
                          offer
                        )
                      }
                      disabled={isProcessing}
                      className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                      <FiXCircle />

                      Reject
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openReview(offer)
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
          })}
        </div>
      )}

      {/* =================================================
          FULL REVIEW MODAL
      ================================================== */}

      {selectedOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={closeReview}
        >
          <div
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Offer Letter Review
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Review the complete offer letter
                  details before taking action.
                </p>
              </div>

              <button
                type="button"
                onClick={closeReview}
                disabled={Boolean(
                  processingId
                )}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
                aria-label="Close review"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* DETAILS */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Info
                  label="Student"
                  value={
                    selectedOffer?.data
                      ?.studentName ||
                    selectedOffer?.student
                      ?.name
                  }
                />

                <Info
                  label="Email"
                  value={
                    selectedOffer?.student
                      ?.email
                  }
                />

                <Info
                  label="Role"
                  value={
                    selectedOffer?.data?.role
                  }
                />

                <Info
                  label="Company"
                  value={
                    selectedOffer?.data
                      ?.companyName ||
                    selectedOffer?.internship
                      ?.company
                  }
                />

                <Info
                  label="Program"
                  value={getProgramName(
                    selectedOffer
                  )}
                />

                <Info
                  label="Duration"
                  value={
                    selectedOffer?.data
                      ?.duration
                  }
                />

                <Info
                  label="Joining Date"
                  value={
                    selectedOffer?.data
                      ?.joiningDate
                  }
                />

                <Info
                  label="End Date"
                  value={
                    selectedOffer?.data?.endDate
                  }
                />

                <Info
                  label="Stipend"
                  value={
                    selectedOffer?.data?.stipend
                  }
                />

                <Info
                  label="Location"
                  value={
                    selectedOffer?.data?.location
                  }
                />

                <Info
                  label="Work Mode"
                  value={
                    selectedOffer?.data?.workMode
                  }
                />

                <Info
                  label="Offer ID"
                  value={
                    selectedOffer?.data?.offerId
                  }
                />

                <Info
                  label="Issue Date"
                  value={
                    selectedOffer?.data?.issueDate
                  }
                />

                <Info
                  label="Reporting Manager"
                  value={
                    selectedOffer?.data
                      ?.reportingManager
                  }
                />

                <Info
                  label="Status"
                  value={
                    selectedOffer?.status
                  }
                  valueClass="capitalize"
                />
              </div>

              {/* DOCUMENT */}
              {getFileUrl(
                selectedOffer?.offerLetterFile
              ) && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">
                        <FiFileText className="text-[#D4AF37]" />

                        Offer Letter Document
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Open the generated document
                        in a new tab.
                      </p>
                    </div>

                    <a
                      href={getFileUrl(
                        selectedOffer?.offerLetterFile
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                      <FiEye />

                      Open Document
                    </a>
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOffer(null);
                    startEditing(
                      selectedOffer
                    );
                  }}
                  disabled={Boolean(
                    processingId
                  )}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <FiEdit3 />

                  Edit Details
                </button>

                <button
                  type="button"
                  onClick={() =>
                    approveOfferLetter(
                      selectedOffer
                    )
                  }
                  disabled={Boolean(
                    processingId
                  )}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-black text-white transition hover:bg-green-700 disabled:opacity-60"
                >
                  <FiCheckCircle />

                  Approve & Send
                </button>

                <button
                  type="button"
                  onClick={() =>
                    requestRevision(
                      selectedOffer
                    )
                  }
                  disabled={Boolean(
                    processingId
                  )}
                  className="flex items-center gap-2 rounded-xl border border-[#D4AF37] px-6 py-3 text-sm font-black text-[#9A7B14] transition hover:bg-[#FFF8E7] disabled:opacity-60"
                >
                  <FiRefreshCw />

                  Request Revision
                </button>

                <button
                  type="button"
                  onClick={() =>
                    rejectOfferLetter(
                      selectedOffer
                    )
                  }
                  disabled={Boolean(
                    processingId
                  )}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:opacity-60"
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
// EDIT FIELD
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

export default OfferLetterVerification;