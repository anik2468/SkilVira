import { useEffect, useState } from "react";
import { getAllApplications } from "../../services/applicationService";

const Applications = () => {
  const [applications, setApplications] =
    useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res =
      await getAllApplications();

    setApplications(
      res.applications || []
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <h1 className="mb-6 text-3xl font-bold">
        Applications
      </h1>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="p-3 text-left">
              Student
            </th>

            <th>Internship</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {applications.map((app) => (

            <tr
              key={app._id}
              className="border-b"
            >

              <td className="p-3">
                {app.student?.name}
              </td>

              <td>
                {app.internship?.title}
              </td>

              <td>{app.status}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Applications;