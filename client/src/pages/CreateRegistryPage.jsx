import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { PageHeader } from "../components/ui/PageChrome.jsx";
import { IconCalendar, IconClock, IconGift, IconUsers } from "../components/ui/PageIcons.jsx";
import { REGISTRY_EVENT_CATEGORIES } from "../constants/registryEventCategories.js";
import { BevesReminders } from "../components/registry/BevesReminders.jsx";
import { useAuth } from "../state/AuthProvider.jsx";

export function CreateRegistryPage() {
  const hintId = useId();
  const nav = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [ownerDisplayNameOverride, setOwnerDisplayNameOverride] = useState(null);
  const [message, setMessage] = useState("");
  const [eventCategory, setEventCategory] = useState("Celebration");
  const [eventDate, setEventDate] = useState("");
  const [revealDatetime, setRevealDatetime] = useState("");
  const [closeDatetime, setCloseDatetime] = useState("");
  const [visibilityMode, setVisibilityMode] = useState("private_until_reveal");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const ownerDisplayName = ownerDisplayNameOverride ?? user?.name?.trim() ?? "";
  const needsRevealDatetime = visibilityMode !== "open_coordination";
  const needsCloseDatetime = visibilityMode === "open_coordination";

  function handleVisibilityModeChange(nextVisibilityMode) {
    if (nextVisibilityMode === "open_coordination" && revealDatetime) {
      setCloseDatetime(revealDatetime);
    }
    setVisibilityMode(nextVisibilityMode);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const data = await apiFetch("/api/registries", {
        method: "POST",
        body: JSON.stringify({
          title,
          ownerDisplayName,
          message: message || null,
          eventCategory,
          eventDate: eventDate ? new Date(eventDate).toISOString() : null,
          revealDatetime: needsRevealDatetime && revealDatetime ? new Date(revealDatetime).toISOString() : null,
          closeDatetime: needsCloseDatetime && closeDatetime ? new Date(closeDatetime).toISOString() : null,
          visibilityMode,
        }),
      });
      const registryPath = `/registry/${data.registry.id}`;
      nav(
        `/success-modal?variant=registry_created&next=${encodeURIComponent(registryPath)}`
      );
    } catch (e2) {
      setErr(e2);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="New registry"
        title="Create registry"
        description="Help loved ones choose thoughtful gifts with less guessing and fewer duplicates. You can change these settings later."
      />

      <Card className="p-5 shadow-[var(--shadow-md)] ring-1 ring-[var(--border-subtle)] sm:p-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div data-tour-id="registry-form-basics" className="space-y-4">
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
              data-tour-id="registry-event-type"
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
              data-tour-id="registry-display-name"
              className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={ownerDisplayName}
              onChange={(e) => {
                setOwnerDisplayNameOverride(e.target.value);
              }}
              required
              placeholder="Enter your name here"
            />
          </label>

          <label className="block text-left">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Short message</div>
            <textarea
              data-tour-id="registry-short-message"
              className="mt-1 w-full resize-none rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Thank you for celebrating this milestone with me..."
            />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <label className="block text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                <IconCalendar className="h-3.5 w-3.5 text-[var(--color-primary-600)]" aria-hidden />
                Main event date
              </div>
              <input
                type="date"
                data-tour-id="registry-main-event-date"
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
                  data-tour-id="registry-reveal-date"
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

          <div
            data-tour-id="registry-visibility"
            data-tour-highlight="self"
            className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] px-4 py-3"
          >
            <div id="gift-visibility-label" className="text-xs font-semibold text-[var(--text-secondary)]">
              Gift visibility
            </div>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
              Choose once during setup. This{" "}
              <span className="font-semibold text-[var(--color-primary-700)]">cannot be changed</span>{" "}
              after the registry is created.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-labelledby="gift-visibility-label">
              {[
                {
                  value: "private_until_reveal",
                  title: "Private Surprise",
                  body: "Participants coordinate quietly; names unlock at reveal.",
                  icon: IconGift,
                },
                {
                  value: "open_coordination",
                  title: "Open Coordination",
                  body: "Participants can see who reserved or contributed so gifts are easier to coordinate.",
                  icon: IconUsers,
                },
              ].map((option) => {
                const Icon = option.icon;
                const checked = visibilityMode === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer gap-3 rounded-[var(--radius-md)] border bg-white p-3 text-left transition ${
                      checked
                        ? "border-[var(--color-primary-500)] ring-2 ring-[rgba(129,160,63,0.18)]"
                        : "border-[var(--border-default)] hover:bg-[var(--color-primary-50)]/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibilityMode"
                      value={option.value}
                      checked={checked}
                      onChange={(e) => handleVisibilityModeChange(e.target.value)}
                      className="mt-1 h-4 w-4 shrink-0 text-[var(--color-primary-600)] focus:ring-[rgba(129,160,63,0.35)]"
                    />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                        <Icon className="h-4 w-4 shrink-0 text-[var(--color-primary-700)]" aria-hidden />
                        <span className="text-[var(--color-primary-700)]">{option.title}</span>
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-[var(--text-secondary)]">
                        {option.body}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
          <BevesReminders
            variant="create"
            hintId={hintId}
            termsAccepted={termsAccepted}
            onTermsAcceptedChange={setTermsAccepted}
            termsTourId="registry-terms-checkbox"
            hideMascot={user?.hadTour === false}
          />

          {err ? <div className="text-sm text-[var(--danger-text)]">{err.message}</div> : null}

          <Button data-tour-id="registry-create-submit" className="w-full" type="submit" disabled={loading || !termsAccepted}>
            {loading ? "Creating..." : "Create registry"}
          </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

