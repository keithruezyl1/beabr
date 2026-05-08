import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useAuth } from "../state/AuthProvider.jsx";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { safeInternalPath } from "../utils/navigation.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import peek from "../assets/peek.png";

const inputClassName =
  "mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]";

function GoogleSignInButton({ href }) {
  return (
    <a href={href} className="block">
      <button
        type="button"
        className="inline-flex w-full items-center justify-center gap-3 rounded-[999px] border border-[var(--border-default)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-neutral-100)] active:scale-[0.99]"
      >
        <span aria-hidden className="grid h-5 w-5 place-items-center">
          <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#EA4335"
              d="M24 9.5c3.2 0 6.1 1.1 8.4 3.1l6.3-6.3C34.8 2.6 29.7.5 24 .5 14.6.5 6.5 6 2.6 14.1l7.3 5.7C11.7 13.5 17.4 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.7h12.6c-.3 2-1.6 5-4.6 7.1l7.1 5.5c4.3-4 7-9.9 7-17.2z"
            />
            <path
              fill="#FBBC05"
              d="M9.9 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.3-5.7C1.2 16.6.5 20.1.5 24s.7 7.4 2.1 10.4l7.3-5.7z"
            />
            <path
              fill="#34A853"
              d="M24 47.5c5.7 0 10.5-1.9 14-5.2l-7.1-5.5c-1.9 1.3-4.5 2.2-6.9 2.2-6.6 0-12.2-4-14.1-9.6l-7.3 5.7C6.5 42 14.6 47.5 24 47.5z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
        </span>
        <span>Sign in with Google</span>
      </button>
    </a>
  );
}

function normalizeLoginErrorMessage(error) {
  const message = String(error?.message || "").trim();
  const lower = message.toLowerCase();

  if (lower.includes("email rate limit exceeded")) {
    return "You already have a pending sign-in email. Check your inbox or wait a moment before requesting another code.";
  }

  if (lower.includes("otp") || lower.includes("token") || lower.includes("invalid") || lower.includes("expired")) {
    return "That code is invalid or expired. Request a new one and try again.";
  }

  return message || "Something went wrong. Try again.";
}

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const nextAfterLogin = safeInternalPath(searchParams.get("next"));
  const { signInWithGoogle, sendEmailOtp, verifyEmailOtp } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // email | otp
  const [busy, setBusy] = useState(false);

  async function onEmailLogin(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await sendEmailOtp(email);
      setStep("otp");
    } catch (e2) {
      toast.caution(normalizeLoginErrorMessage(e2));
    } finally {
      setBusy(false);
    }
  }

  async function onVerifyOtp(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await verifyEmailOtp({ email, token: otp });
    } catch (e2) {
      toast.error(normalizeLoginErrorMessage(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 flex w-screen items-center justify-center p-5">
      <img
        src={peek}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[180px] w-auto select-none sm:h-[220px] md:h-[260px] opacity-95"
      />
      <div className="flex w-full max-w-md flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Log in to get started</h1>

        <Card className="w-full p-5">
          <form
            className="space-y-3"
            onSubmit={step === "email" ? onEmailLogin : onVerifyOtp}
          >
            <label className="block text-left">
              <div className="text-xs font-semibold text-[var(--text-secondary)]">Email</div>
              <input
                type="email"
                className={inputClassName}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                required
                disabled={step !== "email"}
              />
            </label>
            {step === "otp" ? (
              <label className="block text-left">
                <div className="text-xs font-semibold text-[var(--text-secondary)]">
                  6-digit code
                </div>
                <input
                  inputMode="numeric"
                  className={inputClassName}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  required
                />
                <div className="mt-1 text-xs text-[var(--text-muted)]">
                  We emailed a one-time code to {email}.
                </div>
              </label>
            ) : null}
          <Button type="submit" className="w-full">
            {busy ? "Working..." : step === "email" ? "Send code" : "Verify code"}
          </Button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
            <div className="text-xs text-[var(--text-muted)]">or</div>
            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-3 rounded-[999px] border border-[var(--border-default)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-neutral-100)] active:scale-[0.99]"
            onClick={async () => {
              try {
                await signInWithGoogle(nextAfterLogin ?? undefined);
              } catch (e2) {
                toast.error(normalizeLoginErrorMessage(e2));
              }
            }}
          >
            <span aria-hidden className="grid h-5 w-5 place-items-center">
              <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.2 0 6.1 1.1 8.4 3.1l6.3-6.3C34.8 2.6 29.7.5 24 .5 14.6.5 6.5 6 2.6 14.1l7.3 5.7C11.7 13.5 17.4 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.7h12.6c-.3 2-1.6 5-4.6 7.1l7.1 5.5c4.3-4 7-9.9 7-17.2z"
                />
                <path
                  fill="#FBBC05"
                  d="M9.9 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.3-5.7C1.2 16.6.5 20.1.5 24s.7 7.4 2.1 10.4l7.3-5.7z"
                />
                <path
                  fill="#34A853"
                  d="M24 47.5c5.7 0 10.5-1.9 14-5.2l-7.1-5.5c-1.9 1.3-4.5 2.2-6.9 2.2-6.6 0-12.2-4-14.1-9.6l-7.3 5.7C6.5 42 14.6 47.5 24 47.5z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
            </span>
            <span>Sign in with Google</span>
          </button>

          <p className="pt-2 text-center text-[11px] leading-relaxed text-[var(--text-muted)]">
            By continuing, you agree to the{" "}
            <Link
              to="/documentation/legal/terms-of-service"
              className="font-semibold text-[var(--color-primary-700)] underline underline-offset-2 decoration-[rgba(129,160,63,0.55)] hover:text-[var(--color-primary-800)]"
            >
              Terms of use
            </Link>{" "}
            and{" "}
            <Link
              to="/documentation/legal/privacy-policy"
              className="font-semibold text-[var(--color-primary-700)] underline underline-offset-2 decoration-[rgba(129,160,63,0.55)] hover:text-[var(--color-primary-800)]"
            >
              Privacy overview
            </Link>
            .
          </p>

          {/* Registration is intentionally hidden for this early iteration (Google sign-in only). */}
          </form>
        </Card>
      </div>
    </div>
  );
}


