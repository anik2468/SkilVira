import { useEffect, useState } from "react";
import {
  FiUsers,
  FiUserPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

import api from "../../services/api";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    department: "",
  });

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/control/employees");

      setEmployees(
        Array.isArray(data?.employees)
          ? data.employees
          : []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const updateForm = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const createEmployee = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const { data } = await api.post(
        "/control/employees",
        form
      );

      setSuccess(
        data?.message || "Employee created successfully."
      );

      setForm({
        name: "",
        email: "",
        password: "",
        designation: "",
        department: "",
      });

      await loadEmployees();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to create employee."
      );
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (employee) => {
    const isPending = employee.status === "inactive";
    const nextStatus =
      isPending || employee.status === "blocked" ? "active" : "blocked";

    const actionLabel = isPending
      ? "Approve"
      : nextStatus === "blocked"
        ? "Block"
        : "Activate";

    const confirmed = window.confirm(
      `${actionLabel} ${employee.name}${
        isPending ? " and grant login access" : ""
      }?`
    );

    if (!confirmed) return;

    try {
      setActionId(String(employee._id));
      setError("");
      setSuccess("");

      const { data } = await api.patch(
        `/control/employees/${employee._id}/status`,
        { status: nextStatus }
      );

      setSuccess(data?.message || "Employee status updated.");

      await loadEmployees();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to change employee status."
      );
    } finally {
      setActionId("");
    }
  };

  const removeEmployee = async (employee) => {
    const confirmed = window.confirm(
      `Remove ${employee.name} from active employee access? Their audit history will be retained.`
    );

    if (!confirmed) return;

    try {
      setActionId(String(employee._id));
      setError("");
      setSuccess("");

      const { data } = await api.delete(
        `/control/employees/${employee._id}`
      );

      setSuccess(data?.message || "Employee removed.");

      await loadEmployees();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to remove employee."
      );
    } finally {
      setActionId("");
    }
  };

  const filtered = employees.filter((employee) => {
    const text = search.trim().toLowerCase();

    if (!text) return true;

    return [
      employee.name,
      employee.email,
      employee.profile?.designation,
      employee.profile?.department,
    ].some((value) =>
      String(value || "").toLowerCase().includes(text)
    );
  });

  return (
    <div className="space-y-6 pb-10">
      <section className="rounded-3xl bg-[#111111] p-7 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-[#D4AF37]">
              <FiUsers />
              CONTROL ACCESS
            </p>

            <h1 className="text-3xl font-black">
              Employee Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              Create staff accounts, manage access and review employee activity.
            </p>
          </div>

          <button
            type="button"
            onClick={loadEmployees}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-bold hover:bg-white/10 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <FiAlertCircle className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <FiCheckCircle className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Add Employee
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create an employee login and basic staff profile.
        </p>

        <form
          onSubmit={createEmployee}
          className="mt-5 grid gap-4 sm:grid-cols-2"
        >
          <Input
            label="Full name"
            name="name"
            value={form.name}
            onChange={updateForm}
            required
          />

          <Input
            label="Work email"
            name="email"
            type="email"
            value={form.email}
            onChange={updateForm}
            required
          />

          <Input
            label="Temporary password"
            name="password"
            type="password"
            value={form.password}
            onChange={updateForm}
            minLength={8}
            required
          />

          <Input
            label="Designation"
            name="designation"
            value={form.designation}
            onChange={updateForm}
          />

          <Input
            label="Department"
            name="department"
            value={form.department}
            onChange={updateForm}
          />

          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-[#c19c2e] disabled:opacity-60"
            >
              <FiUserPlus />
              {saving ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Employees
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {employees.length} employee account(s)
            </p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employees..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading employees...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No employees found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Employee</th>
                  <th className="px-5 py-4">Designation</th>
                  <th className="px-5 py-4">Last login</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((employee) => {
                  const busy = actionId === String(employee._id);
                  const pending = employee.status === "inactive";
                  const blocked = employee.status === "blocked";

                  return (
                    <tr key={employee._id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {employee.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {employee.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        <p>{employee.profile?.designation || "—"}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {employee.profile?.department || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {employee.lastLogin
                          ? new Date(employee.lastLogin).toLocaleString("en-IN")
                          : "Never"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            pending
                              ? "bg-amber-50 text-amber-700"
                              : blocked
                                ? "bg-red-50 text-red-700"
                                : "bg-green-50 text-green-700"
                          }`}
                        >
                          {pending
                            ? "Pending Approval"
                            : blocked
                              ? "Blocked"
                              : "Active"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => updateStatus(employee)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                          >
                            {blocked ? <FiUnlock /> : <FiLock />}
                            {pending ? "Approve" : blocked ? "Activate" : "Block"}
                          </button>

                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => removeEmployee(employee)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                          >
                            <FiTrash2 />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  minLength,
}) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-bold text-slate-600">
      {label}
    </span>

    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      minLength={minLength}
      autoComplete="off"
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37] focus:bg-white"
    />
  </label>
);

export default Employees;