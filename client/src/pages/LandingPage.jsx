import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { LandingScreenSkeleton } from "../components/ui/ScreenSkeletons.jsx";
import { useAuth } from "../state/AuthProvider.jsx";
import logo from "../assets/logo.png";
import peek from "../assets/peek.png";
import landingSample from "../assets/landing-sample.jpg";

function StepChip({ step, title, body, tone = "primary", className = "" }) {
  const toneClasses =
    tone === "darkGreen"
      ? "border-[rgba(129,160,63,0.34)] bg-[rgba(175,201,126,0.92)] text-[var(--text-secondary)]"
      : tone === "lightGreen"
      ? "border-[rgba(129,160,63,0.26)] bg-[rgba(232,240,213,0.92)] text-[var(--text-secondary)]"
      : tone === "lighterGreen"
      ? "border-[rgba(129,160,63,0.22)] bg-[rgba(244,248,235,0.92)] text-[var(--text-secondary)]"
      : tone === "lightestGreen"
      ? "border-[rgba(129,160,63,0.18)] bg-[rgba(250,251,247,0.92)] text-[var(--text-secondary)]"
      : tone === "beaver"
      ? "border-[rgba(139,94,60,0.20)] bg-[rgba(250,243,234,0.92)] text-[var(--text-secondary)]"
      : tone === "neutral"
      ? "border-[rgba(185,196,170,0.22)] bg-[rgba(255,255,255,0.86)] text-[var(--text-secondary)]"
      : "border-[rgba(129,160,63,0.22)] bg-[rgba(244,248,235,0.9)] text-[var(--text-secondary)]";

  return (
    <div
      className={`select-none rounded-[18px] border px-4 py-3 shadow-[var(--shadow-xs)] backdrop-blur transition-transform duration-200 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-sm)] ${toneClasses} ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-[var(--color-primary-900)] shadow-[var(--shadow-xs)]">
          {step}
        </div>
        <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
      </div>
      <div className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">{body}</div>
    </div>
  );
}

function IconApple({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden className={className}>
      <path d="M16.2 13.1c0-2 1.6-3 1.7-3.1-1-.9-2.5-1-3-1-1.3-.1-2.5.7-3.1.7-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.5 2.6-.4 6.4 1 8.5.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.6 2.6-.6 1.2 0 1.5.6 2.7.6 1.1 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.3-.1 0-2.1-.8-2.1-3.2Z" />
      <path d="M14.6 4.6c.6-.7 1-1.7.9-2.6-.9.1-1.9.6-2.5 1.3-.6.7-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.3Z" />
    </svg>
  );
}

function IconAndroid({ className }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden className={className}>
      <path d="M7.2 8.2 5.9 6.1a.7.7 0 1 1 1.2-.7l1.4 2.2a7.9 7.9 0 0 1 7 0l1.4-2.2a.7.7 0 1 1 1.2.7l-1.3 2.1c1.4 1 2.3 2.6 2.4 4.4H4.8c.1-1.8 1-3.4 2.4-4.4Z" />
      <path d="M6.2 14.1v5.1c0 .7.6 1.3 1.3 1.3.7 0 1.3-.6 1.3-1.3v-5.1h1.1v5.1c0 .7.6 1.3 1.3 1.3.7 0 1.3-.6 1.3-1.3v-5.1h1.1v5.1c0 .7.6 1.3 1.3 1.3.7 0 1.3-.6 1.3-1.3v-5.1h.6c.7 0 1.3-.6 1.3-1.3V13H4.3v.8c0 .7.6 1.3 1.3 1.3h.6Z" />
      <circle cx="9.2" cy="10.5" r="0.8" />
      <circle cx="14.8" cy="10.5" r="0.8" />
    </svg>
  );
}

export function LandingPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LandingScreenSkeleton />;
  }

  return (
    <div className="fixed inset-0 w-screen overflow-y-auto md:overflow-hidden beabr-texture">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_18%,rgba(129,160,63,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(820px_520px_at_82%_22%,rgba(139,94,60,0.06),transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,251,247,0.0),rgba(250,251,247,0.80))]" />
      </div>

      {/* Decorative mascot peek (bottom-right). Sits above all hero content. */}
      <img
        src={peek}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-50 hidden w-auto select-none opacity-95 md:block md:h-[220px] lg:h-[260px] xl:h-[300px]"
      />

      {/* Full-width, edge-to-edge hero layout. */}
      <div className="relative flex min-h-[100svh] w-full items-start px-5 py-10 md:h-full md:items-stretch md:px-12 md:py-0 xl:px-16">
        <div className="grid w-full grid-cols-1 items-start gap-8 md:grid-cols-12 md:items-center md:gap-10 xl:gap-14">
          <div className="relative md:col-span-4 lg:col-span-4 xl:col-span-4">
              <div className="flex items-center gap-4">
                <img
                  src={logo}
                  alt="Beabr logo"
                  className="h-14 w-14 rounded-[18px] border border-[var(--border-subtle)] bg-white object-cover shadow-[var(--shadow-xs)] lg:h-16 lg:w-16"
                />
                <div className="min-w-0">
                  <div className="text-[30px] font-extrabold leading-none tracking-tight text-[var(--text-primary)] md:text-[34px] lg:text-[38px]">
                    Beabr
                  </div>
                </div>
              </div>

              <h1 className="mt-7 text-[40px] font-extrabold leading-[1.02] tracking-tight sm:text-[46px] md:mt-8 md:text-[68px] lg:text-[76px] xl:text-[86px]">
                Keep the
                <span className="block">surprise.</span>
                <span className="mt-1 block text-[var(--color-primary-800)]">Plan the gifts.</span>
              </h1>
              <p className="mt-4 max-w-[50ch] text-[14px] leading-relaxed text-[var(--text-secondary)] sm:text-[15px] md:mt-6 md:max-w-[44ch] md:text-[16px] lg:text-[18px]">
                A private event registry where gift givers reserve, prepare, or pledge for an item, all without revealing
                who did what until your reveal time.
              </p>

              <div className="mt-9 flex flex-row items-center gap-3 sm:grid sm:grid-cols-2 sm:items-stretch sm:gap-4">
                {user ? (
                  <Link className="flex min-w-0 shrink-0 sm:h-full sm:w-full sm:min-w-0" to="/dashboard">
                    <Button className="w-auto whitespace-nowrap px-6 py-4 sm:h-full sm:w-full sm:justify-center sm:px-8">
                      Get started
                    </Button>
                  </Link>
                ) : (
                  <Link className="flex min-w-0 shrink-0 sm:h-full sm:w-full sm:min-w-0" to="/login">
                    <Button className="w-auto whitespace-nowrap px-6 py-4 sm:h-full sm:w-full sm:justify-center sm:px-8">
                      Get started
                    </Button>
                  </Link>
                )}
                {/* Mobile: two lines, left-aligned beside the CTA (no pill) */}
                <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-0.5 text-left text-[11px] font-semibold leading-snug text-[var(--text-secondary)] sm:hidden">
                  <div className="flex flex-wrap items-center justify-start gap-x-1">
                    <span className="text-[var(--text-muted)]">Coming to</span>
                    <span className="inline-flex items-center gap-1 text-[var(--text-primary)]">
                      <IconAndroid className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      Android
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-start gap-x-1">
                    <span className="text-[var(--text-muted)]">and</span>
                    <span className="inline-flex items-center gap-1 text-[var(--text-primary)]">
                      <IconApple className="h-3.5 w-3.5 shrink-0 -translate-y-0.5" aria-hidden />
                      iOS
                    </span>
                    <span className="text-[var(--text-muted)]">soon</span>
                  </div>
                </div>

                {/* Desktop: inline (no pill background), aligned rightward */}
                <div className="hidden min-w-0 shrink-0 flex-nowrap items-center justify-start gap-2 whitespace-nowrap px-6 py-4 text-sm font-semibold text-[var(--text-secondary)] sm:flex sm:h-full sm:w-full sm:pl-[12px] sm:pr-0">
                  <span className="whitespace-nowrap">Coming to</span>
                  <span className="inline-flex items-center gap-1 whitespace-nowrap text-[var(--text-primary)]">
                    <IconAndroid className="h-4 w-4 shrink-0" />
                    Android
                  </span>
                  <span className="whitespace-nowrap text-[var(--text-muted)]">and</span>
                  <span className="inline-flex items-center gap-1 whitespace-nowrap text-[var(--text-primary)]">
                    <IconApple className="h-4 w-4 shrink-0" />
                    iOS
                  </span>
                  <span className="whitespace-nowrap">soon</span>
                </div>
              </div>
          </div>

          <div className="relative md:col-span-8 lg:col-span-8 xl:col-span-8">
            <div className="relative mx-auto flex w-full flex-col items-center py-6 sm:py-8 md:items-center md:py-10">
              <div className="relative w-fit max-w-full">
                <div className="pointer-events-none absolute -inset-16 -z-10 rounded-[48px] bg-[radial-gradient(closest-side,rgba(129,160,63,0.20),rgba(250,251,247,0))] blur-3xl" />
                {/* Extra glow behind bottom-left of the screenshot. */}
                <div className="pointer-events-none absolute -left-[22%] -bottom-[28%] -z-10 h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(129,160,63,0.34),rgba(250,251,247,0))] blur-2xl md:h-[520px] md:w-[640px]" />

                <div className="relative w-fit max-w-full overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] ring-1 ring-[var(--border-default)] md:rounded-[calc(var(--radius-xl)+6px)]">
                  <img
                    src={landingSample}
                    alt="Beabr registry screenshot showing graduation registry header, dates, and gift cards with Philippine peso prices."
                    className="pointer-events-none block h-auto w-full max-w-full select-none md:w-auto"
                    decoding="async"
                    loading="eager"
                  />
                </div>

                {/* Step chips overlay in front of the screenshot + frame (desktop). */}
                <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
                  {/* Step 1: green banner, left (over registry title) */}
                  <div className="pointer-events-auto absolute left-[-4%] top-[4%] z-10 sm:left-[-3%] sm:top-[5%]">
                    <StepChip
                      step="1"
                      title="Create"
                      body="Set main event + reveal date/time."
                      tone="darkGreen"
                      className="w-[238px] -rotate-[2deg] px-4 py-3 shadow-[var(--shadow-md)] sm:w-[260px] sm:px-5 sm:py-4"
                    />
                  </div>
                  {/* Step 2: green banner, right (near owner actions) */}
                  <div className="pointer-events-auto absolute right-[-2%] top-[13%] z-10 sm:right-[-1%] sm:top-[14%]">
                    <StepChip
                      step="2"
                      title="Add"
                      body="Gift items, links, and details."
                      tone="lightGreen"
                      className="w-[230px] rotate-[2.5deg] px-4 py-3 shadow-[var(--shadow-md)] sm:w-[252px] sm:px-5 sm:py-4"
                    />
                  </div>
                  {/* Step 3: above first gift card (left column) */}
                  <div className="pointer-events-auto absolute left-[-3%] top-[58%] z-10 sm:left-[-2%] sm:top-[59%]">
                    <StepChip
                      step="3"
                      title="Invite"
                      body="Join code or link for givers."
                      tone="lighterGreen"
                      className="w-[250px] rotate-[1.5deg] px-4 py-3 shadow-[var(--shadow-md)] sm:w-[276px] sm:px-5 sm:py-4"
                    />
                  </div>
                  {/* Step 4: above second gift card (right column) */}
                  <div className="pointer-events-auto absolute right-[-3%] top-[74%] z-10 sm:right-[-2%] sm:top-[75%]">
                    <StepChip
                      step="4"
                      title="Reveal"
                      body="See who prepared & pledged—thank-you notes follow."
                      tone="lightestGreen"
                      className="w-[238px] -rotate-[2deg] px-4 py-3 shadow-[var(--shadow-md)] sm:w-[268px] sm:px-5 sm:py-4"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid w-full max-w-full grid-cols-2 gap-3 md:hidden">
                <StepChip step="1" title="Create" body="Set reveal date/time." tone="darkGreen" />
                <StepChip step="2" title="Add" body="Gifts, links, details." tone="lightGreen" />
                <StepChip step="3" title="Invite" body="Code or invite link." tone="lighterGreen" />
                <StepChip step="4" title="Reveal" body="Who helped unlocks—then thanks." tone="lightestGreen" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
