import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Monitor,
  MapPin,
  RefreshCw,
  Server,
  Ticket,
  AlertTriangle,
} from "lucide-react";

import { getDataSource, getSite } from "../services/api";
import DemoDataNotice from "../components/DemoDataNotice";

export default function SiteDetails() {
  const { siteId } = useParams();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingDemoData, setUsingDemoData] = useState(false);

  useEffect(() => {
    let active = true;

    getSite(siteId)
      .then((data) => {
        if (!active) {
          return;
        }

        setSite(data);
        setUsingDemoData(getDataSource() === "demo");
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        console.error("Failed to load site:", error);
        setError("Unable to load site information.");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [siteId]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <RefreshCw size={17} className="animate-spin" />
          Loading site information...
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <AlertTriangle
            size={30}
            className="mx-auto text-red-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-white">
            Site unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "Site could not be found."}
          </p>

          <Link
            to="/sites"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700"
          >
            <ArrowLeft size={15} />
            Back to sites
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">

      <Link
        to="/sites"
        className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to sites
      </Link>

      {usingDemoData && <DemoDataNotice />}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
              <MapPin size={22} />
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.15em] text-emerald-400">
                {site.siteId}
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {site.site}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {site.location}
              </p>
            </div>
          </div>

          <StatusBadge status={site.status} />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600">
            Infrastructure
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Connected Components
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">

          <InfoCard
            icon={Server}
            label="Edge Box"
            title={site.edgeBox || "Unknown"}
          >
            <div className="mt-4">
              <StatusBadge status={site.edgeBoxStatus} />
            </div>
          </InfoCard>

          <InfoCard
            icon={Monitor}
            label="Application"
            title={site.application || "Unknown"}
          >
            <p className="mt-4 text-xs text-slate-600">
              Application connected to this site.
            </p>
          </InfoCard>

          <InfoCard
            icon={Database}
            label="Customer Environment"
            title={site.customerEnvironment || "Unknown"}
          >
            <div className="mt-4 inline-flex rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-400">
              RDP Access
            </div>
          </InfoCard>

        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
        <div className="border-b border-slate-800 px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600">
            Data Pipeline
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Data Files
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Files generated by this site.
          </p>
        </div>

        <div className="divide-y divide-slate-800">
          {site.dataFiles?.length > 0 ? (
            site.dataFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between gap-4 px-6 py-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                    <Database
                      size={16}
                      className="text-slate-500"
                    />
                  </div>

                  <span className="truncate text-sm text-slate-300">
                    {file.name}
                  </span>
                </div>

                <StatusBadge status={file.status} />
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-sm text-slate-600">
              No data files found.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70">

        <div className="border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
              <Ticket size={17} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600">
                Support History
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Previous Tickets
              </h2>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {site.previousTickets?.length > 0 ? (
            site.previousTickets.map((ticket) => (
              <Link
                key={ticket.ticketId}
                to={`/tickets/${ticket.ticketId}`}
                className="flex items-center gap-4 px-6 py-5 transition hover:bg-slate-800/30"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-semibold text-emerald-400">
                  {ticket.ticketId?.replace("TKT-", "")}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    {ticket.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Resolution:{" "}
                    {ticket.resolution || "Not available"}
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="shrink-0 text-slate-600"
                />
              </Link>
            ))
          ) : (
            <div className="px-6 py-10 text-sm text-slate-600">
              No previous tickets found.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

function InfoCard({ icon: Icon, label, title, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
          <Icon size={17} />
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
          {label}
        </p>
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">
        {title}
      </h3>

      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = status?.toLowerCase();

  const healthy =
    normalized === "online" ||
    normalized === "running" ||
    normalized === "generating";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        healthy
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}