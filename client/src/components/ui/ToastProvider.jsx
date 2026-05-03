import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);

const EXIT_MS = 280;
const AUTO_DISMISS_MS = 3000;

function IconClose({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function variantClasses(variant) {
  if (variant === "error") {
    return "border-[rgba(155,28,28,0.22)] bg-[var(--danger-bg)] text-[var(--danger-text)]";
  }
  if (variant === "caution") {
    return "border-[rgba(138,98,0,0.22)] bg-[var(--warning-bg)] text-[var(--warning-text)]";
  }
  return "border-[rgba(75,97,31,0.22)] bg-[var(--success-bg)] text-[var(--success-text)]";
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    const t = timersRef.current.get(id);
    if (t) clearTimeout(t);
    timersRef.current.delete(id);

    setToasts((prev) => prev.map((x) => (x.id === id ? { ...x, exiting: true } : x)));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, EXIT_MS);
  }, []);

  const push = useCallback(
    (message, variant = "success") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, variant, exiting: false }]);
      const timer = window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
      caution: (message) => push(message, "caution"),
    }),
    [push]
  );

  const viewport =
    typeof document !== "undefined"
      ? createPortal(
          <div
            className="pointer-events-none fixed right-4 top-4 z-[200] flex max-w-[min(420px,calc(100vw-2rem))] flex-col-reverse items-end gap-2"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {toasts.map((t) => (
              <div
                key={t.id}
                role="status"
                className={`pointer-events-auto flex w-full items-start gap-2 rounded-[var(--radius-md)] border px-3 py-2.5 text-sm font-medium shadow-[var(--shadow-md)] ring-1 ring-black/[0.03] ${variantClasses(
                  t.variant
                )} beabr-toast-chip ${t.exiting ? "beabr-toast-chip--exit" : ""}`}
              >
                <p className="min-w-0 flex-1 leading-snug">{t.message}</p>
                <button
                  type="button"
                  className="-m-1 shrink-0 rounded-[var(--radius-sm)] p-1 opacity-80 outline-none transition hover:opacity-100 focus-visible:ring-2 focus-visible:ring-[rgba(129,160,63,0.35)]"
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                >
                  <IconClose className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>,
          document.body
        )
      : null;

  return (
    <ToastContext.Provider value={api}>
      {children}
      {viewport}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
