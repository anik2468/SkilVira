import { API_ORIGIN } from "../../services/urlConfig.js";
import { useState } from "react";

import {
  FiCamera,
  FiCheckCircle,
  FiRefreshCw,
  FiUpload,
} from "react-icons/fi";

import api from "../../services/api";


const API_BASE =
  API_ORIGIN;


const ProfileForm = ({
  form,
  setForm,
}) => {
  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ======================================
  // Update
  // ======================================

  const update = (event) => {
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


  // ======================================
  // Upload Profile Image
  // ======================================

  const uploadImage = async (
    event
  ) => {
    try {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      setError("");
      setSuccess("");

      // Image validation
      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        event.target.value = "";

        setError(
          "Please select a valid image file."
        );

        return;
      }

      // Maximum 5MB
      if (
        file.size >
        5 * 1024 * 1024
      ) {
        event.target.value = "";

        setError(
          "Profile picture must be less than 5MB."
        );

        return;
      }

      const data =
        new FormData();

      data.append(
        "image",
        file
      );

      setUploading(true);

      const response =
        await api.post(
          "/upload/avatar",
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      const imageUrl =
        response?.data?.url ||
        response?.data?.file ||
        response?.data?.data?.url ||
        "";

      if (!imageUrl) {
        throw new Error(
          "Image upload did not return a file URL."
        );
      }

      setForm((previous) => ({
        ...previous,
        profilePicture:
          imageUrl,
      }));

      setSuccess(
        "Profile picture uploaded successfully."
      );
    } catch (err) {
      console.error(
        "uploadImage error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Profile picture upload failed."
      );
    } finally {
      setUploading(false);
    }
  };


  // ======================================
  // Image URL
  // ======================================

  const getImageUrl = (
    image
  ) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith(
        "http://"
      ) ||
      image.startsWith(
        "https://"
      )
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${API_BASE}${image}`;
    }

    return `${API_BASE}/${image}`;
  };


  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
          <FiCamera />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add your basic personal details and profile picture.
          </p>
        </div>
      </div>


      {/* Messages */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <FiCheckCircle />

          {success}
        </div>
      )}


      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Image */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Profile Picture
          </label>

          <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center">
            {/* Preview */}
            <div className="flex shrink-0 justify-center sm:justify-start">
              {form?.profilePicture ? (
                <img
                  src={getImageUrl(
                    form.profilePicture
                  )}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#D4AF37]/10 text-[#D4AF37] shadow">
                  <FiCamera
                    size={30}
                  />
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="flex-1">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12]">
                {uploading ? (
                  <FiRefreshCw className="animate-spin" />
                ) : (
                  <FiUpload />
                )}

                {uploading
                  ? "Uploading..."
                  : "Choose Profile Picture"}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={
                    uploadImage
                  }
                  disabled={
                    uploading
                  }
                  className="hidden"
                />
              </label>

              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG or WEBP • Maximum 5MB
              </p>
            </div>
          </div>
        </div>


        {/* Phone */}
        <FormField
          label="Phone"
          name="phone"
          value={form?.phone}
          onChange={update}
          type="tel"
          placeholder="Enter phone number"
        />


        {/* Gender */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Gender
          </label>

          <select
            name="gender"
            value={
              form?.gender || ""
            }
            onChange={update}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
          >
            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>


        {/* Date of Birth */}
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          value={
            form?.dateOfBirth
              ? String(
                  form.dateOfBirth
                ).substring(
                  0,
                  10
                )
              : ""
          }
          onChange={update}
          type="date"
        />


        {/* Bio */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Bio
          </label>

          <textarea
            rows={4}
            name="bio"
            value={
              form?.bio || ""
            }
            onChange={update}
            placeholder="Write a brief introduction about yourself..."
            className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
          />
        </div>


        {/* Address */}
        <div className="md:col-span-2">
          <FormField
            label="Address"
            name="address"
            value={form?.address}
            onChange={update}
            placeholder="Enter your full address"
          />
        </div>


        {/* City */}
        <FormField
          label="City"
          name="city"
          value={form?.city}
          onChange={update}
          placeholder="Enter city"
        />


        {/* State */}
        <FormField
          label="State"
          name="state"
          value={form?.state}
          onChange={update}
          placeholder="Enter state"
        />


        {/* Country */}
        <FormField
          label="Country"
          name="country"
          value={
            form?.country ||
            "India"
          }
          onChange={update}
          placeholder="Enter country"
        />


        {/* Pincode */}
        <FormField
          label="Pincode"
          name="pincode"
          value={form?.pincode}
          onChange={update}
          type="text"
          inputMode="numeric"
          placeholder="Enter pincode"
        />
      </div>
    </section>
  );
};


// =====================================================
// FORM FIELD
// =====================================================

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  inputMode,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
      />
    </div>
  );
};


export default ProfileForm;