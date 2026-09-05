import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const EditProfile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getStudentProfile(user.id);

      if (res.profile) {
        setForm({
          ...form,
          ...res.profile,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      setSaving(true);

      await saveStudentProfile(user.id, form);

      alert("Profile Updated Successfully");

      navigate("/student/profile");
    } catch (err) {
      console.log(err);

      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Edit Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Complete your SkilVira profile.
          </p>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-[#D4AF37] px-8 py-3 font-semibold text-white"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>

      </div>

      <ProfileForm
        form={form}
        setForm={setForm}
      />

      <EducationForm
        form={form}
        setForm={setForm}
      />

      <SkillsForm
        form={form}
        setForm={setForm}
      />

      <ProjectsForm
        form={form}
        setForm={setForm}
      />

      <CertificatesForm
        form={form}
        setForm={setForm}
      />

      <SocialLinksForm
        form={form}
        setForm={setForm}
      />

      <CareerForm
        form={form}
        setForm={setForm}
      />

    </div>
  );
};

export default EditProfile;