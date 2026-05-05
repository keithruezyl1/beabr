import { useEffect, useId, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { PageHeader } from "../components/ui/PageChrome.jsx";
import { IconKeyRound } from "../components/ui/PageIcons.jsx";
import { BevesReminders } from "../components/registry/BevesReminders.jsx";

export function JoinRegistryPage() {
  const hintId = useId();
  const { joinCode: joinCodeParam } = useParams();
  const nav = useNavigate();
  const initial = useMemo(() => (joinCodeParam ? String(joinCodeParam).toUpperCase() : ""), [joinCodeParam]);
  const [code, setCode] = useState(initial);
  const [routeJoining, setRouteJoining] = useState(() => Boolean(joinCodeParam));
  /** Optional nickname shown to other gift givers on the dashboard (falls back to your account name if empty). */
  const [nickname, setNickname] = useState("");
  /** When true, roster shows initials only—no profile photo (recommended if using a nickname). */
  const [hideAvatar, setHideAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    setCode(initial);
  }, [initial]);

  useEffect(() => {
    if (!joinCodeParam) {
      setRouteJoining(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setRouteJoining(true);
      try {
        const data = await apiFetch("/api/registries/join", {
          method: "POST",
          body: JSON.stringify({ joinCode: String(joinCodeParam).toUpperCase() }),
        });
        if (!cancelled) {
          const registryPath = `/registry/${data.registryId}`;
          nav(`/success-modal?variant=registry_joined&next=${encodeURIComponent(registryPath)}`, { replace: true });
        }
      } catch (e2) {
        if (!cancelled) {
          setRouteJoining(false);
          setErr(e2);
          setCode(String(joinCodeParam).toUpperCase());
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [joinCodeParam, nav]);

  async function onJoin(e) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const body = {
        joinCode: code.trim().toUpperCase(),
        hideAvatar,
      };
      const trimmed = nickname.trim();
      if (trimmed.length > 0) body.publicDisplayName = trimmed;

      const data = await apiFetch("/api/registries/join", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const registryPath = `/registry/${data.registryId}`;
      nav(`/success-modal?variant=registry_joined&next=${encodeURIComponent(registryPath)}`);
    } catch (e2) {
      setErr(e2);
    } finally {
      setLoading(false);
    }
  }

  if (joinCodeParam && routeJoining && !err) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Invite"
          title="Join registry"
          description="Opening your invite link—we’ll add you to the registry when this finishes."
        />
        <Card className="flex min-h-[200px] items-center justify-center p-8 shadow-[var(--shadow-md)] ring-1 ring-[var(--border-subtle)]">
          <p className="text-sm font-medium text-[var(--text-secondary)]">Joining registry…</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Invite"
        title="Join registry"
        description="Enter the code the registry owner shared with you. Letters are not case-sensitive."
      />

      <Card className="p-5 shadow-[var(--shadow-md)] ring-1 ring-[var(--border-subtle)] sm:p-6">
        <div className="mb-4 flex items-start gap-3 rounded-[var(--radius-lg)] bg-[var(--surface-card-soft)] p-4 ring-1 ring-[var(--border-subtle)]">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
            <IconKeyRound className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 text-sm leading-relaxed text-[var(--text-secondary)]">
            After joining, you can reserve gifts and mark them prepared—your name stays private until reveal.
          </div>
        </div>

        <form className="space-y-4" onSubmit={onJoin}>
          <label className="block text-left">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Join code</div>
            <input
              className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm uppercase tracking-wider outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ABC123"
              required
              autoComplete="off"
              spellCheck="false"
            />
          </label>

          <div className="rounded-[var(--radius-lg)] bg-[var(--surface-card-soft)] p-4 ring-1 ring-[var(--border-subtle)]">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">How you appear (optional)</div>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
              Other gift givers can see a small roster on their dashboard. Use a nickname if you prefer not to share your
              account name.
            </p>
            <label className="mt-3 block text-left">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Nickname (optional)</span>
              <input
                className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Defaults to your account name"
                maxLength={80}
                autoComplete="off"
              />
            </label>
            <label className="mt-3 flex cursor-pointer items-start gap-3 text-left">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--border-default)] text-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)]"
                checked={hideAvatar}
                onChange={(e) => setHideAvatar(e.target.checked)}
              />
              <span className="text-sm leading-snug text-[var(--text-secondary)]">
                Don’t show my profile photo—use initials instead (recommended for anonymous-style names)
              </span>
            </label>
          </div>

          <BevesReminders
            variant="join"
            hintId={hintId}
            termsAccepted={termsAccepted}
            onTermsAcceptedChange={setTermsAccepted}
          />

          {err ? (
            <div className="rounded-[14px] border border-[rgba(155,28,28,0.2)] bg-[var(--danger-bg)] px-3 py-2 text-sm text-[var(--danger-text)]">
              {err.message}
            </div>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading || !code.trim() || !termsAccepted}>
            {loading ? "Joining…" : "Join registry"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
