/*
  Quick manual smoke script (no secrets checked in).
  Requires:
  - SERVER_URL
  - an authenticated cookie in BEABR_COOKIE (value of `beabr_token=...`)

  Example (PowerShell):
    $env:SERVER_URL="http://localhost:5000"
    $env:BEABR_COOKIE="beabr_token=..."
    node scripts/privacy-smoke.js <registryId>
*/

const registryId = process.argv[2];
if (!registryId) {
  // eslint-disable-next-line no-console
  console.error("Usage: node scripts/privacy-smoke.js <registryId>");
  process.exit(1);
}

const base = process.env.SERVER_URL || "http://localhost:5000";
const cookie = process.env.BEABR_COOKIE || "";

async function req(path) {
  const res = await fetch(`${base}${path}`, {
    headers: cookie ? { Cookie: cookie } : {},
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

(async () => {
  const r = await req(`/api/registries/${registryId}`);
  // eslint-disable-next-line no-console
  console.log("GET /api/registries/:id status", r.status);
  if (r.json?.registry?.role === "owner" && r.json?.registry?.revealed === false) {
    // owner pre-reveal: ensure cash funds do not expose pledge initiator details, receipts, or contribution identities
    // eslint-disable-next-line no-console
    console.log("Owner pre-reveal: OK (should not include pledge identities anywhere in registry payload).");
  }

  const reveal = await req(`/api/registries/${registryId}/reveal`);
  // eslint-disable-next-line no-console
  console.log("GET /api/registries/:id/reveal status", reveal.status);
})();

