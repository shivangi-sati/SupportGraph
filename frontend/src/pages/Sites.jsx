import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MapPin,
  Server,
  Monitor,
  Database,
  ArrowRight,
  RefreshCw,
  Search,
} from "lucide-react";

import { getDataSource, getSites } from "../services/api";
import DemoDataNotice from "../components/DemoDataNotice";

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingDemoData, setUsingDemoData] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter = searchParams.get("status");

  useEffect(() => {
    loadSites();
  }, []);

  async function loadSites() {
    try {
      setLoading(true);
      setError("");

      const data = await getSites();

      setSites(data);
      setUsingDemoData(getDataSource() === "demo");
    } catch (error) {
      console.error("Failed to load sites:", error);
      setError("Unable to load sites.");
    } finally {
      setLoading(false);
    }
  }

  const filteredSites = useMemo(() => {
    const value = search.toLowerCase().trim();

    return sites.filter((site) => {
      const matchesSearch =
        !value ||
        site.siteId?.toLowerCase().includes(value) ||
        site.site?.toLowerCase().includes(value) ||
        site.location?.toLowerCase().includes(value) ||
        site.edgeBox?.toLowerCase().includes(value) ||
        site.application?.toLowerCase().includes(value);

      let matchesFilter = true;

      if (statusFilter === "Offline") {
        matchesFilter =
          site.status?.toLowerCase() === "offline";
      }

      if (statusFilter === "data-issue") {
        matchesFilter =
          site.dataFiles?.some(
            (file) =>
              file.status?.toUpperCase() ===
              "NOT_GENERATING"
          );
      }

      return matchesSearch && matchesFilter;
    });
  }, [sites, search, statusFilter]);

  const clearFilter = () => {
    setSearchParams({});
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
          Infrastructure
        </p>

        <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold text-white">
              Sites
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor sites, edge boxes, applications and data generation.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <span className="text-2xl font-semibold text-white">
              {filteredSites.length}
            </span>

            <span className="ml-2 text-sm text-slate-500">
              {statusFilter ? "matching sites" : "sites"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center rounded-xl border border-slate-800 bg-slate-900 px-4">
        <Search
          size={18}
          className="text-slate-600"
        />

        <input
          type="text"
          placeholder="Search sites, locations, edge boxes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-slate-600"
        />
      </div>

      {statusFilter && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              statusFilter === "Offline"
                ? "bg-red-500/10 text-red-400"
                : "bg-yellow-500/10 text-yellow-400"
            }`}
          >
            {statusFilter === "data-issue"
              ? "Data Issues"
              : `Status: ${statusFilter}`}
          </span>

          <button
            onClick={clearFilter}
            className="text-xs text-slate-500 transition hover:text-white"
          >
            Clear filter
          </button>
        </div>
      )}

      {loading && (
        <div className="flex min-h-75 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <RefreshCw
              size={17}
              className="animate-spin"
            />
            Loading sites...
          </div>
        </div>
      )}

      {!loading && !error && usingDemoData && <DemoDataNotice />}

      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-sm text-red-400">
            {error}
          </p>

          <button
            onClick={loadSites}
            className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredSites.map((site) => (
            <div
              key={site.siteId}
              className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-emerald-400/20 hover:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-bold tracking-wider text-emerald-400">
                      {site.siteId}
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-white">
                      {site.site}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {site.location}
                    </p>
                  </div>
                </div>

                <StatusBadge status={site.status} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Resource
                  icon={Server}
                  label="Edge Box"
                  value={site.edgeBox}
                  status={site.edgeBoxStatus}
                />

                <Resource
                  icon={Monitor}
                  label="Application"
                  value={site.application}
                />
              </div>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-2">
                  <Database
                    size={15}
                    className="text-slate-500"
                  />

                  <span className="text-xs font-medium text-slate-400">
                    Data Files
                  </span>

                  <span className="ml-auto text-xs text-slate-600">
                    {site.dataFiles?.length || 0}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {site.dataFiles?.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between"
                    >
                      <span className="truncate text-xs text-slate-500">
                        {file.name}
                      </span>

                      <StatusBadge
                        status={file.status}
                        small
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <Link
                  to={`/sites/${site.siteId}`}
                  className="flex items-center gap-2 text-sm text-slate-500 transition group-hover:text-emerald-400"
                >
                  View site
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}

          {filteredSites.length === 0 && (
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 py-16 text-center">
              <p className="text-sm text-slate-500">
                No sites match the current filter.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Resource({ icon: Icon, label, value, status }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center gap-2">
        <Icon
          size={15}
          className="text-slate-600"
        />

        <span className="text-xs text-slate-600">
          {label}
        </span>
      </div>

      <p className="mt-3 truncate text-sm font-medium text-slate-300">
        {value || "Not available"}
      </p>

      {status && (
        <div className="mt-2">
          <StatusBadge status={status} small />
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, small = false }) {
  const normalized = status?.toLowerCase();

  const healthy =
    normalized === "online" ||
    normalized === "running" ||
    normalized === "generating";

  return (
    <span
      className={`inline-flex rounded-full font-medium ${
        small
          ? "px-2 py-0.5 text-[10px]"
          : "px-2.5 py-1 text-[11px]"
      } ${
        healthy
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}