import { useEffect, useState } from "react";

import ProfileHeader from "../../components/student/ProfileHeader";
import ProfileSection from "../../components/student/ProfileSection";
import SkillBadge from "../../components/student/SkillBadge";
import InfoItem from "../../components/student/InfoItem";

import { getStudentProfile } from "../../services/studentProfileService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getStudentProfile(user.id);
      setProfile(res.profile);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-2xl font-bold">
          Loading Profile...
        </h2>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-2xl font-bold">
          Profile Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <ProfileHeader profile={profile} />

      {/* Personal Information */}

      <ProfileSection title="Personal Information">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          <InfoItem
            label="Phone"
            value={profile.phone}
          />

          <InfoItem
            label="Date of Birth"
            value={
              profile.dateOfBirth
                ? new Date(
                    profile.dateOfBirth
                  ).toLocaleDateString()
                : ""
            }
          />

          <InfoItem
            label="Gender"
            value={profile.gender}
          />

          <InfoItem
            label="Address"
            value={profile.address}
          />

          <InfoItem
            label="City"
            value={profile.city}
          />

          <InfoItem
            label="State"
            value={profile.state}
          />

          <InfoItem
            label="Country"
            value={profile.country}
          />

          <InfoItem
            label="Pincode"
            value={profile.pincode}
          />

        </div>

      </ProfileSection>

      {/* Education */}

      <ProfileSection title="Education">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          <InfoItem
            label="College"
            value={profile.college}
          />

          <InfoItem
            label="University"
            value={profile.university}
          />

          <InfoItem
            label="Degree"
            value={profile.degree}
          />

          <InfoItem
            label="Branch"
            value={profile.branch}
          />

          <InfoItem
            label="Semester"
            value={profile.semester}
          />

          <InfoItem
            label="Passing Year"
            value={profile.passingYear}
          />

          <InfoItem
            label="CGPA"
            value={profile.cgpa}
          />

          <InfoItem
            label="10th %"
            value={profile.tenthPercentage}
          />

          <InfoItem
            label="12th %"
            value={profile.twelfthPercentage}
          />

        </div>

      </ProfileSection>

      {/* Skills */}

      <ProfileSection title="Skills">

        <div className="flex flex-wrap gap-3">

          {profile.skills?.length ? (
            profile.skills.map((skill, index) => (
              <SkillBadge
                key={index}
                skill={skill}
              />
            ))
          ) : (
            <p className="text-gray-500">
              No Skills Added
            </p>
          )}

        </div>

      </ProfileSection>

      {/* Social Links */}

      <ProfileSection title="Social Links">

        <div className="grid gap-6 md:grid-cols-2">

          <InfoItem
            label="GitHub"
            value={profile.github}
          />

          <InfoItem
            label="LinkedIn"
            value={profile.linkedin}
          />

          <InfoItem
            label="Portfolio"
            value={profile.portfolio}
          />

          <InfoItem
            label="LeetCode"
            value={profile.leetcode}
          />

          <InfoItem
            label="GeeksforGeeks"
            value={profile.geeksforgeeks}
          />

          <InfoItem
            label="HackerRank"
            value={profile.hackerrank}
          />

        </div>

      </ProfileSection>

      {/* Career */}

      <ProfileSection title="Career Preferences">

        <div className="grid gap-6 md:grid-cols-2">

          <InfoItem
            label="Work Mode"
            value={profile.workMode}
          />

          <InfoItem
            label="Expected Stipend"
            value={
              profile.expectedStipend
                ? `₹ ${profile.expectedStipend}`
                : ""
            }
          />

        </div>

      </ProfileSection>

    </div>
  );
};

export default Profile;