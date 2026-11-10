
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiClock,
  FiRefreshCw,
  FiBriefcase,
  FiAward,
  FiBookOpen,
  FiFileText,
  FiVideo,
  FiActivity,
  FiCheckCircle,
  FiArrowRight,
  FiCalendar,
} from "react-icons/fi";
import api from "../../services/api";

const EMPTY_STATS = {
  students: 0,
  recruiters: 0,
  ambassadors: 0,
  courses: 0,
  pendingRecruiters: 0,
  pendingAmbassadors: 0,
  pendingInternships: 0,
  pendingApplications: 0,
  pendingCertificates: 0,
  internships: 0,
  approvedInternships: 0,
  applications: 0,
  shortlistedApplications: 0,
  selectedApplications: 0,
  certificates: 0,
  verifiedCertificates: 0,
  rejectedCertificates: 0,
  lessons: 0,
  liveClasses: 0,
  upcomingLiveClasses: 0,
  liveNow: 0,
  completedLiveClasses: 0,
};

const number = (value) => Number(value || 0).toLocaleString();

const StatCard = ({ label, value, icon, note }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <span className="rounded-xl bg-[#FFF8E7] p-3 text-[#9A7B14]">
        {icon}
      </span>
    </div>
    <p className="mt-4 text-3xl font-black text-slate-900">{number(value)}</p>
    {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
  </div>
);

const ActionCard = ({ label, value, icon, path, navigate }) => (
  <button
    type="button"
    onClick={() => navigate(path)}
    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#D4AF37] hover:shadow-md"
  >
    <div>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{number(value)}</p>
      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#987515]">
        Review now <FiArrowRight />
      </span>
    </div>
    <span className="rounded-xl bg-[#FFF8E7] p-3 text-xl text-[#9A7B14]">
      {icon}
    </span>
  </button>
);

const LimitedDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(EMPTY_STATS);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      setError("");
      const { data } = await api.get("/admin/dashboard");

      setStats({ ...EMPTY_STATS, ...(data?.stats || {}) });
      setRecentActivity(
        Array.isArray(data?.recentActivity) ? data.recentActivity : []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to load Admin dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const overview = [
    { label: "Total Students", value: stats.students, icon: <FiUsers /> },
    { label: "Total Recruiters", value: stats.recruiters, icon: <FiBriefcase /> },
    { label: "Total Ambassadors", value: stats.ambassadors, icon: <FiAward /> },
    { label: "Total Courses", value: stats.courses, icon: <FiBookOpen /> },
    { label: "Total Internships", value: stats.internships, icon: <FiFileText /> },
  ];

  const approvals = [
    { label: "Pending Recruiters", value: stats.pendingRecruiters, icon: <FiBriefcase />, path: "/admin/recruiters" },
    { label: "Pending Ambassadors", value: stats.pendingAmbassadors, icon: <FiAward />, path: "/admin/ambassadors" },
    { label: "Pending Internships", value: stats.pendingInternships, icon: <FiFileText />, path: "/admin/internships" },
    { label: "Pending Applications", value: stats.pendingApplications, icon: <FiUsers />, path: "/admin/applications" },
    { label: "Pending Certificates", value: stats.pendingCertificates, icon: <FiCheckCircle />, path: "/admin/certificates" },
  ];

  const operations = [
    { label: "Total Applications", value: stats.applications, note: `${number(stats.shortlistedApplications)} shortlisted · ${number(stats.selectedApplications)} selected`, icon: <FiUsers /> },
    { label: "Approved Internships", value: stats.approvedInternships, note: `Out of ${number(stats.internships)} total`, icon: <FiCheckCircle /> },
    { label: "Verified Certificates", value: stats.verifiedCertificates, note: `${number(stats.rejectedCertificates)} rejected`, icon: <FiAward /> },
    { label: "Total Lessons", value: stats.lessons, note: "Across platform courses", icon: <FiBookOpen /> },
    { label: "Total Live Classes", value: stats.liveClasses, note: `${number(stats.completedLiveClasses)} completed`, icon: <FiVideo /> },
    { label: "Live / Upcoming", value: stats.liveNow, note: `${number(stats.upcomingLiveClasses)} upcoming`, icon: <FiCalendar /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-wide text-[#A17D14]">
            SKILVIRA ADMIN
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Platform overview, pending work and recent activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Platform Overview</h2>
          <p className="text-sm text-slate-500">Registered users and platform content</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {overview.map((card) => (
            <StatCard key={card.label} {...card} value={loading ? "—" : card.value} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Pending Approvals</h2>
          <p className="text-sm text-slate-500">Items that need Admin review</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {approvals.map((card) => (
            <ActionCard
              key={card.label}
              {...card}
              value={loading ? "—" : card.value}
              navigate={navigate}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Operational Statistics</h2>
          <p className="text-sm text-slate-500">Applications, certificates, lessons and live classes</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {operations.map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={loading ? "—" : card.value}
              icon={card.icon}
              note={card.note}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FiActivity className="text-[#9A7B14]" />
          <div>
            <h2 className="text-lg font-black text-slate-900">Recent Activity</h2>
            <p className="text-sm text-slate-500">Latest recorded platform actions</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {loading ? (
            <p className="p-6 text-sm text-slate-500">Loading recent activity...</p>
          ) : recentActivity.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No recent activity recorded.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentActivity.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800">
                      {item.action || "Platform activity"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.actor?.name || item.actor?.email || "Platform user"}
                      {item.entityType ? ` · ${item.entityType}` : ""}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LimitedDashboard;
