import { isStrongPassword, PASSWORD_REQUIREMENT_MESSAGE } from "../../utils/passwordPolicy.js";
import { API_URL } from "../../services/urlConfig.js";
import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthBranding from "../../components/auth/AuthBranding";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiKey,
  FiLock,
  FiShield,
} from "react-icons/fi";

const GOLD = "#D4AF37";

const ResetPassword = () => {
  const { token } =
    useParams();

  const navigate =
    useNavigate();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!token) {
      setError(
        "Invalid or missing password reset token."
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter a new password."
      );
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setError(
        "Please confirm your new password."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } =
        await axios.post(
          `${API_URL}/auth/reset-password/${token}`,
          {
            password,
          }
        );

      console.log(
        "RESET PASSWORD RESPONSE:",
        data
      );

      setSuccess(true);

      setTimeout(() => {
        navigate(
          "/login/student"
        );
      }, 1800);
    } catch (err) {
      console.error(
        "RESET PASSWORD ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Reset password failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
            RESET PANEL
        ===================================================== */}

        <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:w-[52%] lg:px-10">

          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[110px]" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#D4AF37]/7 blur-[100px]" />

          <div className="relative w-full max-w-xl">

            {/* Mobile Brand */}
            <div className="mb-7 flex justify-center lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-white px-4 py-2 shadow-sm">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-black"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  S
                </span>

                <span className="text-sm font-black text-slate-900">
                  SkilVira
                </span>
              </div>
            </div>

            <Card className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">

              {/* Top accent */}
              <div className="absolute left-8 right-8 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent" />

              {/* Back */}
              <Link
                to="/login/student"
                className="inline-flex items-center gap-2 text-xs font-black text-slate-400 transition hover:text-[#9A7B14]"
              >
                <FiArrowLeft
                  size={14}
                />
                Back to Login
              </Link>

              {!success ? (
                <>
                  {/* Header */}
                  <div className="mt-7 text-center">
                    <div
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black shadow-lg"
                      style={{
                        backgroundColor:
                          GOLD,
                      }}
                    >
                      <FiKey size={28} />
                    </div>

                    <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B14]">
                      Account Recovery
                    </p>

                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                      Create New Password
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                      Choose a strong new password for your SkilVira
                      account.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
                      {error}
                    </div>
                  )}

                  {/* Form */}
                  <form
                    onSubmit={
                      handleSubmit
                    }
                    className="mt-7 space-y-5"
                  >
                    <div className="relative">
                      <Input
                        label="New Password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        value={
                          password
                        }
                        onChange={(e) => {
                          setPassword(
                            e.target.value
                          );
                          setError("");
                        }}
                        placeholder="Enter new password"
                        required
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

                    {/* Password hint */}
                    <div className="rounded-2xl border border-slate-100 bg-[#FAFAF8] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FiShield
                          className="text-[#B28F16]"
                          size={15}
                        />

                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                          Password requirement
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        Use at least 6 characters and choose a password
                        that is difficult for others to guess.
                      </p>
                    </div>

                    <div className="relative">
                      <Input
                        label="Confirm Password"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        value={
                          confirmPassword
                        }
                        onChange={(e) => {
                          setConfirmPassword(
                            e.target.value
                          );
                          setError("");
                        }}
                        placeholder="Confirm new password"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (prev) =>
                              !prev
                          )
                        }
                        className="absolute right-3 top-[38px] flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
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

                    {/* Match state */}
                    {confirmPassword &&
                      password ===
                        confirmPassword && (
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                          <FiCheckCircle
                            size={14}
                          />
                          Passwords match
                        </div>
                      )}

                    <Button
                      type="submit"
                      className="group flex w-full items-center justify-center gap-2"
                      disabled={
                        loading
                      }
                      onClick={
                        handleSubmit
                      }
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                          Updating...
                        </>
                      ) : (
                        <>
                          Update Password
                          <FiArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Security note */}
                  <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#D4AF37]/15 bg-[#FCFBF5] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#B28F16]">
                      <FiLock
                        size={16}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-black text-slate-900">
                        Secure password recovery
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-slate-400">
                        Your new password will replace the previous
                        password once the reset request is completed.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                /* Success */
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-emerald-500 text-white shadow-[0_18px_45px_rgba(16,185,129,0.22)]">
                    <FiCheckCircle
                      size={38}
                    />
                  </div>

                  <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                    Password Updated
                  </p>

                  <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                    You're All Set
                  </h1>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                    Your password has been updated successfully. Redirecting
                    you to the login page.
                  </p>

                  <div className="mx-auto mt-7 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full w-full origin-left rounded-full bg-emerald-500"
                      style={{
                        animation:
                          "shrink 1.8s linear forwards",
                      }}
                    />
                  </div>

                  <Link
                    to="/login/student"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#9A7B14] hover:text-[#D4AF37]"
                  >
                    Continue to Login
                    <FiArrowRight
                      size={15}
                    />
                  </Link>
                </div>
              )}

            </Card>

            <div className="mt-5 text-center">
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">
                <FiShield
                  size={11}
                  className="text-[#D4AF37]"
                />
                SkilVira • Secure Account Recovery
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;