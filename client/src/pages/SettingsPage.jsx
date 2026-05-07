import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { BottomSheet } from "../components/ui/BottomSheet.jsx";
import { Card } from "../components/ui/Card.jsx";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { PageSectionTitle } from "../components/ui/PageChrome.jsx";
import { IconGift, IconLinkedIn, IconSettings, IconUsers, IconWallet } from "../components/ui/PageIcons.jsx";
import { useAuth } from "../state/AuthProvider.jsx";
import { apiFetch, apiFetchForm } from "../services/api";
import { APP_VERSION } from "../version.js";
import peekDecoration from "../assets/peek.png";

function formatRegistryDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function formatMemberSince(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function IconAlertTriangle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconBookOutline({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M4 19.5A2.5 2.5 0 016.5 17H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 8h8M12 14h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconTag({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M20.5 13.5 13.5 20.5a2.1 2.1 0 0 1-3 0L3 13V3h10l7.5 7.5a2.1 2.1 0 0 1 0 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.5 7.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function IconEye({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTrash({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M19 6 18 20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const REGISTRY_CARD_INTERACTION_CLASS =
  "transition duration-200 hover:-translate-y-0.5 hover:ring-[var(--color-primary-500)] hover:shadow-[var(--shadow-md)] active:-translate-y-0.5 active:ring-[var(--color-primary-500)] focus-within:-translate-y-0.5 focus-within:ring-[var(--color-primary-500)] focus-within:shadow-[var(--shadow-md)]";
const REGISTRY_ACTION_CLASS =
  "w-full transition duration-200 hover:-translate-y-0.5 active:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.45)]";

function SettingsFooterSections({ onStartTour, startingTour }) {
  return (
    <>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">App version</div>
        <div className="mt-1.5 inline-flex min-h-[44px] items-center gap-2 rounded-md text-sm font-semibold text-[var(--color-primary-700)]">
          <IconTag className="h-5 w-5 shrink-0 text-[var(--color-primary-600)]" aria-hidden />
          v{APP_VERSION}
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Guided Tour</div>
        <button
          type="button"
          onClick={onStartTour}
          disabled={startingTour}
          className="mt-1.5 inline-flex min-h-[44px] items-center gap-2 rounded-md text-sm font-semibold text-[var(--color-primary-700)] transition hover:text-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <IconSettings className="h-5 w-5 shrink-0 text-[var(--color-primary-600)]" aria-hidden />
          {startingTour ? "Starting..." : "Start tour"}
        </button>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Documentation</div>
        <Link
          to="/documentation"
          aria-label="Open documentation: legal policies and help guides"
          className="mt-1.5 inline-flex min-h-[44px] items-center gap-2 rounded-md text-sm font-semibold text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.45)]"
        >
          <IconBookOutline className="h-5 w-5 shrink-0 text-[var(--color-primary-600)]" aria-hidden />
          View docs
        </Link>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Connect</div>
        <a
          href="https://www.linkedin.com/in/keith-tagarao/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Keith Tagarao's LinkedIn profile in a new tab"
          className="mt-1.5 inline-flex min-h-[44px] items-center gap-2 rounded-md text-sm font-semibold text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.45)]"
        >
          <IconLinkedIn className="h-5 w-5 shrink-0 text-[#0A66C2]" aria-hidden />
          Keith Tagarao
        </a>
      </div>
    </>
  );
}

function IconLogOut({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SettingsPage() {
  const { user, refresh, logout } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [err, setErr] = useState(null);
  const fileRef = useRef(null);

  const initial = useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
      avatarUrl: user?.avatarUrl || "",
    }),
    [user]
  );

  const [name, setName] = useState(initial.name);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);

  const [ownedRegistries, setOwnedRegistries] = useState([]);
  const [registriesLoading, setRegistriesLoading] = useState(true);
  const [registriesErr, setRegistriesErr] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteErr, setDeleteErr] = useState(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [tourConfirmOpen, setTourConfirmOpen] = useState(false);
  const [startingTour, setStartingTour] = useState(false);

  const loadOwnedRegistries = useCallback(async () => {
    setRegistriesLoading(true);
    setRegistriesErr(null);
    try {
      const data = await apiFetch("/api/registries");
      const list = (data.registries || []).filter((r) => r.role === "owner");
      setOwnedRegistries(list);
    } catch (e) {
      setRegistriesErr(e);
    } finally {
      setRegistriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOwnedRegistries();
  }, [loadOwnedRegistries]);

  async function confirmLogout() {
    setLogoutConfirmOpen(false);
    await logout({ redirectTo: "/login" });
  }

  async function startGuidedTour() {
    setStartingTour(true);
    setErr(null);
    setTourConfirmOpen(false);
    try {
      await apiFetch("/api/auth/me/tour", {
        method: "PATCH",
        body: JSON.stringify({ hadTour: false }),
      });
      window.localStorage.removeItem("last_tour_step");
      window.dispatchEvent(new CustomEvent("beabr:reset-guided-tour"));
      await refresh({ silent: true });
    } catch (e) {
      setErr(e);
    } finally {
      setStartingTour(false);
    }
  }

  async function confirmDeleteRegistry() {
    if (!deleteTarget?.id) return;
    setDeleteBusy(true);
    setDeleteErr(null);
    try {
      await apiFetch(`/api/registries/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      await loadOwnedRegistries();
      toast.success("Registry deleted.");
    } catch (e) {
      setDeleteErr(e);
    } finally {
      setDeleteBusy(false);
    }
  }

  function startEdit() {
    setErr(null);
    setName(initial.name);
    setAvatarUrl(initial.avatarUrl);
    setEditing(true);
  }

  function cancelEdit() {
    setErr(null);
    setEditing(false);
    setName(initial.name);
    setAvatarUrl(initial.avatarUrl);
  }

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      await apiFetch("/api/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          avatarUrl: avatarUrl.trim(),
        }),
      });
      await refresh();
      setEditing(false);
      toast.success("Saved.");
    } catch (e) {
      setErr(e);
    } finally {
      setSaving(false);
    }
  }

  async function onPickAvatarFile(file) {
    if (!file) return;
    setUploadingAvatar(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const data = await apiFetchForm("/api/auth/me/avatar", fd, { method: "POST" });
      setAvatarUrl(data.avatarUrl || "");
      await refresh();
      toast.success("Photo updated.");
    } catch (e) {
      setErr(e);
    } finally {
      setUploadingAvatar(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const memberSinceLabel = formatMemberSince(user?.createdAt);
  const currentRegistries = ownedRegistries.filter((r) => !r.finished);
  const finishedRegistries = ownedRegistries.filter((r) => r.finished);

  return (
    <div className="space-y-6">
      {err && !editing ? (
        <div className="rounded-[14px] border border-[rgba(155,28,28,0.2)] bg-[var(--danger-bg)] px-4 py-3 text-sm text-[var(--danger-text)]">
          {err.message}
        </div>
      ) : null}

      <Card className="overflow-hidden p-0 shadow-[var(--shadow-md)] ring-1 ring-[var(--border-subtle)]">
        <div className="beabr-page-header-gradient border-b border-[var(--border-subtle)] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Account</div>
              <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-3xl">
                Profile
              </h1>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">
                Update how your name and photo appear across Beabr.
              </p>
            </div>
            {!editing ? (
              <div className="flex w-full shrink-0 flex-col items-stretch gap-2 md:w-auto md:items-end">
                <Button variant="secondary" className="w-full gap-2 md:w-auto" onClick={startEdit}>
                  <IconSettings className="h-4 w-4 shrink-0" aria-hidden />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="w-full gap-2 md:w-auto !bg-[var(--danger-text)] !text-white shadow-[var(--shadow-sm)] hover:!brightness-110 hover:!bg-[var(--danger-text)]"
                  onClick={() => setLogoutConfirmOpen(true)}
                >
                  <IconLogOut className="h-4 w-4 shrink-0 text-white" aria-hidden />
                  Logout
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-card-soft)] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group relative grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-[var(--color-neutral-200)] ring-2 ring-transparent transition hover:ring-[rgba(129,160,63,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.45)]"
                aria-label="Change profile photo"
                title="Change profile photo"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" aria-hidden="true" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-lg font-bold text-[var(--text-secondary)]">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-[rgba(29,33,26,0.0)] transition group-hover:bg-[rgba(29,33,26,0.12)]" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickAvatarFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-base font-semibold text-[var(--text-primary)]">{user?.name}</div>
                <div className="truncate text-sm text-[var(--text-muted)]">{user?.email}</div>
              </div>
              {memberSinceLabel ? (
                <div className="shrink-0 self-center text-right text-xs font-medium leading-snug text-[var(--text-secondary)] sm:max-w-[min(100%,12.5rem)]">
                  <span className="block text-[var(--text-muted)]">Member since</span>
                  <span className="tabular-nums text-[var(--text-secondary)]">{memberSinceLabel}</span>
                </div>
              ) : null}
            </div>
          </div>
          {uploadingAvatar ? (
            <div className="mt-3 text-xs font-medium text-[var(--text-muted)]">Uploading photo…</div>
          ) : null}
        </div>

        {editing ? (
          <div className="p-5 sm:p-6">
            <div className="space-y-4">
              <label className="block text-left">
                <div className="text-xs font-semibold text-[var(--text-secondary)]">Name</div>
                <input
                  className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  maxLength={80}
                />
              </label>

              <label className="block text-left">
                <div className="text-xs font-semibold text-[var(--text-secondary)]">Email</div>
                <input
                  className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-card-soft)] px-3 py-3 text-sm text-[var(--text-muted)] outline-none"
                  value={initial.email}
                  readOnly
                />
              </label>

              <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] px-3 py-3 text-xs leading-relaxed text-[var(--text-muted)]">
                Profile photo: tap your picture above to choose a new image from your device.
              </div>

              {err ? <div className="text-sm text-[var(--danger-text)]">{err.message}</div> : null}

              <div className="flex gap-2 pt-1">
                <Button variant="secondary" className="flex-1" onClick={cancelEdit} disabled={saving}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={save} disabled={saving || !name.trim()}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </Card>

      <div className="space-y-3">
        <PageSectionTitle icon={IconGift}>My registries</PageSectionTitle>

        {registriesErr ? (
          <Card className="border border-[rgba(155,28,28,0.2)] bg-[var(--danger-bg)] p-4">
            <div className="text-sm text-[var(--danger-text)]">{registriesErr.message}</div>
          </Card>
        ) : null}

        {registriesLoading ? (
          <Card className="p-6 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
            <div className="text-sm text-[var(--text-muted)]">Loading your registries…</div>
          </Card>
        ) : ownedRegistries.length === 0 ? (
          <Card className="p-6 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
            <div className="text-sm font-semibold text-[var(--text-primary)]">No registries yet</div>
            <div className="mt-1 text-sm text-[var(--text-secondary)]">
              Create one from the dashboard when you are ready.
            </div>
            <div className="mt-4">
              <Link to="/registries/new">
                <Button className="w-full sm:w-auto">Create registry</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Current</div>
            {currentRegistries.length === 0 ? (
              <Card className="p-5 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
                <div className="text-sm text-[var(--text-secondary)]">No current registries.</div>
              </Card>
            ) : (
              <ul className="space-y-3">
                {currentRegistries.map((r) => (
                  <li key={r.id}>
                    <Card className={`relative overflow-hidden p-0 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)] ${REGISTRY_CARD_INTERACTION_CLASS}`}>
                  {/* Dot grid + diagonal mask */}
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
                  {/* Wash dots down toward top-left so title / meta stay crisp (above dots, below buttons text) */}
                  <div
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                      background:
                        "linear-gradient(to bottom right, var(--surface-card) 0%, rgba(255, 255, 255, 0.88) 18%, rgba(250, 251, 247, 0.35) 42%, transparent 62%)",
                    }}
                    aria-hidden
                  />
                  <div className="relative z-[1] p-4 sm:p-5">
                    <div className="min-w-0">
                      <div className="truncate text-base font-semibold text-[var(--text-primary)]">{r.title}</div>
                      <div className="mt-1 text-xs text-[var(--text-muted)]">
                        {r.eventCategory || "Event"} · Reveal {formatRegistryDate(r.revealDatetime)}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <Link className="sm:flex-1" to={`/registry/${r.id}`}>
                        <Button variant="secondary" className={REGISTRY_ACTION_CLASS}>
                          <IconEye className="h-4 w-4 shrink-0" aria-hidden />
                          View registry
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="danger"
                        className={`${REGISTRY_ACTION_CLASS} sm:flex-1`}
                        onClick={() => {
                          setDeleteErr(null);
                          setDeleteTarget(r);
                        }}
                      >
                        <IconTrash className="h-4 w-4 shrink-0" aria-hidden />
                        Delete registry
                      </Button>
                    </div>
                  </div>
                </Card>
                  </li>
                ))}
              </ul>
            )}

            <div className="pt-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Finished</div>
            {finishedRegistries.length === 0 ? (
              <Card className="p-5 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
                <div className="text-sm text-[var(--text-secondary)]">No finished registries yet.</div>
              </Card>
            ) : (
              <ul className="space-y-3">
                {finishedRegistries.map((r) => (
                  <li key={r.id}>
                    <Card className={`relative overflow-hidden p-0 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)] ${REGISTRY_CARD_INTERACTION_CLASS}`}>
                      <div
                        className="pointer-events-none absolute inset-0 z-0 select-none"
                        aria-hidden
                        style={{
                          backgroundColor: "rgba(137, 146, 124, 0.06)",
                          backgroundImage:
                            "radial-gradient(circle at 2px 2px, rgba(75, 82, 67, 0.22) 2px, transparent 2.25px)",
                          backgroundSize: "14px 14px",
                          maskImage:
                            "linear-gradient(to top right, transparent 0%, rgba(0,0,0,0.18) 18%, rgba(0,0,0,0.9) 38%, rgba(0,0,0,0.9) 58%, rgba(0,0,0,0.22) 78%, transparent 100%)",
                          WebkitMaskImage:
                            "linear-gradient(to top right, transparent 0%, rgba(0,0,0,0.18) 18%, rgba(0,0,0,0.9) 38%, rgba(0,0,0,0.9) 58%, rgba(0,0,0,0.22) 78%, transparent 100%)",
                        }}
                      />
                      <div className="relative z-[1] p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-base font-semibold text-[var(--text-primary)]">{r.title}</div>
                            <div className="mt-1 text-xs text-[var(--text-muted)]">
                              {r.eventCategory || "Event"} · Reveal {formatRegistryDate(r.revealDatetime)}
                            </div>
                          </div>
                          <div className="shrink-0 rounded-full bg-[var(--success-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--success-text)]">
                            Finished
                          </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                          <Link className="sm:flex-1" to={`/registry/${r.id}`}>
                            <Button variant="secondary" className={REGISTRY_ACTION_CLASS}>
                              <IconEye className="h-4 w-4 shrink-0" aria-hidden />
                              View registry
                            </Button>
                          </Link>
                          <Button
                            type="button"
                            variant="danger"
                            className={`${REGISTRY_ACTION_CLASS} sm:flex-1`}
                            onClick={() => {
                              setDeleteErr(null);
                              setDeleteTarget(r);
                            }}
                          >
                            <IconTrash className="h-4 w-4 shrink-0" aria-hidden />
                            Delete registry
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <BottomSheet
        variant="modal"
        open={Boolean(deleteTarget)}
        showCloseIcon={false}
        onClose={() => {
          if (!deleteBusy) setDeleteTarget(null);
        }}
      >
        {deleteTarget ? (
          <div className="space-y-5">
            <div className="flex gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--danger-bg)] text-[var(--danger-text)]"
                aria-hidden
              >
                <IconAlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">Delete this registry?</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">{deleteTarget.title}</span> will be removed
                  permanently. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-card-soft)] px-3.5 py-3.5">
              <div className="text-xs font-semibold text-[var(--text-secondary)]">What will be removed</div>
              <ul className="mt-2.5 list-none space-y-2.5" role="list">
                <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                  <IconGift className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
                  <span>All gift items, reservations, cash funds, and pledges</span>
                </li>
                <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                  <IconUsers className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
                  <span>Member access and your invite link or code will stop working</span>
                </li>
                <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                  <IconWallet className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
                  <span>Thank-you letters tied to this registry</span>
                </li>
              </ul>
            </div>

            {deleteErr ? <div className="text-sm text-[var(--danger-text)]">{deleteErr.message}</div> : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:flex-1 ring-1 ring-inset ring-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-primary)] hover:bg-[var(--color-neutral-100)]"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteBusy}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                className="w-full sm:flex-1 !bg-[var(--danger-text)] !text-white shadow-[var(--shadow-sm)] hover:!brightness-110 hover:!bg-[var(--danger-text)]"
                onClick={confirmDeleteRegistry}
                disabled={deleteBusy}
              >
                {deleteBusy ? "Deleting…" : "Delete permanently"}
              </Button>
            </div>
          </div>
        ) : null}
      </BottomSheet>

      <BottomSheet variant="modal" open={logoutConfirmOpen} showCloseIcon={false} onClose={() => setLogoutConfirmOpen(false)}>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] text-[var(--text-secondary)] ring-1 ring-[var(--border-subtle)]"
              aria-hidden
            >
              <IconLogOut className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Logout?</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                You’ll need to sign in again to open your registries and notifications.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" className="w-full sm:flex-1" onClick={() => setLogoutConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="w-full sm:flex-1 !bg-[var(--danger-text)] !text-white hover:!brightness-110 hover:!bg-[var(--danger-text)]"
              onClick={confirmLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet variant="modal" open={tourConfirmOpen} showCloseIcon={false} onClose={() => !startingTour && setTourConfirmOpen(false)}>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] text-[var(--color-primary-700)] ring-1 ring-[var(--border-subtle)]"
              aria-hidden
            >
              <IconSettings className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Start guided tour?</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                This will restart the guided tour from the beginning.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" className="w-full sm:flex-1" onClick={() => setTourConfirmOpen(false)} disabled={startingTour}>
              Go back
            </Button>
            <Button variant="primary" className="w-full sm:flex-1" onClick={startGuidedTour} disabled={startingTour}>
              {startingTour ? "Starting..." : "Start tour"}
            </Button>
          </div>
        </div>
      </BottomSheet>

      <Card className="relative overflow-hidden px-5 pt-5 shadow-[var(--shadow-sm)] ring-1 ring-[var(--border-subtle)] sm:px-6 sm:pt-6 pb-0">
        <div
          className="relative z-10 grid gap-6 pb-5 pr-[6.75rem] sm:grid-cols-2 sm:pb-6 sm:pr-40 md:pr-44 lg:grid-cols-4 lg:gap-8 lg:pr-48"
        >
          <div className="contents">
            <SettingsFooterSections onStartTour={() => setTourConfirmOpen(true)} startingTour={startingTour} />
          </div>
        </div>
        <img
          src={peekDecoration}
          alt=""
          aria-hidden="true"
          decoding="async"
          draggable={false}
          className="pointer-events-none absolute bottom-0 right-2 z-[1] block h-[7rem] w-auto max-w-[min(42vw,150px)] select-none object-contain object-bottom sm:right-5 sm:h-[7.35rem] sm:max-w-[158px] md:h-[7.5rem]"
        />
      </Card>
    </div>
  );
}
