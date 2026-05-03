import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { BottomSheet } from "../components/ui/BottomSheet.jsx";
import { PageHeader, PageSectionTitle } from "../components/ui/PageChrome.jsx";
import {
  IconArrowLeft,
  IconClock,
  IconGift,
  IconSparkles,
  IconWallet,
} from "../components/ui/PageIcons.jsx";
import { RevealScreenSkeleton } from "../components/ui/ScreenSkeletons.jsx";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function getRemainingParts(targetDate, nowMs) {
  const diff = targetDate.getTime() - nowMs;
  if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { expired: false, days, hours, minutes, seconds };
}

function formatScheduleDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatScheduleTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function RevealPage() {
  const { registryId } = useParams();
  const [registry, setRegistry] = useState(null);
  const [reveal, setReveal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [tick, setTick] = useState(() => Date.now());

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerTarget, setComposerTarget] = useState(null);
  const [message, setMessage] = useState("");
  const [sendBusy, setSendBusy] = useState(false);
  const [sendErr, setSendErr] = useState(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const base = await apiFetch(`/api/registries/${registryId}`);
      setRegistry(base.registry);
      if (base.registry.role === "owner") {
        const r = await apiFetch(`/api/registries/${registryId}/reveal`);
        setReveal(r);
      } else {
        setReveal(null);
      }
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registryId]);

  const revealed = registry?.revealed;

  useEffect(() => {
    if (!registry?.revealDatetime || revealed) return undefined;
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [registry?.revealDatetime, revealed]);

  const revealTarget = useMemo(() => {
    if (!registry?.revealDatetime) return null;
    return new Date(registry.revealDatetime);
  }, [registry?.revealDatetime]);

  const countdownParts = useMemo(() => {
    if (!revealTarget) return null;
    return getRemainingParts(revealTarget, tick);
  }, [revealTarget, tick]);

  if (loading) return <RevealScreenSkeleton />;
  if (err)
    return (
      <Card className="border border-[rgba(155,28,28,0.2)] bg-[var(--danger-bg)] p-6">
        <div className="text-sm font-semibold text-[var(--danger-text)]">{err.message}</div>
      </Card>
    );
  if (!registry) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Registry"
        title="Reveal"
        description={
          revealed
            ? registry.role === "owner"
              ? "Contributor names and pledge details are visible to you as the owner."
              : "The registry owner can see who helped—thank-you notes may follow."
            : "Gift givers stay private until the scheduled reveal date and time."
        }
        actions={
          <Link to={`/registry/${registryId}`} className="w-full md:w-auto">
            <Button variant="secondary" className="w-full gap-2 md:w-auto">
              <IconArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              Back to registry
            </Button>
          </Link>
        }
      />

      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-4 shadow-[var(--shadow-xs)] sm:px-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Registry</div>
        <div className="mt-1 truncate text-lg font-bold text-[var(--text-primary)] sm:text-xl">{registry.title}</div>
      </div>

      {!revealed ? (
        <Card className="overflow-hidden p-0 shadow-[var(--shadow-md)] ring-1 ring-[var(--border-subtle)]">
          <div className="border-b border-[var(--border-subtle)] bg-[linear-gradient(135deg,var(--color-primary-50)_0%,rgba(250,251,247,0.95)_50%,var(--color-beaver-50)_100%)] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <IconSparkles className="h-5 w-5 text-[var(--color-primary-600)]" aria-hidden />
              Before reveal
            </div>
            <p className="mt-2 max-w-prose text-sm text-[var(--text-secondary)]">
              Contributors stay private until the reveal date and time below.
            </p>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            <div className="rounded-[20px] bg-[linear-gradient(145deg,rgba(129,160,63,0.28),rgba(139,94,60,0.22))] p-[1px] shadow-[var(--shadow-sm)]">
              <div className="rounded-[19px] bg-[var(--surface-card)] px-3 py-6 sm:px-5">
                {countdownParts?.expired ? (
                  <p className="text-center text-sm font-semibold text-[var(--text-primary)]">
                    Reveal time reached—refresh if this screen did not update yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                    {[
                      { label: "Days", value: countdownParts?.days ?? 0, pad: false },
                      { label: "Hours", value: countdownParts?.hours ?? 0, pad: false },
                      { label: "Minutes", value: countdownParts?.minutes ?? 0, pad: false },
                      { label: "Seconds", value: countdownParts?.seconds ?? 0, pad: true },
                    ].map((u) => (
                      <div
                        key={u.label}
                        className="rounded-2xl bg-[var(--surface-card-soft)] px-1.5 py-4 text-center ring-1 ring-[var(--border-subtle)]"
                      >
                        <div className="text-2xl font-bold tabular-nums text-[var(--text-primary)] sm:text-3xl">
                          {u.pad ? pad2(Number(u.value)) : u.value}
                        </div>
                        <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                          {u.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 rounded-[var(--radius-lg)] border border-[rgba(139,94,60,0.22)] bg-[var(--color-beaver-50)] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-beaver-100)] text-[var(--color-beaver-700)]">
                <IconClock className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-beaver-800)]">
                  Reveal opens
                </div>
                <div className="mt-0.5 text-base font-semibold text-[var(--text-primary)]">
                  {formatScheduleDate(registry.revealDatetime)}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="tabular-nums">{formatScheduleTime(registry.revealDatetime)}</span>
                  <span className="text-xs text-[var(--text-muted)]">· Local Time</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : registry.role !== "owner" ? (
        <Card className="p-6 shadow-[var(--shadow-md)] ring-1 ring-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <IconSparkles className="h-5 w-5 text-[var(--color-primary-600)]" aria-hidden />
            Revealed
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            The owner can now see contributor details and send thank-you notes in Beabr.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="p-5 shadow-[var(--shadow-md)] ring-1 ring-[var(--border-subtle)] sm:p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <IconSparkles className="h-5 w-5 text-[var(--color-primary-600)]" aria-hidden />
              Reveal is ready
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              See who prepared each gift and who pledged. Thank-you notes appear as a pop-up the next time each gift giver
              opens Beabr.
            </p>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-3">
              <PageSectionTitle icon={IconGift}>Prepared gifts</PageSectionTitle>
              {(reveal?.prepared || []).length === 0 ? (
                <Card className="p-5 text-sm text-[var(--text-muted)] ring-1 ring-[var(--border-subtle)]">
                  No prepared gifts yet.
                </Card>
              ) : (
                <div className="space-y-3">
                  {reveal.prepared.map((p) => (
                    <Card key={p.id} className="p-4 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{p.item.title}</div>
                      <div className="mt-1 text-xs text-[var(--text-muted)]">
                        Prepared by <span className="font-medium text-[var(--text-secondary)]">{p.giver.name}</span> · Qty{" "}
                        {p.quantity}
                      </div>
                      {p.privateNote ? (
                        <div className="mt-3 rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] p-3 text-sm text-[var(--text-secondary)]">
                          {p.privateNote}
                        </div>
                      ) : null}
                      <div className="mt-4">
                        <Button
                          className="w-full"
                          onClick={() => {
                            setComposerTarget({
                              giverId: p.giver.id,
                              itemReservationId: p.id,
                              cashPledgeId: null,
                              label: `${p.giver.name} • ${p.item.title}`,
                            });
                            setMessage("");
                            setSendErr(null);
                            setComposerOpen(true);
                          }}
                        >
                          Send thank-you note
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div id="pledge" className="space-y-3">
              <PageSectionTitle icon={IconWallet}>Pledges</PageSectionTitle>
              {(reveal?.pledges || []).length === 0 ? (
                <Card className="p-5 text-sm text-[var(--text-muted)] ring-1 ring-[var(--border-subtle)]">
                  No pledges yet.
                </Card>
              ) : (
                <div className="space-y-3">
                  {reveal.pledges.map((p) => (
                    <Card key={p.id} className="p-4 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{p.fund.title}</div>
                      <div className="mt-1 text-xs text-[var(--text-muted)]">
                        <span className="font-medium text-[var(--text-secondary)]">{p.giver.name}</span> pledged ₱
                        {String(p.amount)}
                      </div>
                      {p.privateNote ? (
                        <div className="mt-3 rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] p-3 text-sm text-[var(--text-secondary)]">
                          {p.privateNote}
                        </div>
                      ) : null}
                      <div className="mt-4">
                        <Button
                          className="w-full"
                          onClick={() => {
                            setComposerTarget({
                              giverId: p.giver.id,
                              itemReservationId: null,
                              cashPledgeId: p.id,
                              label: `${p.giver.name} • ${p.fund.title}`,
                            });
                            setMessage("");
                            setSendErr(null);
                            setComposerOpen(true);
                          }}
                        >
                          Send thank-you note
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomSheet
        open={composerOpen}
        title="Send thank-you note"
        onClose={() => {
          setComposerOpen(false);
          setComposerTarget(null);
          setSendErr(null);
          setMessage("");
        }}
      >
        {composerTarget ? (
          <div className="space-y-4">
            <div className="text-xs font-medium text-[var(--text-muted)]">{composerTarget.label}</div>
            <textarea
              rows={5}
              className="w-full resize-none rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              placeholder="Thank you so much for…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {sendErr ? <div className="text-sm text-[var(--danger-text)]">{sendErr.message}</div> : null}
            <Button
              className="w-full"
              disabled={sendBusy || message.trim().length === 0}
              onClick={async () => {
                setSendBusy(true);
                setSendErr(null);
                try {
                  await apiFetch("/api/thank-you", {
                    method: "POST",
                    body: JSON.stringify({
                      registryId,
                      giverId: composerTarget.giverId,
                      itemReservationId: composerTarget.itemReservationId,
                      cashPledgeId: composerTarget.cashPledgeId,
                      message: message.trim(),
                      status: "sent",
                    }),
                  });
                  setComposerOpen(false);
                  setComposerTarget(null);
                  setMessage("");
                } catch (e) {
                  setSendErr(e);
                } finally {
                  setSendBusy(false);
                }
              }}
            >
              {sendBusy ? "Sending…" : "Send"}
            </Button>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
