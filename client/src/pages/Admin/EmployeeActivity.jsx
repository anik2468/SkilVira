import { useEffect, useState } from "react";
import {
  FiActivity,
  FiRefreshCw,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

import api from "../../services/api";

const EmployeeActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        "/control/employee-activity",
        {
          params: { page: 1, limit: 100 },
        }
      );

      setActivities(
        Array.isArray(data?.activities)
          ? data.activities
          : []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load employee activity."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const filtered = activities.filter((entry) => {
    const text = search.trim().toLowerCase();

    if (!text) return true;

    const values = [
      entry.actor?.name,
      entry.actor?.email,
      entry.action,
      entry.path,
      entry.method,
      entry.ip,
    ];

    return values.some((value) =>
      String(value || "").toLowerCase().includes(text)
    );
  });

  return (
    <div className="space-y-6 pb-10">
      <section className="rounded-3xl bg-[#111111] p-7 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-[#D4AF37]">
              <FiActivity />
              AUDIT HISTORY
            </p>

            <h1 className="text-3xl font-black">
              Employee Activity
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              Review employee and administrator actions, including successful and failed requests.
              Failed requests are shown as well.
            </p>
          </div>

          <button
            type="button"
            onClick={loadActivities}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-bold hover:bg-white/10 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Activity records
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {activities.length} recent record(s)
            </p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employee or action..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading activity...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No activity records yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Time</th>
                  <th className="px-5 py-4">Employee</th>
                  <th className="px-5 py-4">Action</th>
                  <th className="px-5 py-4">HTTP status</th>
                  <th className="px-5 py-4">IP address</th>
                  <th className="px-5 py-4">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((entry) => (
                  <tr key={entry._id} className="align-top cursor-pointer hover:bg-slate-50/70" onClick={() => setSelectedActivity(entry)}>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">
                      {entry.createdAt
                        ? new Date(entry.createdAt).toLocaleString("en-IN")
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">
                        {entry.actor?.name || "Employee account"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {entry.actor?.email || "Email unavailable"}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase text-amber-700">
                        {entry.actorRole || entry.actor?.role || "unknown role"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {entry.action}
                      </p>
                      <p className="mt-1 break-all text-xs text-slate-400">
                        {entry.path}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          entry.success
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {entry.success ? (
                          <FiCheckCircle />
                        ) : (
                          <FiXCircle />
                        )}
                        {entry.statusCode || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-500">
                      {entry.ip || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <button type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedActivity(entry);
                        }}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-[#D4AF37]">
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedActivity(null);
          }}>
          <section role="dialog" aria-modal="true" aria-label="Activity details"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Audit detail</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">{selectedActivity.action}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedActivity.actor?.name || "Employee"} · {selectedActivity.createdAt
                    ? new Date(selectedActivity.createdAt).toLocaleString("en-IN") : "Time unavailable"}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedActivity(null)}
                className="rounded-lg border px-3 py-2 text-sm font-bold">Close</button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Record type / ID</p>
                <p className="mt-1 break-all text-sm font-semibold">{selectedActivity.entityType || "General action"}</p>
                <p className="break-all text-xs text-slate-500">{selectedActivity.entityId || "No record ID captured"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Result</p>
                <p className="mt-1 text-sm font-semibold">{selectedActivity.success ? "Success" : "Failed"} · HTTP {selectedActivity.statusCode || "—"}</p>
                <p className="break-all text-xs text-slate-500">{selectedActivity.method} {selectedActivity.path}</p>
              </div>
            </div>

            <h3 className="mt-5 font-bold text-slate-900">Submitted changes</h3>
            <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-green-100 whitespace-pre-wrap">{JSON.stringify(selectedActivity.details || {}, null, 2)}</pre>
            <p className="mt-3 text-xs text-slate-500">
              New records capture submitted field values. Historical rows may not have detailed fields, and before-values require additional per-feature audit hooks.
            </p>
          </section>
        </div>
      )}
    </div>
  );
};

export default EmployeeActivity;