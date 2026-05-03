export function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-[var(--shadow-xs)] ${className}`}
      {...props}
    />
  );
}

