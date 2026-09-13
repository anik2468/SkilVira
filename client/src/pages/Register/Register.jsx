import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

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

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );

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
        currentRole === "recruiter" ||
          currentRole === "ambassador"
          ? "Registration successful. Wait for approval."
          : "Registration successful."
      );

      navigate(
        `/login/${currentRole}`
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
      <AuthBranding />

      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
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
              placeholder="Enter password"
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