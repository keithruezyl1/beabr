/**
 * Lazy-loads markdown from /docs (repo root) — one async chunk per file at build time.
 */
const lazyLoaders = {
  ...import.meta.glob("../../../docs/legal/*.md", { query: "?raw", import: "default" }),
  ...import.meta.glob("../../../docs/help-center/*.md", { query: "?raw", import: "default" }),
  /** Internal developer docs stay out of SPA bundles — open Markdown in the repo. */
  ...import.meta.glob("../../../docs/development/DOCUMENTATION_*.md", { query: "?raw", import: "default" }),
};

/** @type {Map<string, () => Promise<{ default?: string } | string>>} */
const loadersByRouteId = new Map();

for (const [globPath, loader] of Object.entries(lazyLoaders)) {
  const routeId = pathToRouteId(globPath);
  loadersByRouteId.set(routeId, /** @type {any} */ (loader));
}

/** @param {string} globPath */
function pathToRouteId(globPath) {
  const withoutPrefix = globPath.replace(/^.*\/docs\//, "");
  return withoutPrefix.replace(/\.md$/i, "");
}

const LABEL_OVERRIDES = {
  "legal/terms-of-service": "Terms of use",
  "legal/beabr-responsibility": "Beabr’s responsibility",
  "legal/privacy-policy": "Privacy overview",
  "legal/cookie-policy": "Cookie notice",
  "legal/security-practices": "Security practices",
  "legal/user-protection": "User protection",
  "help-center/HC-002-sign-in": "Signing in",
  "development/DOCUMENTATION_PROGRAM": "Documentation program",
  "development/DOCUMENTATION_PAGES_INDEX": "Published pages map",
};

function titleFromFilename(routeId) {
  const base = routeId.split("/").pop() || routeId;
  return base
    .replace(/^HC-\d+-/i, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** @param {string} routeId */
export function getDocLabel(routeId) {
  return LABEL_OVERRIDES[routeId] || titleFromFilename(routeId);
}

export const DOC_NAV_SECTIONS = [
  { id: "legal", title: "Legal", description: "Policies and terms" },
  { id: "help-center", title: "Help center", description: "Guides for using Beabr" },
  { id: "meta", title: "Documentation", description: "How docs are organized" },
];

function sortHelpCenterItems(items) {
  return [...items].sort((a, b) => {
    const na = a.routeId.match(/^help-center\/HC-(\d+)/i);
    const nb = b.routeId.match(/^help-center\/HC-(\d+)/i);
    if (na && nb) return Number(na[1]) - Number(nb[1]);
    return a.label.localeCompare(b.label);
  });
}

/** Mirrors DocumentationPage sidebar grouping. */
export function docNavCategory(routeId) {
  if (routeId.startsWith("development/DOCUMENTATION_")) return "meta";
  if (!routeId.includes("/")) return "meta";
  return routeId.slice(0, routeId.indexOf("/"));
}

/** Sorted navigation entries — no markdown loaded. */
export function getAllDocNavEntries() {
  const routeIds = [...loadersByRouteId.keys()];
  const entries = routeIds.map((routeId) => ({ routeId, label: getDocLabel(routeId) }));

  const legalOrder = [
    "legal/terms-of-service",
    "legal/beabr-responsibility",
    "legal/cookie-policy",
    "legal/privacy-policy",
    "legal/security-practices",
    "legal/user-protection",
  ];
  const legal = entries
    .filter((e) => e.routeId.startsWith("legal/"))
    .sort((a, b) => {
      const ia = legalOrder.indexOf(a.routeId);
      const ib = legalOrder.indexOf(b.routeId);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      return a.label.localeCompare(b.label);
    });
  const help = sortHelpCenterItems(entries.filter((e) => e.routeId.startsWith("help-center/")));
  let meta = entries.filter((e) => docNavCategory(e.routeId) === "meta");
  const metaOrder = ["development/DOCUMENTATION_PROGRAM", "development/DOCUMENTATION_PAGES_INDEX"];
  meta = [...meta].sort((a, b) => {
    const ia = metaOrder.indexOf(a.routeId);
    const ib = metaOrder.indexOf(b.routeId);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  return [...legal, ...help, ...meta];
}

/** @param {string} routeId */
export function hasDocRoute(routeId) {
  return Boolean(routeId && loadersByRouteId.has(routeId));
}

/** Resolved doc payload cached after first load. */
/** @type {Map<string, { routeId: string, label: string, content: string }>} */
const resolvedCache = new Map();

/** @type {Map<string, Promise<{ routeId: string, label: string, content: string } | null>>} */
const inflight = new Map();

/**
 * @returns {Promise<{ routeId: string, label: string, content: string } | null>}
 */
export async function loadDocMarkdown(routeId) {
  if (!routeId || !loadersByRouteId.has(routeId)) return Promise.resolve(null);
  const hit = resolvedCache.get(routeId);
  if (hit) return hit;

  let p = inflight.get(routeId);
  if (!p) {
    p = (async () => {
      try {
        const loader = loadersByRouteId.get(routeId);
        if (!loader) return null;
        const mod = await loader();
        const raw = typeof mod?.default === "string" ? mod.default : String(mod?.default ?? mod ?? "");
        const payload = { routeId, label: getDocLabel(routeId), content: raw };
        resolvedCache.set(routeId, payload);
        return payload;
      } catch {
        return null;
      } finally {
        inflight.delete(routeId);
      }
    })();
    inflight.set(routeId, p);
  }
  return p;
}

/** Synchronous replay for revisits — avoids skeleton flash when chunk is cached. */
export function peekCachedDoc(routeId) {
  return resolvedCache.get(routeId) ?? null;
}

/** Warm the module cache / network (best-effort). */
export function prefetchDocMarkdown(routeId) {
  if (!routeId || !loadersByRouteId.has(routeId)) return;
  void loadDocMarkdown(routeId);
}

/** Clear cached markdown (e.g. after a failed load retry). Resolved content only; bundled chunk stays in browser cache. */
export function clearDocMarkdownCache(routeId) {
  if (routeId) resolvedCache.delete(routeId);
}

export const DEFAULT_DOC_ROUTE_ID = "legal/terms-of-service";
