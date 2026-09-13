import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  FiMapPin,
  FiClock,
  FiCreditCard,
  FiCalendar,
  FiBriefcase,
  FiUsers,
  FiCheckCircle,
  FiBookOpen,
  FiArrowLeft,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

import {
  getInternshipById,
} from "../../services/internshipService";

import ApplyInternshipModal from "../../components/student/ApplyInternshipModal";

const API_BASE = "http://localhost:5000";


// =====================================================
// HELPERS
// =====================================================

const getFileUrl = (file) => {
  if (!file) return "";

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


const formatPrice = (price) => {
  const value = Number(price || 0);

  return `₹${value.toLocaleString("en-IN")}`;
};


const formatDate = (date) => {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not specified";
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


const asArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};


// =====================================================
// COMPONENT
// =====================================================

const InternshipDetails = () => {
  const { id } = useParams();

  const [internship, setInternship] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const user = useMemo(
    () => getStoredUser(),
    []
  );


  // ======================================
  // Load Internship
  // ======================================

  const loadInternship = async (
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
        await getInternshipById(id);

      const data =
        response?.internship ||
        response?.data ||
        response;

      setInternship(data || null);
    } catch (err) {
      console.error(
        "loadInternship error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load internship details."
      );

      setInternship(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    if (id) {
      loadInternship();
    }
  }, [id]);


  // ======================================
  // Derived Data
  // ======================================

  const benefits = useMemo(
    () =>
      asArray(
        internship?.benefits
      ),
    [internship]
  );

  const responsibilities = useMemo(
    () =>
      asArray(
        internship?.responsibilities
      ),
    [internship]
  );

  const requirements = useMemo(
    () =>
      asArray(
        internship?.requirements
      ),
    [internship]
  );

  const skills = useMemo(
    () =>
      asArray(
        internship?.skills
      ),
    [internship]
  );

  const image = getFileUrl(
    internship?.internshipImage
  );

  const price = Number(
    internship?.price || 0
  );

  const isPaid = price > 0;

  const openings = Number(
    internship?.openings || 0
  );


  // ======================================
  // Apply
  // ======================================

  const handleApply = () => {
    if (!user) {
      window.location.href =
        `/login/student?redirect=/student/internships/${id}`;

      return;
    }

    if (
      String(user.role || "").toLowerCase() !==
      "student"
    ) {
      return;
    }

    setShowModal(true);
  };


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />

        <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="h-9 w-3/4 animate-pulse rounded bg-gray-200" />

          <div className="mt-4 h-5 w-1/3 animate-pulse rounded bg-gray-100" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-12 animate-pulse rounded-xl bg-gray-100"
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }


  // ======================================
  // Error / Not Found
  // ======================================

  if (error || !internship) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <FiAlertCircle size={30} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            {error
              ? "Unable to Load Internship"
              : "Internship Not Found"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error ||
              "The internship may have been removed or is no longer available."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/student/internships"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12]"
            >
              <FiArrowLeft />
              Back to Internships
            </Link>

            {error && (
              <button
                type="button"
                onClick={() =>
                  loadInternship(true)
                }
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b99520] disabled:opacity-60"
              >
                <FiRefreshCw
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }


  // ======================================
  // UI
  // ======================================

  return (
    <>
      <div className="space-y-7 pb-8">
        {/* Back */}
        <Link
          to="/student/internships"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#8B6E12]"
        >
          <FiArrowLeft />
          Back to Internships
        </Link>


        {/* Hero Image */}
        {image ? (
          <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
            <img
              src={image}
              alt={
                internship.title ||
                "Internship"
              }
              className="h-64 w-full object-cover sm:h-80 lg:h-[380px]"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 sm:p-8">
              <div className="flex flex-wrap gap-2">
                {internship.workMode && (
                  <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-800">
                    {internship.workMode}
                  </span>
                )}

                <span className="rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white">
                  {isPaid
                    ? "Paid Internship"
                    : "Free Internship"}
                </span>

                {internship.category && (
                  <span className="rounded-full bg-[#D4AF37] px-3 py-1.5 text-xs font-bold text-white">
                    {internship.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-52 items-center justify-center rounded-2xl bg-gray-100 sm:h-64">
            <FiBriefcase
              size={52}
              className="text-gray-300"
            />
          </div>
        )}


        {/* Main Summary */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {internship.sourceType ===
                  "skilvira" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
                    ⭐ SkilVira Official
                  </span>
                )}

                {internship.approvalStatus && (
                  <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold capitalize text-green-700">
                    {internship.approvalStatus}
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                {internship.title}
              </h1>

              <p className="mt-2 text-lg font-semibold text-[#D4AF37]">
                {internship.company ||
                  "SkilVira"}
              </p>
            </div>

            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] lg:flex">
              <FiBriefcase size={26} />
            </div>
          </div>


          {/* Meta */}
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem
              icon={<FiMapPin />}
              label="Location"
              value={
                internship.location ||
                "Remote"
              }
            />

            <DetailItem
              icon={<FiClock />}
              label="Duration"
              value={
                internship.duration ||
                "Not specified"
              }
            />

            <DetailItem
              icon={<FiCreditCard />}
              label="Fee"
              value={formatPrice(price)}
            />

            <DetailItem
              icon={<FiCalendar />}
              label="Last Date"
              value={formatDate(
                internship.lastDate
              )}
            />
          </div>


          {/* Extra info */}
          <div className="mt-6 flex flex-wrap gap-2">
            {internship.workMode && (
              <span className="rounded-full bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-[#8B6E12]">
                {internship.workMode}
              </span>
            )}

            {internship.category && (
              <span className="rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-700">
                {internship.category}
              </span>
            )}

            {openings > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                <FiUsers size={15} />
                {openings} Openings
              </span>
            )}

            {internship.internshipType && (
              <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold capitalize text-gray-700">
                {internship.internshipType}
              </span>
            )}
          </div>
        </section>


        {/* Description */}
        {internship.description && (
          <ContentSection
            title="Description"
            icon={<FiBookOpen />}
          >
            <p className="whitespace-pre-line leading-8 text-gray-600">
              {internship.description}
            </p>
          </ContentSection>
        )}


        {/* Responsibilities */}
        {responsibilities.length >
          0 && (
          <ContentSection
            title="Responsibilities"
            icon={<FiBriefcase />}
          >
            <div className="grid gap-3">
              {responsibilities.map(
                (item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-start gap-3 rounded-xl bg-gray-50 p-4"
                  >
                    <FiCheckCircle
                      className="mt-0.5 shrink-0 text-[#D4AF37]"
                      size={18}
                    />

                    <span className="text-sm leading-6 text-gray-600">
                      {item}
                    </span>
                  </div>
                )
              )}
            </div>
          </ContentSection>
        )}


        {/* Requirements */}
        {requirements.length >
          0 && (
          <ContentSection
            title="Requirements"
            icon={<FiCheckCircle />}
          >
            <div className="grid gap-3">
              {requirements.map(
                (item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-start gap-3 rounded-xl bg-gray-50 p-4"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-xs font-bold text-[#8B6E12]">
                      {index + 1}
                    </span>

                    <span className="text-sm leading-6 text-gray-600">
                      {item}
                    </span>
                  </div>
                )
              )}
            </div>
          </ContentSection>
        )}


        {/* Skills */}
        {skills.length > 0 && (
          <ContentSection
            title="Skills"
            icon={<FiBookOpen />}
          >
            <div className="flex flex-wrap gap-2">
              {skills.map(
                (skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </ContentSection>
        )}


        {/* Benefits */}
        {benefits.length > 0 && (
          <ContentSection
            title="You Will Receive"
            icon={<FiCheckCircle />}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map(
                (item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4"
                  >
                    <FiCheckCircle
                      className="mt-0.5 shrink-0 text-green-600"
                      size={18}
                    />

                    <span className="text-sm leading-6 text-green-800">
                      {item}
                    </span>
                  </div>
                )
              )}
            </div>
          </ContentSection>
        )}


        {/* Application CTA */}
        <section className="sticky bottom-3 z-20 rounded-2xl border border-[#D4AF37]/20 bg-white/95 p-4 shadow-lg backdrop-blur sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Internship Fee
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(price)}
              </p>

              {isPaid && (
                <p className="mt-1 text-xs text-gray-500">
                  Payment is required to continue
                  with the application.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-7 py-3.5 text-base font-bold text-white transition hover:bg-[#b99520]"
            >
              {isPaid
                ? `Pay ${formatPrice(
                    price
                  )} & Apply`
                : "Apply Now"}
            </button>
          </div>
        </section>
      </div>


      {/* Apply Modal */}
      {showModal && (
        <ApplyInternshipModal
          internship={internship}
          studentId={
            user?._id ||
            user?.id
          }
          onClose={() =>
            setShowModal(false)
          }
        />
      )}
    </>
  );
};


// =====================================================
// DETAIL ITEM
// =====================================================

const DetailItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        <span className="text-[#D4AF37]">
          {icon}
        </span>

        {label}
      </div>

      <p className="mt-2 text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
};


// =====================================================
// CONTENT SECTION
// =====================================================

const ContentSection = ({
  title,
  icon,
  children,
}) => {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
};


export default InternshipDetails;