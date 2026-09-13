import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave,
  FiRefreshCw,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import api from "../../services/api";

const ProfileEdit = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    address: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        throw new Error(
          "Employee session not found."
        );
      }

      const localUser =
        JSON.parse(storedUser);

      const userId =
        localUser?.id ||
        localUser?._id;

      let profileData = localUser;

      if (userId) {
        try {
          const response = await api.get(
            `/employee/profile/${userId}`
          );

          profileData =
            response?.data?.user ||
            response?.data?.employee ||
            response?.data ||
            localUser;
        } catch (profileError) {
          console.warn(
            "Employee profile fetch fallback:",
            profileError
          );
        }
      }

      setForm({
        name:
          profileData?.name || "",
        email:
          profileData?.email || "",
        phone:
          profileData?.phone || "",
        city:
          profileData?.city || "",
        state:
          profileData?.state || "",
        address:
          profileData?.address || "",
      });
    } catch (err) {
      console.error(
        "Load employee profile error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setSaving(true);

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        throw new Error(
          "Employee session not found."
        );
      }

      const localUser =
        JSON.parse(storedUser);

      const userId =
        localUser?.id ||
        localUser?._id;

      if (!userId) {
        throw new Error(
          "Employee ID not found."
        );
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        address: form.address.trim(),
      };

      const response = await api.put(
        `/employee/profile/${userId}`,
        payload
      );

      const updatedUser =
        response?.data?.user ||
        response?.data?.employee ||
        response?.data;

      const nextUser =
        updatedUser &&
        typeof updatedUser ===
          "object"
          ? {
              ...localUser,
              ...updatedUser,
            }
          : {
              ...localUser,
              ...payload,
            };

      localStorage.setItem(
        "user",
        JSON.stringify(nextUser)
      );

      setForm({
        name:
          nextUser?.name || "",
        email:
          nextUser?.email || "",
        phone:
          nextUser?.phone || "",
        city:
          nextUser?.city || "",
        state:
          nextUser?.state || "",
        address:
          nextUser?.address || "",
      });

      setSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Update employee profile error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

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
            Fetching employee account details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111111] p-6 text-white shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative z-10">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/employee/profile"
              )
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
          >
            <FiArrowLeft size={16} />
            Back to Profile
          </button>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#D4AF37]">
            <FiUser size={13} />
            Employee Account
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Edit Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
            Update your employee account information and keep your profile
            details accurate.
          </p>
        </div>
      </section>

      {/* Alerts */}
      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
          <FiCheckCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiAlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={saveProfile}
        className="space-y-6"
      >
        {/* Basic Information */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiUser size={20} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your primary account details.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <InputField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              icon={<FiUser size={16} />}
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              icon={<FiMail size={16} />}
            />

            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              icon={<FiPhone size={16} />}
            />
          </div>
        </section>

        {/* Location */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiMapPin size={20} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Location
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add your current city and state details.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                icon={
                  <FiMapPin size={16} />
                }
              />

              <InputField
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter state"
                icon={
                  <FiMapPin size={16} />
                }
              />
            </div>

            <div>
              <label
                htmlFor="employee-address"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Address
              </label>

              <textarea
                id="employee-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={4}
                placeholder="Enter your complete address"
                className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10"
              />
            </div>
          </div>
        </section>

        {/* Account information */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiShield size={20} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Account Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your account role remains controlled by SkilVira.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <InfoCard
              label="Role"
              value="Employee"
            />

            <InfoCard
              label="Access"
              value="SkilVira Operations"
            />
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/employee/profile"
              )
            }
            disabled={saving}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#c29f32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <FiRefreshCw
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <FiSave size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};


// =====================================================
// INPUT FIELD
// =====================================================

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  icon,
}) => {
  return (
    <div>
      <label
        htmlFor={`employee-${name}`}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]">
            {icon}
          </span>
        )}

        <input
          id={`employee-${name}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/10 ${
            icon
              ? "pl-11"
              : ""
          }`}
        />
      </div>
    </div>
  );
};


// =====================================================
// INFO CARD
// =====================================================

const InfoCard = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
};

export default ProfileEdit;