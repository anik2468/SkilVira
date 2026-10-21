import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiArchive,
  FiCheckCircle,
  FiEdit2,
  FiExternalLink,
  FiGlobe,
  FiLink,
  FiMapPin,
  FiRefreshCw,
  FiShield,
  FiTrash2,
  FiUsers,
  FiUserPlus,
  FiMail,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../services/api";

const GOLD = "#D4AF37";

const CommunityDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [community, setCommunity] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    loadCommunity();
  }, [id]);

  const loadCommunity = async (
    isRefresh = false
  ) => {
    if (!id) {
      setLoading(false);
      setError(
        "Community ID is missing."
      );
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await api.get(
          `/communities/${id}`
        );

      const data =
        response?.data?.community ||
        response?.data?.data ||
        response?.data ||
        null;

      if (!data) {
        throw new Error(
          "Community details were not returned."
        );
      }

      setCommunity(data);
    } catch (err) {
      console.error(
        "Community details error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load community details."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteCommunity = async () => {
    if (!id) return;

    const confirmed =
      window.confirm(
        `Delete "${community?.name || "this community"}"?`
      );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await api.delete(
        `/communities/${id}`
      );

      navigate(
        "/ambassador/communities",
        {
          replace: true,
          state: {
            message:
              "Community deleted successfully.",
          },
        }
      );
    } catch (err) {
      console.error(
        "Community delete error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to delete community."
      );
    } finally {
      setDeleting(false);
    }
  };

  const members = Array.isArray(
    community?.members
  )
    ? community.members
    : [];

  const memberCount =
    community?.memberCount ??
    members.length ??
    0;

  const rules = useMemo(() => {
    if (
      Array.isArray(
        community?.rules
      )
    ) {
      return community.rules;
    }

    return String(
      community?.rules || ""
    )
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [community]);

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (!community) {
    return (
      <div className="min-h-[70vh] bg-[#F8F8F6] px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <FiAlertCircle
            className="mx-auto text-red-500"
            size={30}
          />

          <h2 className="mt-4 text-2xl font-black">
            Community Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error ||
              "Unable to find this community."}
          </p>

          <Link
            to="/ambassador/communities"
            className="mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-black text-black"
            style={{
              backgroundColor: GOLD,
            }}
          >
            Back to Communities
          </Link>
        </div>
      </div>
    );
  }

  const banner =
    getAssetUrl(
      community?.banner ||
        community?.image
    );

  const logo =
    getAssetUrl(
      community?.logo
    );

  const status =
    String(
      community?.status ||
        "active"
    ).toLowerCase();

  const archived =
    status === "archived";

  return (
    <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <section className="relative overflow-hidden rounded-[32px] bg-black text-white shadow-2xl">
          <div className="relative h-56 sm:h-72">
            {banner ? (
              <img
                src={banner}
                alt={
                  community?.name ||
                  "Community"
                }
                className="h-full w-full object-cover opacity-70"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-black to-gray-800">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-3xl text-black"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiUsers size={36} />
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm hover:bg-black/60"
            >
              <FiArrowLeft />
              Back
            </button>

            <div className="absolute bottom-6 left-5 right-5 sm:left-8 sm:right-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex items-end gap-4">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Community logo"
                      className="h-20 w-20 rounded-2xl border-2 border-white/20 bg-white object-contain p-2"
                    />
                  ) : (
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-2xl text-black"
                      style={{
                        backgroundColor:
                          GOLD,
                      }}
                    >
                      <FiUsers size={30} />
                    </div>
                  )}

                  <div>
                    <div className="mb-2">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                          archived
                            ? "border-gray-300 bg-gray-100 text-gray-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {archived
                          ? "Archived"
                          : "Active"}
                      </span>
                    </div>

                    <h1 className="text-3xl font-black sm:text-4xl">
                      {community?.name}
                    </h1>

                    <p className="mt-1 text-sm text-gray-300">
                      {community?.type ||
                        "Student"}{" "}
                      Community
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      loadCommunity(
                        true
                      )
                    }
                    disabled={
                      refreshing
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    <FiRefreshCw
                      className={
                        refreshing
                          ? "animate-spin"
                          : ""
                      }
                    />
                    Refresh
                  </button>

                  <Link
                    to={`/ambassador/communities/${id}/edit`}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black text-black"
                    style={{
                      backgroundColor:
                        GOLD,
                    }}
                  >
                    <FiEdit2 />
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Members"
            value={memberCount}
            icon={<FiUsers />}
            tone="gold"
          />

          <StatCard
            label="Join Mode"
            value={
              community?.joinMode ||
              "Open"
            }
            icon={<FiUserPlus />}
            tone="blue"
          />

          <StatCard
            label="Type"
            value={
              community?.type ||
              "Student"
            }
            icon={<FiGlobe />}
            tone="purple"
          />

          <StatCard
            label="Status"
            value={
              archived
                ? "Archived"
                : "Active"
            }
            icon={<FiCheckCircle />}
            tone={
              archived
                ? "gray"
                : "green"
            }
          />
        </div>

        {/* Main */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">

          {/* Overview */}
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5">
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                  }}
                >
                  Community Overview
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  About this community
                </h2>
              </div>

              <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                {community?.description ||
                  "No community description available."}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoBox
                  label="Location"
                  value={
                    community?.location ||
                    "Campus / Online"
                  }
                />

                <InfoBox
                  label="Community Type"
                  value={
                    community?.type ||
                    "Student"
                  }
                />

                <InfoBox
                  label="Members"
                  value={
                    memberCount
                  }
                />

                <InfoBox
                  label="Join Mode"
                  value={
                    community?.joinMode ||
                    "Open"
                  }
                />
              </div>
            </section>

            {/* Rules */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-black"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiShield size={20} />
                </div>

                <div>
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{
                      color: GOLD,
                    }}
                  >
                    Guidelines
                  </p>

                  <h2 className="text-xl font-black text-gray-950">
                    Community Rules
                  </h2>
                </div>
              </div>

              {rules.length === 0 ? (
                <p className="mt-5 text-sm text-gray-500">
                  No community rules added yet.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {rules.map(
                    (rule, index) => (
                      <div
                        key={`${rule}-${index}`}
                        className="flex items-start gap-3 rounded-2xl bg-[#FAFAF8] p-4"
                      >
                        <FiCheckCircle
                          className="mt-0.5 shrink-0 text-emerald-500"
                        />

                        <p className="text-sm leading-6 text-gray-600">
                          {rule}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* Members */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{
                      color: GOLD,
                    }}
                  >
                    Community Members
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-gray-950">
                    Member Directory
                  </h2>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-600">
                  {memberCount} members
                </span>
              </div>

              {members.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-[#FAFAF8] p-8 text-center">
                  <FiUsers
                    className="mx-auto text-gray-300"
                    size={28}
                  />

                  <p className="mt-3 text-sm font-bold text-gray-600">
                    Member list is empty or not available.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {members.map(
                    (member, index) => {
                      const name =
                        member?.name ||
                        member?.fullName ||
                        member?.email ||
                        `Member ${index + 1}`;

                      return (
                        <div
                          key={
                            member?._id ||
                            index
                          }
                          className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4"
                        >
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black text-black"
                            style={{
                              backgroundColor:
                                GOLD,
                            }}
                          >
                            {getInitials(
                              name
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-gray-900">
                              {name}
                            </p>

                            {member?.email && (
                              <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500">
                                <FiMail />
                                {member.email}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Side */}
          <div className="space-y-6">

            {/* Invite */}
            <section className="rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-7">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Grow Your Community
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Invite students
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Share your community join link with students from your
                college.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2">
                  <FiLink
                    style={{
                      color: GOLD,
                    }}
                  />

                  <span className="text-xs font-black uppercase tracking-wide text-gray-500">
                    Community Link
                  </span>
                </div>

                <p className="mt-2 break-all text-sm font-semibold text-gray-300">
                  {community?.joinLink ||
                    community?.inviteLink ||
                    "Join link not available"}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      community?.joinLink ||
                        community?.inviteLink ||
                        ""
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-black text-black"
                  style={{
                    backgroundColor:
                      GOLD,
                  }}
                >
                  <FiLink />
                  Copy Link
                </button>

                {(community?.joinLink ||
                  community?.inviteLink) && (
                  <a
                    href={
                      community.joinLink ||
                      community.inviteLink
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-white"
                  >
                    <FiExternalLink />
                    Open
                  </a>
                )}
              </div>
            </section>

            {/* Quick Management */}
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                }}
              >
                Management
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-950">
                Community controls
              </h2>

              <div className="mt-5 space-y-2">
                <Link
                  to={`/ambassador/communities/${id}/edit`}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4"
                >
                  <span className="flex items-center gap-3 text-sm font-black text-gray-800">
                    <FiEdit2 />
                    Edit Community
                  </span>

                  <FiExternalLink className="text-gray-300" />
                </Link>

                <Link
                  to="/ambassador/students"
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4"
                >
                  <span className="flex items-center gap-3 text-sm font-black text-gray-800">
                    <FiUserPlus />
                    Student Network
                  </span>

                  <FiExternalLink className="text-gray-300" />
                </Link>
              </div>
            </section>

            {/* Danger */}
            <section className="rounded-3xl border border-red-200 bg-red-50 p-6">
              <div className="flex items-start gap-3">
                <FiTrash2 className="mt-0.5 text-red-600" />

                <div>
                  <p className="text-sm font-black text-red-800">
                    Delete Community
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-700">
                    This action should only be used when you are sure
                    the community is no longer required.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  deleteCommunity
                }
                disabled={deleting}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-black text-red-700 disabled:opacity-50"
              >
                <FiTrash2 />
                {deleting
                  ? "Deleting..."
                  : "Delete Community"}
              </button>
            </section>
          </div>
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
    gold:
      "bg-[#D4AF37]/10 text-[#8D7414]",
    blue:
      "bg-blue-50 text-blue-600",
    purple:
      "bg-purple-50 text-purple-600",
    green:
      "bg-emerald-50 text-emerald-600",
    gray:
      "bg-gray-100 text-gray-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-3 text-2xl font-black text-gray-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            tones[tone] ||
            tones.gold
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({
  label,
  value,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
    <p className="text-xs font-semibold text-gray-400">
      {label}
    </p>

    <p className="mt-1 break-words text-sm font-black text-gray-800">
      {value}
    </p>
  </div>
);

const DetailsSkeleton = () => (
  <div className="min-h-screen bg-[#F8F8F6] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      <div className="h-72 rounded-[32px] bg-gray-900" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 rounded-3xl bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-96 rounded-3xl bg-white" />
        <div className="h-96 rounded-3xl bg-white" />
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

const getInitials = (name = "") => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "U";

  return words
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase()
    )
    .join("");
};

const copyText = async (text) => {
  if (!text) {
    window.alert(
      "Community join link is not available."
    );
    return;
  }

  try {
    await navigator.clipboard.writeText(
      text
    );

    window.alert(
      "Community link copied."
    );
  } catch (error) {
    console.error(
      "Copy link error:",
      error
    );

    window.alert(
      "Unable to copy community link."
    );
  }
};

export default CommunityDetails;