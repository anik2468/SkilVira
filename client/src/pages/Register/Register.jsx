import { isStrongPassword, PASSWORD_REQUIREMENT_MESSAGE } from "../../utils/passwordPolicy.js";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthBranding from "../../components/auth/AuthBranding";

const Register = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const [searchParams] = useSearchParams();

  // =========================================
  // ROLE
  // =========================================

  const allowedRoles = [
    "student",
    "recruiter",
    "ambassador",
    "employee",
  ];

  const currentRole = allowedRoles.includes(role)
    ? role
    : "student";

  // =========================================
  // REFERRAL CODE
  // =========================================
  //
  // Priority:
  // 1. ?ref=CODE from URL
  // 2. previously saved session referral
  //
  // Referral is only applicable to students.
  // =========================================

  const urlReferralCode = (
    searchParams.get("ref") || ""
  )
    .trim()
    .toUpperCase();

  const [savedReferralCode, setSavedReferralCode] =
    useState(() => {
      try {
        return (
          sessionStorage.getItem(
            "skilvira_referral_code"
          ) || ""
        );
      } catch {
        return "";
      }
    });

  const referralCode = useMemo(() => {
    if (urlReferralCode) {
      return urlReferralCode;
    }

    return savedReferralCode;
  }, [
    urlReferralCode,
    savedReferralCode,
  ]);

  // =========================================
  // SAVE REFERRAL CODE
  // =========================================

  useEffect(() => {
    if (!urlReferralCode) {
      return;
    }

    try {
      sessionStorage.setItem(
        "skilvira_referral_code",
        urlReferralCode
      );

      setSavedReferralCode(
        urlReferralCode
      );
    } catch (error) {
      console.warn(
        "Unable to save referral code:",
        error
      );
    }
  }, [urlReferralCode]);

  // =========================================
  // FORM
  // =========================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    designation: "",
    department: "",
    companyName: "",
    website: "",
    industry: "",
    college: "",
    university: "",
    course: "",
    branch: "",
    semester: "",
    graduationYear: "",
    city: "",
    state: "",
  });

  const [loading, setLoading] =
    useState(false);

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // ROLE NAME
  // =========================================

  const getRoleName = () => {
    const names = {
      student: "Student",
      recruiter: "Recruiter",
      ambassador: "College Ambassador",
      employee: "Employee",
    };

    return (
      names[currentRole] ||
      "Student"
    );
  };

  // =========================================
  // REGISTER
  // =========================================

  const handleRegister = async () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return alert(
        "Please fill all fields."
      );
    }

    const requiredByRole = {
      recruiter: ["companyName", "designation", "phone"],
      employee: ["designation", "department", "phone"],
      ambassador: ["college", "course", "branch", "semester", "phone"],
    };

    const missingRoleFields = (requiredByRole[currentRole] || []).some(
      (field) => !String(formData[field] || "").trim()
    );

    if (missingRoleFields) {
      return alert("Please complete all required role-specific fields.");
    }

    if (!isStrongPassword(formData.password)) {
      return alert(PASSWORD_REQUIREMENT_MESSAGE);
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      return alert(
        "Passwords do not match."
      );
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),

        email: formData.email
          .trim()
          .toLowerCase(),

        password:
          formData.password,

        role: currentRole,

        phone: formData.phone.trim(),
        designation: formData.designation.trim(),
        department: formData.department.trim(),
        companyName: formData.companyName.trim(),
        website: formData.website.trim(),
        industry: formData.industry.trim(),
        college: formData.college.trim(),
        university: formData.university.trim(),
        course: formData.course.trim(),
        branch: formData.branch.trim(),
        semester: formData.semester.trim(),
        graduationYear: formData.graduationYear.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),

        // =====================================
        // REFERRAL
        // Only students receive referral code.
        // =====================================

        referralCode:
          currentRole === "student" &&
          referralCode
            ? referralCode
            : null,
      };

      const response = await api.post("/auth/register", payload);

      console.log(
        "REGISTER RESPONSE:",
        response?.data
      );

      // =====================================
      // Referral successfully consumed
      // =====================================

      if (
        currentRole === "student" &&
        referralCode
      ) {
        try {
          sessionStorage.removeItem(
            "skilvira_referral_code"
          );

          setSavedReferralCode("");
        } catch (storageError) {
          console.warn(
            "Unable to clear referral storage:",
            storageError
          );
        }
      }

      alert(
        ["recruiter", "ambassador", "employee"].includes(currentRole)
          ? currentRole === "employee"
            ? "Application submitted. An admin must approve your account before login."
            : "Registration successful. Wait for approval."
          : "Registration successful."
      );

      const returnTo = searchParams.get("returnTo");
      navigate(
        `/login/${currentRole}${
          returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""
        }`
      );
    } catch (err) {
      console.error(
        "REGISTER ERROR:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // REFERRAL DISPLAY
  // =========================================

  const referralApplied =
    currentRole === "student" &&
    Boolean(referralCode);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <div className="auth-branding-compact"><AuthBranding /></div>

      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#111827]">
              {getRoleName()} Registration
            </h1>

            <p className="mt-3 text-gray-500">
              Create your {getRoleName()} Account
            </p>

            {/* =================================
                REFERRAL APPLIED
            ================================= */}

            {referralApplied && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white">
                    ✓
                  </span>

                  <p className="text-sm font-black text-emerald-800">
                    Ambassador Referral Applied
                  </p>
                </div>

                <p className="mt-2 text-xs text-emerald-700">
                  You are registering through ambassador
                  referral code:
                </p>

                <p className="mt-1 break-all text-lg font-black tracking-wider text-[#8D7414]">
                  {referralCode}
                </p>

                <p className="mt-2 text-[11px] leading-5 text-emerald-700">
                  This code has been automatically captured
                  from your referral link.
                </p>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="space-y-5">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 chars, uppercase first, special character"
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />

            {currentRole === "recruiter" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Company Name" name="companyName"
                  value={formData.companyName} onChange={handleChange}
                  placeholder="Company name" required />
                <Input label="Your Designation" name="designation"
                  value={formData.designation} onChange={handleChange}
                  placeholder="HR / Recruiter" required />
                <Input label="Contact Phone" name="phone" type="tel"
                  value={formData.phone} onChange={handleChange}
                  placeholder="Phone number" required />
                <Input label="Company Website" name="website"
                  value={formData.website} onChange={handleChange}
                  placeholder="https://example.com" />
                <Input label="Industry" name="industry"
                  value={formData.industry} onChange={handleChange}
                  placeholder="Industry" />
                <Input label="City" name="city"
                  value={formData.city} onChange={handleChange}
                  placeholder="Company city" />
                <Input label="State" name="state"
                  value={formData.state} onChange={handleChange}
                  placeholder="Company state" />
              </div>
            )}

            {currentRole === "employee" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Phone Number" name="phone" type="tel"
                  value={formData.phone} onChange={handleChange}
                  placeholder="Phone number" required />
                <Input label="Designation" name="designation"
                  value={formData.designation} onChange={handleChange}
                  placeholder="Your designation" required />
                <Input label="Department" name="department"
                  value={formData.department} onChange={handleChange}
                  placeholder="Department" required />
              </div>
            )}

            {currentRole === "ambassador" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="College Name" name="college"
                  value={formData.college} onChange={handleChange}
                  placeholder="College name" required />
                <Input label="University" name="university"
                  value={formData.university} onChange={handleChange}
                  placeholder="University name" />
                <Input label="Phone Number" name="phone" type="tel"
                  value={formData.phone} onChange={handleChange}
                  placeholder="Phone number" required />
                <Input label="Course / Degree" name="course"
                  value={formData.course} onChange={handleChange}
                  placeholder="B.Tech, BCA, etc." required />
                <Input label="Branch" name="branch"
                  value={formData.branch} onChange={handleChange}
                  placeholder="CSE, ECE, etc." required />
                <Input label="Current Semester / Year" name="semester"
                  value={formData.semester} onChange={handleChange}
                  placeholder="e.g. 3rd semester" required />
                <Input label="Graduation Year" name="graduationYear"
                  value={formData.graduationYear} onChange={handleChange}
                  placeholder="e.g. 2028" />
                <Input label="City" name="city"
                  value={formData.city} onChange={handleChange}
                  placeholder="City" />
                <Input label="State" name="state"
                  value={formData.state} onChange={handleChange}
                  placeholder="State" />
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : `Create ${getRoleName()} Account`}
            </Button>
          </div>

          {/* Login */}
          <p className="mt-8 text-center text-gray-500">
            Already have an account?

            <Link
              to={`/login/${currentRole}`}
              className="ml-2 font-semibold text-[#D4AF37] hover:underline"
            >
              Login
            </Link>
          </p>

          {/* Other Registration Roles */}
          <div className="mt-6 flex flex-col gap-2 text-center">
            {currentRole !==
              "student" && (
              <Link
                to="/register/student"
                className="text-sm text-blue-600 hover:underline"
              >
                Register as Student
              </Link>
            )}

            {currentRole !==
              "recruiter" && (
              <Link
                to="/register/recruiter"
                className="text-sm text-blue-600 hover:underline"
              >
                Register as Recruiter
              </Link>
            )}

            {currentRole !==
              "ambassador" && (
              <Link
                to="/register/ambassador"
                className="text-sm text-blue-600 hover:underline"
              >
                Register as College Ambassador
              </Link>
            )}

            {currentRole !==
              "employee" && (
              <Link
                to="/register/employee"
                className="text-sm text-blue-600 hover:underline"
              >
                Register as Employee
              </Link>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;