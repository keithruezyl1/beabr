import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { PageHeader, PageSectionTitle } from "../components/ui/PageChrome.jsx";
import { ViewerFacepile } from "../components/registry/ViewerFacepile.jsx";
import { ShareInviteModal } from "../components/registry/ShareInviteModal.jsx";
import { JoinRegistryModal } from "../components/registry/JoinRegistryModal.jsx";
import {
  IconCalendar,
  IconChevronRight,
  IconClock,
  IconHome,
  IconPlus,
  IconUsers,
} from "../components/ui/PageIcons.jsx";
import { useAuth } from "../state/AuthProvider.jsx";
import { DashboardRegistriesSkeleton } from "../components/ui/ScreenSkeletons.jsx";
import wavingDash from "../assets/waving_dash.png";
import { getDisplayAvatarUrl } from "../utils/avatar.js";

function formatRevealLines(iso) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
  };
}

/** Short countdown for upcoming reveal (client-side). */
function formatCloseCountdown(iso, closed) {
  if (closed) return null;
  const end = new Date(iso);
  const ms = end.getTime() - Date.now();
  if (ms <= 0) return null;
  const mins = Math.floor(ms / 60000);
  const hours = Math.floor(ms / 3600000);
  const days = Math.floor(ms / 86400000);
  if (days >= 2) return `${days} days`;
  if (days === 1) return "tomorrow";
  if (hours >= 2) return `${hours} hours`;
  if (hours === 1) return "1 hour";
  if (mins > 1) return `${mins} minutes`;
  return "soon";
}

function registrySubtitle(registry) {
  if (registry.role === "owner") return null;
  if (registry.ownerDisplayName) return `Created by ${registry.ownerDisplayName}`;
  return "Joined registry";
}

function rosterAriaSnippet(registry) {
  const vr = registry.viewerRoster;
  if (!vr) return "";
  if (vr.viewerCount === 0) return "No gift givers yet.";
  if (vr.identityHidden)
    return `${vr.viewerCount} gift givers joined; names are private until reveal.`;
  return `${vr.viewerCount} ${vr.viewerCount === 1 ? "loved one" : "loved ones"} in this registry.`;
}

/** Full-card navigation without wrapping interactive children in `<a>` (invalid HTML; breaks share control). */
function RegistryCardNavWrap({ registryId, ariaLabel, children }) {
  return (
    <div className="group/card relative block min-w-0 rounded-[24px] ring-0 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-md)] hover:ring-2 hover:ring-[var(--color-primary-500)] focus-within:ring-2 focus-within:ring-[var(--color-primary-500)]">
      <Link
        to={`/registry/${registryId}`}
        className="absolute inset-0 z-0 rounded-[24px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2"
        aria-label={ariaLabel}
      />
      <div className="relative z-[1] pointer-events-none">{children}</div>
    </div>
  );
}

function registryCardAriaLabel(registry) {
  const { date, time } = formatRevealLines(registry.closeDatetime || registry.revealDatetime);
  const subtitle = registrySubtitle(registry);
  const roster = rosterAriaSnippet(registry);
  return [
    registry.title,
    subtitle,
    roster || null,
    `Registry closes ${date} at ${time}.`,
    registry.closed ? "Closed." : "Open.",
    "Open registry.",
  ]
    .filter(Boolean)
    .join(" ");
}

function RegistryCard({ registry }) {
  const [shareOpen, setShareOpen] = useState(false);
  const { date, time } = formatRevealLines(registry.closeDatetime || registry.revealDatetime);
  const countdown = formatCloseCountdown(registry.closeDatetime || registry.revealDatetime, registry.closed);
  const subtitle = registrySubtitle(registry);
  const patterned = registry.role === "owner";

  return (
    <Card className="relative h-full overflow-hidden p-0 shadow-[var(--shadow-xs)]">
      {patterned ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-0 select-none"
            aria-hidden
            style={{
              backgroundColor: "rgba(129, 160, 63, 0.06)",
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(75, 82, 67, 0.22) 2px, transparent 2.25px)",
              backgroundSize: "14px 14px",
              maskImage:
                "linear-gradient(to top right, transparent 0%, rgba(0,0,0,0.2) 18%, rgba(0,0,0,0.95) 38%, rgba(0,0,0,0.95) 58%, rgba(0,0,0,0.25) 78%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to top right, transparent 0%, rgba(0,0,0,0.2) 18%, rgba(0,0,0,0.95) 38%, rgba(0,0,0,0.95) 58%, rgba(0,0,0,0.25) 78%, transparent 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(to bottom right, var(--surface-card) 0%, rgba(255, 255, 255, 0.88) 18%, rgba(250, 251, 247, 0.35) 42%, transparent 62%)",
            }}
            aria-hidden
          />
        </>
      ) : null}
      <div className="relative z-[1] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold leading-snug tracking-tight text-[var(--text-primary)] sm:text-xl">
              {registry.title}
            </h3>
            {subtitle ? (
              <div className="mt-1 flex min-w-0 items-center gap-2">
                {registry.role !== "owner" ? (
                  <img
                    src={getDisplayAvatarUrl(registry.ownerAvatarUrl)}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-[var(--border-subtle)]"
                  />
                ) : null}
                <p className="min-w-0 text-sm text-[var(--text-secondary)]">{subtitle}</p>
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                registry.closed
                  ? "bg-[var(--success-bg)] text-[var(--success-text)]"
                  : "bg-[var(--warning-bg)] text-[var(--warning-text)]"
              }`}
            >
              {registry.closed ? "Closed" : "Open"}
            </div>
            <IconChevronRight
              className="h-5 w-5 shrink-0 text-[var(--color-primary-400)] transition-transform duration-200 group-hover/card:translate-x-0.5"
              aria-hidden
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(9rem,12.5rem)]">
          <div className="flex h-[5.75rem] min-h-[5.75rem] min-w-0 items-center gap-3 overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] p-3 ring-1 ring-[var(--border-subtle)]">
            <div className="flex shrink-0 flex-col items-center justify-center text-[var(--color-primary-600)]">
              <IconCalendar className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                {countdown ? `Closes in ${countdown}` : "Closes"}
              </div>
              <div className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">{date}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <IconClock className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" aria-hidden />
                <span className="tabular-nums">{time}</span>
              </div>
            </div>
          </div>
          <div className="h-[5.75rem] min-h-[5.75rem] min-w-0">
            <ViewerFacepile
              roster={registry.viewerRoster}
              role={registry.role}
              compact
              onShareInvite={
                registry.role === "owner" && registry.joinCode ? () => setShareOpen(true) : undefined
              }
            />
          </div>
        </div>
      </div>
      {registry.role === "owner" && registry.joinCode ? (
        <ShareInviteModal
          joinCode={registry.joinCode}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      ) : null}
    </Card>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const location = useLocation();
  const nav = useNavigate();
  const [registries, setRegistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinModalInitialCode, setJoinModalInitialCode] = useState("");
  /** Bump when opening join modal so it remounts with fresh form state (avoids reset effects). */
  const [joinModalSession, setJoinModalSession] = useState(0);
  const [sessionGreeting, setSessionGreeting] = useState("Hello");

  useEffect(() => {
    const key = "beabr.dashboardGreeting";
    const existing = sessionStorage.getItem(key);
    if (existing === "Hello" || existing === "Hey there") {
      setSessionGreeting(existing);
      return;
    }
    const next = Math.random() < 0.5 ? "Hello" : "Hey there";
    sessionStorage.setItem(key, next);
    setSessionGreeting(next);
  }, []);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setErr(null);
      try {
        const data = await apiFetch("/api/registries");
        setRegistries(data.registries || []);
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    }
    run();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const joinCode = params.get("joinCode");
    const shouldOpenJoin = params.get("join") === "1";
    if (!joinCode && !shouldOpenJoin) return;

    setJoinModalInitialCode(joinCode ? joinCode.trim().toUpperCase() : "");
    setJoinModalSession((s) => s + 1);
    setJoinModalOpen(true);

    params.delete("joinCode");
    params.delete("join");
    const nextSearch = params.toString();
    nav(`${location.pathname}${nextSearch ? `?${nextSearch}` : ""}`, { replace: true });
  }, [location.pathname, location.search, nav]);

  const yourRegistries = registries.filter((r) => r.role === "owner" && !r.finished);
  const joinedRegistries = registries.filter((r) => r.role !== "owner");

  /** Full-width row when only one card; otherwise max two columns so tiles stay wide (never 3-up). */
  function registryGridClass(count) {
    if (count <= 1) return "grid grid-cols-1 gap-3";
    return "grid grid-cols-1 gap-3 sm:grid-cols-2";
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Home"
        title={`${sessionGreeting}, ${user?.name?.split(" ")[0] || "there"}`}
        description="Welcome to Beabr! Create a registry or join one with a code to start."
        illustrationSrc={wavingDash}
        illustrationOnTop
        actions={
          <>
            <Link className="w-full sm:w-auto" to="/registries/new" data-tour-id="dashboard-create-registry">
              <Button className="w-full gap-2 sm:w-auto">
                <IconPlus className="h-4 w-4 shrink-0" aria-hidden />
                Create registry
              </Button>
            </Link>
            <Button
              type="button"
              variant="secondary"
              className="w-full gap-2 sm:w-auto"
              onClick={() => {
                setJoinModalInitialCode("");
                setJoinModalSession((s) => s + 1);
                setJoinModalOpen(true);
              }}
            >
              <IconUsers className="h-4 w-4 shrink-0" aria-hidden />
              Join with code
            </Button>
          </>
        }
      />

      {loading ? (
        <DashboardRegistriesSkeleton />
      ) : err ? (
        <Card className="border border-[rgba(155,28,28,0.2)] bg-[var(--danger-bg)] p-5">
          <div className="text-sm font-semibold text-[var(--danger-text)]">{err.message}</div>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            <PageSectionTitle icon={IconHome}>Your registries</PageSectionTitle>
            {yourRegistries.length === 0 ? (
              <Card className="p-6 shadow-[var(--shadow-xs)]">
                <div className="text-sm font-semibold text-[var(--text-primary)]">No registries yet</div>
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  Create one to get started, then share the code or link with gift givers.
                </div>
                <div className="mt-4">
                  <Link to="/registries/new" data-tour-id="dashboard-create-registry">
                    <Button className="gap-2">
                      <IconPlus className="h-4 w-4" aria-hidden />
                      Create registry
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className={registryGridClass(yourRegistries.length)}>
                {yourRegistries.map((r) => (
                  <RegistryCardNavWrap key={r.id} registryId={r.id} ariaLabel={registryCardAriaLabel(r)}>
                    <RegistryCard registry={r} />
                  </RegistryCardNavWrap>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <PageSectionTitle icon={IconUsers}>Joined registries</PageSectionTitle>
            {joinedRegistries.length === 0 ? (
              <Card className="p-6 shadow-[var(--shadow-xs)]">
                <div className="text-sm font-semibold text-[var(--text-primary)]">No joined registries</div>
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  Know someone who has a registry? Join with a code to reserve or prepare gifts for them.
                </div>
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="gap-2"
                    onClick={() => {
                      setJoinModalInitialCode("");
                      setJoinModalSession((s) => s + 1);
                      setJoinModalOpen(true);
                    }}
                  >
                    <IconUsers className="h-4 w-4" aria-hidden />
                    Join with code
                  </Button>
                </div>
              </Card>
            ) : (
              <div className={registryGridClass(joinedRegistries.length)}>
                {joinedRegistries.map((r) => (
                  <RegistryCardNavWrap key={r.id} registryId={r.id} ariaLabel={registryCardAriaLabel(r)}>
                    <RegistryCard registry={r} />
                  </RegistryCardNavWrap>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <JoinRegistryModal
        key={joinModalSession}
        open={joinModalOpen}
        initialCode={joinModalInitialCode}
        onClose={() => {
          setJoinModalOpen(false);
          setJoinModalInitialCode("");
        }}
      />
    </div>
  );
}

