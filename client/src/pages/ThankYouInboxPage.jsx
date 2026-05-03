import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { BottomSheet } from "../components/ui/BottomSheet.jsx";
import { PageHeader, PageSectionTitle } from "../components/ui/PageChrome.jsx";
import { IconHeart } from "../components/ui/PageIcons.jsx";

export function ThankYouInboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [popup, setPopup] = useState(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const data = await apiFetch("/api/thank-you/inbox");
      setMessages(data.messages || []);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }

  const firstUnseen = useMemo(
    () => messages.find((m) => m.status === "sent" && !m.seenAt) || null,
    [messages]
  );

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (firstUnseen && !popup) setPopup(firstUnseen);
  }, [firstUnseen, popup]);

  async function markSeen(messageId) {
    await apiFetch(`/api/thank-you/${messageId}/seen`, { method: "PATCH" });
    await refresh();
  }

  if (loading) return <div className="py-10 text-center text-sm text-[var(--text-muted)]">Loading…</div>;
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
        title="Thank-you notes"
        description="Messages from registry owners appear here. Prefer the unified Notifications screen for updates plus thank-yous."
      />

      <div className="space-y-3">
        <PageSectionTitle icon={IconHeart}>Received</PageSectionTitle>
        {messages.length === 0 ? (
          <Card className="p-6 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
            <div className="text-sm font-semibold text-[var(--text-primary)]">No messages yet</div>
            <div className="mt-1 text-sm text-[var(--text-secondary)]">
              When the registry owner sends you a thank-you note, it can pop up the next time you open Beabr.
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <Card key={m.id} className="p-4 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
                      {m.registry?.ownerDisplayName ? `From ${m.registry.ownerDisplayName}` : "Thank-you note"}
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                      {m.item ? `Gift: ${m.item.title}` : m.fund ? `Fund: ${m.fund.title}` : null}
                    </div>
                  </div>
                  <div
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      m.seenAt
                        ? "bg-[var(--surface-card-soft)] text-[var(--text-secondary)]"
                        : "bg-[var(--color-primary-100)] text-[var(--color-primary-800)]"
                    }`}
                  >
                    {m.seenAt ? "Seen" : "New"}
                  </div>
                </div>
                <div className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{m.message}</div>
                {!m.seenAt ? (
                  <div className="mt-4">
                    <Button variant="secondary" className="w-full" onClick={() => markSeen(m.id)}>
                      Mark as seen
                    </Button>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomSheet
        open={Boolean(popup)}
        title={
          popup?.registry?.ownerDisplayName
            ? `A thank-you note from ${popup.registry.ownerDisplayName}`
            : "A thank-you note"
        }
        onClose={async () => {
          if (popup?.id) await markSeen(popup.id);
          setPopup(null);
        }}
      >
        {popup ? (
          <div className="space-y-4">
            {popup.item ? (
              <div className="text-xs font-medium text-[var(--text-muted)]">Gift: {popup.item.title}</div>
            ) : popup.fund ? (
              <div className="text-xs font-medium text-[var(--text-muted)]">Fund: {popup.fund.title}</div>
            ) : null}
            <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] p-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              {popup.message}
            </div>
            <Button
              className="w-full"
              onClick={async () => {
                await markSeen(popup.id);
                setPopup(null);
              }}
            >
              Got it
            </Button>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
