import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Button } from "./Button.jsx";
import celebrate from "../../assets/celebrate.png";

function IconCheckBadge({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="m7.5 12.2 2.9 2.9 6.4-6.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconX({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SuccessModal({
  open,
  badgeLabel = "Success",
  title,
  subtitle,
  ctaLabel = "Continue",
  ctaTo,
  onCta,
  onClose,
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return undefined;
    }
    const t = window.setTimeout(() => setEntered(true), 30);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const primaryButton = useMemo(() => {
    if (ctaTo) {
      return (
        <Link to={ctaTo} className="block w-full" onClick={onCta}>
          <Button className="w-full px-8 py-4">{ctaLabel}</Button>
        </Link>
      );
    }
    return (
      <Button className="w-full px-8 py-4" type="button" onClick={onCta}>
        {ctaLabel}
      </Button>
    );
  }, [ctaLabel, ctaTo, onCta]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[220]">
      <div
        className={`absolute inset-0 bg-[var(--surface-overlay)] backdrop-blur-sm transition-opacity duration-200 ease-[var(--ease-standard)] ${
          entered ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
        onMouseDown={onClose}
      />

      <div className="relative flex min-h-[100dvh] w-full items-center justify-center px-5 py-10">
        <main
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
          aria-describedby="success-modal-subtitle"
          className={`relative w-full max-w-[420px] rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-card)] shadow-[var(--shadow-lg)] transition-all duration-200 ease-[var(--ease-standard)] ${
            entered ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.99] opacity-0"
          }`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[var(--radius-xl)]">
            <div className="absolute inset-0 opacity-[0.22] blur-[0.6px] [background-image:radial-gradient(rgba(129,160,63,0.28)_1.25px,transparent_1.25px),radial-gradient(rgba(185,196,170,0.22)_1.15px,transparent_1.15px)] [background-size:26px_26px,22px_22px] [background-position:0_0,6px_18px]" />
            <div className="absolute inset-0 bg-[radial-gradient(620px_360px_at_50%_36%,rgba(129,160,63,0.10),rgba(255,255,255,0)_70%)]" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--text-muted)] transition-colors hover:text-[var(--color-primary-600)] active:text-[var(--color-primary-700)]"
            aria-label="Close"
          >
            <IconX className="h-5 w-5" aria-hidden />
          </button>

          <div className="px-7 pb-7 pt-8 text-center sm:px-9 sm:pb-9 sm:pt-10">
            <div className="mx-auto flex w-fit items-center justify-center gap-2 rounded-full bg-[var(--success-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--success-text)] ring-1 ring-[rgba(129,160,63,0.22)]">
              <IconCheckBadge className="h-4 w-4" aria-hidden />
              {badgeLabel}
            </div>

            <h1
              id="success-modal-title"
              className="mt-4 text-[32px] font-extrabold leading-[1.05] tracking-tight text-[var(--text-primary)]"
            >
              {title}
            </h1>
            <p id="success-modal-subtitle" className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {subtitle}
            </p>

            <div className="relative isolate mt-6 flex justify-center">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-8 -z-10 rounded-[42px] bg-[radial-gradient(closest-side,rgba(129,160,63,0.20),rgba(250,251,247,0))] blur-2xl"
              />
              <img
                src={celebrate}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="h-auto w-[220px] select-none sm:w-[250px]"
              />
            </div>

            <div className="mt-6">{primaryButton}</div>
          </div>
        </main>
      </div>
    </div>,
    document.body
  );
}

