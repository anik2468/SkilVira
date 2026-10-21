import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiCheckCircle,
  FiChevronRight,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiKey,
  FiLock,
  FiLogOut,
  FiMail,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiUser,
  FiAlertCircle,
} from "react-icons/fi";

import authService from "../../services/authService";

const GOLD = "#D4AF37";

const Settings = () => {
  const navigate = useNavigate();

  const [user, setUser] =
    useState(null);

  const [notifications, setNotifications] =
    useState({
      applicationUpdates: true,
      internshipUpdates: true,
      platformAnnouncements: true,
      emailNotifications: true,
    });

  const [passwords, setPasswords] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [showPasswords, setShowPasswords] =
    useState({
      current: false,
      new: false,
      confirm: false,
    });

  const [savingPreferences, setSavingPreferences] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const savedPreferences =
        localStorage.getItem(
          "recruiterNotificationPreferences"
        );

      if (savedPreferences) {
        const parsed =
          JSON.parse(savedPreferences);

        setNotifications(
          (prev) => ({
            ...prev,
            ...parsed,
          })
        );
      }
    } catch (err) {
      console.error(
        "Settings initialization error:",
        err
      );
    }
  }, []);

  const updatePassword = (e) => {
    const {
      name,
      value,
    } = e.target;

    setPasswords(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );

    setError("");
    setSuccess("");
  };

  const toggleNotification = (
    key
  ) => {
    setNotifications(
      (prev) => ({
        ...prev,
        [key]: !prev[key],
      })
    );

    setSuccess("");
    setError("");
  };

  const togglePasswordVisibility = (
    key
  ) => {
    setShowPasswords(
      (prev) => ({
        ...prev,
        [key]: !prev[key],
      })
    );
  };

  const savePreferences = async () => {
    try {
      setSavingPreferences(true);
      setError("");
      setSuccess("");

      localStorage.setItem(
        "recruiterNotificationPreferences",
        JSON.stringify(
          notifications
        )
      );

      setSuccess(
        "Notification preferences saved successfully."
      );
    } catch (err) {
      console.error(
        "Save preferences error:",
        err
      );

      setError(
        "Unable to save notification preferences."
      );
    } finally {
      setSavingPreferences(false);
    }
  };

  const changePassword = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setError(
        "Please fill all password fields."
      );
      return;
    }

    if (
      passwords.newPassword.length <
      6
    ) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (
      passwords.currentPassword ===
      passwords.newPassword
    ) {
      setError(
        "New password should be different from the current password."
      );
      return;
    }

    try {
      setChangingPassword(
        true
      );

      /*
       * authService.changePassword()
       * is the centralized auth flow already
       * used in the application.
       */
      await authService.changePassword({
        currentPassword:
          passwords.currentPassword,
        newPassword:
          passwords.newPassword,
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess(
        "Password changed successfully."
      );
    } catch (err) {
      console.error(
        "Change password error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(
        false
      );
    }
  };

  const logout = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmed) return;

    try {
      setLoggingOut(true);
      setError("");

      await authService.logout();
    } catch (err) {
      console.error(
        "Logout error:",
        err
      );
    } finally {
      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "accessToken"
      );

      sessionStorage.removeItem(
        "token"
      );

      setLoggingOut(false);

      navigate("/login/recruiter", {
        replace: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <section className="relative overflow-hidden rounded-[30px] bg-black px-6 py-7 text-white shadow-2xl sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiShield
                  size={14}
                  style={{
                    color: GOLD,
                  }}
                />

                <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                  Account Control
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Settings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Manage your recruiter account, notifications and security
                preferences.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Signed in as
              </p>

              <p className="mt-1 text-sm font-black text-white">
                {user?.email ||
                  user?.name ||
                  "Recruiter"}
              </p>
            </div>
          </div>
        </section>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle
              className="mt-0.5 shrink-0"
              size={18}
            />

            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle
              className="mt-0.5 shrink-0"
              size={18}
            />

            <span>{success}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">

          {/* Preferences */}
          <div className="space-y-6">

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-6">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Notifications
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Notification Preferences
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Choose which recruiter updates you want to receive.
                </p>
              </div>

              <div className="space-y-3">
                <PreferenceRow
                  icon={<FiFileIcon />}
                  title="Application Updates"
                  description="Get notified when candidate applications change."
                  enabled={
                    notifications.applicationUpdates
                  }
                  onChange={() =>
                    toggleNotification(
                      "applicationUpdates"
                    )
                  }
                />

                <PreferenceRow
                  icon={<FiBriefcaseIcon />}
                  title="Internship Updates"
                  description="Receive important updates about your internship posts."
                  enabled={
                    notifications.internshipUpdates
                  }
                  onChange={() =>
                    toggleNotification(
                      "internshipUpdates"
                    )
                  }
                />

                <PreferenceRow
                  icon={<FiBell />}
                  title="Platform Announcements"
                  description="Receive important SkilVira platform announcements."
                  enabled={
                    notifications.platformAnnouncements
                  }
                  onChange={() =>
                    toggleNotification(
                      "platformAnnouncements"
                    )
                  }
                />

                <PreferenceRow
                  icon={<FiMail />}
                  title="Email Notifications"
                  description="Allow eligible recruiter communications through email."
                  enabled={
                    notifications.emailNotifications
                  }
                  onChange={() =>
                    toggleNotification(
                      "emailNotifications"
                    )
                  }
                />
              </div>

              <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={
                    savePreferences
                  }
                  disabled={
                    savingPreferences
                  }
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black disabled:opacity-50"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiSave />

                  {savingPreferences
                    ? "Saving..."
                    : "Save Preferences"}
                </button>
              </div>
            </section>

            {/* Security */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-6">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Account Security
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Change Password
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Use a strong password that you do not reuse on other
                  services.
                </p>
              </div>

              <form
                onSubmit={
                  changePassword
                }
                className="space-y-5"
              >
                <PasswordField
                  label="Current Password"
                  name="currentPassword"
                  value={
                    passwords.currentPassword
                  }
                  onChange={
                    updatePassword
                  }
                  show={
                    showPasswords.current
                  }
                  onToggle={() =>
                    togglePasswordVisibility(
                      "current"
                    )
                  }
                  placeholder="Enter current password"
                />

                <PasswordField
                  label="New Password"
                  name="newPassword"
                  value={
                    passwords.newPassword
                  }
                  onChange={
                    updatePassword
                  }
                  show={
                    showPasswords.new
                  }
                  onToggle={() =>
                    togglePasswordVisibility(
                      "new"
                    )
                  }
                  placeholder="Enter new password"
                />

                <PasswordField
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={
                    passwords.confirmPassword
                  }
                  onChange={
                    updatePassword
                  }
                  show={
                    showPasswords.confirm
                  }
                  onToggle={() =>
                    togglePasswordVisibility(
                      "confirm"
                    )
                  }
                  placeholder="Confirm new password"
                />

                <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-gray-400">
                    Password Guidelines
                  </p>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <PasswordHint
                      text="At least 6 characters"
                      valid={
                        passwords.newPassword.length >=
                        6
                      }
                    />

                    <PasswordHint
                      text="Passwords must match"
                      valid={
                        passwords.newPassword.length >
                          0 &&
                        passwords.newPassword ===
                          passwords.confirmPassword
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-5">
                  <button
                    type="submit"
                    disabled={
                      changingPassword
                    }
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black disabled:opacity-50"
                    style={{
                      backgroundColor:
                        GOLD,
                    }}
                  >
                    <FiKey />

                    {changingPassword
                      ? "Updating..."
                      : "Update Password"}
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">

            {/* Account */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Account
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950">
                  Account Information
                </h2>
              </div>

              <div className="space-y-3">
                <AccountRow
                  icon={<FiUser />}
                  label="Name"
                  value={
                    user?.name ||
                    user?.fullName ||
                    "Recruiter"
                  }
                />

                <AccountRow
                  icon={<FiMail />}
                  label="Email"
                  value={
                    user?.email ||
                    "—"
                  }
                />

                <AccountRow
                  icon={<FiShield />}
                  label="Role"
                  value={
                    user?.role ||
                    "Recruiter"
                  }
                />
              </div>
            </section>

            {/* Session */}
            <section className="rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-7">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-black"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiLock size={19} />
                </div>

                <div>
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{
                      color: GOLD,
                    }}
                  >
                    Security
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Active Session
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Sign out from the current recruiter session on this
                    device.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                disabled={loggingOut}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-black text-red-300 hover:bg-red-400/15 disabled:opacity-50"
              >
                <FiLogOut />

                {loggingOut
                  ? "Signing Out..."
                  : "Logout"}
              </button>
            </section>

            {/* Shortcuts */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Shortcuts
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950">
                  Recruiter Workspace
                </h2>
              </div>

              <div className="space-y-2">
                <Shortcut
                  title="My Profile"
                  description="Update recruiter details"
                  to="/recruiter/profile"
                  navigate={navigate}
                />

                <Shortcut
                  title="Company Profile"
                  description="Manage organization information"
                  to="/recruiter/company"
                  navigate={navigate}
                />

                <Shortcut
                  title="Internships"
                  description="Manage internship posts"
                  to="/recruiter/internships"
                  navigate={navigate}
                />

                <Shortcut
                  title="Applications"
                  description="Review candidates"
                  to="/recruiter/applications"
                  navigate={navigate}
                />
              </div>
            </section>

            {/* Privacy */}
            <section className="rounded-3xl border border-gray-200 bg-[#FAFAF8] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#8D7414] shadow-sm">
                  <FiShield size={18} />
                </div>

                <div>
                  <p className="text-sm font-black text-gray-900">
                    Security Reminder
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Never share your recruiter password with anyone.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreferenceRow = ({
  icon,
  title,
  description,
  enabled,
  onChange,
}) => (
  <button
    type="button"
    onClick={onChange}
    className="flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4 text-left transition hover:bg-white hover:shadow-sm"
  >
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
      style={{
        backgroundColor:
          enabled
            ? "rgba(212,175,55,0.12)"
            : "#F3F4F6",
        color: enabled
          ? "#8D7414"
          : "#9CA3AF",
      }}
    >
      {icon}
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-black text-gray-900">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>

    <div
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        enabled
          ? "bg-[#D4AF37]"
          : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled
            ? "left-6"
            : "left-1"
        }`}
      />
    </div>
  </button>
);

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
}) => (
  <div>
    <label className="mb-2 block text-sm font-black text-gray-800">
      {label}
    </label>

    <div className="relative">
      <FiLock
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type={
          show
            ? "text"
            : "password"
        }
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-12 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white"
      />

      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
      >
        {show ? (
          <FiEyeOff size={17} />
        ) : (
          <FiEye size={17} />
        )}
      </button>
    </div>
  </div>
);

const PasswordHint = ({
  text,
  valid,
}) => (
  <div className="flex items-center gap-2 text-xs font-semibold">
    <span
      className={
        valid
          ? "text-emerald-500"
          : "text-gray-300"
      }
    >
      <FiCheckCircle />
    </span>

    <span
      className={
        valid
          ? "text-emerald-700"
          : "text-gray-500"
      }
    >
      {text}
    </span>
  </div>
);

const AccountRow = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm">
      {icon}
    </div>

    <div className="min-w-0">
      <p className="text-[11px] font-black uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-gray-800">
        {value}
      </p>
    </div>
  </div>
);

const Shortcut = ({
  title,
  description,
  to,
  navigate,
}) => (
  <button
    type="button"
    onClick={() => navigate(to)}
    className="group flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4 text-left transition hover:bg-white hover:shadow-sm"
  >
    <div>
      <p className="text-sm font-black text-gray-900">
        {title}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>

    <FiChevronRight className="text-gray-300 transition group-hover:text-gray-700" />
  </button>
);

/*
 * Small inline icon helpers keep this file independent
 * from any additional icon package changes.
 */
const FiFileIcon = () => (
  <FiFileText size={18} />
);

const FiBriefcaseIcon = () => (
  <FiBriefcaseFallback size={18} />
);

const FiBriefcaseFallback = ({
  size = 18,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="3"
      y="7"
      width="18"
      height="13"
      rx="2"
    />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 12h18" />
  </svg>
);

export default Settings;