import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { BottomSheet } from "../components/ui/BottomSheet.jsx";
import { PageHeader } from "../components/ui/PageChrome.jsx";
import { IconBell, IconClock, IconHeart } from "../components/ui/PageIcons.jsx";
import { NotificationsScreenSkeleton } from "../components/ui/ScreenSkeletons.jsx";
import { formatPesoDots } from "../utils/numberFormat.js";

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

export function NotificationsPage() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [thankYous, setThankYous] = useState([]);
  const [activeThankYou, setActiveThankYou] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const [n, ty] = await Promise.all([
        apiFetch("/api/notifications"),
        apiFetch("/api/thank-you/inbox"),
      ]);
      setRows(n.notifications || []);
      setThankYous(ty.messages || []);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }

  async function markSeen(id) {
    await apiFetch(`/api/notifications/${id}/seen`, { method: "PATCH" });
    await refresh();
  }

  async function markThankYouSeen(messageId) {
    await apiFetch(`/api/thank-you/${messageId}/seen`, { method: "PATCH" });
    await refresh();
  }

  useEffect(() => {
    refresh();
  }, []);

  const stream = useMemo(() => {
    const items = [];

    for (const m of thankYous || []) {
      const createdAt = m.sentAt || m.createdAt;
      items.push({
        kind: "thank_you",
        id: m.id,
        createdAt,
        seenAt: m.seenAt,
        title: m.registry?.ownerDisplayName ? `Thank-you from ${m.registry.ownerDisplayName}` : "Thank-you note",
        subtitle: m.item ? `Gift: ${m.item.title}` : m.fund ? `Fund: ${m.fund.title}` : null,
        icon: IconHeart,
        raw: m,
        link: null,
      });
    }

    for (const n of rows || []) {
      const payload = n.payload || {};
      const title =
        n.type === "pledge_receipt_uploaded"
          ? `Receipt uploaded • ${formatPesoDots(payload.amount ?? 0, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
          : n.type === "pledge_goal_not_reached"
            ? `Pledge goal not reached — ${payload.itemTitle ?? "item"}`
            : n.type;
      const subtitle =
        n.type === "pledge_goal_not_reached"
          ? `${formatPesoDots(payload.gatheredAmount ?? 0, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} of ${formatPesoDots(payload.goalAmount ?? 0, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} gathered`
          : null;
      const link = payload.registryId ? `/registry/${payload.registryId}` : "/dashboard";
      items.push({
        kind: "update",
        id: n.id,
        createdAt: n.createdAt,
        seenAt: n.seenAt,
        title,
        subtitle,
        icon: IconBell,
        raw: n,
        link,
      });
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return items;
  }, [rows, thankYous]);

  if (loading) return <NotificationsScreenSkeleton />;
  if (err)
    return (
      <Card className="border border-[rgba(155,28,28,0.2)] bg-[var(--danger-bg)] p-6">
        <div className="text-sm font-semibold text-[var(--danger-text)]">{err.message}</div>
      </Card>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Updates, receipts, and thank-you notes in one stream."
      />

      {stream.length === 0 ? (
        <Card className="p-6 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
          <div className="text-sm font-semibold text-[var(--text-primary)]">All caught up</div>
          <div className="mt-1 text-sm text-[var(--text-secondary)]">New updates will appear here.</div>
        </Card>
      ) : (
        <div className="space-y-3">
          {stream.map((it) => {
            const Icon = it.icon;
            const unread = !it.seenAt;
            return (
              <Card
                key={`${it.kind}-${it.id}`}
                className={`group relative overflow-hidden p-4 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)] transition hover:shadow-[var(--shadow-sm)] ${
                  unread ? "bg-[var(--color-primary-50)]/40" : ""
                }`}
              >
                <button
                  type="button"
                  className="absolute inset-0 z-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
                  aria-label={it.title}
                  onClick={async () => {
                    if (it.kind === "thank_you") {
                      setActiveThankYou(it.raw);
                      if (!it.seenAt) await markThankYouSeen(it.id);
                      return;
                    }
                    if (!it.seenAt) await markSeen(it.id);
                    if (it.link) nav(it.link);
                  }}
                />

                <div className="relative z-[1] flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-white shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
                    <Icon className="h-5 w-5 text-[var(--color-primary-700)]" aria-hidden />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="line-clamp-2 text-sm font-semibold text-[var(--text-primary)]">{it.title}</div>
                        {it.subtitle ? (
                          <div className="mt-0.5 line-clamp-2 text-xs text-[var(--text-muted)]">{it.subtitle}</div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                          <IconClock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          <span className="tabular-nums">{timeAgo(it.createdAt)}</span>
                        </div>
                        {unread ? (
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-primary-500)] ring-2 ring-white"
                            aria-label="New notification"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <BottomSheet
        open={Boolean(activeThankYou)}
        title={
          activeThankYou?.registry?.ownerDisplayName
            ? `Thank-you from ${activeThankYou.registry.ownerDisplayName}`
            : "Thank-you note"
        }
        onClose={() => setActiveThankYou(null)}
      >
        {activeThankYou ? (
          <div className="space-y-4">
            {activeThankYou.item ? (
              <div className="text-xs font-medium text-[var(--text-muted)]">Gift: {activeThankYou.item.title}</div>
            ) : activeThankYou.fund ? (
              <div className="text-xs font-medium text-[var(--text-muted)]">Fund: {activeThankYou.fund.title}</div>
            ) : null}
            <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] p-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              {activeThankYou.message}
            </div>
            <Button className="w-full" onClick={() => setActiveThankYou(null)}>
              Close
            </Button>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
