import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Card } from "../components/ui/Card.jsx";
import { PageHeader } from "../components/ui/PageChrome.jsx";
import { IconBell, IconClock } from "../components/ui/PageIcons.jsx";
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
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const n = await apiFetch("/api/notifications");
      setRows(n.notifications || []);
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

  useEffect(() => {
    refresh();
  }, []);

  const stream = useMemo(() => {
    const items = [];

    for (const n of rows || []) {
      const payload = n.payload || {};
      const title =
        n.type === "pledge_receipt_uploaded"
          ? `Receipt uploaded - ${formatPesoDots(payload.amount ?? 0, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
          : n.type === "pledge_goal_not_reached"
            ? `Pledge goal not reached - ${payload.itemTitle ?? "item"}`
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
        icon: IconBell,
        raw: n,
        link,
      });
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return items;
  }, [rows]);

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
        description="Updates and receipts in one stream."
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
    </div>
  );
}
