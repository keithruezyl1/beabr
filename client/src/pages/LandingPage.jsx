import { Link } from "react-router-dom";
import { useRef, useCallback, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
  MotionConfig,
} from "framer-motion";
import { LandingScreenSkeleton } from "../components/ui/ScreenSkeletons.jsx";
import { useAuth } from "../state/AuthProvider.jsx";
import logo from "../assets/logo.png";
import peekLeft from "../assets/peek_left.png";
import avatar1 from "../assets/avatar1.jpg";
import avatar2 from "../assets/avatar2.jpg";
import avatar4 from "../assets/avatar4.jpg";
import avatar3 from "../assets/avatar3.jpg";

// -- Spotlight card (DOM-mutation only, zero re-renders) ----------------------
function SpotlightCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);
  const onMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect || !overlayRef.current) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    overlayRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(129,160,63,0.10), transparent 70%)`;
    overlayRef.current.style.opacity = "1";
  }, []);
  const onLeave = useCallback(() => {
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
  }, []);
  return (
    <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave} className={`relative overflow-hidden ${className}`}>
      <div ref={overlayRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300" style={{ borderRadius: "inherit" }} />
      {children}
    </div>
  );
}

// -- Magnetic CTA button ------------------------------------------------------
function CtaButton({ children, to, large = false }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tx = useTransform(mx, [-60, 60], [-6, 6]);
  const ty = useTransform(my, [-40, 40], [-4, 4]);
  const onMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - (rect.left + rect.width / 2));
    my.set(e.clientY - (rect.top + rect.height / 2));
  }, [mx, my]);
  const onMouseLeave = useCallback(() => {
    animate(mx, 0, { type: "spring", stiffness: 200, damping: 15 });
    animate(my, 0, { type: "spring", stiffness: 200, damping: 15 });
  }, [mx, my]);
  const padClass = large ? "py-3 pl-7 pr-2 text-base" : "py-2.5 pl-6 pr-2 text-sm";
  const iconSize = large ? "h-9 w-9" : "h-8 w-8";
  const btnVariants = { rest: {}, hover: {} };
  const iconVariants = {
    rest:  { x: 0, y: 0, scale: 1 },
    hover: { x: 1.5, y: -1.5, scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 20 } },
  };
  return (
    <motion.div style={{ x: tx, y: ty }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="inline-block">
      <Link to={to}>
        <motion.button
          initial="rest" whileHover="hover" whileTap={{ scale: 0.97 }} variants={btnVariants}
          className={`lp-cta-btn group inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-500)] ${padClass} font-semibold text-white shadow-[0_4px_20px_rgba(129,160,63,0.28)] hover:shadow-[0_8px_28px_rgba(129,160,63,0.40)] transition-shadow duration-300`}
        >
          <span>{children}</span>
          <motion.span variants={iconVariants} className={`ml-1 flex ${iconSize} items-center justify-center rounded-full bg-white/[0.18]`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </motion.span>
        </motion.button>
      </Link>
    </motion.div>
  );
}

// -- Ambient glow orb ---------------------------------------------------------
function GlowOrb({ className = "", delay = 0, duration = 5 }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      animate={{ opacity: [0.4, 0.88, 0.4], scale: [1, 1.07, 1] }}
      transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}
// -- Icons --------------------------------------------------------------------
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
      <g className="lp-icon-shackle"><path d="M7 11V7a5 5 0 0 1 10 0v4" /></g>
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <g className="lp-icon-iris"><circle cx="12" cy="12" r="3" /></g>
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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

// -- Data ---------------------------------------------------------------------
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

// -- Shared animation config --------------------------------------------------
const SPRING_SOFT  = { type: "spring", stiffness: 80,  damping: 20 };
const SPRING_CRISP = { type: "spring", stiffness: 400, damping: 25 };
const heroContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const heroItem = {
  hidden:  { opacity: 0, y: 22, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0,  filter: "blur(0px)", transition: { type: "spring", stiffness: 80, damping: 20 } },
};
// -- 1. Hero ------------------------------------------------------------------
function HeroSection({ user }) {
  return (
    <section className="relative flex min-h-[85dvh] w-full overflow-hidden">
      <div className="pointer-events-none hidden shrink-0 select-none items-end md:flex md:w-[36%] lg:w-[38%]">
        <motion.img
          src={peekLeft} alt="" aria-hidden="true" draggable={false}
          className="h-auto max-h-[68vh] w-full object-contain object-bottom"
          initial={{ opacity: 0, x: -36, y: "10%" }}
          animate={{ opacity: 1, x: 0, y: "10%" }}
          transition={{ type: "spring", stiffness: 70, damping: 20, delay: 0.25 }}
        />
      </div>
      <motion.div
        className="relative flex flex-1 flex-col items-center justify-center px-7 py-20 text-center sm:px-10 md:pl-4 md:pr-14"
        variants={heroContainer} initial="hidden" animate="visible"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <GlowOrb className="absolute left-[20%] top-[28%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(129,160,63,0.17),transparent)]" delay={0} duration={5.5} />
          <GlowOrb className="absolute right-[8%] top-[55%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(129,160,63,0.11),transparent)]" delay={2.1} duration={7} />
          <GlowOrb className="absolute left-[58%] bottom-[10%] h-[240px] w-[240px] rounded-full bg-[radial-gradient(closest-side,rgba(175,201,126,0.12),transparent)]" delay={3.8} duration={5} />
        </div>
        <motion.div variants={heroItem} className="flex items-center justify-center gap-3">
          <img src={logo} alt="Beabr logo" className="h-11 w-11 rounded-[14px] border border-[var(--border-subtle)] bg-white object-cover shadow-[var(--shadow-xs)]" />
          <span className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Beabr</span>
        </motion.div>
        <motion.div variants={heroItem} className="mt-6">
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-xs)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary-500)]" aria-hidden="true" />
            Prepare Smarter Gifts
          </motion.span>
        </motion.div>
        <motion.h1
          variants={heroItem}
          className="mt-8 max-w-2xl text-[44px] font-extrabold leading-[1.02] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[52px] md:text-[58px] lg:text-[68px]"
        >
          Every gift tells a story.<br />
          <span className="text-[var(--color-primary-700)]">Make yours unforgettable.</span>
        </motion.h1>
        <motion.p variants={heroItem} className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-[var(--text-secondary)] md:text-base">
          Beabr is a private registry for your most meaningful celebrations. Loved ones coordinate quietly, claim thoughtfully, and reveal themselves when you're ready.
        </motion.p>
        <motion.div variants={heroItem} className="mt-9 flex flex-col items-center gap-3">
          <CtaButton to={user ? "/dashboard" : "/login"}>
            {user ? "Go to dashboard" : "Get started free"}
          </CtaButton>
          <p className="text-xs text-[var(--text-muted)]">Coming to iOS &amp; Android soon</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
// -- 2. Features interactive tab panel ----------------------------------------
function FeaturesSection() {
  const [activeTab, setActiveTab] = useState(0);

  const giftItems = [
    { name: "Wooden Photo Frame", status: "claimed",   by: "2 givers" },
    { name: "Silk Throw Blanket", status: "available" },
    { name: "Scented Candle Set", status: "claimed",   by: "1 giver"  },
    { name: "Personalised Mug",   status: "available" },
  ];

  const FEATURES = [
    {
      icon: <GiftIcon />,
      label: "Build your registry",
      heading: "Build your registry",
      body: "Add gift ideas, links, and details for any life event. Graduations, weddings, celebrations — all in one place.",
      visual: (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {["Weddings", "Graduations", "Birthdays", "Anniversaries"].map((tag) => (
              <span key={tag} className="rounded-full bg-[var(--color-primary-100)] px-3 py-1 text-[11px] font-semibold text-[var(--color-primary-700)]">{tag}</span>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { name: "Leather Journal",    hint: "From Amazon" },
              { name: "Wooden Photo Frame", hint: "Any store"   },
              { name: "Scented Candle Set", hint: "From Etsy"   },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-[10px] border border-[var(--border-subtle)] bg-[var(--color-neutral-50)] px-4 py-2.5">
                <span className="text-[13px] font-medium text-[var(--text-primary)]">{item.name}</span>
                <span className="text-[12px] text-[var(--text-muted)]">{item.hint}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <LockIcon />,
      label: "Privacy style",
      heading: "Choose your privacy style",
      body: "Private surprise or open coordination. Set it once and let givers work their magic naturally.",
      visual: (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-[12px] border-2 border-[var(--color-primary-300)] bg-[var(--color-primary-50)] p-4">
            <div className="mb-2 text-[var(--color-primary-700)]"><LockIcon /></div>
            <p className="text-[13px] font-bold text-[var(--text-primary)]">Private</p>
            <p className="mt-1 text-[12px] leading-snug text-[var(--text-muted)]">Givers stay anonymous until reveal day</p>
          </div>
          <div className="rounded-[12px] border border-[var(--border-default)] bg-[var(--color-neutral-50)] p-4">
            <div className="mb-2 text-[var(--color-primary-700)]"><EyeIcon /></div>
            <p className="text-[13px] font-bold text-[var(--text-primary)]">Open</p>
            <p className="mt-1 text-[12px] leading-snug text-[var(--text-muted)]">Everyone sees who claimed what</p>
          </div>
        </div>
      ),
    },
    {
      icon: <EyeIcon />,
      label: "Reveal on your terms",
      heading: "Reveal on your terms",
      body: "Pick a date and time. Givers stay anonymous until you are ready to see who made your moment special.",
      visual: (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-[12px] border border-[var(--border-subtle)] bg-[var(--color-neutral-50)] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">Reveal unlocks</p>
                <p className="text-[12px] text-[var(--text-muted)]">Jun 14 at 12:00 PM</p>
              </div>
            </div>
            <span className="rounded-full bg-[var(--color-primary-100)] px-3 py-1 text-[11px] font-bold text-[var(--color-primary-700)]">Scheduled</span>
          </div>
          <p className="text-center text-[12px] text-[var(--text-muted)]">Until then, givers only see that others have joined.</p>
        </div>
      ),
    },
    {
      icon: <LinkIcon />,
      label: "One click to join",
      heading: "One click to join",
      body: "Givers join the registry in seconds. No account needed, no friction, no confusion.",
      visual: (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {["Invite link", "Join code", "QR code"].map((m) => (
              <span key={m} className="rounded-full bg-[var(--color-primary-50)] px-4 py-2 text-[12px] font-semibold text-[var(--color-primary-700)] ring-1 ring-[var(--color-primary-200)]">{m}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-[12px] border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] px-4 py-3">
            <div className="flex items-center">
              {[avatar1, avatar2, avatar4, avatar3].map((src, i) => (
                <img key={i} src={src} alt="" aria-hidden="true" className="h-8 w-8 rounded-full border-2 border-[var(--color-primary-400)] object-cover object-center" style={{ marginLeft: i === 0 ? 0 : "-10px", zIndex: i + 1 }} />
              ))}
            </div>
            <p className="text-[13px] font-semibold text-[var(--color-primary-700)]">4 givers have joined your registry</p>
          </div>
        </div>
      ),
    },
    {
      icon: <UsersIcon />,
      label: "No double gifting",
      heading: "No double gifting",
      body: "Givers see what is available and claim silently. No duplicates, no awkward overlaps, no wasted money.",
      visual: (
        <div className="mt-6 space-y-2">
          {giftItems.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-[10px] border border-[var(--border-subtle)] bg-[var(--color-neutral-50)] px-4 py-2.5">
              <span className="text-[13px] font-medium text-[var(--text-primary)]">{item.name}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${item.status === "claimed" ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]" : "bg-[var(--color-neutral-200)] text-[var(--text-muted)]"}`}>
                {item.status === "claimed" ? item.by : "Available"}
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const active = FEATURES[activeTab];
  return (
    <section className="relative w-full overflow-hidden bg-[var(--color-primary-100)] px-5 py-20 sm:px-8 md:px-10 md:py-28 xl:px-14">
      <div className="pointer-events-none absolute inset-0">
        <GlowOrb className="absolute -left-24 top-1/4 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(129,160,63,0.13),transparent)]" delay={0} duration={7} />
        <GlowOrb className="absolute -right-16 bottom-1/4 h-[440px] w-[440px] rounded-full bg-[radial-gradient(closest-side,rgba(129,160,63,0.09),transparent)]" delay={2.8} duration={6.2} />
        <GlowOrb className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(175,201,126,0.07),transparent)]" delay={4.5} duration={8} />
      </div>

      <motion.div
        className="relative mb-10"
        initial={{ opacity: 0, y: 20, filter: "blur(3px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={SPRING_SOFT}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-600)]">How it works</p>
        <h2 className="mt-2 max-w-md text-3xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)] lg:text-[36px]">
          Everything you need,<br />nothing you don't.
        </h2>
      </motion.div>

      {/* Desktop: sidebar + panel */}
      <motion.div
        className="relative hidden md:flex md:items-start md:gap-5"
        initial={{ opacity: 0, y: 24, filter: "blur(3px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ ...SPRING_SOFT, delay: 0.08 }}
      >
        <div className="w-[216px] shrink-0 space-y-1 pt-1">
          {FEATURES.map((f, i) => (
            <div key={i} className="relative">
              {activeTab === i && (
                <motion.div
                  layoutId="tab-active-bg"
                  className="absolute inset-0 rounded-[14px] bg-white shadow-[0_2px_16px_rgba(29,33,26,0.08)]"
                  transition={SPRING_CRISP}
                />
              )}
              <button
                onClick={() => setActiveTab(i)}
                className={`relative z-10 flex w-full items-center gap-3 rounded-[14px] px-4 py-3.5 text-left transition-colors duration-200 ${activeTab === i ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-white/50"}`}
              >
                <span className={`shrink-0 transition-colors duration-200 ${activeTab === i ? "text-[var(--color-primary-600)]" : "text-[var(--text-muted)]"}`}>
                  {f.icon}
                </span>
                <span className={`text-[13px] font-semibold leading-snug transition-colors duration-200 ${activeTab === i ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                  {f.label}
                </span>
              </button>
            </div>
          ))}
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
              transition={SPRING_SOFT}
            >
              <SpotlightCard className="rounded-[22px] bg-white/70 p-1.5 ring-1 ring-black/[0.06]">
                <div className="min-h-[360px] rounded-[16px] bg-white p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                    {active.icon}
                  </div>
                  <h3 className="mt-4 text-[22px] font-bold tracking-[-0.02em] text-[var(--text-primary)]">{active.heading}</h3>
                  <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[var(--text-secondary)]">{active.body}</p>
                  {active.visual}
                </div>
              </SpotlightCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mobile: pill tabs + panel */}
      <motion.div
        className="relative md:hidden"
        initial={{ opacity: 0, y: 20, filter: "blur(3px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ ...SPRING_SOFT, delay: 0.08 }}
      >
        <div className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 pb-2">
          {FEATURES.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition-all duration-200 ${activeTab === i ? "bg-[var(--color-primary-600)] text-white shadow-[0_4px_12px_rgba(129,160,63,0.30)]" : "bg-white text-[var(--text-secondary)] ring-1 ring-[var(--border-default)]"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={SPRING_SOFT}
          >
            <SpotlightCard className="rounded-[22px] bg-white/70 p-1.5 ring-1 ring-black/[0.06]">
              <div className="rounded-[16px] bg-white p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                  {active.icon}
                </div>
                <h3 className="mt-4 text-[20px] font-bold tracking-[-0.02em] text-[var(--text-primary)]">{active.heading}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">{active.body}</p>
                {active.visual}
              </div>
            </SpotlightCard>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
// -- 4. Who it's for ----------------------------------------------------------
function PersonaBullet({ text, chipCls }) {
  return (
    <li className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)]">
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${chipCls}`}>
        <CheckMini />
      </span>
      {text}
    </li>
  );
}

function WhoItsForSection() {
  return (
    <section className="w-full bg-white px-5 py-12 sm:px-8 md:px-10 md:py-16 xl:px-14">
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20, filter: "blur(3px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={SPRING_SOFT}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Who it's for</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)] md:text-4xl">
          Made for the people<br />who care most.
        </h2>
      </motion.div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
        <motion.div className="h-full" initial={{ opacity: 0, x: -28, filter: "blur(3px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-60px" }} transition={SPRING_SOFT}>
          <motion.div whileHover={{ y: -3 }} transition={SPRING_CRISP} className="h-full rounded-[26px] bg-[var(--color-primary-100)] p-1.5 ring-1 ring-[var(--border-default)]">
            <div className="relative overflow-hidden rounded-[20px] bg-[var(--color-primary-50)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-600)]">The Celebrant</p>
              <h3 className="mt-3 text-xl font-bold leading-snug tracking-[-0.01em] text-[var(--text-primary)]">You're the one<br />being celebrated.</h3>
              <ul className="mt-5 space-y-3">
                {OWNER_BULLETS.map((b) => (<PersonaBullet key={b} text={b} chipCls="bg-[var(--color-primary-200)] text-[var(--color-primary-800)]" />))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
        <motion.div className="h-full" initial={{ opacity: 0, x: 28, filter: "blur(3px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-60px" }} transition={{ ...SPRING_SOFT, delay: 0.08 }}>
          <motion.div whileHover={{ y: -3 }} transition={SPRING_CRISP} className="h-full rounded-[26px] bg-[var(--color-beaver-100)] p-1.5 ring-1 ring-[rgba(139,94,60,0.2)]">
            <div className="relative overflow-hidden rounded-[20px] bg-[var(--color-beaver-50)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-beaver-600)]">The Giver</p>
              <h3 className="mt-3 text-xl font-bold leading-snug tracking-[-0.01em] text-[var(--text-primary)]">You're there<br />for someone special.</h3>
              <ul className="mt-5 space-y-3">
                {GIVER_BULLETS.map((b) => (<PersonaBullet key={b} text={b} chipCls="bg-[var(--color-beaver-200)] text-[var(--color-beaver-800)]" />))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// -- 5. Footer + CTA ----------------------------------------------------------
function FooterSection({ user }) {
  return (
    <footer className="relative w-full overflow-hidden bg-[var(--color-neutral-900)] px-7 py-20 sm:px-10 md:py-28 xl:px-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(129,160,63,0.12),transparent)]" />
      </div>
      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 24, filter: "blur(3px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={SPRING_SOFT}
      >
        <h2 className="max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] text-white md:text-4xl lg:text-[48px]">
          Ready to make gift giving feel meaningful?
        </h2>
        <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-[var(--color-neutral-400)]">
          Help your loved ones choose gifts that actually matter.
        </p>
        <div className="mt-7">
          <CtaButton to={user ? "/dashboard" : "/login"} large>
            {user ? "Go to dashboard" : "Get started free"}
          </CtaButton>
        </div>
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="" aria-hidden="true" className="h-5 w-5 rounded-[5px] object-cover opacity-60" />
            <span className="text-sm font-bold text-[var(--color-neutral-500)]">Beabr</span>
          </div>
          <p className="text-xs text-[var(--color-neutral-600)]">Prepare Smarter Gifts</p>
          <div className="flex items-center gap-4 text-xs text-[var(--color-neutral-600)]">
            <Link to="/documentation/legal/terms-of-service" className="transition-colors hover:text-[var(--color-neutral-400)]">Terms of use</Link>
            <span aria-hidden="true">&middot;</span>
            <Link to="/documentation/legal/privacy-policy" className="transition-colors hover:text-[var(--color-neutral-400)]">Privacy overview</Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

// -- Main ---------------------------------------------------------------------
export function LandingPage() {
  const { user, loading } = useAuth();
  if (loading) return <LandingScreenSkeleton />;
  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full beabr-texture">
        <HeroSection user={user} />
        <FeaturesSection />
        <WhoItsForSection />
        <FooterSection user={user} />
      </div>
    </MotionConfig>
  );
}