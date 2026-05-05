# Design Guidelines
# Beabr — Prepare Smarter Gifts

## 1. Brand Overview

Beabr is a premium, modern event gift-preparation registry app (graduations, celebrations, weddings, and similar occasions).

It uses a beaver mascot to represent preparation, building, gathering, and thoughtfulness.

The visual system should feel clean, warm, organized, and trustworthy.

The app should feel familiar to users of modern social media apps, but it must not include social networking features.

---

## 2. Brand Name

**Beabr**

---

## 3. Tagline

**Prepare Smarter Gifts**

---

## 4. Mascot Direction

The mascot is a beaver.

The mascot should feel:

- friendly
- helpful
- clever
- prepared
- calm
- dependable

The mascot should not feel:

- childish
- cartoonish in an unserious way
- loud
- overly comic
- distracting

Recommended mascot usage:

- landing page
- onboarding
- empty states
- success states
- reveal screen
- thank-you message screen

Do not overuse the mascot in dense app screens.

---

## 5. Color Strategy

Green is the primary UI color.

Brown is the mascot support color.

White and off-white should dominate the interface.

The app should feel fresh, calm, and premium.

---

## 6. Color Tokens

## 6.1 Primary Green Scale

```css
--color-primary-50: #F4F8EB;
--color-primary-100: #E8F0D5;
--color-primary-200: #DCE8C4;
--color-primary-300: #C5D99A;
--color-primary-400: #AFC97E;
--color-primary-500: #81A03F;
--color-primary-600: #6F8D34;
--color-primary-700: #5F7A2A;
--color-primary-800: #4B611F;
--color-primary-900: #344516;
```

Primary brand color:

```css
--color-brand-primary: #81A03F;
```

---

## 6.2 Neutral White Scale

```css
--color-white: #FFFFFF;
--color-neutral-50: #FAFBF7;
--color-neutral-100: #F7F9F4;
--color-neutral-200: #EEF2E8;
--color-neutral-300: #DDE5D2;
--color-neutral-400: #B9C4AA;
--color-neutral-500: #89927C;
--color-neutral-600: #68705E;
--color-neutral-700: #4B5243;
--color-neutral-800: #30362C;
--color-neutral-900: #1D211A;
```

---

## 6.3 Beaver Mascot Accent Scale

```css
--color-beaver-50: #FAF3EA;
--color-beaver-100: #F3E9DC;
--color-beaver-200: #E3CCB3;
--color-beaver-300: #CFA985;
--color-beaver-400: #B9855E;
--color-beaver-500: #8B5E3C;
--color-beaver-600: #754C2F;
--color-beaver-700: #5E3B25;
--color-beaver-800: #43291A;
--color-beaver-900: #2B1A10;
```

Use beaver brown mainly for mascot illustration, small accents, and warm decorative details.

---

## 6.4 Semantic Color Tokens

```css
--color-success-bg: #E8F0D5;
--color-success-text: #4B611F;

--color-warning-bg: #FFF4D6;
--color-warning-text: #8A6200;

--color-danger-bg: #FDE8E8;
--color-danger-text: #9B1C1C;

--color-info-bg: #EEF2E8;
--color-info-text: #4B5243;
```

---

## 6.5 Surface Tokens

```css
--surface-page: #FAFBF7;
--surface-card: #FFFFFF;
--surface-card-soft: #F7F9F4;
--surface-overlay: rgba(29, 33, 26, 0.48);
```

---

## 6.6 Border Tokens

```css
--border-subtle: #EEF2E8;
--border-default: #DDE5D2;
--border-strong: #B9C4AA;
```

---

## 6.7 Text Tokens

```css
--text-primary: #1D211A;
--text-secondary: #4B5243;
--text-muted: #68705E;
--text-placeholder: #89927C;
--text-inverse: #FFFFFF;
```

---

## 7. Typography

Use a modern sans-serif font.

Recommended:

- Inter
- Manrope
- System UI fallback

CSS token:

```css
--font-sans: Inter, Manrope, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

---

## 8. Type Scale

```css
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-md: 18px;
--font-size-lg: 20px;
--font-size-xl: 24px;
--font-size-2xl: 32px;
--font-size-3xl: 40px;
```

---

## 9. Font Weights

```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 10. Spacing System

Use an 8px spacing system.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

---

## 11. Radius Tokens

The app should use soft rounded corners.

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-pill: 999px;
```

Recommended:

- Cards: 20px-24px
- Buttons: 999px or 16px
- Inputs: 12px-16px
- Modals: 24px

---

## 12. Shadow Tokens

Use soft, premium shadows.

```css
--shadow-xs: 0 1px 2px rgba(29, 33, 26, 0.04);
--shadow-sm: 0 4px 12px rgba(29, 33, 26, 0.06);
--shadow-md: 0 8px 24px rgba(29, 33, 26, 0.08);
--shadow-lg: 0 16px 40px rgba(29, 33, 26, 0.12);
```

Avoid harsh shadows.

---

## 13. UI Design Principles

The interface should be:

- clean
- airy
- soft
- organized
- touch-friendly
- visually calm
- easy to scan

Use:

- cards
- clear status badges
- large buttons
- simple forms
- bottom sheets on mobile
- smooth modal transitions

Avoid:

- dense tables
- cluttered dashboards
- excessive text
- harsh borders
- overly bright colors

---

## 14. UX Design Principles

The app should emulate the ease and polish of premium social media apps without becoming social.

This means:

- content is card-based
- primary actions are obvious
- screens feel scrollable and natural
- interactions are fast and fluid
- pages avoid feeling like forms unless necessary
- item details can open in modals or bottom sheets
- users can complete actions with minimal taps
- visual hierarchy guides the user naturally

The app should not include:

- feeds of user activity
- likes
- comments
- reactions
- followers
- public profiles
- public sharing inside the app

---

## 15. Premium Social-Media-Inspired UX Patterns

Use the following patterns:

### 15.1 Card Feed Layout

Registry items should appear as a vertical card feed.

Each card should show:

- image or placeholder
- item title
- category
- quantity status
- availability badge
- primary action

### 15.2 Bottom Navigation on Mobile

Mobile navigation should feel familiar and app-like.

Suggested tabs:

- Home
- Registry
- Reveal
- Thank You
- Profile

Only show relevant tabs depending on user role.

### 15.3 Floating Action Button

For owners, use a floating action button on small viewports for **Add Item** (and **Add Fund** when that flow exists on the registry surface). Keep iconography minimal (`+`).

### 15.4 Bottom Sheets

Use bottom sheets for quick actions:

- Reserve item
- Mark prepared
- Pledge money
- Edit item

### 15.5 Smooth Modals

Use clean modals for:

- item details
- pledge confirmation
- thank-you letter
- reveal details
- **countdown to reveal** (large numeric tiles; gradient frame; scheduled date/time recap—prefer modal over route change for “when is reveal?”)
- **logout confirmation**

### 15.6 Skeleton Loading

Use skeleton cards while loading registry items.

### 15.7 Micro-interactions

- **Marketing step chips** (landing): subtle lift and shadow on hover with smooth transition; keep playful placement from overlapping the hero preview without hiding critical content on mobile (use a condensed grid where needed).
- **Primary CTAs:** reserve tap/click feedback consistent with `--motion-base`; avoid gimmicky animation unless it reinforces brand (e.g. mascot peek used sparingly on marketing only).

### 15.8 Empty States

Use mascot-assisted empty states.

Examples:

- Your registry is empty. Start by adding your first gift.
- No gifts have been prepared yet.
- Reveal day is almost here.

---

## 16. Layout Guidelines

## 16.1 Page Layout

Use:

- edge-to-edge page layouts (full-width)
- consistent page padding (gutter) for content comfort
- generous vertical spacing
- sticky headers when useful
- bottom action bars on mobile

Do not use:

- a centered main content wrapper in the AppShell (no global `max-width` / centered `<main>` container)

Notes:

- Pages should span the full viewport width. If a specific component needs a readable measure (e.g., long-form text), constrain that component locally rather than centering the entire page.

## 16.2 Desktop Layout

Desktop can use:

- edge-to-edge pages with responsive gutters
- two-column owner dashboard
- side panel for registry summary
- item cards in grid or feed

## 16.3 Mobile Layout

Mobile should use:

- single-column feed
- bottom navigation
- sticky action buttons
- bottom sheets
- large tap targets

Minimum tap target:

```css
--tap-target-min: 44px;
```

## 16.4 Page header gradient (PageChrome)

Shared hero bands on dashboard, settings, notifications, create/join flows, etc. must stay **on-brand green only**—do **not** blend beaver brown into this surface.

Use the primary scale (§6.1) from a **light** green wash into **near-white** and **white**—airy and gentle, still recognizably green. Prefer `--color-primary-100` at the leading edge (lighter than `-200`).

| Stop | Token | Hex (reference) |
|------|--------|-------------------|
| 0% | `--color-primary-100` | #E8F0D5 |
| ~42% | `--color-primary-50` | #F4F8EB |
| ~78% | `--color-neutral-50` | #FAFBF7 |
| 100% | `--color-white` | #FFFFFF |

Direction: **diagonal** (`to bottom right` in CSS). Implemented as `--gradient-page-header` and `.beabr-page-header-gradient` in app CSS.

Optional **`PageHeader`** illustration (`illustrationSrc`): decorative PNG **inside** the hero band only—typically **below the action buttons**, right-aligned in the header column (e.g. Home dashboard mascot). Must not sit outside the rounded header component. When present, the hero uses **no bottom padding** and desktop layout **stretches** the actions column so the mascot’s bottom aligns with the header’s bottom edge (no floating gap under the image).

---

## 17. Component Guidelines

## 17.1 Buttons

Primary button:

- green background
- white text
- rounded
- strong contrast

Secondary button:

- white or soft green background
- green text
- subtle border

Danger button:

- only for destructive actions
- use sparingly

---

## 17.2 Button Tokens

```css
--button-primary-bg: #81A03F;
--button-primary-bg-hover: #6F8D34;
--button-primary-text: #FFFFFF;

--button-secondary-bg: #F4F8EB;
--button-secondary-bg-hover: #E8F0D5;
--button-secondary-text: #5F7A2A;
```

---

## 17.3 Inputs

Inputs should be:

- rounded
- soft-bordered
- spacious
- clearly labeled

Focus state:

```css
--input-focus-ring: 0 0 0 3px rgba(129, 160, 63, 0.18);
```

---

## 17.4 Item Cards

Item cards should include:

- image or icon area
- title
- category
- variant summary
- price reference, if available
- quantity status
- status badge
- primary action button

Owner cards may also show:

- edit action
- owner status
- reorder handle

---

## 17.5 Status Badges

Available:

```css
background: #F7F9F4;
color: #4B5243;
```

Reserved:

```css
background: #FFF4D6;
color: #8A6200;
```

Prepared:

```css
background: #E8F0D5;
color: #4B611F;
```

Closed:

```css
background: #EEF2E8;
color: #68705E;
```

---

## 17.6 Notifications (Chips)

All notifications must be implemented as **chips** that:

- appear from the **top-right** of the page (toast-style)
- can be **manually closed**
- **auto-dismiss** after **3 seconds** by **fading away**
- can be **stacked** (multiple chips visible at once)

Chips must be color-coded:

- **Success**: green
- **Caution**: yellow
- **Error**: red

---

## 18. Iconography

Use simple line icons.

Recommended style:

- rounded
- 1.5px or 2px stroke
- minimal detail

Icon categories:

- gift
- calendar
- clock / timer (scheduled times, countdown affordances)
- eye (ownership or “view reveal” when appropriate)
- users / people (viewer context)
- lock
- unlock
- check
- heart/thank-you
- money
- link
- edit

**Semantic pairing:** On dense summary surfaces (for example the registry landing hero), pair icons with labels and typography hierarchy so **dates and times** are never communicated by plain paragraph text alone—use a small uppercase label, primary line for date, secondary line for time with an icon so status + scheduling remain scannable.

Avoid overly playful icon sets.

---

## 19. Imagery Guidelines

Item images should be optional.

If no image is provided, use:

- category icon
- soft green placeholder
- subtle beaver/log-inspired illustration

Do not rely on images for usability.

---

## 20. Animation Guidelines

Animations should be subtle.

Use for:

- modal entrance
- bottom sheet entrance
- button tap feedback
- reveal transition
- thank-you pop-up

Recommended durations:

```css
--motion-fast: 120ms;
--motion-base: 180ms;
--motion-slow: 280ms;
```

Easing:

```css
--ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
```

Avoid:

- bouncy animations
- excessive mascot movement
- distracting transitions

---

## 21. Reveal Experience Design

The reveal screen should feel special but still clean.

Before reveal:

- show countdown (on the dedicated reveal route and/or an in-app **countdown modal** on the registry landing page so users do not need to navigate away to see time remaining)
- show progress
- hide giver identities

After reveal:

- show contributor list
- group gifts by giver or item
- make thank-you action prominent

Tone:

- warm
- celebratory
- calm
- not flashy

Suggested copy:

- Reveal is ready.
- See who prepared each gift.
- Send a thank-you note.

---

## 22. Thank You UX

When the owner sends a thank-you letter:

- use a simple writing modal
- show recipient name
- show related gift or pledge
- provide one primary button: Send

When the giver receives a thank-you letter:

- show modal on next app open
- use warm, personal layout
- allow dismiss
- save message in Thank You section

Suggested modal title:

- A thank-you note from [Graduate Name]

---

## 23. Voice and Tone

Beabr copy should be:

- clear
- warm
- concise
- helpful
- calm
- love-focused
- oriented around helping people choose thoughtful gifts for someone they care about

Avoid:

- slang-heavy copy
- overly emotional copy
- childish mascot language
- corporate-sounding text
- ego-centered framing that makes the registry sound like a demand list

Examples:

Good:

- Reserve this gift
- Mark as prepared
- Reveal contributors
- Send thank-you note
- Help loved ones choose thoughtful gifts
- Add a gift idea so loved ones know what would be meaningful

Avoid:

- Snag this gift!
- Be the ultimate gift hero!
- Blast your registry!
- What do you want?

## 23.1 Gift Visibility Copy

Registries use an immutable setup-time visibility mode:

- **Private surprise:** loved ones coordinate quietly; names unlock at reveal.
- **Open coordination:** loved ones can see who reserved or contributed so gifts are easier to coordinate.

Guidelines:

- Present visibility as a required creation choice.
- On edit screens, show it as read-only with copy that it was chosen during setup and cannot be changed.
- Explain the benefit as love-focused coordination and duplicate prevention, not surveillance.
- Open coordination may reveal attribution, but UI must not expose private notes, pledge receipt images, payout fields, encrypted fields, storage paths, or other sensitive payment materials as general registry details.

---

## 24. Accessibility Guidelines

The app must support:

- strong color contrast
- keyboard navigation
- visible focus states
- readable font sizes
- labels for inputs
- alt text for meaningful images
- no color-only status indicators

Status must be communicated through both color and text.

---

## 25. Responsive Behavior

### Mobile

- single-column
- bottom navigation
- bottom sheets
- floating action button
- sticky primary actions

### Tablet

- wider cards
- optional two-column layout

### Desktop

- edge-to-edge page layout (no centered AppShell main)
- dashboard panels
- grid/list toggle optional

---

## 26. Recommended Screen Designs

This section reflects **current UX direction** in the app: premium, mobile-first, desktop-responsive, with clear hierarchy and minimal clutter.

## 26.1 Landing Page

Purpose: convert visitors and route them to sign-in.

Should include:

- **Logo and hero typography** with strong hierarchy: product name and tagline (“Prepare Smarter Gifts”) scaled for readability on large screens and tuned down on small breakpoints.
- **Full-viewport marketing canvas** (`100svh` / fixed inset): desktop-first composition that stays usable on mobile (responsive grid, typography, and spacing—not a shrunk desktop layout).
- **Background texture** applied edge-to-edge (not clipped by inner content max-width). Use layered gradients plus a subtle noise tile (see `.beabr-texture` in app CSS) for depth without heaviness.
- **Sample registry preview** card as social-proof / education—not a bare placeholder; show realistic registry cues where helpful.
- **Steps embedded as components** (“how it works”) expressed as individual stylized **step chips**: playful placement around the preview on large screens; on small screens use a **condensed grid** so chips never overlap unreadably.
- Step chips: short titles + body copy; **hover**: slight lift + shadow with smooth transition.
- **Primary CTA** toward authentication: e.g. **“Log in to get started”** (not generic “Continue with Google” unless context demands).
- **Optional mascot peek** (`peek.png`): decorative, bottom corner on desktop where it does not fight the CTA; omit or simplify on narrow viewports if space is tight.
- Do **not** rely on a separate long “How it works” section if steps are already embedded in the hero—avoid redundancy.

## 26.2 Dashboard

Should include:

- **Your registries** (owner role) listed first with clear section heading.
- **Joined registries** (viewer role) as a separate section below — distinct empty states for each.
- Registry entries as **cards** with scannable title and path into the registry.
- Avoid a generic **“Quick actions”** strip unless it adds clear value; prefer driving actions from registry cards and FAB where appropriate.

## 26.3 Registry landing (owner & viewer)

Single route treats both roles; UI adapts with **role pills** and actions.

**Hero / profile header**

- **Owner:** pill with **eye** icon and copy **“You own this registry”** (not plain “Owner view”).
- **Viewer:** pill with **people** icon and copy such as **“Viewing registry · For [graduate display name]”**.
- **Title** as page-level heading (`h1`) with responsive scale.
- Top band: soft **gradient** (primary → neutral → beaver) separating identity from body content.
- **Primary actions** in the hero:
  - Owner: **`+ Add Item`** (plus sign before label) opening add flow; mobile **FAB** remains available where implemented.
  - **Reveal / countdown:** before reveal time, use a **secondary** **Countdown** control with **timer** icon that opens a **modal countdown** (live days / hours / minutes / seconds) on the **same page**—do not force navigation to another route just to see the timer. After reveal, use **“View reveal”** (with eye icon) linking to the reveal route.
- **Message** body: readable paragraph width below the hero band.

**Dates and times (critical UX)**

- Never bury reveal scheduling in a single muted sentence.
- Use **icon-backed summary tiles**:
  - **Main event** (when **main event date** is set): calendar icon, uppercase micro-label showing the registry’s **event category** (Celebration, Graduation, Wedding, etc.), bold **date** (weekday + month + day + year).
  - **Reveal opens:** beaver-warm surface, clock icon, label **“Reveal opens”**, **date** on one line, **time** on the next with clock glyph and explicit **“local time”** / timezone honesty so users trust what they see.
- When only one of main event date / reveal exists, allow the reveal tile to **span** two columns on `sm+` for balance.

**Content sections**

- **Gifts** section title with **gift** icon in a soft primary tinted chip for quick scanning.
- Item cards follow existing card-feed guidance (badges, quantity language).

## 26.4 Authentication (Login & Register)

Should include:

- **Centered full-screen** layout for focus; no logo/tagline block required if the shell already brands the app—prioritize the task (log in / create account).
- Headings such as **“Log in to get started”** and **“Create account”** centered; **field labels** left-aligned for readability.
- Login: **Email** / **Password** with **“Forgot password”** link **right-aligned** on the same row as the password label.
- **Google** presented as a distinct, familiar **Sign in with Google** (or Sign up) control that redirects to OAuth.
- Optional **decorative peek** image in a corner for warmth without distracting from the form.
- Copy stays calm and functional; avoid troubleshooting boilerplate in the UI.

## 26.5 App shell & global navigation

Should include:

- Header: **logo + wordmark “Beabr”** only—**omit tagline** in the persistent chrome to reduce noise.
- **Notifications** as a single destination (no duplicate nav items).
- **Profile** not as a bare text tab: use a **pill** with **avatar** (or initials) + **“Profile”** label, **light green** fill when idle, **no border on the avatar image**. Click opens a **dropdown**: **Settings**, **Logout**.
- **Logout** triggers a **confirmation modal** before ending the session; after logout, send users to **`/login`** (or agreed auth entry route) consistently.

## 26.6 Settings

Should include:

- Profile editing for **display name** and **avatar**.
- **Avatar:** prefer **file picker** (click-to-upload) over asking users to paste URLs for routine updates.
- Clear saving / error states; email may remain read-only depending on auth provider.

## 26.7 Notifications (unified inbox)

Should include:

- One **Notifications** area that combines **thank-you messages** and other **updates** (replace parallel “Thank You” and “Notifications” tabs that duplicate purpose).
- Thank-you items support **read / seen** behavior and optional modal presentation for new notes where implemented.

## 26.8 Reveal Page

Should include:

- reveal state
- contributor list
- prepared gifts
- pledged amounts
- thank-you action buttons

## 26.9 Thank You Inbox (legacy naming)

Individual thank-you threads may still be documented as product concepts; in the shell, surface them inside **Notifications (26.7)** unless the product splits them again intentionally.

Should include:

- received thank-you messages
- sender name
- related gift/pledge
- read status

---

## 27. CSS Token Bundle

```css
:root {
  --color-primary-50: #F4F8EB;
  --color-primary-100: #E8F0D5;
  --color-primary-200: #DCE8C4;
  --color-primary-300: #C5D99A;
  --color-primary-400: #AFC97E;
  --color-primary-500: #81A03F;
  --color-primary-600: #6F8D34;
  --color-primary-700: #5F7A2A;
  --color-primary-800: #4B611F;
  --color-primary-900: #344516;

  --color-white: #FFFFFF;
  --color-neutral-50: #FAFBF7;
  --color-neutral-100: #F7F9F4;
  --color-neutral-200: #EEF2E8;
  --color-neutral-300: #DDE5D2;
  --color-neutral-400: #B9C4AA;
  --color-neutral-500: #89927C;
  --color-neutral-600: #68705E;
  --color-neutral-700: #4B5243;
  --color-neutral-800: #30362C;
  --color-neutral-900: #1D211A;

  --color-beaver-50: #FAF3EA;
  --color-beaver-100: #F3E9DC;
  --color-beaver-200: #E3CCB3;
  --color-beaver-300: #CFA985;
  --color-beaver-400: #B9855E;
  --color-beaver-500: #8B5E3C;
  --color-beaver-600: #754C2F;
  --color-beaver-700: #5E3B25;
  --color-beaver-800: #43291A;
  --color-beaver-900: #2B1A10;

  --surface-page: #FAFBF7;
  --surface-card: #FFFFFF;
  --surface-card-soft: #F7F9F4;
  --surface-overlay: rgba(29, 33, 26, 0.48);

  --text-primary: #1D211A;
  --text-secondary: #4B5243;
  --text-muted: #68705E;
  --text-placeholder: #89927C;
  --text-inverse: #FFFFFF;

  --border-subtle: #EEF2E8;
  --border-default: #DDE5D2;
  --border-strong: #B9C4AA;

  --success-bg: #E8F0D5;
  --success-text: #4B611F;
  --warning-bg: #FFF4D6;
  --warning-text: #8A6200;
  --danger-bg: #FDE8E8;
  --danger-text: #9B1C1C;

  --font-sans: Inter, Manrope, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-md: 18px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 40px;

  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  --shadow-xs: 0 1px 2px rgba(29, 33, 26, 0.04);
  --shadow-sm: 0 4px 12px rgba(29, 33, 26, 0.06);
  --shadow-md: 0 8px 24px rgba(29, 33, 26, 0.08);
  --shadow-lg: 0 16px 40px rgba(29, 33, 26, 0.12);

  --motion-fast: 120ms;
  --motion-base: 180ms;
  --motion-slow: 280ms;
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

---

## 28. Final Design Direction

Beabr should look like:

- a clean registry app
- a polished productivity tool
- a premium mobile-first web app (with **responsive** desktop marketing and registry layouts—not desktop-only pixel dumps)
- a warm but modern life-event gifting product
- interfaces where **scheduling** (main event date, reveal) and **role** (owner vs giver) are obvious at a glance through **type scale**, **color**, and **icons**

It should not look like:

- a children’s app
- a cartoon-heavy mascot product
- a social network
- a marketplace
- a banking app
