import { useState } from "react";
import { InAppBrowserBanner } from "../components/ui/InAppBrowserBanner.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import peek from "../assets/peek.png";

const inputClassName =
  "mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]";

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.2 0 6.1 1.1 8.4 3.1l6.3-6.3C34.8 2.6 29.7.5 24 .5 14.6.5 6.5 6 2.6 14.1l7.3 5.7C11.7 13.5 17.4 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.7h12.6c-.3 2-1.6 5-4.6 7.1l7.1 5.5c4.3-4 7-9.9 7-17.2z" />
    <path fill="#FBBC05" d="M9.9 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.3-5.7C1.2 16.6.5 20.1.5 24s.7 7.4 2.1 10.4l7.3-5.7z" />
    <path fill="#34A853" d="M24 47.5c5.7 0 10.5-1.9 14-5.2l-7.1-5.5c-1.9 1.3-4.5 2.2-6.9 2.2-6.6 0-12.2-4-14.1-9.6l-7.3 5.7C6.5 42 14.6 47.5 24 47.5z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

function MockLoginPage() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-5">
      <img
        src={peek}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[140px] w-auto select-none opacity-95"
      />
      <div className="flex w-full max-w-md flex-col items-center space-y-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Log in to get started</h1>
        <div className="w-full">
          <InAppBrowserBanner />
        </div>
        <Card className="w-full p-5">
          <div className="space-y-3">
            <label className="block text-left">
              <div className="text-xs font-semibold text-[var(--text-secondary)]">Email</div>
              <input readOnly className={inputClassName} placeholder="you@example.com" />
            </label>
            <button className="w-full rounded-[14px] bg-[var(--color-primary-600)] px-4 py-3 text-sm font-semibold text-white">
              Send code
            </button>
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
              <div className="text-xs text-[var(--text-muted)]">or</div>
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
            </div>
            <div className="inline-flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-[999px] border border-[var(--border-default)] bg-[var(--color-neutral-100)] px-4 py-3 text-sm font-semibold text-[var(--text-muted)] opacity-50">
              <span className="grid h-5 w-5 place-items-center">{GOOGLE_SVG}</span>
              <span>Sign in with Google</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MockRegisterPage() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-5">
      <img
        src={peek}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[140px] w-auto select-none opacity-95"
      />
      <div className="relative z-[1] w-full max-w-md space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Account</p>
          <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
        </div>
        <InAppBrowserBanner />
        <Card className="p-5">
          <div className="space-y-3 text-left">
            {["Name", "Email", "Password"].map((label) => (
              <label key={label} className="block">
                <div className="text-xs font-semibold text-[var(--text-secondary)]">{label}</div>
                <input readOnly className={inputClassName} placeholder={`Your ${label.toLowerCase()}`} />
              </label>
            ))}
            <button className="w-full rounded-[14px] bg-[var(--color-primary-600)] px-4 py-3 text-sm font-semibold text-white">
              Register
            </button>
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
              <div className="text-xs text-[var(--text-muted)]">or</div>
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
            </div>
            <div className="inline-flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-[999px] border border-[var(--border-default)] bg-[var(--color-neutral-100)] px-4 py-3 text-sm font-semibold text-[var(--text-muted)] opacity-50">
              <span className="grid h-5 w-5 place-items-center">{GOOGLE_SVG}</span>
              <span>Sign up with Google</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function InAppBrowserPreviewPage() {
  const [view, setView] = useState("login");
  const MockPage = view === "login" ? MockLoginPage : MockRegisterPage;

  return (
    <div className="min-h-screen bg-[var(--color-neutral-100)] p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Design Preview</p>
        <h1 className="text-2xl font-bold tracking-tight">In-App Browser Banner</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Shown when users open the app inside Facebook, Instagram, Messenger, etc.
        </p>
      </div>

      {/* Page toggle */}
      <div className="mb-6 flex gap-2">
        {["login", "register"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-[999px] px-4 py-1.5 text-sm font-semibold transition ${
              view === v
                ? "bg-[var(--color-primary-600)] text-white"
                : "bg-white text-[var(--text-secondary)] ring-1 ring-[var(--border-default)] hover:bg-[var(--color-neutral-50)]"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)} page
          </button>
        ))}
      </div>

      {/* Frames */}
      <div className="flex flex-wrap gap-8">
        {/* Desktop frame */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Desktop</span>
          <div
            className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_32px_rgba(0,0,0,0.12)] ring-1 ring-[var(--border-subtle)]"
            style={{ width: 960, height: 600 }}
          >
            <div className="flex h-8 items-center gap-1.5 border-b border-[var(--border-subtle)] bg-[var(--color-neutral-50)] px-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <div className="mx-3 flex-1 rounded bg-[var(--border-subtle)] py-0.5 px-3 text-[10px] text-[var(--text-muted)]">
                beabr.app/{view}
              </div>
            </div>
            <div className="h-[calc(100%-2rem)]">
              <MockPage />
            </div>
          </div>
        </div>

        {/* Mobile frame */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Mobile</span>
          <div
            className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-[0_4px_32px_rgba(0,0,0,0.18)] ring-4 ring-[#1a1a1a]"
            style={{ width: 390, height: 700 }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-[#1a1a1a]" />
            <div className="h-full overflow-y-auto pt-6">
              <MockPage />
            </div>
          </div>
        </div>
      </div>

      {/* Banner isolated */}
      <div className="mt-10">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Banner — isolated</span>
        <div className="max-w-md">
          <InAppBrowserBanner />
        </div>
      </div>
    </div>
  );
}
