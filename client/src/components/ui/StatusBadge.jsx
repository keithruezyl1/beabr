const styles = {
  Available: "bg-[var(--color-primary-50)] text-[var(--color-primary-800)] ring-1 ring-[rgba(129,160,63,0.18)]",
  "Partially Reserved": "bg-[var(--color-primary-100)] text-[var(--color-primary-800)] ring-1 ring-[rgba(129,160,63,0.18)]",
  Reserved: "bg-[var(--color-primary-100)] text-[var(--color-primary-800)] ring-1 ring-[rgba(129,160,63,0.18)]",
  "Partially Prepared": "bg-[var(--color-primary-100)] text-[var(--color-primary-800)] ring-1 ring-[rgba(129,160,63,0.18)]",
  Prepared: "bg-[var(--color-primary-100)] text-[var(--color-primary-800)] ring-1 ring-[rgba(129,160,63,0.18)]",
  Closed: "bg-[var(--color-neutral-200)] text-[var(--text-muted)]",
};

/** Title-case status for display (handles reserved, pending_review, partially reserved, etc.). */
export function formatStatusLabel(raw) {
  if (raw == null || raw === "") return "";
  return String(raw)
    .trim()
    .replace(/\s+/g, "_")
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function IconUser({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function resolveByPrefix(label) {
  const s = String(label || "").toLowerCase();
  if (s.includes("reserved")) return { desktop: "Reserved by", mobile: "Reserved" };
  if (s.includes("prepared")) return { desktop: "Prepared by", mobile: "Prepared" };
  if (s.includes("closed")) return { desktop: "Closed by", mobile: "Closed" };
  return null;
}

export function StatusBadge({ status, byAvatarUrl, byInitials, byAriaLabel = "Status actor" }) {
  const label = formatStatusLabel(status) || "Available";
  const cls = styles[label] || styles.Available;
  const byPrefix = resolveByPrefix(label);
  const showBy = Boolean(byPrefix && label !== "Available");
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {showBy ? (
        <>
          <span className="mr-1.5">
            <span className="hidden sm:inline">{byPrefix.desktop}</span>
            <span className="sm:hidden">{byPrefix.mobile}</span>
          </span>
          {byAvatarUrl ? (
            <img
              src={byAvatarUrl}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 rounded-full object-cover ring-1 ring-[rgba(0,0,0,0.06)]"
            />
          ) : byInitials ? (
            <span
              className="grid h-5 w-5 place-items-center rounded-full bg-white/70 text-[10px] font-bold ring-1 ring-[rgba(0,0,0,0.06)]"
              aria-hidden="true"
            >
              {String(byInitials).slice(0, 2).toUpperCase()}
            </span>
          ) : (
            <span
              className="grid h-5 w-5 place-items-center rounded-full bg-white/70 ring-1 ring-[rgba(0,0,0,0.06)]"
              aria-label={byAriaLabel}
            >
              <IconUser className="h-3.5 w-3.5 opacity-80" />
            </span>
          )}
        </>
      ) : (
        label
      )}
    </span>
  );
}

export function StatusBadgeBy({
  tone = "neutral",
  prefix,
  prefixMobile,
  byAvatarUrl,
  byInitials,
  byAriaLabel = "Status actor",
}) {
  const cls =
    tone === "warning"
      ? styles.Reserved
      : tone === "success"
        ? styles.Prepared
        : tone === "closed"
          ? styles.Closed
          : styles.Available;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <span className="mr-1.5 max-w-[9.5rem] truncate">
        <span className="hidden sm:inline">{prefix}</span>
        <span className="sm:hidden">{prefixMobile ?? prefix}</span>
      </span>
      {byAvatarUrl ? (
        <img
          src={byAvatarUrl}
          alt=""
          aria-hidden="true"
          className="h-5 w-5 rounded-full object-cover ring-1 ring-[rgba(0,0,0,0.06)]"
        />
      ) : byInitials ? (
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white/70 text-[10px] font-bold ring-1 ring-[rgba(0,0,0,0.06)]" aria-hidden="true">
          {String(byInitials).slice(0, 2).toUpperCase()}
        </span>
      ) : (
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white/70 ring-1 ring-[rgba(0,0,0,0.06)]" aria-label={byAriaLabel}>
          <IconUser className="h-3.5 w-3.5 opacity-80" />
        </span>
      )}
    </span>
  );
}

