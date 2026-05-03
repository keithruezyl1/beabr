# Internal documentation

**Audience:** Founders, employees, and contractors under NDA. **Do not** copy raw content from here into customer help without sanitization.

## Purpose

Internal notes answer how we **build**, **run**, and **respond to incidents** for Beabr. Authoritative behavior for members remains in published policies and in the maintained product.

## Suggested materials (create as needed)

| Topic | Purpose |
|--------|---------|
| Runbook | Deployments, migrations, rollback, smoke tests |
| Incident response | Severity, roles, communications, postmortem template |
| Data inventory | What categories of data exist, retention, deletion path (keeps Privacy materials accurate) |
| Sensitive data note | How payout and receipt classes are handled operationally |
| Security summary | High-level remediation themes without implementation fingerprints |
| Access control | Who has production access and how credentials are stored |
| Onboarding | Engineer setup beyond the root README |
| Decisions | Architecture decision records when you use them |

## Overlap with product specs

Requirements and UX sources live under the main **docs** tree (product requirements, design guidelines, high-level project overview). Keep internal runbooks **operational**; keep product specs as **behavior and experience truth**.

## Customer vs internal quick test

| Question | If yes → |
|----------|----------|
| Does it name cloud projects, IP allowlists, or secret locations? | Internal |
| Does it explain a user task without infrastructure detail? | Help center |
| Is it binding policy text for storefronts beyond hobby scope? | Legal-style pages (upgrade with counsel if commercial) |
