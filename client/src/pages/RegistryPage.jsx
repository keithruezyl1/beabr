import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { SuccessModal } from "../components/ui/SuccessModal.jsx";
import { resolveSuccessModalVariant } from "../utils/successModalVariants.js";
import { useAuth } from "../state/AuthProvider.jsx";
import { formatIntegerInput, formatNumberDots, formatPesoDots, parseIntegerInput } from "../utils/numberFormat.js";
import { AvatarImage } from "../components/ui/AvatarImage.jsx";

function IconEye({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconUsers({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCalendar({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconClock({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCheckCircle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12.5l2.5 2.5L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconGift({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path d="M20 12v10H4V12M2 7h20v5H2V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function IconWallet({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTimer({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Stacked rows - items / inventory count card */
function IconListStack({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Filter funnel - gift filters popover trigger */
function IconFunnel({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M22 5H2l8 9.46V21l4-2v-8.54L22 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconExternalLink({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShopee({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M7.2 8.1V7a4.8 4.8 0 0 1 9.6 0v1.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6.3 8.1h11.4c1 0 1.8.8 1.8 1.8v8.4c0 1-.8 1.8-1.8 1.8H6.3c-1 0-1.8-.8-1.8-1.8V9.9c0-1 .8-1.8 1.8-1.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 15.4c.7.6 2.9.8 3.8-.2.6-.7.1-1.6-.9-1.8l-1.1-.2c-1-.2-1.4-1.1-.9-1.8.9-1 3-1 4-.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getProductSiteMeta(rawUrl) {
  const url = String(rawUrl || "").trim();
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = (u.hostname || "").toLowerCase();
    const isShopee = host === "shopee.ph" || host.endsWith(".shopee.ph") || host.startsWith("shopee.");
    if (isShopee) return { kind: "shopee", faviconUrl: null };
    const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(u.origin)}`;
    return { kind: "generic", faviconUrl };
  } catch {
    return { kind: "generic", faviconUrl: null };
  }
}

function IconReceipt({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M9 3h9a2 2 0 0 1 2 2v16l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatScheduleDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatScheduleTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getRemainingParts(targetDate, nowMs) {
  const diff = targetDate.getTime() - nowMs;
  if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { expired: false, days, hours, minutes, seconds };
}
import { apiFetch, apiFetchBlob, apiFetchForm } from "../services/api";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { formatStatusLabel, StatusBadge, StatusBadgeBy } from "../components/ui/StatusBadge.jsx";
import { BottomSheet } from "../components/ui/BottomSheet.jsx";
import { RegistryScreenSkeleton } from "../components/ui/ScreenSkeletons.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ShareInviteModal } from "../components/registry/ShareInviteModal.jsx";
import { IconCopy, IconLightbulb, IconPencil, IconShare, IconSparkles } from "../components/ui/PageIcons.jsx";
import peekRightImg from "../assets/peek_right.png";
import sweatingImg from "../assets/sweating.png";

function pledgeReceiptStatusMeta(status) {
  switch (status) {
    case "pending_receipt":
      return {
        label: "Awaiting receipt",
        className: "bg-[var(--warning-bg)] text-[var(--warning-text)]",
      };
    case "receipt_uploaded":
      return {
        label: "Receipt uploaded",
        className: "bg-[var(--color-primary-100)] text-[var(--color-primary-800)]",
      };
    case "confirmed":
      return {
        label: "Confirmed",
        className: "bg-[var(--success-bg)] text-[var(--success-text)]",
      };
    default:
      return {
        label: formatStatusLabel(status) || "Unknown",
        className: "bg-[var(--color-neutral-100)] text-[var(--text-muted)]",
      };
  }
}

function formatPledgeContributionDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatGroupPledgeCardAmount(n) {
  if (n == null || Number.isNaN(Number(n))) return "0";
  return formatNumberDots(Math.round(Number(n)));
}

async function copyToClipboard(text) {
  const t = String(text ?? "");
  if (!t.trim()) return;
  try {
    await navigator.clipboard.writeText(t);
    return;
  } catch {
    const el = document.createElement("textarea");
    el.value = t;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

/** Parses optional price from form input; invalid or empty -> null */
function parsePriceReferenceInput(raw) {
  const t = String(raw ?? "").trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0 || n > 999999) return null;
  return n;
}

function parseOptionalItemUrl(raw) {
  const t = String(raw ?? "").trim();
  if (!t) return null;
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : t.includes(".") ? `https://${t}` : t;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Unsupported URL protocol.");
    return url.toString();
  } catch {
    throw new Error("Enter a valid item link starting with https://, or leave the link blank.");
  }
}

/** Display price on item cards / sheet (API may return Decimal as string). */
function formatItemPriceReference(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value).trim() || null;
  return formatPesoDots(n, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function formatReservationDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  const date = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${date} · ${time}`;
}

function attributionName(person) {
  return String(person?.name || "Loved one").trim() || "Loved one";
}

function attributionInitial(person) {
  return attributionName(person).slice(0, 1).toUpperCase();
}

function AttributionAvatar({ person }) {
  if (person?.avatarUrl) {
    return (
      <AvatarImage
        src={person.avatarUrl}
        alt=""
        className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-[var(--border-subtle)]"
      />
    );
  }
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-xs font-bold text-[var(--color-primary-800)] ring-1 ring-[var(--border-subtle)]"
      aria-hidden
    >
      {attributionInitial(person)}
    </span>
  );
}

function AttributionRows({ title, rows }) {
  if (!rows || rows.length === 0) return null;
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] p-3">
      <div className="text-xs font-semibold text-[var(--text-secondary)]">{title}</div>
      <ul className="mt-2 space-y-2">
        {rows.map((row) => {
          const person = row.giver || row.contributor || row.initiator;
          const amount =
            row.amount != null
              ? formatPesoDots(row.amount, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
              : null;
          const detail =
            row.detail ||
            (amount
              ? `${amount} · ${formatStatusLabel(row.status)}`
              : `${formatStatusLabel(row.status)} · Qty ${row.quantity}`);
          return (
            <li key={row.id} className="flex items-center gap-2 rounded-[var(--radius-md)] bg-white px-3 py-2 ring-1 ring-[var(--border-subtle)]">
              <AttributionAvatar person={person} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-[var(--text-primary)]">{attributionName(person)}</div>
                <div className="mt-0.5 text-xs text-[var(--text-muted)]">{detail}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function giftItemOpenCoordinationStatusMeta(item) {
  if (!item?.attributionVisible || !item?.attribution) return null;

  if (item.groupPledge) {
    const initiator = item.attribution.pledgeInitiator || item.groupPledge.initiator || null;
    return {
      type: "pledge",
      prefix: "Pledge initiated by",
      person: initiator,
    };
  }

  const reservationRows = Array.isArray(item.attribution.reservations)
    ? item.attribution.reservations
    : [];
  const row =
    reservationRows.find((r) => r.status === "prepared") ||
    reservationRows.find((r) => r.status === "reserved") ||
    null;

  if (!row) return null;
  return {
    type: "reservation",
    status: item.displayStatus || row.status,
    person: row.giver || null,
  };
}

function archiveBlockedStatusLabel(item) {
  if (item?.hasPledge) return "pledged";
  if ((item?.totals?.prepared ?? 0) > 0) return "prepared";
  if ((item?.totals?.reserved ?? 0) > 0) return "reserved";
  return "claimed";
}

/** Numeric estimate for filtering; invalid / missing -> null */
function giftItemNumericPriceEstimate(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/**
 * Upper bound for the gift price filter slider: next power of 10 >= max item price when that is <= 2x max
 * (e.g. ₱8,599 -> ₱10,000). Otherwise round up to the next ₱1,000. No priced items -> generous default.
 */
function roundPriceSliderCeiling(maxItemPrice) {
  if (!Number.isFinite(maxItemPrice) || maxItemPrice <= 0) return 50_000;
  const pow10 = Math.pow(10, Math.ceil(Math.log10(maxItemPrice)));
  if (pow10 <= maxItemPrice * 2) return Math.max(1000, pow10);
  const step = 1000;
  return Math.max(1000, Math.ceil(maxItemPrice / step) * step);
}

const MAX_ITEM_PHOTOS = 3;

function itemGalleryUrls(item) {
  const u = item?.imageUrls;
  if (Array.isArray(u) && u.length > 0) return u.filter(Boolean);
  return item?.imageUrl ? [item.imageUrl] : [];
}

/** Framed thumbnails - matches square `PhotoDropzoneInner` tile (owner edit sheet + add-item) */
const ITEM_GALLERY_THUMB_FRAME_CLASS = "relative w-[5.5rem] shrink-0 sm:w-24";

/** Local draft file previews - parent should use `flex flex-wrap items-start gap-2` alongside the dropzone tile */
function DraftItemPhotoThumb({ file, index, onRemove, disabled }) {
  const src = useMemo(() => URL.createObjectURL(file), [file]);
  const [showRemove, setShowRemove] = useState(false);

  return (
    <div
      className={`${ITEM_GALLERY_THUMB_FRAME_CLASS} group`}
      onClick={() => setShowRemove(true)}
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}
    >
      <img
        src={src}
        alt=""
        onLoad={() => URL.revokeObjectURL(src)}
        onError={() => URL.revokeObjectURL(src)}
        className={`aspect-square w-full rounded-[var(--radius-md)] object-cover ring-2 ring-[var(--color-primary-600)] ring-offset-2 ring-offset-[var(--surface-page)] transition md:group-hover:blur-[1.5px] ${
          showRemove ? "blur-[1.5px]" : ""
        }`}
      />
      <button
        type="button"
        disabled={disabled}
        className={`absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-red-200 bg-red-50/95 text-base font-bold text-red-600 shadow-[var(--shadow-sm)] transition hover:bg-red-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50 md:opacity-0 md:group-hover:opacity-100 ${
          showRemove ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Remove draft photo"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
      >
        X
      </button>
    </div>
  );
}

function DraftItemPhotosRow({ files, onRemove, disabled }) {
  if (files.length === 0) return null;

  return (
    <>
      {files.map((f, idx) => (
        <DraftItemPhotoThumb
          key={`${f.name}-${f.lastModified}-${idx}`}
          file={f}
          index={idx}
          onRemove={onRemove}
          disabled={disabled}
        />
      ))}
    </>
  );
}
/** Scrollable thumbnails in sheet; opens lightbox with full gallery */
function ItemSheetGalleryStrip({ urls, title, onPick }) {
  if (urls.length === 0) return null;

  if (urls.length === 1) {
    return (
      <button
        type="button"
        className="block w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] shadow-[var(--shadow-xs)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-500)]"
        onClick={() => onPick(urls)}
      >
        <img
          src={urls[0]}
          alt={title ? `${title}` : "Gift item"}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <span className="sr-only">View larger image</span>
      </button>
    );
  }

  return (
    <div>
      <div
        className="-mx-1 flex gap-2 overflow-x-auto overflow-y-hidden pb-2 pt-1 [scrollbar-width:thin] snap-x snap-mandatory md:gap-3"
      >
        {urls.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => onPick(urls)}
            className="relative w-[min(100%,20rem)] shrink-0 snap-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] shadow-[var(--shadow-xs)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-500)]"
          >
            <img
              src={src}
              alt={title ? `${title} · photo ${i + 1} of ${urls.length}` : `Gift item photo ${i + 1} of ${urls.length}`}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
      <div className="text-center text-[11px] font-medium text-[var(--text-muted)]">
        Scroll for more · tap an image for full size
      </div>
    </div>
  );
}

/** Full-size gallery in a vertically scrollable overlay */
function ItemImageLightboxDialog({ urls, title, open, onClose }) {
  const touchStartRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || !urls?.length) return null;

  return createPortal(
    <div className="fixed inset-0 z-[210] touch-manipulation">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[var(--surface-overlay)] backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Full-size photos"
        className="relative z-[1] flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden"
        onTouchStart={(e) => {
          const t = e.touches?.[0];
          if (!t) return;
          touchStartRef.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touchStartRef.current;
          touchStartRef.current = null;
          const t = e.changedTouches?.[0];
          if (!start || !t) return;
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          // "Swipe back" (right swipe) closes the viewer.
          if (dx > 70 && Math.abs(dy) < 60) onClose();
        }}
      >
        <div
          className="min-h-0 flex-1 overflow-y-auto px-3 py-8"
          onClick={(e) => {
            // Close when tapping/clicking anywhere outside the image itself.
            const target = e.target instanceof Element ? e.target : null;
            if (target?.closest?.("[data-lightbox-figure]")) return;
            onClose();
          }}
        >
          <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-6">
            {urls.map((src, i) => (
              // eslint-disable-next-line react/no-array-index-key - signed URLs distinct per refresh
              <figure
                key={`lb-${i}`}
                data-lightbox-figure
                className="overflow-hidden rounded-[var(--radius-lg)] bg-black/35 ring-1 ring-white/20"
              >
                <img
                  src={src}
                  alt={title ? `${title} · ${i + 1} of ${urls.length}` : `Photo ${i + 1} of ${urls.length}`}
                  className="mx-auto block max-h-[min(85vh,900px)] w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="sr-only">
                  {title ? `${title} · image ${i + 1} of ${urls.length}` : `Image ${i + 1} of ${urls.length}`}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function groupPledgeProgressPercent(gp) {
  if (!gp) return 0;
  const g = Number(gp.gatheredAmount) || 0;
  const goal = gp.goalAmount != null ? Number(gp.goalAmount) : null;
  if (goal != null && goal > 0) return Math.min(100, (g / goal) * 100);
  return g > 0 ? 100 : 0;
}

function groupPledgeStatusLabel({ gatheredAmount, goalAmount }) {
  const g = Number(gatheredAmount) || 0;
  const goal = goalAmount != null ? Number(goalAmount) : null;
  if (goal != null && goal > 0 && g >= goal) return "Goal Reached";
  return "On Going";
}

function RegistryPhotoPicker({
  inputId = "registry-photo-input",
  emptyLabel = "Add/Drag Photos",
  remoteUrl,
  localFile,
  onFile,
  onClearLocal,
  disabled,
}) {
  const localPreview = useMemo(() => (localFile ? URL.createObjectURL(localFile) : null), [localFile]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const displaySrc = localPreview || remoteUrl || null;

  function pick(file) {
    if (!file) return;
    onFile?.(file);
  }

  function handleHiddenChange(e) {
    pick(e.target.files?.[0] || null);
    e.target.value = "";
  }

  if (displaySrc) {
    return (
      <div className="space-y-2">
        <div className="overflow-hidden rounded-[18px] border-2 border-[var(--color-primary-600)] bg-[var(--color-primary-50)] p-1 shadow-[var(--shadow-sm)] ring-2 ring-[rgba(129,160,63,0.35)] ring-offset-2 ring-offset-[var(--surface-page)]">
          <img
            src={displaySrc}
            alt="Uploaded photo preview"
            className="max-h-52 w-full rounded-[14px] object-cover"
          />
        </div>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled}
          onChange={handleHiddenChange}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            className="min-w-0 flex-1"
            disabled={disabled}
            onClick={() => document.getElementById(inputId)?.click()}
          >
            Change photo
          </Button>
          {localFile && onClearLocal ? (
            <Button type="button" variant="secondary" disabled={disabled} onClick={onClearLocal}>
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={handleHiddenChange}
      />
      <PhotoDropzoneInner inputId={inputId} label={emptyLabel} onPick={pick} disabled={disabled} />
    </div>
  );
}

function PhotoDropzoneInner({
  label = "Add/Drag Photos",
  onPick,
  inputId = "photo-dropzone-input",
  disabled,
  compact = false,
  /** When `compact`: fixed square matching `ITEM_GALLERY_THUMB_FRAME_CLASS` thumbnails */
  squareThumb = false,
}) {
  const [dragOver, setDragOver] = useState(false);

  const dragBorder = dragOver
    ? "border-[rgba(129,160,63,0.65)] bg-[rgba(244,248,235,0.85)]"
    : "border-dashed border-[rgba(185,196,170,0.75)]";

  const shell =
    compact && squareThumb
      ? `flex aspect-square w-[5.5rem] shrink-0 flex-col items-center justify-center rounded-[var(--radius-md)] border-2 bg-white/70 p-1 text-center transition disabled:opacity-50 sm:w-24 ${dragBorder}`
      : compact
        ? `w-full rounded-[12px] border-2 bg-white/70 px-2.5 py-2 text-left transition disabled:opacity-50 ${dragBorder}`
        : `w-full rounded-[18px] border-2 bg-white/70 px-4 py-5 text-left transition disabled:opacity-50 ${dragBorder}`;

  const iconCompact = squareThumb ? "grid h-8 w-8 shrink-0 place-items-center rounded-[10px]" : null;
  const iconBox =
    compact && squareThumb
      ? `${iconCompact} bg-white shadow-[var(--shadow-xs)] ${dragOver ? "ring-2 ring-[rgba(129,160,63,0.25)]" : ""}`
      : compact
        ? `grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-white shadow-[var(--shadow-xs)] ${
            dragOver ? "ring-2 ring-[rgba(129,160,63,0.25)]" : ""
          }`
        : `grid h-16 w-16 place-items-center rounded-[18px] bg-white shadow-[var(--shadow-xs)] ${
            dragOver ? "ring-2 ring-[rgba(129,160,63,0.25)]" : ""
          }`;

  const svgSize = compact ? (squareThumb ? 17 : 18) : 26;
  const stroke = compact ? (squareThumb ? 1.5 : 1.55) : 1.8;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => document.getElementById(inputId)?.click()}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        const f = e.dataTransfer?.files?.[0];
        onPick(f || null);
      }}
      className={shell}
    >
      {compact && squareThumb ? (
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-1 px-0.5">
          <div className={iconBox}>
            <svg width={svgSize} height={svgSize} viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M8.6 7.6 9.7 6.1c.4-.6.7-.9 1.2-1.1.4-.2.8-.3 1.3-.3h1.6c.5 0 .9.1 1.3.3.5.2.8.5 1.2 1.1l1.1 1.5"
                stroke="var(--color-primary-700)"
                strokeWidth={stroke}
                strokeLinecap="round"
              />
              <path
                d="M7 20h10a4 4 0 0 0 4-4v-5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v5a4 4 0 0 0 4 4Z"
                stroke="var(--color-primary-800)"
                strokeWidth={stroke}
              />
              <path
                d="M12 16.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                stroke="var(--color-primary-800)"
                strokeWidth={stroke}
              />
            </svg>
          </div>
          <div className="max-w-full text-[10px] font-semibold leading-tight text-[var(--text-primary)] [overflow-wrap:anywhere] line-clamp-3">
            {label}
          </div>
          <div className="text-[9px] leading-tight text-[var(--text-muted)]">PNG, JPG... · max 8MB</div>
        </div>
      ) : compact ? (
        <div className="flex items-center gap-2.5">
          <div className={iconBox}>
            <svg width={svgSize} height={svgSize} viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M8.6 7.6 9.7 6.1c.4-.6.7-.9 1.2-1.1.4-.2.8-.3 1.3-.3h1.6c.5 0 .9.1 1.3.3.5.2.8.5 1.2 1.1l1.1 1.5"
                stroke="var(--color-primary-700)"
                strokeWidth={stroke}
                strokeLinecap="round"
              />
              <path
                d="M7 20h10a4 4 0 0 0 4-4v-5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v5a4 4 0 0 0 4 4Z"
                stroke="var(--color-primary-800)"
                strokeWidth={stroke}
              />
              <path
                d="M12 16.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                stroke="var(--color-primary-800)"
                strokeWidth={stroke}
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-xs font-semibold text-[var(--text-primary)]">{label}</div>
            <div className="text-[10px] leading-snug text-[var(--text-muted)]">Drop or tap · PNG, JPG... · max 8MB</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className={iconBox}>
            <svg width={svgSize} height={svgSize} viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M8.6 7.6 9.7 6.1c.4-.6.7-.9 1.2-1.1.4-.2.8-.3 1.3-.3h1.6c.5 0 .9.1 1.3.3.5.2.8.5 1.2 1.1l1.1 1.5"
                stroke="var(--color-primary-700)"
                strokeWidth={stroke}
                strokeLinecap="round"
              />
              <path
                d="M7 20h10a4 4 0 0 0 4-4v-5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v5a4 4 0 0 0 4 4Z"
                stroke="var(--color-primary-800)"
                strokeWidth={stroke}
              />
              <path
                d="M12 16.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                stroke="var(--color-primary-800)"
                strokeWidth={stroke}
              />
            </svg>
          </div>
          <div className="text-sm font-semibold text-[var(--text-primary)]">{label}</div>
          <div className="text-xs text-[var(--text-muted)]">PNG, JPG, WEBP, HEIC, AVIF · up to 8MB</div>
        </div>
      )}
    </button>
  );
}

/** @param {boolean} showClaimProgress - false for owners: hide reserved/prepared aggregate (participant-only detail). */
function formatQty(item, showClaimProgress = true) {
  const needed = item.quantityNeeded;
  if (!showClaimProgress) return `${needed} needed`;
  const prepared = item.totals?.prepared ?? 0;
  const reserved = item.totals?.reserved ?? 0;
  if (prepared > 0) return `${prepared} of ${needed} prepared`;
  if (reserved > 0) return `${reserved} of ${needed} reserved`;
  return `${needed} needed`;
}

/** Registry list items expose `attributes` as { key, value }[] */
function giftItemAttributeRows(item) {
  const rows = item.attributes;
  if (!Array.isArray(rows) || rows.length === 0) return [];
  return rows.filter((a) => a?.value != null && String(a.value).trim() !== "");
}

/** Item detail sheet: show attributes plus quantity inserted after `model`. */
function giftItemSheetDetailRows(item, showClaimProgress) {
  const attrs = giftItemAttributeRows(item);
  const qtyText = formatQty(item, showClaimProgress);
  const rows = [];
  let insertedQty = false;
  for (const a of attrs) {
    rows.push({ type: "attr", attr: a });
    if (String(a.key ?? "").toLowerCase() === "model") {
      rows.push({ type: "qty", qtyText });
      insertedQty = true;
    }
  }
  if (!insertedQty) rows.push({ type: "qty", qtyText });
  return rows;
}

function formatAttributeLabel(key) {
  return key
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const EWALLET_PROVIDERS = ["GCash", "Maya", "PayPal", "Wise", "Others"];
const BANK_NAMES = ["BPI", "BDO", "GoTyme", "Maribank", "Others"];

function ewalletAccountPlaceholder(provider) {
  switch (provider) {
    case "GCash":
    case "Maya":
      return "e.g. 09171234567";
    case "PayPal":
      return "e.g. you@example.com";
    case "Wise":
      return "Wise email or @tag";
    default:
      return "Mobile number, email, or wallet ID";
  }
}

function PledgeQrDropzone({ file, onFile, onClear, disabled }) {
  const previewSrc = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc);
    };
  }, [previewSrc]);

  if (file && previewSrc) {
    return (
      <div className="space-y-2">
        <div className="overflow-hidden rounded-[18px] border-2 border-[var(--color-primary-600)] bg-[var(--color-primary-50)] p-1 shadow-[var(--shadow-sm)] ring-2 ring-[rgba(129,160,63,0.35)] ring-offset-2 ring-offset-[var(--surface-page)]">
          <img
            src={previewSrc}
            alt="QR preview"
            className="max-h-52 w-full rounded-[14px] object-contain"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            className="min-w-0 flex-1"
            disabled={disabled}
            onClick={() => document.getElementById("pledge-qr-input")?.click()}
          >
            Replace image
          </Button>
          <Button type="button" variant="secondary" disabled={disabled} onClick={onClear}>
            Remove
          </Button>
        </div>
        <input
          id="pledge-qr-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            e.target.value = "";
            if (f) onFile(f);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <input
        id="pledge-qr-input"
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          e.target.value = "";
          if (f) onFile(f);
        }}
      />
      <PhotoDropzoneInner
        inputId="pledge-qr-input"
        label="Upload QR (JPG or PNG)"
        onPick={(f) => f && onFile(f)}
        disabled={disabled}
      />
    </div>
  );
}

function PledgeFieldError({ message }) {
  if (!message) return null;
  return <div className="mt-1 text-xs font-medium text-[var(--danger-text)]">{message}</div>;
}

function PledgeInitiateForm({ draft, setDraft, errors, actionBusy, actionErr, onSubmit }) {
  const update = (patch) => setDraft((s) => ({ ...s, ...patch }));
  const inputClass =
    "mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]";
  const inputErrorClass = "border-[rgba(155,28,28,0.45)] focus:ring-[rgba(155,28,28,0.18)]";
  const labelClass = "block";
  const labelTitle = (text, required) => (
    <div className="text-xs font-semibold text-[var(--text-secondary)]">
      {text}
      {required ? <span className="ml-1 text-[var(--danger-text)]">*</span> : null}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="text-sm text-[var(--text-secondary)]">
        Add payout details so loved ones can chip in toward this gift.
      </div>

      <div>
        {labelTitle("Payment method", true)}
        <div className="mt-1 grid grid-cols-2 gap-2">
          {[
            { id: "ewallet", label: "E-Wallet" },
            { id: "bank", label: "Bank" },
          ].map((opt) => {
            const active = draft.paymentMethod === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => update({ paymentMethod: opt.id })}
                className={`min-h-[44px] rounded-[14px] border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] ${
                  active
                    ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-800)] shadow-[var(--shadow-xs)]"
                    : "border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:bg-[var(--surface-card-soft)]"
                }`}
                aria-pressed={active}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <PledgeFieldError message={errors.paymentMethod} />
      </div>

      {draft.paymentMethod === "ewallet" ? (
        <>
          <label className={labelClass}>
            {labelTitle("E-wallet provider", true)}
            <select
              className={`${inputClass} ${errors.ewalletProvider ? inputErrorClass : ""}`}
              value={draft.ewalletProvider}
              onChange={(e) => update({ ewalletProvider: e.target.value })}
            >
              {EWALLET_PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <PledgeFieldError message={errors.ewalletProvider} />
          </label>

          {draft.ewalletProvider === "Others" ? (
            <label className={labelClass}>
              {labelTitle("Specify provider", true)}
              <input
                className={`${inputClass} ${errors.ewalletProviderOther ? inputErrorClass : ""}`}
                value={draft.ewalletProviderOther}
                onChange={(e) => update({ ewalletProviderOther: e.target.value })}
                placeholder="e.g. ShopeePay"
              />
              <PledgeFieldError message={errors.ewalletProviderOther} />
            </label>
          ) : null}

          <label className={labelClass}>
            {labelTitle("Account name", true)}
            <input
              className={`${inputClass} ${errors.payoutName ? inputErrorClass : ""}`}
              value={draft.payoutName}
              onChange={(e) => update({ payoutName: e.target.value })}
              placeholder="Name on the account"
            />
            <PledgeFieldError message={errors.payoutName} />
          </label>

          <label className={labelClass}>
            {labelTitle("Account number", true)}
            <input
              className={`${inputClass} ${errors.payoutAccount ? inputErrorClass : ""}`}
              value={draft.payoutAccount}
              onChange={(e) => update({ payoutAccount: e.target.value })}
              placeholder={ewalletAccountPlaceholder(draft.ewalletProvider)}
              inputMode={
                draft.ewalletProvider === "GCash" || draft.ewalletProvider === "Maya"
                  ? "tel"
                  : "text"
              }
            />
            <PledgeFieldError message={errors.payoutAccount} />
          </label>
        </>
      ) : (
        <>
          <label className={labelClass}>
            {labelTitle("Bank name", true)}
            <select
              className={`${inputClass} ${errors.bankName ? inputErrorClass : ""}`}
              value={draft.bankName}
              onChange={(e) => update({ bankName: e.target.value })}
            >
              {BANK_NAMES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <PledgeFieldError message={errors.bankName} />
          </label>

          {draft.bankName === "Others" ? (
            <label className={labelClass}>
              {labelTitle("Specify bank", true)}
              <input
                className={`${inputClass} ${errors.bankNameOther ? inputErrorClass : ""}`}
                value={draft.bankNameOther}
                onChange={(e) => update({ bankNameOther: e.target.value })}
                placeholder="e.g. UnionBank"
              />
              <PledgeFieldError message={errors.bankNameOther} />
            </label>
          ) : null}

          <label className={labelClass}>
            {labelTitle("Account name", true)}
            <input
              className={`${inputClass} ${errors.payoutName ? inputErrorClass : ""}`}
              value={draft.payoutName}
              onChange={(e) => update({ payoutName: e.target.value })}
              placeholder="Name on the account"
            />
            <PledgeFieldError message={errors.payoutName} />
          </label>

          <label className={labelClass}>
            {labelTitle("Account number", true)}
            <input
              className={`${inputClass} ${errors.payoutAccount ? inputErrorClass : ""}`}
              value={draft.payoutAccount}
              onChange={(e) => update({ payoutAccount: e.target.value })}
              placeholder="Bank account number"
              inputMode="numeric"
            />
            <PledgeFieldError message={errors.payoutAccount} />
          </label>
        </>
      )}

      <label className={labelClass}>
        {labelTitle("Notes", false)}
        <textarea
          rows={3}
          className={`${inputClass} resize-none`}
          value={draft.payoutNotes}
          onChange={(e) => update({ payoutNotes: e.target.value })}
          placeholder="Anything contributors should know (optional)"
        />
      </label>

      <div>
        {labelTitle("QR code / image", false)}
        <div className="mt-2">
          <PledgeQrDropzone
            file={draft.qrFile}
            onFile={(f) => update({ qrFile: f })}
            onClear={() => update({ qrFile: null })}
            disabled={actionBusy}
          />
        </div>
      </div>

      <label className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-card-soft)] px-3 py-2.5">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-primary-600)]"
          checked={Boolean(draft.confirmed)}
          onChange={(e) => update({ confirmed: e.target.checked })}
        />
        <span className="text-xs leading-snug text-[var(--text-secondary)]">
          You are confirming that the details you've provided are correct and that you will follow the
          {" "}
          <Link
            to="/documentation/legal/terms-of-service"
            className="font-semibold text-[var(--color-primary-700)] underline underline-offset-2 decoration-[rgba(129,160,63,0.55)] hover:text-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.35)] rounded-[6px]"
            onClick={(e) => e.stopPropagation()}
          >
            Terms of use
          </Link>
          .
        </span>
      </label>
      <PledgeFieldError message={errors.confirmed} />

      {actionErr ? (
        <div className="rounded-[var(--radius-md)] border border-[rgba(155,28,28,0.25)] bg-[var(--danger-bg)] px-3 py-2 text-sm text-[var(--danger-text)]">
          {actionErr.message}
        </div>
      ) : null}

      <Button
        className="w-full"
        disabled={actionBusy || !draft.confirmed}
        onClick={onSubmit}
      >
        {actionBusy ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

export function RegistryPage() {
  const { registryId } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [successVariantKey, setSuccessVariantKey] = useState(null);
  const [endedSuccessModal, setEndedSuccessModal] = useState(null);
  const successVariant = useMemo(
    () => endedSuccessModal || resolveSuccessModalVariant(successVariantKey),
    [endedSuccessModal, successVariantKey]
  );
  const successModalOpen = Boolean(successVariant);

  const [activeItem, setActiveItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [reserveQty, setReserveQty] = useState("1");
  const [privateNote, setPrivateNote] = useState("");
  const [actionErr, setActionErr] = useState(null);
  const [actionBusy, setActionBusy] = useState(false);

  const [fabOpen, setFabOpen] = useState(false);
  const [countdownModalOpen, setCountdownModalOpen] = useState(false);
  const [shareInviteOpen, setShareInviteOpen] = useState(false);
  const [unprepareConfirmOpen, setUnprepareConfirmOpen] = useState(false);
  const [giftActionConfirm, setGiftActionConfirm] = useState(null);
  const [countdownTick, setCountdownTick] = useState(() => Date.now());
  const [draftItem, setDraftItem] = useState({
    title: "",
    category: "Dorm / Apartment",
    description: "",
    quantityNeeded: "1",
    viewerInstruction: "",
    externalLink: "",
    priceReference: "",
    attributes: {},
    considering: false,
  });
  const [draftItemPhotos, setDraftItemPhotos] = useState([]);
  const [imageLightbox, setImageLightbox] = useState(null);

  useEffect(() => {
    function closeAddItemModalFromTour() {
      setFabOpen(false);
      setDraftItemPhotos([]);
      setActionErr(null);
    }

    function closeShareInviteModalFromTour() {
      setShareInviteOpen(false);
    }

    window.addEventListener("beabr:close-add-item-modal", closeAddItemModalFromTour);
    window.addEventListener("beabr:close-share-invite-modal", closeShareInviteModalFromTour);
    return () => {
      window.removeEventListener("beabr:close-add-item-modal", closeAddItemModalFromTour);
      window.removeEventListener("beabr:close-share-invite-modal", closeShareInviteModalFromTour);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("beabr-success-modal-open", successModalOpen);
    return () => document.body.classList.remove("beabr-success-modal-open");
  }, [successModalOpen]);

  const [giftCategoryFilter, setGiftCategoryFilter] = useState("all");
  /** Viewer-only: all | reserved_mine | reserved | prepared_mine | prepared | pledge_started */
  const [giftStatusFilter, setGiftStatusFilter] = useState("all");
  /** Owner + viewer - ₱ range [min, max] vs. {@link giftPriceSliderCeiling} */
  const [giftPriceMin, setGiftPriceMin] = useState(0);
  const [giftPriceMax, setGiftPriceMax] = useState(50_000);
  const [giftFiltersPopoverOpen, setGiftFiltersPopoverOpen] = useState(false);
  const giftFiltersPopoverRef = useRef(null);

  const [pledgeView, setPledgeView] = useState(null);
  const [pledgeLoading, setPledgeLoading] = useState(false);
  const [pledgeStep, setPledgeStep] = useState(null); // "initiate" | "contribute_amount" | "contribute_details" | "done"
  /**
   * Group pledge initiation form state.
   * paymentMethod is the UI grouping ("ewallet" | "bank") which we map to the
   * server's PledgePayoutMethod enum (`gcash` | `bank` | `other`) on submit.
   */
  const [pledgeInitDraft, setPledgeInitDraft] = useState({
    paymentMethod: "ewallet",
    ewalletProvider: "GCash",
    ewalletProviderOther: "",
    bankName: "BPI",
    bankNameOther: "",
    payoutName: "",
    payoutAccount: "",
    payoutNotes: "",
    qrFile: null,
    confirmed: false,
  });
  const [pledgeFormErrors, setPledgeFormErrors] = useState({});
  const [contribAmount, setContribAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [confirmContributionSent, setConfirmContributionSent] = useState(false);
  /** Object URL for decrypted pledge QR (`/pledge/qr-image`); revoked on cleanup. */
  const [pledgeQrBlobUrl, setPledgeQrBlobUrl] = useState(null);
  const [itemSheetScrollToPledge, setItemSheetScrollToPledge] = useState(false);
  const groupPledgeSectionRef = useRef(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const d = await apiFetch(`/api/registries/${registryId}`);
      setData(d);
      if (d?.registry?.endedSuccessModal) setEndedSuccessModal(d.registry.endedSuccessModal);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registryId]);

  useEffect(() => {
    if (!activeItem?.id || !Array.isArray(data?.items)) return;
    const next = data.items.find((i) => i.id === activeItem.id);
    if (!next) return;
    setActiveItem((prev) => {
      if (!prev || prev.id !== next.id) return prev;
      return {
        ...prev,
        imageUrl: next.imageUrl,
        imageUrls: next.imageUrls,
        priceReference: next.priceReference,
        title: next.title,
        category: next.category,
        description: next.description,
        quantityNeeded: next.quantityNeeded,
        viewerInstruction: next.viewerInstruction,
        externalLink: next.externalLink,
        ownerStatus: next.ownerStatus,
        totals: next.totals,
        displayStatus: next.displayStatus,
        myReservation: next.myReservation,
        hasPledge: next.hasPledge,
        groupPledge: next.groupPledge,
        attributionVisible: next.attributionVisible,
        attribution: next.attribution,
        attributes: next.attributes,
      };
    });
  }, [data?.items, activeItem?.id]);

  useEffect(() => {
    setGiftCategoryFilter("all");
    setGiftStatusFilter("all");
    setGiftPriceMin(0);
    setGiftPriceMax(50_000);
  }, [registryId]);

  useEffect(() => {
    if (!giftFiltersPopoverOpen) return undefined;
    function onMouseDown(e) {
      const el = giftFiltersPopoverRef.current;
      if (el && !el.contains(e.target)) setGiftFiltersPopoverOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setGiftFiltersPopoverOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [giftFiltersPopoverOpen]);

  useEffect(() => {
    if (!countdownModalOpen) return undefined;
    setCountdownTick(Date.now());
    const id = setInterval(() => setCountdownTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [countdownModalOpen]);

  const registryCloseDatetime = data?.registry?.closeDatetime;
  const closeTarget = useMemo(() => {
    if (!registryCloseDatetime) return null;
    return new Date(registryCloseDatetime);
  }, [registryCloseDatetime]);

  const countdownParts = useMemo(() => {
    if (!closeTarget) return null;
    return getRemainingParts(closeTarget, countdownTick);
  }, [closeTarget, countdownTick]);

  const role = data?.registry?.role;
  const revealed = data?.registry?.revealed;
  const closed = Boolean(data?.registry?.closed);
  const canShareInvite = role === "owner" && Boolean(data?.registry?.joinCode) && !closed;

  const title = data?.registry?.title || "Registry";
  const ownerName = data?.registry?.ownerDisplayName || "";
  const messageOwnerLabel = (() => {
    const n = ownerName.trim();
    if (!n) return "Message";
    return `${n.split(/\s+/)[0]}'s message`;
  })();

  const canReserve = role === "viewer" && !closed;

  const giftCategoryOptions = useMemo(() => {
    const items = data?.items;
    if (!Array.isArray(items) || items.length === 0) return [];
    const set = new Set();
    for (const it of items) {
      if (it?.category && String(it.category).trim()) set.add(it.category);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data?.items]);

  const giftPriceSliderCeiling = useMemo(() => {
    const items = data?.items;
    if (!Array.isArray(items) || items.length === 0) return 50_000;
    let maxP = 0;
    for (const it of items) {
      const p = giftItemNumericPriceEstimate(it.priceReference);
      if (p != null && p > maxP) maxP = p;
    }
    return roundPriceSliderCeiling(maxP);
  }, [data?.items]);

  const giftPriceSliderStep = useMemo(() => {
    if (giftPriceSliderCeiling >= 50_000) return 500;
    if (giftPriceSliderCeiling >= 10_000) return 100;
    if (giftPriceSliderCeiling >= 1000) return 50;
    return 10;
  }, [giftPriceSliderCeiling]);

  useEffect(() => {
    setGiftPriceMin((m) => Math.min(Math.max(0, m), giftPriceSliderCeiling));
    setGiftPriceMax((m) => {
      const next = Math.min(Math.max(0, m), giftPriceSliderCeiling);
      return Math.max(next, 0);
    });
  }, [giftPriceSliderCeiling]);

  useEffect(() => {
    if (giftPriceMin > giftPriceMax) setGiftPriceMax(giftPriceMin);
  }, [giftPriceMin, giftPriceMax]);

  useEffect(() => {
    if (giftCategoryFilter === "all") return;
    if (!giftCategoryOptions.includes(giftCategoryFilter)) setGiftCategoryFilter("all");
  }, [giftCategoryFilter, giftCategoryOptions]);

  const displayedGiftItems = useMemo(() => {
    const items = data?.items;
    if (!Array.isArray(items) || items.length === 0) return [];
    const indexMap = new Map(items.map((it, i) => [it.id, i]));
    let list = [...items];

    if (giftCategoryFilter !== "all") {
      list = list.filter((it) => it.category === giftCategoryFilter);
    }

    const priceFilterActive = giftPriceMin > 0 || giftPriceMax < giftPriceSliderCeiling;
    if (priceFilterActive) {
      list = list.filter((it) => {
        const p = giftItemNumericPriceEstimate(it.priceReference);
        if (p == null) return false;
        return p >= giftPriceMin && p <= giftPriceMax;
      });
    }

    if (role === "viewer") {
      if (giftStatusFilter === "pledge_started") {
        list = list.filter((it) => Boolean(it.groupPledge));
      } else if (giftStatusFilter === "reserved_mine") {
        list = list.filter((it) => it.myReservation?.status === "reserved");
      } else if (giftStatusFilter === "prepared_mine") {
        list = list.filter((it) => it.myReservation?.status === "prepared");
      } else if (giftStatusFilter === "reserved") {
        list = list.filter((it) => {
          const reserved = it.totals?.reserved ?? 0;
          const mineReserved = it.myReservation?.status === "reserved" ? (it.myReservation?.quantity ?? 0) : 0;
          return reserved > mineReserved;
        });
      } else if (giftStatusFilter === "prepared") {
        list = list.filter((it) => {
          const prepared = it.totals?.prepared ?? 0;
          const minePrepared = it.myReservation?.status === "prepared" ? (it.myReservation?.quantity ?? 0) : 0;
          return prepared > minePrepared;
        });
      }
      list.sort((a, b) => {
        const aMine = a.myReservation ? 0 : 1;
        const bMine = b.myReservation ? 0 : 1;
        if (aMine !== bMine) return aMine - bMine;
        return (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0);
      });
    }

    return list;
  }, [data?.items, giftCategoryFilter, giftPriceMax, giftPriceMin, giftPriceSliderCeiling, giftStatusFilter, role]);

  const giftFiltersDirty = useMemo(() => {
    const priceDirty = giftPriceMin > 0 || giftPriceMax < giftPriceSliderCeiling;
    const catDirty = giftCategoryFilter !== "all";
    const statusDirty = role === "viewer" && giftStatusFilter !== "all";
    return Boolean(priceDirty || catDirty || statusDirty);
  }, [giftCategoryFilter, giftPriceMax, giftPriceMin, giftPriceSliderCeiling, giftStatusFilter, role]);

  /** Pooling money toward this gift only makes sense while quantity is still available to claim. */
  const canGroupPledge = useMemo(() => {
    if (!activeItem || role !== "viewer" || closed) return false;
    return (activeItem.totals?.available ?? 0) > 0;
  }, [activeItem, closed, role]);

  useEffect(() => {
    if (!canGroupPledge) setPledgeStep(null);
  }, [canGroupPledge]);

  useLayoutEffect(() => {
    if (!itemSheetScrollToPledge || !activeItem) return;
    if (role !== "viewer" || !canGroupPledge) {
      setItemSheetScrollToPledge(false);
      return;
    }
    if (pledgeLoading) return;
    const el = groupPledgeSectionRef.current;
    if (!el) {
      setItemSheetScrollToPledge(false);
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setItemSheetScrollToPledge(false);
  }, [itemSheetScrollToPledge, activeItem, role, canGroupPledge, pledgeLoading, pledgeView]);

  const itemSheetTitle = useMemo(() => {
    if (!activeItem) return "";
    return activeItem.title;
  }, [activeItem]);

  const giftActionConfirmMeta = useMemo(() => {
    if (!giftActionConfirm) return null;
    const item = giftActionConfirm.type === "prepare" ? giftActionConfirm.item : activeItem;
    const itemTitle = item?.title ? `"${item.title}"` : "this gift";
    const openCoordination = data?.registry?.visibilityMode === "open_coordination";
    const visibilityNote = openCoordination
      ? " In Open Coordination, others in this registry can see your status."
      : "";

    if (giftActionConfirm.type === "reserve") {
      const qty = parseIntegerInput(reserveQty) ?? 1;
      return {
        title: "Reserve this gift?",
        subtitle: `This will hold ${qty} of ${itemTitle} for you and let others know it is being prepared.${visibilityNote}`,
        confirmLabel: actionBusy ? "Reserving..." : "Reserve gift",
      };
    }

    return {
      title: "Mark gift as prepared?",
      subtitle: `Confirm once ${itemTitle} is bought or ready to give. Its status will change from reserved to prepared.${visibilityNote}`,
      confirmLabel: actionBusy ? "Marking..." : "Mark prepared",
    };
  }, [activeItem, actionBusy, data?.registry?.visibilityMode, giftActionConfirm, reserveQty]);

  async function reserve() {
    if (!activeItem) return;
    if (activeItem.hasPledge) {
      setActionErr({ message: "This item has an active pledge. You can contribute instead of reserving it." });
      setItemSheetScrollToPledge(true);
      return;
    }
    if ((activeItem.totals?.available ?? 0) <= 0) {
      setActionErr({ message: "This item is fully reserved." });
      return;
    }
    const qty = parseIntegerInput(reserveQty) ?? 1;
    setActionBusy(true);
    setActionErr(null);
    try {
      await apiFetch(`/api/items/${activeItem.id}/reserve`, {
        method: "POST",
        body: JSON.stringify({
          quantity: qty,
          privateNote: privateNote || null,
        }),
      });
      setActiveItem(null);
      setReserveQty("1");
      setPrivateNote("");
      await refresh();
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function loadGroupPledge(itemId) {
    setPledgeLoading(true);
    try {
      const v = await apiFetch(`/api/items/${itemId}/pledge`);
      setPledgeView(v);
    } finally {
      setPledgeLoading(false);
    }
  }

  useEffect(() => {
    if (!activeItem?.id || !pledgeView?.initiation?.hasQrImage || pledgeStep !== "contribute_details") {
      setPledgeQrBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return undefined;
    }

    let revokeUrl = null;
    let cancelled = false;

    (async () => {
      try {
        const blob = await apiFetchBlob(`/api/items/${activeItem.id}/pledge/qr-image`);
        if (cancelled) return;
        revokeUrl = URL.createObjectURL(blob);
        setPledgeQrBlobUrl(revokeUrl);
      } catch {
        if (!cancelled) {
          setPledgeQrBlobUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
          });
        }
      }
    })();

    return () => {
      cancelled = true;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [activeItem?.id, pledgeStep, pledgeView]);

  function validatePledgeInitDraft(draft) {
    const errors = {};
    if (draft.paymentMethod === "ewallet") {
      if (!draft.ewalletProvider) errors.ewalletProvider = "Choose an e-wallet provider.";
      if (draft.ewalletProvider === "Others" && !draft.ewalletProviderOther.trim()) {
        errors.ewalletProviderOther = "Specify the provider.";
      }
    } else if (draft.paymentMethod === "bank") {
      if (!draft.bankName) errors.bankName = "Choose a bank.";
      if (draft.bankName === "Others" && !draft.bankNameOther.trim()) {
        errors.bankNameOther = "Specify the bank.";
      }
    } else {
      errors.paymentMethod = "Choose a payment method.";
    }
    if (!draft.payoutName.trim()) errors.payoutName = "Account name is required.";
    if (!draft.payoutAccount.trim()) {
      errors.payoutAccount =
        draft.paymentMethod === "ewallet"
          ? "Mobile number, email, or wallet ID is required."
          : "Account number is required.";
    }
    if (!draft.confirmed) {
      errors.confirmed = "Please confirm the details before saving.";
    }
    return errors;
  }

  function resolvePledgePayoutPayload(draft) {
    if (draft.paymentMethod === "bank") {
      const bank = draft.bankName === "Others" ? draft.bankNameOther.trim() : draft.bankName;
      return { payoutMethod: "bank", payoutInstitution: bank };
    }
    const provider =
      draft.ewalletProvider === "Others"
        ? draft.ewalletProviderOther.trim()
        : draft.ewalletProvider;
    return {
      payoutMethod: draft.ewalletProvider === "GCash" ? "gcash" : "other",
      payoutInstitution: provider,
    };
  }

  async function initiateGroupPledge() {
    if (!activeItem) return;
    const errors = validatePledgeInitDraft(pledgeInitDraft);
    setPledgeFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setActionBusy(true);
    setActionErr(null);
    try {
      const { payoutMethod, payoutInstitution } = resolvePledgePayoutPayload(pledgeInitDraft);
      const fd = new FormData();
      fd.set("payoutMethod", payoutMethod);
      fd.set("payoutName", pledgeInitDraft.payoutName.trim());
      fd.set("payoutAccount", pledgeInitDraft.payoutAccount.trim());
      fd.set("payoutInstitution", payoutInstitution || "");
      fd.set("payoutNotes", pledgeInitDraft.payoutNotes.trim());
      if (pledgeInitDraft.qrFile) {
        fd.set("qr", pledgeInitDraft.qrFile);
      }

      await apiFetchForm(`/api/items/${activeItem.id}/pledge/initiate`, fd, {
        method: "POST",
      });

      setPledgeStep(null);
      setPledgeFormErrors({});
      await loadGroupPledge(activeItem.id);
      setSuccessVariantKey("pledge_initiated");
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function startContribution() {
    if (!activeItem) return;
    const targetRaw =
      activeItem?.priceReference != null && String(activeItem.priceReference).trim() !== ""
        ? String(activeItem.priceReference)
        : pledgeView?.item?.priceReference != null && String(pledgeView.item.priceReference).trim() !== ""
          ? String(pledgeView.item.priceReference)
          : "";
    const maxAmount = Number(targetRaw.replace(/[^\d]/g, ""));
    const amount = Number(String(contribAmount || "").replace(/[^\d]/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) return;
    if (Number.isFinite(maxAmount) && maxAmount > 0 && amount > maxAmount) {
      setActionErr({ message: `Amount can't exceed ₱${maxAmount.toLocaleString()}.` });
      return;
    }
    // Do not create a DB record yet. Only persist once receipt upload succeeds.
    setPledgeStep("contribute_details");
  }

  async function uploadContributionReceipt() {
    if (!activeItem) return;
    if (!receiptFile) return;
    setActionBusy(true);
    setActionErr(null);
    try {
      const fd = new FormData();
      fd.set("receipt", receiptFile);
      fd.set("amount", String(parseIntegerInput(contribAmount) ?? ""));
      await apiFetchForm(`/api/items/${activeItem.id}/pledge/contribute-with-receipt`, fd, { method: "POST" });
      setPledgeStep(null);
      setReceiptFile(null);
      setContribAmount("");
      setConfirmContributionSent(false);
      setPledgeFormErrors({});
      if (activeItem) await loadGroupPledge(activeItem.id);
      setSuccessVariantKey("pledge_contributed");
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function createItem() {
    const title = draftItem.title.trim();
    if (!title) {
      setActionErr(
        new Error("Add a short gift name so loved ones know what this is.")
      );
      return;
    }
    setActionBusy(true);
    setActionErr(null);
    try {
      const externalLink = parseOptionalItemUrl(draftItem.externalLink);
      const created = await apiFetch(`/api/registries/${registryId}/items`, {
        method: "POST",
        body: JSON.stringify({
          title,
          category: draftItem.category,
          description: draftItem.description || null,
          quantityNeeded: parseIntegerInput(draftItem.quantityNeeded) || 1,
          viewerInstruction: draftItem.viewerInstruction || null,
          externalLink,
          storeName: null,
          priceReference: parsePriceReferenceInput(draftItem.priceReference),
          ownerStatus: draftItem.considering ? "considering" : "confirmed",
          attributes: Object.entries(draftItem.attributes || {})
            .filter(([, v]) => typeof v === "string" && v.trim().length > 0)
            .map(([key, value]) => ({ key, value })),
        }),
      });

      if (created?.item?.id && draftItemPhotos.length > 0) {
        for (const photo of draftItemPhotos) {
          const fd = new FormData();
          fd.set("image", photo);
          await apiFetchForm(`/api/items/${created.item.id}/photo`, fd, { method: "POST" });
        }
      }

      setFabOpen(false);
      setDraftItem({
        title: "",
        category: "Dorm / Apartment",
        description: "",
        quantityNeeded: 1,
        viewerInstruction: "",
        externalLink: "",
        priceReference: "",
        attributes: {},
        considering: false,
      });
      setDraftItemPhotos([]);
      await refresh();
      if (created?.item?.id) {
        document.body.classList.add("beabr-success-modal-open");
        setSuccessVariantKey("item_added");
      }
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function cancelReservation() {
    if (!activeItem?.myReservation?.id) return;
    setActionBusy(true);
    setActionErr(null);
    try {
      await apiFetch(`/api/reservations/${activeItem.myReservation.id}/cancel`, { method: "POST" });
      setActiveItem(null);
      await refresh();
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function unprepareReservation() {
    if (!activeItem?.myReservation?.id) return;
    setActionBusy(true);
    setActionErr(null);
    try {
      await apiFetch(`/api/reservations/${activeItem.myReservation.id}/unprepare`, { method: "POST" });
      setUnprepareConfirmOpen(false);
      setActiveItem(null);
      await refresh();
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function saveItemEdits() {
    if (!editItem?.id) return;
    setActionBusy(true);
    setActionErr(null);
    try {
      const externalLink = parseOptionalItemUrl(editItem.externalLink);
      await apiFetch(`/api/items/${editItem.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editItem.title,
          category: editItem.category,
          quantityNeeded: parseIntegerInput(editItem.quantityNeeded) || 1,
          viewerInstruction: editItem.viewerInstruction || null,
          description: editItem.description || null,
          externalLink,
          storeName: null,
          priceReference: parsePriceReferenceInput(editItem.priceReference),
          ownerStatus: editItem.considering ? "considering" : "confirmed",
        }),
      });

      setActiveItem(null);
      setEditItem(null);
      await refresh();
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function archiveActiveItem() {
    if (!activeItem?.id) return;
    setActionBusy(true);
    setActionErr(null);
    try {
      await apiFetch(`/api/items/${activeItem.id}`, { method: "DELETE" });
      setActiveItem(null);
      setEditItem(null);
      await refresh();
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function openGiftItemSheet(item, options = {}) {
    setItemSheetScrollToPledge(Boolean(options.scrollToPledge));
    setActiveItem(item);
    setEditItem(
      role === "owner"
        ? {
            id: item.id,
            title: item.title,
            category: item.category,
            description: item.description || "",
            quantityNeeded: formatIntegerInput(String(item.quantityNeeded ?? 1)),
            viewerInstruction: item.viewerInstruction || "",
            externalLink: item.externalLink || "",
            priceReference:
              item.priceReference != null && item.priceReference !== ""
                ? String(item.priceReference)
                : "",
            considering: item.ownerStatus === "considering",
          }
        : null
    );
    setReserveQty("1");
    setPrivateNote("");
    setActionErr(null);
    setPledgeView(null);
    setPledgeStep(null);
    setContribAmount("");
    setReceiptFile(null);
    if (role === "viewer") {
      try {
        await loadGroupPledge(item.id);
      } catch {
        // ignore; user may retry via pledge actions
      }
    }
  }

  async function markPreparedQuick(item) {
    if (!item?.myReservation?.id) return;
    setActionBusy(true);
    setActionErr(null);
    try {
      await apiFetch(`/api/reservations/${item.myReservation.id}/prepare`, { method: "POST" });
      await refresh();
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  function requestReserveConfirmation() {
    if (!activeItem) return;
    setActionErr(null);
    setGiftActionConfirm({ type: "reserve" });
  }

  function requestPrepareConfirmation(item) {
    if (!item?.myReservation?.id) return;
    setActionErr(null);
    setGiftActionConfirm({ type: "prepare", item });
  }

  async function confirmGiftAction() {
    if (!giftActionConfirm) return;
    if (giftActionConfirm.type === "reserve") {
      await reserve();
    } else {
      await markPreparedQuick(giftActionConfirm.item);
    }
    setGiftActionConfirm(null);
  }

  async function addOwnerItemPhotoFromFile(file) {
    if (!activeItem?.id || !file) return;
    if (itemGalleryUrls(activeItem).length >= MAX_ITEM_PHOTOS) {
      setActionErr(new Error(`You can add at most ${MAX_ITEM_PHOTOS} photos per item.`));
      return;
    }
    setActionBusy(true);
    setActionErr(null);
    try {
      const fd = new FormData();
      fd.set("image", file);
      await apiFetchForm(`/api/items/${activeItem.id}/photo`, fd, { method: "POST" });
      await refresh();
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function removeOwnerItemPhotoAt(index) {
    if (!activeItem?.id) return;
    setActionBusy(true);
    setActionErr(null);
    try {
      await apiFetch(`/api/items/${activeItem.id}/photos/${index}`, { method: "DELETE" });
      await refresh();
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function reorderOwnerItemPhoto(fromIndex, direction) {
    if (!activeItem?.id) return;
    const urls = itemGalleryUrls(activeItem);
    const n = urls.length;
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= n || n < 2) return;
    const i = Math.min(fromIndex, toIndex);
    const order = Array.from({ length: n }, (_, k) => k);
    order[i] = i + 1;
    order[i + 1] = i;
    setActionBusy(true);
    setActionErr(null);
    try {
      await apiFetch(`/api/items/${activeItem.id}`, {
        method: "PATCH",
        body: JSON.stringify({ imageOrder: order }),
      });
      await refresh();
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  const sheetGalleryUrls = activeItem ? itemGalleryUrls(activeItem) : [];
  const itemSheetCategoryTrimmed = activeItem ? String(activeItem.category ?? "").trim() : "";
  const itemSheetDetailRows = useMemo(() => {
    if (!activeItem) return [];
    return giftItemSheetDetailRows(activeItem, role !== "owner");
  }, [activeItem, role]);

  if (loading) return <RegistryScreenSkeleton />;
  if (err) {
    const message = String(err.message || "");
    const isNotMember =
      err.status === 403 ||
      /not\s+a\s+member/i.test(message) ||
      /not\s+authorized/i.test(message) ||
      /forbidden/i.test(message);

    if (isNotMember) {
      return (
        <div className="px-5 py-12 sm:px-6">
          <div className="mx-auto flex w-full max-w-[560px] flex-col items-center text-center">
            <div className="relative w-full overflow-hidden rounded-[24px] border border-[var(--border-subtle)] bg-white px-6 py-8 shadow-[var(--shadow-sm)] sm:px-10 sm:py-10">
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(520px 320px at 18% 22%, rgba(129,160,63,0.12), transparent 58%), radial-gradient(560px 340px at 82% 28%, rgba(139,94,60,0.08), transparent 60%)",
                }}
              />
              <img
                src={sweatingImg}
                alt=""
                aria-hidden="true"
                className="relative mx-auto h-[160px] w-auto select-none sm:h-[190px]"
                decoding="async"
              />
              <h1 className="relative mt-5 text-[22px] font-bold tracking-tight text-[var(--text-primary)] sm:text-[26px]">
                You're not in this registry
              </h1>
              <p className="relative mt-2 max-w-[52ch] text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
                This registry is only available to people who were invited. If you think this is a mistake, ask the owner
                for a fresh invite link or join code.
              </p>
              <div className="relative mt-6 flex w-full justify-center">
                <Link to="/dashboard" className="inline-flex">
                  <Button className="min-h-[44px] px-6 py-3">Go back to home</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <div className="py-10 text-center text-sm text-[var(--danger-text)]">{message}</div>;
  }
  if (!data) return null;

  const categoryFields = (() => {
    const c = draftItem.category;
    if (c === "Tech") return ["brand", "model", "compatibility"];
    if (c === "Clothing") return ["size", "color", "brand"];
    if (c === "Dorm / Apartment") return ["size", "color", "brand", "dimensions", "material"];
    if (c === "Appliance") return ["brand", "model", "dimensions", "wattage"];
    if (c === "Accessories") return ["color", "brand"];
    if (c === "School / Work Supplies") return ["brand", "model"];
    if (c === "Self-Care") return ["brand", "scent"];
    if (c === "Food / Groceries") return ["brand", "flavor"];
    if (c === "Experience") return ["preferred_date", "location"];
    if (c === "Custom") return ["note"];
    return [];
  })();

  const suggestContribPlaceholder =
    activeItem?.priceReference != null && String(activeItem.priceReference).trim() !== ""
      ? String(activeItem.priceReference)
      : pledgeView?.item?.priceReference != null && String(pledgeView.item.priceReference).trim() !== ""
        ? String(pledgeView.item.priceReference)
        : "9995";

  const formattedContribPlaceholder = (() => {
    const n = Number(String(suggestContribPlaceholder).replace(/[^\d]/g, ""));
    if (!Number.isFinite(n) || n <= 0) return "₱9,995";
    return `₱${n.toLocaleString()}`;
  })();

  return (
    <div className="space-y-6">
      <Card className="relative overflow-visible p-0 shadow-[var(--shadow-md)]">
        <div className="overflow-hidden rounded-[24px]">
        <div className="border-b border-[rgba(255,255,255,0.18)] bg-[linear-gradient(135deg,var(--color-primary-800)_0%,var(--color-primary-700)_38%,var(--color-primary-600)_72%,var(--color-primary-500)_100%)] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              {role === "owner" ? (
                <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[var(--color-primary-100)] px-2.5 py-0.5 text-[10px] font-semibold leading-tight text-[var(--color-primary-800)] shadow-[var(--shadow-xs)] ring-1 ring-[rgba(129,160,63,0.3)] sm:text-[11px]">
                  <IconEye className="h-3 w-3 shrink-0 text-[var(--color-primary-700)] sm:h-3.5 sm:w-3.5" aria-hidden />
                  You own this registry
                </div>
              ) : (
                <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-xs)] ring-1 ring-[rgba(255,255,255,0.35)]">
                  <IconUsers className="h-4 w-4 shrink-0 text-[var(--color-primary-600)]" aria-hidden />
                  <span className="text-[var(--text-primary)]">You are a participant</span>
                </div>
              )}
              <h1 className="mt-3 truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {title}
              </h1>
            </div>
            <div className="flex w-full min-w-0 flex-shrink-0 flex-row flex-nowrap gap-1 sm:gap-2 md:w-auto md:justify-end">
              {role === "owner" && !closed ? (
                <Button
                  data-tour-id="registry-add-item"
                  variant="secondary"
                  className="min-h-[44px] min-w-0 flex-1 gap-1 border-white/35 bg-white/15 px-2.5 py-2 text-xs font-semibold text-white backdrop-blur-[2px] hover:bg-white/25 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm md:flex-initial md:w-auto [&_svg]:text-white [&_span]:text-white"
                  onClick={() => {
                    setFabOpen(true);
                    setActionErr(null);
                  }}
                >
                  <span className="text-base font-light leading-none sm:text-lg" aria-hidden>
                    +
                  </span>
                  <span>
                    <span className="sm:hidden">Add</span>
                    <span className="hidden sm:inline">Add Item</span>
                  </span>
                </Button>
              ) : null}
              {closed ? (
                <div className="inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center gap-1 rounded-full border border-white/35 bg-white/15 px-2.5 py-2 text-xs font-semibold text-white backdrop-blur-[2px] sm:gap-2 sm:px-4 sm:py-3 sm:text-sm md:flex-initial md:w-auto">
                  <IconCheckCircle className="h-3.5 w-3.5 shrink-0 text-white sm:h-4 sm:w-4" aria-hidden />
                  <span>This registry is now closed</span>
                </div>
              ) : revealed ? (
                <Link
                  to={`/registry/${registryId}/reveal`}
                  className="inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center gap-1 rounded-full border border-white/35 bg-white/15 px-2.5 py-2 text-xs font-semibold text-white backdrop-blur-[2px] transition active:scale-[0.99] hover:bg-white/25 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm md:flex-initial md:w-auto [&_svg]:text-white"
                >
                  <IconEye className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                  <span>
                    <span className="sm:hidden">Reveal</span>
                    <span className="hidden sm:inline">View reveal</span>
                  </span>
                </Link>
              ) : data.registry.visibilityMode === "open_coordination" ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-[44px] min-w-0 flex-1 gap-1 border-white/35 bg-white/15 px-2.5 py-2 text-xs font-semibold text-white backdrop-blur-[2px] hover:bg-white/25 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm md:flex-initial md:w-auto [&_svg]:text-white"
                  onClick={() => {
                    setCountdownTick(Date.now());
                    setCountdownModalOpen(true);
                  }}
                >
                  <IconTimer className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                  <span>
                    <span className="sm:hidden">Countdown</span>
                    <span className="hidden sm:inline">View Countdown</span>
                  </span>
                </Button>
              ) : null}
              {role === "owner" ? (
                <Link
                  to={`/registry/${registryId}/edit`}
                  className="inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center gap-1 rounded-full border border-white/35 bg-white/15 px-2.5 py-2 text-xs font-semibold text-white backdrop-blur-[2px] transition active:scale-[0.99] hover:bg-white/25 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm md:flex-initial md:w-auto [&_svg]:text-white"
                >
                  <IconPencil className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                  <span>
                    <span className="sm:hidden">Edit</span>
                    <span className="hidden sm:inline">Edit details</span>
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          {data.registry.message || canShareInvite ? (
            <div
              className={`flex flex-col gap-3 ${
                canShareInvite
                  ? "sm:flex-row sm:items-start sm:justify-between"
                  : ""
              }`}
            >
              <div
                className={`max-w-prose min-w-0 ${canShareInvite ? "flex-1" : ""}`}
              >
                {data.registry.message ? (
                  <>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      {messageOwnerLabel}:
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {data.registry.message}
                    </p>
                  </>
                ) : null}
              </div>
              {canShareInvite ? (
                <Button
                  data-tour-id="registry-share"
                  type="button"
                  variant="secondary"
                  className="w-full shrink-0 gap-2 sm:w-auto sm:self-start"
                  onClick={() => setShareInviteOpen(true)}
                >
                  <IconShare className="h-4 w-4 shrink-0" aria-hidden />
                  Share
                </Button>
              ) : null}
            </div>
          ) : null}

          <div
            className={`grid gap-3 ${data.registry.eventDate ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
          >
            {data.registry.eventDate ? (
              <div className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                  <IconCalendar className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    {data.registry.eventCategory || "Event"}
                  </div>
                  <div className="mt-0.5 text-base font-semibold text-[var(--text-primary)]">
                    {formatScheduleDate(data.registry.eventDate)}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                <IconListStack className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Items in registry
                </div>
                <div className="mt-0.5 text-base font-semibold tabular-nums text-[var(--text-primary)]">
                  {data.items.length}
                </div>
              </div>
            </div>

            <div className="flex gap-3 rounded-[var(--radius-lg)] border border-[rgba(139,94,60,0.22)] bg-[var(--color-beaver-50)] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-beaver-100)] text-[var(--color-beaver-700)]">
                <IconClock className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-beaver-800)]">
                  {closed ? "This registry is now closed" : "Registry closes at"}
                </div>
                <div className="mt-0.5 text-base font-semibold text-[var(--text-primary)]">
                  {formatScheduleDate(data.registry.closeDatetime)}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <IconClock className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
                  <span className="tabular-nums">{formatScheduleTime(data.registry.closeDatetime)}</span>
                  <span className="text-xs text-[var(--text-muted)]">Local Time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {role !== "owner" ? (
          <img
            src={peekRightImg}
            alt=""
            className="pointer-events-none absolute right-[-6px] top-4 z-30 h-[118px] w-auto max-w-[min(40vw,195px)] translate-y-[60px] select-none sm:top-5 sm:h-[132px] md:top-6 md:h-[148px]"
            decoding="async"
          />
        ) : null}
      </Card>

      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-3">
          {actionErr ? (
            <div
              role="alert"
              className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[rgba(155,28,28,0.25)] bg-[var(--danger-bg)] px-3 py-2 text-sm text-[var(--danger-text)]"
            >
              <span className="min-w-0">{actionErr.message}</span>
              <button
                type="button"
                className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-[var(--danger-text)] underline underline-offset-2"
                onClick={() => setActionErr(null)}
              >
                Dismiss
              </button>
            </div>
          ) : null}

          <div className="flex w-full min-w-0 items-center justify-between gap-3">
            <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                <IconGift className="h-4 w-4" aria-hidden />
              </span>
              Gifts
            </div>
            <div
              ref={giftFiltersPopoverRef}
              className="relative flex min-w-0 shrink-0 items-center justify-end sm:justify-end"
            >
              <button
                type="button"
                className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-md)] border shadow-[var(--shadow-xs)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] ${
                  giftFiltersPopoverOpen
                    ? "border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-800)]"
                    : "border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--color-primary-700)] hover:bg-[var(--surface-card-soft)]"
                }`}
                aria-label="Filter gifts"
                aria-expanded={giftFiltersPopoverOpen}
                aria-haspopup="dialog"
                onClick={() => setGiftFiltersPopoverOpen((o) => !o)}
              >
                <IconFunnel className="h-5 w-5" aria-hidden />
                {giftFiltersDirty ? (
                  <span
                    className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--color-primary-500)] ring-2 ring-[var(--surface-card)]"
                    aria-hidden
                  />
                ) : null}
              </button>
              {giftFiltersPopoverOpen ? (
                <div
                  className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-[min(calc(100vw-2.5rem),20rem)] space-y-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-card)] p-4 shadow-[var(--shadow-lg)] ring-1 ring-[var(--border-subtle)]"
                  role="dialog"
                  aria-label="Gift filters"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Filters
                  </div>
                  {role === "viewer" ? (
                    <label className="block">
                      <div className="text-xs font-semibold text-[var(--text-secondary)]">Status</div>
                      <select
                        className="mt-1 min-h-[44px] w-full cursor-pointer rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.18)]"
                        value={giftStatusFilter}
                        onChange={(e) => setGiftStatusFilter(e.target.value)}
                      >
                        <option value="all">All statuses</option>
                        <option value="reserved_mine">Reserved by me</option>
                        <option value="reserved">Reserved</option>
                        <option value="prepared_mine">Prepared by me</option>
                        <option value="prepared">Prepared</option>
                        <option value="pledge_started">Pledge started</option>
                      </select>
                    </label>
                  ) : null}
                  <label className="block">
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">Category</div>
                    <select
                      className="mt-1 min-h-[44px] w-full cursor-pointer rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.18)]"
                      aria-label="Filter gifts by category"
                      value={giftCategoryFilter}
                      onChange={(e) => setGiftCategoryFilter(e.target.value)}
                    >
                      <option value="all">All categories</option>
                      {giftCategoryOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="block">
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">Price estimate (PHP)</div>
                    <div className="mt-2 flex items-center justify-between gap-2 text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                      <span>{formatPesoDots(giftPriceMin, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                      <span className="text-xs font-normal text-[var(--text-muted)]">to</span>
                      <span>{formatPesoDots(giftPriceMax, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="mt-3 space-y-4">
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-medium text-[var(--text-muted)]">Minimum</span>
                        <input
                          type="range"
                          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-primary-100)] accent-[var(--color-primary-600)]"
                          min={0}
                          max={giftPriceSliderCeiling}
                          step={giftPriceSliderStep}
                          value={giftPriceMin}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            setGiftPriceMin(v);
                            if (v > giftPriceMax) setGiftPriceMax(v);
                          }}
                          aria-label="Minimum price estimate in Philippine pesos"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-medium text-[var(--text-muted)]">Maximum</span>
                        <input
                          type="range"
                          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-primary-100)] accent-[var(--color-primary-600)]"
                          min={0}
                          max={giftPriceSliderCeiling}
                          step={giftPriceSliderStep}
                          value={giftPriceMax}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            setGiftPriceMax(v);
                            if (v < giftPriceMin) setGiftPriceMin(v);
                          }}
                          aria-label="Maximum price estimate in Philippine pesos"
                        />
                      </label>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full min-h-[44px]"
                    onClick={() => {
                      setGiftCategoryFilter("all");
                      setGiftStatusFilter("all");
                      setGiftPriceMin(0);
                      setGiftPriceMax(giftPriceSliderCeiling);
                      setGiftFiltersPopoverOpen(false);
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
          {data.items.length === 0 ? (
            <Card className="border border-dashed border-[var(--color-primary-300)] bg-[var(--color-primary-50)]/70 p-5 shadow-[var(--shadow-xs)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-white shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]">
                    <IconGift className="h-5 w-5 text-[var(--color-primary-600)]" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[var(--text-primary)]">No gifts yet</div>
                    <div className="mt-1 text-sm text-[var(--text-secondary)]">
                      {role === "owner"
                        ? "Add a gift idea so loved ones know what would be meaningful."
                        : "This registry doesn't have any visible items yet."}
                    </div>
                  </div>
                </div>
                {role === "owner" && !closed ? (
                  <Button
                    data-tour-id="registry-add-item"
                    className="w-full shrink-0 sm:w-auto"
                    onClick={() => {
                      setFabOpen(true);
                      setActionErr(null);
                    }}
                  >
                    <span className="mr-1.5 text-lg font-light leading-none" aria-hidden>
                      +
                    </span>
                    Add Item
                  </Button>
                ) : null}
              </div>
            </Card>
          ) : displayedGiftItems.length === 0 ? (
            <Card className="border border-dashed border-[var(--border-default)] bg-[var(--surface-card-soft)] p-5 shadow-[var(--shadow-xs)] sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">No gifts match these filters</div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">
                    {role === "viewer"
                      ? "Try a different category, price estimate, or reservation filter, or clear filters to see everything again."
                      : "Try a different category or price estimate, or clear filters to see everything again."}
                  </div>
                </div>
                <button
                  type="button"
                  className="min-h-[44px] shrink-0 rounded-[var(--radius-pill)] border border-[var(--border-default)] bg-white px-4 text-sm font-semibold text-[var(--color-primary-800)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-primary-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
                  onClick={() => {
                    setGiftCategoryFilter("all");
                    setGiftStatusFilter("all");
                    setGiftPriceMin(0);
                    setGiftPriceMax(giftPriceSliderCeiling);
                  }}
                >
                  Clear filters
                </button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {displayedGiftItems.map((item) => {
                const avail = item.totals?.available ?? 0;
                const showViewDetailsBtn =
                  canReserve &&
                  (item.myReservation?.status === "prepared" || (avail === 0 && !item.myReservation));
                const attrRows = giftItemAttributeRows(item);
                const categoryTrimmed = String(item.category ?? "").trim();
                const itemDetailPillClass =
                  "inline-flex max-w-full items-center rounded-full bg-[var(--color-primary-100)] px-3 py-1.5 text-xs font-medium leading-snug text-[var(--color-primary-800)] ring-1 ring-[rgba(129,160,63,0.22)]";
                const showItemDetailPills = Boolean(categoryTrimmed) || attrRows.length > 0;
                const cardPreviewImage = itemGalleryUrls(item)[0] ?? null;
                const itemActionsDisabled = closed;
                const showExternal = Boolean(item.externalLink) && !itemActionsDisabled;
                const showOwnerEdit = role === "owner" && !itemActionsDisabled;
                const ownerCoordinationStatus = showOwnerEdit
                  ? giftItemOpenCoordinationStatusMeta(item)
                  : null;
                const showMarkPrepared = canReserve && item.myReservation?.status === "reserved";
                const showReserve = canReserve && !item.myReservation && avail > 0 && !item.groupPledge;
                const showViewDetails = canReserve && showViewDetailsBtn;
                const viewerReserveWithExternal =
                  role !== "owner" && Boolean(showExternal && showReserve);
                const showPledgeQuickAction = canReserve && Boolean(item.groupPledge);
                const reservedWithExternalPrimary = Boolean(showMarkPrepared && showExternal && !viewerReserveWithExternal);
                const preparedWithExternalDetails = Boolean(
                  canReserve && item.myReservation?.status === "prepared" && showExternal && !viewerReserveWithExternal,
                );
                const viewDetailsWithExternal = Boolean(
                  showExternal && showViewDetails && !viewerReserveWithExternal && !preparedWithExternalDetails,
                );
                const footerActionCount =
                  (showExternal ? 1 : 0) +
                  (showOwnerEdit ? 1 : 0) +
                  (showMarkPrepared ? 1 : 0) +
                  (showReserve ? 1 : 0) +
                  (showViewDetails ? 1 : 0) +
                  (showPledgeQuickAction ? 1 : 0);
                const footerOneAction = footerActionCount === 1;
                const ownerEditWithLink = showOwnerEdit && showExternal;
                const footerBtnClass = footerOneAction
                  ? "min-h-[44px] w-full justify-center"
                  : "min-h-[44px] flex-1 justify-center sm:flex-initial";
                const ownerEditBtnClass =
                  footerOneAction
                    ? "min-h-[44px] w-full justify-center"
                    : ownerEditWithLink
                      ? "min-h-[44px] min-w-0 flex-[3] basis-0 justify-center"
                      : footerBtnClass;
                const reserveThenLinkBtnClass =
                  "min-h-[44px] min-w-0 flex-[3] basis-0 justify-center";
                const openLinkAfterReserveClass =
                  "min-h-[44px] min-w-0 flex-[2] basis-0 justify-center gap-1.5";
                const pledgeBesideReserveRowClass =
                  "min-h-[44px] min-w-0 flex-[2] basis-0 justify-center";
                const markPreparedPrimaryClass =
                  "min-h-[44px] min-w-0 flex-[3] basis-0 justify-center";
                const openLinkSecondaryClass =
                  "min-h-[44px] min-w-0 flex-[2] basis-0 justify-center gap-1.5";
                const viewDetailsPrimaryClass =
                  "min-h-[44px] min-w-0 flex-[3] basis-0 justify-center";
                const openLinkFlexClass = footerOneAction
                  ? "w-full justify-center"
                  : ownerEditWithLink
                    ? "min-w-0 flex-[2] basis-0 justify-center"
                    : viewerReserveWithExternal
                      ? openLinkAfterReserveClass
                      : "flex-1 justify-center sm:flex-initial";
                return (
                  <Card
                    key={item.id}
                    className="flex h-full flex-col overflow-hidden p-0 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)] transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-md)] hover:ring-2 hover:ring-[var(--color-primary-500)] focus-within:ring-2 focus-within:ring-[var(--color-primary-500)]"
                  >
                    <button
                      type="button"
                      className="relative flex w-full min-h-0 flex-1 flex-col gap-0 p-4 text-left outline-none transition-colors hover:bg-[var(--color-primary-50)]/35 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary-500)]"
                      onClick={() => void openGiftItemSheet(item)}
                    >
                      {role === "owner" && item.ownerStatus === "considering" ? (
                        <span
                          className="absolute right-3 top-3 z-10 inline-flex w-fit shrink-0 items-center gap-1 rounded-full border border-dashed border-[rgba(139,94,60,0.30)] bg-[var(--color-beaver-50)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-beaver-700)] shadow-[var(--shadow-xs)]"
                          title="Still deciding - not finalized yet."
                        >
                          <IconLightbulb className="h-3 w-3 text-[var(--color-beaver-600)]" />
                          <span>Maybe</span>
                        </span>
                      ) : null}
                      <div className="flex gap-3 items-stretch">
                        <div className="relative w-[8.5rem] shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-neutral-100)] ring-1 ring-[var(--border-subtle)] sm:w-[9.25rem] min-h-[8.5rem] sm:min-h-[9.25rem]">
                          {cardPreviewImage ? (
                            <img
                              src={cardPreviewImage}
                              alt={item.title ? `${item.title}` : "Gift item"}
                              className="absolute inset-0 h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <IconGift className="h-11 w-11 text-[var(--color-primary-400)] sm:h-12 sm:w-12" aria-hidden />
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div
                              className={
                                role === "owner" && item.ownerStatus === "considering"
                                  ? "min-w-0 flex-1 pr-[5.75rem] sm:pr-[6rem]"
                                  : "min-w-0 flex-1"
                              }
                            >
                              <div className="line-clamp-2 text-sm font-semibold text-[var(--text-primary)]">{item.title}</div>
                            </div>
                            {role !== "owner" ? (
                              item.groupPledge?.initiator ? (
                                <StatusBadgeBy
                                  tone="success"
                                  prefix={groupPledgeStatusLabel(item.groupPledge)}
                                  prefixMobile="Pledge"
                                  byAvatarUrl={item.groupPledge.initiator.avatarUrl}
                                  byInitials={item.groupPledge.initiator.name?.trim()?.[0] || "?"}
                                  byAriaLabel="Pledge initiator"
                                />
                              ) : item.groupPledge ? (
                                <StatusBadgeBy
                                  tone="success"
                                  prefix={groupPledgeStatusLabel(item.groupPledge)}
                                  prefixMobile="Pledge"
                                  byAriaLabel={groupPledgeStatusLabel(item.groupPledge)}
                                />
                              ) : (
                                <StatusBadge
                                  status={item.displayStatus}
                                  byAvatarUrl={item.myReservation ? user?.avatarUrl || null : null}
                                  byInitials={item.myReservation ? (user?.name?.trim()?.[0] || "Y") : null}
                                  byAriaLabel={item.myReservation ? "Reserved by you" : "Reserved by someone"}
                                />
                              )
                            ) : ownerCoordinationStatus?.type === "pledge" ? (
                              <StatusBadgeBy
                                tone="success"
                                prefix={ownerCoordinationStatus.prefix}
                                prefixMobile="Pledge"
                                byAvatarUrl={ownerCoordinationStatus.person?.avatarUrl}
                                byInitials={ownerCoordinationStatus.person?.name?.trim()?.[0] || null}
                                byAriaLabel="Pledge initiator"
                              />
                            ) : ownerCoordinationStatus?.type === "reservation" ? (
                              <StatusBadge
                                status={ownerCoordinationStatus.status}
                                byAvatarUrl={ownerCoordinationStatus.person?.avatarUrl}
                                byInitials={ownerCoordinationStatus.person?.name?.trim()?.[0] || null}
                                byAriaLabel="Gift status actor"
                              />
                            ) : null}
                          </div>
                          {canReserve && item.myReservation && item.myReservation.status !== "prepared" ? (
                            <span className="inline-flex w-fit rounded-full bg-[var(--color-primary-100)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-primary-800)]">
                              {`You reserved ${item.myReservation.quantity}`}
                            </span>
                          ) : null}
                          {formatItemPriceReference(item.priceReference) ? (
                            <div className="line-clamp-1 text-[0.9375rem] font-semibold tabular-nums tracking-tight text-[var(--color-primary-900)] sm:text-base">
                              {formatItemPriceReference(item.priceReference)}
                            </div>
                          ) : null}
                          {showItemDetailPills ? (
                            <div className="mt-1 flex flex-wrap items-center gap-1.5 border-t border-[var(--border-subtle)] pt-1.5">
                              {categoryTrimmed ? (
                                <span
                                  className={`${itemDetailPillClass} font-semibold`}
                                  title={`Category: ${categoryTrimmed}`}
                                  aria-label={`Category: ${categoryTrimmed}`}
                                >
                                  <span className="truncate">{categoryTrimmed}</span>
                                </span>
                              ) : null}
                              {attrRows.map((a) => (
                                <span
                                  key={a.key}
                                  title={`${formatAttributeLabel(a.key)}: ${a.value}`}
                                  aria-label={`${formatAttributeLabel(a.key)}: ${a.value}`}
                                  className={itemDetailPillClass}
                                >
                                  <span className="truncate">{a.value}</span>
                                </span>
                              ))}
                            </div>
                          ) : null}
                          {role !== "owner" && item.groupPledge ? (
                            <div className="mt-2 min-w-0">
                              <div className="text-[11px] font-semibold leading-snug text-[var(--text-secondary)]">
                                Contributed: ₱{formatGroupPledgeCardAmount(item.groupPledge.gatheredAmount)}
                                {item.groupPledge.goalAmount != null ? (
                                  <>
                                    {" "}
                                    / ₱{formatGroupPledgeCardAmount(item.groupPledge.goalAmount)}
                                  </>
                                ) : (
                                  null
                                )}
                              </div>
                              <div
                                className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--color-neutral-200)]"
                                aria-hidden
                              >
                                <div
                                  className="h-full rounded-full bg-[var(--color-primary-500)] transition-[width] duration-300 ease-out"
                                  style={{ width: `${groupPledgeProgressPercent(item.groupPledge)}%` }}
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {item.viewerInstruction ? (
                        <div className="mt-3">
                          <div className="rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] p-2.5 ring-1 ring-[var(--border-subtle)]">
                            <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                              Notes
                            </div>
                            <div className="mt-1 line-clamp-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                              {item.viewerInstruction}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </button>
                    {footerActionCount > 0 ? (
                      <div
                        className={`flex gap-2 border-t border-[var(--border-subtle)] bg-[var(--surface-card-soft)]/90 px-4 py-3 ${footerOneAction ? "flex-col" : ownerEditWithLink || viewerReserveWithExternal ? "min-w-0 flex-row items-stretch" : "flex-wrap items-center"}`}
                      >
                      {showOwnerEdit ? (
                        <Button
                          type="button"
                          variant="secondary"
                          className={`inline-flex ${ownerEditBtnClass}`}
                          onClick={(e) => {
                            e.preventDefault();
                            void openGiftItemSheet(item);
                          }}
                        >
                          Edit item
                        </Button>
                      ) : null}
                      {viewerReserveWithExternal ? (
                        <>
                          <Button
                            type="button"
                            className={`inline-flex ${reserveThenLinkBtnClass}`}
                            onClick={(e) => {
                              e.preventDefault();
                              void openGiftItemSheet(item);
                            }}
                          >
                            <IconGift className="h-4 w-4 shrink-0" aria-hidden />
                            Reserve this gift
                          </Button>
                          {showPledgeQuickAction ? (
                            <Button
                              type="button"
                              className={`inline-flex ${pledgeBesideReserveRowClass}`}
                              onClick={(e) => {
                                e.preventDefault();
                                void openGiftItemSheet(item, { scrollToPledge: true });
                              }}
                            >
                              <IconWallet className="h-4 w-4 shrink-0" aria-hidden />
                              Contribute
                            </Button>
                          ) : null}
                          <a
                            href={item.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center rounded-full border border-[var(--border-default)] bg-white px-3 text-xs font-semibold text-[var(--color-primary-800)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-primary-50)] ${openLinkFlexClass}`}
                          >
                            <IconExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                            Open link
                          </a>
                        </>
                      ) : null}
                      {showExternal && !viewerReserveWithExternal ? (
                        <>
                          {preparedWithExternalDetails ? (
                            <>
                              <Button
                                type="button"
                                className={`inline-flex ${viewDetailsPrimaryClass}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  void openGiftItemSheet(item);
                                }}
                              >
                                <IconEye className="h-4 w-4 shrink-0" aria-hidden />
                                View details
                              </Button>
                              <a
                                href={item.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-white px-3 text-xs font-semibold text-[var(--color-primary-800)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-primary-50)] ${openLinkSecondaryClass}`}
                              >
                                <IconExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                                Open link
                              </a>
                            </>
                          ) : viewDetailsWithExternal ? (
                            <>
                              <Button
                                type="button"
                                className={`inline-flex ${viewDetailsPrimaryClass}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  void openGiftItemSheet(item);
                                }}
                              >
                                <IconEye className="h-4 w-4 shrink-0" aria-hidden />
                                View details
                              </Button>
                              <a
                                href={item.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-white px-3 text-xs font-semibold text-[var(--color-primary-800)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-primary-50)] ${openLinkSecondaryClass}`}
                              >
                                <IconExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                                Open link
                              </a>
                            </>
                          ) : reservedWithExternalPrimary ? (
                            <Button
                              type="button"
                              className={`inline-flex ${markPreparedPrimaryClass}`}
                              disabled={actionBusy}
                              onClick={(e) => {
                                e.preventDefault();
                                requestPrepareConfirmation(item);
                              }}
                            >
                              <IconSparkles className="h-4 w-4 shrink-0" aria-hidden />
                              Mark as prepared
                            </Button>
                          ) : showPledgeQuickAction ? (
                            <Button
                              type="button"
                              className={`inline-flex ${markPreparedPrimaryClass}`}
                              onClick={(e) => {
                                e.preventDefault();
                                void openGiftItemSheet(item, { scrollToPledge: true });
                              }}
                            >
                              <IconWallet className="h-4 w-4 shrink-0" aria-hidden />
                              Contribute
                            </Button>
                          ) : null}
                          {!preparedWithExternalDetails && !viewDetailsWithExternal ? (
                            <a
                              href={item.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-white px-3 text-xs font-semibold text-[var(--color-primary-800)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-primary-50)] ${
                                reservedWithExternalPrimary || showPledgeQuickAction ? openLinkSecondaryClass : openLinkFlexClass
                              }`}
                            >
                              <IconExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                              Open link
                            </a>
                          ) : null}
                        </>
                      ) : null}
                      {canReserve ? (
                        <>
                          {showMarkPrepared && !reservedWithExternalPrimary ? (
                            <Button
                              type="button"
                              className={`inline-flex ${footerBtnClass}`}
                              disabled={actionBusy}
                              onClick={(e) => {
                                e.preventDefault();
                                requestPrepareConfirmation(item);
                              }}
                            >
                              <IconSparkles className="h-4 w-4 shrink-0" aria-hidden />
                              Mark as prepared
                            </Button>
                          ) : null}
                          {showReserve && !viewerReserveWithExternal ? (
                            <Button
                              type="button"
                              className={`inline-flex ${footerBtnClass}`}
                              onClick={(e) => {
                                e.preventDefault();
                                void openGiftItemSheet(item);
                              }}
                            >
                              <IconGift className="h-4 w-4 shrink-0" aria-hidden />
                              Reserve this gift
                            </Button>
                          ) : null}
                          {showViewDetails && !preparedWithExternalDetails && !viewDetailsWithExternal ? (
                            <Button
                              type="button"
                              className={`inline-flex ${footerBtnClass}`}
                              onClick={(e) => {
                                e.preventDefault();
                                void openGiftItemSheet(item);
                              }}
                            >
                              <IconEye className="h-4 w-4 shrink-0" aria-hidden />
                              View details
                            </Button>
                          ) : null}
                          {showPledgeQuickAction && !viewerReserveWithExternal && !(showExternal && !viewerReserveWithExternal) ? (
                            <Button
                              type="button"
                              className={`inline-flex ${footerBtnClass}`}
                              onClick={(e) => {
                                e.preventDefault();
                                void openGiftItemSheet(item, { scrollToPledge: true });
                              }}
                            >
                              <IconWallet className="h-4 w-4 shrink-0" aria-hidden />
                              Contribute
                            </Button>
                          ) : null}
                        </>
                      ) : null}
                      </div>
                    ) : null}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {role === "owner" &&
      !closed &&
      !fabOpen &&
      !activeItem &&
      !countdownModalOpen &&
      !shareInviteOpen ? (
        <button
          type="button"
          aria-label="Add"
          onClick={() => {
            setFabOpen(true);
            setActionErr(null);
          }}
          className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-500)] text-white shadow-[var(--shadow-lg)] md:hidden"
        >
          <span className="text-2xl leading-none">+</span>
        </button>
      ) : null}

      <BottomSheet
        open={Boolean(activeItem)}
        title={itemSheetTitle}
        titleAccessory={
          itemSheetCategoryTrimmed ? (
            <span
              className="inline-flex max-w-[min(14rem,calc(100vw-16rem))] items-center rounded-full bg-[var(--color-primary-100)] px-3 py-1.5 text-xs font-semibold leading-snug text-[var(--color-primary-800)] ring-1 ring-[rgba(129,160,63,0.22)]"
              title={`Category: ${itemSheetCategoryTrimmed}`}
              aria-label={`Category: ${itemSheetCategoryTrimmed}`}
            >
              <span className="truncate">{itemSheetCategoryTrimmed}</span>
            </span>
          ) : null
        }
        headerBelow={
          activeItem && formatItemPriceReference(activeItem.priceReference) ? (
            <div className="text-[0.9375rem] font-semibold tabular-nums tracking-tight text-[var(--color-primary-900)] sm:text-base">
              {formatItemPriceReference(activeItem.priceReference)}
            </div>
          ) : null
        }
        variant="modal"
        onClose={() => {
          setActiveItem(null);
          setImageLightbox(null);
          setPledgeView(null);
          setPledgeStep(null);
          setReceiptFile(null);
          setContribAmount("");
          setActionErr(null);
          setItemSheetScrollToPledge(false);
        }}
      >
        {activeItem ? (
          <div className="space-y-4">
            {sheetGalleryUrls.length ? (
              <ItemSheetGalleryStrip
                urls={sheetGalleryUrls}
                title={activeItem.title}
                onPick={(urls) => setImageLightbox({ urls, title: activeItem.title })}
              />
            ) : null}

            {itemSheetDetailRows.length > 0 ? (
              <div className="space-y-2">
                {itemSheetDetailRows.map((row, i) =>
                  row.type === "attr" ? (
                    <div key={row.attr.key} className="flex items-center justify-between text-sm">
                      <div className="text-[var(--text-muted)]">{formatAttributeLabel(row.attr.key)}</div>
                      <div className="font-semibold">{row.attr.value}</div>
                    </div>
                  ) : (
                    <div key={`qty-${i}`} className="flex items-center justify-between text-sm">
                      <div className="text-[var(--text-muted)]">Quantity</div>
                      <div className="font-semibold">{row.qtyText}</div>
                    </div>
                  ),
                )}
                {activeItem.externalLink ? (
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-[var(--text-muted)]">Link</div>
                    <a
                      href={activeItem.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-0 items-center gap-1.5 font-semibold text-[var(--color-primary-800)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.45)]"
                      aria-label="Visit product site"
                    >
                      {(() => {
                        const meta = getProductSiteMeta(activeItem.externalLink);
                        if (meta?.kind === "shopee") {
                          return (
                            <>
                              <IconShopee className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" aria-hidden />
                              <span className="truncate">Visit product site</span>
                            </>
                          );
                        }
                        if (meta?.faviconUrl) {
                          return (
                            <>
                              <img
                                src={meta.faviconUrl}
                                alt=""
                                aria-hidden="true"
                                className="h-4 w-4 shrink-0 rounded-[5px]"
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                              />
                              <span className="truncate">Visit product site</span>
                            </>
                          );
                        }
                        return <span className="truncate">Visit product site</span>;
                      })()}
                      <IconExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--text-secondary)]" aria-hidden />
                    </a>
                  </div>
                ) : null}
              </div>
            ) : null}

            {activeItem.attributionVisible && activeItem.attribution ? (
              <div className="space-y-3">
                <AttributionRows title="Reserved and prepared by" rows={activeItem.attribution.reservations || []} />
                <AttributionRows
                  title="Group pledge initiated by"
                  rows={
                    activeItem.attribution.pledgeInitiator
                      ? [
                          {
                            id: `pledge-initiator-${activeItem.id}`,
                            initiator: activeItem.attribution.pledgeInitiator,
                            detail: "Started the group pledge",
                          },
                        ]
                      : []
                  }
                />
                <AttributionRows title="Pledge contributors" rows={activeItem.attribution.pledgeContributors || []} />
              </div>
            ) : null}

            {role === "owner" && editItem && !closed ? (
              <Card className="p-4">
                <div className="text-sm font-semibold">Edit item</div>
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">
                      Photos <span className="text-[var(--text-muted)]">(up to {MAX_ITEM_PHOTOS})</span>
                    </div>
                    <div className="mt-2">
                      <input
                        id={`edit-item-photo-add-${activeItem.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={actionBusy || closed}
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          e.target.value = "";
                          if (f) void addOwnerItemPhotoFromFile(f);
                        }}
                      />
                      {sheetGalleryUrls.length === 0 ? (
                        <PhotoDropzoneInner
                          compact
                          inputId={`edit-item-photo-add-${activeItem.id}`}
                          label="Add photo"
                          disabled={actionBusy || closed}
                          onPick={(f) => {
                            if (f) void addOwnerItemPhotoFromFile(f);
                          }}
                        />
                      ) : (
                        <div className="flex flex-wrap items-start gap-2">
                          {sheetGalleryUrls.map((src, idx) => (
                            <div
                              key={`${src}-${idx}`}
                              className={ITEM_GALLERY_THUMB_FRAME_CLASS}
                            >
                              <div className="group/thumbphoto relative aspect-square w-full overflow-hidden rounded-[var(--radius-md)] ring-1 ring-[var(--border-subtle)]">
                                <img
                                  src={src}
                                  alt=""
                                  className="pointer-events-none h-full w-full object-cover"
                                  loading="lazy"
                                />
                                <button
                                  type="button"
                                  disabled={actionBusy || closed}
                                  className="absolute inset-0 z-[1] rounded-[inherit] outline-none ring-inset hover:bg-transparent focus-visible:z-[2] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
                                  onClick={() =>
                                    setImageLightbox({ urls: sheetGalleryUrls, title: activeItem.title })
                                  }
                                >
                                  <span className="sr-only">View larger</span>
                                </button>
                                {/* Hover-capable browsers: darken + centered x; hidden on coarse/touch */}
                                <div
                                  className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center bg-[rgba(29,33,26,0.62)] opacity-0 transition-opacity duration-200 [@media(hover:none)]:hidden group-hover/thumbphoto:pointer-events-auto group-hover/thumbphoto:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100"
                                >
                                  <button
                                    type="button"
                                    disabled={actionBusy || closed}
                                    aria-label={`Remove photo ${idx + 1}`}
                                    className="pointer-events-auto mt-[-1px] flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--danger-bg)] text-xl font-semibold leading-none text-[var(--danger-text)] shadow-[var(--shadow-sm)] outline-none ring-2 ring-[rgba(155,28,28,0.35)] hover:bg-[rgba(253,232,232,0.92)] hover:scale-105 disabled:opacity-45 focus-visible:ring-4 focus-visible:ring-[rgba(155,28,28,0.38)] motion-safe:transition"
                                    title="Remove this photo"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      void removeOwnerItemPhotoAt(idx);
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                                {/* Touch-first: persistent corner remove (overlay block is hidden on hover:none) */}
                                <button
                                  type="button"
                                  disabled={actionBusy || closed}
                                  aria-label={`Remove photo ${idx + 1}`}
                                  title="Remove this photo"
                                  className="[@media(hover:hover)]:hidden absolute right-1 top-1 z-[4] flex h-9 min-h-[36px] w-9 min-w-[36px] items-center justify-center rounded-full bg-[var(--danger-bg)] text-lg font-semibold leading-none text-[var(--danger-text)] shadow-[var(--shadow-sm)] outline-none ring-2 ring-[rgba(155,28,28,0.42)] disabled:opacity-45 focus-visible:z-[6] focus-visible:ring-[3px]"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    void removeOwnerItemPhotoAt(idx);
                                  }}
                                >
                                  <span aria-hidden>×</span>
                                </button>
                              </div>
                              {sheetGalleryUrls.length > 1 ? (
                                <div className="mt-1 flex gap-1">
                                  {idx > 0 ? (
                                    <button
                                      type="button"
                                      disabled={actionBusy || closed}
                                      className="min-h-[32px] flex-1 rounded-md border border-[var(--border-default)] bg-white px-1 text-[11px] font-semibold text-[var(--text-secondary)]"
                                      onClick={() => void reorderOwnerItemPhoto(idx, -1)}
                                      aria-label="Move photo earlier"
                                    >
                                      ←
                                    </button>
                                  ) : null}
                                  {idx < sheetGalleryUrls.length - 1 ? (
                                    <button
                                      type="button"
                                      disabled={actionBusy || closed}
                                      className="min-h-[32px] flex-1 rounded-md border border-[var(--border-default)] bg-white px-1 text-[11px] font-semibold text-[var(--text-secondary)]"
                                      onClick={() => void reorderOwnerItemPhoto(idx, 1)}
                                      aria-label="Move photo later"
                                    >
                                      →
                                    </button>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          ))}
                          {sheetGalleryUrls.length < MAX_ITEM_PHOTOS ? (
                            <PhotoDropzoneInner
                              compact
                              squareThumb
                              inputId={`edit-item-photo-add-${activeItem.id}`}
                              label={`Add photo · ${sheetGalleryUrls.length}/${MAX_ITEM_PHOTOS}`}
                              disabled={actionBusy || closed}
                              onPick={(f) => {
                                if (f) void addOwnerItemPhotoFromFile(f);
                              }}
                            />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="block">
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">Gift name</div>
                    <input
                      className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                      value={editItem.title}
                      onChange={(e) => setEditItem((s) => ({ ...s, title: e.target.value }))}
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">
                      How much does it cost? <span className="text-[var(--text-muted)]">(estimate)</span>
                    </div>
                    <div className="mt-1 flex w-full min-w-0 overflow-hidden rounded-[14px] border border-[var(--border-default)] bg-white focus-within:ring-2 focus-within:ring-[rgba(129,160,63,0.18)]">
                      <span
                        className="flex shrink-0 items-center border-r border-[var(--border-default)] bg-[var(--surface-card-soft)] px-3 py-3 text-sm font-medium text-[var(--text-secondary)] select-none tabular-nums"
                        aria-hidden
                      >
                        ₱
                      </span>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm outline-none"
                        value={editItem.priceReference}
                        onChange={(e) => setEditItem((s) => ({ ...s, priceReference: e.target.value }))}
                        placeholder="e.g. 1299"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">Category</div>
                    <input
                      className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                      value={editItem.category}
                      onChange={(e) => setEditItem((s) => ({ ...s, category: e.target.value }))}
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">Link/URL to item</div>
                    <input
                      type="url"
                      inputMode="url"
                      autoComplete="url"
                      className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                      value={editItem.externalLink}
                      onChange={(e) => setEditItem((s) => ({ ...s, externalLink: e.target.value }))}
                      placeholder="https://..."
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">How many?</div>
                      <input
                        inputMode="numeric"
                        type="text"
                        min={1}
                      className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                      value={editItem.quantityNeeded}
                        onChange={(e) => setEditItem((s) => ({ ...s, quantityNeeded: formatIntegerInput(e.target.value) }))}
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">Additional Notes</div>
                    <textarea
                      rows={3}
                      className="mt-1 w-full resize-none rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                      value={editItem.viewerInstruction}
                      onChange={(e) => setEditItem((s) => ({ ...s, viewerInstruction: e.target.value }))}
                    />
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] p-3 text-left">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border-default)] text-[var(--color-primary-600)] focus:ring-[rgba(129,160,63,0.35)]"
                      checked={Boolean(editItem.considering)}
                      onChange={(e) => setEditItem((s) => ({ ...s, considering: e.target.checked }))}
                    />
                    <span className="text-sm text-[var(--text-secondary)]">
                      Keep this as a maybe gift idea.
                    </span>
                  </label>
                  {actionErr ? <div className="text-sm text-[var(--danger-text)]">{actionErr.message}</div> : null}
                  {closed ? (
                    <div className="rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] px-3 py-2 text-center text-xs leading-relaxed text-[var(--text-muted)] ring-1 ring-[var(--border-subtle)]">
                      This registry is closed. Gift items can no longer be changed.
                    </div>
                  ) : null}
                  <Button className="w-full" onClick={saveItemEdits} disabled={actionBusy || closed}>
                    Save
                  </Button>
                  {(activeItem.totals?.claimed ?? 0) === 0 && !activeItem.hasPledge ? (
                    <Button className="w-full" variant="danger" onClick={archiveActiveItem} disabled={actionBusy || closed}>
                      Archive gift
                    </Button>
                  ) : (
                    <div className="rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] px-3 py-2 text-center text-xs leading-relaxed text-[var(--text-muted)] ring-1 ring-[var(--border-subtle)]">
                      This item has been {archiveBlockedStatusLabel(activeItem)}, so you can't archive it.
                    </div>
                  )}
                </div>
              </Card>
            ) : null}

            {canReserve ? (
              <div className="space-y-3">
                {activeItem.myReservation ? (
                  <Card className="p-4">
                    <div
                      className="rounded-[var(--radius-lg)] border border-[rgba(129,160,63,0.22)] bg-[radial-gradient(120%_120%_at_50%_0%,rgba(129,160,63,0.14)_0%,rgba(255,255,255,0)_62%)] px-3 py-3 text-center text-sm font-semibold text-[var(--text-primary)]"
                      style={{
                        backgroundImage:
                          "radial-gradient(120% 120% at 50% 0%, rgba(129,160,63,0.14) 0%, rgba(255,255,255,0) 62%), radial-gradient(circle, rgba(129,160,63,0.14) 1px, transparent 1.6px)",
                        backgroundSize: "auto, 16px 16px",
                        backgroundPosition: "center, center",
                      }}
                    >
                      You {formatStatusLabel(activeItem.myReservation.status).toLowerCase()}{" "}
                      <span className="tabular-nums">{activeItem.myReservation.quantity}</span> of this item on{" "}
                      <span className="tabular-nums text-[var(--color-primary-600)]">
                        {formatReservationDateTime(activeItem.myReservation.createdAt)}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        className="flex-1"
                        variant="secondary"
                        onClick={() => {
                          if (activeItem.myReservation.status === "prepared") {
                            setUnprepareConfirmOpen(true);
                          } else {
                            void cancelReservation();
                          }
                        }}
                        disabled={actionBusy}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <>
                    {actionErr ? (
                      <div className="text-sm text-[var(--danger-text)]">{actionErr.message}</div>
                    ) : null}
                    {!activeItem.hasPledge && activeItem.totals?.available > 0 ? (
                      <Button className="w-full" onClick={requestReserveConfirmation} disabled={actionBusy}>
                        <IconGift className="h-4 w-4 shrink-0" aria-hidden />
                        Reserve this gift
                      </Button>
                    ) : (
                      <div className="rounded-[14px] bg-[var(--surface-card-soft)] px-3 py-3 text-center text-sm font-semibold text-[var(--text-muted)] ring-1 ring-[var(--border-subtle)]">
                        {activeItem.hasPledge
                          ? "Reservation is disabled for this item."
                          : activeItem.displayStatus === "Prepared"
                            ? "This item is fully prepared."
                            : "This item is fully reserved."}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : null}

            {role === "viewer" && canGroupPledge ? (
              <div ref={groupPledgeSectionRef} className="scroll-mt-4">
              <Card className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">Group pledge</div>
                  {activeItem?.hasPledge ? (
                    <span className="inline-flex items-center rounded-full bg-[var(--color-primary-100)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-primary-800)] ring-1 ring-[rgba(129,160,63,0.22)]">
                      {groupPledgeStatusLabel({
                        gatheredAmount: pledgeView?.gatheredAmount ?? activeItem?.groupPledge?.gatheredAmount ?? 0,
                        goalAmount: activeItem?.groupPledge?.goalAmount ?? activeItem?.priceReference ?? null,
                      })}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-[16px] bg-[var(--surface-card-soft)] p-4">
                  {!pledgeView?.initiation && !pledgeLoading ? (
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)] shadow-[var(--shadow-xs)]">
                        <IconWallet className="h-5 w-5" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <div className="text-base font-semibold leading-tight text-[var(--text-primary)]">
                          Start a group pledge
                        </div>
                        <div className="mt-1 max-w-[28rem] text-sm leading-snug text-[var(--text-secondary)]">
                          Add payout details so others can chip in toward this gift.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="text-xs font-semibold text-[var(--text-muted)]">Gathered</div>
                        <div className="mt-1 text-lg font-bold">
                          ₱{pledgeView ? formatGroupPledgeCardAmount(pledgeView.gatheredAmount) : "—"}
                          {pledgeView ? (
                            <>
                              {" "}
                              /{" "}
                              {(() => {
                                const target =
                                  activeItem?.priceReference != null && String(activeItem.priceReference).trim() !== ""
                                    ? activeItem.priceReference
                                    : pledgeView?.item?.priceReference != null &&
                                        String(pledgeView.item.priceReference).trim() !== ""
                                      ? pledgeView.item.priceReference
                                      : null;
                                return target != null ? `₱${formatGroupPledgeCardAmount(target)}` : "xx";
                              })()}
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end justify-center text-right">
                        {pledgeLoading ? (
                          <Skeleton className="inline-block h-3 w-14 rounded-md align-middle" delayMs={40} />
                        ) : pledgeView?.isInitiator ? (
                          <>
                            <div className="text-xs font-semibold text-[var(--text-muted)]">You are the initiator</div>
                            <button
                              type="button"
                              onClick={() => setPledgeStep("initiate")}
                              className="mt-2 inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-[var(--color-primary-100)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary-800)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-primary-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.45)]"
                            >
                              <IconPencil className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary-700)]" aria-hidden />
                              Edit details
                            </button>
                          </>
                        ) : pledgeView?.initiation?.initiator ? (
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-semibold text-[var(--text-muted)]">Initiated by</div>
                            {pledgeView.initiation.initiator.avatarUrl ? (
                              <img
                                src={pledgeView.initiation.initiator.avatarUrl}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover ring-2 ring-[var(--color-primary-500)]"
                              />
                            ) : (
                              <div
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-xs font-bold text-[var(--color-primary-800)] ring-2 ring-[var(--color-primary-500)]"
                                aria-hidden
                              >
                                {(pledgeView.initiation.initiator.name?.trim()?.[0] || "?").toUpperCase()}
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>

                {!pledgeView?.initiation ? (
                  <div className="mt-4 space-y-2">
                    <Button className="w-full" onClick={() => setPledgeStep("initiate")}>
                      Start a group pledge
                    </Button>
                  </div>
                ) : pledgeView.isInitiator ? (
                  <div className="mt-4 space-y-3">
                    <div className="mt-1 flex items-baseline justify-between gap-2">
                      <div className="text-sm font-semibold text-[var(--text-primary)]">Contributor receipts</div>
                      {(pledgeView.contributions || []).length > 0 ? (
                        <span className="text-xs font-medium text-[var(--text-muted)]">
                          {(pledgeView.contributions || []).length}{" "}
                          {(pledgeView.contributions || []).length === 1 ? "person" : "people"}
                        </span>
                      ) : null}
                    </div>
                    {(pledgeView.contributions || []).length === 0 ? (
                      <div
                        className="mt-3 flex flex-col items-center rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border-default)] bg-[var(--surface-card-soft)] px-4 py-8 text-center"
                        role="status"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)] shadow-[var(--shadow-xs)]">
                          <IconReceipt className="h-7 w-7" aria-hidden />
                        </div>
                        <div className="mt-3 text-sm font-semibold text-[var(--text-primary)]">No contributions yet</div>
                        <p className="mt-1 max-w-[20rem] text-sm leading-snug text-[var(--text-secondary)]">
                          When someone contributes and uploads their receipt, it will appear here with their name and
                          amount.
                        </p>
                      </div>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {pledgeView.contributions.map((c) => {
                          const statusMeta = pledgeReceiptStatusMeta(c.status);
                          const dateLine = formatPledgeContributionDate(c.createdAt);
                          return (
                            <li key={c.id}>
                              <Card className="overflow-hidden p-0 shadow-[var(--shadow-sm)]">
                                <div className="flex gap-3 p-3">
                                  {c.contributor?.avatarUrl ? (
                                    <img
                                      src={c.contributor.avatarUrl}
                                      alt=""
                                      className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[var(--border-subtle)]"
                                    />
                                  ) : (
                                    <div
                                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-sm font-bold text-[var(--color-primary-800)] ring-2 ring-[var(--border-subtle)]"
                                      aria-hidden
                                    >
                                      {(c.contributor?.name?.trim()?.[0] || "?").toUpperCase()}
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2 gap-y-1">
                                      <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
                                        {c.contributor?.name || "Contributor"}
                                      </div>
                                      <span
                                        className={`inline-flex max-w-full items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusMeta.className}`}
                                      >
                                        <span className="truncate">{statusMeta.label}</span>
                                      </span>
                                    </div>
                                    <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs text-[var(--text-muted)]">
                                      <span className="font-semibold text-[var(--text-secondary)]">
                                        {formatPesoDots(c.amount, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                      </span>
                                      {dateLine ? <span aria-hidden>·</span> : null}
                                      {dateLine ? <span>Joined {dateLine}</span> : null}
                                    </div>
                                  </div>
                                  <div className="flex shrink-0 flex-col items-end justify-center gap-2 self-center">
                                    {c.receiptSignedUrl ? (
                                      <a
                                        className="inline-flex items-center gap-1 rounded-full border border-[var(--border-default)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-primary-700)] shadow-[var(--shadow-xs)] transition-colors hover:bg-[var(--color-primary-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-500)]"
                                        href={c.receiptSignedUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <IconReceipt className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                                        View receipt
                                      </a>
                                    ) : (
                                      <span className="text-[11px] font-medium text-[var(--text-placeholder)]">
                                        No file yet
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {(pledgeView?.myContributions || []).length > 0 ? (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-[var(--text-primary)]">Your receipts</div>
                        <ul className="space-y-2">
                          {pledgeView.myContributions.map((c) => {
                            const statusMeta = pledgeReceiptStatusMeta(c.status);
                            const dateLine = formatPledgeContributionDate(c.createdAt);
                            return (
                              <li key={c.id}>
                                <Card className="overflow-hidden p-0 shadow-[var(--shadow-sm)]">
                                  <div className="flex items-center justify-between gap-3 p-3">
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-2 gap-y-1">
                                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                                          {formatPesoDots(c.amount, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </span>
                                        <span
                                          className={`inline-flex max-w-full items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusMeta.className}`}
                                        >
                                          <span className="truncate">{statusMeta.label}</span>
                                        </span>
                                      </div>
                                      {dateLine ? (
                                        <div className="mt-1 text-xs text-[var(--text-muted)]">Uploaded {dateLine}</div>
                                      ) : null}
                                    </div>
                                    <div className="shrink-0">
                                      {c.receiptSignedUrl ? (
                                        <a
                                          className="inline-flex items-center gap-1 rounded-full border border-[var(--border-default)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-primary-700)] shadow-[var(--shadow-xs)] transition-colors hover:bg-[var(--color-primary-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-500)]"
                                          href={c.receiptSignedUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          <IconReceipt className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                                          View receipt
                                        </a>
                                      ) : (
                                        <span className="text-[11px] font-medium text-[var(--text-placeholder)]">
                                          No file yet
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : null}
                    <Button className="w-full" onClick={() => setPledgeStep("contribute_amount")}>
                      {pledgeView?.myContribution ? "Contribute again" : "Contribute"}
                    </Button>
                  </div>
                )}
              </Card>
              </div>
            ) : null}
          </div>
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={Boolean(giftActionConfirmMeta)}
        variant="modal"
        showCloseIcon={false}
        title={giftActionConfirmMeta?.title || ""}
        headerBelow={
          giftActionConfirmMeta ? (
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              {giftActionConfirmMeta.subtitle}
            </p>
          ) : null
        }
        onClose={() => {
          if (!actionBusy) setGiftActionConfirm(null);
        }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button
            className="min-h-[44px] flex-1"
            type="button"
            variant="secondary"
            disabled={actionBusy}
            onClick={() => setGiftActionConfirm(null)}
          >
            Not yet
          </Button>
          <Button
            className="min-h-[44px] flex-1"
            type="button"
            disabled={actionBusy}
            onClick={() => void confirmGiftAction()}
          >
            {giftActionConfirmMeta?.confirmLabel || "Confirm"}
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={unprepareConfirmOpen && Boolean(activeItem?.myReservation) && activeItem?.myReservation?.status === "prepared"}
        variant="modal"
        showCloseIcon={false}
        title="Cancel preparation?"
        headerBelow={
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            This item's status will revert back to preparing. Proceed?
          </p>
        }
        onClose={() => setUnprepareConfirmOpen(false)}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button
            className="min-h-[44px] flex-1"
            type="button"
            variant="secondary"
            disabled={actionBusy}
            onClick={() => setUnprepareConfirmOpen(false)}
          >
            Keep prepared
          </Button>
          <Button
            className="min-h-[44px] flex-1"
            type="button"
            variant="danger"
            disabled={actionBusy || !activeItem?.myReservation}
            onClick={() => void unprepareReservation()}
          >
            {actionBusy ? "Reverting..." : "Revert status"}
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={Boolean(activeItem) && role === "viewer" && Boolean(pledgeStep) && canGroupPledge}
        variant="modal"
        title={
          pledgeStep === "initiate"
            ? "Start group pledge"
            : pledgeStep === "contribute_amount"
            ? "Contribute"
            : pledgeStep === "contribute_details"
            ? "Send money"
            : ""
        }
        onClose={() => {
          setPledgeStep(null);
          setActionErr(null);
          setReceiptFile(null);
          setContribAmount("");
          setConfirmContributionSent(false);
          setPledgeFormErrors({});
        }}
      >
        {pledgeStep === "initiate" ? (
          <PledgeInitiateForm
            draft={pledgeInitDraft}
            setDraft={setPledgeInitDraft}
            errors={pledgeFormErrors}
            actionBusy={actionBusy}
            actionErr={actionErr}
            onSubmit={initiateGroupPledge}
          />
        ) : null}

        {pledgeStep === "contribute_amount" ? (
          <div className="space-y-3">
            <div className="text-sm text-[var(--text-secondary)]">
              Choose how much you'll contribute. Next, you'll see the initiator's payout details.
            </div>
            <label className="block">
              {(() => {
                const targetRaw =
                  activeItem?.priceReference != null && String(activeItem.priceReference).trim() !== ""
                    ? String(activeItem.priceReference)
                    : pledgeView?.item?.priceReference != null && String(pledgeView.item.priceReference).trim() !== ""
                      ? String(pledgeView.item.priceReference)
                      : "";
                const maxAmount = Number(targetRaw.replace(/[^\d]/g, ""));
                const amount = Number(String(contribAmount || "").replace(/[^\d]/g, ""));
                const hasMax = Number.isFinite(maxAmount) && maxAmount > 0;
                const overMax = hasMax && Number.isFinite(amount) && amount > maxAmount;
                const maxLabel = hasMax ? `₱${maxAmount.toLocaleString()}` : null;
                return (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold text-[var(--text-secondary)]">Amount</div>
                      {overMax && maxLabel ? (
                        <div className="text-xs font-semibold text-[var(--danger-text)]">
                          Amount can't exceed {maxLabel}.
                        </div>
                      ) : null}
                    </div>
                    <input
                      inputMode="numeric"
                      className={`mt-1 w-full rounded-[14px] border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)] ${
                        overMax ? "border-[rgba(155,28,28,0.35)]" : "border-[var(--border-default)]"
                      }`}
                      value={contribAmount}
                      onChange={(e) => {
                        const digits = String(e.target.value || "").replace(/[^\d]/g, "");
                        const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        setContribAmount(formatted);
                      }}
                      placeholder={formattedContribPlaceholder}
                      aria-invalid={overMax ? "true" : "false"}
                    />
                    {actionErr ? <div className="mt-2 text-sm text-[var(--danger-text)]">{actionErr.message}</div> : null}
                    <Button className="mt-3 w-full" disabled={actionBusy || !contribAmount || overMax} onClick={startContribution}>
                      Continue
                    </Button>
                  </>
                );
              })()}
            </label>
          </div>
        ) : null}

        {pledgeStep === "contribute_details" ? (
          <div className="space-y-3">
            <div className="text-sm text-[var(--text-secondary)]">
              Send money outside Beabr, then upload your receipt.
            </div>

            {pledgeView?.initiation?.hasQrImage ? (
              <Card className="overflow-hidden p-0 shadow-[var(--shadow-sm)]">
                {pledgeQrBlobUrl ? (
                  <a href={pledgeQrBlobUrl} target="_blank" rel="noreferrer" className="block">
                    <img
                      src={pledgeQrBlobUrl}
                      alt="Pledge QR code"
                      className="h-auto w-full bg-white object-contain"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <div className="p-4 text-center text-xs font-semibold text-[var(--text-muted)]">Loading QR...</div>
                )}
              </Card>
            ) : null}

            <Card className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Payout details
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[var(--text-muted)]">Method</div>
                  <div className="font-semibold text-[var(--text-secondary)]">
                    {(() => {
                      const m = String(pledgeView?.initiation?.payoutMethod || "");
                      if (m === "gcash") return "GCash";
                      if (m === "bank") return "Bank transfer";
                      if (m === "other") return "E-wallet";
                      return m ? formatStatusLabel(m) : "—";
                    })()}
                  </div>
                </div>
                {pledgeView?.initiation?.payoutName ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[var(--text-muted)]">Account Name</div>
                    <div className="flex items-center gap-0.5">
                      <div className="font-semibold text-[var(--text-secondary)]">{pledgeView.initiation.payoutName}</div>
                      <button
                        type="button"
                        className="inline-flex h-6 w-6 items-center justify-center text-[var(--color-primary-700)] transition hover:text-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
                        aria-label="Copy name"
                        onClick={() => void copyToClipboard(pledgeView.initiation.payoutName)}
                      >
                        <IconCopy className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                  </div>
                ) : null}
                {pledgeView?.initiation?.payoutAccount ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[var(--text-muted)]">Account Number</div>
                    <div className="flex items-center gap-0.5">
                      <div className="font-semibold text-[var(--text-secondary)]">{pledgeView.initiation.payoutAccount}</div>
                      <button
                        type="button"
                        className="inline-flex h-6 w-6 items-center justify-center text-[var(--color-primary-700)] transition hover:text-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
                        aria-label="Copy account number"
                        onClick={() => void copyToClipboard(pledgeView.initiation.payoutAccount)}
                      >
                        <IconCopy className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                  </div>
                ) : null}
                {pledgeView?.initiation?.payoutNotes ? (
                  <div className="pt-2">
                    <div className="text-[var(--text-muted)]">Note</div>
                    <div className="mt-1 text-sm text-[var(--text-secondary)]">{pledgeView.initiation.payoutNotes}</div>
                  </div>
                ) : null}
              </div>
              <div className="mt-3 text-center text-[11px] leading-snug text-[var(--text-muted)]">
                This is sensitive info. Don't screenshot or share.{" "}
                <Link
                  to="/documentation/help-center/HC-024-pledges-group-gifts-sensitive-info"
                  className="font-semibold text-[var(--color-primary-700)] underline underline-offset-2 hover:text-[var(--color-primary-800)]"
                >
                  Learn more
                </Link>
                .
              </div>
            </Card>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-[var(--text-secondary)]">Receipt</div>
              <RegistryPhotoPicker
                inputId="pledge-receipt-input"
                emptyLabel="Add photo"
                remoteUrl={null}
                localFile={receiptFile}
                onFile={setReceiptFile}
                onClearLocal={() => setReceiptFile(null)}
                disabled={actionBusy}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] p-3 text-left">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border-default)] text-[var(--color-primary-600)] focus:ring-[rgba(129,160,63,0.35)]"
                checked={confirmContributionSent}
                onChange={(e) => setConfirmContributionSent(e.target.checked)}
              />
              <span className="text-sm text-[var(--text-secondary)]">
                I confirm I sent the money to the provided account outside Beabr.
              </span>
            </label>

            <Button
              className="w-full"
              disabled={!confirmContributionSent || !receiptFile || actionBusy}
              onClick={() => {
                void uploadContributionReceipt();
              }}
            >
              Confirm contribution
            </Button>
          </div>
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={fabOpen && role === "owner" && !closed}
        title="Add gift item"
        variant="modal"
        showCloseIcon={false}
        onClose={() => {
          setFabOpen(false);
          setDraftItemPhotos([]);
          setActionErr(null);
        }}
      >
        <form
          data-tour-id="registry-item-form"
          className="space-y-3"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (actionBusy) return;
            void createItem();
          }}
        >
          <div data-tour-id="registry-item-photo" data-tour-highlight="self">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">
              Photos
            </div>
            <div className="mt-2">
              <input
                id={`add-item-photo-${registryId}`}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={actionBusy}
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  e.target.value = "";
                  if (!f) return;
                  setDraftItemPhotos((prev) => (prev.length >= MAX_ITEM_PHOTOS ? prev : [...prev, f]));
                }}
              />
              {draftItemPhotos.length === 0 ? (
                <PhotoDropzoneInner
                  compact
                  inputId={`add-item-photo-${registryId}`}
                  label="Add photo"
                  disabled={actionBusy}
                  onPick={(f) => {
                    if (!f) return;
                    setDraftItemPhotos((prev) => (prev.length >= MAX_ITEM_PHOTOS ? prev : [...prev, f]));
                  }}
                />
              ) : (
                <div className="flex flex-wrap items-start gap-3">
                  <DraftItemPhotosRow
                    files={draftItemPhotos}
                    disabled={actionBusy}
                    onRemove={(idx) => setDraftItemPhotos((prev) => prev.filter((_, i) => i !== idx))}
                  />
                  {draftItemPhotos.length < MAX_ITEM_PHOTOS ? (
                    <PhotoDropzoneInner
                      compact
                      squareThumb
                      inputId={`add-item-photo-${registryId}`}
                      label={`Add photo · ${draftItemPhotos.length}/${MAX_ITEM_PHOTOS}`}
                      disabled={actionBusy}
                      onPick={(f) => {
                        if (!f) return;
                        setDraftItemPhotos((prev) => (prev.length >= MAX_ITEM_PHOTOS ? prev : [...prev, f]));
                      }}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
          <label className="block">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">
              Gift name
            </div>
            <input
              data-tour-id="registry-item-name"
              className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={draftItem.title}
              onChange={(e) => setDraftItem((s) => ({ ...s, title: e.target.value }))}
              placeholder="e.g. SanDisk SSD, Bath towels"
              autoComplete="off"
            />
          </label>
          <label className="block">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">
              How much does it cost? <span className="text-[var(--text-muted)]">(estimate)</span>
            <div className="mt-1 flex w-full min-w-0 overflow-hidden rounded-[14px] border border-[var(--border-default)] bg-white focus-within:ring-2 focus-within:ring-[rgba(129,160,63,0.18)]">
              <span
                className="flex shrink-0 items-center border-r border-[var(--border-default)] bg-[var(--surface-card-soft)] px-3 py-3 text-sm font-medium text-[var(--text-secondary)] select-none tabular-nums"
                aria-hidden
              >
                ₱
              </span>
              <input
                data-tour-id="registry-item-price"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm outline-none"
                value={draftItem.priceReference}
                onChange={(e) => setDraftItem((s) => ({ ...s, priceReference: e.target.value }))}
                placeholder="e.g. 1299"
              />
            </div>
            </div>
          </label>
          <label className="block">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Category</div>
            <select
              data-tour-id="registry-item-category"
              className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={draftItem.category}
              onChange={(e) => setDraftItem((s) => ({ ...s, category: e.target.value }))}
            >
              {[
                "Dorm / Apartment",
                "Appliance",
                "Tech",
                "Clothing",
                "Accessories",
                "School / Work Supplies",
                "Self-Care",
                "Food / Groceries",
                "Experience",
                "Custom",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          {categoryFields.length ? (
            <div data-tour-id="registry-item-category-details" data-tour-highlight="self" className="space-y-3">
              {categoryFields.map((key) => (
                <label key={key} className="block">
                  <div className="text-xs font-semibold text-[var(--text-secondary)]">{formatAttributeLabel(key)}</div>
                  <input
                    className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                    value={draftItem.attributes?.[key] || ""}
                    onChange={(e) =>
                      setDraftItem((s) => ({
                        ...s,
                        attributes: { ...(s.attributes || {}), [key]: e.target.value },
                      }))
                    }
                    placeholder="Optional"
                  />
                </label>
              ))}
            </div>
          ) : null}
          <label data-tour-id="registry-item-url" className="block">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Link/URL to item</div>
            <input
              type="text"
              inputMode="url"
              autoComplete="off"
              className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={draftItem.externalLink}
              onChange={(e) => setDraftItem((s) => ({ ...s, externalLink: e.target.value }))}
              placeholder="https://..."
            />
          </label>
          <label className="block">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">How many?</div>
              <input
                inputMode="numeric"
                type="text"
                min={1}
              className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={draftItem.quantityNeeded}
                onChange={(e) => setDraftItem((s) => ({ ...s, quantityNeeded: formatIntegerInput(e.target.value) }))}
            />
          </label>
          <label className="block">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Additional Notes</div>
            <textarea
              rows={3}
              value={draftItem.viewerInstruction}
              onChange={(e) => setDraftItem((s) => ({ ...s, viewerInstruction: e.target.value }))}
              className="mt-1 w-full resize-none rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              placeholder="e.g., Sage green preferred."
            />
          </label>
          <label data-tour-id="registry-item-considering" className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] p-3 text-left">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border-default)] text-[var(--color-primary-600)] focus:ring-[rgba(129,160,63,0.35)]"
              checked={Boolean(draftItem.considering)}
              onChange={(e) => setDraftItem((s) => ({ ...s, considering: e.target.checked }))}
            />
            <span className="text-sm text-[var(--text-secondary)]">
              Keep this as a maybe gift idea.
            </span>
          </label>
          {actionErr ? <div className="text-sm text-[var(--danger-text)]">{actionErr.message}</div> : null}
          {closed ? (
            <div className="rounded-[var(--radius-md)] bg-[var(--surface-card-soft)] px-3 py-2 text-center text-xs leading-relaxed text-[var(--text-muted)] ring-1 ring-[var(--border-subtle)]">
              This registry is closed. Items can no longer be added.
            </div>
          ) : null}
          <Button data-tour-id="registry-item-submit" type="submit" className="w-full" disabled={actionBusy || closed}>
            <span className="mr-1.5 text-lg font-light leading-none" aria-hidden>
              +
            </span>
            Add Item
          </Button>
        </form>
      </BottomSheet>

      <BottomSheet
        variant="modal"
        open={countdownModalOpen}
        title="Countdown to close"
        onClose={() => setCountdownModalOpen(false)}
      >
        <div className="space-y-6">
          <div className="rounded-[20px] bg-[linear-gradient(145deg,rgba(129,160,63,0.35),rgba(139,94,60,0.28))] p-[1px] shadow-[var(--shadow-sm)]">
            <div className="rounded-[19px] bg-[var(--surface-card)] px-3 py-6 sm:px-5">
              {countdownParts?.expired ? (
                <div className="space-y-3 text-center">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">This registry is now closed</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    You can still view the registry items and details, but gift actions are no longer available.
                  </p>
                  <Button className="w-full" onClick={() => setCountdownModalOpen(false)}>
                    Back to registry
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                  {[
                    { label: "Days", value: countdownParts?.days ?? 0, pad: false },
                    { label: "Hours", value: countdownParts?.hours ?? 0, pad: false },
                    { label: "Minutes", value: countdownParts?.minutes ?? 0, pad: false },
                    { label: "Seconds", value: countdownParts?.seconds ?? 0, pad: true },
                  ].map((u) => (
                    <div
                      key={u.label}
                      className="rounded-2xl bg-[var(--surface-card-soft)] px-1.5 py-4 text-center shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]"
                    >
                      <div className="text-2xl font-bold tabular-nums tracking-tight text-[var(--text-primary)] sm:text-3xl">
                        {u.pad ? pad2(Number(u.value)) : u.value}
                      </div>
                      <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                        {u.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] p-4">
            <IconCalendar className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary-600)]" aria-hidden />
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Scheduled close
              </div>
              <div className="mt-1 text-sm font-semibold leading-snug text-[var(--text-primary)]">
                {formatScheduleDate(data.registry.closeDatetime)}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <IconClock className="h-4 w-4 text-[var(--text-muted)]" aria-hidden />
                  <span className="tabular-nums">{formatScheduleTime(data.registry.closeDatetime)}</span>
                </span>
                <span className="text-xs text-[var(--text-muted)]">· Local Timezone</span>
              </div>
            </div>
          </div>
        </div>
      </BottomSheet>

      {canShareInvite ? (
        <ShareInviteModal
          joinCode={data.registry.joinCode}
          open={shareInviteOpen && !closed}
          onClose={() => setShareInviteOpen(false)}
        />
      ) : null}

      <ItemImageLightboxDialog
        open={Boolean(imageLightbox?.urls?.length)}
        urls={imageLightbox?.urls || []}
        title={imageLightbox?.title || "Gift"}
        onClose={() => setImageLightbox(null)}
      />

      <SuccessModal
        open={successModalOpen}
        badgeLabel={successVariant?.badgeLabel || "Success"}
        title={successVariant?.title || "Success"}
        subtitle={successVariant?.subtitle || ""}
        ctaLabel={successVariant?.ctaLabel || "Continue"}
        onCta={() => {
          setSuccessVariantKey(null);
          setEndedSuccessModal(null);
        }}
        onClose={() => {
          setSuccessVariantKey(null);
          setEndedSuccessModal(null);
        }}
      />
    </div>
  );
}

