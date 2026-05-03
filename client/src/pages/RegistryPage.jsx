import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

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

/** Stacked rows — items / inventory count card */
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

/** Filter funnel — gift filters popover trigger */
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
import { formatStatusLabel, StatusBadge } from "../components/ui/StatusBadge.jsx";
import { BottomSheet } from "../components/ui/BottomSheet.jsx";
import { RegistryScreenSkeleton } from "../components/ui/ScreenSkeletons.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ShareInviteModal } from "../components/registry/ShareInviteModal.jsx";
import { IconLightbulb, IconPencil, IconShare } from "../components/ui/PageIcons.jsx";
import peekRightImg from "../assets/peek_right.png";

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
  return String(Math.round(Number(n)));
}

/** Parses optional price from form input; invalid or empty → null */
function parsePriceReferenceInput(raw) {
  const t = String(raw ?? "").trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0 || n > 999999) return null;
  return n;
}

/** Display price on item cards / sheet (API may return Decimal as string). */
function formatItemPriceReference(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value).trim() || null;
  return `₱${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/** Numeric estimate for filtering; invalid / missing → null */
function giftItemNumericPriceEstimate(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/**
 * Upper bound for the gift price filter slider: next power of 10 ≥ max item price when that is ≤ 2× max
 * (e.g. ₱8,599 → ₱10,000). Otherwise round up to the next ₱1,000. No priced items → generous default.
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

/** Framed thumbnails — matches square `PhotoDropzoneInner` tile (owner edit sheet + add-item) */
const ITEM_GALLERY_THUMB_FRAME_CLASS = "relative w-[5.5rem] shrink-0 sm:w-24";

/** Local draft file previews — parent should use `flex flex-wrap items-start gap-2` alongside the dropzone tile */
function DraftItemPhotosRow({ files, onRemove, disabled }) {
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [urls]);

  if (files.length === 0) return null;

  return (
    <>
      {files.map((f, idx) => (
        <div key={`${f.name}-${f.lastModified}-${idx}`} className={ITEM_GALLERY_THUMB_FRAME_CLASS}>
          <img
            src={urls[idx]}
            alt=""
            className="aspect-square w-full rounded-[var(--radius-md)] object-cover ring-2 ring-[var(--color-primary-600)] ring-offset-2 ring-offset-[var(--surface-page)]"
          />
          <button
            type="button"
            disabled={disabled}
            className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-default)] bg-white text-sm font-bold text-[var(--text-secondary)] shadow-[var(--shadow-sm)] hover:bg-[var(--surface-card-soft)] disabled:opacity-50"
            aria-label="Remove draft photo"
            onClick={() => onRemove(idx)}
          >
            ×
          </button>
        </div>
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

  return (
    <div className="fixed inset-0 z-[110] touch-manipulation">
      <button
        type="button"
        aria-label="Close image viewer"
        className="absolute inset-0 z-0 bg-[var(--surface-overlay)] backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Full-size photos"
        className="relative z-[1] flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden"
      >
        <div className="flex shrink-0 items-center justify-end gap-2 px-4 py-3 pt-[max(env(safe-area-inset-top,0px),12px)]">
          <button
            type="button"
            className="min-h-[44px] rounded-full border border-[var(--border-default)] bg-[var(--surface-card)] px-4 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-8">
          <div className="mx-auto flex max-w-3xl flex-col gap-6 pb-24 pt-2">
            {urls.map((src, i) => (
              // eslint-disable-next-line react/no-array-index-key — signed URLs distinct per refresh
              <figure key={`lb-${i}`} className="overflow-hidden rounded-[var(--radius-lg)] bg-black/35 ring-1 ring-white/20">
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
    </div>
  );
}

function groupPledgeProgressPercent(gp) {
  if (!gp) return 0;
  const g = Number(gp.gatheredAmount) || 0;
  const goal = gp.goalAmount != null ? Number(gp.goalAmount) : null;
  if (goal != null && goal > 0) return Math.min(100, (g / goal) * 100);
  return g > 0 ? 100 : 0;
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
          <div className="text-[9px] leading-tight text-[var(--text-muted)]">PNG, JPG… · max 8MB</div>
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
            <div className="text-[10px] leading-snug text-[var(--text-muted)]">Drop or tap · PNG, JPG… · max 8MB</div>
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
          <div className="text-xs text-[var(--text-muted)]">PNG, JPG, WEBP, HEIC, AVIF • up to 8MB</div>
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
        Add your payout details so contributors can send money to you.        
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
          You are confirming that the details you’ve provided are correct and that you will follow the
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
        {actionBusy ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}

export function RegistryPage() {
  const { registryId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [activeItem, setActiveItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [reserveQty, setReserveQty] = useState(1);
  const [privateNote, setPrivateNote] = useState("");
  const [actionErr, setActionErr] = useState(null);
  const [actionBusy, setActionBusy] = useState(false);

  const [fabOpen, setFabOpen] = useState(false);
  const [countdownModalOpen, setCountdownModalOpen] = useState(false);
  const [shareInviteOpen, setShareInviteOpen] = useState(false);
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [countdownTick, setCountdownTick] = useState(() => Date.now());
  const [draftItem, setDraftItem] = useState({
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
  const [draftItemPhotos, setDraftItemPhotos] = useState([]);
  const [imageLightbox, setImageLightbox] = useState(null);

  const [giftCategoryFilter, setGiftCategoryFilter] = useState("all");
  /** Viewer-only: all | mine | others */
  const [giftStatusFilter, setGiftStatusFilter] = useState("all");
  /** Owner + viewer — ₱ range [min, max] vs. {@link giftPriceSliderCeiling} */
  const [giftPriceMin, setGiftPriceMin] = useState(0);
  const [giftPriceMax, setGiftPriceMax] = useState(50_000);
  const [giftFiltersPopoverOpen, setGiftFiltersPopoverOpen] = useState(false);
  const giftFiltersPopoverRef = useRef(null);

  const [pledgeView, setPledgeView] = useState(null);
  const [pledgeLoading, setPledgeLoading] = useState(false);
  const [pledgeStep, setPledgeStep] = useState(null); // "initiate" | "contribute_amount" | "contribute_details" | "contribute_receipt" | "done"
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
  const [contribId, setContribId] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
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
        ownerPrivateNote: next.ownerPrivateNote,
        totals: next.totals,
        displayStatus: next.displayStatus,
        myReservation: next.myReservation,
        hasPledge: next.hasPledge,
        groupPledge: next.groupPledge,
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

  const revealTarget = useMemo(() => {
    if (!data?.registry?.revealDatetime) return null;
    return new Date(data.registry.revealDatetime);
  }, [data?.registry?.revealDatetime]);

  const countdownParts = useMemo(() => {
    if (!revealTarget) return null;
    return getRemainingParts(revealTarget, countdownTick);
  }, [revealTarget, countdownTick]);

  const role = data?.registry?.role;
  const revealed = data?.registry?.revealed;

  const title = data?.registry?.title || "Registry";
  const ownerName = data?.registry?.ownerDisplayName || "";
  const messageOwnerLabel = (() => {
    const n = ownerName.trim();
    if (!n) return "Message";
    return `${n.split(/\s+/)[0]}'s message`;
  })();

  const canReserve = role === "viewer";

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
      if (giftStatusFilter === "mine") {
        list = list.filter((it) => Boolean(it.myReservation));
      } else if (giftStatusFilter === "others") {
        list = list.filter((it) => {
          const claimed = it.totals?.claimed ?? 0;
          const mine = it.myReservation?.quantity ?? 0;
          return claimed > mine;
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
    if (!activeItem || role !== "viewer") return false;
    return (activeItem.totals?.available ?? 0) > 0;
  }, [activeItem, role]);

  useEffect(() => {
    if (!canGroupPledge) setPledgeStep(null);
  }, [canGroupPledge]);

  useEffect(() => {
    if (!activeItem) setArchiveConfirmOpen(false);
  }, [activeItem]);

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

  async function reserve() {
    if (!activeItem) return;
    setActionBusy(true);
    setActionErr(null);
    try {
      await apiFetch(`/api/items/${activeItem.id}/reserve`, {
        method: "POST",
        body: JSON.stringify({
          quantity: reserveQty,
          privateNote: privateNote || null,
        }),
      });
      setActiveItem(null);
      setReserveQty(1);
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
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function startContribution() {
    if (!activeItem) return;
    setActionBusy(true);
    setActionErr(null);
    try {
      const r = await apiFetch(`/api/items/${activeItem.id}/pledge/contribute`, {
        method: "POST",
        body: JSON.stringify({ amount: Number(contribAmount) }),
      });
      setContribId(r.contribution.id);
      setPledgeStep("contribute_details");
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function uploadContributionReceipt() {
    if (!contribId) return;
    setActionBusy(true);
    setActionErr(null);
    try {
      const fd = new FormData();
      fd.set("receipt", receiptFile);
      await apiFetchForm(`/api/pledge-contributions/${contribId}/receipt`, fd, { method: "POST" });
      setPledgeStep("done");
      if (activeItem) await loadGroupPledge(activeItem.id);
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
        new Error('Add a short name in “What do you want?” — that’s the gift title (separate from brand or model below).')
      );
      return;
    }
    setActionBusy(true);
    setActionErr(null);
    try {
      const created = await apiFetch(`/api/registries/${registryId}/items`, {
        method: "POST",
        body: JSON.stringify({
          title,
          category: draftItem.category,
          description: draftItem.description || null,
          quantityNeeded: Number(draftItem.quantityNeeded) || 1,
          viewerInstruction: draftItem.viewerInstruction || null,
          externalLink: draftItem.externalLink?.trim() ? draftItem.externalLink.trim() : null,
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
          // eslint-disable-next-line no-await-in-loop -- uploads must stay in order per item (max 3)
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
    } catch (e) {
      setActionErr(e);
    } finally {
      setActionBusy(false);
    }
  }

  async function markPrepared() {
    if (!activeItem?.myReservation?.id) return;
    setActionBusy(true);
    setActionErr(null);
    try {
      await apiFetch(`/api/reservations/${activeItem.myReservation.id}/prepare`, { method: "POST" });
      setActiveItem(null);
      await refresh();
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

  async function saveItemEdits() {
    if (!editItem?.id) return;
    setActionBusy(true);
    setActionErr(null);
    try {
      await apiFetch(`/api/items/${editItem.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editItem.title,
          category: editItem.category,
          quantityNeeded: Number(editItem.quantityNeeded) || 1,
          viewerInstruction: editItem.viewerInstruction || null,
          ownerPrivateNote: editItem.ownerPrivateNote || null,
          description: editItem.description || null,
          externalLink: editItem.externalLink?.trim() ? editItem.externalLink.trim() : null,
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

  async function archiveItem() {
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
            quantityNeeded: item.quantityNeeded,
            viewerInstruction: item.viewerInstruction || "",
            ownerPrivateNote: item.ownerPrivateNote || "",
            externalLink: item.externalLink || "",
            priceReference:
              item.priceReference != null && item.priceReference !== ""
                ? String(item.priceReference)
                : "",
            considering: item.ownerStatus === "considering",
          }
        : null
    );
    setReserveQty(1);
    setPrivateNote("");
    setActionErr(null);
    setPledgeView(null);
    setPledgeStep(null);
    setContribAmount("");
    setContribId(null);
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
  if (err) return <div className="py-10 text-center text-sm text-[var(--danger-text)]">{err.message}</div>;
  if (!data) return null;

  const categoryFields = (() => {
    const c = draftItem.category;
    if (c === "Tech") return ["brand", "model", "compatibility"];
    if (c === "Clothing") return ["size", "color", "brand"];
    if (c === "Dorm / Apartment") return ["size", "color", "brand", "dimensions", "material"];
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
        : "1000";

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
              {role === "owner" ? (
                <Button
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
              {revealed ? (
                <Link
                  className="min-w-0 flex-1 md:flex-initial md:w-auto"
                  to={`/registry/${registryId}/reveal`}
                >
                  <Button
                    variant="secondary"
                    className="min-h-[44px] w-full min-w-0 gap-1 border-white/35 bg-white/15 px-2.5 py-2 text-xs font-semibold text-white backdrop-blur-[2px] hover:bg-white/25 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm md:w-auto [&_svg]:text-white"
                  >
                    <IconEye className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                    <span>
                      <span className="sm:hidden">Reveal</span>
                      <span className="hidden sm:inline">View reveal</span>
                    </span>
                  </Button>
                </Link>
              ) : (
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
              )}
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
          {data.registry.message || (role === "owner" && data.registry.joinCode) ? (
            <div
              className={`flex flex-col gap-3 ${
                role === "owner" && data.registry.joinCode
                  ? "sm:flex-row sm:items-start sm:justify-between"
                  : ""
              }`}
            >
              <div
                className={`max-w-prose min-w-0 ${role === "owner" && data.registry.joinCode ? "flex-1" : ""}`}
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
              {role === "owner" && data.registry.joinCode ? (
                <Button
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
            className={`grid gap-3 ${data.registry.graduationDate ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
          >
            {data.registry.graduationDate ? (
              <div className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                  <IconCalendar className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    {data.registry.eventCategory || "Event"}
                  </div>
                  <div className="mt-0.5 text-base font-semibold text-[var(--text-primary)]">
                    {formatScheduleDate(data.registry.graduationDate)}
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
                  Reveal opens
                </div>
                <div className="mt-0.5 text-base font-semibold text-[var(--text-primary)]">
                  {formatScheduleDate(data.registry.revealDatetime)}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <IconClock className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
                  <span className="tabular-nums">{formatScheduleTime(data.registry.revealDatetime)}</span>
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
                        <option value="all">All reservations</option>
                        <option value="mine">Reserved by me</option>
                        <option value="others">Reserved by others</option>
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
                      <span>₱{giftPriceMin.toLocaleString()}</span>
                      <span className="text-xs font-normal text-[var(--text-muted)]">to</span>
                      <span>₱{giftPriceMax.toLocaleString()}</span>
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
                        ? "Add your first gift item so givers know what to prepare."
                        : "This registry doesn’t have any visible items yet."}
                    </div>
                  </div>
                </div>
                {role === "owner" ? (
                  <Button
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
                const showExternal = Boolean(item.externalLink);
                const showOwnerEdit = role === "owner";
                const showMarkPrepared = canReserve && item.myReservation?.status === "reserved";
                const showReserve = canReserve && !item.myReservation && avail > 0;
                const showViewDetails = canReserve && showViewDetailsBtn;
                const viewerReserveWithExternal =
                  role !== "owner" && Boolean(showExternal && showReserve);
                const showPledgeQuickAction = canReserve && Boolean(item.groupPledge);
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
                          title="Still deciding — not finalized yet."
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
                            {role !== "owner" ? <StatusBadge status={item.displayStatus} /> : null}
                          </div>
                          {canReserve && item.myReservation ? (
                            <span className="inline-flex w-fit rounded-full bg-[var(--color-primary-100)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-primary-800)]">
                              {item.myReservation.status === "prepared"
                                ? `You marked ${item.myReservation.quantity} prepared`
                                : `You reserved ${item.myReservation.quantity}`}
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
                                Pledge: P{formatGroupPledgeCardAmount(item.groupPledge.gatheredAmount)}
                                {item.groupPledge.goalAmount != null ? (
                                  <>
                                    {" "}
                                    / P{formatGroupPledgeCardAmount(item.groupPledge.goalAmount)} gathered
                                  </>
                                ) : (
                                  <> gathered</>
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
                            Reserve this gift
                          </Button>
                          {showPledgeQuickAction ? (
                            <Button
                              type="button"
                              variant="secondary"
                              className={`inline-flex ${pledgeBesideReserveRowClass}`}
                              onClick={(e) => {
                                e.preventDefault();
                                void openGiftItemSheet(item, { scrollToPledge: true });
                              }}
                            >
                              Pledge
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
                          {showPledgeQuickAction ? (
                            <Button
                              type="button"
                              variant="secondary"
                              className={`inline-flex min-h-[44px] ${openLinkFlexClass}`}
                              onClick={(e) => {
                                e.preventDefault();
                                void openGiftItemSheet(item, { scrollToPledge: true });
                              }}
                            >
                              Pledge
                            </Button>
                          ) : null}
                          <a
                            href={item.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-white px-3 text-xs font-semibold text-[var(--color-primary-800)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-primary-50)] ${openLinkFlexClass}`}
                          >
                            <IconExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                            Open link
                          </a>
                        </>
                      ) : null}
                      {canReserve ? (
                        <>
                          {showMarkPrepared ? (
                            <Button
                              type="button"
                              className={`inline-flex ${footerBtnClass}`}
                              disabled={actionBusy}
                              onClick={(e) => {
                                e.preventDefault();
                                void markPreparedQuick(item);
                              }}
                            >
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
                              Reserve this gift
                            </Button>
                          ) : null}
                          {showViewDetails ? (
                            <Button
                              type="button"
                              variant="secondary"
                              className={`inline-flex ${footerBtnClass}`}
                              onClick={(e) => {
                                e.preventDefault();
                                void openGiftItemSheet(item);
                              }}
                            >
                              View details
                            </Button>
                          ) : null}
                          {showPledgeQuickAction && !viewerReserveWithExternal && !(showExternal && !viewerReserveWithExternal) ? (
                            <Button
                              type="button"
                              variant="secondary"
                              className={`inline-flex ${footerBtnClass}`}
                              onClick={(e) => {
                                e.preventDefault();
                                void openGiftItemSheet(item, { scrollToPledge: true });
                              }}
                            >
                              Pledge
                            </Button>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {role === "owner" &&
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
          setContribId(null);
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
              </div>
            ) : null}

            {role === "owner" && editItem ? (
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
                        disabled={actionBusy}
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
                          disabled={actionBusy}
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
                                  disabled={actionBusy}
                                  className="absolute inset-0 z-[1] rounded-[inherit] outline-none ring-inset hover:bg-transparent focus-visible:z-[2] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
                                  onClick={() =>
                                    setImageLightbox({ urls: sheetGalleryUrls, title: activeItem.title })
                                  }
                                >
                                  <span className="sr-only">View larger</span>
                                </button>
                                {/* Hover-capable browsers: darken + centered ×; hidden on coarse/touch */}
                                <div
                                  className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center bg-[rgba(29,33,26,0.62)] opacity-0 transition-opacity duration-200 [@media(hover:none)]:hidden group-hover/thumbphoto:pointer-events-auto group-hover/thumbphoto:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100"
                                >
                                  <button
                                    type="button"
                                    disabled={actionBusy}
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
                                  disabled={actionBusy}
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
                                      disabled={actionBusy}
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
                                      disabled={actionBusy}
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
                              disabled={actionBusy}
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
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">What do you want?</div>
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
                      placeholder="https://…"
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">How many?</div>
                    <input
                      type="number"
                      min={1}
                      className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                      value={editItem.quantityNeeded}
                      onChange={(e) => setEditItem((s) => ({ ...s, quantityNeeded: e.target.value }))}
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
                      I am still considering this.
                    </span>
                  </label>
                  <label className="block">
                    <div className="text-xs font-semibold text-[var(--text-secondary)]">Owner private note</div>
                    <textarea
                      rows={3}
                      className="mt-1 w-full resize-none rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                      value={editItem.ownerPrivateNote}
                      onChange={(e) => setEditItem((s) => ({ ...s, ownerPrivateNote: e.target.value }))}
                    />
                  </label>
                  {actionErr ? <div className="text-sm text-[var(--danger-text)]">{actionErr.message}</div> : null}
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={saveItemEdits} disabled={actionBusy}>
                      Save
                    </Button>
                    {activeItem.totals?.claimed > 0 || activeItem.hasPledge ? (
                      <div className="flex flex-1 items-center justify-center rounded-[14px] bg-[var(--surface-card-soft)] px-3 py-2 text-center text-xs text-[var(--text-muted)]">
                        Cannot archive — active reservations or pledge exist.
                      </div>
                    ) : (
                      <Button
                        className="flex-1"
                        variant="danger"
                        onClick={() => {
                          setActionErr(null);
                          setArchiveConfirmOpen(true);
                        }}
                        disabled={actionBusy}
                      >
                        Archive
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ) : null}

            {canReserve ? (
              <div className="space-y-3">
                {activeItem.myReservation ? (
                  <Card className="p-4">
                    <div className="text-sm font-semibold">Your reservation</div>
                    <div className="mt-1 text-sm text-[var(--text-secondary)]">
                      Quantity: {activeItem.myReservation.quantity} • Status:{" "}
                      {formatStatusLabel(activeItem.myReservation.status)}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button className="flex-1" onClick={markPrepared} disabled={actionBusy || activeItem.myReservation.status !== "reserved"}>
                        Mark as prepared
                      </Button>
                      <Button
                        className="flex-1"
                        variant="secondary"
                        onClick={cancelReservation}
                        disabled={actionBusy}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <>
                    <label className="block">
                      <div className="text-xs font-semibold text-[var(--text-secondary)]">Quantity</div>
                      <input
                        type="number"
                        min={1}
                        max={activeItem.totals?.available ?? 1}
                        value={reserveQty}
                        onChange={(e) => setReserveQty(Number(e.target.value))}
                        className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                      />
                      <div className="mt-1 text-xs text-[var(--text-muted)]">
                        Available: {activeItem.totals?.available ?? 0}
                      </div>
                    </label>
                    <label className="block">
                      <div className="text-xs font-semibold text-[var(--text-secondary)]">
                        Private note (optional)
                      </div>
                      <textarea
                        rows={3}
                        value={privateNote}
                        onChange={(e) => setPrivateNote(e.target.value)}
                        className="mt-1 w-full resize-none rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                        placeholder="e.g., I’ll buy this next week."
                      />
                    </label>
                    {actionErr ? (
                      <div className="text-sm text-[var(--danger-text)]">{actionErr.message}</div>
                    ) : null}
                    <Button className="w-full" onClick={reserve} disabled={actionBusy}>
                      Reserve this gift
                    </Button>
                  </>
                )}
              </div>
            ) : null}

            {role === "viewer" && canGroupPledge ? (
              <div ref={groupPledgeSectionRef} className="scroll-mt-4">
              <Card className="p-4">
                <div className="text-sm font-semibold">Group pledge</div>
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  Track shared contributions and receipts without notifying the registry owner.
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
                          ₱{pledgeView ? String(pledgeView.gatheredAmount) : "—"}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end justify-center text-right">
                        {pledgeLoading ? (
                          <Skeleton className="inline-block h-3 w-14 rounded-md align-middle" delayMs={40} />
                        ) : pledgeView?.isInitiator ? (
                          <div className="text-xs font-semibold text-[var(--text-muted)]">You are the initiator</div>
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
                    <Button variant="secondary" className="w-full" onClick={() => setPledgeStep("initiate")}>
                      Edit payout details / QR
                    </Button>

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
                                        ₱{String(c.amount)}
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
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-[var(--text-secondary)]">
                      Initiator: {pledgeView.initiation.initiator.name}
                    </div>
                    <Button className="w-full" onClick={() => setPledgeStep("contribute_amount")}>
                      Contribute
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
        open={archiveConfirmOpen && Boolean(activeItem)}
        variant="modal"
        title="Archive this gift?"
        headerBelow={
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            It will disappear from your registry for you and invited gift givers.{" "}
            You can’t undo this from the app.
          </p>
        }
        onClose={() => setArchiveConfirmOpen(false)}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button
            className="min-h-[44px] flex-1"
            type="button"
            variant="secondary"
            disabled={actionBusy}
            onClick={() => setArchiveConfirmOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="min-h-[44px] flex-1"
            type="button"
            variant="danger"
            disabled={actionBusy || !activeItem}
            onClick={() => {
              setArchiveConfirmOpen(false);
              void archiveItem();
            }}
          >
            {actionBusy ? "Archiving…" : "Archive gift"}
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
            : pledgeStep === "contribute_receipt"
            ? "Upload receipt"
            : pledgeStep === "done"
            ? "Done"
            : ""
        }
        onClose={() => {
          setPledgeStep(null);
          setActionErr(null);
          setContribId(null);
          setReceiptFile(null);
          setContribAmount("");
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
              Choose how much you’ll contribute. Next, you’ll see the initiator’s payout details.
            </div>
            <label className="block">
              <div className="text-xs font-semibold text-[var(--text-secondary)]">Amount</div>
              <input
                inputMode="numeric"
                className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                value={contribAmount}
                onChange={(e) => setContribAmount(e.target.value)}
                placeholder={suggestContribPlaceholder}
              />
            </label>
            {actionErr ? <div className="text-sm text-[var(--danger-text)]">{actionErr.message}</div> : null}
            <Button className="w-full" disabled={actionBusy || !contribAmount} onClick={startContribution}>
              Continue
            </Button>
          </div>
        ) : null}

        {pledgeStep === "contribute_details" ? (
          <div className="space-y-3">
            <div className="text-sm font-semibold">Send money to the initiator</div>
            <div className="text-sm text-[var(--text-secondary)]">
              Initiator: {pledgeView?.initiation?.initiator?.name}
            </div>
            <Card className="p-4">
              <div className="text-xs font-semibold text-[var(--text-muted)]">Payout details</div>
              <div className="mt-2 text-sm">
                <div className="text-[var(--text-secondary)]">
                  Method: {pledgeView?.initiation?.payoutMethod}
                </div>
                {pledgeView?.initiation?.payoutName ? (
                  <div className="text-[var(--text-secondary)]">Name: {pledgeView.initiation.payoutName}</div>
                ) : null}
                {pledgeView?.initiation?.payoutInstitution ? (
                  <div className="text-[var(--text-secondary)]">
                    Institution: {pledgeView.initiation.payoutInstitution}
                  </div>
                ) : null}
                {pledgeView?.initiation?.payoutAccount ? (
                  <div className="text-[var(--text-secondary)]">
                    Account: {pledgeView.initiation.payoutAccount}
                  </div>
                ) : null}
                {pledgeView?.initiation?.payoutNotes ? (
                  <div className="mt-2 text-sm text-[var(--text-secondary)]">
                    {pledgeView.initiation.payoutNotes}
                  </div>
                ) : null}
              </div>
            </Card>
            {pledgeView?.initiation?.hasQrImage ? (
              pledgeQrBlobUrl ? (
                <a
                  href={pledgeQrBlobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-[var(--color-primary-700)] underline"
                >
                  Open QR image
                </a>
              ) : (
                <p className="text-xs text-[var(--text-muted)]">Loading QR…</p>
              )
            ) : null}
            <Button className="w-full" onClick={() => setPledgeStep("contribute_receipt")}>
              I sent the money — upload receipt
            </Button>
          </div>
        ) : null}

        {pledgeStep === "contribute_receipt" ? (
          <div className="space-y-3">
            <div className="text-sm text-[var(--text-secondary)]">
              Upload a screenshot/photo of your transfer receipt.
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
            />
            {actionErr ? <div className="text-sm text-[var(--danger-text)]">{actionErr.message}</div> : null}
            <Button className="w-full" disabled={actionBusy || !receiptFile} onClick={uploadContributionReceipt}>
              {actionBusy ? "Uploading…" : "Upload receipt"}
            </Button>
          </div>
        ) : null}

        {pledgeStep === "done" ? (
          <div className="space-y-3">
            <div className="text-sm font-semibold">Receipt uploaded</div>
            <div className="text-sm text-[var(--text-secondary)]">
              The pledge initiator has been notified and will review your receipt.
            </div>
            <Button className="w-full" onClick={() => setPledgeStep(null)}>
              Close
            </Button>
          </div>
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={fabOpen}
        title="Add gift item"
        variant="modal"
        onClose={() => {
          setFabOpen(false);
          setDraftItemPhotos([]);
          setActionErr(null);
        }}
      >
        <form
          className="space-y-3"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (actionBusy) return;
            void createItem();
          }}
        >
          <div>
            <div className="text-xs font-semibold text-[var(--text-secondary)]">
              Photos <span className="text-[var(--text-muted)]">(optional, up to {MAX_ITEM_PHOTOS})</span>
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
                <div className="flex flex-wrap items-start gap-2">
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
              What do you want? <span className="text-[var(--text-muted)]">(required — main gift name)</span>
            </div>
            <input
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
                value={draftItem.priceReference}
                onChange={(e) => setDraftItem((s) => ({ ...s, priceReference: e.target.value }))}
                placeholder="e.g. 1299"
              />
            </div>
          </label>
          <label className="block">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Category</div>
            <select
              className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={draftItem.category}
              onChange={(e) => setDraftItem((s) => ({ ...s, category: e.target.value }))}
            >
              {[
                "Dorm / Apartment",
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
            <div className="space-y-3">
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
          <label className="block">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">Link/URL to item</div>
            <input
              type="text"
              inputMode="url"
              autoComplete="off"
              className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={draftItem.externalLink}
              onChange={(e) => setDraftItem((s) => ({ ...s, externalLink: e.target.value }))}
              placeholder="https://…"
            />
          </label>
          <label className="block">
            <div className="text-xs font-semibold text-[var(--text-secondary)]">How many?</div>
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={draftItem.quantityNeeded}
              onChange={(e) => setDraftItem((s) => ({ ...s, quantityNeeded: e.target.value }))}
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
          <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card-soft)] p-3 text-left">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border-default)] text-[var(--color-primary-600)] focus:ring-[rgba(129,160,63,0.35)]"
              checked={Boolean(draftItem.considering)}
              onChange={(e) => setDraftItem((s) => ({ ...s, considering: e.target.checked }))}
            />
            <span className="text-sm text-[var(--text-secondary)]">
              I am still considering this.
            </span>
          </label>
          {actionErr ? <div className="text-sm text-[var(--danger-text)]">{actionErr.message}</div> : null}
          <Button type="submit" className="w-full" disabled={actionBusy}>
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
        title="Countdown to reveal"
        onClose={() => setCountdownModalOpen(false)}
      >
        <div className="space-y-6">
          <div className="rounded-[20px] bg-[linear-gradient(145deg,rgba(129,160,63,0.35),rgba(139,94,60,0.28))] p-[1px] shadow-[var(--shadow-sm)]">
            <div className="rounded-[19px] bg-[var(--surface-card)] px-3 py-6 sm:px-5">
              {countdownParts?.expired ? (
                <div className="space-y-3 text-center">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Reveal time reached</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Open the reveal page to see contributor details (if your device clock matches the server).
                  </p>
                  <Link
                    to={`/registry/${registryId}/reveal`}
                    className="block"
                    onClick={() => setCountdownModalOpen(false)}
                  >
                    <Button className="w-full">Open reveal</Button>
                  </Link>
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
                Scheduled reveal
              </div>
              <div className="mt-1 text-sm font-semibold leading-snug text-[var(--text-primary)]">
                {formatScheduleDate(data.registry.revealDatetime)}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <IconClock className="h-4 w-4 text-[var(--text-muted)]" aria-hidden />
                  <span className="tabular-nums">{formatScheduleTime(data.registry.revealDatetime)}</span>
                </span>
                <span className="text-xs text-[var(--text-muted)]">· Local Timezone</span>
              </div>
            </div>
          </div>
        </div>
      </BottomSheet>

      {role === "owner" && data.registry.joinCode ? (
        <ShareInviteModal
          joinCode={data.registry.joinCode}
          open={shareInviteOpen}
          onClose={() => setShareInviteOpen(false)}
        />
      ) : null}

      <ItemImageLightboxDialog
        open={Boolean(imageLightbox?.urls?.length)}
        urls={imageLightbox?.urls || []}
        title={imageLightbox?.title || "Gift"}
        onClose={() => setImageLightbox(null)}
      />
    </div>
  );
}

