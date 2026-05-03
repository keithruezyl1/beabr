/** Repo meta docs live under `docs/development/`; older `.md` links may omit that prefix. */
const LEGACY_META_ROUTE_IDS = Object.freeze({
  DOCUMENTATION_PROGRAM: "development/DOCUMENTATION_PROGRAM",
  DOCUMENTATION_PAGES_INDEX: "development/DOCUMENTATION_PAGES_INDEX",
});

function canonicalDocRouteId(routeId) {
  if (Object.prototype.hasOwnProperty.call(LEGACY_META_ROUTE_IDS, routeId)) {
    return LEGACY_META_ROUTE_IDS[routeId];
  }
  return routeId;
}

/**
 * Resolve sibling / relative .md links to in-app documentation routes.
 * @param {string} href
 * @param {string} currentRouteId e.g. legal/terms-of-service
 */
export function resolveDocHref(href, currentRouteId) {
  if (!href) return null;
  if (/^https?:\/\//i.test(href) || href.startsWith("mailto:")) {
    return { type: "external", href };
  }
  const hashParts = href.split("#");
  const pathPart = hashParts[0] || "";
  const hash = hashParts.length > 1 ? `#${hashParts.slice(1).join("#")}` : "";

  if (!pathPart.endsWith(".md")) {
    return { type: "external", href };
  }

  const dirParts = currentRouteId.includes("/") ? currentRouteId.split("/").slice(0, -1) : [];
  const segs = pathPart.split("/");

  for (const seg of segs) {
    if (seg === "." || seg === "") continue;
    if (seg === "..") dirParts.pop();
    else dirParts.push(seg.replace(/\.md$/i, ""));
  }

  let routeId = dirParts.join("/");
  routeId = canonicalDocRouteId(routeId);
  return { type: "internal", to: `/documentation/${routeId}${hash}` };
}

/**
 * Removes counsel/ops-only header lines shown in authored legal drafts (bold key:value rows
 * between the doc title and the reader-facing intro). Applies to `legal/*.md` in-product only.
 *
 * Matches lines like **Product:**, **Legal status:**, **Effective date:**, **Developer:** …
 *
 * @param {string} markdown
 */
export function stripLegalPublisherMetadata(markdown) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  let i = 0;
  if (lines[0]?.startsWith("#")) {
    out.push(lines[0]);
    i = 1;
  }

  /** `**Something:** optional rest of line` (draft metadata rows only). */
  const isPublisherRow = (line) => /^\*\*[^*\r\n]+\*\*:\s*.*$/.test(line.trim());

  while (i < lines.length) {
    if (lines[i].trim() === "") {
      const nextNonEmpty = lines.slice(i).findIndex((ln) => ln.trim() !== "");
      if (nextNonEmpty !== -1) {
        const target = lines[i + nextNonEmpty];
        if (isPublisherRow(target)) {
          i += nextNonEmpty;
          continue;
        }
      }
      break;
    }
    if (isPublisherRow(lines[i])) {
      i += 1;
      continue;
    }
    break;
  }

  while (i < lines.length && lines[i].trim() === "") i += 1;
  out.push(...lines.slice(i));
  return out.join("\n").trimEnd();
}

/**
 * Removes internal authoring rows from Help Center drafts (shown in repo, not meant for readers).
 * Matches **Article ID:**, **Audience:**, **Audiences:** as whole-line bold labels only.
 *
 * @param {string} markdown
 */
export function stripHelpViewerDraftMeta(markdown) {
  return markdown
    .split(/\r?\n/)
    .filter((ln) => {
      const t = ln.trim();
      if (/^\*\*Article ID:\*\*/i.test(t)) return false;
      if (/^\*\*Audience:\*\*/i.test(t)) return false;
      if (/^\*\*Audiences:\*\*/i.test(t)) return false;
      return true;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

/**
 * Parses `help-center/HC-024-article-slug` → `HC-024`. Returns null for README / index.
 *
 * @param {string} routeId
 */
export function extractHelpCenterArticleSlug(routeId) {
  const m = routeId.match(/^help-center\/(HC-\d{3})\b/i);
  return m ? m[1].toUpperCase() : null;
}

/**
 * @param {string} markdown
 * @param {string} routeId e.g. legal/terms-of-service
 */
export function prepareMarkdownForDocumentationViewer(markdown, routeId) {
  let md = markdown;
  if (routeId.startsWith("legal/")) {
    md = stripLegalPublisherMetadata(md);
  }
  if (routeId.startsWith("help-center/")) {
    md = stripHelpViewerDraftMeta(md);
  }
  return stripLeadingH1(md);
}

/**
 * Strip leading H1 when we show title in chrome (avoid duplicate headings).
 * @param {string} markdown
 */
export function stripLeadingH1(markdown) {
  return markdown.replace(/^\s*#\s[^\n]+\n+/, "").trimStart();
}
