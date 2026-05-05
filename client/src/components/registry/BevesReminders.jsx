import talkingJoin from "../../assets/talking_1_cropped.png";
import talkingCreate from "../../assets/talking_2_cropped.png";
import { Link } from "react-router-dom";

const LIST_PR = "pr-[5.85rem] sm:pr-[6.65rem]";
const TERMS_LINK_CLASS =
  "font-semibold text-[var(--color-primary-700)] underline underline-offset-2 decoration-[rgba(129,160,63,0.55)] hover:text-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.35)] rounded-[6px]";

const JOIN_BULLETS = [
  "After you join, you can view added items, see which one you want to prepare, and even start a pledge for a specific item.",
  "Joining does not obligate you to give a gift. It is only a way to see the list and coordinate with others if you want to participate.",
];

const CREATE_BULLETS = [
  "Share your invite code or link only with people you trust—anyone with it can join.",
  "Gift givers stay anonymous until reveal, and Beabr never moves money for you.",
];

/**
 * @param {{ variant: "join" | "create"; hintId: string; termsAccepted: boolean; onTermsAcceptedChange: (next: boolean) => void }} props
 */
export function BevesReminders({ variant, hintId, termsAccepted, onTermsAcceptedChange }) {
  const headingId = `${hintId}-beve-heading`;
  const listId = `${hintId}-beve-list`;
  const termsId = `${hintId}-beve-terms`;
  const bullets = variant === "join" ? JOIN_BULLETS : CREATE_BULLETS;
  const mascotSrc = variant === "join" ? talkingJoin : talkingCreate;

  return (
    <aside
      className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[#F8F9F7] px-4 pt-4 pb-4 shadow-none"
      aria-labelledby={headingId}
    >
      <div id={headingId} className="text-sm font-semibold leading-none text-[#4A4A4A]">
        Beve’s reminders
      </div>

      <ul
        id={listId}
        className={`mt-3 list-none space-y-2 text-[13px] font-normal leading-snug text-[#595959] sm:text-[14px] ${LIST_PR}`}
      >
        {bullets.map((text, idx) => (
          <li key={idx} className="flex gap-2.5">
            <span
              className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-500)]"
              aria-hidden
            />
            <span className="min-w-0 flex-1">{text}</span>
          </li>
        ))}
      </ul>

      <label
        htmlFor={termsId}
        className={`relative z-10 mt-4 flex min-h-[44px] cursor-pointer items-center gap-3 text-left ${LIST_PR}`}
      >
        <input
          id={termsId}
          type="checkbox"
          className="h-[1.125rem] w-[1.125rem] shrink-0 cursor-pointer rounded-[4px] border-2 border-[var(--border-strong)] text-[var(--color-primary-600)] accent-[var(--color-primary-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F9F7]"
          checked={termsAccepted}
          onChange={(e) => onTermsAcceptedChange(e.target.checked)}
        />
        <span className="text-sm font-medium leading-normal text-[var(--text-secondary)]">
          I understand the{" "}
          <Link
            to="/documentation/legal/terms-of-service"
            className={TERMS_LINK_CLASS}
            onClick={(e) => e.stopPropagation()}
          >
            Terms of use
          </Link>
        </span>
      </label>

      {/* Bottom-aligned to the aside so feet sit on the lower edge of this card */}
      <img
        src={mascotSrc}
        alt=""
        width={148}
        height={185}
        decoding="async"
        draggable={false}
        className="pointer-events-none absolute bottom-0 right-4 z-[1] block h-auto w-[5.75rem] select-none object-contain object-bottom sm:w-[6.5rem]"
      />
    </aside>
  );
}
