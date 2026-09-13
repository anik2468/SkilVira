import {
  FiAward,
  FiPlus,
  FiTrash2,
  FiExternalLink,
} from "react-icons/fi";


const CertificatesForm = ({
  form,
  setForm,
}) => {
  const certificates =
    Array.isArray(
      form?.certificates
    )
      ? form.certificates
      : [];


  // ======================================
  // Add Certificate
  // ======================================

  const addCertificate = () => {
    setForm((previous) => ({
      ...previous,

      certificates: [
        ...(Array.isArray(
          previous?.certificates
        )
          ? previous.certificates
          : []),

        {
          name: "",
          issuer: "",
          credentialUrl: "",
        },
      ],
    }));
  };


  // ======================================
  // Update Certificate
  // ======================================

  const updateCertificate = (
    index,
    field,
    value
  ) => {
    setForm((previous) => {
      const current =
        Array.isArray(
          previous?.certificates
        )
          ? previous.certificates
          : [];

      const updated =
        current.map(
          (certificate, itemIndex) =>
            itemIndex === index
              ? {
                  ...certificate,
                  [field]: value,
                }
              : certificate
        );

      return {
        ...previous,
        certificates:
          updated,
      };
    });
  };


  // ======================================
  // Remove Certificate
  // ======================================

  const removeCertificate = (
    index
  ) => {
    setForm((previous) => ({
      ...previous,

      certificates: (
        Array.isArray(
          previous?.certificates
        )
          ? previous.certificates
          : []
      ).filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));
  };


  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <FiAward />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Certificates
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add certifications you have earned outside
              the SkilVira platform.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={addCertificate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#b99520]"
        >
          <FiPlus />
          Add Certificate
        </button>
      </div>


      {/* Certificate List */}
      {certificates.length > 0 ? (
        <div className="mt-6 space-y-5">
          {certificates.map(
            (
              certificate,
              index
            ) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-sm font-bold text-[#8B6E12]">
                      {index + 1}
                    </span>

                    <span className="text-sm font-bold text-gray-800">
                      Certificate {index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeCertificate(
                        index
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    <FiTrash2 />
                    Remove
                  </button>
                </div>


                <div className="grid gap-5 md:grid-cols-2">
                  {/* Name */}
                  <FormField
                    label="Certificate Name"
                    value={
                      certificate?.name
                    }
                    onChange={(event) =>
                      updateCertificate(
                        index,
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="e.g. AWS Cloud Practitioner"
                  />


                  {/* Issuer */}
                  <FormField
                    label="Issuer"
                    value={
                      certificate?.issuer
                    }
                    onChange={(event) =>
                      updateCertificate(
                        index,
                        "issuer",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Amazon Web Services"
                  />


                  {/* Credential URL */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Credential URL
                    </label>

                    <div className="relative">
                      <FiExternalLink
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="url"
                        value={
                          certificate?.credentialUrl ||
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateCertificate(
                            index,
                            "credentialUrl",
                            event.target
                              .value
                          )
                        }
                        placeholder="https://..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
                      />
                    </div>
                  </div>
                </div>


                {/* Preview link */}
                {certificate?.credentialUrl && (
                  <div className="mt-4">
                    <a
                      href={
                        certificate.credentialUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B6E12] hover:underline"
                    >
                      <FiExternalLink />
                      Open Credential
                    </a>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <FiAward
            size={34}
            className="mx-auto text-gray-300"
          />

          <p className="mt-3 text-sm font-semibold text-gray-600">
            No certificates added yet
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Add your external certifications using the
            button above.
          </p>
        </div>
      )}
    </section>
  );
};


// =====================================================
// FORM FIELD
// =====================================================

const FormField = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <input
        type="text"
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
      />
    </div>
  );
};


export default CertificatesForm;