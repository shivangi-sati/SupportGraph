import {
  LayoutDashboard,
  Ticket,
  MapPin,
  Activity,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 lg:block">
          <div className="sticky top-0 flex h-screen flex-col">

            <div className="border-b border-slate-800 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
                  <Activity size={20} strokeWidth={2.5} />
                </div>

                <div>
                  <h1 className="text-sm font-bold tracking-wide">
                    SupportGraph
                  </h1>
                  <p className="text-xs text-slate-500">
                    Support Intelligence
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-3 py-6">
              <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                Workspace
              </p>
              <div className="space-y-1">
                <NavItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  to="/dashboard"
                />

                <NavItem
                  icon={Ticket}
                  label="Tickets"
                  to="/tickets"
                />

                <NavItem
                  icon={MapPin}
                  label="Sites"
                  to="/sites"
                />
              </div>
            </nav>

            <div className="border-t border-slate-800 p-4">
              <div className="rounded-xl bg-slate-900 p-3">
                <p className="text-xs font-medium text-slate-300">
                  CognoDB
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-500">
                    Database connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-375 px-5 py-6 sm:px-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
          isActive
            ? "bg-slate-800 text-white"
            : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={
              isActive
                ? "text-emerald-400"
                : "text-slate-600 group-hover:text-slate-400"
            }
          />

          <span className="flex-1">{label}</span>

          {isActive && (
            <ChevronRight
              size={15}
              className="text-slate-600"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export default Layout;