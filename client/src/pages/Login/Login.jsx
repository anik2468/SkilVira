import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useState } from "react";
import axios from "axios";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthBranding from "../../components/auth/AuthBranding";

import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
} from "react-icons/fi";

const GOLD = "#D4AF37";

const Login = () => {
  const { role } =
    useParams();

  const navigate =
    useNavigate();
  const requestedReturnTo = new URLSearchParams(window.location.search).get("returnTo");

  const roleName =
    role === "ambassador"
      ? "College Ambassador"
      : role === "control"
      ? "Admin"
      : role?.charAt(0).toUpperCase() +
        role?.slice(1);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));

    setError("");
  };

  const handleLoginSuccess = (
    user
  ) => {
    if (user?.role === "student") {
      const returnTo = new URLSearchParams(window.location.search).get("returnTo");
      if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
        navigate(returnTo);
        return;
      }
    }

    switch (user?.role) {
      case "student":
        navigate(
          "/student/dashboard"
        );
        break;

      case "recruiter":
        navigate(
          "/recruiter/dashboard"
        );
        break;

      case "ambassador":
        navigate(
          "/ambassador/dashboard"
        );
        break;

      case "employee":
        navigate(
          "/employee/dashboard"
        );
        break;

      case "control":
        navigate(
          "/control/dashboard"
        );
        break;

      default:
        navigate("/");
    }
  };

  const handleLogin = async (
    e
  ) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (!formData.password) {
      setError(
        "Please enter your password."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res =
        await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email:
              formData.email
                .trim()
                .toLowerCase(),
            password:
              formData.password,
          }
        );

      const user =
        res?.data?.user;

      const token =
        res?.data?.token;

      if (!user || !token) {
        throw new Error(
          "Invalid login response."
        );
      }

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "token",
        token
      );

      handleLoginSuccess(user);
    } catch (err) {
      console.error(
        "LOGIN ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    window.location.href =
      "http://localhost:5000/api/auth/google";
  };

  const linkedinLogin = () => {
    window.location.href =
      "http://localhost:5000/api/auth/linkedin";
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#FAFAF8]">
      <div className="flex min-h-screen">

        {/* =====================================================
            BRAND PANEL
        ===================================================== */}

        <div className="hidden lg:block lg:w-[48%]">
          <div className="sticky top-0 h-screen">
            <AuthBranding />
          </div>
        </div>

        {/* =====================================================
            LOGIN PANEL
        ===================================================== */}

        <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:w-[52%] lg:px-10">

          {/* Background glows */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[110px]" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#D4AF37]/7 blur-[100px]" />

          <div className="relative w-full max-w-xl">

            {/* Mobile brand marker */}
            <div className="mb-7 flex justify-center lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-white px-4 py-2 shadow-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D4AF37] text-xs font-black text-black">
                  S
                </span>

                <span className="text-sm font-black text-slate-900">
                  SkilVira
                </span>
              </div>
            </div>

            {/* Card */}
            <Card className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">

              {/* Top accent */}
              <div className="absolute left-8 right-8 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent" />

              {/* Header */}
              <div className="text-center">

                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-black shadow-lg"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiLock
                    size={23}
                  />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B14]">
                  Secure Sign In
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Welcome Back
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Sign in to continue to your{" "}
                  <span className="font-black text-[#B28F16]">
                    {roleName}
                  </span>{" "}
                  account.
                </p>
              </div>

              {/* Account role */}
              <div className="mt-7 flex items-center justify-between rounded-2xl border border-[#D4AF37]/15 bg-[#FCFBF5] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#B28F16]">
                    <FiShield
                      size={16}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Signing in as
                    </p>

                    <p className="mt-0.5 text-xs font-black text-slate-900">
                      {roleName}
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wide text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Secure
                </span>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
                  {error}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={
                  handleLogin
                }
                className="mt-6 space-y-5"
              >
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your email"
                />

                <div className="relative">
                  <Input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    label="Password"
                    name="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) =>
                          !prev
                      )
                    }
                    className="absolute right-3 top-[38px] flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff
                        size={17}
                      />
                    ) : (
                      <FiEye
                        size={17}
                      />
                    )}
                  </button>
                </div>

                {/* Forgot */}
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-black text-[#A07F13] transition hover:text-[#D4AF37] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2"
                  onClick={
                    handleLogin
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <FiArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Or continue with
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Social */}
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={
                    googleLogin
                  }
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:border-[#D4AF37]/30 hover:bg-[#FCFCF9] hover:shadow-sm"
                >
                  <span className="text-base">
                    G
                  </span>

                  Google
                </button>

                <button
                  type="button"
                  onClick={
                    linkedinLogin
                  }
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:border-[#D4AF37]/30 hover:bg-[#FCFCF9] hover:shadow-sm"
                >
                  <span className="text-base">
                    in
                  </span>

                  LinkedIn
                </button>
              </div>

              {/* Student registration */}
              {role ===
                "student" && (
                <div className="mt-7 rounded-2xl border border-slate-100 bg-[#FAFAF8] p-4 text-center">
                  <p className="text-sm text-slate-500">
                    Don't have an account?
                    <Link
                      to={
                        requestedReturnTo &&
                        requestedReturnTo.startsWith("/") &&
                        !requestedReturnTo.startsWith("//")
                          ? `/register/student?returnTo=${encodeURIComponent(requestedReturnTo)}`
                          : "/register/student"
                      }
                      className="ml-2 font-black text-[#A07F13] hover:text-[#D4AF37] hover:underline"
                    >
                      Create account
                    </Link>
                  </p>
                </div>
              )}

              {/* Security footer */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
                <FiCheckCircle
                  className="text-emerald-500"
                  size={13}
                />

                Your account credentials are protected.
              </div>

            </Card>

            {/* Bottom brand */}
            <div className="mt-5 text-center">
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                SkilVira • Learn • Build • Grow
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;