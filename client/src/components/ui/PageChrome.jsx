/**
 * Consistent page chrome: gradient hero headers and icon-backed section titles
 * (see docs/DESIGN_GUIDELINES.md §26).
 */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  illustrationSrc,
  illustrationOnTop = false,
  textFullWidth = false,
  className = "",
}) {
  const hasIllustration = Boolean(illustrationSrc);
  return (
    <div
      className={`beabr-page-header-gradient relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] px-5 py-5 shadow-[var(--shadow-xs)] sm:px-6 sm:py-6 ${className}`}
    >
      {illustrationSrc ? (
        <img
          src={illustrationSrc}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-0 right-4 hidden h-[5.25rem] w-auto select-none object-contain object-bottom md:block sm:right-6 ${
            illustrationOnTop ? "z-[3]" : "z-[1]"
          }`}
        />
      ) : null}
      <div
        className={
          hasIllustration
            ? `relative ${illustrationOnTop ? "z-[1]" : "z-[2]"} flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-3`
            : "flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
        }
      >
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{eyebrow}</div>
          ) : null}
          <h1
            className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-2xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-3xl ${
              hasIllustration ? "mt-0.5" : "mt-1"
            }`}
          >
            <span className="min-w-0">{title}</span>
            {illustrationSrc ? (
              <img
                src={illustrationSrc}
                alt=""
                aria-hidden="true"
                className="pointer-events-none inline-block h-[1lh] w-auto shrink-0 select-none object-contain object-center md:hidden"
              />
            ) : null}
          </h1>
          {description ? (
            <p
              className={`${textFullWidth ? "" : "max-w-prose"} text-sm leading-snug text-[var(--text-secondary)] ${
                hasIllustration ? "mt-1.5" : "mt-2 leading-relaxed"
              }`}
            >
              {description}
            </p>
          ) : null}
        </div>

        <div
          className={
            hasIllustration
              ? "flex w-full shrink-0 flex-col items-end gap-1.5 md:w-auto"
              : "flex w-full shrink-0 flex-col items-end gap-3 md:w-auto"
          }
        >
          {actions ? (
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">{actions}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function PageSectionTitle({ icon: Icon, children, className = "" }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] ${className}`}
    >
      {Icon ? (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      ) : null}
      {children}
    </div>
  );
}
