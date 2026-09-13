import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiSearch,
  FiRefreshCw,
  FiMail,
  FiFileText,
  FiExternalLink,
  FiBriefcase,
  FiMapPin,
  FiEye,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

import {
  getRecruiterApplications,
} from "../../services/applicationService";

const GOLD = "#D4AF37";

const Students = () => {
  let storedUser = null;

  try {
    storedUser = JSON.parse(
      localStorage.getItem("user")
    );
  } catch (error) {
    console.error(
      "User parse error:",
      error
    );
  }

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async (
    isRefresh = false
  ) => {
    const recruiterId =
      storedUser?.id ||
      storedUser?._id;

    if (!recruiterId) {
      setLoading(false);
      setError(
        "Recruiter session not found."
      );
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      /*
       * Reuse the existing recruiter application endpoint.
       * We derive the unique student directory from real
       * applications, so no fake student records are used.
       */
      const response =
        await getRecruiterApplications(
          recruiterId
        );

      const applications =
        response?.applications ||
        response?.data?.applications ||
        (Array.isArray(response)
          ? response
          : []);

      const studentMap = new Map();

      applications.forEach(
        (application) => {
          const student =
            application?.student;

          if (!student) return;

          const studentId =
            student?._id ||
            student?.id ||
            student?.email;

          if (!studentId) return;

          const existing =
            studentMap.get(
              String(studentId)
            );

          if (!existing) {
            studentMap.set(
              String(studentId),
              {
                ...student,
                applications: [
                  application,
                ],
                latestStatus:
                  application?.status ||
                  "Pending",
              }
            );
          } else {
            existing.applications.push(
              application
            );

            existing.latestStatus =
              application?.status ||
              existing.latestStatus;
          }
        }
      );

      setStudents(
        Array.from(
          studentMap.values()
        )
      );
    } catch (err) {
      console.error(
        "Load recruiter students error:",
        err
      );

      setStudents([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredStudents =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return students.filter(
        (student) => {
          const name =
            String(
              student?.name ||
                student?.fullName ||
                ""
            ).toLowerCase();

          const email =
            String(
              student?.email || ""
            ).toLowerCase();

          const location =
            String(
              student?.location ||
                student?.city ||
                ""
            ).toLowerCase();

          const skillsText =
            Array.isArray(
              student?.skills
            )
              ? student.skills
                  .map((item) =>
                    typeof item ===
                    "string"
                      ? item
                      : item?.name ||
                        item?.title ||
                        ""
                  )
                  .join(" ")
              : String(
                  student?.skills ||
                    ""
                );

          const internshipText =
            (
              student?.applications ||
              []
            )
              .map(
                (application) =>
                  application?.internship
                    ?.title || ""
              )
              .join(" ");

          const searchableText = `
            ${name}
            ${email}
            ${location}
            ${skillsText}
            ${internshipText}
          `.toLowerCase();

          const matchesSearch =
            !query ||
            searchableText.includes(
              query
            );

          const matchesStatus =
            statusFilter === "All" ||
            getStudentStatus(
              student
            ) === statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      students,
      search,
      statusFilter,
    ]);

  const stats = useMemo(() => {
    let selected = 0;
    let shortlisted = 0;
    let pending = 0;
    let rejected = 0;

    students.forEach(
      (student) => {
        const status =
          getStudentStatus(
            student
          );

        if (
          status === "Selected"
        ) {
          selected += 1;
        }

        if (
          status ===
          "Shortlisted"
        ) {
          shortlisted += 1;
        }

        if (
          status === "Pending"
        ) {
          pending += 1;
        }

        if (
          status === "Rejected"
        ) {
          rejected += 1;
        }
      }
    );

    return {
      total: students.length,
      selected,
      shortlisted,
      pending,
      rejected,
    };
  }, [students]);

  if (loading) {
    return <StudentsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[30px] bg-black px-6 py-7 text-white shadow-2xl sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiUsers
                  size={14}
                  style={{
                    color: GOLD,
                  }}
                />

                <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                  Talent Directory
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Students
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Explore students who have actually applied to your
                internship opportunities and review their application
                materials.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadStudents(true)
              }
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
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
                : "Refresh"}
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Students"
            value={stats.total}
            icon={<FiUsers />}
            tone="gold"
          />

          <StatCard
            label="Pending"
            value={stats.pending}
            icon={<FiClock />}
            tone="amber"
          />

          <StatCard
            label="Shortlisted"
            value={stats.shortlisted}
            icon={<FiUser />}
            tone="blue"
          />

          <StatCard
            label="Selected"
            value={stats.selected}
            icon={<FiCheckCircle />}
            tone="green"
          />

          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={<FiXCircle />}
            tone="red"
          />
        </div>

        {/* Search / Filters */}
        <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div className="relative w-full xl:max-w-xl">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search student, email, location or skill..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-gray-800 outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Pending",
                "Shortlisted",
                "Selected",
                "Rejected",
              ].map((item) => {
                const active =
                  statusFilter ===
                  item;

                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      setStatusFilter(
                        item
                      )
                    }
                    className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
                      active
                        ? "text-black shadow-sm"
                        : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                    style={
                      active
                        ? {
                            backgroundColor:
                              GOLD,
                          }
                        : undefined
                    }
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Directory */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Candidate Pool
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Student Directory
              </h2>
            </div>

            <p className="text-sm font-semibold text-gray-500">
              {filteredStudents.length} student
              {filteredStudents.length !==
              1
                ? "s"
                : ""}
            </p>
          </div>

          {filteredStudents.length ===
          0 ? (
            <EmptyState
              hasFilters={
                Boolean(
                  search.trim()
                ) ||
                statusFilter !==
                  "All"
              }
              clear={() => {
                setSearch("");
                setStatusFilter(
                  "All"
                );
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredStudents.map(
                (student) => (
                  <StudentCard
                    key={
                      student?._id ||
                      student?.email
                    }
                    student={student}
                    onView={() =>
                      setSelectedStudent(
                        student
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
        <StudentModal
          student={selectedStudent}
          onClose={() =>
            setSelectedStudent(
              null
            )
          }
        />
      )}
    </div>
  );
};

const StudentCard = ({
  student,
  onView,
}) => {
  const name =
    student?.name ||
    student?.fullName ||
    "Student";

  const email =
    student?.email ||
    "No email available";

  const location =
    student?.location ||
    student?.city ||
    "";

  const status =
    getStudentStatus(
      student
    );

  const meta =
    getStatusMeta(status);

  const applications =
    Array.isArray(
      student?.applications
    )
      ? student.applications
      : [];

  const skills =
    getStudentSkills(
      student
    );

  return (
    <div className="rounded-3xl border border-gray-200 bg-[#FCFCFA] p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-black"
            style={{
              backgroundColor:
                GOLD,
            }}
          >
            {getInitials(name)}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-gray-950">
              {name}
            </h3>

            <p className="mt-1 truncate text-xs text-gray-500">
              {email}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${meta.className}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${meta.dot}`}
          />

          {status}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiMapPin className="text-gray-400" />
            {location}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiBriefcase className="text-gray-400" />

          {applications.length} application
          {applications.length !== 1
            ? "s"
            : ""}
        </div>
      </div>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills
            .slice(0, 4)
            .map((skill, index) => (
              <span
                key={`${String(
                  skill
                )}-${index}`}
                className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] font-bold text-gray-600"
              >
                {skill}
              </span>
            ))}

          {skills.length > 4 && (
            <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] font-bold text-gray-500">
              +{skills.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onView}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:border-[#D4AF37] hover:text-black"
        >
          <FiEye />
          View Profile
        </button>

        {email !==
          "No email available" && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-black text-black"
            style={{
              backgroundColor:
                GOLD,
            }}
          >
            <FiMail />
          </a>
        )}
      </div>
    </div>
  );
};

const StudentModal = ({
  student,
  onClose,
}) => {
  const name =
    student?.name ||
    student?.fullName ||
    "Student";

  const email =
    student?.email ||
    "—";

  const status =
    getStudentStatus(
      student
    );

  const applications =
    Array.isArray(
      student?.applications
    )
      ? student.applications
      : [];

  const skills =
    getStudentSkills(
      student
    );

  const portfolio =
    student?.portfolio ||
    student?.portfolioUrl ||
    "";

  const resume =
    student?.resume ||
    applications.find(
      (item) => item?.resume
    )?.resume ||
    "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        {/* Modal Header */}
        <div className="bg-black px-6 py-7 text-white sm:px-8">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black text-black"
                style={{
                  backgroundColor:
                    GOLD,
                }}
              >
                {getInitials(name)}
              </div>

              <div className="min-w-0">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Student Profile
                </p>

                <h2 className="mt-1 truncate text-2xl font-black">
                  {name}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">

          {/* Basic */}
          <div>
            <div className="mb-4">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Candidate Information
              </p>

              <h3 className="mt-1 text-xl font-black text-gray-950">
                Candidate overview
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBox
                label="Name"
                value={name}
              />

              <InfoBox
                label="Email"
                value={email}
              />

              <InfoBox
                label="Location"
                value={
                  student?.location ||
                  student?.city ||
                  "—"
                }
              />

              <InfoBox
                label="Current Status"
                value={status}
              />
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.16em]"
                style={{
                  color: GOLD,
                }}
              >
                Skills
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map(
                  (skill, index) => (
                    <span
                      key={`${String(
                        skill
                      )}-${index}`}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* Applications */}
          <div>
            <div className="mb-4">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Applications
              </p>

              <h3 className="mt-1 text-xl font-black text-gray-950">
                Internship history
              </h3>
            </div>

            {applications.length ===
            0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-[#FAFAF8] p-6 text-center text-sm text-gray-500">
                No application details available.
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map(
                  (application) => {
                    const applicationStatus =
                      application?.status ||
                      "Pending";

                    const statusMeta =
                      getStatusMeta(
                        applicationStatus
                      );

                    return (
                      <div
                        key={
                          application?._id
                        }
                        className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-black text-gray-900">
                              {application
                                ?.internship
                                ?.title ||
                                application
                                  ?.internship
                                  ?.name ||
                                "Internship"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {application
                                ?.internship
                                ?.company ||
                                "Company"}
                            </p>
                          </div>

                          <span
                            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${statusMeta.className}`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${statusMeta.dot}`}
                            />

                            {
                              applicationStatus
                            }
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* Documents */}
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.16em]"
              style={{
                color: GOLD,
              }}
            >
              Candidate Materials
            </p>

            <div className="mt-3 flex flex-wrap gap-3">
              {resume ? (
                <a
                  href={resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-xs font-black text-gray-700 hover:border-[#D4AF37]"
                >
                  <FiFileText />
                  View Resume
                  <FiExternalLink />
                </a>
              ) : (
                <span className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-400">
                  Resume not available
                </span>
              )}

              {portfolio ? (
                <a
                  href={portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-xs font-black text-gray-700 hover:border-[#D4AF37]"
                >
                  <FiExternalLink />
                  Portfolio
                </a>
              ) : (
                <span className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-400">
                  Portfolio not available
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-3 text-sm font-black text-black"
              style={{
                backgroundColor:
                  GOLD,
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({
  label,
  value,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
    <p className="text-xs font-semibold text-gray-400">
      {label}
    </p>

    <p className="mt-1 break-words text-sm font-black text-gray-800">
      {value}
    </p>
  </div>
);

const StatCard = ({
  label,
  value,
  icon,
  tone,
}) => {
  const tones = {
    gold: "bg-[#D4AF37]/10 text-[#8D7414]",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-gray-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            tones[tone]
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({
  hasFilters,
  clear,
}) => (
  <div className="rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-14 text-center">
    <div
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
      style={{
        backgroundColor:
          GOLD,
      }}
    >
      <FiUsers size={28} />
    </div>

    <h3 className="mt-5 text-2xl font-black text-gray-950">
      {hasFilters
        ? "No Matching Students"
        : "No Students Yet"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {hasFilters
        ? "Try changing your search or status filter."
        : "Students will appear here after applying to your internships."}
    </p>

    {hasFilters && (
      <button
        type="button"
        onClick={clear}
        className="mt-5 rounded-xl px-5 py-3 text-sm font-black text-black"
        style={{
          backgroundColor:
            GOLD,
        }}
      >
        Clear Filters
      </button>
    )}
  </div>
);

const StudentsSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      <div className="h-56 rounded-[30px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map(
          (item) => (
            <div
              key={item}
              className="h-32 rounded-3xl bg-white"
            />
          )
        )}
      </div>

      <div className="h-20 rounded-3xl bg-white" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(
          (item) => (
            <div
              key={item}
              className="h-64 rounded-3xl bg-white"
            />
          )
        )}
      </div>
    </div>
  </div>
);

const getStudentStatus = (
  student
) => {
  const applications =
    Array.isArray(
      student?.applications
    )
      ? student.applications
      : [];

  if (!applications.length) {
    return (
      student?.status ||
      "Pending"
    );
  }

  const priority = [
    "Selected",
    "Interview",
    "Shortlisted",
    "Reviewed",
    "Rejected",
    "Pending",
  ];

  for (
    const status of priority
  ) {
    if (
      applications.some(
        (item) =>
          item?.status ===
          status
      )
    ) {
      return status;
    }
  }

  return (
    applications[
      applications.length - 1
    ]?.status || "Pending"
  );
};

const getStatusMeta = (
  status
) => {
  const map = {
    Selected: {
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    },

    Shortlisted: {
      className:
        "border-blue-200 bg-blue-50 text-blue-700",
      dot: "bg-blue-500",
    },

    Interview: {
      className:
        "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },

    Rejected: {
      className:
        "border-red-200 bg-red-50 text-red-700",
      dot: "bg-red-500",
    },

    Reviewed: {
      className:
        "border-slate-200 bg-slate-50 text-slate-700",
      dot: "bg-slate-500",
    },

    Pending: {
      className:
        "border-gray-200 bg-gray-50 text-gray-700",
      dot: "bg-gray-400",
    },
  };

  return (
    map[status] ||
    map.Pending
  );
};

const getStudentSkills = (
  student
) => {
  if (
    Array.isArray(
      student?.skills
    )
  ) {
    return student.skills
      .map((skill) =>
        typeof skill === "string"
          ? skill
          : skill?.name ||
            skill?.title ||
            ""
      )
      .filter(Boolean);
  }

  if (
    typeof student?.skills ===
    "string"
  ) {
    return student.skills
      .split(",")
      .map((item) =>
        item.trim()
      )
      .filter(Boolean);
  }

  return [];
};

const getInitials = (
  name = ""
) => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "ST";

  return words
    .slice(0, 2)
    .map((word) =>
      word
        .charAt(0)
        .toUpperCase()
    )
    .join("");
};

export default Students;