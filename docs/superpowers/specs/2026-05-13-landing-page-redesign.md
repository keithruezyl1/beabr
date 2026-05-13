# Landing Page Redesign — Design Spec
**Date:** 2026-05-13
**Status:** Approved

---

## Overview

Full redesign of `LandingPage.jsx`. Replaces the current fixed-viewport two-column layout with a full vertical scroll experience across four sections plus a footer. Direction: Warm Storytelling — the beaver mascot anchors each section and creates a narrative flow through the page.

**Core requirements:**
- Modern, fun, intuitive, interactive
- 60fps on deployed low-end devices
- All animations: `transform` + `opacity` only (GPU-composited, no layout repaints)
- `IntersectionObserver` for scroll triggers (no scroll event listeners)
- `prefers-reduced-motion` respected throughout
- Follows DESIGN_GUIDELINES.md in full

---

## Architecture

### Animation system
Single shared `useFadeIn(ref, options)` hook using `IntersectionObserver`. Returns a `style` object (`opacity`, `transform`) applied directly to the element. Supports:
- `delay` — stagger offset in ms
- `direction` — `up` | `left` | `right` (translate axis)
- `threshold` — intersection ratio to trigger (default 0.15)

All transitions use `--motion-slow` (280ms) with `--ease-standard` (`cubic-bezier(0.2, 0.8, 0.2, 1)`).

### Icon animations
Pure CSS `@keyframes` on inline SVGs. Triggered by `:hover` on the parent feature row. No JS involved.
- **Gift** — `@keyframes wobble` — subtle left-right rotation (±8deg, 3 steps)
- **Lock** — `@keyframes unlock` — shackle rotates from 0° to −30° then back
- **Eye** — `@keyframes blink` — `scaleY` 1 → 0.1 → 1 on the iris group

All icon animations: duration 400ms, `ease-in-out`, plays once on hover.

### Performance constraints
- No `width`, `height`, `top`, `left`, `margin`, or `padding` animated — layout repaints forbidden
- `will-change: transform` applied only to actively animating cards, removed after animation completes
- No continuous loops anywhere
- Images: `loading="eager"` on hero mascot, `loading="lazy"` on screenshot and section mascots
- Step chips use CSS hover transitions only (no JS state)

---

## Section 1 — Hero

**Layout:** Two-column grid on desktop (`grid-cols-2`), stacked on mobile.

**Left column — Mascot**
- `waving.png` fills the full left half, flush to viewport edges, `object-fit: cover`, `object-position: center top`
- No padding on left column
- On mobile: mascot is `h-[260px]` centered, above content

**Right column — Content**
- Top: `logo.png` + "Beabr" wordmark
- Headline: `Plan gifts with care. Keep the love clear.` — large, extrabold, multi-line
- Subtext: one-liner description, muted, `max-w-[44ch]`
- CTA: green primary button → `/login` (or `/dashboard` if logged in)
- "Coming to iOS / Android soon" note inline below CTA
- Step chips: 2×2 grid, same `StepChip` component with tones: darkGreen, lightGreen, lighterGreen, lightestGreen
- Shorter copy in chips: "Create", "Add", "Invite", "Reveal"

**Animation:** Right column content fades + slides in from right on page load (`delay: 0, 80, 160, 240ms` stagger per element). Mascot has no animation (immediate render).

**Background:** `beabr-texture` + layered radial gradients (existing, keep as-is).

**Mascot:** `waving.png` — large, left half.

---

## Section 2 — Features

**Background:** `--color-primary-50` soft green wash.

**Layout:** Two-column on desktop — screenshot left, feature rows right. Stacked on mobile (screenshot drops below heading).

**Heading block:**
- Eyebrow: "How it works" — small caps, `--text-muted`
- Heading: "Everything you need, nothing you don't"

**Left — App screenshot**
- `landing-sample.jpg` in a rounded frame (`--radius-xl`), `shadow-[var(--shadow-lg)]`, `ring-1 ring-[var(--border-default)]`
- Subtle green glow behind it (radial gradient, same as current hero)
- Fades + slides in from left on scroll

**Right — 3 feature rows** (stagger in from right)
Each row: inline SVG icon in a soft green chip + bold title + 1–2 line body copy.

| Icon | Title | Body |
|------|-------|------|
| Gift (animated wobble) | Build your registry | Add items, links, and details for any life event |
| Lock (animated unlock) | Choose your privacy style | Private surprise or open coordination — set once at creation |
| Eye (animated blink) | Reveal on your terms | Pick a date and time. Givers stay anonymous until you're ready |

**Hover state per row:** Row background tints to `--color-primary-50`, icon animation triggers, slight `translateX(4px)` on the row — all via CSS transition, no JS.

---

## Section 3 — Who It's For

**Background:** White (`--surface-card`).

**Heading block (centered):**
- Eyebrow: "Who it's for"
- Heading: "Made for the people who care most"

**Two persona cards side by side** (stacked on mobile):

**Left — The Celebrant**
- Background: `--color-primary-50`
- Border: `--border-subtle`
- Mascot: `celebrate.png` — bottom-right corner of card, partially cropped
- Title: "You're the one being celebrated"
- Bullets:
  - Create a private registry for your event
  - Add gift ideas so loved ones know what's meaningful
  - Set a reveal date — see who helped when the time comes
- Slides in from left on scroll

**Right — The Giver**
- Background: `--color-beaver-50`
- Border: `rgba(139, 94, 60, 0.15)`
- Mascot: `talking_1.png` — bottom-right corner of card, partially cropped
- Title: "You're there for someone special"
- Bullets:
  - Join with an invite code or link
  - Reserve or contribute to a gift quietly
  - Stay anonymous until reveal day
- Slides in from right on scroll

**Card hover:** `shadow-[var(--shadow-md)]` + `translateY(-4px)` — CSS transition, 180ms.

---

## Section 4 — Footer with CTA

**Background:** `--color-neutral-900` (dark).

**CTA card (centered, max-w-lg):**
- Background: `--color-neutral-800`
- Border: `rgba(255,255,255,0.06)`
- Headline: "Ready to start?" — white, bold, large
- Subtext: "Help your loved ones choose gifts that actually matter." — muted white
- CTA button: green primary → `/login`
- `peek.png` mascot peeks up from the bottom edge of the card (positioned absolute, bottom-0, centered)
- Card enters viewport: `scale(0.96) → scale(1)` + fade — 280ms

**Below card:**
- Beabr wordmark + "Prepare Smarter Gifts" tagline — muted
- Links: Terms of use, Privacy overview — small, muted

---

## Files

| File | Action |
|------|--------|
| `client/src/pages/LandingPage.jsx` | Full rewrite |
| `client/src/hooks/useFadeIn.js` | New — shared scroll animation hook |

No new dependencies. All animations are CSS + vanilla JS (IntersectionObserver). No animation library.

---

## Out of scope
- Any changes to other pages
- Navigation / AppShell changes
- New assets (uses existing: `waving.png`, `celebrate.png`, `talking_1.png`, `peek.png`, `landing-sample.jpg`, `logo.png`)
