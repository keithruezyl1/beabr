/**
 * Validates an in-app path for redirects (open-redirect safe).
 * Allows pathname + optional query/hash on same origin.
 */
export function safeInternalPath(raw) {
  if (raw == null || typeof raw !== "string") return null;
  try {
    const t = decodeURIComponent(raw).trim();
    if (!t.startsWith("/") || t.startsWith("//")) return null;
    return t;
  } catch {
    return null;
  }
}
