import { API_URL } from "../../services/urlConfig.js";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiFileText,
} from "react-icons/fi";

import { getCourse } from "../../services/courseService";
import api from "../../services/api";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const registrationClosed = (value) => {
  if (!value) return false;
  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) return false;
  deadline.setUTCHours(23, 59, 59, 999);
  return deadline.getTime() < Date.now();
};

const CourseCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getCourse(id);
        const item = response?.course || response?.data || null;

        if (!item?._id) throw new Error("Course not found.");
        if (active) setCourse(item);
      } catch (err) {
        if (active) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load course details."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [id]);

  const price = Number(course?.price || 0);
  const isFree = price <= 0;
  const closed = registrationClosed(course?.registrationDeadline);

  const handleContinue = async () => {
    if (!course?._id || submitting) return;

    if (closed) {
      setError("Registration for this course has closed.");
      return;
    }

    setError("");

    if (!isFree) {
      navigate("/student/manual-payment", {
        state: {
          type: "course",
          course,
          amount: price,
        },
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post(
        `/enrollment/free-course/${course._id}`
      );

      alert(
        response?.data?.message ||
          "Successfully enrolled in the free course."
      );
      navigate("/student/my-courses", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Free enrollment failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-gray-500">
        Loading enrollment details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-red-600">{error || "Course not found."}</p>
        <Link to="/student/courses" className="mt-4 inline-flex items-center gap-2 font-semibold text-[#9B7B16]">
          <FiArrowLeft /> Back to courses
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          to={`/student/courses/${course._id}`}
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#9B7B16]"
        >
          <FiArrowLeft /> Back to course
        </Link>

        <div className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9B7B16]">
            SKILVIRA · ENROLLMENT REVIEW
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
            Review Your Enrollment
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Review the course fee and inclusions before continuing to payment.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {course.thumbnail && (
              <img
                src={
                  course.thumbnail.startsWith("http")
                    ? course.thumbnail
                    : `${String(import.meta.env.VITE_API_URL || API_URL).replace(/\/api\/?$/, "").replace(/\/$/, "")}/${course.thumbnail.replace(/^\/+/, "")}`
                }
                alt={course.title}
                className="h-48 w-full object-cover sm:h-56"
              />
            )}

            <div className="p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-wider text-[#9B7B16]">
                Selected course
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-gray-950">
                {course.title}
              </h2>
              {course.description && (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                  {course.description}
                </p>
              )}

              <div className="mt-6 divide-y divide-gray-100">
                <div className="flex items-center gap-3 py-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/15 text-[#8B6B10]">
                    <FiFileText size={19} />
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Learning notes</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Included at no additional cost
                    </p>
                  </div>
                  <FiCheckCircle className="text-green-600" size={20} />
                </div>

                <div className="flex items-center gap-3 py-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/15 text-[#8B6B10]">
                    <FiAward size={19} />
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Completion certificate</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Eligibility after meeting course completion requirements
                    </p>
                  </div>
                  <FiCheckCircle className="text-green-600" size={20} />
                </div>

                {course.duration && (
                  <div className="flex items-center gap-3 py-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                      <FiClock size={19} />
                    </span>
                    <div>
                      <p className="font-bold text-gray-900">Duration</p>
                      <p className="mt-1 text-sm text-gray-500">{course.duration}</p>
                    </div>
                  </div>
                )}

                {(course.startDate || course.endDate || course.registrationDeadline) && (
                  <div className="flex items-start gap-3 py-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                      <FiCalendar size={19} />
                    </span>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900">Important dates</p>
                      {course.registrationDeadline && (
                        <p className="text-sm text-gray-500">
                          Registration closes: {formatDate(course.registrationDeadline)}
                        </p>
                      )}
                      {course.startDate && (
                        <p className="text-sm text-gray-500">
                          Course starts: {formatDate(course.startDate)}
                        </p>
                      )}
                      {course.endDate && (
                        <p className="text-sm text-gray-500">
                          Course ends: {formatDate(course.endDate)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
            <p className="text-xs font-black uppercase tracking-wider text-gray-500">
              Fee summary
            </p>

            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm text-gray-600">Course fee</p>
                <p className="mt-1 text-3xl font-black text-gray-950">
                  {isFree ? "Free" : `₹${price.toLocaleString("en-IN")}`}
                </p>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                {isFree ? "No payment" : "Manual payment"}
              </span>
            </div>

            <div className="my-5 border-t border-gray-100" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Course fee</span>
                <span className="font-semibold text-gray-900">
                  {isFree ? "₹0" : `₹${price.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Learning notes</span>
                <span className="font-semibold text-green-700">Free</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Total payable</span>
                <span className="text-lg font-black text-gray-950">
                  {isFree ? "₹0" : `₹${price.toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>

            {error && (
              <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {closed ? (
              <button disabled className="mt-6 w-full rounded-xl bg-gray-300 px-4 py-3.5 font-bold text-gray-600">
                Registration Closed
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContinue}
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3.5 font-black text-gray-950 transition hover:bg-[#c6a027] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  "Processing..."
                ) : isFree ? (
                  <>
                    <FiBookOpen /> Enroll for Free
                  </>
                ) : (
                  <>
                    <FiCreditCard /> Pay Now
                  </>
                )}
              </button>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              {isFree
                ? "Your course enrollment will be confirmed after you continue."
                : "Pay using the SkilVira UPI QR, UPI ID or bank details. Upload your transaction reference and payment screenshot for employee verification."}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CourseCheckout;
