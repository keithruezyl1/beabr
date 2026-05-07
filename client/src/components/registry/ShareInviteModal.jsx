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

function IconLink({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconHash({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function inviteLinkOrigin() {
  const fromEnv = String(import.meta.env.VITE_APP_ORIGIN || "").trim().replace(/\/$/, "");
  return fromEnv || "https://beabr.vercel.app";
}

export function ShareInviteModal({ open, onClose, joinCode }) {
  const toast = useToast();
  const code = String(joinCode || "").toUpperCase();
  const inviteUrl = `${inviteLinkOrigin()}/registry/join/${encodeURIComponent(code)}`;
  const qrName = `beabr-invite-${code}`.toLowerCase().replace(/[^a-z0-9-_]+/g, "-").replace(/-+/g, "-");
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (open) return undefined;
    const timer = window.setTimeout(() => setCopied(null), 0);
    return () => window.clearTimeout(timer);
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
    <BottomSheet open={open} onClose={onClose} title="Invite gift givers" variant="modal" contentTourId="share-invite-modal">
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Share the QR code, link, or join code to invite guests.
        </p>

        <BrandedQrCode
          value={inviteUrl}
          size={196}
          fgColor="var(--text-primary)"
          qrName={qrName}
          qrTourId="share-invite-qr-code"
          downloadTourId="share-download-qr-code"
        />

        <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]" aria-hidden>
          <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          <span>or</span>
          <span className="h-px flex-1 bg-[var(--border-subtle)]" />
        </div>

        <div className="space-y-3">
          <section className="rounded-[var(--radius-lg)] bg-[var(--surface-card-soft)] p-3 ring-1 ring-[var(--border-subtle)]">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              <IconLink className="h-4 w-4 text-[var(--color-primary-700)]" />
              <span>Invite link</span>
            </div>
            <div className="relative">
              <p className="flex min-h-[44px] min-w-0 items-center overflow-x-auto whitespace-nowrap rounded-[var(--radius-md)] bg-white px-3 py-2.5 pr-12 text-xs leading-none text-[var(--text-primary)] ring-1 ring-[var(--border-subtle)]">
                {inviteUrl}
              </p>
              <span className="pointer-events-none absolute inset-y-px right-px z-[1] w-16 rounded-r-[var(--radius-md)] bg-gradient-to-l from-white via-white to-transparent" aria-hidden />
              <button
                type="button"
                data-tour-id="share-copy-link"
                onClick={() => copyText("link", inviteUrl)}
                className="absolute right-1.5 top-1/2 z-[2] inline-flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[var(--text-muted)] shadow-[var(--shadow-xs)] transition-colors hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-700)] active:bg-[var(--color-primary-100)]"
                aria-label={copied === "link" ? "Copied invite link" : "Copy invite link"}
              >
                <IconCopy className="h-5 w-5" />
              </button>
            </div>
          </section>

          <section className="rounded-[var(--radius-lg)] bg-[var(--surface-card-soft)] p-3 ring-1 ring-[var(--border-subtle)]">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              <IconHash className="h-4 w-4 text-[var(--color-primary-700)]" />
              <span>Join code</span>
            </div>
            <div className="relative">
              <p
                className="flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] bg-white px-3 py-2.5 pr-12 text-center font-mono text-xl font-bold tracking-[0.35em] text-[var(--color-primary-800)] ring-1 ring-[var(--border-subtle)] sm:tracking-[0.4em]"
                aria-live="polite"
              >
                {code}
              </p>
              <button
                type="button"
                onClick={() => copyText("code", code)}
                className="absolute right-1.5 top-1/2 inline-flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-700)] active:bg-[var(--color-primary-100)]"
                aria-label={copied === "code" ? "Copied join code" : "Copy join code"}
              >
                <IconCopy className="h-5 w-5" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </BottomSheet>
  );
}
