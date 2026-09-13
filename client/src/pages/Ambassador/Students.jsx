import { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiMousePointer,
  FiUserPlus,
  FiBookOpen,
  FiTrendingUp,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
  FiMail,
  FiCalendar,
  FiCreditCard,
  FiArrowUpRight,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../services/api";

const GOLD = "#D4AF37";

const Students = () => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("user");

      if (!stored) return null;

      return JSON.parse(stored);
    } catch (err) {
      console.error("Ambassador user parse error:", err);
      return null;
    }
  };

  const getUserId = (storedUser) =>
    storedUser?.id ||
    storedUser?._id ||
    storedUser?.userId ||
    "";

  const loadStudents = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const storedUser = getStoredUser();

      if (!storedUser) {
        setError("Ambassador session not found.");
        return;
      }

      setUser(storedUser);

      const userId = getUserId(storedUser);

      if (!userId) {
        setError("Ambassador ID is missing.");
        return;
      }

      let payload = {};

      /*
       * Preferred dedicated endpoint.
       * This should return ONLY students attributed to
       * the logged-in ambassador's referral.
       */
      try {
        const response = await api.get(
          `/ambassador/students/${userId}`
        );

        payload =
          response?.data?.data ||
          response?.data ||
          {};
      } catch (primaryError) {
        /*
         * Fallback to ambassador dashboard data.
         * This keeps the page usable with the existing
         * ambassador dashboard API.
         */
        console.warn(
          "Dedicated ambassador students endpoint unavailable. Falling back to dashboard.",
          primaryError?.response?.data?.message ||
            primaryError?.message
        );

        const response = await api.get(
          `/ambassador/dashboard/${userId}`
        );

        payload =
          response?.data?.data ||
          response?.data ||
          {};
      }

      const studentList =
        payload?.students ||
        payload?.referredStudents ||
        payload?.referredStudentsList ||
        payload?.referrals ||
        [];

      setStudents(
        Array.isArray(studentList)
          ? studentList
          : []
      );

      setAnalytics(
        payload?.analytics ||
          payload?.referralAnalytics ||
          payload ||
          null
      );
    } catch (err) {
      console.error(
        "Ambassador students error:",
        err
      );

      setStudents([]);
      setAnalytics(null);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load referred students."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
   * Analytics can come from backend.
   * If backend already returns exact values, we use them.
   * Otherwise derive values from returned student records.
   */
  const metrics = useMemo(() => {
    const clickCount = Number(
      analytics?.clicks ??
        analytics?.referralClicks ??
        analytics?.totalClicks ??
        user?.referralClicks ??
        0
    );

    const registrationCount = Number(
      analytics?.registrations ??
        analytics?.registeredStudents ??
        analytics?.totalRegistrations ??
        students.length
    );

    const enrolledFromRecords = students.filter(
      (student) =>
        isEnrolledStudent(student)
    ).length;

    const enrollmentCount = Number(
      analytics?.enrollments ??
        analytics?.successfulReferrals ??
        analytics?.enrolledStudents ??
        enrolledFromRecords
    );

    const activeCount = students.filter(
      (student) =>
        isActiveStudent(student)
    ).length;

    const completedCount = students.filter(
      (student) =>
        isCompletedStudent(student)
    ).length;

    const conversionRate =
      clickCount > 0
        ? Math.round(
            (enrollmentCount /
              clickCount) *
              100
          )
        : 0;

    const registrationRate =
      clickCount > 0
        ? Math.round(
            (registrationCount /
              clickCount) *
              100
          )
        : 0;

    return {
      clicks: clickCount,
      registrations: registrationCount,
      enrollments: enrollmentCount,
      active: activeCount,
      completed: completedCount,
      registrationRate,
      conversionRate,
    };
  }, [analytics, students, user]);

  const courses = useMemo(() => {
    const courseMap = new Map();

    students.forEach((student) => {
      const course = getCourseName(student);

      if (!course) return;

      courseMap.set(
        course,
        (courseMap.get(course) || 0) + 1
      );
    });

    return Array.from(
      courseMap.entries()
    )
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [students]);

  const enrolledCourses = useMemo(() => {
    const courseMap = new Map();

    students
      .filter((student) =>
        isEnrolledStudent(student)
      )
      .forEach((student) => {
        const course = getCourseName(student);

        if (!course) return;

        courseMap.set(
          course,
          (courseMap.get(course) || 0) + 1
        );
      });

    return Array.from(
      courseMap.entries()
    )
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [students]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const name = String(
        student?.name ||
          student?.fullName ||
          student?.studentName ||
          ""
      ).toLowerCase();

      const email = String(
        student?.email ||
          student?.studentEmail ||
          ""
      ).toLowerCase();

      const course = getCourseName(
        student
      ).toLowerCase();

      const status = getStudentStatus(
        student
      ).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query) ||
        course.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        status ===
          statusFilter.toLowerCase();

      const matchesCourse =
        courseFilter === "All" ||
        course ===
          courseFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCourse
      );
    });
  }, [
    students,
    search,
    statusFilter,
    courseFilter,
  ]);

  const copyStudentEmail = async (
    email
  ) => {
    if (!email) return;

    try {
      await navigator.clipboard.writeText(
        email
      );
    } catch (err) {
      console.error(
        "Email copy error:",
        err
      );
    }
  };

  if (loading) {
    return <StudentsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiUsers
                  size={14}
                  style={{ color: GOLD }}
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Referral Students
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                My Referred Students
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Track every student who came through your referral,
                including clicks, registrations, enrollments and
                the courses they enrolled in.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadStudents(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
            >
              <FiRefreshCw
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh Data"}
            </button>
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FUNNEL */}
        <section>
          <div className="mb-4">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Referral Funnel
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-950">
              Your Referral Performance
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Referral Clicks"
              value={metrics.clicks}
              icon={<FiMousePointer />}
              tone="gold"
              helper="Students who opened your referral link"
            />

            <MetricCard
              label="Registrations"
              value={metrics.registrations}
              icon={<FiUserPlus />}
              tone="blue"
              helper={`${metrics.registrationRate}% click-to-registration`}
            />

            <MetricCard
              label="Enrollments"
              value={metrics.enrollments}
              icon={<FiBookOpen />}
              tone="green"
              helper={`${metrics.conversionRate}% click-to-enrollment`}
            />

            <MetricCard
              label="Completed"
              value={metrics.completed}
              icon={<FiCheckCircle />}
              tone="purple"
              helper="Students who completed their enrollment journey"
            />
          </div>
        </section>

        {/* FUNNEL VISUAL */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Conversion Journey
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Click → Register → Enroll
              </h2>
            </div>

            <div className="flex items-center gap-2 text-sm font-black text-emerald-600">
              <FiTrendingUp />
              {metrics.conversionRate}% overall conversion
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <FunnelItem
              number="01"
              title="Clicks"
              value={metrics.clicks}
              width={100}
              icon={<FiMousePointer />}
            />

            <FunnelItem
              number="02"
              title="Registrations"
              value={metrics.registrations}
              width={
                metrics.clicks > 0
                  ? Math.max(
                      8,
                      Math.round(
                        (metrics.registrations /
                          metrics.clicks) *
                          100
                      )
                    )
                  : 0
              }
              icon={<FiUserPlus />}
            />

            <FunnelItem
              number="03"
              title="Enrollments"
              value={metrics.enrollments}
              width={
                metrics.clicks > 0
                  ? Math.max(
                      8,
                      Math.round(
                        (metrics.enrollments /
                          metrics.clicks) *
                          100
                      )
                    )
                  : 0
              }
              icon={<FiBookOpen />}
            />
          </div>
        </section>

        {/* ENROLLED COURSES */}
        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Course Performance
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-950">
              Enrollments by Course
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              See which SkilVira courses are getting the most
              enrollments from your referral.
            </p>

            {enrolledCourses.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-[#FAFAF8] p-8 text-center">
                <FiBookOpen
                  className="mx-auto text-gray-300"
                  size={28}
                />

                <p className="mt-3 text-sm font-bold text-gray-500">
                  No enrolled course data yet.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {enrolledCourses.map(
                  (course, index) => {
                    const percentage =
                      metrics.enrollments > 0
                        ? Math.round(
                            (course.count /
                              metrics.enrollments) *
                              100
                          )
                        : 0;

                    return (
                      <div
                        key={`${course.name}-${index}`}
                        className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-gray-900">
                              {course.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {course.count} enrollment
                              {course.count !== 1
                                ? "s"
                                : ""}
                            </p>
                          </div>

                          <span
                            className="shrink-0 text-sm font-black"
                            style={{
                              color: GOLD,
                            }}
                          >
                            {percentage}%
                          </span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: GOLD,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* QUICK NUMBERS */}
          <div className="rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-7">
            <p
              className="text-xs font-black uppercase tracking-[0.18em]"
              style={{ color: GOLD }}
            >
              Your Referral Impact
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Student Conversion Summary
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <DarkStat
                label="Total Clicks"
                value={metrics.clicks}
                icon={<FiMousePointer />}
              />

              <DarkStat
                label="Registrations"
                value={metrics.registrations}
                icon={<FiUserPlus />}
              />

              <DarkStat
                label="Successful Enrollments"
                value={metrics.enrollments}
                icon={<FiBookOpen />}
              />

              <DarkStat
                label="Active Students"
                value={metrics.active}
                icon={<FiTrendingUp />}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-black"
                  style={{
                    backgroundColor: GOLD,
                  }}
                >
                  <FiAwardIcon />
                </div>

                <div>
                  <p className="text-sm font-black">
                    Referral Impact
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    {metrics.enrollments} student
                    {metrics.enrollments !== 1
                      ? "s have"
                      : " has"}{" "}
                    enrolled through your referral.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FILTERS */}
        <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <FiSearch
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search student name, email or course..."
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <FilterButton
                  icon={<FiFilter />}
                  label="All"
                  active={
                    statusFilter === "All"
                  }
                  onClick={() =>
                    setStatusFilter("All")
                  }
                />

                <FilterButton
                  label="Enrolled"
                  active={
                    statusFilter ===
                    "Enrolled"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "Enrolled"
                    )
                  }
                />

                <FilterButton
                  label="Pending"
                  active={
                    statusFilter ===
                    "Pending"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "Pending"
                    )
                  }
                />

                <FilterButton
                  label="Completed"
                  active={
                    statusFilter ===
                    "Completed"
                  }
                  onClick={() =>
                    setStatusFilter(
                      "Completed"
                    )
                  }
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setCourseFilter("All")
                }
                className={`rounded-xl px-3 py-2 text-xs font-black ${
                  courseFilter === "All"
                    ? "text-black"
                    : "bg-gray-100 text-gray-600"
                }`}
                style={
                  courseFilter === "All"
                    ? {
                        backgroundColor:
                          GOLD,
                      }
                    : undefined
                }
              >
                All Courses
              </button>

              {courses.map((course) => (
                <button
                  type="button"
                  key={course.name}
                  onClick={() =>
                    setCourseFilter(
                      course.name.toLowerCase()
                    )
                  }
                  className={`max-w-[220px] truncate rounded-xl px-3 py-2 text-xs font-black ${
                    courseFilter ===
                    course.name.toLowerCase()
                      ? "text-black"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  style={
                    courseFilter ===
                    course.name.toLowerCase()
                      ? {
                          backgroundColor:
                            GOLD,
                        }
                      : undefined
                  }
                >
                  {course.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* STUDENT LIST */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Referral Student Directory
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Students from Your Referral
              </h2>
            </div>

            <span className="text-sm font-semibold text-gray-500">
              {filteredStudents.length} student
              {filteredStudents.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          {filteredStudents.length === 0 ? (
            <EmptyStudents
              hasFilters={
                Boolean(search.trim()) ||
                statusFilter !== "All" ||
                courseFilter !== "All"
              }
            />
          ) : (
            <div className="mt-6 space-y-3">
              {filteredStudents.map(
                (student, index) => (
                  <StudentCard
                    key={
                      student?._id ||
                      student?.id ||
                      `${student?.email}-${index}`
                    }
                    student={student}
                    onView={() =>
                      setSelectedStudent(
                        student
                      )
                    }
                    onCopyEmail={() =>
                      copyStudentEmail(
                        student?.email ||
                          student?.studentEmail
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() =>
            setSelectedStudent(null)
          }
        />
      )}
    </div>
  );
};

/* -------------------------------------------------------
   STUDENT CARD
------------------------------------------------------- */

const StudentCard = ({
  student,
  onView,
  onCopyEmail,
}) => {
  const name =
    student?.name ||
    student?.fullName ||
    student?.studentName ||
    student?.email ||
    "Student";

  const email =
    student?.email ||
    student?.studentEmail ||
    "Email unavailable";

  const course =
    getCourseName(student) ||
    "Course not available";

  const status =
    getStudentStatus(student);

  const enrolled =
    isEnrolledStudent(student);

  return (
    <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4 transition hover:bg-white hover:shadow-md sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-center">

        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-black"
            style={{
              backgroundColor: GOLD,
            }}
          >
            {getInitials(name)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-gray-950">
              {name}
            </p>

            <button
              type="button"
              onClick={onCopyEmail}
              className="mt-1 flex max-w-full items-center gap-1 truncate text-xs text-gray-500 hover:text-gray-900"
            >
              <FiMail className="shrink-0" />
              <span className="truncate">
                {email}
              </span>
            </button>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-gray-400">
            Course
          </p>

          <p className="mt-1 truncate text-sm font-black text-gray-800">
            {course}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-gray-400">
            Enrollment
          </p>

          <span
            className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${getStatusStyle(
              status
            )}`}
          >
            {getStatusIcon(status)}
            {capitalize(status)}
          </span>
        </div>

        <div className="flex gap-2 lg:justify-end">
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:border-[#D4AF37]"
          >
            <FiEye />
            View Details
          </button>

          {enrolled && (
            <span
              className="hidden items-center gap-1 text-xs font-black sm:inline-flex"
              style={{
                color: GOLD,
              }}
            >
              <FiCheckCircle />
              Enrolled
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   STUDENT DETAIL MODAL
------------------------------------------------------- */

const StudentDetailModal = ({
  student,
  onClose,
}) => {
  const name =
    student?.name ||
    student?.fullName ||
    student?.studentName ||
    "Student";

  const email =
    student?.email ||
    student?.studentEmail ||
    "Not available";

  const phone =
    student?.phone ||
    student?.mobile ||
    student?.phoneNumber ||
    "Not available";

  const course =
    getCourseName(student) ||
    "Not available";

  const status =
    getStudentStatus(student);

  const enrolledAt =
    student?.enrolledAt ||
    student?.enrollmentDate ||
    student?.enrolledDate ||
    student?.createdAt ||
    "";

  const amount =
    student?.amountPaid ??
    student?.paymentAmount ??
    student?.amount ??
    student?.payment?.amount ??
    null;

  const paymentStatus =
    student?.paymentStatus ||
    student?.payment?.status ||
    "";

  const studentId =
    student?._id ||
    student?.studentId ||
    student?.id ||
    "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">

        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-base font-black text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                {getInitials(name)}
              </div>

              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Referred Student
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950 sm:text-2xl">
                  {name}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailItem
              icon={<FiMail />}
              label="Email"
              value={email}
            />

            <DetailItem
              icon={<FiUsers />}
              label="Student ID"
              value={studentId || "Not available"}
            />

            <DetailItem
              icon={<FiBookOpen />}
              label="Enrolled Course"
              value={course}
            />

            <DetailItem
              icon={<FiPhoneIcon />}
              label="Phone"
              value={phone}
            />

            <DetailItem
              icon={<FiCalendar />}
              label="Enrollment Date"
              value={
                enrolledAt
                  ? formatDate(
                      enrolledAt
                    )
                  : "Not available"
              }
            />

            <DetailItem
              icon={<FiCreditCard />}
              label="Amount Paid"
              value={
                amount !== null
                  ? `₹${Number(
                      amount
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  : "Not available"
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
              <p className="text-xs font-semibold text-gray-400">
                Enrollment Status
              </p>

              <span
                className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${getStatusStyle(
                  status
                )}`}
              >
                {getStatusIcon(status)}
                {capitalize(status)}
              </span>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
              <p className="text-xs font-semibold text-gray-400">
                Payment Status
              </p>

              <p className="mt-2 text-sm font-black text-gray-900">
                {paymentStatus
                  ? capitalize(
                      paymentStatus
                    )
                  : isEnrolledStudent(
                      student
                    )
                  ? "Approved / Paid"
                  : "Not available"}
              </p>
            </div>
          </div>

          {student?.courseDetails && (
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
              <p
                className="text-xs font-black uppercase tracking-wide"
                style={{
                  color: GOLD,
                }}
              >
                Course Details
              </p>

              <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs leading-6 text-gray-600">
                {JSON.stringify(
                  student.courseDetails,
                  null,
                  2
                )}
              </pre>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-black p-5 text-white">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-black"
                style={{
                  backgroundColor: GOLD,
                }}
              >
                <FiArrowUpRight />
              </div>

              <div>
                <p className="text-sm font-black">
                  Referral attribution
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  This student is being displayed because their
                  registration/enrollment is attributed to this
                  ambassador referral.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   SMALL UI COMPONENTS
------------------------------------------------------- */

const MetricCard = ({
  label,
  value,
  icon,
  tone,
  helper,
}) => {
  const tones = {
    gold:
      "bg-[#D4AF37]/10 text-[#8D7414]",
    blue:
      "bg-blue-50 text-blue-600",
    green:
      "bg-emerald-50 text-emerald-600",
    purple:
      "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-gray-950">
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-400">
            {helper}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const FunnelItem = ({
  number,
  title,
  value,
  width,
  icon,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-black"
          style={{
            backgroundColor: GOLD,
          }}
        >
          {icon}
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-gray-400">
            Step {number}
          </p>

          <p className="text-sm font-black text-gray-900">
            {title}
          </p>
        </div>
      </div>

      <p className="text-2xl font-black text-gray-950">
        {value}
      </p>
    </div>

    <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(
            Number(width) || 0,
            100
          )}%`,
          backgroundColor: GOLD,
        }}
      />
    </div>
  </div>
);

const DarkStat = ({
  label,
  value,
  icon,
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-gray-500">
        {label}
      </p>

      <span
        style={{
          color: GOLD,
        }}
      >
        {icon}
      </span>
    </div>

    <p className="mt-3 text-2xl font-black">
      {value}
    </p>
  </div>
);

const FilterButton = ({
  icon,
  label,
  active,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-black ${
      active
        ? "text-black"
        : "bg-gray-100 text-gray-600"
    }`}
    style={
      active
        ? {
            backgroundColor: GOLD,
          }
        : undefined
    }
  >
    {icon}
    {label}
  </button>
);

const DetailItem = ({
  icon,
  label,
  value,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
    <div className="flex items-start gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor:
            "rgba(212,175,55,0.10)",
          color: GOLD,
        }}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-black text-gray-800">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const EmptyStudents = ({
  hasFilters,
}) => (
  <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-14 text-center">
    <div
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
      style={{
        backgroundColor: GOLD,
      }}
    >
      <FiUsers size={28} />
    </div>

    <h3 className="mt-5 text-xl font-black text-gray-950">
      {hasFilters
        ? "No Matching Students"
        : "No Referred Students Yet"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {hasFilters
        ? "Try changing the search or filters."
        : "Once students register or enroll using your referral, their details will appear here."}
    </p>
  </div>
);

const StudentsSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      <div className="h-64 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="h-64 rounded-3xl bg-white" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-96 rounded-3xl bg-white" />
        <div className="h-96 rounded-3xl bg-gray-900" />
      </div>

      <div className="h-24 rounded-3xl bg-white" />

      <div className="h-96 rounded-3xl bg-white" />
    </div>
  </div>
);

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */

const getCourseName = (student) => {
  return String(
    student?.courseName ||
      student?.course?.name ||
      student?.course?.title ||
      student?.courseTitle ||
      student?.enrollment?.course?.name ||
      student?.enrollment?.course?.title ||
      student?.enrolledCourse?.name ||
      student?.enrolledCourse?.title ||
      ""
  ).trim();
};

const getStudentStatus = (student) => {
  if (
    isCompletedStudent(
      student
    )
  ) {
    return "Completed";
  }

  if (
    isEnrolledStudent(
      student
    )
  ) {
    return "Enrolled";
  }

  const raw =
    student?.status ||
    student?.enrollmentStatus ||
    student?.applicationStatus ||
    student?.paymentStatus ||
    "Pending";

  const normalized =
    String(raw).toLowerCase();

  if (
    [
      "approved",
      "active",
      "paid",
      "success",
      "successful",
    ].includes(
      normalized
    )
  ) {
    return "Enrolled";
  }

  if (
    [
      "completed",
      "complete",
    ].includes(
      normalized
    )
  ) {
    return "Completed";
  }

  if (
    [
      "rejected",
      "failed",
      "cancelled",
      "canceled",
    ].includes(
      normalized
    )
  ) {
    return "Rejected";
  }

  return "Pending";
};

const isEnrolledStudent = (
  student
) => {
  const statusValues = [
    student?.status,
    student?.enrollmentStatus,
    student?.paymentStatus,
    student?.applicationStatus,
  ]
    .filter(Boolean)
    .map((value) =>
      String(value).toLowerCase()
    );

  if (
    student?.isEnrolled === true ||
    student?.enrolled === true ||
    student?.enrollment?.isActive === true
  ) {
    return true;
  }

  return statusValues.some(
    (value) =>
      [
        "enrolled",
        "approved",
        "active",
        "paid",
        "success",
        "successful",
        "completed",
      ].includes(value)
  );
};

const isActiveStudent = (
  student
) => {
  const status =
    String(
      student?.status ||
        student?.enrollmentStatus ||
        ""
    ).toLowerCase();

  return [
    "active",
    "enrolled",
    "approved",
    "paid",
  ].includes(status);
};

const isCompletedStudent = (
  student
) => {
  const statusValues = [
    student?.status,
    student?.enrollmentStatus,
    student?.completionStatus,
    student?.courseStatus,
  ]
    .filter(Boolean)
    .map((value) =>
      String(value).toLowerCase()
    );

  return (
    student?.completed === true ||
    student?.isCompleted === true ||
    statusValues.includes(
      "completed"
    )
  );
};

const getStatusStyle = (
  status
) => {
  switch (
    String(status).toLowerCase()
  ) {
    case "enrolled":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "completed":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
};

const getStatusIcon = (
  status
) => {
  switch (
    String(status).toLowerCase()
  ) {
    case "enrolled":
      return <FiCheckCircle />;

    case "completed":
      return <FiCheckCircle />;

    case "rejected":
      return <FiXCircle />;

    default:
      return <FiClock />;
  }
};

const getInitials = (
  name = ""
) => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "S";

  return words
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase()
    )
    .join("");
};

const formatDate = (
  value
) => {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not available";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const capitalize = (
  value = ""
) => {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

/*
 * Small local icon wrappers keep the JSX readable.
 */
const FiPhoneIcon = () => {
  return (
    <span className="text-base">
      ☎
    </span>
  );
};

const FiAwardIcon = () => {
  return (
    <span className="text-base">
      ★
    </span>
  );
};

export default Students;