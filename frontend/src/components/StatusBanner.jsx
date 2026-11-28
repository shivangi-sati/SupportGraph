import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function StatusBanner({ usingDemoData = false }) {
  const Icon = usingDemoData ? AlertTriangle : CheckCircle2;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-5 py-4 ${
        usingDemoData
          ? "border-amber-500/20 bg-amber-500/5"
          : "border-emerald-500/10 bg-emerald-500/5"
      }`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          usingDemoData ? "bg-amber-400/10" : "bg-emerald-400/10"
        }`}
      >
        <Icon
          size={17}
          className={usingDemoData ? "text-amber-400" : "text-emerald-400"}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-slate-200">
          {usingDemoData
            ? "Demo data is available"
            : "SupportGraph is operational"}
        </p>

        <p className="mt-0.5 text-xs text-slate-600">
          {usingDemoData
            ? "Live API is waking up — use Refresh to reconnect."
            : "Live API connected"}
        </p>
      </div>

      <span
        className={`ml-auto h-2 w-2 rounded-full ${
          usingDemoData
            ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
            : "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
        }`}
      />
    </div>
  );
}
