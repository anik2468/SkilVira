import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  FileText,
  PlusCircle,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import { recruiterDashboard } from "../../services/recruiterService";

const Dashboard = () => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [loading, setLoading] =
    useState(true);

  const [dashboard, setDashboard] =
    useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res =
        await recruiterDashboard(user.id);

      setDashboard(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-2xl font-bold">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  const stats = [
    {
      title: "Internships",
      value:
        dashboard?.stats
          ?.totalInternships || 0,
      icon: Briefcase,
      color: "bg-blue-500",
    },

    {
      title: "Applications",
      value:
        dashboard?.stats
          ?.applications || 0,
      icon: FileText,
      color: "bg-green-500",
    },

    {
      title: "Shortlisted",
      value:
        dashboard?.stats
          ?.shortlisted || 0,
      icon: Users,
      color: "bg-yellow-500",
    },

    {
      title: "Selected",
      value:
        dashboard?.stats
          ?.selected || 0,
      icon: CheckCircle,
      color: "bg-purple-500",
    },

    {
      title: "Pending Approval",
      value:
        dashboard?.stats
          ?.pendingInternships || 0,
      icon: Clock,
      color: "bg-orange-500",
    },

    {
      title: "Rejected",
      value:
        dashboard?.stats
          ?.rejectedInternships || 0,
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Recruiter Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome back! Manage
            internships and applications.
          </p>

        </div>

        <Link
          to="/recruiter/internships/create"
          className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-white"
        >
          <PlusCircle size={20} />
          Post Internship
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {stats.map((item) => {

          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 shadow"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-4xl font-bold">
                    {item.value}
                  </h2>

                </div>

                <div
                  className={`${item.color} rounded-xl p-4 text-white`}
                >
                  <Icon size={28} />
                </div>

              </div>

            </div>
          );

        })}

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <Link
          to="/recruiter/company"
          className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg"
        >
          <Building2
            size={35}
            className="mb-4 text-[#D4AF37]"
          />

          <h2 className="text-2xl font-bold">
            Company Profile
          </h2>

          <p className="mt-2 text-gray-500">
            Update company information.
          </p>

        </Link>

        <Link
          to="/recruiter/internships"
          className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg"
        >
          <Briefcase
            size={35}
            className="mb-4 text-[#D4AF37]"
          />

          <h2 className="text-2xl font-bold">
            Manage Internships
          </h2>

          <p className="mt-2 text-gray-500">
            Edit, delete and monitor internships.
          </p>

        </Link>

        <Link
          to="/recruiter/applications"
          className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg"
        >
          <Users
            size={35}
            className="mb-4 text-[#D4AF37]"
          />

          <h2 className="text-2xl font-bold">
            Applications
          </h2>

          <p className="mt-2 text-gray-500">
            Review student applications.
          </p>

        </Link>

      </div>
            {/* Recent Applications */}
      <div className="rounded-2xl bg-white p-8 shadow">

        <h2 className="mb-6 text-2xl font-bold">
          Recent Applications
        </h2>

        {dashboard?.latestApplications?.length === 0 ? (

          <p className="text-gray-500">
            No applications received yet.
          </p>

        ) : (

          <div className="space-y-4">

            {dashboard?.latestApplications?.map((item) => (

              <div
                key={item._id}
                className="flex items-center justify-between rounded-xl border p-5 hover:bg-gray-50"
              >

                <div>

                  <h3 className="font-semibold">
                    {item.student?.name}
                  </h3>

                  <p className="text-gray-500">
                    {item.internship?.title}
                  </p>

                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold
                  ${
                    item.status === "Selected"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : item.status === "Shortlisted"
                      ? "bg-blue-100 text-blue-700"
                      : item.status === "Interview"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.status}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* My Internships */}
      <div className="rounded-2xl bg-white p-8 shadow">

        <h2 className="mb-6 text-2xl font-bold">
          Recent Internships
        </h2>

        {dashboard?.internships?.length === 0 ? (

          <p className="text-gray-500">
            No internships posted yet.
          </p>

        ) : (

          <div className="space-y-4">

            {dashboard?.internships?.slice(0, 5).map((item) => (

              <div
                key={item._id}
                className="flex items-center justify-between rounded-xl border p-5 hover:bg-gray-50"
              >

                <div>

                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-gray-500">
                    {item.company}
                  </p>

                </div>

                <div className="text-right">

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold
                    ${
                      item.approvalStatus === "Approved"
                        ? "bg-green-100 text-green-700"
                        : item.approvalStatus === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.approvalStatus}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Dashboard;