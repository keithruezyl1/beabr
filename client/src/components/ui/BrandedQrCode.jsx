import { useEffect, useMemo, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import logoHead from "../../assets/logo_head.png";

function resolveCssVar(value) {
  if (typeof window === "undefined") return value;
  if (!value?.startsWith("var(")) return value;
  const varName = value.slice(4, -1).trim();
  const resolved = window.getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return resolved || value;
}

export function BrandedQrCode({
  value,
  size = 176,
  className = "",
  qrName = "beabr-invite",
  fgColor = "var(--text-primary)",
  bgColor = "#FFFFFF",
  frameBorderColor = "var(--border-default)",
}) {
  const mountRef = useRef(null);
  const qrRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [armed, setArmed] = useState(false);

  const colors = useMemo(() => {
    return {
      fg: resolveCssVar(fgColor),
      bg: resolveCssVar(bgColor),
      frame: resolveCssVar(frameBorderColor),
    };
  }, [bgColor, fgColor, frameBorderColor]);

  const supportsHover = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return true;
    return window.matchMedia("(hover: hover)").matches;
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const qr = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: value || "",
      margin: 12,
      image: logoHead,
      qrOptions: { errorCorrectionLevel: "H" },
      backgroundOptions: { color: colors.bg },
      dotsOptions: { type: "rounded", color: colors.fg },
      cornersSquareOptions: { type: "extra-rounded", color: colors.fg },
      cornersDotOptions: { type: "dot", color: colors.fg },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 6,
        imageSize: 0.22,
        hideBackgroundDots: true,
      },
    });

    mountRef.current.innerHTML = "";
    qr.append(mountRef.current);
    qrRef.current = qr;
    setReady(Boolean(value));
    setArmed(false);

    return () => {
      qrRef.current = null;
      setReady(false);
      setArmed(false);
      if (mountRef.current) mountRef.current.innerHTML = "";
    };
  }, [colors.bg, colors.fg, size]);

  useEffect(() => {
    if (!qrRef.current) return;
    qrRef.current.update({ data: value || "" });
    setReady(Boolean(value));
    setArmed(false);
  }, [value]);

  const download = (extension) => {
    if (!qrRef.current || !ready) return;
    qrRef.current.download({ name: qrName, extension });
  };

  const onDownloadIntent = () => {
    if (!ready) return;
    if (supportsHover) {
      download("png");
      return;
    }
    if (!armed) {
      setArmed(true);
      window.setTimeout(() => setArmed(false), 2200);
      return;
    }
    download("png");
  };

  return (
    <div className={`rounded-[var(--radius-lg)] bg-[var(--surface-card-soft)] p-4 ring-1 ring-[var(--border-subtle)] ${className}`}>
      <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        Scan to open join link
      </p>
      <div className="mt-3 flex justify-center rounded-[var(--radius-md)] bg-white p-3">
        <button
          type="button"
          onClick={onDownloadIntent}
          disabled={!ready}
          className="group relative rounded-[14px] bg-white p-2 transition disabled:cursor-not-allowed disabled:opacity-60"
          style={{ border: `1px solid ${colors.frame}` }}
          aria-label={supportsHover ? "Download QR code" : armed ? "Tap again to download QR code" : "Tap to show download"}
        >
          <div
            className={`transition-[filter] duration-150 ease-out ${armed ? "blur-[1.5px]" : "group-hover:blur-[1.5px]"}`}
            aria-hidden
          >
            <div ref={mountRef} />
          </div>

          <div
            className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-150 ${
              armed ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            aria-hidden
          >
            <div
              className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-primary-500)] shadow-[var(--shadow-sm)]"
              style={{ border: "1px solid rgba(255,255,255,0.65)" }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
                <path
                  d="M12 3v10m0 0l4-4m-4 4l-4-4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 15v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

