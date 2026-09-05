import { useEffect, useState } from "react";
import api from "../../services/api";

const Certificates = () => {
  const [certificates, setCertificates] =
    useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await api.get("/certificates");
    setCertificates(data.certificates || []);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <h1 className="mb-6 text-3xl font-bold">
        Certificates
      </h1>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left p-3">
              Title
            </th>

            <th>Issuer</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {certificates.map((item) => (

            <tr
              key={item._id}
              className="border-b"
            >

              <td className="p-3">
                {item.title}
              </td>

              <td>{item.issuer}</td>

              <td>
                {item.verified
                  ? "Verified"
                  : "Pending"}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Certificates;