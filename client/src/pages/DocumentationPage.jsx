import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, NavLink, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { DocumentationArticleSkeleton } from "../documentation/DocumentationArticleSkeleton.jsx";
import { DocumentationLegalReaderIntro } from "../documentation/DocumentationLegalReaderIntro.jsx";
import { DocumentationMarkdown } from "../documentation/DocumentationMarkdown.jsx";
import { useAuth } from "../state/AuthProvider.jsx";
import {
  clearDocMarkdownCache,
  DEFAULT_DOC_ROUTE_ID,
  DOC_NAV_SECTIONS,
  docNavCategory,
  getAllDocNavEntries,
  hasDocRoute,
  loadDocMarkdown,
  peekCachedDoc,
  prefetchDocMarkdown,
} from "../documentation/docRegistry.js";
import { extractHelpCenterArticleSlug, prepareMarkdownForDocumentationViewer } from "../documentation/docMarkdownUtils.js";

/** Circular “search orb” affordance — opens the documentation sidebar on mobile. */
function IconSearchOrb({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBook({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M4 19.5A2.5 2.5 0 016.5 17H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 10h8M9 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronClose({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Sidebar: only surfaces pages most people need inside the product. Deep links still work. */
const CUSTOMER_SIDEBAR_SECTION_IDS = new Set(["legal", "help-center"]);

export function DocumentationPage() {
  const { user } = useAuth();
  const params = useParams();
  /** @type {string|undefined} */
  const splatRaw = params["*"];
  const routeId = splatRaw && splatRaw.length > 0 ? splatRaw.replace(/^\/+|\/+$/g, "") : "";

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  /** @type {null | { routeId: string, label: string, content: string }} */
  const [doc, setDoc] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const entries = useMemo(() => getAllDocNavEntries(), []);

  const grouped = useMemo(() => {
    return DOC_NAV_SECTIONS.filter((section) => CUSTOMER_SIDEBAR_SECTION_IDS.has(section.id)).map((section) => ({
      ...section,
      items: entries.filter((e) => docNavCategory(e.routeId) === section.id),
    })).filter((g) => g.items.length > 0);
  }, [entries]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [routeId]);

  useEffect(() => {
    if (!routeId || !hasDocRoute(routeId)) return undefined;

    let cancelled = false;

    /** All setStates run after a microtask tick (avoids sync set-state-in-effect churn). */
    async function load() {
      await Promise.resolve();
      if (cancelled) return;
      const cached = peekCachedDoc(routeId);
      if (cached) {
        setDoc(cached);
        setBusy(false);
        setError(null);
        return;
      }
      setDoc(null);
      setBusy(true);
      setError(null);
      const payload = await loadDocMarkdown(routeId);
      if (cancelled) return;
      setBusy(false);
      if (!payload) {
        setError("failed");
        setDoc(null);
        return;
      }
      setDoc(payload);
      setError(null);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [routeId]);

  if (!routeId) {
    return <Navigate to={`/documentation/${DEFAULT_DOC_ROUTE_ID}`} replace />;
  }

  const navFallbackLabel =
    grouped.flatMap((g) => g.items).find((i) => i.routeId === routeId)?.label ?? routeId ?? "";

  if (!hasDocRoute(routeId)) {
    return (
      <div className="space-y-4">
        <Card className="p-6 ring-1 ring-[var(--border-subtle)]">
          <div className="text-lg font-semibold text-[var(--text-primary)]">Page not found</div>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">This documentation topic does not exist in the bundled set.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to={`/documentation/${DEFAULT_DOC_ROUTE_ID}`}>
              <Button>Open Terms of use</Button>
            </Link>
            <Link to="/settings">
              <Button variant="secondary">Back to profile</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const loaded = Boolean(doc && doc.routeId === routeId && !busy);
  const helpArticleBadge = loaded ? extractHelpCenterArticleSlug(doc.routeId) : null;

  /** @type {string | null} */
  let displayTitleLoaded = null;
  if (loaded) {
    const m = doc.content.match(/^#\s+(.+)$/m);
    displayTitleLoaded = m ? m[1].trim() : doc.label;
  }
  const renderedMdLoaded =
    loaded && doc ? prepareMarkdownForDocumentationViewer(doc.content, doc.routeId) : "";
  const showProfileBackLink = Boolean(user);

  async function retryLoad() {
    if (!routeId) return;
    clearDocMarkdownCache(routeId);
    setBusy(true);
    setError(null);
    setDoc(null);
    const payload = await loadDocMarkdown(routeId);
    setBusy(false);
    if (!payload) {
      setError("failed");
      return;
    }
    setDoc(payload);
  }

  function navLinkClasses({ isActive }) {
    const base =
      "block rounded-[10px] px-2.5 py-2 text-[13px] leading-snug transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.35)]";
    if (isActive) return `${base} bg-[rgba(129,160,63,0.14)] font-semibold text-[var(--color-primary-900)]`;
    return `${base} font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-card-soft)] hover:text-[var(--text-primary)]`;
  }

  function linkPrefetchHandlers(rid) {
    return {
      onMouseEnter: () => prefetchDocMarkdown(rid),
      onFocus: () => prefetchDocMarkdown(rid),
    };
  }

  const sidebarInner = (
    <div className="flex h-full flex-col gap-4">
      <div className="relative flex items-center gap-2 pr-12 lg:pr-0">
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] text-[var(--color-primary-800)] ring-1 ring-[rgba(129,160,63,0.25)]">
            <IconBook className="h-5 w-5" aria-hidden />
          </div>
          <span className="whitespace-nowrap text-[17px] font-extrabold uppercase tracking-[0.06em] text-[var(--text-primary)]">Documentation</span>
        </div>
        <button
          type="button"
          className="absolute right-0 top-0 grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] ring-1 ring-[var(--border-default)] lg:hidden"
          aria-label="Close documentation menu"
          onClick={() => setMobileNavOpen(false)}
        >
          <IconChevronClose className="h-5 w-5 text-[var(--text-secondary)]" />
        </button>
      </div>

      <nav
        className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain lg:flex-none lg:overflow-visible"
        aria-label="Documentation sections"
      >
        {grouped.map((group) => (
          <div key={group.id}>
            <div className="pb-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{group.title}</div>
            </div>
            <ul className="space-y-0.5 border-l border-[var(--border-subtle)] pl-3">
              {group.items.map((item) => (
                <li key={item.routeId}>
                  <NavLink
                    to={`/documentation/${item.routeId}`}
                    className={navLinkClasses}
                    onClick={() => setMobileNavOpen(false)}
                    {...linkPrefetchHandlers(item.routeId)}
                  >
                    <span className="break-words text-left lg:whitespace-nowrap">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );

  const profileBackLink = showProfileBackLink ? (
    <Link
      to="/settings"
      className="inline-flex min-h-[44px] min-w-0 items-center text-sm font-semibold text-[var(--color-primary-700)] hover:text-[var(--color-primary-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.35)]"
    >
      <span aria-hidden className="mr-0.5 shrink-0">
        &lt;
      </span>
      <span className="truncate">Go back to Profile</span>
    </Link>
  ) : null;

  const mainAriaLabelledBy = loaded ? "documentation-title" : "documentation-skeleton-heading";

  return (
    <div className={showProfileBackLink ? "" : "pt-4 sm:pt-6 lg:pt-8"}>
      <div className="relative mx-auto w-full max-w-[min(88rem,calc(100vw-1rem))] px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex min-w-0 items-center gap-3 lg:hidden">
          <button
            type="button"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] ring-1 ring-black/[0.04] transition active:scale-[0.98]"
            aria-expanded={mobileNavOpen}
            aria-controls="documentation-nav-panel"
            aria-label="Open documentation topics"
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            <IconSearchOrb className="h-5 w-5" />
          </button>
          {profileBackLink ? <div className="min-w-0 flex-1">{profileBackLink}</div> : null}
        </div>

        <div
          className={`mt-0 flex min-w-0 flex-col gap-6 sm:mt-0 lg:flex-row lg:items-start lg:justify-center lg:gap-10 ${
            showProfileBackLink ? "lg:mt-2" : "lg:mt-0"
          }`}
        >
          <div
            className={`relative flex w-full shrink-0 flex-col lg:sticky lg:self-start lg:w-max lg:min-w-[17.5rem] lg:max-w-[min(30rem,calc(100vw-28rem))] ${
              showProfileBackLink ? "lg:top-24 lg:pt-[3.5rem]" : "lg:top-8"
            }`}
          >
            {profileBackLink ? (
              <div className="hidden shrink-0 text-left lg:absolute lg:left-0 lg:top-0 lg:block lg:w-max lg:max-w-full lg:pt-0">
                {profileBackLink}
              </div>
            ) : null}
            <aside
              id="documentation-nav-panel"
              className={`fixed inset-y-0 left-0 z-50 flex w-[min(22rem,calc(100vw-40px))] flex-col bg-[var(--surface-page)] p-4 shadow-[var(--shadow-lg)] ring-1 ring-[var(--border-subtle)] transition-transform duration-[var(--motion-base)] ease-[var(--ease-standard)] lg:static lg:z-auto lg:mt-0 lg:h-auto lg:w-full lg:min-w-0 lg:max-w-none lg:shrink-0 lg:transform-none lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0 lg:transition-none ${
                mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              }`}
            >
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:max-h-[calc(100vh-7rem)]">
              <div className="flex min-h-0 flex-1 flex-col lg:min-h-[12rem]">
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 shadow-[var(--shadow-xs)] lg:p-4">
                  {sidebarInner}
                </div>
              </div>
            </div>
            </aside>
          </div>

          {mobileNavOpen ? (
            <button
              type="button"
              className="fixed inset-0 z-40 bg-[var(--surface-overlay)] lg:hidden"
              aria-label="Close documentation menu"
              onClick={() => setMobileNavOpen(false)}
            />
          ) : null}

          <section
            id="documentation-main"
            className={`mx-auto min-w-0 w-full max-w-[min(40rem,calc(100vw-2rem))] flex-1 lg:mx-0 lg:max-w-4xl ${
              showProfileBackLink ? "lg:pt-[3.5rem]" : "lg:pt-0"
            }`}
            aria-labelledby={mainAriaLabelledBy}
            aria-busy={!loaded && busy}
          >
            {loaded ? (
              <article className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-6 shadow-[var(--shadow-sm)] sm:px-6 sm:py-8 md:px-9 md:py-10">
                <header className="border-b border-[var(--border-subtle)] pb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    {doc.routeId.startsWith("legal/") ? "Policies" : "Help topics"}
                  </p>
                  <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <h1 id="documentation-title" className="min-w-0 flex-1 text-2xl font-bold tracking-tight text-[var(--text-primary)] md:text-[1.65rem]">
                      {displayTitleLoaded}
                    </h1>
                    {helpArticleBadge ? (
                      <span
                        className="inline-flex w-fit shrink-0 items-center rounded-full border border-[var(--border-default)] bg-[var(--surface-card-soft)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary-800)] shadow-[var(--shadow-xs)] ring-1 ring-[rgba(129,160,63,0.12)] sm:mt-1"
                        title="Article identifier"
                      >
                        {helpArticleBadge}
                      </span>
                    ) : null}
                  </div>
                </header>
                <div className="max-w-none pt-8">
                  {doc.routeId.startsWith("legal/") ? (
                    <DocumentationLegalReaderIntro routeId={doc.routeId} />
                  ) : null}
                  <DocumentationMarkdown markdown={renderedMdLoaded} currentRouteId={doc.routeId} />
                </div>
              </article>
            ) : error === "failed" ? (
              <Card className="p-8 ring-1 ring-[var(--border-subtle)]">
                <p className="text-base font-semibold text-[var(--text-primary)]">Couldn&apos;t load this page</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Your connection may have dropped, or this documentation chunk failed to load. Try again in a moment.
                </p>
                <Button className="mt-6 w-full sm:w-auto" onClick={() => retryLoad()}>
                  Try again
                </Button>
              </Card>
            ) : (
              <DocumentationArticleSkeleton
                routeId={routeId}
                routeLabel={navFallbackLabel}
                helpArticleBadge={extractHelpCenterArticleSlug(routeId)}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
