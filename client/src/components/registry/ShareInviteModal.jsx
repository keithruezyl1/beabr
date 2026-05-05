import { useCallback, useEffect, useState } from "react";
import { BottomSheet } from "../ui/BottomSheet.jsx";
import { BrandedQrCode } from "../ui/BrandedQrCode.jsx";
import { useToast } from "../ui/ToastProvider.jsx";

function IconCopy({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function inviteLinkOrigin() {
  const fromEnv = String(import.meta.env.VITE_APP_ORIGIN || "").trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

export function ShareInviteModal({ open, onClose, joinCode }) {
  const toast = useToast();
  const code = String(joinCode || "").toUpperCase();
  const inviteUrl = `${inviteLinkOrigin()}/registry/join/${encodeURIComponent(code)}`;
  const qrName = `beabr-invite-${code}`.toLowerCase().replace(/[^a-z0-9-_]+/g, "-").replace(/-+/g, "-");
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!open) setCopied(null);
  }, [open]);

  const copyText = useCallback(async (label, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2000);
      toast.success(label === "code" ? "Join code copied." : "Invite link copied.");
    } catch {
      setCopied("error");
      window.setTimeout(() => setCopied(null), 2000);
      toast.error("Could not copy. Select and copy manually.");
    }
  }, [toast]);

  return (
    <BottomSheet open={open} onClose={onClose} title="Invite gift givers" variant="modal">
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Scan the QR code or share the link. Signed-in guests open the registry directly; others sign in first, then join
          with this code or link.
        </p>

        <BrandedQrCode
          value={inviteUrl}
          size={176}
          fgColor="var(--text-primary)"
          frameBorderColor="var(--border-default)"
          qrName={qrName}
        />

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Invite link</div>
          <div className="mt-2">
            <div className="relative">
              <p className="min-w-0 break-all rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] px-3 py-2 pr-12 text-xs leading-snug text-[var(--text-primary)] ring-1 ring-[var(--border-subtle)]">
              {inviteUrl}
              </p>
              <button
                type="button"
                onClick={() => copyText("link", inviteUrl)}
                className="absolute right-1.5 top-1/2 inline-flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-white hover:text-[var(--text-secondary)] active:bg-[var(--color-neutral-200)]"
                aria-label={copied === "link" ? "Copied invite link" : "Copy invite link"}
              >
                <IconCopy className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Join code</div>
          <div className="mt-2">
            <div className="relative">
            <p
              className="flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] px-3 py-2 pr-12 text-center font-mono text-xl font-bold tracking-[0.35em] text-[var(--text-primary)] ring-1 ring-[var(--border-subtle)] sm:tracking-[0.4em]"
              aria-live="polite"
            >
              {code}
            </p>
              <button
                type="button"
                onClick={() => copyText("code", code)}
                className="absolute right-1.5 top-1/2 inline-flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-white hover:text-[var(--text-secondary)] active:bg-[var(--color-neutral-200)]"
                aria-label={copied === "code" ? "Copied join code" : "Copy join code"}
              >
                <IconCopy className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
