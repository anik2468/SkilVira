import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiEdit3,
  FiRefreshCw,
  FiAlertCircle,
  FiUser,
  FiBriefcase,
  FiBookOpen,
  FiGlobe,
  FiArrowRight,
} from "react-icons/fi";

import ProfileHeader from "../../components/student/ProfileHeader";
import ProfileSection from "../../components/student/ProfileSection";
import SkillBadge from "../../components/student/SkillBadge";
import InfoItem from "../../components/student/InfoItem";

import {
  getStudentProfile,
} from "../../services/studentProfileService";


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


const displayValue = (
  value,
  fallback = "Not added"
) => {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return fallback;
  }

  return value;
};


const formatDate = (date) => {
  if (!date) {
    return "Not added";
  }

  const parsed =
    new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return displayValue(date);
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};


const normalizeProfile = (
  response
) => {
  return (
    response?.profile ||
    response?.data?.profile ||
    response?.data ||
    null
  );
};


// =====================================================
// COMPONENT
// =====================================================

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const user = useMemo(
    () => getStoredUser(),
    []
  );


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

      const userId =
        user?._id ||
        user?.id;

      if (!userId) {
        throw new Error(
          "Student session not found. Please login again."
        );
      }

      const response =
        await getStudentProfile(
          userId
        );

      const profileData =
        normalizeProfile(
          response
        );

      setProfile(
        profileData
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

      setProfile(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadProfile();
  }, []);


  // ======================================
  // Profile Completion
  // ======================================

  const completion = useMemo(() => {
    if (!profile) {
      return 0;
    }

    const fields = [
      profile.phone,
      profile.dateOfBirth,
      profile.gender,
      profile.address,
      profile.city,
      profile.state,
      profile.country,
      profile.pincode,
      profile.college,
      profile.university,
      profile.degree,
      profile.branch,
      profile.semester,
      profile.passingYear,
      profile.cgpa,
      profile.tenthPercentage,
      profile.twelfthPercentage,
      ...(Array.isArray(
        profile.skills
      )
        ? profile.skills
        : []),
      profile.github,
      profile.linkedin,
      profile.portfolio,
      profile.leetcode,
      profile.geeksforgeeks,
      profile.hackerrank,
      profile.workMode,
      profile.expectedStipend,
    ];

    const filled =
      fields.filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          String(value).trim() !== ""
      ).length;

    return Math.min(
      100,
      Math.round(
        (filled /
          fields.length) *
          100
      )
    );
  }, [profile]);


  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-100" />
        </div>

        <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }


  // ======================================
  // Error
  // ======================================

  if (error && !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <FiAlertCircle size={30} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            Unable to Load Profile
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              loadProfile(true)
            }
            disabled={refreshing}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b99520] disabled:opacity-60"
          >
            <FiRefreshCw
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            Try Again
          </button>
        </div>
      </div>
    );
  }


  // ======================================
  // No Profile
  // ======================================

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiUser size={30} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            Profile Not Found
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Complete your student profile to
            get the most out of SkilVira.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/edit-profile"
              )
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b99520]"
          >
            Create Profile
            <FiArrowRight />
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1.5">
            <FiUser
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-xs font-semibold text-[#8B6E12]">
              Student Profile
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage your personal, academic and
            career information.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              loadProfile(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#D4AF37] hover:text-[#8B6E12] disabled:opacity-60"
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
            onClick={() =>
              navigate(
                "/student/edit-profile"
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b99520]"
          >
            <FiEdit3 />
            Edit Profile
          </button>
        </div>
      </div>


      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
      />


      {/* Completion */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500">
              Profile Completion
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {completion}%
            </p>
          </div>

          <p className="max-w-md text-sm text-gray-500">
            Keep your profile updated to improve
            your internship and career opportunities.
          </p>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
            style={{
              width: `${completion}%`,
            }}
          />
        </div>
      </section>


      {/* Personal Information */}
      <ProfileSection
        title="Personal Information"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            label="Phone"
            value={displayValue(
              profile.phone
            )}
          />

          <InfoItem
            label="Date of Birth"
            value={formatDate(
              profile.dateOfBirth
            )}
          />

          <InfoItem
            label="Gender"
            value={displayValue(
              profile.gender
            )}
          />

          <InfoItem
            label="Address"
            value={displayValue(
              profile.address
            )}
          />

          <InfoItem
            label="City"
            value={displayValue(
              profile.city
            )}
          />

          <InfoItem
            label="State"
            value={displayValue(
              profile.state
            )}
          />

          <InfoItem
            label="Country"
            value={displayValue(
              profile.country
            )}
          />

          <InfoItem
            label="Pincode"
            value={displayValue(
              profile.pincode
            )}
          />
        </div>
      </ProfileSection>


      {/* Education */}
      <ProfileSection
        title="Education"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            label="College"
            value={displayValue(
              profile.college
            )}
          />

          <InfoItem
            label="University"
            value={displayValue(
              profile.university
            )}
          />

          <InfoItem
            label="Degree"
            value={displayValue(
              profile.degree
            )}
          />

          <InfoItem
            label="Branch"
            value={displayValue(
              profile.branch
            )}
          />

          <InfoItem
            label="Semester"
            value={displayValue(
              profile.semester
            )}
          />

          <InfoItem
            label="Passing Year"
            value={displayValue(
              profile.passingYear
            )}
          />

          <InfoItem
            label="CGPA"
            value={displayValue(
              profile.cgpa
            )}
          />

          <InfoItem
            label="10th %"
            value={displayValue(
              profile.tenthPercentage
            )}
          />

          <InfoItem
            label="12th %"
            value={displayValue(
              profile.twelfthPercentage
            )}
          />
        </div>
      </ProfileSection>


      {/* Skills */}
      <ProfileSection
        title="Skills"
      >
        {profile.skills?.length ? (
          <div className="flex flex-wrap gap-3">
            {profile.skills.map(
              (skill, index) => (
                <SkillBadge
                  key={`${skill}-${index}`}
                  skill={skill}
                />
              )
            )}
          </div>
        ) : (
          <EmptySection
            message="No skills added yet."
          />
        )}
      </ProfileSection>


      {/* Social Links */}
      <ProfileSection
        title="Social Links"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <InfoItem
            label="GitHub"
            value={displayValue(
              profile.github
            )}
          />

          <InfoItem
            label="LinkedIn"
            value={displayValue(
              profile.linkedin
            )}
          />

          <InfoItem
            label="Portfolio"
            value={displayValue(
              profile.portfolio
            )}
          />

          <InfoItem
            label="LeetCode"
            value={displayValue(
              profile.leetcode
            )}
          />

          <InfoItem
            label="GeeksforGeeks"
            value={displayValue(
              profile.geeksforgeeks
            )}
          />

          <InfoItem
            label="HackerRank"
            value={displayValue(
              profile.hackerrank
            )}
          />
        </div>
      </ProfileSection>


      {/* Career */}
      <ProfileSection
        title="Career Preferences"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <InfoItem
            label="Work Mode"
            value={displayValue(
              profile.workMode
            )}
          />

          <InfoItem
            label="Expected Stipend"
            value={
              profile.expectedStipend
                ? `₹ ${Number(
                    profile.expectedStipend
                  ).toLocaleString(
                    "en-IN"
                  )}`
                : "Not added"
            }
          />
        </div>
      </ProfileSection>


      {/* Bottom CTA */}
      <section className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FiBriefcase
                className="text-[#D4AF37]"
              />

              <h2 className="font-bold text-gray-900">
                Keep your profile updated
              </h2>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Your profile information can help
              recruiters and internship teams
              understand your background.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/edit-profile"
              )
            }
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b99520]"
          >
            Update Profile
            <FiArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
};


// =====================================================
// EMPTY SECTION
// =====================================================

const EmptySection = ({
  message,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
      <FiBookOpen
        className="text-gray-400"
        size={18}
      />

      {message}
    </div>
  );
};


export default Profile;