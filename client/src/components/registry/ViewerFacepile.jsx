import { IconShare, IconUsers } from "../ui/PageIcons.jsx";

const MAX_VISIBLE = 5;

/**
 * @param {{ viewerRoster?: { viewerCount: number; identityHidden: boolean; faces: Array<{ userId: string; displayName: string; photoUrl: string | null; initials: string; accentHue: number; isYou: boolean }> }; role: string; compact?: boolean; onShareInvite?: () => void }} props
 */
export function ViewerFacepile({ roster, role, compact = false, onShareInvite }) {
  const viewerCount = roster?.viewerCount ?? 0;
  const identityHidden = roster?.identityHidden === true;
  const faces = roster?.faces ?? [];

  const shell = compact
    ? "flex h-[5.75rem] min-h-[5.75rem] max-h-[5.75rem] flex-col overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] px-2.5 py-2 ring-1 ring-[var(--border-subtle)]"
    : "rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] px-3 py-3 ring-1 ring-[var(--border-subtle)]";
  const titleCls = compact ? "text-xs font-semibold leading-snug text-[var(--text-primary)]" : "text-sm font-semibold text-[var(--text-primary)]";
  const subCls = compact ? "mt-0.5 text-[11px] leading-snug text-[var(--text-secondary)]" : "mt-1 text-xs leading-relaxed text-[var(--text-secondary)]";
  const avatarSm = compact ? "h-8 w-8" : "h-9 w-9";
  const iconSm = compact ? "h-3.5 w-3.5" : "h-4 w-4";
  const initialsSm = compact ? "text-[10px]" : "text-[11px]";
  const maxStack = compact ? 4 : MAX_VISIBLE;

  if (viewerCount === 0) {
    /** Compact dashboard: text left, larger share control on the right (mobile); icon scales down on md+. */
    if (compact && role === "owner" && onShareInvite) {
      return (
        <div className={`${shell} justify-center`}>
          <div className="flex min-h-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold leading-snug text-[var(--text-primary)]">No gift givers yet</p>
              <p className="mt-1 text-[11px] leading-snug text-[var(--text-secondary)]">Share your invite link.</p>
            </div>
            <button
              type="button"
              className="relative z-[2] inline-flex shrink-0 items-center justify-center rounded-md p-2 text-[var(--color-primary-600)] transition-colors hover:text-[var(--color-primary-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2 pointer-events-auto md:min-h-[44px] md:min-w-[44px] md:p-2.5"
              aria-label="Share invite link and join code"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShareInvite();
              }}
            >
              <IconShare className="h-5 w-5 shrink-0 opacity-90 md:h-3 md:w-3" aria-hidden />
            </button>
          </div>
        </div>
      );
    }

    const ownerShareHint = (
      <div
        className={
          compact
            ? "mt-1 flex flex-wrap items-center gap-1 text-[11px] leading-snug text-[var(--text-secondary)]"
            : "mt-1 flex flex-wrap items-center gap-1 text-xs leading-relaxed text-[var(--text-secondary)]"
        }
      >
        <span>{compact ? "Share your invite link." : "Share your invite link or code so friends and family can join."}</span>
        {onShareInvite ? (
          <button
            type="button"
            className="relative z-[2] inline-flex min-h-[44px] min-w-[44px] shrink-0 -translate-y-px items-center justify-center rounded-md p-2.5 text-[var(--color-primary-600)] transition-colors hover:text-[var(--color-primary-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2 pointer-events-auto"
            aria-label="Share invite link and join code"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShareInvite();
            }}
          >
            <IconShare className="h-3 w-3 shrink-0 opacity-90" aria-hidden />
          </button>
        ) : null}
      </div>
    );

    return (
      <div className={compact ? `${shell} justify-center` : shell}>
        <p className={compact ? "text-xs font-semibold leading-snug text-[var(--text-primary)]" : "text-sm font-medium text-[var(--text-primary)]"}>
          No gift givers yet
        </p>
        {role === "owner" ? (
          ownerShareHint
        ) : (
          <p className={compact ? "mt-1 text-[11px] leading-snug text-[var(--text-secondary)]" : "mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]"}>
            {compact ? "Others appear here when they join." : "Invite others with the registry link—when someone joins, they’ll show up here."}
          </p>
        )}
      </div>
    );
  }

  const headline =
    viewerCount === 1
      ? compact
        ? "1 gift giver"
        : "There is 1 person in this registry"
      : compact
        ? `${viewerCount} gift givers`
        : `There are ${viewerCount} people in this registry`;

  if (identityHidden) {
    const shown = Math.min(viewerCount, maxStack);
    const extra = viewerCount > maxStack ? viewerCount - maxStack : 0;
    return (
      <div className={shell}>
        <div className="flex items-start justify-between gap-3">
          <p className={titleCls}>{headline}</p>
          {role === "owner" && onShareInvite ? (
            <button
              type="button"
              className="relative z-[2] inline-flex shrink-0 items-center justify-center rounded-md p-2 text-[var(--color-primary-600)] transition-colors hover:text-[var(--color-primary-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2 pointer-events-auto"
              aria-label="Share invite link and join code"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShareInvite();
              }}
            >
              <IconShare className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            </button>
          ) : null}
        </div>
        <p className={compact ? `${subCls} relative z-[2] min-h-[0.875rem] shrink-0 truncate` : `${subCls}`}>
          {compact ? "Hidden until reveal." : "Names and photos stay private until reveal—you’ll see who joined after the reveal time."}
        </p>
        <div className={`relative z-[1] flex items-center gap-1.5 ${compact ? "mt-auto pt-1" : "mt-3"}`} aria-hidden="true">
          <div className="flex -space-x-2 pl-0.5">
            {Array.from({ length: shown }).map((_, i) => (
              <div
                key={i}
                className={`flex ${avatarSm} items-center justify-center rounded-full border-2 border-[var(--color-primary-500)] bg-[var(--color-neutral-200)] text-[var(--color-primary-600)] shadow-[var(--shadow-xs)]`}
                style={{ zIndex: i + 1 }}
              >
                <IconUsers className={`${iconSm} shrink-0 opacity-80`} />
              </div>
            ))}
          </div>
          {extra > 0 ? (
            <span className="text-[11px] font-semibold tabular-nums text-[var(--text-muted)]">+{extra}</span>
          ) : null}
        </div>
      </div>
    );
  }

  const visible = faces.slice(-maxStack);
  const overflow = viewerCount > maxStack ? viewerCount - maxStack : 0;
  const onlyYou = viewerCount === 1 && faces[0]?.isYou;

  return (
    <div className={`${shell} ${compact ? "justify-between" : ""}`}>
      <div className={compact ? "min-h-0 shrink" : ""}>
        <div className="flex items-start justify-between gap-3">
          <p className={titleCls}>{headline}</p>
          {role === "owner" && onShareInvite ? (
            <button
              type="button"
              className="relative z-[2] inline-flex shrink-0 items-center justify-center rounded-md p-2 text-[var(--color-primary-600)] transition-colors hover:text-[var(--color-primary-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2 pointer-events-auto"
              aria-label="Share invite link and join code"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShareInvite();
              }}
            >
              <IconShare className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            </button>
          ) : null}
        </div>
        {onlyYou ? (
          <p className={compact ? "mt-0.5 text-[11px] text-[var(--text-secondary)]" : "mt-1 text-xs text-[var(--text-secondary)]"}>
            {compact ? "Just you so far." : "You’re the only gift giver here so far."}
          </p>
        ) : null}
      </div>
      <div className={`flex flex-wrap items-center gap-x-1.5 gap-y-1.5 ${compact ? "mt-2" : "mt-3"}`}>
        <div className="flex -space-x-2 pl-0.5">
          {visible.map((face, i) => (
            <div
              key={face.userId}
              className="relative shrink-0 rounded-full"
              title={face.displayName}
              style={{ zIndex: i + 1 }}
            >
              {face.photoUrl ? (
                <img
                  src={face.photoUrl}
                  alt=""
                  className={`${avatarSm} rounded-full border-2 border-[var(--color-primary-500)] object-cover shadow-[var(--shadow-xs)]`}
                />
              ) : (
                <div
                  className={`flex ${avatarSm} items-center justify-center rounded-full border-2 border-[var(--color-primary-500)] font-semibold shadow-[var(--shadow-xs)] ${initialsSm}`}
                  style={{
                    backgroundColor: `hsl(${face.accentHue} 42% 88%)`,
                    color: `hsl(${face.accentHue} 38% 22%)`,
                  }}
                  aria-hidden="true"
                >
                  {face.initials}
                </div>
              )}
            </div>
          ))}
        </div>
        {overflow > 0 ? (
          <span className="text-[11px] font-semibold tabular-nums text-[var(--text-muted)]">+{overflow}</span>
        ) : null}
      </div>
      <ul className="sr-only">
        {faces.map((face) => (
          <li key={face.userId}>
            {face.displayName}
            {face.isYou ? " (you)" : ""}
            {face.photoUrl ? ", profile photo shown" : ", initials only"}
          </li>
        ))}
      </ul>
    </div>
  );
}
