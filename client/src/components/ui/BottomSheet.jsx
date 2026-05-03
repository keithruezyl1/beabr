import { useEffect } from "react";
import { createPortal } from "react-dom";

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

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="presentation">
      <button
        type="button"
        aria-label="Close"
        className={`absolute inset-0 z-0 bg-[rgba(29,33,26,0.55)] ${isModal ? "backdrop-blur-md" : "backdrop-blur-sm"}`}
        onClick={onClose}
      />
      {isModal ? (
        <div className="absolute inset-0 z-[1] flex items-center justify-center p-4 pointer-events-none">
          <div className="pointer-events-auto flex max-h-[min(90vh,880px)] w-full max-w-[560px] flex-col overflow-hidden rounded-[24px] bg-[var(--surface-card)] shadow-[var(--shadow-lg)]">
            {(title || titleAccessory || headerBelow) ? (
              <div className="px-5 pb-3 pt-4">
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
              </div>
            ) : null}
            <div
              className={`max-h-[74vh] min-h-0 flex-1 overflow-auto px-5 pb-6 ${modalChromeHeader ? "pt-0" : "pt-6"}`}
            >
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0 z-[1] mx-auto w-full max-w-md rounded-t-[24px] bg-[var(--surface-card)] shadow-[var(--shadow-lg)]">
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

