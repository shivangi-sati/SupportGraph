import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  message = "Unable to load data.",
  onRetry,
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <AlertTriangle size={22} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-white">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {message}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}