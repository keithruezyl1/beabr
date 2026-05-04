<div align="center">

<img src="client/src/assets/logo.png" alt="Beabr" width="120" height="120" />

# Beabr

**Prepare smarter gifts**

*A private event registry where surprises stay protected until you’re ready.*

<br />

![Status](https://img.shields.io/badge/status-early%20iteration-81a03f?style=for-the-badge&labelColor=2d3319)
![Tagline](https://img.shields.io/badge/focus-gift%20coordination-8b5e3c?style=for-the-badge&labelColor=3d2a1f)
![Privacy](https://img.shields.io/badge/privacy-reveal%20first-6b8f4a?style=for-the-badge&labelColor=2d3319)

<br />

**Brand colors** · Primary green `#81a03f` · Accent brown `#8b5e3c` · Page background `#fafbf7`

</div>

---

## About this page

This README is for **people who want to understand Beabr** before signing up or joining a registry.  
Technical setup for running the code locally lives at the bottom under **For developers**.

---

## What is Beabr?

Beabr is a **web app for private gift preparation**. A **Registry Owner** creates a registry, adds gift ideas or money goals, and shares a join code or link. **Registry Participants** use that invite to reserve items, mark gifts as prepared, or coordinate pooled money when enabled.

The headline feature is **reveal timing**: until the date and time the Registry Owner chose, the product protects **who did what** so the surprise stays intact. After reveal, attribution becomes visible where the product allows it, so thank yous and wrap up are easier.

| | |
|:--|:--|
| **Tagline** | Prepare smarter gifts |
| **Mascot** | A beaver — preparation, building together, reliability (without feeling childish) |
| **Early iteration** | Features and policies evolve; trust what your live app shows |

---

## Who Beabr is for

| Role | Who they are | What they do |
|:-----|:-------------|:-------------|
| **Registry Owner** | The person organizing the registry (often the graduate or honoree) | Creates the registry, sets reveal date and time, shares invites, may send in app thank you notes after reveal |
| **Registry Participant** | Someone invited with a code or link | Joins, reserves gifts, marks prepared, may take part in pooled pledges when available |
| **Pledge Initiator** | A Registry Participant who starts a group money pool on an item (when the product allows it) | Shares payout instructions so others can pay **outside** the app; treats receipts and details as sensitive |

---

## Features at a glance

| Feature | Summary |
|:--------|:--------|
| **Registry & items** | List gifts, quantities, and guidance so people do not duplicate or guess wrong |
| **Join by code or link** | Invite only the people you trust |
| **Reservations & prepared status** | See what is still available and what is already spoken for |
| **Reveal schedule** | One moment when contributor details can open up for the Registry Owner, per product rules |
| **Cash funds & pooled pledges** *(when enabled)* | Optional money goals and group pledges; money moves in your bank or wallet apps, not inside Beabr as a processor |
| **Thank you messages** *(after reveal)* | Send appreciation inside the app when the product supports it |
| **Documentation in the app** | Policies and help articles for signing in, privacy, pledges, and more |

Icons in the product UI use the same **green and brown** accent family as the brand chips above.

---

## Privacy, terms, and guidelines

Beabr is built around **respectful coordination** and **least surprise**:

- **Before reveal**, the product limits what a **Registry Owner** can see about **who** reserved, prepared, or joined pooled flows, according to the rules in the app.
- **After reveal**, attribution and thank you workflows open up where designed.
- **Money** is coordinated with clear eyes: Beabr does **not** act as your bank or escrow. Verify payout details yourself before sending funds.

**Where to read the full text**

| Topic | In app route (when you use Beabr) |
|:------|:----------------------------------|
| **Terms of use** | Documentation → Terms of use |
| **Privacy overview** | Documentation → Privacy overview |
| **Cookie notice** | Documentation → Cookie notice |
| **Security practices** | Documentation → Security practices |
| **User protection** | Documentation → User protection |
| **Beabr’s responsibility** | Documentation → Beabr’s responsibility |
| **Help center** | Documentation → Help topics (sign in, create registry, reveal, pledges, and more) |

Repository copies of the same Markdown live under **`docs/legal/`** and **`docs/help-center/`** if you prefer reading in the repo.

---

## Frequently answered in the help center

- **Signing in** — Google and email one time codes (depending on what your host enables)
- **Creating a registry** — Title, reveal time, join code, share link
- **Group pledges** — Sensitive payout information, QR images, receipts (read the dedicated article before sending money)
- **Invite code issues** — Copy the code carefully, check your signed in account

---

## Contact

For the deployment associated with this project, you may reach the maintainer at **keith_tagarao01@yahoo.com.ph** (support, abuse reports, privacy questions, security reports).

---

<details>
<summary><strong>For developers</strong> — clone, env, run locally</summary>

This repository contains a **browser client**, an **application service**, and **documentation** bundles consumed by the in app reader.

1. Copy each package’s **`env` example** to a local **`env`** file and fill values from the comments inside those examples.  
2. Install dependencies and run database steps as described next to the **server** package (migrations, generate, seed if any).  
3. Start the **server** and **client** (`npm run dev` or as printed in each `package.json`).  
4. Open the local URL the client prints. Align auth redirect allowlists and API CORS with your actual web origin.

Root scripts: `npm run dev:server`, `npm run dev:client`, `npm run build:client`, `npm run build:server`.

Authoring and route mapping: **`docs/development/`** (documentation program, page index).  
Security summary at repo root: **`security-risks.md`**.

</details>
