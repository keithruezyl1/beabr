import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { LandingScreenSkeleton } from "../components/ui/ScreenSkeletons.jsx";
import { useAuth } from "../state/AuthProvider.jsx";
import { useFadeIn } from "../hooks/useFadeIn.js";
import logo from "../assets/logo.png";
import waving from "../assets/waving.png";
import celebrate from "../assets/celebrate.png";
import talking1 from "../assets/talking_1.png";
import peek from "../assets/peek.png";
import landingSample from "../assets/landing-sample.jpg";

// ── Step chip ─────────────────────────────────────────────────────────────────
function StepChip({ step, title, body, tone = "primary" }) {
  const tones = {
    darkGreen:    "border-[rgba(129,160,63,0.34)] bg-[rgba(175,201,126,0.92)]",
    lightGreen:   "border-[rgba(129,160,63,0.26)] bg-[rgba(232,240,213,0.92)]",
    lighterGreen: "border-[rgba(129,160,63,0.22)] bg-[rgba(244,248,235,0.92)]",
    lightestGreen:"border-[rgba(129,160,63,0.18)] bg-[rgba(250,251,247,0.92)]",
  };
  return (
    <div className={`select-none rounded-[18px] border px-4 py-3 shadow-[var(--shadow-xs)] backdrop-blur transition-all duration-200 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-sm)] ${tones[tone] ?? tones.lighterGreen} text-[var(--text-secondary)]`}>
      <div className="flex items-center gap-2">
        <div className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-bold text-[var(--color-primary-900)] shadow-[var(--shadow-xs)]">
          {step}
        </div>
        <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
      </div>
      <div className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">{body}</div>
    </div>
  );
}

// ── SVG icons (with animatable inner groups) ──────────────────────────────────
function GiftIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g className="lp-icon-gift">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </g>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <g className="lp-icon-shackle">
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </g>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <g className="lp-icon-iris">
        <circle cx="12" cy="12" r="3" />
      </g>
    </svg>
  );
}

function CheckMini() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Features data ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <GiftIcon />,
    title: "Build your registry",
    body: "Add gift ideas, links, and details for any life event. Graduations, weddings, celebrations — all covered.",
  },
  {
    icon: <LockIcon />,
    title: "Choose your privacy style",
    body: "Private surprise or open coordination — set it once at creation and let givers coordinate naturally.",
  },
  {
    icon: <EyeIcon />,
    title: "Reveal on your terms",
    body: "Pick a date and time. Givers stay anonymous until you're ready to see who made your moment special.",
  },
];

const OWNER_BULLETS = [
  "Create a private registry for your event",
  "Add gift ideas so loved ones know what's meaningful",
  "Set a reveal date — see who helped when the time comes",
];

const GIVER_BULLETS = [
  "Join with an invite code or link",
  "Reserve or contribute to a gift quietly",
  "Stay anonymous until reveal day",
];

// ── 1. Hero ───────────────────────────────────────────────────────────────────
function HeroSection({ user }) {
  const s = (i) => ({ animationDelay: `${i * 90}ms` });

  return (
    <section className="grid min-h-[100svh] w-full grid-cols-1 md:grid-cols-2">
      {/* Left — mascot */}
      <div className="relative overflow-hidden bg-[var(--color-primary-50)] md:h-full">
        {/* Mobile: short mascot bar */}
        <div className="flex h-56 items-end justify-center md:hidden">
          <img
            src={waving}
            alt=""
            aria-hidden="true"
            className="h-52 w-auto select-none object-contain object-bottom"
            loading="eager"
            draggable={false}
          />
        </div>
        {/* Desktop: full-height mascot */}
        <img
          src={waving}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full select-none object-contain object-bottom md:block"
          loading="eager"
          draggable={false}
        />
        {/* Right-edge blend into page bg */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-28 bg-gradient-to-r from-transparent to-[var(--surface-page)] md:block" />
        {/* Bottom blend on mobile */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[var(--surface-page)] md:hidden" />
      </div>

      {/* Right — content */}
      <div className="flex flex-col justify-center px-7 py-12 sm:px-10 md:px-12 xl:px-16">
        {/* Logo + wordmark */}
        <div className="lp-hero-in flex items-center gap-3" style={s(0)}>
          <img
            src={logo}
            alt="Beabr logo"
            className="h-11 w-11 rounded-[14px] border border-[var(--border-subtle)] bg-white object-cover shadow-[var(--shadow-xs)]"
          />
          <span className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Beabr</span>
        </div>

        {/* Headline */}
        <h1
          className="lp-hero-in mt-8 text-[42px] font-extrabold leading-[1.04] tracking-tight text-[var(--text-primary)] sm:text-[50px] lg:text-[58px] xl:text-[66px]"
          style={s(1)}
        >
          Plan gifts<br />
          with care.<br />
          <span className="text-[var(--color-primary-700)]">Keep the love clear.</span>
        </h1>

        {/* Subtext */}
        <p
          className="lp-hero-in mt-5 max-w-[42ch] text-[15px] leading-relaxed text-[var(--text-secondary)] md:text-base"
          style={s(2)}
        >
          A private event registry where loved ones reserve, prepare, or pledge for gifts — with the visibility style that fits your celebration.
        </p>

        {/* CTA */}
        <div className="lp-hero-in mt-8 flex flex-col gap-3" style={s(3)}>
          <div>
            <Link to={user ? "/dashboard" : "/login"}>
              <Button className="px-7 py-3.5 text-sm font-semibold">
                {user ? "Go to dashboard" : "Get started free"}
              </Button>
            </Link>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Coming to iOS &amp; Android soon</p>
        </div>

        {/* Step chips — 2×2 */}
        <div className="lp-hero-in mt-8 grid grid-cols-2 gap-2.5" style={s(4)}>
          <StepChip step="1" title="Create" body="Set event + reveal date/time." tone="darkGreen" />
          <StepChip step="2" title="Add"    body="Gift items, links, and details." tone="lightGreen" />
          <StepChip step="3" title="Invite" body="Join code or link for givers." tone="lighterGreen" />
          <StepChip step="4" title="Reveal" body="See who helped, send thanks."  tone="lightestGreen" />
        </div>
      </div>
    </section>
  );
}

// ── 2. Features ───────────────────────────────────────────────────────────────
function FeaturesSection() {
  const screenshot  = useFadeIn({ direction: "left",  threshold: 0.1 });
  const headingFade = useFadeIn({ direction: "up",    threshold: 0.1 });
  const feat0       = useFadeIn({ direction: "right", threshold: 0.1, delay: 0   });
  const feat1       = useFadeIn({ direction: "right", threshold: 0.1, delay: 90  });
  const feat2       = useFadeIn({ direction: "right", threshold: 0.1, delay: 180 });
  const feats       = [feat0, feat1, feat2];

  return (
    <section className="w-full bg-[var(--color-primary-50)] px-7 py-20 sm:px-10 md:px-12 md:py-28 xl:px-16">
      {/* Mobile heading */}
      <div ref={headingFade.ref} style={headingFade.style} className="mb-10 md:hidden">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-600)]">How it works</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Everything you need,<br />nothing you don't.
        </h2>
      </div>

      <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-14 xl:gap-16">
        {/* Screenshot */}
        <div ref={screenshot.ref} style={screenshot.style} className="relative md:col-span-5 lg:col-span-6">
          <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[48px] bg-[radial-gradient(closest-side,rgba(129,160,63,0.22),transparent)] blur-2xl" />
          <div className="overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] ring-1 ring-[var(--border-default)]">
            <img
              src={landingSample}
              alt="Beabr registry showing graduation registry header, dates, and gift cards."
              className="block h-auto w-full select-none"
              decoding="async"
              loading="lazy"
            />
          </div>
        </div>

        {/* Feature rows */}
        <div className="flex flex-col gap-1 md:col-span-7 lg:col-span-6">
          {/* Desktop heading */}
          <div className="mb-6 hidden md:block">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-600)]">How it works</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--text-primary)] lg:text-[36px]">
              Everything you need,<br />nothing you don't.
            </h2>
          </div>

          {FEATURES.map((f, i) => (
            <div key={f.title} ref={feats[i].ref} style={feats[i].style}>
              <div className="lp-feature-row group flex cursor-default items-start gap-4 rounded-[var(--radius-lg)] px-4 py-4 transition-all duration-[180ms] ease-[var(--ease-standard)] hover:translate-x-1 hover:bg-white hover:shadow-[var(--shadow-sm)]">
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{f.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{f.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 3. Who it's for ───────────────────────────────────────────────────────────
function PersonaBullet({ text, chipCls }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${chipCls}`}>
        <CheckMini />
      </span>
      {text}
    </li>
  );
}

function WhoItsForSection() {
  const heading   = useFadeIn({ direction: "up",    threshold: 0.1 });
  const cardLeft  = useFadeIn({ direction: "left",  threshold: 0.1 });
  const cardRight = useFadeIn({ direction: "right", threshold: 0.1 });

  return (
    <section className="w-full bg-white px-7 py-20 sm:px-10 md:px-12 md:py-28 xl:px-16">
      <div ref={heading.ref} style={heading.style} className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Who it's for</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-4xl">
          Made for the people<br />who care most.
        </h2>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Owner */}
        <div ref={cardLeft.ref} style={cardLeft.style} className="h-full">
          <div className="group relative h-full min-h-[300px] overflow-hidden rounded-[24px] border border-[var(--border-subtle)] bg-[var(--color-primary-50)] p-8 transition-all duration-200 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-600)]">The Celebrant</p>
            <h3 className="mt-3 text-xl font-bold leading-snug text-[var(--text-primary)]">
              You're the one<br />being celebrated.
            </h3>
            <ul className="mt-5 space-y-3 pr-20">
              {OWNER_BULLETS.map((b) => (
                <PersonaBullet key={b} text={b} chipCls="bg-[var(--color-primary-200)] text-[var(--color-primary-800)]" />
              ))}
            </ul>
            <img
              src={celebrate}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 h-40 w-auto select-none opacity-90"
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>

        {/* Giver */}
        <div ref={cardRight.ref} style={cardRight.style} className="h-full">
          <div className="group relative h-full min-h-[300px] overflow-hidden rounded-[24px] border border-[rgba(139,94,60,0.15)] bg-[var(--color-beaver-50)] p-8 transition-all duration-200 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-beaver-600)]">The Giver</p>
            <h3 className="mt-3 text-xl font-bold leading-snug text-[var(--text-primary)]">
              You're there<br />for someone special.
            </h3>
            <ul className="mt-5 space-y-3 pr-20">
              {GIVER_BULLETS.map((b) => (
                <PersonaBullet key={b} text={b} chipCls="bg-[var(--color-beaver-200)] text-[var(--color-beaver-800)]" />
              ))}
            </ul>
            <img
              src={talking1}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 h-40 w-auto select-none opacity-90"
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 4. Footer + CTA ───────────────────────────────────────────────────────────
function FooterSection({ user }) {
  const card = useFadeIn({ direction: "up", threshold: 0.1 });

  return (
    <footer className="w-full bg-[var(--color-neutral-900)] px-7 py-20 sm:px-10 md:px-12 xl:px-16">
      {/* CTA card */}
      <div ref={card.ref} style={card.style} className="mx-auto max-w-lg">
        <div className="relative overflow-hidden rounded-[24px] bg-[var(--color-neutral-800)] px-8 pb-32 pt-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.06]">
          <h2 className="text-3xl font-extrabold text-white md:text-[36px]">Ready to start?</h2>
          <p className="mx-auto mt-3 max-w-[34ch] text-sm leading-relaxed text-[var(--color-neutral-400)]">
            Help your loved ones choose gifts that actually matter.
          </p>
          <div className="mt-7">
            <Link to={user ? "/dashboard" : "/login"}>
              <Button className="px-8 py-3.5 text-sm font-semibold">
                {user ? "Go to dashboard" : "Get started free"}
              </Button>
            </Link>
          </div>
          <img
            src={peek}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 h-28 w-auto -translate-x-1/2 select-none"
            loading="lazy"
            draggable={false}
          />
        </div>
      </div>

      {/* Footer bottom */}
      <div className="mt-14 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="" aria-hidden="true" className="h-6 w-6 rounded-[6px] object-cover opacity-60" />
          <span className="text-sm font-bold text-[var(--color-neutral-500)]">Beabr</span>
        </div>
        <p className="text-xs text-[var(--color-neutral-600)]">Prepare Smarter Gifts</p>
        <div className="flex items-center gap-4 text-xs text-[var(--color-neutral-600)]">
          <Link to="/documentation/legal/terms-of-service" className="transition-colors hover:text-[var(--color-neutral-400)]">
            Terms of use
          </Link>
          <span aria-hidden="true">·</span>
          <Link to="/documentation/legal/privacy-policy" className="transition-colors hover:text-[var(--color-neutral-400)]">
            Privacy overview
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function LandingPage() {
  const { user, loading } = useAuth();
  if (loading) return <LandingScreenSkeleton />;

  return (
    <div className="w-full beabr-texture">
      <HeroSection user={user} />
      <FeaturesSection />
      <WhoItsForSection />
      <FooterSection user={user} />
    </div>
  );
}
