import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveDocHref } from "./docMarkdownUtils.js";

function MarkdownLink({ href, children, currentRouteId }) {
  const resolved = href ? resolveDocHref(href, currentRouteId) : null;
  if (!resolved) return <span>{children}</span>;
  if (resolved.type === "external") {
    return (
      <a href={resolved.href} target="_blank" rel="noopener noreferrer" className="doc-md-a">
        {children}
      </a>
    );
  }
  return (
    <Link to={resolved.to} className="doc-md-a">
      {children}
    </Link>
  );
}

const baseComponents = {
  h1: (props) => <h2 className="doc-md-h1 mt-10 scroll-mt-24 first:mt-0" {...props} />,
  h2: (props) => <h3 className="doc-md-h2 mt-8 scroll-mt-24" {...props} />,
  h3: (props) => <h4 className="doc-md-h3 mt-6 scroll-mt-24" {...props} />,
  h4: (props) => <h5 className="doc-md-h4 mt-5" {...props} />,
  p: (props) => <p className="doc-md-p mt-3 leading-relaxed first:mt-0" {...props} />,
  ul: (props) => <ul className="doc-md-ul mt-3 list-disc space-y-2 pl-5" {...props} />,
  ol: (props) => <ol className="doc-md-ol mt-3 list-decimal space-y-2 pl-5" {...props} />,
  li: (props) => <li className="doc-md-li leading-relaxed" {...props} />,
  hr: () => <hr className="doc-md-hr my-8 border-[var(--border-subtle)]" />,
  blockquote: (props) => (
    <blockquote className="doc-md-bq mt-4 border-l-4 border-[var(--color-primary-400)] pl-4 italic text-[var(--text-secondary)]" {...props} />
  ),
  table: (props) => (
    <div className="doc-md-table-wrap my-4 overflow-x-auto rounded-[var(--radius-md)] ring-1 ring-[var(--border-subtle)]">
      <table className="doc-md-table w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-[var(--surface-card-soft)] text-[var(--text-secondary)]" {...props} />,
  tbody: (props) => <tbody className="divide-y divide-[var(--border-subtle)] bg-white" {...props} />,
  tr: (props) => <tr {...props} />,
  th: (props) => (
    <th className="px-3 py-2.5 font-semibold text-[var(--text-primary)] first:rounded-tl-[calc(var(--radius-md)-2px)] last:rounded-tr-[calc(var(--radius-md)-2px)]" {...props} />
  ),
  td: (props) => <td className="px-3 py-2 align-top text-[var(--text-secondary)]" {...props} />,
  code: ({ className, children, ...rest }) => {
    const inline = !className;
    if (inline) {
      return (
        <code className="rounded bg-[var(--surface-card-soft)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--text-primary)] ring-1 ring-[var(--border-subtle)]" {...rest}>
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="doc-md-pre my-4 overflow-x-auto rounded-[var(--radius-md)] bg-[var(--color-neutral-900)] p-4 text-[13px] leading-relaxed text-[var(--color-neutral-100)] ring-1 ring-[var(--border-strong)]">{children}</pre>
  ),
  strong: (props) => <strong className="font-semibold text-[var(--text-primary)]" {...props} />,
};

/** @param {{ markdown: string, currentRouteId: string }} props */
export function DocumentationMarkdown({ markdown, currentRouteId }) {
  return (
    <div className="doc-md-root text-[var(--text-secondary)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ...baseComponents,
          a: ({ href, children }) => (
            <MarkdownLink href={href} currentRouteId={currentRouteId}>
              {children}
            </MarkdownLink>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
      <style>{`
        .doc-md-root .doc-md-h1 {
          font-size: 1.375rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          padding-bottom: 0.375rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .doc-md-root .doc-md-h2 {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .doc-md-root .doc-md-h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .doc-md-root .doc-md-h4 {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .doc-md-root .doc-md-a {
          font-weight: 600;
          color: var(--color-primary-700);
          text-underline-offset: 3px;
        }
        .doc-md-root .doc-md-a:hover {
          color: var(--color-primary-800);
        }
      `}</style>
    </div>
  );
}
