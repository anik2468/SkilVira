import { useEffect, useMemo, useState } from "react";
import { Search, Users, GraduationCap, BriefcaseBusiness, Globe2, RefreshCw } from "lucide-react";
import api from "../../services/api";

const GOLD = "#D4AF37";

const typeMeta = {
  student: {
    label: "Student",
    icon: GraduationCap,
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  professional: {
    label: "Professional",
    icon: BriefcaseBusiness,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  ambassador: {
    label: "Ambassador",
    icon: Users,
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

const getTypeMeta = (type) => {
  return (
    typeMeta[String(type || "").toLowerCase()] || {
      label: type || "General",
      icon: Globe2,
      badge: "bg-gray-100 text-gray-700 border-gray-200",
    }
  );
};

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [error, setError] = useState("");

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

      const list =
        data?.communities ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      setCommunities(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load communities:", err);

      setCommunities([]);

      setError(
        err?.response?.data?.message ||
          "Unable to load communities."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  const stats = useMemo(() => {
    return {
      total: communities.length,
      student: communities.filter(
        (item) =>
          String(item?.type || "").toLowerCase() === "student"
      ).length,
      professional: communities.filter(
        (item) =>
          String(item?.type || "").toLowerCase() === "professional"
      ).length,
      ambassador: communities.filter(
        (item) =>
          String(item?.type || "").toLowerCase() === "ambassador"
      ).length,
    };
  }, [communities]);

  const filteredCommunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return communities.filter((community) => {
      const type = String(
        community?.type || ""
      ).toLowerCase();

      const name = String(
        community?.name || ""
      ).toLowerCase();

      const description = String(
        community?.description || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        description.includes(query) ||
        type.includes(query);

      const matchesFilter =
        filter === "all" || type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [communities, search, filter]);

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl text-black"
                style={{ backgroundColor: GOLD }}
              >
                <Globe2 size={18} />
              </span>

              <span
                className="text-xs font-black uppercase tracking-[0.2em]"
                style={{ color: GOLD }}
              >
                Employee Control
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Community Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Manage student, ambassador and professional communities
              from one centralized workspace.
            </p>
          </div>

          <button
            onClick={() => loadCommunities(true)}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Communities"
            value={stats.total}
            icon={<Globe2 size={21} />}
            accent="gold"
          />

          <StatCard
            label="Student Communities"
            value={stats.student}
            icon={<GraduationCap size={21} />}
            accent="blue"
          />

          <StatCard
            label="Professional Communities"
            value={stats.professional}
            icon={<BriefcaseBusiness size={21} />}
            accent="green"
          />

          <StatCard
            label="Ambassador Communities"
            value={stats.ambassador}
            icon={<Users size={21} />}
            accent="purple"
          />
        </div>

        {/* Search / Filters */}
        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search communities..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-gray-800 outline-none transition focus:border-[#D4AF37] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All" },
                { value: "student", label: "Student" },
                { value: "professional", label: "Professional" },
                { value: "ambassador", label: "Ambassador" },
              ].map((item) => {
                const active = filter === item.value;

                return (
                  <button
                    key={item.value}
                    onClick={() => setFilter(item.value)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                      active
                        ? "text-black shadow-sm"
                        : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                    style={
                      active
                        ? { backgroundColor: GOLD }
                        : undefined
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Community Directory
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Communities List
              </h2>
            </div>

            <p className="text-sm font-semibold text-gray-500">
              Showing {filteredCommunities.length} of{" "}
              {communities.length}
            </p>
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredCommunities.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(search.trim()) || filter !== "all"
              }
              onReset={() => {
                setSearch("");
                setFilter("all");
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community?._id}
                  community={community}
                  onView={() =>
                    setSelectedCommunity(community)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedCommunity && (
        <CommunityModal
          community={selectedCommunity}
          onClose={() => setSelectedCommunity(null)}
        />
      )}
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  accent,
}) => {
  const accentClasses = {
    gold: "bg-[#D4AF37]/10 text-[#8D7414]",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            accentClasses[accent]
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const CommunityCard = ({
  community,
  onView,
}) => {
  const meta = getTypeMeta(community?.type);
  const TypeIcon = meta.icon;

  return (
    <div className="group rounded-3xl border border-gray-200 bg-[#FCFCFA] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-black"
          style={{ backgroundColor: GOLD }}
        >
          <TypeIcon size={21} />
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold ${meta.badge}`}
        >
          {meta.label}
        </span>
      </div>

      <h3 className="mt-5 line-clamp-1 text-lg font-black text-gray-950">
        {community?.name || "Unnamed Community"}
      </h3>

      <p className="mt-2 line-clamp-3 min-h-[66px] text-sm leading-6 text-gray-500">
        {community?.description ||
          "No description has been provided for this community."}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
          <Users size={15} />

          {community?.memberCount ??
            community?.members?.length ??
            0}{" "}
          members
        </div>

        <button
          onClick={onView}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700 transition hover:border-[#D4AF37] hover:text-black"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-3xl border border-gray-100 p-5"
        >
          <div className="flex justify-between">
            <div className="h-12 w-12 rounded-2xl bg-gray-200" />
            <div className="h-7 w-20 rounded-full bg-gray-200" />
          </div>

          <div className="mt-5 h-6 w-2/3 rounded bg-gray-200" />
          <div className="mt-3 h-4 w-full rounded bg-gray-100" />
          <div className="mt-2 h-4 w-5/6 rounded bg-gray-100" />

          <div className="mt-5 border-t border-gray-100 pt-4">
            <div className="h-4 w-1/2 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({
  hasFilters,
  onReset,
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-14 text-center">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
        style={{ backgroundColor: GOLD }}
      >
        <Globe2 size={28} />
      </div>

      <h3 className="mt-5 text-2xl font-black text-gray-950">
        {hasFilters
          ? "No Matching Communities"
          : "No Communities Created"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasFilters
          ? "Try changing your search or filter to find another community."
          : "Community data will appear here once communities are created."}
      </p>

      {hasFilters && (
        <button
          onClick={onReset}
          className="mt-5 rounded-xl px-5 py-3 text-sm font-black text-black"
          style={{ backgroundColor: GOLD }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

const CommunityModal = ({
  community,
  onClose,
}) => {
  const meta = getTypeMeta(community?.type);
  const TypeIcon = meta.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="bg-black px-6 py-7 text-white sm:px-8">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-black"
                style={{ backgroundColor: GOLD }}
              >
                <TypeIcon size={24} />
              </div>

              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Community
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {community?.name || "Unnamed Community"}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-gray-300 hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">
              Description
            </p>

            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
              {community?.description ||
                "No description available."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoBox
              label="Community Type"
              value={meta.label}
            />

            <InfoBox
              label="Members"
              value={
                community?.memberCount ??
                community?.members?.length ??
                0
              }
            />

            <InfoBox
              label="Community ID"
              value={community?._id || "—"}
            />

            <InfoBox
              label="Created"
              value={
                community?.createdAt
                  ? new Date(
                      community.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"
              }
            />
          </div>

          {Array.isArray(community?.members) &&
            community.members.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-gray-400">
                  Members
                </p>

                <div className="max-h-56 space-y-2 overflow-y-auto rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  {community.members.map(
                    (member, index) => (
                      <div
                        key={member?._id || index}
                        className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700"
                      >
                        {typeof member === "string"
                          ? member
                          : member?.name ||
                            member?.email ||
                            member?._id ||
                            `Member ${index + 1}`}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="rounded-xl px-5 py-3 text-sm font-black text-black"
              style={{ backgroundColor: GOLD }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
      <p className="text-xs font-semibold text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-black text-gray-800">
        {value}
      </p>
    </div>
  );
};

export default Communities;