import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiEye, FiEdit2, FiX, FiRefreshCw } from "react-icons/fi";
import api from "../../services/api";

const LimitedUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    try {
      setError("");
      const { data } = await api.get("/admin/users");
      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) =>
      [user.name, user.email, user.role, user.status]
        .some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [users, search]);

  const openUser = async (id) => {
    try {
      setError("");
      setMessage("");
      const { data } = await api.get(`/admin/users/${id}`);
      const user = data.user;

      setSelected(user);
      setName(user.name || "");
      setStatus(user.status || "active");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load user details.");
    }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    if (!selected) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const { data } = await api.patch(`/admin/users/${selected._id}`, {
        name: name.trim(),
        status,
      });

      setSelected(data.user);
      setUsers((previous) =>
        previous.map((user) =>
          user._id === data.user._id ? data.user : user
        )
      );
      setMessage("User details updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#A17D14]">ACCOUNT REVIEW</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            User Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review and update student, recruiter and ambassador accounts.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
        <FiSearch className="text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, role or status..."
          className="w-full bg-transparent py-4 text-sm outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Joined</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center">Loading users...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500">No users found.</td></tr>
            ) : filteredUsers.map((user) => (
              <tr key={user._id} className="border-t border-slate-100">
                <td className="px-5 py-4">
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                </td>
                <td className="px-5 py-4 capitalize">{user.role}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    user.status === "blocked"
                      ? "bg-red-50 text-red-600"
                      : "bg-emerald-50 text-emerald-700"
                  }`}>
                    {user.status || "active"}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => openUser(user._id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-semibold hover:bg-slate-50"
                  >
                    <FiEye /> Review / Edit <FiEdit2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Review User</h2>
                <p className="text-xs text-slate-500">Limited account editing</p>
              </div>
              <button
                onClick={() => { setSelected(null); setMessage(""); }}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mb-5 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Role:</strong> <span className="capitalize">{selected.role}</span></p>
              <p><strong>User ID:</strong> {selected._id}</p>
            </div>

            {message && (
              <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            <form onSubmit={saveUser} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">Account Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3"
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <p className="text-xs leading-5 text-slate-500">
                Admin cannot change a user's role, email or password.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setSelected(null); setMessage(""); }}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LimitedUsers;
