import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthBranding from "../../components/auth/AuthBranding";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiKey,
  FiMail,
  FiShield,
} from "react-icons/fi";

const GOLD = "#D4AF37";

const ForgotPassword = () => {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!email.trim()) {
      setError(
        "Please enter your registered email address."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const { data } =
        await axios.post(
          "http://localhost:5000/api/auth/forgot-password",
          {
            email:
              email
                .trim()
                .toLowerCase(),
          }
        );

      const message =
        data?.message ||
        "Password reset link sent successfully.";

      setSuccess(message);
      setSubmitted(true);
    } catch (err) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again."
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
            MAIN PANEL
        ===================================================== */}

        <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:w-[52%] lg:px-10">

          {/* Background glow */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[110px]" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#D4AF37]/7 blur-[100px]" />

          <div className="relative w-full max-w-xl">

            {/* Mobile brand */}
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

              {/* Top gold accent */}
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

              {/* Header */}
              <div className="mt-7 text-center">
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black shadow-lg"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiKey
                    size={28}
                  />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B14]">
                  Account Recovery
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Forgot Password?
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                  Enter the email address connected to your SkilVira
                  account and we'll send instructions to reset your
                  password.
                </p>
              </div>

              {/* Success */}
              {success && (
                <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                      <FiCheckCircle
                        size={17}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-black text-emerald-800">
                        Reset request sent
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-700">
                        {success}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
                  {error}
                </div>
              )}

              {/* Form / submitted state */}
              {!submitted ? (
                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="mt-7 space-y-5"
                >
                  <Input
                    label="Registered Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="Enter your registered email"
                    required
                  />

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
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <FiArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="mt-7 space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(
                        false
                      );
                      setSuccess("");
                    }}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:border-[#D4AF37]/30 hover:bg-[#FCFBF5]"
                  >
                    Try another email
                  </button>

                  <Link
                    to="/login/student"
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-5 py-3.5 text-sm font-black text-black transition hover:bg-[#E1C14E]"
                  >
                    Return to Login
                    <FiArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              )}

              {/* Security note */}
              <div className="mt-8 rounded-2xl border border-slate-100 bg-[#FAFAF8] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#B28F16]">
                    <FiShield
                      size={16}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-black text-slate-900">
                      Keep your account secure
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-400">
                      Use a strong password and never share your reset
                      link or account credentials with anyone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Login footer */}
              <div className="mt-7 text-center">
                <p className="text-sm text-slate-500">
                  Remember your password?
                  <Link
                    to="/login/student"
                    className="ml-2 font-black text-[#9A7B14] hover:text-[#D4AF37] hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </div>

            </Card>

            <div className="mt-5 text-center">
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">
                <FiMail
                  size={11}
                  className="text-[#D4AF37]"
                />
                SkilVira • Secure Account Recovery
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;