import { Skeleton } from "../components/ui/Skeleton.jsx";

/**
 * Layout mirrors DocumentationPage article chrome for consistent perceived loading.
 */
export function DocumentationArticleSkeleton({ routeLabel, routeId, helpArticleBadge }) {
  return (
    <article
      className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-6 shadow-[var(--shadow-sm)] sm:px-6 sm:py-8 md:px-9 md:py-10"
      aria-busy="true"
      aria-live="polite"
      aria-labelledby="documentation-skeleton-heading"
    >
      <header className="border-b border-[var(--border-subtle)] pb-5">
        <Skeleton className="h-3 w-28 rounded-full" delayMs={0} />
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div id="documentation-skeleton-heading" className="min-w-0 flex-1">
            <Skeleton className="h-9 max-w-xl rounded-[10px]" delayMs={50} />
          </div>
          {helpArticleBadge ? (
            <span
              className="inline-flex w-fit shrink-0 items-center rounded-full border border-[var(--border-default)] bg-[var(--surface-card-soft)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary-800)] opacity-80 sm:mt-1"
              aria-hidden
            >
              {helpArticleBadge}
            </span>
          ) : null}
        </div>
        {routeLabel ? (
          <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">{routeLabel}</p>
        ) : (
          <Skeleton className="mt-4 h-3 w-40 rounded-full" delayMs={100} />
        )}
      </header>

      <div className="space-y-4 pt-8" role="status">
        <span className="sr-only">
          Loading documentation{routeId ? `: ${routeId}` : ""}
        </span>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={i === 0 ? "space-y-2" : "space-y-2"}>
            <Skeleton className={`h-4 rounded-[8px] ${i === 0 ? "w-[92%]" : i === 1 ? "w-[88%]" : "w-full"}`} delayMs={120 + i * 50} />
            {i === 2 ? <Skeleton className="mt-3 h-4 w-[76%] rounded-[8px]" delayMs={300} /> : null}
          </div>
        ))}
        <Skeleton className="mt-8 h-[120px] w-full rounded-[var(--radius-md)]" delayMs={420} />
        <Skeleton className="h-4 w-[70%] rounded-[8px]" delayMs={480} />
      </div>
    </article>
  );
}
