# Beabr project overview

**Prepare Smarter Gifts.** This document summarizes product structure and behavioral rules **without** listing database tables, vendor dashboards, repository file paths, or HTTP route catalogs. Those specifics live alongside the maintained application implementation.

---

## 1. System shape

Beabr ships as:

- A **web client** for Registry Owners and Registry Participants  
- A **hosted application service** that validates requests and applies business rules  
- **Durable storage** for registry records and related activity  
- **Controlled file handling** for user uploads such as gift images or pledge-related attachments  

Hosting choices vary by deployment.

---

## 2. Feature areas

### Authentication and accounts

Members sign in with the methods operators enable (commonly **Sign in with Google** and **email with a one time code**). The service binds sessions to member profiles used for dashboards and permissions.

### Registries

Registry Owners create registries, set reveal timing, share invitations, and manage listings. Registry Participants join with a code or link and act inside membership rules.

### Gift items and quantity

Items carry descriptive fields and quantity targets. Availability follows reserved and prepared counts; the service prevents over-reservation.

### Reservations and preparation

Registry Participants reserve units, mark preparation, or cancel when allowed. Notes may exist with role-based visibility.

### Cash funds (where offered)

Funds describe monetary goals and instructions. Logged amounts are **coordination records**, not in-product settlement, unless a future release clearly states payment integration.

### Group pledges on items (where offered)

**Pledge Initiators** and other **Registry Participants** may record pooled money intent and uploads related to external payment. Treat payout cues and receipts as highly sensitive.

### Reveal

Reveal depends on configured reveal timing. Before reveal, the service withholds identifying details from Registry Owners **where rules require**. After reveal, attribution can expand for gratitude and closure.

### Thank you messages

After reveal, Registry Owners send **in-app** thank you messages addressed to recipients.

---

## 3. Quantity and status (conceptual)

Claimed quantity is the sum of active reserved and prepared units. Available quantity is the remainder against the target. Labels such as available, partially reserved, prepared, or closed follow those counts.

---

## 4. Reveal and privacy (conceptual)

When the present time is **on or after** the registry’s reveal time, the registry is treated as **revealed** for permission checks (exact mechanics follow implementation).

**Before reveal (protected categories):** Registry Owners may see progress summaries per settings but typically not who reserved each line, granular pledge attribution, or every participant private note.

**After reveal:** Registry Owners may see contributor attribution needed for thanks, consistent with implementation.

Sensitive fields must be **enforced in the application service**, not only omitted in the UI.

---

## 5. Service boundary

The web client communicates with the application over HTTPS using contracts defined in implementation. Inputs should be validated for usability in the client and **authoritatively** in the service.

---

## 6. Security expectations

- Write actions require authentication.  
- Registry edits require **Registry Owner** role.  
- Participant actions require membership on that registry.  
- Reveal-gated responses follow server-side rules.  
- Thank-you access follows owner and recipient boundaries.  

---

## 7. Delivery focus (baseline)

Typical sequencing: authenticated access → create and join registries → manage items → reserves and preparation → funds and pooled pledges if in scope → reveal → thank you messaging → polish and rollout.

---

## 8. Principles

- Keep business logic authoritative on the service.  
- Avoid scope creep into payment rails, chat, or social feeds unless requirements change in writing.  
- Prefer flexible presentation for category-specific fields rather than freezing every notion into one rigid form everywhere.  

---

_End of high-level overview_
