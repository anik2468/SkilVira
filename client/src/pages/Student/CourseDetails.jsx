import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiLayers,
  FiRefreshCw,
  FiTag,
} from "react-icons/fi";

import {
  getCourse,
} from "../../services/courseService";

import {
  createPaymentOrder,
  verifyPayment,
} from "../../services/paymentService";

const API_BASE = "http://localhost:5000";


// =====================================================
// HELPERS
// =====================================================

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_BASE}${image}`;
  }

  return `${API_BASE}/${image}`;
};


const getUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    return null;
  }
};


// =====================================================
// COMPONENT
// =====================================================

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [paying, setPaying] =
    useState(false);

  const [error, setError] =
    useState("");

  const [paymentError, setPaymentError] =
    useState("");


  // ======================================
  // Load Course
  // ======================================

  const loadCourse = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      if (!id) {
        throw new Error(
          "Course ID is missing."
        );
      }

      const response =
        await getCourse(id);

      const loadedCourse =
        response?.course ||
        response?.data ||
        null;

      if (!loadedCourse) {
        throw new Error(
          "Course not found."
        );
      }

      setCourse(
        loadedCourse
      );
    } catch (err) {
      console.error(
        "loadCourse error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load course."
      );

      setCourse(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadCourse();
  }, [id]);


  // ======================================
  // Enroll / Razorpay
  // ======================================

  const handleEnroll = async () => {
    try {
      setPaying(true);
      setPaymentError("");

      const user = getUser();

      if (!user) {
        navigate("/choose-role");
        return;
      }

      const studentId =
        user?._id ||
        user?.id ||
        user?.userId;

      if (!studentId) {
        throw new Error(
          "Student account could not be identified."
        );
      }

      if (!course?._id) {
        throw new Error(
          "Course information is unavailable."
        );
      }

      const amount = Number(
        course?.price || 0
      );

      // ======================================
      // Free Course
      // ======================================

      if (amount <= 0) {
        alert(
          "Free course enrollment flow will be handled by the course enrollment system."
        );

        navigate(
          `/student/courses/${course._id}`
        );

        return;
      }

      // ======================================
      // Create Razorpay Order
      // ======================================

      const orderData =
        await createPaymentOrder({
          student: studentId,
          type: "course",
          course: course._id,
          amount,
        });

      if (
        !orderData?.success &&
        !orderData?.order
      ) {
        throw new Error(
          orderData?.message ||
            "Unable to create payment order."
        );
      }

      const order =
        orderData?.order;

      const paymentId =
        orderData?.paymentId;

      if (!order?.id) {
        throw new Error(
          "Payment order was not created."
        );
      }

      // ======================================
      // Razorpay Library Check
      // ======================================

      if (
        typeof window === "undefined" ||
        typeof window.Razorpay !==
          "function"
      ) {
        throw new Error(
          "Razorpay is not loaded. Please refresh the page and try again."
        );
      }

      const options = {
        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount:
          order.amount,

        currency:
          order.currency ||
          "INR",

        name:
          "SkilVira",

        description:
          course.title,

        order_id:
          order.id,

        handler:
          async (
            response
          ) => {
            try {
              const verifyData =
                await verifyPayment({
                  razorpay_order_id:
                    response
                      ?.razorpay_order_id,

                  razorpay_payment_id:
                    response
                      ?.razorpay_payment_id,

                  razorpay_signature:
                    response
                      ?.razorpay_signature,

                  paymentId:
                    paymentId,
                });

              if (
                verifyData?.success
              ) {
                alert(
                  "Payment successful! Your enrollment is being activated. 🎉"
                );

                navigate(
                  "/student/status"
                );
              } else {
                setPaymentError(
                  verifyData?.message ||
                    "Payment verification failed."
                );
              }
            } catch (err) {
              console.error(
                "Payment verification error:",
                err
              );

              setPaymentError(
                err?.response?.data
                  ?.message ||
                  err?.message ||
                  "Payment verification failed."
              );
            } finally {
              setPaying(false);
            }
          },

        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },

        prefill: {
          name:
            user?.name ||
            "",

          email:
            user?.email ||
            "",
        },

        theme: {
          color:
            "#D4AF37",
        },
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setPaymentError(
            response?.error
              ?.description ||
              "Payment failed. Please try again."
          );

          setPaying(false);
        }
      );

      razorpay.open();
    } catch (err) {
      console.error(
        "handleEnroll error:",
        err
      );

      setPaymentError(
        err?.response?.data
          ?.message ||
          err?.message ||
          "Payment could not be started."
      );

      setPaying(false);
    }
  };


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-6 p-1">
        <div className="h-6 w-28 animate-pulse rounded bg-gray-200" />

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="h-72 animate-pulse bg-gray-200" />

          <div className="space-y-4 p-6 sm:p-8">
            <div className="h-9 w-2/3 animate-pulse rounded bg-gray-200" />

            <div className="h-5 w-full animate-pulse rounded bg-gray-100" />

            <div className="h-5 w-4/5 animate-pulse rounded bg-gray-100" />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ======================================
  // Course Not Found
  // ======================================

  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            !
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Course Not Found
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error ||
              "The requested course could not be found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/courses"
              )
            }
            className="mt-6 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b99520]"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }


  const thumbnail =
    getImageUrl(
      course?.thumbnail
    );


  const modules =
    Array.isArray(course?.modules)
      ? course.modules
      : [];


  const price =
    Number(course?.price || 0);


  return (
    <div className="space-y-6 p-1">
      {/* Back */}
      <button
        type="button"
        onClick={() =>
          navigate(
            "/student/courses"
          )
        }
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#8B6E12]"
      >
        <FiArrowLeft
          size={16}
        />
        Back to Courses
      </button>


      {/* Error */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              loadCourse(true)
            }
            className="inline-flex items-center gap-1.5 font-semibold"
          >
            <FiRefreshCw size={14} />
            Retry
          </button>
        </div>
      )}


      {/* Payment Error */}
      {paymentError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {paymentError}
        </div>
      )}


      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Hero Image */}
        <div className="relative h-64 overflow-hidden bg-gray-100 sm:h-80 lg:h-[380px]">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={
                course?.title ||
                "Course"
              }
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#D4AF37]">
              <FiBookOpen
                size={60}
              />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              {course?.category && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#8B6E12]">
                  <FiTag
                    size={12}
                  />
                  {course.category}
                </span>
              )}

              {course?.status && (
                <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold capitalize text-gray-700">
                  {course.status}
                </span>
              )}
            </div>
          </div>
        </div>


        {/* Content */}
        <div className="p-5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Left */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {course.title}
              </h1>

              {course.description && (
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
                  {course.description}
                </p>
              )}


              {/* Meta */}
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <DetailBox
                  icon={<FiTag />}
                  label="Category"
                  value={
                    course.category ||
                    "General"
                  }
                />

                <DetailBox
                  icon={<FiClock />}
                  label="Duration"
                  value={
                    course.duration ||
                    "Flexible"
                  }
                />

                <DetailBox
                  icon={<FiBookOpen />}
                  label="Learning"
                  value={
                    modules.length
                      ? `${modules.length} Modules`
                      : "Course"
                  }
                />
              </div>


              {/* Modules */}
              <div className="mt-9">
                <div className="flex items-center gap-2">
                  <FiLayers
                    className="text-[#D4AF37]"
                    size={20}
                  />

                  <h2 className="text-2xl font-bold text-gray-900">
                    Course Modules
                  </h2>
                </div>

                {modules.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {modules.map(
                      (
                        module,
                        index
                      ) => (
                        <div
                          key={`${index}-${String(
                            module
                          )}`}
                          className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-sm font-bold text-[#9B7B16]">
                            {index + 1}
                          </div>

                          <div className="pt-1">
                            <p className="text-sm font-semibold leading-6 text-gray-800">
                              {typeof module ===
                              "string"
                                ? module
                                : module?.title ||
                                  module?.name ||
                                  `Module ${
                                    index + 1
                                  }`}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl bg-gray-50 p-5 text-sm text-gray-500">
                    Course modules will
                    appear here once they
                    are added.
                  </div>
                )}
              </div>
            </div>


            {/* Enrollment Panel */}
            <aside className="h-fit rounded-2xl border border-gray-200 bg-gray-50 p-5 lg:sticky lg:top-24">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Course Fee
              </p>

              <div className="mt-2">
                <span className="text-3xl font-extrabold text-gray-900">
                  {price > 0
                    ? `₹${price.toLocaleString(
                        "en-IN"
                      )}`
                    : "Free"}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <Feature
                  text="Access to course content"
                />

                <Feature
                  text="Track your learning progress"
                />

                <Feature
                  text="Completion certificate eligibility"
                />
              </div>

              <button
                type="button"
                onClick={handleEnroll}
                disabled={paying}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#b99520] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paying ? (
                  <>
                    <FiRefreshCw
                      size={17}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCreditCard
                      size={17}
                    />
                    {price > 0
                      ? "Enroll Now"
                      : "Start Course"}
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                Payment will be securely
                processed through the
                available payment system.
              </p>

              <Link
                to="/student/status"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:border-[#D4AF37] hover:text-[#8B6E12]"
              >
                <FiCheckCircle
                  size={14}
                />
                Check My Status
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};


// =====================================================
// SMALL COMPONENTS
// =====================================================

const DetailBox = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
        <span className="text-[#D4AF37]">
          {icon}
        </span>

        {label}
      </div>

      <p className="mt-2 text-sm font-bold capitalize text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
};


const Feature = ({
  text,
}) => {
  return (
    <div className="flex items-start gap-2.5 text-sm text-gray-600">
      <FiCheckCircle
        size={17}
        className="mt-0.5 shrink-0 text-[#D4AF37]"
      />

      <span>{text}</span>
    </div>
  );
};


export default CourseDetails;