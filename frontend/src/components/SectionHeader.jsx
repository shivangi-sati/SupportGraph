export default function SectionHeader({
  eyebrow,
  title,
  rightContent,
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600">
            {eyebrow}
          </p>
        )}

        {title && (
          <h2 className="mt-1 text-lg font-semibold text-white">
            {title}
          </h2>
        )}
      </div>

      {rightContent && (
        <div className="text-xs text-slate-600">
          {rightContent}
        </div>
      )}
    </div>
  );
}