/** Public API origin for production builds when env is missing or still points at dev (see Vercel env `VITE_API_URL`). */
const DEFAULT_PROD_API_ORIGIN = "https://beabr.onrender.com";

function resolveApiOrigin() {
  const raw = String(import.meta.env.VITE_API_URL || "")
    .trim()
    .replace(/\/$/, "");
  if (!raw) {
    return import.meta.env.PROD ? DEFAULT_PROD_API_ORIGIN : "";
  }
  if (import.meta.env.PROD) {
    try {
      const host = new URL(raw).hostname;
      if (host === "localhost" || host === "127.0.0.1") {
        return DEFAULT_PROD_API_ORIGIN;
      }
      return raw;
    } catch {
      return DEFAULT_PROD_API_ORIGIN;
    }
  }
  return raw;
}

const API_URL = resolveApiOrigin();

/**
 * Cached access token, updated by AuthProvider via setAccessToken() whenever
 * the Supabase auth state changes. We avoid calling supabase.auth.getSession()
 * on every request because that call can hang indefinitely after long tab idle
 * periods or when a token refresh is in flight.
 */
let cachedAccessToken = null;
let accessTokenGetter = null;

function missingApiUrlError() {
  const err = new Error(
    "Missing VITE_API_URL. For local dev you can omit it if the Vite /api proxy is configured; for production builds set VITE_API_URL to your API origin (see client/.env.example)."
  );
  err.status = 500;
  return err;
}

/** Base URL for fetch, or "" to use same-origin paths (Vite dev proxy → /api). */
function resolveFetchUrl(path) {
  if (API_URL) return `${API_URL}${path}`;
  if (import.meta.env.DEV) return path;
  throw missingApiUrlError();
}

export function setAccessToken(token) {
  cachedAccessToken = token || null;
}

export function setAccessTokenGetter(getter) {
  accessTokenGetter = getter;
}

export function getApiBaseUrl() {
  return API_URL || (import.meta.env.DEV ? "" : undefined);
}

async function resolveAccessToken() {
  if (cachedAccessToken) return cachedAccessToken;
  if (typeof accessTokenGetter !== "function") return null;
  // Race the getter against a short timeout so a stuck Supabase getSession()
  // call cannot freeze the entire app. If we time out, the request goes
  // unauthenticated; the server will respond 401 and the auth listener will
  // refill the cache on the next auth event.
  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 2500));
  try {
    return await Promise.race([accessTokenGetter(), timeout]);
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const token = await resolveAccessToken();
  const res = await fetch(resolveFetchUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message =
      data?.error?.message ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.details = data?.error?.details;
    throw err;
  }

  return data;
}

/** Authenticated GET returning a Blob (e.g. decrypted pledge QR binary). */
export async function apiFetchBlob(path, options = {}) {
  const token = await resolveAccessToken();
  const res = await fetch(resolveFetchUrl(path), {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const isJson = res.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await res.json().catch(() => null) : await res.text();
    const message =
      data?.error?.message ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.details = data?.error?.details;
    throw err;
  }

  return res.blob();
}

export async function apiFetchForm(path, formData, options = {}) {
  const token = await resolveAccessToken();
  const res = await fetch(resolveFetchUrl(path), {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: formData,
    // NOTE: do not set Content-Type for FormData; browser will set boundary.
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message =
      data?.error?.message ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.details = data?.error?.details;
    throw err;
  }

  return data;
}

