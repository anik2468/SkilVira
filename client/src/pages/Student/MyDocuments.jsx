import { useEffect, useMemo, useState } from "react";

import {
  FiAward,
  FiFileText,
  FiEye,
  FiDownload,
  FiClock,
  FiRefreshCw,
  FiAlertCircle,
  FiExternalLink,
} from "react-icons/fi";

import {
  getMyDocuments,
} from "../../services/studentDocumentService";


const API_BASE =
  "http://localhost:5000";


// =====================================================
// HELPERS
// =====================================================

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


const getProgramName = (
  item
) => {
  return (
    item?.course?.title ||
    item?.internship?.title ||
    item?.data?.courseName ||
    item?.programName ||
    item?.title ||
    "Program"
  );
};


const getCertificateId = (
  item
) => {
  return (
    item?.certificateId ||
    item?.data?.certificateId ||
    item?.id ||
    "N/A"
  );
};


const getReportId = (
  item
) => {
  return (
    item?.reportId ||
    item?.data?.reportId ||
    item?.id ||
    "N/A"
  );
};


// =====================================================
// COMPONENT
// =====================================================

const MyDocuments = () => {
  const [documents, setDocuments] =
    useState({
      certificates: [],
      reports: [],
    });

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


  // ======================================
  // Load Documents
  // ======================================

  const fetchDocuments = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await getMyDocuments();

      const certificates =
        response?.certificates ||
        response?.data?.certificates ||
        [];

      const reports =
        response?.reports ||
        response?.data?.reports ||
        [];

      setDocuments({
        certificates:
          Array.isArray(certificates)
            ? certificates
            : [],

        reports:
          Array.isArray(reports)
            ? reports
            : [],
      });
    } catch (err) {
      console.error(
        "Failed to fetch documents:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load your documents."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    fetchDocuments();
  }, []);


  // ======================================
  // Stats
  // ======================================

  const stats = useMemo(
    () => ({
      certificates:
        documents.certificates
          .length,

      reports:
        documents.reports.length,

      total:
        documents.certificates
          .length +
        documents.reports.length,
    }),
    [documents]
  );


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-9 w-56 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-gray-100" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl bg-gray-100"
              />
            )
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-gray-100"
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
            <FiFileText
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-xs font-semibold text-[#8B6E12]">
              Student Documents
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My Documents
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Access your approved certificates and
            performance reports in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            fetchDocuments(true)
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
              fetchDocuments(true)
            }
            className="font-semibold underline underline-offset-2"
          >
            Try Again
          </button>
        </div>
      )}


      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <DocumentStat
          icon={<FiFileText />}
          label="Total Documents"
          value={stats.total}
        />

        <DocumentStat
          icon={<FiAward />}
          label="Certificates"
          value={
            stats.certificates
          }
        />

        <DocumentStat
          icon={<FiFileText />}
          label="Reports"
          value={stats.reports}
        />
      </div>


      {/* Certificates */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiAward size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Certificates
            </h2>

            <p className="text-sm text-gray-500">
              {stats.certificates} approved
            </p>
          </div>
        </div>


        {documents.certificates
          .length === 0 ? (
          <EmptyDocumentState
            icon={<FiAward />}
            title="No Certificate Available Yet"
            description="Complete your course or internship and wait for the required employee verification."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {documents.certificates.map(
              (certificate) => {
                const file =
                  getFileUrl(
                    certificate?.certificateFile ||
                      certificate?.file ||
                      certificate?.certificate
                  );

                return (
                  <DocumentCard
                    key={
                      certificate?._id ||
                      certificate?.id
                    }
                    icon={
                      <FiAward />
                    }
                    title={getProgramName(
                      certificate
                    )}
                    idLabel="Certificate ID"
                    idValue={getCertificateId(
                      certificate
                    )}
                    file={file}
                    type="certificate"
                  />
                );
              }
            )}
          </div>
        )}
      </section>


      {/* Reports */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiFileText size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Performance Reports
            </h2>

            <p className="text-sm text-gray-500">
              {stats.reports} approved
            </p>
          </div>
        </div>


        {documents.reports.length ===
        0 ? (
          <EmptyDocumentState
            icon={<FiClock />}
            title="No Performance Report Available Yet"
            description="Your performance report will appear here after completion and employee verification."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {documents.reports.map(
              (report) => {
                const file =
                  getFileUrl(
                    report?.reportFile ||
                      report?.file ||
                      report?.report
                  );

                return (
                  <DocumentCard
                    key={
                      report?._id ||
                      report?.id
                    }
                    icon={
                      <FiFileText />
                    }
                    title={getProgramName(
                      report
                    )}
                    idLabel="Report ID"
                    idValue={getReportId(
                      report
                    )}
                    file={file}
                    type="report"
                  />
                );
              }
            )}
          </div>
        )}
      </section>
    </div>
  );
};


// =====================================================
// DOCUMENT CARD
// =====================================================

const DocumentCard = ({
  icon,
  title,
  idLabel,
  idValue,
  file,
  type,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          Approved
        </span>
      </div>


      <h3 className="mt-5 line-clamp-2 font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 break-all text-xs text-gray-500">
        {idLabel}:{" "}
        <span className="font-medium text-gray-700">
          {idValue}
        </span>
      </p>


      <div className="mt-5 flex gap-2">
        {file ? (
          <>
            <a
              href={file}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b99520]"
            >
              <FiEye />
              View
            </a>

            <a
              href={file}
              download
              className="flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12]"
              title={`Download ${type}`}
            >
              <FiDownload />
            </a>

            <a
              href={file}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12]"
              title="Open in new tab"
            >
              <FiExternalLink />
            </a>
          </>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
            <FiClock />
            Document file unavailable
          </div>
        )}
      </div>
    </div>
  );
};


// =====================================================
// EMPTY STATE
// =====================================================

const EmptyDocumentState = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
        {icon}
      </div>

      <p className="mt-4 font-semibold text-gray-700">
        {title}
      </p>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-400">
        {description}
      </p>
    </div>
  );
};


// =====================================================
// STAT
// =====================================================

const DocumentStat = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">
          {label}
        </p>

        <p className="mt-0.5 text-2xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
};


export default MyDocuments;