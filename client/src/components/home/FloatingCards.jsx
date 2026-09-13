import {
  FiAward,
  FiBriefcase,
  FiBookOpen,
  FiCheckCircle,
  FiCode,
  FiTrendingUp,
} from "react-icons/fi";

import { motion } from "framer-motion";

const FloatingCards = () => {
  return (
    <div className="relative mx-auto h-[440px] w-[440px] sm:h-[500px] sm:w-[500px]">

      {/* =====================================================
          AMBIENT GLOW
      ===================================================== */}

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/15 blur-[80px]" />

      {/* =====================================================
          DECORATIVE ORBITS
      ===================================================== */}

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/15"
      />

      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 42,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/10 border-dashed"
      />

      {/* =====================================================
          ORBIT DOTS
      ===================================================== */}

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.65)]" />
      </motion.div>

      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 h-[410px] w-[410px] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute bottom-5 left-8 h-2.5 w-2.5 rounded-full bg-[#D4AF37]/80" />
      </motion.div>

      {/* =====================================================
          CENTER ROCKET
      ===================================================== */}

      <motion.div
        animate={{
          y: [0, -16, 0],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 z-20 flex h-52 w-52 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] via-[#E7C85A] to-[#F7E29A] shadow-[0_25px_70px_rgba(212,175,55,0.35)] sm:h-60 sm:w-60"
      >
        {/* Inner glass ring */}
        <div className="absolute inset-4 rounded-full border border-white/50" />

        <div className="absolute inset-8 rounded-full bg-white/10 backdrop-blur-sm" />

        <div className="relative text-center">
          <span className="block text-7xl drop-shadow-xl sm:text-8xl">
            🚀
          </span>

          <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.2em] text-black/55">
            Start your journey
          </span>
        </div>
      </motion.div>

      {/* =====================================================
          LEARNING CARD
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          x: -40,
        }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -12, 0],
        }}
        transition={{
          opacity: {
            duration: 0.8,
          },
          x: {
            duration: 0.8,
          },
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute left-0 top-7 z-30 w-52 -rotate-6 rounded-[26px] border border-white/70 bg-white/90 p-5 shadow-[0_22px_55px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:w-60 sm:p-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/12">
            <FiBookOpen
              className="text-[#B28F16]"
              size={22}
            />
          </div>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-emerald-600">
            Learn
          </span>
        </div>

        <h3 className="mt-4 text-base font-black text-slate-950 sm:text-xl">
          Skill Learning
        </h3>

        <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
          Industry-focused courses built for practical growth.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[78%] rounded-full bg-[#D4AF37]" />
          </div>

          <span className="text-[10px] font-black text-slate-400">
            78%
          </span>
        </div>
      </motion.div>

      {/* =====================================================
          CERTIFICATE CARD
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          x: 40,
        }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, 13, 0],
        }}
        transition={{
          opacity: {
            duration: 0.9,
            delay: 0.15,
          },
          x: {
            duration: 0.9,
            delay: 0.15,
          },
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute right-0 top-20 z-30 w-48 rotate-6 rounded-[26px] border border-white/70 bg-white/90 p-5 shadow-[0_22px_55px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:w-56 sm:p-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/12">
            <FiAward
              className="text-[#B28F16]"
              size={22}
            />
          </div>

          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
            <FiCheckCircle
              className="text-emerald-600"
              size={15}
            />
          </div>
        </div>

        <h3 className="mt-4 text-base font-black text-slate-950 sm:text-lg">
          Verified Certificate
        </h3>

        <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
          Secure credentials with easy verification.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950">
            <span className="text-[10px] font-black text-[#D4AF37]">
              QR
            </span>
          </div>

          <span className="text-[10px] font-bold text-slate-500">
            Quick verification
          </span>
        </div>
      </motion.div>

      {/* =====================================================
          CAREER CARD
      ===================================================== */}

      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-6 left-1/2 z-40 w-56 -translate-x-1/2 rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-[0_25px_65px_rgba(0,0,0,0.14)] backdrop-blur-xl sm:bottom-8 sm:w-64 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black">
            <FiBriefcase
              className="text-[#D4AF37]"
              size={23}
            />
          </div>

          <div>
            <p className="text-base font-black text-slate-950 sm:text-lg">
              Career Opportunities
            </p>

            <p className="mt-0.5 text-[10px] font-bold text-slate-400 sm:text-xs">
              Learn → Practice → Grow
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#FAF8EF] px-3 py-3">
          <div className="flex items-center gap-2">
            <FiTrendingUp
              className="text-[#B28F16]"
              size={16}
            />

            <span className="text-[10px] font-black uppercase tracking-wide text-slate-600">
              Career Ready
            </span>
          </div>

          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.10)]" />
        </div>
      </motion.div>

      {/* =====================================================
          TOP MINI BADGE
      ===================================================== */}

      <motion.div
        animate={{
          y: [0, -7, 0],
        }}
        transition={{
          duration: 3.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-0 z-40 -translate-x-1/2 rounded-full border border-[#D4AF37]/20 bg-black px-4 py-2 shadow-xl"
      >
        <div className="flex items-center gap-2">
          <FiCode
            className="text-[#D4AF37]"
            size={13}
          />

          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white sm:text-[10px]">
            Skills + Experience
          </span>
        </div>
      </motion.div>

      {/* =====================================================
          SMALL SIDE DOTS
      ===================================================== */}

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.45, 0.8, 0.45],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
        }}
        className="absolute bottom-[38%] left-[-4px] h-3 w-3 rounded-full bg-[#D4AF37]"
      />

      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.75, 0.35],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 0.5,
        }}
        className="absolute right-[-3px] top-[46%] h-2.5 w-2.5 rounded-full bg-[#D4AF37]"
      />

    </div>
  );
};

export default FloatingCards;