import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Server,
  Ticket,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getDashboard, getDataSource } from "../services/api";

import StatCard from "../components/StatCard";
import StatusBanner from "../components/StatusBanner";
import SectionHeader from "../components/SectionHeader";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingDemoData, setUsingDemoData] = useState(false);

  const applyDashboard = useCallback((result) => {
    setData(result);
    setUsingDemoData(getDataSource() === "demo");
  }, []);

  const reportError = useCallback((error) => {
    console.error("Dashboard error:", error);
    setError("Unable to load dashboard data.");
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      applyDashboard(await getDashboard());
    } catch (error) {
      reportError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    getDashboard()
      .then((result) => {
        if (active) {
          applyDashboard(result);
        }
      })
      .catch((error) => {
        if (active) {
          reportError(error);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [applyDashboard, reportError]);

  if (loading) {
    return (
      <LoadingState message="Loading support data..." />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        message={error}
        onRetry={loadDashboard}
      />
    );
  }

  const greeting = getGreeting();

  return (
    <div className="space-y-8">

      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
            Support Operations
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {greeting}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Investigate customer issues through connected tickets,
            sites, applications and operational data.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </header>

      <StatusBanner usingDemoData={usingDemoData} />

      <section>
        <SectionHeader
          eyebrow="System Overview"
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Total Tickets"
            value={data.totalTickets}
            icon={Ticket}
            description="All recorded incidents"
            onClick={() => navigate("/tickets")}
          />

          <StatCard
            label="Open Tickets"
            value={data.openTickets}
            icon={AlertTriangle}
            description="Require attention"
            danger={data.openTickets > 0}
            onClick={() =>
              navigate("/tickets?status=Open")
            }
          />

          <StatCard
            label="Resolved"
            value={data.resolvedTickets}
            icon={CheckCircle2}
            description="Successfully resolved"
            onClick={() =>
              navigate("/tickets?status=Resolved")
            }
          />

          <StatCard
            label="Offline Sites"
            value={data.offlineSites}
            icon={Server}
            description="Currently offline"
            danger={data.offlineSites > 0}
            onClick={() =>
              navigate("/sites?status=Offline")
            }
          />

          <StatCard
            label="Data Issues"
            value={data.filesNotGenerating}
            icon={Database}
            description="Files not generating"
            danger={data.filesNotGenerating > 0}
            onClick={() =>
              navigate("/sites?status=data-issue")
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
        <div className="border-b border-slate-800 px-6 py-5">
          <SectionHeader
            eyebrow="Historical Patterns"
            title="Common Issues"
            rightContent="Based on support tickets"
          />
        </div>

        <div className="divide-y divide-slate-800">
          {data.commonIssues?.length > 0 ? (
            data.commonIssues.map((item, index) => (
              <button
                key={item.issue}
                type="button"
                onClick={() =>
                  navigate(
                    `/tickets?issue=${encodeURIComponent(
                      item.issue
                    )}`
                  )
                }
                className="group flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-slate-800/30"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-semibold text-slate-500">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200 group-hover:text-white">
                    {item.issue}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Reported across {item.count} support{" "}
                    {item.count === 1
                      ? "incident"
                      : "incidents"}
                  </p>
                </div>

                <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-800 px-3 text-sm font-semibold text-emerald-400">
                  {item.count}
                </div>
              </button>
            ))
          ) : (
            <div className="px-6 py-10 text-center text-sm text-slate-600">
              No issue data available.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}