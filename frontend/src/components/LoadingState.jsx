import { RefreshCw } from "lucide-react";

export default function LoadingState({
  message = "Loading...",
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <RefreshCw
          size={17}
          className="animate-spin"
        />

        {message}
      </div>
    </div>
  );
}