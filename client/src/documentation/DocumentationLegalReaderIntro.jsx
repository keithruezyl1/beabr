/**
 * Short framing above bundled policy markdown inside the Documentation viewer only.
 */
export function DocumentationLegalReaderIntro({ routeId }) {
  /** @type {Record<string, { title: string, outline: string[] }>} */
  const byRoute = {
    "legal/terms-of-service": {
      title: "Overview",
      outline: [
        "Operational terms for this Beabr instance.",
        "For data handling, read Privacy overview, Cookie notice, and Security practices.",
      ],
    },
    "legal/beabr-responsibility": {
      title: "Overview",
      outline: [
        "What Beabr is responsible for, and what it is not responsible for.",
        "Use this when reading misuse, fraud, harassment, and safety guidance in other articles.",
      ],
    },
    "legal/privacy-policy": {
      title: "Overview",
      outline: [
        "Data categories from sign-in, registry activity, uploads, and routine technical logs.",
        "Contact details appear near the bottom of the page.",
      ],
    },
    "legal/cookie-policy": {
      title: "Overview",
      outline: ["Browser storage needed to keep you signed in after Google sign-in or email one time code steps complete."],
    },
    "legal/security-practices": {
      title: "Overview",
      outline: [
        "High level safeguards such as session handling, upload limits, and protections for high sensitivity pledge material when enabled.",
        "Detailed remediation evidence is kept in developer only records.",
      ],
    },
    "legal/user-protection": {
      title: "Overview",
      outline: [
        "Role based protections and reporting paths for Registry Owners, Registry Participants, and Pledge Initiators.",
        "Guidance for fraud, harassment, and safety concerns.",
      ],
    },
  };

  const content = byRoute[routeId];
  if (!content) {
    return (
      <aside
        className="mb-8 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] px-4 py-3.5 text-sm leading-relaxed text-[var(--text-secondary)]"
        role="note"
      >
        <p className="font-semibold text-[var(--text-primary)]">Supporting copy</p>
        <p className="mt-1.5">Policy text authored for repository developers continues below unchanged.</p>
      </aside>
    );
  }

  return (
    <aside
      className="mb-8 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-card-soft)] px-4 py-4 shadow-[var(--shadow-xs)] sm:px-5"
      role="note"
      aria-labelledby="legal-reader-intro-title"
    >
      <p id="legal-reader-intro-title" className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
        {content.title}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[var(--text-secondary)]">
        {content.outline.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}