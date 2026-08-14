import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Ticket, ArrowRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get("status");
  const issueFilter = searchParams.get("issue");

  useEffect(() => {
    fetch(`${API_URL}/api/tickets`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        return response.json();
      })
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch tickets:", error);
        setLoading(false);
      });
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const value = search.toLowerCase();

    const matchesSearch =
      ticket.ticketId?.toLowerCase().includes(value) ||
      ticket.title?.toLowerCase().includes(value) ||
      ticket.customer?.toLowerCase().includes(value) ||
      ticket.site?.toLowerCase().includes(value) ||
      ticket.issue?.toLowerCase().includes(value);

    const matchesStatus =
      !statusFilter ||
      ticket.status?.toLowerCase() ===
        statusFilter.toLowerCase();

    const matchesIssue =
      !issueFilter ||
      ticket.issue?.toLowerCase() ===
        issueFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesStatus &&
      matchesIssue
    );
  });

  const priorityClass = (priority) => {
    if (priority === "High") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    if (priority === "Medium") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  return (
    <div className="min-h-screen bg-[#050518] text-white p-8">

      <div className="mb-8">
        <p className="text-sm font-semibold tracking-[0.25em] text-emerald-400">
          SUPPORT OPERATIONS
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold">
              Tickets
            </h1>

            <p className="mt-2 text-slate-400">
              Investigate and resolve customer support incidents.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#10102b] px-4 py-3">
            <span className="text-2xl font-semibold">
              {filteredTickets.length}
            </span>

            <span className="ml-2 text-sm text-slate-400">
              {statusFilter || issueFilter
                ? "matching tickets"
                : "total tickets"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center rounded-xl border border-white/10 bg-[#10102b] px-4">
        <Search
          size={20}
          className="text-slate-500"
        />

        <input
          type="text"
          placeholder="Search tickets, customers, sites or issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>

      {(statusFilter || issueFilter) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">

          <span className="text-xs text-slate-500">
            Active filters:
          </span>

          {statusFilter && (
            <span className="rounded-lg bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              Status: {statusFilter}
            </span>
          )}

          {issueFilter && (
            <span className="rounded-lg bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              Issue: {issueFilter}
            </span>
          )}

          <Link
            to="/tickets"
            className="ml-1 text-xs text-slate-500 transition hover:text-white"
          >
            Clear filters
          </Link>
        </div>
      )}

      {loading && (
        <div className="py-20 text-center text-slate-400">
          Loading tickets...
        </div>
      )}

      {!loading && (
        <div className="space-y-4">

          {filteredTickets.map((ticket) => (
            <div
              key={ticket.ticketId}
              className="group rounded-2xl border border-white/10 bg-[#10102b] p-6 transition hover:border-emerald-400/30 hover:bg-[#131333]"
            >
              <div className="flex items-start justify-between gap-6">

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                    <Ticket size={21} />
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold tracking-wider text-emerald-400">
                        {ticket.ticketId}
                      </span>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${priorityClass(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>

                    <h2 className="mt-2 text-lg font-semibold">
                      {ticket.title}
                    </h2>

                    <p className="mt-1 max-w-2xl text-sm text-slate-400">
                      {ticket.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-lg bg-white/5 px-3 py-1.5 text-slate-300">
                        {ticket.customer}
                      </span>

                      <span className="rounded-lg bg-white/5 px-3 py-1.5 text-slate-300">
                        {ticket.site}
                      </span>

                      <span className="rounded-lg bg-white/5 px-3 py-1.5 text-slate-300">
                        {ticket.issue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-4">

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                    {ticket.status}
                  </span>

                  <Link
                    to={`/tickets/${ticket.ticketId}`}
                    className="flex items-center gap-2 text-sm text-slate-400 transition group-hover:text-emerald-400"
                  >
                    Investigate
                    <ArrowRight size={16} />
                  </Link>

                </div>
              </div>
            </div>
          ))}

          {filteredTickets.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#10102b] py-16 text-center">
              <p className="text-slate-400">
                No tickets found.
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default Tickets;