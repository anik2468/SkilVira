import { useEffect, useState } from "react";
import {
  FiMail,
  FiUser,
  FiShield,
  FiCalendar,
  FiRefreshCw,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE = "http://localhost:5000";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        setUser(null);
        return;
      }

      const localUser =
        JSON.parse(storedUser);

      setUser(localUser);

      /*
       * Keep the page compatible with the
       * existing employee authentication flow.
       * Try to refresh user data when a usable
       * employee ID is available.
       */
      const userId =
        localUser?.id ||
        localUser?._id;

      if (userId) {
        try {
          const response = await api.get(
            `/employee/profile/${userId}`
          );

          const profileData =
            response?.data?.user ||
            response?.data?.employee ||
            response?.data;

          if (
            profileData &&
            typeof profileData === "object"
          ) {
            setUser(profileData);

            localStorage.setItem(
              "user",
              JSON.stringify(profileData)
            );
          }
        } catch (profileError) {
          /*
           * The local session remains usable
           * when the optional profile refresh
           * endpoint is unavailable.
           */
          console.warn(
            "Employee profile refresh unavailable:",
            profileError
          );
        }
      }
    } catch (error) {
      console.error(
        "Employee profile error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API_BASE}${user.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.name || "Employee"
      )}&background=D4AF37&color=fff&size=200`;

  const joinedDate = user?.createdAt
    ? new Date(
        user.createdAt
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 animate-spin items-center justify-center rounded-2xl border-4 border-gray-200 border-t-[#D4AF37]">
            <FiRefreshCw
              size={18}
              className="text-[#D4AF37]"
            />
          </div>

          <p className="mt-4 font-semibold text-gray-900">
            Loading Profile...
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Fetching your employee account details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
            <FiShield size={13} />
            Employee Account
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
            Manage and review the account information associated with your
            SkilVira employee profile.
          </p>
        </div>
      </section>

      {/* Profile Hero */}
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="h-36 bg-gradient-to-r from-[#D4AF37] via-yellow-500 to-amber-600 sm:h-44" />

        <div className="relative px-5 pb-7 sm:px-8">
          <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div className="shrink-0">
                <img
                  src={avatarUrl}
                  alt={
                    user?.name ||
                    "Employee"
                  }
                  className="h-32 w-32 rounded-full border-8 border-white bg-gray-100 object-cover shadow-lg sm:h-40 sm:w-40"
                  onError={(event) => {
                    event.currentTarget.src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name ||
                          "Employee"
                      )}&background=D4AF37&color=fff&size=200`;
                  }}
                />
              </div>

              {/* Identity */}
              <div className="pb-1 sm:pb-3">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-4xl">
                  {user?.name ||
                    "Employee"}
                </h2>

                <p className="mt-1 font-semibold text-[#D4AF37]">
                  SkilVira Employee
                </p>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                  {user?.email && (
                    <span className="flex items-center gap-2">
                      <FiMail
                        size={15}
                        className="text-[#D4AF37]"
                      />
                      <span className="break-all">
                        {user.email}
                      </span>
                    </span>
                  )}

                  {user?.phone && (
                    <span className="flex items-center gap-2">
                      <FiPhone
                        size={15}
                        className="text-[#D4AF37]"
                      />
                      {user.phone}
                    </span>
                  )}

                  {(user?.city ||
                    user?.state) && (
                    <span className="flex items-center gap-2">
                      <FiMapPin
                        size={15}
                        className="text-[#D4AF37]"
                      />
                      {user?.city || ""}
                      {user?.city &&
                      user?.state
                        ? ", "
                        : ""}
                      {user?.state || ""}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={loadProfile}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-white px-5 py-3 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/5"
            >
              <FiRefreshCw size={16} />
              Refresh Profile
            </button>
          </div>

          {/* Account badge */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <AccountBadge
              icon={<FiShield size={18} />}
              label="Role"
              value={
                user?.role
                  ? String(
                      user.role
                    ).replace(
                      /^./,
                      (char) =>
                        char.toUpperCase()
                    )
                  : "Employee"
              }
            />

            <AccountBadge
              icon={<FiCalendar size={18} />}
              label="Joined"
              value={joinedDate}
            />

            <AccountBadge
              icon={<FiCheckCircle size={18} />}
              label="Account Status"
              value={
                user?.status ===
                "blocked"
                  ? "Blocked"
                  : "Active"
              }
              success={
                user?.status !==
                "blocked"
              }
            />
          </div>
        </div>
      </section>

      {/* Information */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiUser size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your core employee account details.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <InfoCard
            icon={<FiUser size={18} />}
            label="Full Name"
            value={
              user?.name ||
              "Not available"
            }
          />

          <InfoCard
            icon={<FiMail size={18} />}
            label="Email Address"
            value={
              user?.email ||
              "Not available"
            }
          />

          <InfoCard
            icon={<FiShield size={18} />}
            label="Role"
            value={
              user?.role ||
              "Employee"
            }
          />

          <InfoCard
            icon={<FiCalendar size={18} />}
            label="Joined Date"
            value={joinedDate}
          />
        </div>
      </section>

      {/* Operational identity */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiBriefcase size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Employee Role
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your position within SkilVira operations.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37] text-white">
                <FiBriefcase size={20} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Account Type
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  SkilVira Employee
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Employee access is intended for operational activities,
              verification workflows and platform management.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiClock size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Account Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current account state.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <OverviewRow
              label="Status"
              value={
                user?.status ===
                "blocked"
                  ? "Blocked"
                  : "Active"
              }
              active={
                user?.status !==
                "blocked"
              }
            />

            <OverviewRow
              label="Role"
              value={
                user?.role ||
                "employee"
              }
              active
            />

            <OverviewRow
              label="Account ID"
              value={
                user?.id ||
                user?._id ||
                "-"
              }
              active
            />
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] text-white">
            <FiShield size={19} />
          </div>

          <div>
            <h3 className="font-bold text-gray-900">
              Employee access
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Keep your account information accurate and use your employee
              access only for authorized SkilVira operational activities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};


// =====================================================
// ACCOUNT BADGE
// =====================================================

const AccountBadge = ({
  icon,
  label,
  value,
  success = false,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#D4AF37] shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500">
            {label}
          </p>

          <p
            className={`mt-1 truncate text-sm font-bold ${
              success
                ? "text-green-700"
                : "text-gray-900"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};


// =====================================================
// INFO CARD
// =====================================================

const InfoCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-[#D4AF37]/30 hover:bg-white">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#D4AF37] shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-gray-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};


// =====================================================
// OVERVIEW ROW
// =====================================================

const OverviewRow = ({
  label,
  value,
  active,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span
        className={`max-w-[65%] truncate text-right text-sm font-semibold ${
          active
            ? "text-gray-900"
            : "text-red-600"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

export default Profile;