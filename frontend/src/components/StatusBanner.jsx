import { CheckCircle2 } from "lucide-react";

export default function StatusBanner() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 px-5 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10">
        <CheckCircle2
          size={17}
          className="text-emerald-400"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-slate-200">
          SupportGraph is operational
        </p>

        <p className="mt-0.5 text-xs text-slate-600">
          Connected to CognoDB
        </p>
      </div>

      <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
    </div>
  );
}