import { useState } from "react";
import { FiAward, FiSearch } from "react-icons/fi";

const CertificateVerification = () => {
  const [certificateId, setCertificateId] = useState("");

  const handleVerify = () => {
    if (!certificateId.trim()) {
      alert("Please enter a Certificate ID.");
      return;
    }

    // Future API Call
    console.log("Verify:", certificateId);
  };

  return (
    <section className="bg-slate-100 py-20">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-xl">

        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
            <FiAward
              size={40}
              className="text-[#D4AF37]"
            />
          </div>

          <h2 className="mt-6 text-4xl font-bold">
            Verify Certificate
          </h2>

          <p className="mt-4 text-gray-600">
            Verify any SkilVira certificate instantly using its unique
            Certificate ID.
          </p>

        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row">

          <input
            type="text"
            placeholder="Enter Certificate ID"
            value={certificateId}
            onChange={(e) =>
              setCertificateId(e.target.value)
            }
            className="flex-1 rounded-xl border p-4 outline-none focus:border-[#D4AF37]"
          />

          <button
            onClick={handleVerify}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-8 py-4 font-semibold text-white transition hover:opacity-90"
          >
            <FiSearch />
            Verify
          </button>

        </div>

        <div className="mt-10 rounded-2xl border border-dashed p-6 text-center text-gray-500">
          Certificate details will appear here after verification.
        </div>

      </div>
    </section>
  );
};

export default CertificateVerification;