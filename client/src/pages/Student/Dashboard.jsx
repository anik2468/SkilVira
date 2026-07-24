import { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiBookmark,
  FiAward,
  FiUser,
} from "react-icons/fi";

import { getDashboardStats } from "../../services/dashboardService";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats();
      setDashboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  const stats = dashboard?.stats || {};

  return (
    <div className="space-y-8">

      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-[#D4AF37] to-yellow-500 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-lg">
          Find internships and build your career with SkilVira.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow">
          <FiBriefcase className="mb-4 text-4xl text-[#D4AF37]" />
          <h3 className="text-3xl font-bold">
            {stats.applied || 0}
          </h3>
          <p className="text-gray-500">Applied</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <FiBookmark className="mb-4 text-4xl text-[#D4AF37]" />
          <h3 className="text-3xl font-bold">
            {stats.saved || 0}
          </h3>
          <p className="text-gray-500">Saved</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <FiAward className="mb-4 text-4xl text-[#D4AF37]" />
          <h3 className="text-3xl font-bold">
            {stats.certificates || 0}
          </h3>
          <p className="text-gray-500">Certificates</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <FiUser className="mb-4 text-4xl text-[#D4AF37]" />
          <h3 className="text-3xl font-bold">
            {stats.profileCompletion || 0}%
          </h3>
          <p className="text-gray-500">Profile Complete</p>
        </div>

      </div>

      {/* Latest Internships */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-6 text-2xl font-bold">
          Latest Internships
        </h2>

        {dashboard?.latestInternships?.length === 0 ? (
          <p className="text-gray-500">
            No internships available.
          </p>
        ) : (
          <div className="space-y-4">
            {dashboard?.latestInternships?.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-xl border p-5 hover:bg-gray-50"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-gray-500">
                    {item.company}
                  </p>
                </div>

                <div className="text-right">
                  <p>{item.mode}</p>

                  <p className="text-sm text-gray-500">
                    {item.stipend}
                  </p>
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