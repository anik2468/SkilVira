import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import {
  FiSearch,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiRefreshCw,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiMoreVertical,
  FiMail,
  FiEye,
  FiAlertCircle,
} from "react-icons/fi";

const API_BASE = API_ORIGIN;

const Users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [actionLoading, setActionLoading] =
    useState("");

  const [error, setError] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const { data } = await api.get(
        "/users"
      );

      setUsers(
        Array.isArray(data?.users)
          ? data.users
          : []
      );
    } catch (err) {
      console.error(
        "Load users error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleBlock = async (id) => {
    const confirmed = window.confirm(
      "Block this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        `block-${id}`
      );

      setError("");

      await api.put(
        `/users/block/${id}`
      );

      await loadUsers(true);
    } catch (err) {
      console.error(
        "Block user error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to block user."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleUnblock = async (id) => {
    try {
      setActionLoading(
        `unblock-${id}`
      );

      setError("");

      await api.put(
        `/users/unblock/${id}`
      );

      await loadUsers(true);
    } catch (err) {
      console.error(
        "Unblock user error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to unblock user."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (
    id,
    name
  ) => {
    const confirmed = window.confirm(
      `Delete ${
        name || "this user"
      } permanently?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        `delete-${id}`
      );

      setError("");

      await api.delete(
        `/users/${id}`
      );

      await loadUsers(true);
    } catch (err) {
      console.error(
        "Delete user error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete user."
      );
    } finally {
      setActionLoading("");
    }
  };

  const roleCounts = useMemo(() => {
    return users.reduce(
      (counts, user) => {
        const role =
          String(
            user?.role || "other"
          ).toLowerCase();

        counts[role] =
          (counts[role] || 0) + 1;

        return counts;
      },
      {}
    );
  }, [users]);

  const activeCount = users.filter(
    (user) =>
      user?.status !== "blocked"
  ).length;

  const blockedCount = users.filter(
    (user) =>
      user?.status === "blocked"
  ).length;

  const filteredUsers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return users.filter((user) => {
      const name =
        user?.name?.toLowerCase() ||
        "";

      const email =
        user?.email?.toLowerCase() ||
        "";

      const role =
        String(
          user?.role || ""
        ).toLowerCase();

      const status =
        String(
          user?.status || "active"
        ).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query) ||
        role.includes(query);

      const matchesRole =
        roleFilter === "all" ||
        role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          status !== "blocked") ||
        (statusFilter === "blocked" &&
          status === "blocked");

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
              <FiShield size={13} />
              Platform Access Control
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              User Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/60 sm:text-base">
              View all SkilVira accounts, monitor account status and manage
              platform access.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadUsers(true)
            }
            disabled={refreshing}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={17}
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
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiAlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Users"
          value={users.length}
          icon={<FiUsers size={21} />}
        />

        <SummaryCard
          title="Active Users"
          value={activeCount}
          icon={
            <FiUserCheck size={21} />
          }
        />

        <SummaryCard
          title="Blocked Users"
          value={blockedCount}
          icon={<FiUserX size={21} />}
        />

        <SummaryCard
          title="Students"
          value={roleCounts.student || 0}
          icon={<FiUsers size={21} />}
        />
      </div>

      {/* Role Overview */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Account Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Distribution of users across platform roles.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <RoleCard
            label="Students"
            value={roleCounts.student || 0}
          />

          <RoleCard
            label="Recruiters"
            value={roleCounts.recruiter || 0}
          />

          <RoleCard
            label="Employees"
            value={roleCounts.employee || 0}
          />

          <RoleCard
            label="Admins"
            value={
              roleCounts.admin ||
              roleCounts.superadmin ||
              0
            }
          />
        </div>
      </section>

      {/* User Table */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Toolbar */}
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              {/* Search */}
              <div className="relative w-full xl:max-w-xl">
                <FiSearch
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search by name, email or role..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
                />
              </div>

              {/* Role filters */}
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={
                    roleFilter === "all"
                  }
                  onClick={() =>
                    setRoleFilter("all")
                  }
                >
                  All
                </FilterButton>

                <FilterButton
                  active={
                    roleFilter ===
                    "student"
                  }
                  onClick={() =>
                    setRoleFilter(
                      "student"
                    )
                  }
                >
                  Students
                </FilterButton>

                <FilterButton
                  active={
                    roleFilter ===
                    "recruiter"
                  }
                  onClick={() =>
                    setRoleFilter(
                      "recruiter"
                    )
                  }
                >
                  Recruiters
                </FilterButton>

                <FilterButton
                  active={
                    roleFilter ===
                    "employee"
                  }
                  onClick={() =>
                    setRoleFilter(
                      "employee"
                    )
                  }
                >
                  Employees
                </FilterButton>
              </div>
            </div>

            {/* Status filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Status
              </span>

              <FilterButton
                active={
                  statusFilter === "all"
                }
                onClick={() =>
                  setStatusFilter("all")
                }
              >
                All
              </FilterButton>

              <FilterButton
                active={
                  statusFilter === "active"
                }
                onClick={() =>
                  setStatusFilter("active")
                }
              >
                Active
              </FilterButton>

              <FilterButton
                active={
                  statusFilter === "blocked"
                }
                onClick={() =>
                  setStatusFilter("blocked")
                }
              >
                Blocked
              </FilterButton>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {users.length}
            </span>{" "}
            users
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <LoadingState />
        ) : filteredUsers.length ===
          0 ? (
          <EmptyState
            hasSearch={Boolean(
              search.trim()
            )}
            hasFilter={
              roleFilter !== "all" ||
              statusFilter !== "all"
            }
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[950px]">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map(
                    (user) => {
                      const blocked =
                        user?.status ===
                        "blocked";

                      const busy =
                        actionLoading.includes(
                          user?._id || ""
                        );

                  const canManageAccount = ![
                    "control",
                    "admin",
                    "superadmin",
                    "super_admin",
                    "employee",
                  ].includes(
                    String(user?.role || "").toLowerCase()
                  );


                      return (
                        <tr
                          key={user._id}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                user={user}
                              />

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-900">
                                  {user?.name ||
                                    "Unnamed User"}
                                </p>

                                <p className="mt-1 flex items-center gap-1 break-all text-xs text-gray-500">
                                  <FiMail
                                    size={12}
                                  />
                                  {user?.email ||
                                    "No email"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <RoleBadge
                              role={
                                user?.role
                              }
                            />
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              blocked={
                                blocked
                              }
                            />
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-600">
                            {user?.createdAt
                              ? new Date(
                                  user.createdAt
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "-"}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedUser(
                                    user
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                              >
                                <FiEye
                                  size={14}
                                />
                                View
                              </button>

                              {canManageAccount && (
                                <>
{blocked ? (
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() =>
                                    handleUnblock(
                                      user._id
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:opacity-50"
                                >
                                  <FiUnlock
                                    size={14}
                                  />
                                  Unblock
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() =>
                                    handleBlock(
                                      user._id
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                                >
                                  <FiLock
                                    size={14}
                                  />
                                  Block
                                </button>
                              )}

                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  handleDelete(
                                    user._id,
                                    user?.name
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                              >
                                <FiTrash2
                                  size={14}
                                />
                                Delete
                              </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredUsers.map(
                (user) => {
                  const blocked =
                    user?.status ===
                    "blocked";

                  const busy =
                    actionLoading.includes(
                      user?._id || ""
                    );

                  const canManageAccount = ![
                    "control",
                    "admin",
                    "superadmin",
                    "super_admin",
                    "employee",
                  ].includes(
                    String(user?.role || "").toLowerCase()
                  );


                  return (
                    <div
                      key={user._id}
                      className="p-5"
                    >
                      <div className="flex items-start gap-3">
                        <UserAvatar
                          user={user}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate font-semibold text-gray-900">
                                {user?.name ||
                                  "Unnamed User"}
                              </h3>

                              <p className="mt-1 break-all text-sm text-gray-500">
                                {user?.email ||
                                  "No email"}
                              </p>
                            </div>

                            <FiMoreVertical
                              size={18}
                              className="shrink-0 text-gray-300"
                            />
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <RoleBadge
                              role={
                                user?.role
                              }
                            />

                            <StatusBadge
                              blocked={
                                blocked
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-gray-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Joined
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {user?.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedUser(
                              user
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700"
                        >
                          <FiEye
                            size={15}
                          />
                          View
                        </button>

                        {canManageAccount && (
                                <>
{blocked ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              handleUnblock(
                                user._id
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-xs font-semibold text-green-700 disabled:opacity-50"
                          >
                            <FiUnlock
                              size={15}
                            />
                            Unblock
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              handleBlock(
                                user._id
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-700 disabled:opacity-50"
                          >
                            <FiLock
                              size={15}
                            />
                            Block
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            handleDelete(
                              user._id,
                              user?.name
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                        >
                          <FiTrash2
                            size={15}
                          />
                          Delete
                        </button>
                                </>
                              )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </section>

      {/* User details modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
        />
      )}
    </div>
  );
};


// =====================================================
// SUMMARY CARD
// =====================================================

const SummaryCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          {icon}
        </div>

        <FiMoreVertical
          size={17}
          className="text-gray-300"
        />
      </div>

      <p className="mt-5 text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
};


// =====================================================
// ROLE CARD
// =====================================================

const RoleCard = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
};


// =====================================================
// FILTER BUTTON
// =====================================================

const FilterButton = ({
  active,
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[#D4AF37] text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
};


// =====================================================
// ROLE BADGE
// =====================================================

const RoleBadge = ({
  role,
}) => {
  const normalized = String(
    role || "user"
  ).toLowerCase();

  const label =
    normalized.charAt(0).toUpperCase() +
    normalized.slice(1);

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#9B7D12]">
      <FiShield size={12} />
      {label}
    </span>
  );
};


// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({
  blocked,
}) => {
  return blocked ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Blocked
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      Active
    </span>
  );
};


// =====================================================
// AVATAR
// =====================================================

const UserAvatar = ({
  user,
}) => {
  const avatar = user?.avatar;

  const avatarUrl = avatar
    ? avatar.startsWith("http")
      ? avatar
      : `${API_BASE}${avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.name || "User"
      )}&background=D4AF37&color=fff&size=120`;

  return (
    <img
      src={avatarUrl}
      alt={
        user?.name ||
        "User"
      }
      className="h-12 w-12 shrink-0 rounded-full border-2 border-white bg-gray-100 object-cover shadow-sm"
      onError={(event) => {
        event.currentTarget.src =
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "User"
          )}&background=D4AF37&color=fff&size=120`;
      }}
    />
  );
};


// =====================================================
// LOADING
// =====================================================

const LoadingState = () => {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-5 py-10">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 animate-spin items-center justify-center rounded-2xl border-4 border-gray-200 border-t-[#D4AF37]">
          <FiRefreshCw
            size={18}
            className="text-[#D4AF37]"
          />
        </div>

        <p className="mt-4 font-semibold text-gray-900">
          Loading users...
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Fetching platform accounts.
        </p>
      </div>
    </div>
  );
};


// =====================================================
// EMPTY
// =====================================================

const EmptyState = ({
  hasSearch,
  hasFilter,
}) => {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-5 py-10">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          <FiUsers size={25} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-gray-900">
          No users found
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {hasSearch
            ? "Try another name, email or role."
            : hasFilter
              ? "No users match the selected filters."
              : "No user accounts are available yet."}
        </p>
      </div>
    </div>
  );
};


// =====================================================
// DETAILS MODAL
// =====================================================

const UserDetailsModal = ({
  user,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              User Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Account information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
            <UserAvatar
              user={user}
            />

            <div className="min-w-0">
              <h3 className="font-bold text-gray-900">
                {user?.name ||
                  "Unnamed User"}
              </h3>

              <p className="mt-1 break-all text-sm text-gray-500">
                {user?.email ||
                  "No email"}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailItem
              label="Role"
              value={
                user?.role || "user"
              }
            />

            <DetailItem
              label="Status"
              value={
                user?.status ||
                "active"
              }
            />

            <DetailItem
              label="User ID"
              value={
                user?._id || "-"
              }
            />

            <DetailItem
              label="Joined"
              value={
                user?.createdAt
                  ? new Date(
                      user.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "-"
              }
            />
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// =====================================================
// DETAIL ITEM
// =====================================================

const DetailItem = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
};

export default Users;