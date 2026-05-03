/** Decode QR payload from invite links or plain join codes (Beabr invite QR points at `/registry/join/:code`). */
export function parseInviteCodeFromQrText(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  try {
    const href = s.includes("://") ? s : `https://${s}`;
    const url = new URL(href);
    const m = url.pathname.match(/\/registry\/join\/([^/]+)\/?$/i);
    if (m) {
      const segment = decodeURIComponent(m[1]).replace(/[^A-Za-z0-9]/g, "");
      return segment.length >= 4 ? segment.toUpperCase() : null;
    }
  } catch {
    // not a URL
  }
  const compact = s.replace(/[^A-Za-z0-9]/g, "");
  if (compact.length >= 4) return compact.toUpperCase();
  return null;
}
