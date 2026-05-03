import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { PageHeader } from "../components/ui/PageChrome.jsx";
import { IconMail } from "../components/ui/PageIcons.jsx";
import peek from "../assets/peek.png";

const inputClassName =
  "mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);

  function onSubmit(e) {
    e.preventDefault();
    setMsg(
      "Password reset isn’t enabled yet. For now, use Google sign-in (or ask the registry owner for the invite link again)."
    );
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
          eyebrow="Help"
          title="Reset password"
          description="This beaver forgot their password—we’ll email a reset link when the feature is available."
        />

        <Card className="p-5 shadow-[var(--shadow-md)] ring-1 ring-[var(--border-subtle)] sm:p-6">
          <form className="space-y-4 text-left" onSubmit={onSubmit}>
            <div className="flex items-start gap-3 rounded-[var(--radius-lg)] bg-[var(--surface-card-soft)] p-4 ring-1 ring-[var(--border-subtle)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                <IconMail className="h-5 w-5" aria-hidden />
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Enter the email you use with Beabr. If password reset is enabled, we’ll send a secure link.
              </p>
            </div>

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

            {msg ? (
              <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] px-3 py-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                {msg}
              </div>
            ) : null}

            <Button className="w-full" type="submit">
              Send reset link
            </Button>

            <div className="pt-1 text-center text-xs text-[var(--text-muted)]">
              Back to{" "}
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
