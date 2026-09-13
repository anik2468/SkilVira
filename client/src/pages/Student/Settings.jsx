import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiSettings,
  FiLock,
  FiBell,
  FiEye,
  FiLogOut,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
  FiUser,
} from "react-icons/fi";

import {
  changePassword,
  logout,
} from "../../services/authService";


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


// =====================================================
// COMPONENT
// =====================================================

const Settings = () => {
  const navigate = useNavigate();

  const [user] = useState(
    getStoredUser
  );

  const [savingPassword, setSavingPassword] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    notificationsEnabled,
    setNotificationsEnabled,
  ] = useState(
    localStorage.getItem(
      "skilvira_notifications_enabled"
    ) !== "false"
  );

  const [
    profileVisible,
    setProfileVisible,
  ] = useState(
    localStorage.getItem(
      "skilvira_profile_visibility"
    ) !== "false"
  );

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");


  const email = useMemo(
    () =>
      user?.email ||
      user?.loginEmail ||
      "",
    [user]
  );


  // ======================================
  // Preferences
  // ======================================

  useEffect(() => {
    localStorage.setItem(
      "skilvira_notifications_enabled",
      String(
        notificationsEnabled
      )
    );
  }, [
    notificationsEnabled,
  ]);


  useEffect(() => {
    localStorage.setItem(
      "skilvira_profile_visibility",
      String(
        profileVisible
      )
    );
  }, [
    profileVisible,
  ]);


  // ======================================
  // Change Password
  // ======================================

  const handleChangePassword =
    async () => {
      setError("");
      setSuccess("");

      if (!currentPassword.trim()) {
        setError(
          "Please enter your current password."
        );
        return;
      }

      if (!newPassword.trim()) {
        setError(
          "Please enter a new password."
        );
        return;
      }

      if (newPassword.length < 6) {
        setError(
          "New password must be at least 6 characters."
        );
        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        setError(
          "New password and confirm password do not match."
        );
        return;
      }

      try {
        setSavingPassword(true);

        await changePassword({
          currentPassword,
          newPassword,
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setSuccess(
          "Password changed successfully."
        );
      } catch (err) {
        console.error(
          "change password error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to change password."
        );
      } finally {
        setSavingPassword(false);
      }
    };


  // ======================================
  // Logout
  // ======================================

  const handleLogout =
    async () => {
      try {
        setLoggingOut(true);

        try {
          await logout();
        } catch (error) {
          console.error(
            "Server logout error:",
            error
          );
        }

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "user"
        );

        sessionStorage.removeItem(
          "token"
        );

        sessionStorage.removeItem(
          "accessToken"
        );

        sessionStorage.removeItem(
          "user"
        );

        navigate("/", {
          replace: true,
        });
      } finally {
        setLoggingOut(false);
      }
    };


  // ======================================
  // UI
  // ======================================

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#8B6E12]"
        >
          <FiArrowLeft />
          Back
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiSettings
              size={23}
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Settings
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage your account, security and
              notification preferences.
            </p>
          </div>
        </div>
      </div>


      {/* Messages */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiAlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          <FiCheckCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}


      {/* Account */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <FiUser />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Account
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your current account information.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Name
            </p>

            <p className="mt-2 font-semibold text-gray-800">
              {user?.name ||
                user?.fullName ||
                "Student"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Email
            </p>

            <p className="mt-2 break-all font-semibold text-gray-800">
              {email ||
                "Not available"}
            </p>
          </div>
        </div>
      </section>


      {/* Security */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiLock />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Security
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Change your account password.
            </p>
          </div>
        </div>

        <div className="mt-6 max-w-2xl space-y-5">
          {/* Current */}
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={
              setCurrentPassword
            }
            showPassword={
              showPassword
            }
            onToggle={() =>
              setShowPassword(
                (value) => !value
              )
            }
          />

          {/* New */}
          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={
              setNewPassword
            }
            showPassword={
              showPassword
            }
            onToggle={() =>
              setShowPassword(
                (value) => !value
              )
            }
          />

          {/* Confirm */}
          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChange={
              setConfirmPassword
            }
            showPassword={
              showPassword
            }
            onToggle={() =>
              setShowPassword(
                (value) => !value
              )
            }
          />

          <button
            type="button"
            onClick={
              handleChangePassword
            }
            disabled={
              savingPassword
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b99520] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingPassword ? (
              <>
                <FiRefreshCw className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <FiLock />
                Change Password
              </>
            )}
          </button>
        </div>
      </section>


      {/* Preferences */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiBell />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Preferences
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Control how your student account behaves.
            </p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-gray-100">
          <SettingRow
            icon={<FiBell />}
            title="Notifications"
            description="Keep notifications enabled for important student updates."
            checked={
              notificationsEnabled
            }
            onChange={() =>
              setNotificationsEnabled(
                (value) => !value
              )
            }
          />

          <SettingRow
            icon={<FiEye />}
            title="Profile Visibility"
            description="Control whether your profile can be visible to relevant platform users."
            checked={
              profileVisible
            }
            onChange={() =>
              setProfileVisible(
                (value) => !value
              )
            }
          />
        </div>
      </section>


      {/* Quick Actions */}
      <section className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900">
          Quick Actions
        </h2>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/profile"
              )
            }
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12]"
          >
            View Profile
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/edit-profile"
              )
            }
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12]"
          >
            Edit Profile
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/notifications"
              )
            }
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12]"
          >
            Notifications
          </button>
        </div>
      </section>


      {/* Logout */}
      <section className="rounded-2xl border border-red-100 bg-red-50 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Sign Out
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Sign out from your current SkilVira
              student session.
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleLogout
            }
            disabled={loggingOut}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
          >
            {loggingOut ? (
              <>
                <FiRefreshCw className="animate-spin" />
                Signing Out...
              </>
            ) : (
              <>
                <FiLogOut />
                Sign Out
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};


// =====================================================
// PASSWORD FIELD
// =====================================================

const PasswordField = ({
  label,
  value,
  onChange,
  showPassword,
  onToggle,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <div className="relative">
        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
          placeholder={`Enter ${label.toLowerCase()}`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          title={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          <FiEye size={17} />
        </button>
      </div>
    </div>
  );
};


// =====================================================
// SETTING ROW
// =====================================================

const SettingRow = ({
  icon,
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-[#D4AF37]">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            {title}
          </h3>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#D4AF37]"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
};


export default Settings;