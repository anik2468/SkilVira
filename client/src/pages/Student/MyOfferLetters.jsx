import React, { useEffect, useState } from "react";
import {
  FiAward,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiDownload,
  FiEye,
  FiFileText,
  FiMapPin,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";

const API_BASE = "http://localhost:5000";

const getAuthToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    ""
  );
};

const getFileUrl = (filePath) => {
  if (!filePath) return "";

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  if (filePath.startsWith("/")) {
    return `${API_BASE}${filePath}`;
  }

  return `${API_BASE}/${filePath}`;
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getProgramName = (item) => {
  if (item?.internship?.title) return item.internship.title;
  if (item?.course?.title) return item.course.title;
  if (item?.course?.name) return item.course.name;

  return item?.data?.role || "Program";
};

const getCompanyName = (item) => {
  return (
    item?.data?.companyName ||
    item?.internship?.company ||
    "SkilVira"
  );
};

const getRole = (item) => {
  return item?.data?.role || item?.internship?.title || "Intern";
};

const getLocation = (item) => {
  return item?.data?.location || item?.internship?.location || "Remote";
};

const getDuration = (item) => {
  return item?.data?.duration || item?.internship?.duration || "—";
};

const getOfferFile = (item) => {
  return (
    item?.offerLetterFile ||
    item?.offerLetter ||
    item?.data?.offerLetterFile ||
    ""
  );
};

const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-0.5 break-words text-sm font-semibold text-gray-900">
          {value || "—"}
        </p>
      </div>
    </div>
  );
};

export default function MyOfferLetters() {
  const [offerLetters, setOfferLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOfferLetters = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getAuthToken();

      const response = await fetch(`${API_BASE}/api/student-offer-letters`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to fetch offer letters"
        );
      }

      setOfferLetters(result?.data || []);
    } catch (err) {
      console.error("fetchOfferLetters error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOfferLetters();
  }, []);

  const openOfferLetter = (item) => {
    const fileUrl = getFileUrl(getOfferFile(item));

    if (!fileUrl) {
      setError("Offer letter file is not available.");
      return;
    }

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const downloadOfferLetter = async (item) => {
    try {
      const fileUrl = getFileUrl(getOfferFile(item));

      if (!fileUrl) {
        setError("Offer letter file is not available.");
        return;
      }

      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error("Unable to download offer letter");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = `Offer-Letter-${item?._id || "document"}.pdf`;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("downloadOfferLetter error:", err);

      const fileUrl = getFileUrl(getOfferFile(item));

      if (fileUrl) {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1.5">
              <FiAward className="text-[#D4AF37]" size={15} />
              <span className="text-xs font-semibold text-[#9B7B16]">
                My Documents
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              My Offer Letters
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View and download your approved course and internship offer
              letters.
            </p>
          </div>

          <button
            onClick={() => fetchOfferLetters(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#9B7B16] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="ml-4 rounded-md p-1 hover:bg-red-100"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="h-12 w-12 rounded-xl bg-gray-200" />
                <div className="mt-5 h-5 w-3/4 rounded bg-gray-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
                <div className="mt-6 space-y-3">
                  <div className="h-4 rounded bg-gray-100" />
                  <div className="h-4 rounded bg-gray-100" />
                  <div className="h-4 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : offerLetters.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiFileText size={28} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-gray-900">
              No approved offer letter yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Your offer letter will appear here after your payment/enrollment
              is approved and the generated offer letter is approved by the
              employee.
            </p>
          </div>
        ) : (
          <>
            {/* Count */}
            <div className="mb-5 text-sm text-gray-500">
              <span className="font-semibold text-gray-900">
                {offerLetters.length}
              </span>{" "}
              approved offer{" "}
              {offerLetters.length === 1 ? "letter" : "letters"}
            </div>

            {/* Cards */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {offerLetters.map((item) => {
                const programName = getProgramName(item);
                const companyName = getCompanyName(item);
                const role = getRole(item);
                const location = getLocation(item);
                const duration = getDuration(item);

                const joiningDate =
                  item?.data?.joiningDate || item?.joiningDate;

                const endDate = item?.data?.endDate || item?.endDate;

                const issueDate =
                  item?.data?.issueDate ||
                  item?.issueDate ||
                  item?.createdAt;

                const fileAvailable = Boolean(getOfferFile(item));

                return (
                  <div
                    key={item._id}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:shadow-lg"
                  >
                    {/* Top */}
                    <div className="border-b border-gray-100 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                          <FiFileText size={23} />
                        </div>

                        <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-green-700">
                          Approved
                        </span>
                      </div>

                      <h2 className="mt-5 line-clamp-2 text-lg font-bold text-gray-900">
                        {programName}
                      </h2>

                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <FiBriefcase
                          size={15}
                          className="shrink-0 text-[#D4AF37]"
                        />
                        <span className="truncate">{companyName}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 p-5">
                      <InfoItem icon={FiAward} label="Role" value={role} />

                      <InfoItem
                        icon={FiMapPin}
                        label="Location"
                        value={location}
                      />

                      <InfoItem
                        icon={FiClock}
                        label="Duration"
                        value={duration}
                      />

                      <InfoItem
                        icon={FiCalendar}
                        label="Joining Date"
                        value={formatDate(joiningDate)}
                      />

                      {endDate && (
                        <InfoItem
                          icon={FiCalendar}
                          label="End Date"
                          value={formatDate(endDate)}
                        />
                      )}

                      <div className="rounded-xl bg-gray-50 px-3.5 py-3 text-xs text-gray-500">
                        Issued on{" "}
                        <span className="font-semibold text-gray-800">
                          {formatDate(issueDate)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 border-t border-gray-100 bg-gray-50/70 p-4">
                      <button
                        onClick={() => setSelectedLetter(item)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#9B7B16]"
                      >
                        <FiEye size={16} />
                        View
                      </button>

                      <button
                        onClick={() => downloadOfferLetter(item)}
                        disabled={!fileAvailable}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#b99520] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FiDownload size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Preview Modal */}
      {selectedLetter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedLetter(null)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-gray-900">
                  {getProgramName(selectedLetter)}
                </h3>

                <p className="mt-0.5 text-sm text-gray-500">
                  {getCompanyName(selectedLetter)}
                </p>
              </div>

              <button
                onClick={() => setSelectedLetter(null)}
                className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Preview */}
            <div className="min-h-0 flex-1 bg-gray-100 p-3 sm:p-5">
              {getOfferFile(selectedLetter) ? (
                <iframe
                  title="Offer Letter Preview"
                  src={getFileUrl(getOfferFile(selectedLetter))}
                  className="h-[65vh] w-full rounded-xl border border-gray-200 bg-white"
                />
              ) : (
                <div className="flex h-[65vh] items-center justify-center rounded-xl bg-white text-sm text-gray-500">
                  Offer letter file is not available.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end">
              <button
                onClick={() => setSelectedLetter(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>

              <button
                onClick={() => downloadOfferLetter(selectedLetter)}
                disabled={!getOfferFile(selectedLetter)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#b99520] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiDownload size={16} />
                Download Offer Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}