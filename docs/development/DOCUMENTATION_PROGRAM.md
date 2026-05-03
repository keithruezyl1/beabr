# Beabr documentation program

> **Consumer-facing Documentation** bundles legal-style pages and help-center articles surfaced inside the web app where your build exposes them. **Operator-only notes** stay out of that navigation unless you widen what the viewer loads on purpose.

This document defines **who each doc is for**, **how docs are grouped** (similar to help centers and internal wikis at large consumer apps), and **what to add next**.

## Principles

| Principle | Meaning |
|-----------|---------|
| **Audience-first** | Every document is labeled customer-facing, internal-only, or legal/compliance. If two audiences need the same fact, maintain one internal source of truth and a simplified customer copy where needed. |
| **Single source of truth** | Product behavior and privacy rules stay aligned with product requirements and the high-level overview document maintained for contributors. Help articles interpret those rules in simplier language; they do not invent policy. |
| **Progressive disclosure** | Customer docs answer “what can I do?” and “how?” Internal docs answer “why did we build it this way?” and “how do we operate it?” |
| **Simplier language for customers** | Help center style: short titles, numbered steps, **no vendor dashboards, schema names, or repository layout** unless a rare troubleshooting article demands it—and even then prefer generic wording. |

## How this maps to “big app” style documentation

Consumer products usually split work roughly as follows. Beabr uses the same **buckets** at a scale appropriate for an early iteration.

| Bucket | Typical examples (industry) | Beabr equivalent |
|--------|------------------------------|------------------|
| **Help Center / Support** | PayPal “Send & Request”, Wise “How transfers work”, GCash “Verify account” | Help-center articles folder and its authoring readme |
| **Trust, legal & safety** | Meta/Twitter Privacy Policy; PayPal User Agreement | Legal disclosure bundle plus authoring readme |
| **Product / policy (internal)** | Internal PRDs, launch reviews | Product requirements document and brief |
| **Engineering overview** | High-level maps (not exhaustive API catalogs in customer PDFs) | Project overview doc for contributors |
| **Design / UX** | Design system portals | Design guidelines |
| **Operations & security** | Runbooks, incident playbooks | Internal operator readme and linked notes |

**Customer-facing** = published or sendable to a non-employee without an NDA.

**Internal** = employee or contractor-only; may contain remediation evidence and unreleased plans.

## Current inventory (by role)

| Area | Primary audience | Notes |
|------|------------------|--------|
| Product brief | Internal (can inform marketing) | Vision, users, scope |
| Product requirements | Internal | Requirements source of truth |
| Project overview | Internal | Behavioral map without schema dumps |
| Design guidelines | Internal | Visual and UX consistency |
| Root readme | Developers | Clone, run, deploy basics |
| Legal bundle pages | **Customer** | Terms, privacy overview, cookie notice, security summary |
| Help center articles | **Customer** | Interpret product tasks plainly |
| Page index | Internal / web build | Maps suggested URLs to source articles |
| Internal operator folder | Internal | Runbooks, sensitivity notes, security themes |

Introduced groupings mirror those folders conceptually Help center, Legal, Internal.

## Recommended next documents (prioritized backlog)

### P0 — Before or at public beta

1. **Policy pages** Simplier disclosures for hobby builds; swap in counsel-reviewed text if you commercialize.  
2. **Help Center core** “What is Beabr?”, “Create a registry”, “Join with a code”, “Reserve a gift”, “Reveal and privacy”, “Thank you messages.”  
3. **Internal runbook** Deployment checklist, rollback mindset, secrets handling, production access norms.

### P1 — Soon after launch

4. **Incident response** Severity, communications, postmortem habits.  
5. **Data and retention note (internal)** What categories you store and how deletion works so Privacy materials stay truthful.  
6. **FAQ expansion** Auth friction, invite codes, pledges versus bank reality.

### P2 — Scale / compliance appetite

7. **Accessibility statement** if you promise WCAG-class targets publicly.  
8. **Formal security assessments** Pen tests and audits as appetite grows.  
9. **Partner-facing integration docs** Only if you ship a **public** integration; otherwise keep specifics in restricted engineering materials.

## Authoring checklist (any new doc)

- [ ] Stated **audience** in the first few lines.  
- [ ] Linked behavior to owning product specs (not orphaned claims).  
- [ ] No contradiction with **reveal and privacy** rules.  
- [ ] Customer pages avoid naming storage engines, vendors, migration files, or table columns.  
- [ ] Legal and security-facing pages carry **effective** or **last reviewed** cues.

## Ownership (suggested)

| Area | Typical owner |
|------|----------------|
| Help Center | Product plus support tone; engineering fact-checks |
| Legal-style pages | Operator for hobby builds; counsel if regulated |
| Requirements / overview | Engineering plus product |
| Runbooks | Engineering / DevOps |

---

*This program is the map. Requirements and contributor overview materials anchor behavior; operators keep fingerprints in restricted notes.*
