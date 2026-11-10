const Hero3D = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
  >
    <div className="absolute left-[58%] top-1/2 aspect-square w-[min(78vw,560px)] -translate-x-1/2 -translate-y-1/2 opacity-60 lg:left-[65%] lg:opacity-80">
      <div className="absolute inset-[8%] rounded-full bg-[#D4AF37]/15 blur-[75px]" />

      <div className="absolute inset-[12%] rounded-full border border-[#D4AF37]/20 shadow-[inset_0_0_60px_rgba(212,175,55,0.08)]" />

      <div className="absolute inset-[23%] rotate-45 rounded-full border border-[#F4D77A]/30" />

      <div className="absolute inset-[32%] rounded-full border border-[#D4AF37]/20" />

      <div className="absolute left-1/2 top-1/2 h-[35%] w-[35%] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[28%] border border-[#F4D77A]/50 bg-gradient-to-br from-[#F4D77A]/50 via-[#D4AF37]/20 to-[#8D7414]/20 shadow-[0_0_65px_rgba(212,175,55,0.24)]" />

      <span className="absolute left-[18%] top-[28%] h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_18px_#D4AF37]" />
      <span className="absolute right-[16%] top-[37%] h-1.5 w-1.5 rounded-full bg-[#F4D77A] shadow-[0_0_16px_#F4D77A]" />
      <span className="absolute bottom-[19%] left-[34%] h-2 w-2 rounded-full bg-[#D4AF37]/80 shadow-[0_0_18px_#D4AF37]" />
      <span className="absolute bottom-[30%] right-[22%] h-1.5 w-1.5 rounded-full bg-[#F4D77A] shadow-[0_0_16px_#F4D77A]" />
    </div>

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_48%,rgba(212,175,55,0.10),transparent_24%),radial-gradient(circle_at_80%_30%,rgba(212,175,55,0.06),transparent_22%)]" />
    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent lg:via-white/35" />
  </div>
);

export default Hero3D;
