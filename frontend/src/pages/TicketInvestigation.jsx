import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Server,
  Database,
  Monitor,
  User,
  MapPin,
  ClipboardCheck,
  Users,
  AlertTriangle,
  RefreshCw,
  GitBranch,
} from "lucide-react";

import { getDataSource, getTicketInvestigation } from "../services/api";
import DemoDataNotice from "../components/DemoDataNotice";

export default function TicketInvestigation() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingDemoData, setUsingDemoData] = useState(false);

  useEffect(() => {
    const loadInvestigation = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTicketInvestigation(ticketId);

        if (data.error) {
          setError(data.error);
          return;
        }

        setTicket(data);
        setUsingDemoData(getDataSource() === "demo");
      } catch (err) {
        console.error(err);
        setError("Unable to load ticket investigation.");
      } finally {
        setLoading(false);
      }
    };

    loadInvestigation();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <RefreshCw size={17} className="animate-spin" />
          Loading investigation...
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <AlertTriangle
            size={30}
            className="mx-auto text-red-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-white">
            Investigation unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "Ticket could not be found."}
          </p>

          <Link
            to="/tickets"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700"
          >
            <ArrowLeft size={15} />
            Back to tickets
          </Link>
        </div>
      </div>
    );
  }

  const site = ticket.site;
  const edgeBox = ticket.edgeBox;
  const application = ticket.application;

  return (
    <div className="space-y-7">

      <Link
        to="/tickets"
        className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to tickets
      </Link>

      {usingDemoData && <DemoDataNotice />}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold tracking-widest text-emerald-400">
                {ticket.ticketId}
              </span>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                {ticket.status}
              </span>

              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                {ticket.priority} priority
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              {ticket.title}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              {ticket.description}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
            <User size={16} className="text-slate-500" />

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Customer
              </p>

              <p className="mt-1 text-sm font-medium text-slate-200">
                {ticket.customer}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-500/10 bg-emerald-500/3 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <GitBranch size={18} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-400">
              Graph Connections
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Investigation Path
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Connected operational context discovered through the
              support graph.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">

          <RelationshipCard
            from={ticket.ticketId}
            relation="AFFECTS"
            to={site?.name || "Unknown Site"}
          />

          <RelationshipCard
            from={site?.name || "Site"}
            relation="HAS_EDGE_BOX"
            to={edgeBox?.name || "Unknown Edge Box"}
          />

          <RelationshipCard
            from={site?.name || "Site"}
            relation="HAS_APPLICATION"
            to={application?.name || "Unknown Application"}
          />

          <RelationshipCard
            from={ticket.ticketId}
            relation="REPORTS"
            to={ticket.issue || "Unknown Issue"}
          />

          <RelationshipCard
            from={ticket.ticketId}
            relation="RESOLVED_BY"
            to={ticket.resolution?.name || "Unknown Resolution"}
          />

          <RelationshipCard
            from={ticket.resolution?.name || "Resolution"}
            relation="PERFORMED_BY"
            to={ticket.resolution?.team || "Unknown Team"}
          />

          <RelationshipCard
            from={site?.name || "Site"}
            relation="GENERATES_DATA_FILE"
            to={
              ticket.dataFiles?.[0]?.name ||
              "Data File"
            }
          />

          <RelationshipCard
            from={
              ticket.dataFiles?.[0]?.name ||
              "Data File"
            }
            relation="LOCATED_IN"
            to={
              ticket.customerEnvironment ||
              "Customer Environment"
            }
          />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600">
            Connected Infrastructure
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Investigation Context
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">

          <InfoCard
            icon={MapPin}
            label="Affected Site"
            title={site?.name || "Unknown"}
          >
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {site?.location}
              </span>

              <StatusBadge status={site?.status} />
            </div>
          </InfoCard>

          <InfoCard
            icon={Server}
            label="Edge Box"
            title={edgeBox?.name || "Unknown"}
          >
            <div className="mt-4">
              <StatusBadge status={edgeBox?.status} />
            </div>
          </InfoCard>

          <InfoCard
            icon={Monitor}
            label="Application"
            title={application?.name || "Unknown"}
          >
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                v{application?.version}
              </span>

              <StatusBadge status={application?.status} />
            </div>
          </InfoCard>

        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">

        <InfoCard
          icon={Database}
          label="Data Generation"
          title="Site Data Files"
        >
          <div className="mt-4 space-y-3">
            {ticket.dataFiles?.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3"
              >
                <span className="text-sm text-slate-300">
                  {file.name}
                </span>

                <StatusBadge status={file.status} />
              </div>
            ))}
          </div>
        </InfoCard>

        <InfoCard
          icon={Monitor}
          label="Customer Environment"
          title={ticket.customerEnvironment || "Unknown"}
        >
          <p className="mt-4 text-sm text-slate-500">
            Remote environment used during investigation.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-400">
            RDP Access
          </div>
        </InfoCard>

      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <ClipboardCheck size={18} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Investigation
            </p>

            <h2 className="text-lg font-semibold text-white">
              Steps Performed
            </h2>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {ticket.investigationSteps?.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-semibold text-emerald-400">
                {index + 1}
              </div>

              <span className="text-sm text-slate-300">
                {step}
              </span>

              <CheckCircle2
                size={16}
                className="ml-auto text-emerald-400"
              />
            </div>
          ))}
        </div>

      </section>

      <section className="grid gap-4 lg:grid-cols-2">

        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-400">
            Resolution
          </p>

          <h2 className="mt-3 text-xl font-semibold text-white">
            {ticket.resolution?.name}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {ticket.resolution?.description}
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
            <Users size={15} />

            Performed by{" "}

            <span className="text-slate-300">
              {ticket.resolution?.team}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600">
            Reported Issue
          </p>

          <h2 className="mt-3 text-xl font-semibold text-white">
            {ticket.issue}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            This issue was identified through the connected ticket
            and investigation data.
          </p>
        </div>

      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70">

        <div className="border-b border-slate-800 px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600">
            Graph Connections
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Similar Historical Tickets
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Previous incidents reporting the same issue.
          </p>
        </div>

        <div className="divide-y divide-slate-800">
          {ticket.similarTickets?.length > 0 ? (
            ticket.similarTickets.map((similar) => (
              <Link
                key={similar.ticketId}
                to={`/tickets/${similar.ticketId}`}
                className="flex items-center gap-4 px-6 py-5 transition hover:bg-slate-800/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-xs font-semibold text-emerald-400">
                  {similar.ticketId?.replace("TKT-", "")}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    {similar.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Resolution:{" "}
                    {similar.resolution ||
                      "Not available"}
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="text-slate-600"
                />
              </Link>
            ))
          ) : (
            <div className="px-6 py-8 text-sm text-slate-600">
              No similar historical tickets found.
            </div>
          )}
        </div>

      </section>
    </div>
  );
}

function RelationshipCard({ from, relation, to }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center gap-2">
        <span className="max-w-[40%] truncate text-xs font-medium text-slate-300">
          {from}
        </span>

        <ArrowRight
          size={14}
          className="shrink-0 text-emerald-400"
        />

        <span className="truncate text-[10px] font-bold tracking-wider text-emerald-400">
          {relation}
        </span>
      </div>

      <div className="mt-3 border-l border-slate-700 pl-3">
        <p className="truncate text-sm font-medium text-white">
          {to}
        </p>
      </div>
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

  const isHealthy =
    normalized === "online" ||
    normalized === "running" ||
    normalized === "generating";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
        isHealthy
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}