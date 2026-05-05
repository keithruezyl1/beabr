import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import logoHead from "../../assets/logo_head.png";
import exportCard from "../../assets/export_card.png";

const EXPORT_QR_SIZE = 570;
const EXPORT_CARD_QR_X = 227;
const EXPORT_CARD_QR_Y = 270;
const EXPORT_CARD_LINK_Y = 946;
const EXPORT_CARD_LINK_MAX_WIDTH = 700;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function triggerPngDownload(canvas, name) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}

function fitCenteredText(ctx, text, y) {
  let fontSize = 28;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#4B611F";

  do {
    ctx.font = `600 ${fontSize}px Inter, Manrope, system-ui, sans-serif`;
    if (ctx.measureText(text).width <= EXPORT_CARD_LINK_MAX_WIDTH || fontSize <= 16) break;
    fontSize -= 1;
  } while (true);

  ctx.fillText(text, ctx.canvas.width / 2, y);
}

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
}) {
  const mountRef = useRef(null);
  const qrRef = useRef(null);
  const [ready, setReady] = useState(false);

  const colors = useMemo(() => {
    return {
      fg: resolveCssVar(fgColor),
      bg: resolveCssVar(bgColor),
    };
  }, [bgColor, fgColor]);


  const createQrCode = useCallback((qrSize, type = "svg") => {
    const scaledMargin = Math.max(12, Math.round(qrSize * (12 / size)));
    const scaledImageMargin = Math.max(6, Math.round(qrSize * (6 / size)));

    return new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      type,
      data: value || "",
      margin: scaledMargin,
      image: logoHead,
      qrOptions: { errorCorrectionLevel: "H" },
      backgroundOptions: { color: colors.bg },
      dotsOptions: { type: "rounded", color: colors.fg },
      cornersSquareOptions: { type: "extra-rounded", color: colors.fg },
      cornersDotOptions: { type: "dot", color: colors.fg },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: scaledImageMargin,
        imageSize: 0.22,
        hideBackgroundDots: true,
      },
    });
  }, [colors.bg, colors.fg, size, value]);

  useEffect(() => {
    if (!mountRef.current) return;

    const qr = createQrCode(size);

    mountRef.current.innerHTML = "";
    qr.append(mountRef.current);
    qrRef.current = qr;
    setReady(Boolean(value));

    return () => {
      qrRef.current = null;
      setReady(false);
      if (mountRef.current) mountRef.current.innerHTML = "";
    };
  }, [createQrCode, size, value]);

  useEffect(() => {
    if (!qrRef.current) return;
    qrRef.current.update({ data: value || "" });
    setReady(Boolean(value));
  }, [value]);

  const download = async (extension) => {
    if (!ready) return;

    try {
      const [cardImage, qrBlob] = await Promise.all([
        loadImage(exportCard),
        createQrCode(EXPORT_QR_SIZE, "canvas").getRawData(extension),
      ]);
      const qrUrl = URL.createObjectURL(qrBlob);
      const qrImage = await loadImage(qrUrl);
      URL.revokeObjectURL(qrUrl);

      const canvas = document.createElement("canvas");
      canvas.width = cardImage.naturalWidth || cardImage.width;
      canvas.height = cardImage.naturalHeight || cardImage.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(cardImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(qrImage, EXPORT_CARD_QR_X, EXPORT_CARD_QR_Y, EXPORT_QR_SIZE, EXPORT_QR_SIZE);
      fitCenteredText(ctx, value, EXPORT_CARD_LINK_Y);
      triggerPngDownload(canvas, qrName);
    } catch (error) {
      console.error("Could not export framed QR code", error);
      createQrCode(EXPORT_QR_SIZE, "canvas").download({ name: qrName, extension });
    }
  };


  return (
    <div className={`mx-auto flex w-fit max-w-full flex-col items-center rounded-[var(--radius-lg)] bg-white p-1 sm:p-2 ${className}`}>
      <div className="flex w-full max-w-full justify-center rounded-[var(--radius-md)] bg-white p-1">
        <div className="grid max-w-full place-items-center rounded-[14px] bg-white p-1">
          <div ref={mountRef} className="grid max-w-full place-items-center overflow-hidden [&_canvas]:block [&_canvas]:h-auto [&_canvas]:max-w-full [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full" />
        </div>
      </div>
      <button
        type="button"
        onClick={() => download("png")}
        disabled={!ready}
        className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-semibold text-[var(--button-primary-text)] shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--button-primary-bg-hover)] active:bg-[var(--color-primary-700)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
          <path
            d="M12 3v10m0 0 4-4m-4 4-4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 15v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>Download QR code</span>
      </button>
    </div>
  );
}
