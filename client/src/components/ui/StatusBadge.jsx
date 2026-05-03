const styles = {
  Available: "bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]",
  "Partially Reserved": "bg-[var(--warning-bg)] text-[var(--warning-text)]",
  Reserved: "bg-[var(--warning-bg)] text-[var(--warning-text)]",
  "Partially Prepared": "bg-[var(--success-bg)] text-[var(--success-text)]",
  Prepared: "bg-[var(--success-bg)] text-[var(--success-text)]",
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

export function StatusBadge({ status }) {
  const label = formatStatusLabel(status) || "Available";
  const cls = styles[label] || styles.Available;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

