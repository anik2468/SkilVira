import { API_ORIGIN } from "../../services/urlConfig.js";
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
  FiCamera,
  FiUpload,
} from "react-icons/fi";

import api from "../../services/api";

const API_BASE = API_ORIGIN;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [profileForm, setProfileForm] = useState({
    designation: "", department: "", phone: "", officeEmail: "",
    qualification: "", experience: "0", address: "", city: "",
    state: "", country: "India", linkedin: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);


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
      setProfileForm({
        designation: localUser?.designation || "",
        department: localUser?.department || "",
        phone: localUser?.phone || "",
        officeEmail: localUser?.officeEmail || localUser?.email || "",
        qualification: localUser?.qualification || "",
        experience: String(localUser?.experience ?? 0),
        address: localUser?.address || "",
        city: localUser?.city || "",
        state: localUser?.state || "",
        country: localUser?.country || "India",
        linkedin: localUser?.linkedin || "",
      });

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
            response?.data?.profile ||
            response?.data?.employee ||
            response?.data?.user ||
            null;

          if (profileData && typeof profileData === "object") {
            const account =
              profileData.user && typeof profileData.user === "object"
                ? profileData.user
                : {};

            const accountId = String(
              localUser?.id || localUser?._id ||
              account?._id || ""
            );

            const displayUser = {
              ...localUser,
              ...profileData,
              ...account,
              id: accountId,
              _id: accountId,
            };

            setUser(displayUser);
            setProfileForm({
              designation: profileData.designation || "",
              department: profileData.department || "",
              phone: profileData.phone || "",
              officeEmail: profileData.officeEmail || account.email || localUser?.email || "",
              qualification: profileData.qualification || "",
              experience: String(profileData.experience ?? 0),
              address: profileData.address || "",
              city: profileData.city || "",
              state: profileData.state || "",
              country: profileData.country || "India",
              linkedin: profileData.linkedin || "",
            });

            localStorage.setItem("user", JSON.stringify({
              ...localUser,
              name: displayUser.name || localUser.name,
              email: displayUser.email || localUser.email,
              avatar: displayUser.avatar || localUser.avatar,
            }));
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

  const saveProfile = async (event) => {
    event.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || user?._id || storedUser?.id || storedUser?._id;

    if (!userId) {
      setSaveError("Account could not be identified. Please log in again.");
      return;
    }

    try {
      setSaving(true);
      setSaveError("");
      setSaveMessage("");

      const payload = {
        ...profileForm,
        experience: Math.max(0, Number(profileForm.experience || 0)),
      };

      const { data } = await api.put(`/employee/profile/${userId}`, payload);

      if (data?.profile) {
        setUser((current) => ({
          ...current,
          ...data.profile,
          id: String(userId),
          _id: String(userId),
        }));
      } else {
        setUser((current) => ({ ...current, ...payload }));
      }

      setProfileForm((current) => ({
        ...current,
        experience: String(payload.experience),
      }));
      setIsEditing(false);
      setSaveMessage("Profile details saved successfully.");
    } catch (err) {
      setSaveError(
        err?.response?.data?.message || "Unable to save profile details."
      );
    } finally {
      setSaving(false);
    }
  };

  const uploadProfilePhoto = async () => {
    if (!photoFile) {
      setSaveError("Please choose a photo first.");
      return;
    }

    if (photoFile.size > 5 * 1024 * 1024) {
      setSaveError("Photo must be 5 MB or smaller.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || user?._id || storedUser?.id || storedUser?._id;

    if (!userId) {
      setSaveError("Account could not be identified. Please log in again.");
      return;
    }

    try {
      setPhotoUploading(true);
      setSaveError("");
      setSaveMessage("");

      const formData = new FormData();
      formData.append("image", photoFile);

      const { data } = await api.post(
        "/upload/avatar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const photoUrl = data?.url || data?.path || data?.data?.url || data?.data?.path;
      if (!photoUrl) throw new Error("Upload succeeded but the image URL was missing.");

      await api.put(`/users/avatar/${userId}`, { avatar: photoUrl });

      setUser((current) => ({
        ...current,
        id: String(userId),
        _id: String(userId),
        avatar: photoUrl,
        profileImage: photoUrl,
      }));

      const latestUser = {
        ...storedUser,
        id: String(userId),
        _id: String(userId),
        avatar: photoUrl,
      };
      localStorage.setItem("user", JSON.stringify(latestUser));

      setPhotoFile(null);
      setPhotoPreview("");
      setSaveMessage("Profile photo uploaded and saved.");
    } catch (err) {
      setSaveError(err?.response?.data?.message || err?.message || "Unable to upload profile photo.");
    } finally {
      setPhotoUploading(false);
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

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setSaveError("");
                  setSaveMessage("");
                  setIsEditing((value) => !value);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-gray-950"
              >
                <FiEdit3 size={16} /> {isEditing ? "Close Editor" : "Edit Profile"}
              </button>
              <button
                type="button"
                onClick={loadProfile}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-white px-5 py-3 text-sm font-semibold text-[#D4AF37]"
              >
                <FiRefreshCw size={16} /> Refresh Profile
              </button>
            </div>
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

      {saveError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{saveError}</div>}
      {saveMessage && <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{saveMessage}</div>}

      {isEditing && (
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-7">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile Details</h2>
          <p className="mt-1 text-sm text-gray-500">Update work and contact details. Role and account access cannot be changed here.</p>
          <form onSubmit={saveProfile} className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
              <h3 className="flex items-center gap-2 font-bold text-gray-900">
                <FiCamera /> Profile Photo
              </h3>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={photoPreview || avatarUrl}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
                />
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        setSaveError("Photo must be 5 MB or smaller.");
                        setPhotoFile(null);
                        setPhotoPreview("");
                        event.target.value = "";
                        return;
                      }
                      setSaveError("");
                      setPhotoFile(file);
                      setPhotoPreview(URL.createObjectURL(file));
                    }}
                    className="block w-full text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    JPG, PNG, WEBP or GIF · Maximum 5 MB
                  </p>
                  <button
                    type="button"
                    onClick={uploadProfilePhoto}
                    disabled={!photoFile || photoUploading}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiUpload />
                    {photoUploading ? "Uploading…" : "Upload & Save Photo"}
                  </button>
                </div>
              </div>
            </div>
            {[
              ["designation", "Designation", "text"],
              ["department", "Department", "text"],
              ["phone", "Phone number", "tel"],
              ["officeEmail", "Office email", "email"],
              ["qualification", "Qualification", "text"],
              ["experience", "Experience (years)", "number"],
              ["city", "City", "text"],
              ["state", "State", "text"],
              ["country", "Country", "text"],
              ["linkedin", "LinkedIn URL", "url"],
            ].map(([name, label, type]) => (
              <label key={name} className="block text-sm font-semibold text-gray-800">
                {label}
                <input
                  type={type}
                  value={profileForm[name] ?? ""}
                  min={type === "number" ? "0" : undefined}
                  max={type === "number" ? "80" : undefined}
                  onChange={(event) => setProfileForm((current) => ({ ...current, [name]: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 font-normal outline-none focus:border-[#D4AF37]"
                />
              </label>
            ))}
            <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
              Address
              <textarea
                rows={3}
                value={profileForm.address || ""}
                onChange={(event) => setProfileForm((current) => ({ ...current, address: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-3 font-normal outline-none focus:border-[#D4AF37]"
              />
            </label>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button type="submit" disabled={saving} className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white disabled:opacity-50">
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700">
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

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