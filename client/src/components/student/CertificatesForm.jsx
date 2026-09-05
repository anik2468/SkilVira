const CertificatesForm = ({ form, setForm }) => {

  const addCertificate = () => {
    setForm({
      ...form,
      certificates: [
        ...form.certificates,
        {
          name: "",
          issuer: "",
          credentialUrl: "",
        },
      ],
    });
  };

  const updateCertificate = (i, field, value) => {
    const updated = [...form.certificates];

    updated[i][field] = value;

    setForm({
      ...form,
      certificates: updated,
    });
  };

  const removeCertificate = (i) => {
    setForm({
      ...form,
      certificates: form.certificates.filter(
        (_, index) => index !== i
      ),
    });
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Certificates
        </h2>

        <button
          onClick={addCertificate}
          className="rounded-xl bg-[#D4AF37] px-5 py-2 text-white"
        >
          Add Certificate
        </button>

      </div>

      {form.certificates.map((certificate,index)=>(

        <div
          key={index}
          className="mb-5 rounded-xl border p-5"
        >

          <input
            placeholder="Certificate Name"
            value={certificate.name}
            onChange={(e)=>
              updateCertificate(index,"name",e.target.value)
            }
            className="mb-3 w-full rounded-xl border p-3"
          />

          <input
            placeholder="Issuer"
            value={certificate.issuer}
            onChange={(e)=>
              updateCertificate(index,"issuer",e.target.value)
            }
            className="mb-3 w-full rounded-xl border p-3"
          />

          <input
            placeholder="Credential URL"
            value={certificate.credentialUrl}
            onChange={(e)=>
              updateCertificate(index,"credentialUrl",e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />

          <button
            onClick={()=>removeCertificate(index)}
            className="mt-4 text-red-500"
          >
            Remove
          </button>

        </div>

      ))}

    </div>
  );
};

export default CertificatesForm;