import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiGlobe,
  FiLinkedin,
  FiTwitter,
  FiUpload,
  FiSave,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit2,
} from "react-icons/fi";

import api from "../../services/api";

const GOLD = "#D4AF37";

const DEFAULT_PROFILE = {
  name: "",
  email: "",
  phone: "",
  role: "Recruiter",
  designation: "",
  company: "",
  location: "",
  bio: "",
  website: "",
  linkedin: "",
  twitter: "",
  avatar: "",
};

const Profile = () => {
  const [user, setUser] =
    useState(null);

  const [profile, setProfile] =
    useState(DEFAULT_PROFILE);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [editing, setEditing] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        const parsed =
          JSON.parse(storedUser);

        setUser(parsed);
      } else {
        setLoading(false);
        setError(
          "Recruiter session not found. Please login again."
        );
      }
    } catch (err) {
      console.error(
        "User parsing error:",
        err
      );

      setLoading(false);
      setError(
        "Unable to read recruiter session."
      );
    }
  }, []);

  useEffect(() => {
    const userId =
      user?.id || user?._id;

    if (userId) {
      loadProfile();
    }
  }, [user]);

  const getUserId = () =>
    user?.id || user?._id || "";

  const loadProfile = async (
    isRefresh = false
  ) => {
    const userId =
      getUserId();

    if (!userId) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      let backendProfile = null;

      try {
        const response =
          await api.get(
            `/recruiter/profile/${userId}`
          );

        backendProfile =
          response?.data?.profile ||
          response?.data?.data ||
          response?.data ||
          null;
      } catch (primaryError) {
        /*
         * Fallback: use auth user data.
         * Backend-specific recruiter profile endpoint
         * can be verified during integration testing.
         */
        backendProfile = null;
      }

      let localProfile = null;

      try {
        const saved =
          localStorage.getItem(
            "recruiterProfile"
          );

        localProfile = saved
          ? JSON.parse(saved)
          : null;
      } catch (storageError) {
        console.log(
          "Recruiter local profile error:",
          storageError
        );
      }

      const source =
        backendProfile ||
        localProfile ||
        user ||
        {};

      setProfile({
        ...DEFAULT_PROFILE,

        ...source,

        name:
          source?.name ||
          source?.fullName ||
          user?.name ||
          "",

        email:
          source?.email ||
          user?.email ||
          "",

        phone:
          source?.phone ||
          source?.mobile ||
          user?.phone ||
          "",

        role:
          source?.role ||
          user?.role ||
          "Recruiter",

        avatar:
          source?.avatar ||
          source?.profileImage ||
          source?.image ||
          user?.avatar ||
          "",
      });
    } catch (err) {
      console.error(
        "Recruiter profile load error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load recruiter profile."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const update = (e) => {
    const {
      name,
      value,
    } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const uploadAvatar = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select a valid image file."
      );
      event.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Profile photo must be less than 5 MB."
      );
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      const response =
        await api.post(
          "/upload/avatar",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      const uploadedUrl =
        response?.data?.url ||
        response?.data?.data?.url ||
        response?.data?.path ||
        response?.data?.data?.path ||
        "";

      if (!uploadedUrl) {
        throw new Error(
          "Image URL was not returned."
        );
      }

      setProfile((prev) => ({
        ...prev,
        avatar: uploadedUrl,
      }));

      setSuccess(
        "Profile photo uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Avatar upload error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Profile photo upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const save = async () => {
    const userId =
      getUserId();

    if (!userId) {
      setError(
        "Recruiter ID is missing."
      );
      return;
    }

    if (!profile.name.trim()) {
      setError(
        "Full name is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...profile,
        recruiter: userId,
      };

      let backendSaved = false;

      try {
        const response =
          await api.put(
            `/recruiter/profile/${userId}`,
            payload
          );

        const savedProfile =
          response?.data?.profile ||
          response?.data?.data ||
          null;

        if (savedProfile) {
          setProfile((prev) => ({
            ...prev,
            ...savedProfile,
          }));
        }

        backendSaved = true;
      } catch (primaryError) {
        /*
         * Fallback endpoint for projects where
         * recruiter details are stored on users.
         */
        try {
          const response =
            await api.put(
              `/users/${userId}`,
              payload
            );

          const savedUser =
            response?.data?.user ||
            response?.data?.data ||
            null;

          if (savedUser) {
            setProfile((prev) => ({
              ...prev,
              ...savedUser,
            }));
          }

          backendSaved = true;
        } catch (fallbackError) {
          console.log(
            "Recruiter profile save fallback failed:",
            fallbackError
          );
        }
      }

      localStorage.setItem(
        "recruiterProfile",
        JSON.stringify(
          profile
        )
      );

      /*
       * Also update current auth user locally
       * for consistent navbar/profile display.
       */
      try {
        const currentUser =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            avatar: profile.avatar,
          };

          localStorage.setItem(
            "user",
            JSON.stringify(
              updatedUser
            )
          );

          setUser(updatedUser);
        }
      } catch (userUpdateError) {
        console.log(
          "Local user update error:",
          userUpdateError
        );
      }

      setEditing(false);

      setSuccess(
        backendSaved
          ? "Recruiter profile saved successfully."
          : "Profile saved locally. Backend profile endpoint needs verification."
      );
    } catch (err) {
      console.error(
        "Recruiter profile save error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to save recruiter profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const profileCompletion =
    useMemo(() => {
      const fields = [
        profile.name,
        profile.email,
        profile.phone,
        profile.designation,
        profile.company,
        profile.location,
        profile.bio,
        profile.website,
        profile.linkedin,
      ];

      const completed =
        fields.filter(
          (value) =>
            String(
              value || ""
            ).trim()
        ).length;

      return Math.round(
        (completed /
          fields.length) *
          100
      );
    }, [profile]);

  const avatarUrl =
    getAssetUrl(
      profile.avatar
    );

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[30px] bg-black px-6 py-7 text-white shadow-2xl sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiUser
                  size={14}
                  style={{ color: GOLD }}
                />

                <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                  Recruiter Profile
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                My Profile
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Keep your recruiter identity and professional information
                complete and up to date.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  loadProfile(true)
                }
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
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

              {!editing && (
                <button
                  type="button"
                  onClick={() =>
                    setEditing(true)
                  }
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiEdit2 />
                  Edit Profile
                </button>
              )}

              {editing && (
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black disabled:opacity-50"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiSave />

                  {saving
                    ? "Saving..."
                    : "Save Profile"}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Profile header */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-5">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={
                      profile.name ||
                      "Recruiter"
                    }
                    className="h-28 w-28 rounded-3xl border border-gray-200 bg-gray-50 object-cover"
                  />
                ) : (
                  <div
                    className="flex h-28 w-28 items-center justify-center rounded-3xl text-3xl font-black text-black"
                    style={{
                      backgroundColor:
                        GOLD,
                    }}
                  >
                    {getInitials(
                      profile.name
                    )}
                  </div>
                )}

                {editing && (
                  <label
                    className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border-4 border-white text-black shadow-md"
                    style={{
                      backgroundColor:
                        GOLD,
                    }}
                  >
                    <FiUpload size={16} />

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={
                        uploadAvatar
                      }
                      disabled={
                        uploading
                      }
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Recruiter
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950 sm:text-3xl">
                  {profile.name ||
                    "Your Name"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {profile.designation ||
                    profile.role ||
                    "Recruiter"}
                </p>

                {profile.company && (
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FiBriefcase />
                    {profile.company}
                  </p>
                )}
              </div>
            </div>

            {/* Completion */}
            <div className="w-full max-w-xs rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-wide text-gray-400">
                  Profile Completion
                </p>

                <p className="text-sm font-black text-gray-900">
                  {profileCompletion}%
                </p>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${profileCompletion}%`,
                    backgroundColor:
                      GOLD,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Complete your profile to build a stronger professional presence.
              </p>
            </div>
          </div>

          {uploading && (
            <p className="mt-5 text-xs font-semibold text-gray-500">
              Uploading profile photo...
            </p>
          )}
        </section>

        {/* Main */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">

          {/* Information */}
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Professional Identity
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Personal information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your recruiter information used across the platform.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <Field
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={update}
                icon={<FiUser />}
                placeholder="Your full name"
                disabled={!editing}
                required
              />

              <Field
                label="Email"
                name="email"
                value={profile.email}
                onChange={update}
                icon={<FiMail />}
                type="email"
                placeholder="official@email.com"
                disabled={!editing}
              />

              <Field
                label="Phone"
                name="phone"
                value={profile.phone}
                onChange={update}
                icon={<FiPhone />}
                placeholder="+91..."
                disabled={!editing}
              />

              <Field
                label="Designation"
                name="designation"
                value={profile.designation}
                onChange={update}
                icon={<FiBriefcase />}
                placeholder="e.g. Talent Acquisition Manager"
                disabled={!editing}
              />

              <Field
                label="Company"
                name="company"
                value={profile.company}
                onChange={update}
                icon={<FiBriefcase />}
                placeholder="Company name"
                disabled={!editing}
              />

              <Field
                label="Location"
                name="location"
                value={profile.location}
                onChange={update}
                icon={<FiMapPin />}
                placeholder="City, State"
                disabled={!editing}
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-black text-gray-800">
                  Professional Bio
                </label>

                <textarea
                  name="bio"
                  value={
                    profile.bio || ""
                  }
                  onChange={update}
                  disabled={!editing}
                  rows={6}
                  placeholder="Tell students and candidates about your role, expertise and recruiting background..."
                  className="w-full resize-y rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium leading-6 text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>
            </div>
          </section>

          {/* Side */}
          <div className="space-y-6">

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Digital Presence
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950">
                  Professional links
                </h2>
              </div>

              <div className="space-y-5">

                <Field
                  label="Website"
                  name="website"
                  value={profile.website}
                  onChange={update}
                  icon={<FiGlobe />}
                  placeholder="https://example.com"
                  disabled={!editing}
                />

                <Field
                  label="LinkedIn"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={update}
                  icon={<FiLinkedin />}
                  placeholder="https://linkedin.com/in/..."
                  disabled={!editing}
                />

                <Field
                  label="Twitter / X"
                  name="twitter"
                  value={profile.twitter}
                  onChange={update}
                  icon={<FiTwitter />}
                  placeholder="https://x.com/..."
                  disabled={!editing}
                />
              </div>
            </section>

            <section className="rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-7">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Profile Quality
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Build candidate trust
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                A complete recruiter profile makes your company and
                internship opportunities more credible to students.
              </p>

              <div className="mt-6 space-y-3">
                <QualityItem
                  label="Identity"
                  completed={Boolean(
                    profile.name
                  )}
                />

                <QualityItem
                  label="Professional role"
                  completed={Boolean(
                    profile.designation
                  )}
                />

                <QualityItem
                  label="Company"
                  completed={Boolean(
                    profile.company
                  )}
                />

                <QualityItem
                  label="Profile photo"
                  completed={Boolean(
                    profile.avatar
                  )}
                />

                <QualityItem
                  label="Professional bio"
                  completed={Boolean(
                    profile.bio
                  )}
                />

                <QualityItem
                  label="Professional links"
                  completed={
                    Boolean(
                      profile.linkedin ||
                        profile.website
                    )
                  }
                />
              </div>
            </section>
          </div>
        </div>

        {/* Bottom */}
        {editing && (
          <div className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-gray-900">
                Save your recruiter profile
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Your information can be used throughout your recruiter workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-black disabled:opacity-50"
              style={{
                backgroundColor:
                  GOLD,
              }}
            >
              <FiSave />

              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  icon,
  placeholder,
  type = "text",
  disabled = false,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-black text-gray-800">
        {icon && (
          <span className="text-gray-400">
            {icon}
          </span>
        )}

        {label}

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-2xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>
  );
};

const QualityItem = ({
  label,
  completed,
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3">
      <span className="text-sm font-semibold text-gray-300">
        {label}
      </span>

      <span
        className={
          completed
            ? "text-emerald-400"
            : "text-gray-500"
        }
      >
        <FiCheckCircle />
      </span>
    </div>
  );
};

const getAssetUrl = (
  value
) => {
  if (!value) return "";

  if (
    value.startsWith(
      "http://"
    ) ||
    value.startsWith(
      "https://"
    )
  ) {
    return value;
  }

  return `${API_ORIGIN}${value}`;
};

const getInitials = (
  name = ""
) => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "R";
  }

  return words
    .slice(0, 2)
    .map((word) =>
      word
        .charAt(0)
        .toUpperCase()
    )
    .join("");
};

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-56 rounded-[30px] bg-gray-900" />

        <div className="h-44 rounded-3xl bg-white" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-[560px] rounded-3xl bg-white lg:col-span-2" />
          <div className="h-[560px] rounded-3xl bg-white" />
        </div>
      </div>
    </div>
  );
};

export default Profile;