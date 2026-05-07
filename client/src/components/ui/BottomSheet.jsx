import { useEffect } from "react";
import { createPortal } from "react-dom";

function IconX({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BottomSheet({
  open,
  onClose,
  title,
  /** Rendered alongside `title` (e.g. category pill top-right); keep `title` for primary heading text */
  titleAccessory,
  /** Shown directly under the title row (e.g. price line) */
  headerBelow,
  children,
  variant = "sheet",
  /** Non-confirmation modals should have a top-right close affordance. */
  showCloseIcon = true,
  contentTourId,
}) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const isModal = variant === "modal";
  const modalChromeHeader = Boolean(title || titleAccessory || headerBelow);
  const shouldShowCloseIcon = Boolean(isModal && showCloseIcon);

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="presentation">
      <button
        type="button"
        aria-label="Close"
        className={`absolute inset-0 z-0 bg-[rgba(29,33,26,0.55)] focus:outline-none ${isModal ? "backdrop-blur-md" : "backdrop-blur-sm"}`}
        onClick={onClose}
      />
      {isModal ? (
        <div className="absolute inset-0 z-[1] flex items-center justify-center p-4 pointer-events-none">
          <div
            data-tour-id={contentTourId}
            className="pointer-events-auto relative flex max-h-[min(90vh,880px)] w-full max-w-[560px] flex-col overflow-hidden rounded-[24px] bg-[var(--surface-card)] shadow-[var(--shadow-lg)]"
          >
            {shouldShowCloseIcon ? (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--text-muted)] transition-colors hover:text-[var(--color-primary-600)] active:text-[var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-0"
                aria-label="Close"
              >
                <IconX className="h-5 w-5" aria-hidden />
              </button>
            ) : null}
            {(title || titleAccessory || headerBelow) ? (
              <div className="px-5 pb-3 pt-4">
                {title || titleAccessory ? (
                  <div className="flex items-start justify-between gap-3">
                    {title ? (
                      <div className={`min-w-0 flex-1 text-base font-semibold leading-snug ${shouldShowCloseIcon ? "pr-10" : ""}`}>
                        {title}
                      </div>
                    ) : (
                      <div className="min-w-0 flex-1" />
                    )}
                    {titleAccessory ? (
                      <div className={`shrink-0 pt-0.5 ${shouldShowCloseIcon ? "mr-12" : ""}`}>{titleAccessory}</div>
                    ) : null}
                  </div>
                ) : null}
                {headerBelow ? (
                  <div className={title || titleAccessory ? "mt-1.5" : ""}>{headerBelow}</div>
                ) : null}
              </div>
            ) : null}
            <div
              className={`max-h-[74vh] min-h-0 flex-1 overflow-auto px-5 pb-6 ${
                modalChromeHeader ? "pt-0" : shouldShowCloseIcon ? "pt-12" : "pt-6"
              }`}
            >
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div
          data-tour-id={contentTourId}
          className="absolute inset-x-0 bottom-0 z-[1] mx-auto w-full max-w-md rounded-t-[24px] bg-[var(--surface-card)] shadow-[var(--shadow-lg)]"
        >
          <div className="px-5 pb-3 pt-4">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[var(--border-strong)]" />
            {title || titleAccessory || headerBelow ? (
              <>
                {title || titleAccessory ? (
                  <div className="flex items-start justify-between gap-3">
                    {title ? (
                      <div className="min-w-0 flex-1 text-base font-semibold leading-snug">{title}</div>
                    ) : (
                      <div className="min-w-0 flex-1" />
                    )}
                    {titleAccessory ? <div className="shrink-0 pt-0.5">{titleAccessory}</div> : null}
                  </div>
                ) : null}
                {headerBelow ? (
                  <div className={title || titleAccessory ? "mt-1.5" : ""}>{headerBelow}</div>
                ) : null}
              </>
            ) : null}
          </div>
          <div className="max-h-[70vh] min-h-0 flex-1 overflow-auto px-5 pb-6">{children}</div>
        </div>
      )}
    </div>,
    document.body
  );
}
