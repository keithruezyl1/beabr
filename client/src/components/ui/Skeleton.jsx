/**
 * Placeholder block with a passing light shimmer. Use one Skeleton per logical block
 * so each region animates (optionally stagger with delayMs).
 */
export function Skeleton({ className = "", delayMs = 0, ...props }) {
  return (
    <div
      aria-hidden
      className={`beabr-skeleton ${className}`}
      style={{ ["--beabr-skeleton-delay"]: `${delayMs}ms` }}
      {...props}
    />
  );
}
