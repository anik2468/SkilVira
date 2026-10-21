import { API_ORIGIN } from "../../services/urlConfig.js";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  ExternalLink,
  Mail,
  Search,
  RefreshCw,
  Globe2,
  Users,
  BriefcaseBusiness,
} from "lucide-react";
import api from "../../services/api";

const GOLD = "#D4AF37";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [error, setError] = useState("");

  const loadCompanies = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/companies");

      const data = response?.data;

      const list =
        data?.companies ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      setCompanies(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load companies:", err);

      setCompanies([]);

      setError(
        err?.response?.data?.message ||
          "Unable to load companies."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return companies;

    return companies.filter((company) => {
      const name = String(company?.name || "").toLowerCase();
      const email = String(company?.email || "").toLowerCase();
      const industry = String(
        company?.industry || ""
      ).toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        industry.includes(query)
      );
    });
  }, [companies, search]);

  const verifiedCount = companies.filter(
    (company) =>
      company?.verified === true ||
      company?.isVerified === true ||
      String(company?.status || "").toLowerCase() ===
        "verified"
  ).length;

  const industriesCount = new Set(
    companies
      .map((company) => company?.industry)
      .filter(Boolean)
  ).size;

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
                <Building2 size={18} />
              </span>

              <span
                className="text-xs font-black uppercase tracking-[0.2em]"
                style={{ color: GOLD }}
              >
                Employee Control
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Partner Companies
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Manage registered companies, verify partnerships and
              review company information.
            </p>
          </div>

          <button
            onClick={() => loadCompanies(true)}
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
            label="Total Companies"
            value={companies.length}
            icon={<Building2 size={21} />}
            accent="gold"
          />

          <StatCard
            label="Verified Companies"
            value={verifiedCount}
            icon={<Users size={21} />}
            accent="green"
          />

          <StatCard
            label="Industries"
            value={industriesCount}
            icon={<BriefcaseBusiness size={21} />}
            accent="blue"
          />

          <StatCard
            label="Listed Websites"
            value={
              companies.filter(
                (company) => Boolean(company?.website)
              ).length
            }
            icon={<Globe2 size={21} />}
            accent="purple"
          />
        </div>

        {/* Search */}
        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, email or industry..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-gray-800 outline-none transition focus:border-[#D4AF37] focus:bg-white"
            />
          </div>
        </div>

        {/* Company directory */}
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: GOLD }}
              >
                Company Directory
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Registered Companies
              </h2>
            </div>

            <p className="text-sm font-semibold text-gray-500">
              Showing {filteredCompanies.length} of{" "}
              {companies.length}
            </p>
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredCompanies.length === 0 ? (
            <EmptyState
              hasSearch={Boolean(search.trim())}
              onReset={() => setSearch("")}
            />
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto rounded-2xl border border-gray-100 lg:block">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#FAFAF8]">
                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                        Company
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                        Industry
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                        Website
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-gray-400">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wide text-gray-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCompanies.map((company) => (
                      <CompanyRow
                        key={company?._id}
                        company={company}
                        onView={() =>
                          setSelectedCompany(company)
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / tablet */}
              <div className="grid gap-4 lg:hidden">
                {filteredCompanies.map((company) => (
                  <CompanyCard
                    key={company?._id}
                    company={company}
                    onView={() =>
                      setSelectedCompany(company)
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
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
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accentClasses[accent]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const CompanyRow = ({
  company,
  onView,
}) => {
  const logo = company?.logo
    ? company.logo.startsWith("http")
      ? company.logo
      : `${API_ORIGIN}${company.logo}`
    : null;

  const isVerified =
    company?.verified === true ||
    company?.isVerified === true ||
    String(company?.status || "").toLowerCase() ===
      "verified";

  return (
    <tr className="border-b border-gray-100 transition hover:bg-[#FCFCFA]">
      <td className="px-5 py-5">
        <div className="flex items-center gap-3">
          <CompanyLogo
            logo={logo}
            name={company?.name}
          />

          <div className="min-w-0">
            <p className="truncate font-black text-gray-900">
              {company?.name || "Unnamed Company"}
            </p>

            {company?.email && (
              <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500">
                <Mail size={13} />
                {company.email}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-5">
        <span className="text-sm font-semibold text-gray-700">
          {company?.industry || "—"}
        </span>
      </td>

      <td className="px-5 py-5">
        {company?.website ? (
          <a
            href={
              company.website.startsWith("http")
                ? company.website
                : `https://${company.website}`
            }
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-black"
          >
            Visit Website
            <ExternalLink size={14} />
          </a>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      <td className="px-5 py-5">
        <StatusBadge verified={isVerified} />
      </td>

      <td className="px-5 py-5 text-right">
        <button
          onClick={onView}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black text-gray-700 hover:border-[#D4AF37] hover:text-black"
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

const CompanyCard = ({
  company,
  onView,
}) => {
  const logo = company?.logo
    ? company.logo.startsWith("http")
      ? company.logo
      : `${API_ORIGIN}${company.logo}`
    : null;

  const isVerified =
    company?.verified === true ||
    company?.isVerified === true ||
    String(company?.status || "").toLowerCase() ===
      "verified";

  return (
    <div className="rounded-3xl border border-gray-200 bg-[#FCFCFA] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <CompanyLogo
            logo={logo}
            name={company?.name}
          />

          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-gray-950">
              {company?.name || "Unnamed Company"}
            </h3>

            <p className="mt-1 truncate text-xs text-gray-500">
              {company?.email || "No email available"}
            </p>
          </div>
        </div>

        <StatusBadge verified={isVerified} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <InfoBox
          label="Industry"
          value={company?.industry || "—"}
        />

        <InfoBox
          label="Company ID"
          value={
            company?._id
              ? `${String(company._id).slice(0, 10)}...`
              : "—"
          }
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {company?.website && (
          <a
            href={
              company.website.startsWith("http")
                ? company.website
                : `https://${company.website}`
            }
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700"
          >
            <Globe2 size={14} />
            Website
            <ExternalLink size={13} />
          </a>
        )}

        <button
          onClick={onView}
          className="rounded-xl px-4 py-2.5 text-xs font-black text-black"
          style={{ backgroundColor: GOLD }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const CompanyLogo = ({
  logo,
  name,
}) => {
  const [failed, setFailed] = useState(false);

  if (!logo || failed) {
    return (
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-black"
        style={{ backgroundColor: GOLD }}
      >
        {(name || "C")
          .trim()
          .charAt(0)
          .toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name || "Company"}
      onError={() => setFailed(true)}
      className="h-12 w-12 shrink-0 rounded-2xl border border-gray-100 bg-white object-cover"
    />
  );
};

const StatusBadge = ({
  verified,
}) => {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${
        verified
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      {verified ? "Verified" : "Pending"}
    </span>
  );
};

const InfoBox = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-black text-gray-800">
        {value}
      </p>
    </div>
  );
};

const CompanyModal = ({
  company,
  onClose,
}) => {
  const logo = company?.logo
    ? company.logo.startsWith("http")
      ? company.logo
      : `${API_ORIGIN}${company.logo}`
    : null;

  const isVerified =
    company?.verified === true ||
    company?.isVerified === true ||
    String(company?.status || "").toLowerCase() ===
      "verified";

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
              <CompanyLogo
                logo={logo}
                name={company?.name}
              />

              <div>
                <p
                  className="text-xs font-black uppercase tracking-[0.18em]"
                  style={{ color: GOLD }}
                >
                  Partner Company
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {company?.name || "Unnamed Company"}
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
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">
              Company Verification
            </p>

            <StatusBadge verified={isVerified} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoBox
              label="Company Name"
              value={company?.name || "—"}
            />

            <InfoBox
              label="Industry"
              value={company?.industry || "—"}
            />

            <InfoBox
              label="Email"
              value={company?.email || "—"}
            />

            <InfoBox
              label="Company ID"
              value={company?._id || "—"}
            />
          </div>

          {company?.website && (
            <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
              <p className="text-xs font-semibold text-gray-400">
                Website
              </p>

              <a
                href={
                  company.website.startsWith("http")
                    ? company.website
                    : `https://${company.website}`
                }
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-2 break-all text-sm font-bold text-gray-800 hover:text-black"
              >
                {company.website}
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {company?.description && (
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">
                Description
              </p>

              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
                {company.description}
              </p>
            </div>
          )}

          <div className="flex justify-end border-t border-gray-100 pt-5">
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

const LoadingState = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-gray-100 p-5"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gray-200" />

            <div className="flex-1">
              <div className="h-5 w-1/3 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-1/4 rounded bg-gray-100" />
            </div>

            <div className="hidden h-8 w-20 rounded-full bg-gray-200 sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({
  hasSearch,
  onReset,
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-[#FAFAF8] px-6 py-14 text-center">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-black"
        style={{ backgroundColor: GOLD }}
      >
        <Building2 size={28} />
      </div>

      <h3 className="mt-5 text-2xl font-black text-gray-950">
        {hasSearch
          ? "No Matching Companies"
          : "No Companies Found"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {hasSearch
          ? "Try a different company name, email or industry."
          : "Registered partner companies will appear here."}
      </p>

      {hasSearch && (
        <button
          onClick={onReset}
          className="mt-5 rounded-xl px-5 py-3 text-sm font-black text-black"
          style={{ backgroundColor: GOLD }}
        >
          Clear Search
        </button>
      )}
    </div>
  );
};

export default Companies;