# Beabr — Prepare Smarter Gifts (early iteration)

Private event gift-preparation registry.

## What this repository is

A full-stack web application: a browser client, a hosted application service, durable storage, and optional file handling for uploads. Contributor-facing implementation detail (framework choices, schemas, endpoints, hosting vendor settings) intentionally lives **in source** next to runnable packages—not duplicated here—so operational fingerprints stay centralized.

## Run it locally

1. Copy each package’s **`env` example file** into a local **`env`** file and complete values following comments inside those examples.  
2. Install dependencies and apply database setup steps **printed or scripted** beside the backend package (generate client, migrations, seed if any).  
3. Start the **service** package and the **web client** package (`npm run dev` or equivalent shown in each `package.json`).  
4. Open the local URL the client prints.

**Hosted / production URLs** are documented as defaults in **`client/.env.example`** and **`server/.env.example`** (canonical web origin, API origin, optional invite-link origin). For local development, keep **private** `client/.env` / `server/.env` values pointed at localhost (or your LAN) instead; align **Supabase Auth** (Site URL and redirect allowlist) and **API CORS** with whichever web origin you actually serve.

## Documentation

Start under **`docs/`**: the **development** subfolder holds the documentation program, page-index suggestions for builds, product requirements, design guidelines, and a **high-level project overview** without listing schemas or vendor configs. The **legal** and **help-center** subfolders hold member-facing Markdown processed by the web app when enabled.  

## Privacy (conceptual)

Reveal timing controls when **Registry Owners** can learn **Registry Participant** identity for protected categories. Treat those rules as enforced by the **running service**, not only by hiding elements in the browser.

---

For security reporting, see `security-risks.md` at the repository root.
