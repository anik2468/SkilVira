import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiAlertCircle,
  FiBookOpen,
  FiCheckCircle,
  FiMail,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiUsers,
} from "react-icons/fi";

import {
  getUsers,
  blockUser,
  unblockUser,
  deleteUser,
} from "../../services/controlService";

const GOLD = "#D4AF37";

const Students = () => {
  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [processingId, setProcessingId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data =
        await getUsers();

      const users =
        Array.isArray(
          data?.users
        )
          ? data.users
          : [];

      setStudents(
        users.filter(
          (user) =>
            user?.role ===
            "student"
        )
      );
    } catch (err) {
      console.error(
        "LOAD STUDENTS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load students."
      );

      setStudents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showSuccess = (
    message
  ) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };

  const handleBlock = async (
    id
  ) => {
    if (!id) return;

    try {
      setProcessingId(id);
      setError("");

      await blockUser(id);

      setStudents((prev) =>
        prev.map((item) =>
          item?._id === id
            ? {
                ...item,
                status: "blocked",
              }
            : item
        )
      );

      showSuccess(
        "Student account blocked successfully."
      );
    } catch (err) {
      console.error(
        "BLOCK STUDENT ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to block student."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnblock = async (
    id
  ) => {
    if (!id) return;

    try {
      setProcessingId(id);
      setError("");

      await unblockUser(id);

      setStudents((prev) =>
        prev.map((item) =>
          item?._id === id
            ? {
                ...item,
                status: "active",
              }
            : item
        )
      );

      showSuccess(
        "Student account unblocked successfully."
      );
    } catch (err) {
      console.error(
        "UNBLOCK STUDENT ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to unblock student."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (
    id
  ) => {
    if (!id) return;

    const confirmed =
      window.confirm(
        "Delete this student account? This action may affect the student's platform access."
      );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteUser(id);

      setStudents((prev) =>
        prev.filter(
          (item) =>
            item?._id !== id
        )
      );

      showSuccess(
        "Student account deleted successfully."
      );
    } catch (err) {
      console.error(
        "DELETE STUDENT ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete student."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const stats = useMemo(() => {
    const total =
      students.length;

    const blocked =
      students.filter(
        (student) =>
          String(
            student?.status ||
              "active"
          ).toLowerCase() ===
          "blocked"
      ).length;

    const active =
      total - blocked;

    return {
      total,
      active,
      blocked,
    };
  }, [students]);

  const filteredStudents =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return students.filter(
        (student) => {
          const text = [
            student?.name,
            student?.email,
            student?.college,
            student?.collegeName,
            student?.university,
            student?.universityName,
            student?.status,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !query ||
            text.includes(query);

          const isBlocked =
            String(
              student?.status ||
                "active"
            ).toLowerCase() ===
            "blocked";

          const matchesFilter =
            filter === "All" ||
            (filter ===
              "Active" &&
              !isBlocked) ||
            (filter ===
              "Blocked" &&
              isBlocked);

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      students,
      search,
      filter,
    ]);

  if (loading) {
    return (
      <StudentsSkeleton />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-2xl sm:p-8 lg:p-10">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiBookOpen
                  size={14}
                  style={{
                    color: GOLD,
                  }}
                />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Student Network Control
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Student Management
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                Manage registered students, monitor account access and
                maintain the health of the SkilVira learner network.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadStudents(true)
              }
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-gray-200 hover:bg-white/10 disabled:opacity-50"
            >
              <FiRefreshCw
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh Directory
            </button>
          </div>
        </section>

        {/* ALERTS */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            {success}
          </div>
        )}

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Students"
            value={stats.total}
            icon={<FiUsers />}
            tone="gold"
          />

          <MetricCard
            label="Active Students"
            value={stats.active}
            icon={<FiUserCheck />}
            tone="green"
          />

          <MetricCard
            label="Blocked Accounts"
            value={stats.blocked}
            icon={<FiUserX />}
            tone="red"
          />

          <MetricCard
            label="Account Health"
            value={
              stats.total
                ? `${Math.round(
                    (stats.active /
                      stats.total) *
                      100
                  )}%`
                : "0%"
            }
            icon={<FiActivity />}
            tone="blue"
          />
        </div>

        {/* NETWORK HEALTH */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Learner Network
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Student account health
              </h2>
            </div>

            <span className="text-xs font-bold text-gray-400">
              Live from platform user directory
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <HealthCard
              title="Active Network"
              value={
                stats.total
                  ? `${Math.round(
                      (stats.active /
                        stats.total) *
                        100
                    )}%`
                  : "0%"
              }
              description="Percentage of student accounts currently not blocked."
              icon={<FiActivity />}
            />

            <HealthCard
              title="Blocked Accounts"
              value={
                stats.blocked
              }
              description="Student accounts currently restricted from normal access."
              icon={<FiShield />}
            />

            <HealthCard
              title="Total Learners"
              value={
                stats.total
              }
              description="Total student accounts available to the admin control center."
              icon={<FiUsers />}
            />
          </div>
        </section>

        {/* DIRECTORY */}
        <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Student Directory
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Registered learners
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Search, filter and manage student account access.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "All",
                  "Active",
                  "Blocked",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setFilter(item)
                    }
                    className={`rounded-xl px-4 py-2.5 text-xs font-black ${
                      filter ===
                      item
                        ? "text-black"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    style={
                      filter === item
                        ? {
                            backgroundColor:
                              GOLD,
                          }
                        : undefined
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-6">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                placeholder="Search by student name, email or institution..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] py-3.5 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>
          </div>

          {filteredStudents.length ===
          0 ? (
            <EmptyState
              hasFilters={
                Boolean(
                  search.trim()
                ) ||
                filter !== "All"
              }
              clear={() => {
                setSearch("");
                setFilter("All");
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FAFAF8]">
                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Student
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Institution
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wide text-gray-400">
                      Administration
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map(
                    (student) => (
                      <StudentRow
                        key={
                          student?._id
                        }
                        student={
                          student
                        }
                        processingId={
                          processingId
                        }
                        deletingId={
                          deletingId
                        }
                        onBlock={
                          handleBlock
                        }
                        onUnblock={
                          handleUnblock
                        }
                        onDelete={
                          handleDelete
                        }
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const StudentRow = ({
  student,
  processingId,
  deletingId,
  onBlock,
  onUnblock,
  onDelete,
}) => {
  const isBlocked =
    String(
      student?.status ||
        "active"
    ).toLowerCase() ===
    "blocked";

  const busy =
    processingId ===
      student?._id ||
    deletingId ===
      student?._id;

  const avatar =
    getAvatarUrl(
      student?.avatar
    );

  const institution =
    student?.college ||
    student?.collegeName ||
    student?.university ||
    student?.universityName;

  return (
    <tr className="border-b border-gray-100 transition hover:bg-[#FCFCFA]">
      <td className="px-5 py-5">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={
                student?.name ||
                "Student"
              }
              className="h-12 w-12 rounded-2xl border border-gray-100 object-cover"
            />
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-black"
              style={{
                backgroundColor:
                  GOLD,
              }}
            >
              <FiBookOpen />
            </div>
          )}

          <div className="min-w-0">
            <p className="max-w-[250px] truncate text-sm font-black text-gray-900">
              {student?.name ||
                "Unnamed Student"}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Student Account
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-5">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FiMail className="text-gray-400" />

          <span className="max-w-[270px] truncate">
            {student?.email ||
              "Email unavailable"}
          </span>
        </div>
      </td>

      <td className="px-5 py-5">
        {institution ? (
          <div>
            <p className="max-w-[230px] truncate text-sm font-semibold text-gray-700">
              {institution}
            </p>

            {student?.department && (
              <p className="mt-1 text-xs text-gray-400">
                {student.department}
              </p>
            )}
          </div>
        ) : (
          <span className="text-xs font-semibold text-gray-400">
            Not provided
          </span>
        )}
      </td>

      <td className="px-5 py-5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black ${
            isBlocked
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {isBlocked ? (
            <FiUserX />
          ) : (
            <FiCheckCircle />
          )}

          {isBlocked
            ? "Blocked"
            : "Active"}
        </span>
      </td>

      <td className="px-5 py-5">
        <div className="flex flex-wrap justify-end gap-2">
          {isBlocked ? (
            <ActionButton
              label="Unblock"
              icon={<FiUserCheck />}
              onClick={() =>
                onUnblock(
                  student?._id
                )
              }
              disabled={busy}
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            />
          ) : (
            <ActionButton
              label="Block"
              icon={<FiUserX />}
              onClick={() =>
                onBlock(
                  student?._id
                )
              }
              disabled={busy}
              className="bg-amber-50 text-amber-700 hover:bg-amber-100"
            />
          )}

          <ActionButton
            label="Delete"
            icon={<FiTrash2 />}
            onClick={() =>
              onDelete(
                student?._id
              )
            }
            disabled={busy}
            className="bg-red-50 text-red-600 hover:bg-red-100"
          />
        </div>
      </td>
    </tr>
  );
};

const ActionButton = ({
  label,
  icon,
  onClick,
  disabled,
  className = "",
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {icon}
    {label}
  </button>
);

const MetricCard = ({
  label,
  value,
  icon,
  tone,
}) => {
  const tones = {
    gold:
      "bg-[#D4AF37]/10 text-[#8D7414]",
    green:
      "bg-emerald-50 text-emerald-600",
    red:
      "bg-red-50 text-red-600",
    blue:
      "bg-blue-50 text-blue-600",
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
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const HealthCard = ({
  title,
  value,
  description,
  icon,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-black text-gray-900">
          {title}
        </p>

        <p
          className="mt-1 text-3xl font-black"
          style={{
            color: GOLD,
          }}
        >
          {value}
        </p>
      </div>

      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl text-black"
        style={{
          backgroundColor:
            GOLD,
        }}
      >
        {icon}
      </div>
    </div>

    <p className="mt-4 text-xs leading-5 text-gray-500">
      {description}
    </p>
  </div>
);

const EmptyState = ({
  hasFilters,
  clear,
}) => (
  <div className="px-6 py-16 text-center">
    <div
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
      style={{
        backgroundColor:
          GOLD,
      }}
    >
      <FiUsers size={28} />
    </div>

    <h3 className="mt-5 text-xl font-black text-gray-950">
      {hasFilters
        ? "No Matching Students"
        : "No Students Found"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {hasFilters
        ? "Try changing the search text or account filter."
        : "Registered student accounts will appear here."}
    </p>

    {hasFilters && (
      <button
        type="button"
        onClick={clear}
        className="mt-5 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700"
      >
        Clear Filters
      </button>
    )}
  </div>
);

const StudentsSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1600px] animate-pulse space-y-6">
      <div className="h-64 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="h-32 rounded-3xl bg-white"
            />
          )
        )}
      </div>

      <div className="h-72 rounded-3xl bg-white" />

      <div className="h-[600px] rounded-3xl bg-white" />
    </div>
  </div>
);

const getAvatarUrl = (
  avatar
) => {
  if (!avatar) return "";

  if (
    avatar.startsWith(
      "http://"
    ) ||
    avatar.startsWith(
      "https://"
    )
  ) {
    return avatar;
  }

  return `${API_ORIGIN}${avatar}`;
};

export default Students;