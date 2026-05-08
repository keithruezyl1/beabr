import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { PageHeader } from "../components/ui/PageChrome.jsx";
import { IconCalendar, IconClock, IconGift, IconUsers } from "../components/ui/PageIcons.jsx";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { REGISTRY_EVENT_CATEGORIES } from "../constants/registryEventCategories.js";
import talkingMascot from "../assets/talking_2_cropped.png";

function isoToDateInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isoToDatetimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function EditRegistryPage() {
  const { registryId } = useParams();
  const nav = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState(null);
  const [notOwner, setNotOwner] = useState(false);

  const [title, setTitle] = useState("");
  const [ownerDisplayName, setOwnerDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [eventCategory, setEventCategory] = useState("Celebration");
  const [eventDate, setEventDate] = useState("");
  const [revealDatetime, setRevealDatetime] = useState("");
  const [closeDatetime, setCloseDatetime] = useState("");
  const [showPledgeTotalBeforeReveal, setShowPledgeTotalBeforeReveal] = useState(true);
  const [showConsideringItems, setShowConsideringItems] = useState(false);
  const [visibilityMode, setVisibilityMode] = useState("private_until_reveal");

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const needsRevealDatetime = visibilityMode !== "open_coordination";
  const needsCloseDatetime = visibilityMode === "open_coordination";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadErr(null);
      setNotOwner(false);
      try {
        const d = await apiFetch(`/api/registries/${registryId}`);
        if (cancelled) return;
        if (d.registry?.role !== "owner") {
          setNotOwner(true);
          return;
        }
        const r = d.registry;
        setTitle(r.title || "");
        setOwnerDisplayName(r.ownerDisplayName || "");
        setMessage(r.message || "");
        setEventCategory(
          r.eventCategory && REGISTRY_EVENT_CATEGORIES.includes(r.eventCategory)
            ? r.eventCategory
            : "Celebration"
        );
        setEventDate(isoToDateInputValue(r.eventDate));
        setRevealDatetime(isoToDatetimeLocalValue(r.revealDatetime));
        setCloseDatetime(isoToDatetimeLocalValue(r.closeDatetime));
        setShowPledgeTotalBeforeReveal(Boolean(r.showPledgeTotalBeforeReveal));
        setShowConsideringItems(Boolean(r.showConsideringItems));
        setVisibilityMode(r.visibilityMode || "private_until_reveal");
      } catch (e) {
        if (!cancelled) setLoadErr(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [registryId]);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      await apiFetch(`/api/registries/${registryId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: title.trim(),
          ownerDisplayName: ownerDisplayName.trim(),
          message: message.trim() ? message.trim() : null,
          eventCategory,
          eventDate: eventDate ? new Date(eventDate).toISOString() : null,
          ...(needsRevealDatetime && revealDatetime
            ? { revealDatetime: new Date(revealDatetime).toISOString() }
            : {}),
          ...(needsCloseDatetime && closeDatetime
            ? { closeDatetime: new Date(closeDatetime).toISOString() }
            : {}),
          showPledgeTotalBeforeReveal,
          showConsideringItems,
        }),
      });
      toast.success("Registry updated.");
      nav(`/registry/${registryId}`);
    } catch (e2) {
      setErr(e2);
    } finally {
      setSaving(false);
    }
  }

  if (notOwner) {
    return <Navigate to={`/registry/${registryId}`} replace />;
  }

  if (loadErr) {
    return (
      <div className="space-y-4">
        <PageHeader eyebrow="Registry" title="Edit details" description="We couldn’t load this registry." />
        <Card className="p-5">
          <p className="text-sm text-[var(--danger-text)]">{loadErr.message}</p>
          <Link
            to={`/registry/${registryId}`}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--color-primary-50)] px-4 py-3 text-sm font-semibold text-[var(--color-primary-800)] transition hover:bg-[var(--color-primary-100)]"
          >
            Back to registry
          </Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Registry"
          title="Edit details"
          description="Loading registry…"
        />
        <Card className="h-40 animate-pulse bg-[var(--surface-card-soft)] p-5 shadow-[var(--shadow-sm)] ring-1 ring-[var(--border-subtle)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Registry"
        title="Edit details"
        description="Keep gift guidance clear so loved ones can choose with confidence. Join code and share link stay the same."
        illustrationSrc={talkingMascot}
        illustrationOnTop
        textFullWidth
        actions={
          <Button
            type="button"
            variant="secondary"
            className="min-h-[44px] px-4"
            onClick={() => nav(`/registry/${registryId}`)}
          >
            &lt; Back to registry
          </Button>
        }
      />

      <Card className="p-5 shadow-[var(--shadow-md)] ring-1 ring-[var(--border-subtle)] sm:p-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-left">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Registry Name</div>
            <input
              className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Spring celebration 2026"
            />
          </label>

          <label className="block text-left">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Event type</div>
            <select
              className="mt-1 w-full cursor-pointer rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={eventCategory}
              onChange={(e) => setEventCategory(e.target.value)}
              aria-label="Event type"
            >
              {REGISTRY_EVENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-left">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Your display name</div>
            <input
              className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={ownerDisplayName}
              onChange={(e) => setOwnerDisplayName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </label>

          <label className="block text-left">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Short message</div>
            <textarea
              className="mt-1 w-full resize-none rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Thank you for celebrating this milestone with me…"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 border-t border-[var(--border-subtle)] pt-4">
            <label className="block text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                <IconCalendar className="h-3.5 w-3.5 text-[var(--color-primary-600)]" aria-hidden />
                Main event date
              </div>
              <input
                type="date"
                className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </label>

            {needsRevealDatetime ? (
              <label className="block text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                  <IconClock className="h-3.5 w-3.5 text-[var(--color-beaver-600)]" aria-hidden />
                  Reveal date &amp; time
                </div>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                  value={revealDatetime}
                  onChange={(e) => setRevealDatetime(e.target.value)}
                  required
                />
              </label>
            ) : null}
            {needsCloseDatetime ? (
              <label className="block text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                  <IconClock className="h-3.5 w-3.5 text-[var(--color-beaver-600)]" aria-hidden />
                  Registry closes at
                </div>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                  value={closeDatetime}
                  onChange={(e) => setCloseDatetime(e.target.value)}
                  required
                />
              </label>
            ) : null}
          </div>

          <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] p-4">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Viewer experience</div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-white p-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                  {visibilityMode === "open_coordination" ? (
                    <IconUsers className="h-4 w-4" aria-hidden />
                  ) : (
                    <IconGift className="h-4 w-4" aria-hidden />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {visibilityMode === "open_coordination" ? "Open coordination" : "Private surprise"}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {visibilityMode === "open_coordination"
                      ? "Loved ones can see who reserved or contributed. This was chosen during setup and cannot be changed."
                      : "Loved ones coordinate quietly until names unlock at reveal. This was chosen during setup and cannot be changed."}
                  </p>
                </div>
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-3 text-left">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--border-default)] text-[var(--color-primary-600)] focus:ring-[rgba(129,160,63,0.35)]"
                checked={showPledgeTotalBeforeReveal}
                onChange={(e) => setShowPledgeTotalBeforeReveal(e.target.checked)}
              />
              <span className="text-sm text-[var(--text-secondary)]">
                Show cash fund pledge totals to me before reveal
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-left">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--border-default)] text-[var(--color-primary-600)] focus:ring-[rgba(129,160,63,0.35)]"
                checked={showConsideringItems}
                onChange={(e) => setShowConsideringItems(e.target.checked)}
              />
              <span className="text-sm text-[var(--text-secondary)]">
                Let viewers see items I’m still considering
              </span>
            </label>
          </div>

          {err ? <div className="text-sm text-[var(--danger-text)]">{err.message}</div> : null}

          <Button className="w-full" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
