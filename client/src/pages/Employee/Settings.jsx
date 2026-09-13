import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiSettings,
  FiLock,
  FiLogOut,
  FiShield,
  FiBell,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

import api from "../../services/api";

const Settings = () => {
  const navigate = useNavigate();

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(() => {
      const stored =
        localStorage.getItem(
          "employee_notifications_enabled"
        );

      return stored !== "false";
    });

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage("");
    setPasswordError("");
  };

  const changePassword = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError(
        "Please fill in all password fields."
      );

      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );

      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordError(
        "New password and confirm password do not match."
      );

      return;
    }

    try {
      setChangingPassword(true);

      /*
       * Keep this endpoint aligned with the
       * current authentication API structure.
       */
      await api.put(
        "/auth/change-password",
        {
          currentPassword:
            passwordForm.currentPassword,
          newPassword:
            passwordForm.newPassword,
        }
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage(
        "Password changed successfully."
      );
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setPasswordError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const toggleNotifications = () => {
    const nextValue =
      !notificationsEnabled;

    setNotificationsEnabled(nextValue);

    localStorage.setItem(
      "employee_notifications_enabled",
      String(nextValue)
    );
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
            <FiSettings size={13} />
            Account Settings
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
            Manage your employee account security, notification preference
            and session settings.
          </p>
        </div>
      </section>

      {/* Security */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiLock size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Password & Security
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep your employee account secure.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {passwordMessage && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <FiCheckCircle
                size={17}
                className="shrink-0"
              />

              {passwordMessage}
            </div>
          )}

          {passwordError && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <FiAlertCircle
                size={17}
                className="mt-0.5 shrink-0"
              />

              {passwordError}
            </div>
          )}

          <form
            onSubmit={changePassword}
            className="space-y-5"
          >
            <PasswordField
              label="Current Password"
              name="currentPassword"
              value={
                passwordForm.currentPassword
              }
              onChange={
                handlePasswordChange
              }
              visible={
                showCurrentPassword
              }
              onToggle={() =>
                setShowCurrentPassword(
                  (previous) =>
                    !previous
                )
              }
              placeholder="Enter current password"
            />

            <PasswordField
              label="New Password"
              name="newPassword"
              value={
                passwordForm.newPassword
              }
              onChange={
                handlePasswordChange
              }
              visible={showNewPassword}
              onToggle={() =>
                setShowNewPassword(
                  (previous) =>
                    !previous
                )
              }
              placeholder="Enter new password"
            />

            <PasswordField
              label="Confirm New Password"
              name="confirmPassword"
              value={
                passwordForm.confirmPassword
              }
              onChange={
                handlePasswordChange
              }
              visible={
                showConfirmPassword
              }
              onToggle={() =>
                setShowConfirmPassword(
                  (previous) =>
                    !previous
                )
              }
              placeholder="Confirm new password"
            />

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <FiShield
                  size={17}
                  className="mt-0.5 shrink-0 text-[#D4AF37]"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Password security
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Use a strong password and avoid sharing your account
                    credentials with anyone.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {changingPassword ? (
                <>
                  <FiRefreshCw
                    size={17}
                    className="animate-spin"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <FiLock size={17} />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiBell size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Notifications
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                Control whether your employee workspace keeps local
                notification preferences enabled.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleNotifications}
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
              notificationsEnabled
                ? "bg-[#D4AF37]"
                : "bg-gray-300"
            }`}
            aria-label="Toggle notifications"
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                notificationsEnabled
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Notification Status
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {notificationsEnabled
                  ? "Enabled"
                  : "Disabled"}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                notificationsEnabled
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {notificationsEnabled
                ? "On"
                : "Off"}
            </span>
          </div>
        </div>
      </section>

      {/* Session */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <FiLogOut size={20} />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              Session
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Sign out from this employee account on the current device.
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <FiLogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Security note */}
      <section className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] text-white">
            <FiShield size={19} />
          </div>

          <div>
            <h3 className="font-bold text-gray-900">
              Account security
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Never share passwords, access tokens or internal SkilVira
              operational information with unauthorized people.
            </p>
          </div>
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
  name,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
}) => {
  return (
    <div>
      <label
        htmlFor={`employee-${name}`}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={`employee-${name}`}
          type={
            visible
              ? "text"
              : "password"
          }
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="current-password"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
        >
          {visible ? (
            <FiEyeOff size={17} />
          ) : (
            <FiEye size={17} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;