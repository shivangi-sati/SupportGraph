import { ChevronRight } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  description,
  danger = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-500/30 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            danger
              ? "bg-red-500/10 text-red-400"
              : "bg-emerald-400/10 text-emerald-400"
          }`}
        >
          <Icon size={19} />
        </div>

        <ChevronRight
          size={17}
          className="text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
        />
      </div>

      <div className="mt-5">
        <p className="text-sm text-slate-500">{label}</p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-white">
          {value}
        </h2>

        <p className="mt-2 text-xs text-slate-600">
          {description}
        </p>
      </div>
    </button>
  );
}