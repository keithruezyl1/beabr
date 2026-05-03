export function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";

  const styles =
    variant === "primary"
      ? "bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] shadow-[var(--shadow-sm)]"
      : variant === "secondary"
      ? "bg-[var(--color-primary-50)] text-[var(--color-primary-800)] hover:bg-[var(--color-primary-100)] border border-[var(--border-default)]"
      : variant === "ghost"
      ? "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--color-neutral-100)]"
      : variant === "danger"
      ? "bg-[var(--danger-bg)] text-[var(--danger-text)] hover:opacity-90 border border-[var(--border-default)]"
      : "";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

