import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiSearch,
  FiShield,
} from "react-icons/fi";

const CertificateVerification = () => {
  const [certificateId, setCertificateId] =
    useState("");

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  const handleVerify = (e) => {
    e?.preventDefault();

    const id =
      certificateId.trim();

    if (!id) {
      setError(
        "Please enter a Certificate ID."
      );
      return;
    }

    setError("");

    navigate(
      `/verify-certificate/${encodeURIComponent(
        id
      )}`
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#FBFBF8] py-20 sm:py-24">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/8 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            MAIN CARD
        ===================================================== */}

        <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_25px_75px_rgba(15,23,42,0.08)]">

          {/* Top gold line */}
          <div className="absolute left-8 right-8 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent" />

          <div className="grid lg:grid-cols-[1fr_0.85fr]">

            {/* =================================================
                LEFT
            ================================================= */}

            <div className="p-7 sm:p-10 lg:p-12">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2">
                <FiShield
                  size={13}
                  className="text-[#B28F16]"
                />

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B14]">
                  Credential Verification
                </span>
              </div>

              {/* Icon */}
              <div className="mt-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B28F16]">
                <FiAward size={28} />
              </div>

              {/* Heading */}
              <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Verify a{" "}
                <span className="text-[#D4AF37]">
                  Certificate
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Check the authenticity of a SkilVira credential using its
                unique Certificate ID.
              </p>

              {/* Form */}
              <form
                onSubmit={
                  handleVerify
                }
                className="mt-8"
              >
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                  Certificate ID
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">

                  <div className="group flex min-h-[58px] flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-[#FAFAF8] px-4 transition focus-within:border-[#D4AF37]/50 focus-within:bg-white">
                    <FiSearch
                      size={19}
                      className="shrink-0 text-slate-400 transition group-focus-within:text-[#B28F16]"
                    />

                    <input
                      type="text"
                      value={
                        certificateId
                      }
                      onChange={(e) => {
                        setCertificateId(
                          e.target.value
                        );
                        setError("");
                      }}
                      placeholder="Enter Certificate ID"
                      className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                      autoComplete="off"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 text-sm font-black text-black shadow-[0_12px_30px_rgba(212,175,55,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E1C14E] hover:shadow-[0_18px_40px_rgba(212,175,55,0.28)] sm:px-7"
                  >
                    <FiSearch size={16} />

                    Verify

                    <FiArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>

                </div>

                {error && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                    {error}
                  </div>
                )}
              </form>

              {/* Trust points */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <TrustPoint
                  icon={
                    <FiCheckCircle />
                  }
                  title="Unique Credential ID"
                  text="Every certificate can be checked individually."
                />

                <TrustPoint
                  icon={
                    <FiShield />
                  }
                  title="Easy Verification"
                  text="Use the credential ID to check certificate details."
                />
              </div>
            </div>

            {/* =================================================
                RIGHT VISUAL
            ================================================= */}

            <div className="relative overflow-hidden bg-black p-7 sm:p-10 lg:p-12">

              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-[90px]" />

              <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-[90px]" />

              <div className="relative flex h-full min-h-[360px] flex-col justify-center">

                {/* Certificate mockup */}
                <div className="relative mx-auto w-full max-w-sm rounded-[26px] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">

                  <div className="rounded-[20px] border border-white/10 bg-white p-5 text-slate-900">

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                          SKILVIRA
                        </p>

                        <h3 className="mt-3 text-lg font-black">
                          Certificate
                        </h3>

                        <p className="mt-1 text-[10px] font-medium text-slate-400">
                          Verified Digital Credential
                        </p>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/15 text-[#B28F16]">
                        <FiAward
                          size={20}
                        />
                      </div>
                    </div>

                    <div className="my-6 h-px bg-slate-100" />

                    <div className="space-y-3">
                      <div className="h-2 w-24 rounded-full bg-slate-100" />
                      <div className="h-2 w-36 rounded-full bg-slate-100" />
                      <div className="h-2 w-28 rounded-full bg-[#D4AF37]/20" />
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wide text-slate-300">
                          Credential status
                        </p>

                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />

                          <span className="text-[10px] font-black text-emerald-600">
                            Verifiable
                          </span>
                        </div>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                        <span className="text-[8px] font-black text-slate-400">
                          QR
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verification badge */}
                  <div className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#D4AF37] px-4 py-3 text-black shadow-xl">
                    <FiCheckCircle
                      size={17}
                    />

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wide">
                        Credential
                      </p>

                      <p className="text-xs font-black">
                        Verification Ready
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mx-auto mt-8 text-center">
                  <p className="text-sm font-black text-white">
                    Trust starts with verification.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    Enter your credential ID to continue.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom strip */}
          <div className="border-t border-slate-100 bg-[#FCFCF9] px-6 py-4 sm:px-8">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  SkilVira Credential Verification
                </span>
              </div>

              <p className="text-[10px] font-semibold text-slate-400">
                Verify before you trust.
              </p>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const TrustPoint = ({
  icon,
  title,
  text,
}) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#FCFCFA] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#B28F16]">
          {icon}
        </div>

        <div>
          <p className="text-xs font-black text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-[10px] leading-4 text-slate-400">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;