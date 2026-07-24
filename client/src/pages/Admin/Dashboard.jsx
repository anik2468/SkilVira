import { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import { getDashboardStats } from "../../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    recruiters: 0,
    colleges: 0,
    admins: 0,
    internships: 0,
    applications: 0,
    certificates: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome to SkilVira Admin Panel
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Students"
          value={stats.students}
          color="text-blue-600"
        />

        <StatCard
          title="Recruiters"
          value={stats.recruiters}
          color="text-green-600"
        />

        <StatCard
          title="Colleges"
          value={stats.colleges}
          color="text-purple-600"
        />

        <StatCard
          title="Admins"
          value={stats.admins}
          color="text-red-600"
        />

        <StatCard
          title="Internships"
          value={stats.internships}
          color="text-yellow-600"
        />

        <StatCard
          title="Applications"
          value={stats.applications}
          color="text-pink-600"
        />

        <StatCard
          title="Certificates"
          value={stats.certificates}
          color="text-indigo-600"
        />

      </div>

    </div>
  );
};

export default Dashboard;