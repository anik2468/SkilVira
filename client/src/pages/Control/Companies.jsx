import { useEffect, useState } from "react";
import api from "../../services/api";

const Companies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await api.get("/companies");
    setCompanies(data.companies || []);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <h1 className="mb-6 text-3xl font-bold">
        Companies
      </h1>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left p-3">
              Company
            </th>

            <th>Industry</th>

            <th>Email</th>

          </tr>

        </thead>

        <tbody>

          {companies.map((company) => (

            <tr
              key={company._id}
              className="border-b"
            >

              <td className="p-3">
                {company.companyName}
              </td>

              <td>
                {company.industry}
              </td>

              <td>
                {company.email}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Companies;