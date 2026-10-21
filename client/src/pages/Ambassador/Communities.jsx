import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiGlobe,
  FiMapPin,
  FiCheckCircle,
  FiArchive,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../services/api";

const GOLD = "#D4AF37";

const Communities = () => {
  const [user, setUser] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setLoading(false);
        setError("Ambassador session not found.");
        return;
      }

      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("User parse error:", err);
      setLoading(false);
      setError("Unable to read ambassador session.");
    }
  }, []);

  useEffect(() => {
    if (user?.id || user?._id) {
      loadCommunities();
    }
  }, [user]);

  const getUserId = () => user?.id || user?._id || "";

  const getCollegeId = () =>
    user?.collegeId ||
    user?.college?._id ||
    user?.college ||
    user?.universityId ||
    "";

  const loadCommunities = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/communities");

      const data = response?.data;

      let list =
        data?.communities ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      if (!Array.isArray(list)) {
        list = [];
      }

      const collegeId = getCollegeId();

      // College ambassador ko sirf apne college ki communities
      // dikhane ka preferred frontend restriction.
      if (collegeId) {
        const filtered = list.filter((community) => {
          const communityCollegeId =
            community?.collegeId?._id ||
            community?.collegeId ||
            community?.college?._id ||
            community?.college ||
            community?.universityId?._id ||
            community?.universityId ||
            "";

          return (
            !communityCollegeId ||
            String(communityCollegeId) === String(collegeId)
          );
        });

        setCommunities(filtered);
      } else {
        setCommunities(list);
      }
    } catch (err) {
      console.error("Community load error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load communities."
      );

      setCommunities([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteCommunity = async (id) => {
    if (!id) return;

    const community = communities.find(
      (item) => item?._id === id
    );

    const confirmed = window.confirm(
      `Delete "${community?.name || "this community"}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await api.delete(`/communities/${id}`);

      setCommunities((prev) =>
        prev.filter((item) => item?._id !== id)
      );

      setSuccess("Community deleted successfully.");
    } catch (err) {
      console.error("Delete community error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete community."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const stats = useMemo(() => {
    const active = communities.filter(
      (item) =>
        String(item?.status || "active").toLowerCase() !==
        "archived"
    ).length;

    const archived = communities.filter(
      (item) =>
        String(item?.status || "").toLowerCase() ===
        "archived"
    ).length;

    const members = communities.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.memberCount ??
            item?.members?.length ??
            0
        ),
      0
    );

    return {
      total: communities.length,
      active,
      archived,
      members,
    };
  }, [communities]);

  const filteredCommunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return communities.filter((community) => {
      const name = String(
        community?.name || ""
      ).toLowerCase();

      const description = String(
        community?.description || ""
      ).toLowerCase();

      const location = String(
        community?.location || ""
      ).toLowerCase();

      const status = String(
        community?.status || "active"
      ).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        description.includes(query) ||
        location.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" &&
          status !== "archived") ||
        (statusFilter === "Archived" &&
          status === "archived");

      return matchesSearch && matchesStatus;
    });
  }, [
    communities,
    search,
    statusFilter,
  ]);

  if (loading) {
    return <CommunitiesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <section className="relative overflow-hidden rounded-[32px] bg-black px-6 py-7 text-white shadow-2xl sm:px-8 sm:py-9 lg:px-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D4AF37]/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <FiUsers size={14} style={{ color: GOLD }} />

                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
                  Ambassador Community Hub
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                My Communities
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                Create and manage your college community, grow your
                student network and keep your members connected.
              </p>

              {getCollegeId() && (
                <p className="mt-3 text-xs font-semibold text-gray-500">
                  Access scope: your linked college / campus
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => loadCommunities(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50"
              >
                <FiRefreshCw
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <Link
                to="/ambassador/communities/create"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black"
                style={{ backgroundColor: GOLD }}
              >
                <FiPlus />
                Create Community
              </Link>
            </div>
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Communities"
            value={stats.total}
            icon={<FiGlobe />}
            tone="gold"
          />

          <StatCard
            label="Active"
            value={stats.active}
            icon={<FiCheckCircle />}
            tone="green"
          />

          <StatCard
            label="Total Members"
            value={stats.members}
            icon={<FiUsers />}
            tone="blue"
          />

          <StatCard
            label="Archived"
            value={stats.archived}
            icon={<FiArchive />}
            tone="gray"
          />
        </div>

        <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-xl">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search communities..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div className="flex gap-2">
              {["All", "Active", "Archived"].map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setStatusFilter(item)}
                    className={`rounded-xl px-4 py-2.5 text-xs font-black ${
                      statusFilter === item
                        ? "text-black"
                        : "border border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                    style={
                      statusFilter === item
                        ? { backgroundColor: GOLD }
                        : undefined
                    }
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Campus Network
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Community Directory
              </h2>
            </div>

            <p className="text-sm font-semibold text-gray-500">
              {filteredCommunities.length} result
              {filteredCommunities.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filteredCommunities.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(search.trim()) ||
                statusFilter !== "All"
              }
              clear={() => {
                setSearch("");
                setStatusFilter("All");
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community?._id}
                  community={community}
                  deletingId={deletingId}
                  onDelete={deleteCommunity}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const CommunityCard = ({
  community,
  deletingId,
  onDelete,
}) => {
  const archived =
    String(community?.status || "active").toLowerCase() ===
    "archived";

  const members =
    community?.memberCount ??
    community?.members?.length ??
    0;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-[#FCFCFA] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
      <div className="relative h-36 bg-black">
        {community?.banner || community?.image ? (
          <img
            src={getAssetUrl(
              community.banner || community.image
            )}
            alt={community?.name || "Community"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-black"
              style={{ backgroundColor: GOLD }}
            >
              <FiUsers size={27} />
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
              archived
                ? "border-gray-300 bg-gray-100 text-gray-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {archived ? "Archived" : "Active"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="truncate text-lg font-black text-gray-950">
          {community?.name || "Unnamed Community"}
        </h3>

        <p className="mt-2 line-clamp-3 min-h-[66px] text-sm leading-6 text-gray-500">
          {community?.description ||
            "No description available."}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiUsers className="text-gray-400" />
            {members} members
          </div>

          {community?.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiMapPin className="text-gray-400" />
              {community.location}
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
          <Link
            to={`/ambassador/communities/${community?._id}`}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white px-2 py-2.5 text-xs font-black text-gray-700"
          >
            <FiEye />
            View
          </Link>

          <Link
            to={`/ambassador/communities/${community?._id}/edit`}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 px-2 py-2.5 text-xs font-black text-[#8D7414]"
          >
            <FiEdit2 />
            Edit
          </Link>

          <button
            type="button"
            disabled={deletingId === community?._id}
            onClick={() =>
              onDelete(community?._id)
            }
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50 px-2 py-2.5 text-xs font-black text-red-700 disabled:opacity-50"
          >
            <FiTrash2 />
            {deletingId === community?._id
              ? "..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  tone,
}) => {
  const tones = {
    gold: "bg-[#D4AF37]/10 text-[#8D7414]",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-gray-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({
  hasFilters,
  clear,
}) => (
  <div className="rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-14 text-center">
    <div
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
      style={{ backgroundColor: GOLD }}
    >
      <FiUsers size={28} />
    </div>

    <h3 className="mt-5 text-2xl font-black text-gray-950">
      {hasFilters
        ? "No Matching Communities"
        : "No Communities Yet"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {hasFilters
        ? "Try changing your search or status filter."
        : "Create your first college community to start building your student network."}
    </p>

    <div className="mt-5 flex justify-center gap-2">
      {hasFilters && (
        <button
          type="button"
          onClick={clear}
          className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700"
        >
          Clear Filters
        </button>
      )}

      <Link
        to="/ambassador/communities/create"
        className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-black"
        style={{ backgroundColor: GOLD }}
      >
        <FiPlus />
        Create Community
      </Link>
    </div>
  </div>
);

const CommunitiesSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      <div className="h-60 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="h-20 rounded-3xl bg-white" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-80 rounded-3xl bg-white"
          />
        ))}
      </div>
    </div>
  </div>
);

const getAssetUrl = (value) => {
  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `${API_ORIGIN}${value}`;
};

export default Communities;