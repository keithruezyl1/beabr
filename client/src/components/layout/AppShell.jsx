import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../state/AuthProvider";
import logo from "../../assets/logo.png";
import { apiFetch } from "../../services/api";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { GuidedTour } from "../onboarding/GuidedTour.jsx";
import { IconBell, IconHome, IconWallet } from "../ui/PageIcons.jsx";
import { formatPesoDots } from "../../utils/numberFormat.js";
import { getDisplayAvatarUrl } from "../../utils/avatar.js";

function timeAgo(iso) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 10) return "Just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 14) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function maxIsoDate(rows, field) {
  let best = null;
  for (const r of rows || []) {
    const v = r?.[field];
    if (!v) continue;
    const t = new Date(v).getTime();
    if (!Number.isFinite(t)) continue;
    if (!best || t > best.t) best = { t, iso: new Date(t).toISOString() };
  }
  return best?.iso || null;
}

function mergeById(existing, incoming) {
  const map = new Map();
  for (const r of existing || []) map.set(r.id, r);
  for (const r of incoming || []) map.set(r.id, { ...(map.get(r.id) || {}), ...r });
  return [...map.values()];
}

export function AppShell({ children }) {
  const nav = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const showAppHeader = Boolean(user && location.pathname !== "/");

  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const profileRef = useRef(null);
  const profileMobileRef = useRef(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const notifMobileRef = useRef(null);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifErr, setNotifErr] = useState(null);
  const [notifRows, setNotifRows] = useState([]);

  const avatarUrl = useMemo(() => getDisplayAvatarUrl(user?.avatarUrl), [user?.avatarUrl]);
  const avatarFallback = useMemo(() => (user?.name ? user.name.slice(0, 1).toUpperCase() : "U"), [user]);

  const notifCacheKey = user?.id ? `beabr_notifs_v1:${user.id}` : "";

  useEffect(() => {
    if (!user?.id) return;
    const cachedNotifs = safeJsonParse(localStorage.getItem(notifCacheKey) || "");
    if (Array.isArray(cachedNotifs)) setNotifRows(cachedNotifs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!profileOpen) return;
      const t = e.target instanceof Node ? e.target : null;
      if (!t) return;
      const inDesktop = profileRef.current?.contains(t);
      const inMobile = profileMobileRef.current?.contains(t);
      if (!inDesktop && !inMobile) setProfileOpen(false);
    }
    function onDocMouseDownNotif(e) {
      if (!notifOpen) return;
      const t = e.target instanceof Node ? e.target : null;
      if (!t) return;
      const inDesktop = notifRef.current?.contains(t);
      const inMobile = notifMobileRef.current?.contains(t);
      if (!inDesktop && !inMobile) setNotifOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setNotifOpen(false);
        setConfirmLogoutOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("mousedown", onDocMouseDownNotif);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("mousedown", onDocMouseDownNotif);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [profileOpen, notifOpen]);

  async function refreshNotifications() {
    setNotifLoading(true);
    setNotifErr(null);
    try {
      const notifSince = maxIsoDate(notifRows, "createdAt");
      const notifUrl = notifSince ? `/api/notifications?since=${encodeURIComponent(notifSince)}` : "/api/notifications";
      const n = await apiFetch(notifUrl);

      setNotifRows((prev) => {
        const merged = mergeById(prev, n.notifications || []);
        localStorage.setItem(notifCacheKey, JSON.stringify(merged));
        return merged;
      });
    } catch (e) {
      setNotifErr(e);
    } finally {
      setNotifLoading(false);
    }
  }

  useEffect(() => {
    if (!showAppHeader) return;
    // light refresh on mount so the bell dot is accurate
    refreshNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAppHeader]);

  useEffect(() => {
    if (!notifOpen) return;
    refreshNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifOpen]);

  const notifStream = useMemo(() => {
    const items = [];
    for (const n of notifRows || []) {
      const payload = n.payload || {};
      const title =
        n.type === "pledge_receipt_uploaded"
          ? "Someone just contributed to your pledge!"
          : n.type === "pledge_goal_not_reached"
            ? `Pledge goal not reached â€” ${payload.itemTitle ?? "item"}`
            : n.type === "registry_member_joined"
              ? `${payload.joinedDisplayName ?? "Someone"} joined your registry`
              : n.type;
      const subtitle =
        n.type === "pledge_goal_not_reached"
          ? `${formatPesoDots(payload.gatheredAmount ?? 0, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} of ${formatPesoDots(payload.goalAmount ?? 0, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} gathered`
          : n.type === "registry_member_joined"
            ? payload.registryTitle ?? "Open coordination registry"
            : null;
      const link = payload.registryId ? `/registry/${payload.registryId}` : "/dashboard";
      items.push({
        kind: "update",
        id: n.id,
        createdAt: n.createdAt,
        seenAt: n.seenAt,
        title,
        subtitle,
        icon: n.type === "pledge_receipt_uploaded" ? IconWallet : IconBell,
        raw: n,
        link,
      });
    }
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return items;
  }, [notifRows]);

  const hasUnread = useMemo(() => notifStream.some((n) => !n.seenAt), [notifStream]);

  const isDocumentationRoute = location.pathname.startsWith("/documentation");

  async function markNotifSeen(id) {
    await apiFetch(`/api/notifications/${id}/seen`, { method: "PATCH" });
    setNotifRows((prev) => {
      const next = (prev || []).map((r) => (r?.id === id ? { ...r, seenAt: new Date().toISOString() } : r));
      if (notifCacheKey) localStorage.setItem(notifCacheKey, JSON.stringify(next));
      return next;
    });
  }

  async function onConfirmLogout() {
    setConfirmLogoutOpen(false);
    setProfileOpen(false);
    await logout({ redirectTo: "/login" });
  }

  return (
    <div className="min-h-screen bg-[var(--surface-page)]">
      {showAppHeader ? (
        <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[rgba(250,251,247,0.9)] backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 md:py-4">
            <Link to="/dashboard" className="flex min-w-0 shrink items-center gap-2 md:gap-3">
              <img
                src={logo}
                alt="Beabr logo"
                className="h-9 w-9 shrink-0 rounded-[14px] border border-[var(--border-subtle)] bg-white object-cover md:h-10 md:w-10"
              />
              <div className="truncate text-sm font-bold leading-tight">Beabr</div>
            </Link>

            <nav
              ref={notifMobileRef}
              className="relative flex max-w-[65%] shrink-0 items-center justify-end gap-0.5 text-[11px] font-semibold sm:max-w-none md:hidden"
              aria-label="Primary"
            >
              <NavLink
                to="/dashboard"
                aria-label="Home"
                title="Home"
                className={({ isActive }) =>
                  `inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full px-2.5 transition-colors ${
                    isActive
                      ? "bg-[var(--color-primary-50)] text-[var(--color-primary-800)]"
                      : "text-[var(--text-muted)] active:bg-[var(--color-neutral-200)]"
                  }`
                }
              >
                <IconHome className="h-5 w-5" aria-hidden />
              </NavLink>
              <div className="relative">
                <button
                  type="button"
                  className={`relative inline-flex min-h-[44px] min-w-0 items-center justify-center rounded-full px-2.5 transition-colors ${
                    notifOpen
                      ? "bg-[var(--color-primary-50)] text-[var(--color-primary-800)]"
                      : "text-[var(--text-muted)] active:bg-[var(--color-neutral-200)]"
                  }`}
                  aria-label="Notifications"
                  aria-haspopup="dialog"
                  aria-expanded={notifOpen}
                  onClick={() => setNotifOpen((s) => !s)}
                >
                  <IconBell className="h-4 w-4" aria-hidden />
                  {hasUnread ? (
                    <span
                      className="absolute left-1.5 top-2 z-10 h-1.5 w-1.5 rounded-full bg-[var(--color-primary-500)] ring-2 ring-[rgba(250,251,247,0.9)]"
                      aria-hidden
                    />
                  ) : null}
                </button>
              </div>
              <div className="relative shrink-0" ref={profileMobileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((s) => !s)}
                  className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-0.5 transition-colors ${
                    profileOpen
                      ? "bg-[var(--color-primary-50)] ring-2 ring-[var(--color-primary-200)] ring-offset-2 ring-offset-[rgba(250,251,247,0.95)]"
                      : location.pathname.startsWith("/settings")
                        ? "bg-[var(--color-primary-50)] text-[var(--color-primary-800)]"
                        : "text-[var(--text-muted)] active:bg-[var(--color-neutral-200)]"
                  }`}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  aria-label="Profile"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      aria-hidden="true"
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-[var(--border-subtle)]"
                    />
                  ) : (
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-primary-100)] text-xs font-bold text-[var(--color-primary-800)] ring-1 ring-[var(--border-subtle)]">
                      {avatarFallback}
                    </div>
                  )}
                </button>

                {profileOpen ? (
                  <Card
                    role="menu"
                    className="absolute right-0 mt-2 w-56 overflow-hidden p-2 shadow-[var(--shadow-md)]"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center rounded-[14px] px-3 py-2 text-left text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--color-neutral-100)]"
                      onClick={() => {
                        setProfileOpen(false);
                        nav("/settings");
                      }}
                    >
                      Settings
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center rounded-[14px] px-3 py-2 text-left text-sm font-semibold text-[var(--danger-text)] hover:bg-[var(--danger-bg)]"
                      onClick={() => {
                        setProfileOpen(false);
                        setConfirmLogoutOpen(true);
                      }}
                    >
                      Logout
                    </button>
                  </Card>
                ) : null}
              </div>

              {notifOpen ? (
                <Card
                  role="dialog"
                  aria-label="Notifications"
                  className="absolute right-0 top-full mt-2 w-[min(calc(100vw-0.25rem),20rem)] overflow-hidden p-0 shadow-[var(--shadow-lg)] ring-1 ring-[var(--border-subtle)]"
                >
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-3 py-2.5">
                    <div className="text-sm font-semibold text-[var(--text-primary)]">Notifications</div>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--color-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.45)]"
                      onClick={() => void refreshNotifications()}
                      aria-label="Refresh notifications"
                      title="Refresh"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
                        <path
                          d="M21 12a9 9 0 1 1-3.07-6.74"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M21 3v6h-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="max-h-[min(calc(100vh-7.25rem),28rem)] overflow-y-auto bg-[var(--surface-card)]">
                    {notifLoading ? (
                      <div className="px-3 py-3 text-sm text-[var(--text-muted)]">Loadingâ€¦</div>
                    ) : notifErr ? (
                      <div className="px-3 py-3 text-sm text-[var(--danger-text)]">{notifErr.message}</div>
                    ) : notifStream.length === 0 ? (
                      <div className="grid min-h-[5.75rem] place-items-center px-3 py-5 text-sm font-medium text-[var(--text-muted)]">
                        No new notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-[var(--border-subtle)]">
                        {notifStream.slice(0, 20).map((it) => {
                          const Icon = it.icon;
                          const unread = !it.seenAt;
                          return (
                            <button
                              key={`${it.kind}-${it.id}`}
                              type="button"
                              className={`flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition hover:bg-[var(--surface-card-soft)] ${
                                unread ? "bg-[var(--color-primary-50)]/40" : ""
                              }`}
                              onClick={async () => {
                                try {
                                  if (!it.seenAt) await markNotifSeen(it.id);
                                  if (it.link) nav(it.link);
                                } finally {
                                  setNotifOpen(false);
                                  await refreshNotifications();
                                }
                              }}
                            >
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] bg-white shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
                                <Icon className="h-4 w-4 text-[var(--color-primary-700)]" aria-hidden />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-start justify-between gap-2">
                                  <span className="min-w-0 line-clamp-2 text-sm font-semibold text-[var(--text-primary)]">
                                    {it.title}
                                  </span>
                                  <span className="shrink-0 text-[11px] font-medium tabular-nums text-[var(--text-muted)]">
                                    {timeAgo(it.createdAt)}
                                  </span>
                                </span>
                                {it.subtitle ? (
                                  <span className="mt-0.5 block line-clamp-1 text-xs text-[var(--text-muted)]">
                                    {it.subtitle}
                                  </span>
                                ) : null}
                              </span>
                              {unread ? (
                                <span
                                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-primary-500)] ring-2 ring-white"
                                  aria-hidden
                                />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              ) : null}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `inline-flex min-h-[44px] items-center justify-center rounded-full px-3 py-2 text-sm font-semibold ${
                    isActive
                      ? "bg-[var(--color-primary-50)] text-[var(--color-primary-800)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--color-neutral-100)]"
                  }`
                }
              >
                <IconHome className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                Home
              </NavLink>
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen((s) => !s)}
                  className={`relative inline-flex min-h-[44px] items-center justify-center rounded-full px-3 py-2 text-sm font-semibold transition ${
                    notifOpen
                      ? "bg-[var(--color-primary-50)] text-[var(--color-primary-800)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--color-neutral-100)]"
                  }`}
                  aria-haspopup="dialog"
                  aria-expanded={notifOpen}
                  aria-label="Notifications"
                >
                  <IconBell className="mr-2 h-4 w-4" aria-hidden />
                  Notifications
                  {hasUnread ? (
                    <span
                      className="absolute left-2 top-2 z-10 h-1.5 w-1.5 rounded-full bg-[var(--color-primary-500)] ring-2 ring-[rgba(250,251,247,0.9)]"
                      aria-hidden
                    />
                  ) : null}
                </button>

                {notifOpen ? (
                  <Card
                    role="dialog"
                    aria-label="Notifications"
                    className="absolute right-0 mt-2 w-[22rem] overflow-hidden p-0 shadow-[var(--shadow-lg)] ring-1 ring-[var(--border-subtle)]"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Notifications</div>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--color-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.45)]"
                        onClick={() => void refreshNotifications()}
                        aria-label="Refresh notifications"
                        title="Refresh"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
                          <path
                            d="M21 12a9 9 0 1 1-3.07-6.74"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M21 3v6h-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="max-h-[28rem] overflow-y-auto bg-[var(--surface-card)]">
                      {notifLoading ? (
                        <div className="px-4 py-4 text-sm text-[var(--text-muted)]">Loadingâ€¦</div>
                      ) : notifErr ? (
                        <div className="px-4 py-4 text-sm text-[var(--danger-text)]">{notifErr.message}</div>
                      ) : notifStream.length === 0 ? (
                        <div className="grid min-h-[6.5rem] place-items-center px-4 py-6 text-sm font-medium text-[var(--text-muted)]">
                          No new notifications
                        </div>
                      ) : (
                        <div className="divide-y divide-[var(--border-subtle)]">
                          {notifStream.slice(0, 20).map((it) => {
                            const Icon = it.icon;
                            const unread = !it.seenAt;
                            return (
                              <button
                                key={`${it.kind}-${it.id}`}
                                type="button"
                                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-[var(--surface-card-soft)] ${
                                  unread ? "bg-[var(--color-primary-50)]/40" : ""
                                }`}
                                onClick={async () => {
                                  try {
                                    if (!it.seenAt) await markNotifSeen(it.id);
                                    if (it.link) nav(it.link);
                                  } finally {
                                    setNotifOpen(false);
                                    await refreshNotifications();
                                  }
                                }}
                              >
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-white shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
                                  <Icon className="h-4.5 w-4.5 text-[var(--color-primary-700)]" aria-hidden />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-start justify-between gap-2">
                                    <span className="min-w-0 line-clamp-2 text-sm font-semibold text-[var(--text-primary)]">
                                      {it.title}
                                    </span>
                                    <span className="shrink-0 text-xs font-medium tabular-nums text-[var(--text-muted)]">
                                      {timeAgo(it.createdAt)}
                                    </span>
                                  </span>
                                  {it.subtitle ? (
                                    <span className="mt-0.5 block line-clamp-2 text-xs text-[var(--text-muted)]">
                                      {it.subtitle}
                                    </span>
                                  ) : null}
                                </span>
                                {unread ? (
                                  <span
                                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-primary-500)] ring-2 ring-white"
                                    aria-hidden
                                  />
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </Card>
                ) : null}
              </div>

              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((s) => !s)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    profileOpen
                      ? "border-[var(--border-default)] bg-[var(--color-neutral-100)] text-[var(--text-primary)]"
                      : "border-transparent bg-[var(--color-primary-50)] text-[var(--text-secondary)] hover:bg-[var(--color-primary-100)]"
                  }`}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      aria-hidden="true"
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-[var(--text-secondary)]">
                      {avatarFallback}
                    </div>
                  )}
                  <span>Profile</span>
                </button>

                {profileOpen ? (
                  <Card
                    role="menu"
                    className="absolute right-0 mt-2 w-56 overflow-hidden p-2 shadow-[var(--shadow-md)]"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center rounded-[14px] px-3 py-2 text-left text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--color-neutral-100)]"
                      onClick={() => {
                        setProfileOpen(false);
                        nav("/settings");
                      }}
                    >
                      Settings
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center rounded-[14px] px-3 py-2 text-left text-sm font-semibold text-[var(--danger-text)] hover:bg-[var(--danger-bg)]"
                      onClick={() => {
                        setProfileOpen(false);
                        setConfirmLogoutOpen(true);
                      }}
                    >
                      Logout
                    </button>
                  </Card>
                ) : null}
              </div>
            </div>
          </div>
        </header>
      ) : null}

      <main
        className={
          location.pathname === "/"
            ? "w-full max-w-none px-0 pb-0 pt-0"
            : isDocumentationRoute
              ? "mx-auto w-full max-w-none px-0 pb-8 pt-2 sm:pt-3"
              : "mx-auto w-full max-w-6xl px-4 pb-8 pt-6"
        }
      >
        {children}
      </main>

      <GuidedTour />

      {confirmLogoutOpen
        ? createPortal(
            <div className="fixed inset-0 z-[100]" role="presentation">
              <div
                className="absolute inset-0 bg-[var(--surface-overlay)] backdrop-blur-md"
                onMouseDown={() => setConfirmLogoutOpen(false)}
                role="presentation"
                aria-hidden="true"
              />
              <div className="absolute inset-0 flex items-center justify-center p-5">
                <Card className="w-full max-w-md p-5">
                  <div className="text-lg font-semibold">Log out?</div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">
                    Youâ€™ll need to sign in again to access your registries.
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Button variant="secondary" className="flex-1" onClick={() => setConfirmLogoutOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={onConfirmLogout}>
                      Log out
                    </Button>
                  </div>
                </Card>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

