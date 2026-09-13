import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiEdit3,
  FiRefreshCw,
  FiSave,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";

import ProfileForm from "../../components/student/ProfileForm";
import EducationForm from "../../components/student/EducationForm";
import SkillsForm from "../../components/student/SkillsForm";
import ProjectsForm from "../../components/student/ProjectsForm";
import CertificatesForm from "../../components/student/CertificatesForm";
import SocialLinksForm from "../../components/student/SocialLinksForm";
import CareerForm from "../../components/student/CareerForm";

import {
  getStudentProfile,
  saveStudentProfile,
} from "../../services/studentProfileService";


// =====================================================
// DEFAULT FORM
// =====================================================

const DEFAULT_FORM = {
  profilePicture: "",
  bio: "",

  phone: "",
  gender: "",
  dateOfBirth: "",

  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",

  college: "",
  university: "",
  degree: "B.Tech",
  branch: "",
  semester: "",
  passingYear: "",
  cgpa: "",
  tenthPercentage: "",
  twelfthPercentage: "",

  skills: [],
  languages: [],

  resume: "",

  projects: [],

  certificates: [],

  github: "",
  linkedin: "",
  portfolio: "",
  leetcode: "",
  geeksforgeeks: "",
  hackerrank: "",
  codeforces: "",
  codechef: "",

  preferredRole: "",
  preferredLocation: "",
  workMode: "",
  expectedStipend: "",

  profileVisibility: true,
};


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


const normalizeProfile = (
  profile
) => {
  if (!profile) {
    return {
      ...DEFAULT_FORM,
    };
  }

  return {
    ...DEFAULT_FORM,
    ...profile,

    skills: Array.isArray(
      profile.skills
    )
      ? profile.skills
      : [],

    languages: Array.isArray(
      profile.languages
    )
      ? profile.languages
      : [],

    projects: Array.isArray(
      profile.projects
    )
      ? profile.projects
      : [],

    certificates: Array.isArray(
      profile.certificates
    )
      ? profile.certificates
      : [],

    profileVisibility:
      profile.profileVisibility !==
      undefined
        ? profile.profileVisibility
        : true,

    country:
      profile.country ||
      "India",

    degree:
      profile.degree ||
      "B.Tech",
  };
};


// =====================================================
// COMPONENT
// =====================================================

const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      ...DEFAULT_FORM,
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const user = useMemo(
    () => getStoredUser(),
    []
  );


  // ======================================
  // Student ID
  // ======================================

  const studentId =
    user?._id ||
    user?.id;


  // ======================================
  // Load Profile
  // ======================================

  const loadProfile = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setSuccess("");

      if (!studentId) {
        throw new Error(
          "Student session not found. Please login again."
        );
      }

      const response =
        await getStudentProfile(
          studentId
        );

      const profile =
        response?.profile ||
        response?.data?.profile ||
        response?.data ||
        null;

      setForm(
        normalizeProfile(
          profile
        )
      );
    } catch (err) {
      console.error(
        "loadProfile error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadProfile();
  }, [studentId]);


  // ======================================
  // Save Profile
  // ======================================

  const save = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!studentId) {
        throw new Error(
          "Student session not found. Please login again."
        );
      }

      await saveStudentProfile(
        studentId,
        form
      );

      setSuccess(
        "Profile updated successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        navigate(
          "/student/profile"
        );
      }, 700);
    } catch (err) {
      console.error(
        "save profile error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  };


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-52 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="h-11 w-32 animate-pulse rounded-xl bg-gray-100" />
        </div>

        {[
          1,
          2,
          3,
          4,
          5,
        ].map((item) => (
          <div
            key={item}
            className="h-56 animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>
    );
  }


  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/profile"
              )
            }
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#8B6E12]"
          >
            <FiArrowLeft />
            Back to Profile
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiEdit3
                size={22}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Edit Profile
              </h1>

              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Complete and maintain your
                SkilVira student profile.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              loadProfile(true)
            }
            disabled={
              refreshing ||
              saving
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b99520] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <FiRefreshCw className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>


      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <FiAlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}


      {/* Success */}
      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          <FiCheckCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}


      {/* Account Info */}
      <section className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#D4AF37] shadow-sm">
            <FiUser />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              Keep your information updated
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Your personal, academic, skills and
              career details are used across your
              SkilVira student experience.
            </p>
          </div>
        </div>
      </section>


      {/* Personal Profile */}
      <ProfileForm
        form={form}
        setForm={setForm}
      />


      {/* Education */}
      <EducationForm
        form={form}
        setForm={setForm}
      />


      {/* Skills */}
      <SkillsForm
        form={form}
        setForm={setForm}
      />


      {/* Projects */}
      <ProjectsForm
        form={form}
        setForm={setForm}
      />


      {/* Certificates */}
      <CertificatesForm
        form={form}
        setForm={setForm}
      />


      {/* Social Links */}
      <SocialLinksForm
        form={form}
        setForm={setForm}
      />


      {/* Career */}
      <CareerForm
        form={form}
        setForm={setForm}
      />


      {/* Bottom Save */}
      <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-gray-900">
            Ready to save your changes?
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Make sure your profile information
            is accurate before saving.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/profile"
              )
            }
            disabled={saving}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#b99520] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <FiRefreshCw className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiCheckCircle />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


export default EditProfile;