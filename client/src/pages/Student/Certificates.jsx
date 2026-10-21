import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";

import {
  FiAward,
  FiDownload,
  FiCheckCircle,
  FiExternalLink,
  FiRefreshCw,
  FiAlertCircle,
  FiEye,
  FiCalendar,
} from "react-icons/fi";

import {
  getStudentCertificates,
} from "../../services/certificateService";


const API_BASE =
  API_ORIGIN;


// =====================================================
// HELPERS
// =====================================================

const getStoredUser = () => {
  try {
    const stored =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    return stored
      ? JSON.parse(stored)
      : null;
  } catch (error) {
    console.error(
      "Failed to read user:",
      error
    );

    return null;
  }
};


const getFileUrl = (file) => {
  if (!file) {
    return "";
  }

  if (
    file.startsWith("http://") ||
    file.startsWith("https://")
  ) {
    return file;
  }

  if (file.startsWith("/")) {
    return `${API_BASE}${file}`;
  }

  return `${API_BASE}/${file}`;
};


const formatDate = (date) => {
  if (!date) {
    return "Not available";
  }

  const parsed =
    new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};


const getCertificateTitle = (
  certificate
) => {
  return (
    certificate?.title ||
    certificate?.data?.courseName ||
    certificate?.course?.title ||
    certificate?.internship?.title ||
    "SkilVira Certificate"
  );
};


const getCredentialId = (
  certificate
) => {
  return (
    certificate?.credentialId ||
    certificate?.certificateId ||
    certificate?.data?.credentialId ||
    certificate?.data?.certificateId ||
    "N/A"
  );
};


const getIssuer = (
  certificate
) => {
  return (
    certificate?.issuer ||
    certificate?.data?.issuer ||
    "SkilVira"
  );
};


// =====================================================
// COMPONENT
// =====================================================

const Certificates = () => {
  const [certificates, setCertificates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


  const user = useMemo(
    () => getStoredUser(),
    []
  );


  // ======================================
  // Load Certificates
  // ======================================

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

      const studentId =
        user?._id ||
        user?.id;

      if (!studentId) {
        throw new Error(
          "Student session not found. Please login again."
        );
      }

      const response =
        await getStudentCertificates(
          studentId
        );

      const list =
        response?.certificates ||
        response?.data?.certificates ||
        response?.data ||
        [];

      setCertificates(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (err) {
      console.error(
        "loadCertificates error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load certificates."
      );

      setCertificates([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadCertificates();
  }, []);


  // ======================================
  // Verified Count
  // ======================================

  const verifiedCount =
    certificates.filter(
      (certificate) =>
        certificate?.verified === true ||
        certificate?.status ===
          "approved"
    ).length;


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-gray-100" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl bg-gray-100"
              />
            )
          )}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1.5">
            <FiAward
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-xs font-semibold text-[#8B6E12]">
              Student Achievements
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My Certificates
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Your approved SkilVira certificates and
            credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            loadCertificates(true)
          }
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>


      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiAward size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Certificates
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {certificates.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <FiCheckCircle size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Verified / Approved
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {verifiedCount}
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Error */}
      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2">
            <FiAlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={() =>
              loadCertificates(true)
            }
            className="font-semibold underline underline-offset-2"
          >
            Try Again
          </button>
        </div>
      )}


      {/* Empty */}
      {certificates.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100 sm:p-16">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiAward size={38} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            No Certificates Yet
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
            Complete your eligible course or internship.
            Your certificate will become available after
            completion and the required verification process.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map(
            (certificate) => {
              const file =
                getFileUrl(
                  certificate?.certificateFile ||
                    certificate?.file ||
                    certificate?.certificate
                );

              const credentialUrl =
                certificate?.credentialUrl ||
                certificate?.verificationUrl ||
                certificate?.data
                  ?.credentialUrl;

              const verified =
                certificate?.verified === true ||
                certificate?.status ===
                  "approved";

              return (
                <article
                  key={
                    certificate?._id ||
                    certificate?.id ||
                    getCredentialId(
                      certificate
                    )
                  }
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                      <FiAward
                        size={23}
                      />
                    </div>

                    {verified && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                        <FiCheckCircle />
                        Verified
                      </span>
                    )}
                  </div>


                  {/* Title */}
                  <h2 className="mt-5 line-clamp-2 text-xl font-bold text-gray-900">
                    {getCertificateTitle(
                      certificate
                    )}
                  </h2>


                  {/* Issuer */}
                  <p className="mt-2 text-sm text-gray-500">
                    Issued by{" "}
                    <span className="font-semibold text-gray-700">
                      {getIssuer(
                        certificate
                      )}
                    </span>
                  </p>


                  {/* Credential ID */}
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Credential ID
                    </p>

                    <p className="mt-2 break-all rounded-xl bg-gray-50 p-3 text-sm font-medium text-gray-700">
                      {getCredentialId(
                        certificate
                      )}
                    </p>
                  </div>


                  {/* Issue Date */}
                  {certificate?.issueDate && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <FiCalendar
                        className="text-[#D4AF37]"
                      />

                      <span>
                        Issued on{" "}
                        <strong className="text-gray-700">
                          {formatDate(
                            certificate.issueDate
                          )}
                        </strong>
                      </span>
                    </div>
                  )}


                  {/* Actions */}
                  <div className="mt-6 space-y-2">
                    {file ? (
                      <div className="flex gap-2">
                        <a
                          href={file}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#b99520]"
                        >
                          <FiEye />
                          View Certificate
                        </a>

                        <a
                          href={file}
                          download
                          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12]"
                          title="Download Certificate"
                        >
                          <FiDownload />
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
                        <FiClock />
                        Certificate file unavailable
                      </div>
                    )}

                    {credentialUrl && (
                      <a
                        href={credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37] px-4 py-3 text-sm font-semibold text-[#8B6E12] transition hover:bg-[#D4AF37]/5"
                      >
                        <FiExternalLink />
                        Verify Certificate
                      </a>
                    )}
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};


export default Certificates;