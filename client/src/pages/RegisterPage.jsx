import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { PageHeader } from "../components/ui/PageChrome.jsx";
import { useAuth } from "../state/AuthProvider.jsx";
import { isInAppBrowser } from "../utils/browser.js";
import { InAppBrowserBanner } from "../components/ui/InAppBrowserBanner.jsx";
import peek from "../assets/peek.png";

const inputClassName =
  "mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]";

export function RegisterPage() {
  const { signInWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErr, setFormErr] = useState(null);
  const inAppBrowser = isInAppBrowser();

  function onRegister(e) {
    e.preventDefault();
    setFormErr("Registration with email & password isn't enabled yet. Please use Google sign-up for now.");
  }

  return (
    <div className="fixed inset-0 flex w-screen items-center justify-center overflow-y-auto p-5">
      <img
        src={peek}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[180px] w-auto select-none sm:h-[220px] md:h-[260px] opacity-95"
      />
      <div className="relative z-[1] w-full max-w-md space-y-5 py-8">
        <PageHeader
          eyebrow="Account"
          title="Create account"
          description="Use Google to sign up quickly, or enter your details for when email registration is enabled."
        />

        {inAppBrowser && <InAppBrowserBanner />}

        <Card className="p-5 shadow-[var(--shadow-md)] ring-1 ring-[var(--border-subtle)] sm:p-6">
          <form className="space-y-3 text-left" onSubmit={onRegister}>
            <label className="block">
              <div className="text-xs font-semibold text-[var(--text-secondary)]">Name</div>
              <input
                className={inputClassName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </label>
            <label className="block">
              <div className="text-xs font-semibold text-[var(--text-secondary)]">Email</div>
              <input
                type="email"
                className={inputClassName}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="block">
              <div className="text-xs font-semibold text-[var(--text-secondary)]">Password</div>
              <input
                type="password"
                className={inputClassName}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Create a password"
                required
              />
            </label>

            {formErr ? (
              <div className="rounded-[14px] border border-[rgba(155,28,28,0.20)] bg-[var(--danger-bg)] px-3 py-2 text-xs text-[var(--danger-text)]">
                {formErr}
              </div>
            ) : null}

            <Button type="submit" className="w-full">
              Register
            </Button>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
              <div className="text-xs text-[var(--text-muted)]">or</div>
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
            </div>

            {inAppBrowser ? (
              <div className="inline-flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-[999px] border border-[var(--border-default)] bg-[var(--color-neutral-100)] px-4 py-3 text-sm font-semibold text-[var(--text-muted)] opacity-50">
                <span aria-hidden className="grid h-5 w-5 place-items-center">
                  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#EA4335" d="M24 9.5c3.2 0 6.1 1.1 8.4 3.1l6.3-6.3C34.8 2.6 29.7.5 24 .5 14.6.5 6.5 6 2.6 14.1l7.3 5.7C11.7 13.5 17.4 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.7h12.6c-.3 2-1.6 5-4.6 7.1l7.1 5.5c4.3-4 7-9.9 7-17.2z" />
                    <path fill="#FBBC05" d="M9.9 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.3-5.7C1.2 16.6.5 20.1.5 24s.7 7.4 2.1 10.4l7.3-5.7z" />
                    <path fill="#34A853" d="M24 47.5c5.7 0 10.5-1.9 14-5.2l-7.1-5.5c-1.9 1.3-4.5 2.2-6.9 2.2-6.6 0-12.2-4-14.1-9.6l-7.3 5.7C6.5 42 14.6 47.5 24 47.5z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                </span>
                <span>Sign up with Google</span>
              </div>
            ) : (
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-3 rounded-[999px] border border-[var(--border-default)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-neutral-100)] active:scale-[0.99]"
                onClick={async () => {
                  setFormErr(null);
                  try {
                    await signInWithGoogle();
                  } catch (e2) {
                    setFormErr(e2?.message || String(e2));
                  }
                }}
              >
                <span aria-hidden className="grid h-5 w-5 place-items-center">
                  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#EA4335" d="M24 9.5c3.2 0 6.1 1.1 8.4 3.1l6.3-6.3C34.8 2.6 29.7.5 24 .5 14.6.5 6.5 6 2.6 14.1l7.3 5.7C11.7 13.5 17.4 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.7h12.6c-.3 2-1.6 5-4.6 7.1l7.1 5.5c4.3-4 7-9.9 7-17.2z" />
                    <path fill="#FBBC05" d="M9.9 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.3-5.7C1.2 16.6.5 20.1.5 24s.7 7.4 2.1 10.4l7.3-5.7z" />
                    <path fill="#34A853" d="M24 47.5c5.7 0 10.5-1.9 14-5.2l-7.1-5.5c-1.9 1.3-4.5 2.2-6.9 2.2-6.6 0-12.2-4-14.1-9.6l-7.3 5.7C6.5 42 14.6 47.5 24 47.5z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                </span>
                <span>Sign up with Google</span>
              </button>
            )}

            <div className="pt-1 text-center text-xs text-[var(--text-muted)]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[var(--color-primary-800)] hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}


