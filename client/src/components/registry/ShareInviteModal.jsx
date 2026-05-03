import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { BottomSheet } from "../ui/BottomSheet.jsx";
import { Button } from "../ui/Button.jsx";

function inviteLinkOrigin() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

export function ShareInviteModal({ open, onClose, joinCode }) {
  const code = String(joinCode || "").toUpperCase();
  const inviteUrl = `${inviteLinkOrigin()}/registry/join/${encodeURIComponent(code)}`;
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!open) setCopied(null);
  }, [open]);

  const copyText = useCallback(async (label, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied("error");
      window.setTimeout(() => setCopied(null), 2000);
    }
  }, []);

  return (
    <BottomSheet open={open} onClose={onClose} title="Invite gift givers" variant="modal">
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Scan the QR code or share the link. Signed-in guests open the registry directly; others sign in first, then join
          with this code or link.
        </p>

        <div className="rounded-[var(--radius-lg)] bg-[var(--surface-card-soft)] p-4 ring-1 ring-[var(--border-subtle)]">
          <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Scan to open join link
          </p>
          <div className="mt-3 flex justify-center rounded-[var(--radius-md)] bg-white p-3 ring-1 ring-[var(--border-subtle)]">
            <QRCode value={inviteUrl} size={168} level="M" fgColor="#1D211A" bgColor="#FFFFFF" />
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Invite link</div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <p className="min-w-0 flex-1 break-all rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] px-3 py-2 text-xs leading-snug text-[var(--text-primary)] ring-1 ring-[var(--border-subtle)]">
              {inviteUrl}
            </p>
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 px-4 py-2.5 text-xs sm:w-auto"
              onClick={() => copyText("link", inviteUrl)}
            >
              {copied === "link" ? "Copied" : "Copy link"}
            </Button>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Join code</div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <p
              className="flex min-h-[44px] flex-1 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] px-3 py-2 text-center font-mono text-xl font-bold tracking-[0.35em] text-[var(--text-primary)] ring-1 ring-[var(--border-subtle)] sm:tracking-[0.4em]"
              aria-live="polite"
            >
              {code}
            </p>
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 px-4 py-2.5 text-xs sm:w-auto"
              onClick={() => copyText("code", code)}
            >
              {copied === "code" ? "Copied" : "Copy code"}
            </Button>
          </div>
        </div>

        {copied === "error" ? (
          <p className="text-xs text-[var(--danger-text)]" role="status">
            Could not copy—select and copy manually.
          </p>
        ) : null}
      </div>
    </BottomSheet>
  );
}
