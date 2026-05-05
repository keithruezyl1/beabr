import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import { BottomSheet } from "../ui/BottomSheet.jsx";
import { Button } from "../ui/Button.jsx";
import { apiFetch } from "../../services/api";
import { IconCamera, IconImageUp } from "../ui/PageIcons.jsx";
import { parseInviteCodeFromQrText } from "../../utils/joinInviteParse.js";
import { BevesReminders } from "./BevesReminders.jsx";

function decodeQrFromImageFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) {
        reject(new Error("Invalid image"));
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not read image"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const result = jsQR(imageData.data, imageData.width, imageData.height);
      resolve(result?.data ?? null);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };
    img.src = url;
  });
}

export function JoinRegistryModal({ open, onClose, initialCode = "" }) {
  const nav = useNavigate();
  const hintId = useId();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const normalizedInitialCode = String(initialCode || "").trim().toUpperCase();

  const [code, setCode] = useState(() => normalizedInitialCode);
  const [nickname, setNickname] = useState("");
  const [hideAvatar, setHideAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrBusy, setQrBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [cameraErr, setCameraErr] = useState(null);
  const [scanCamera, setScanCamera] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [registryPreview, setRegistryPreview] = useState(null);
  const openCoordination = registryPreview?.visibilityMode === "open_coordination";

  const stopCamera = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (!open) stopCamera();
  }, [open, stopCamera]);

  useEffect(() => {
    if (!open) return;
    setCode(normalizedInitialCode);
    setErr(null);
    setRegistryPreview(null);
  }, [open, normalizedInitialCode]);

  useEffect(() => {
    if (!open) setTermsAccepted(false);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const normalized = code.trim().replace(/\s+/g, "").toUpperCase();
    if (normalized.length < 3) {
      setRegistryPreview(null);
      return undefined;
    }

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      try {
        const data = await apiFetch("/api/registries/join/preview", {
          method: "POST",
          body: JSON.stringify({ joinCode: normalized }),
        });
        if (!cancelled) setRegistryPreview(data.registry || null);
      } catch {
        if (!cancelled) setRegistryPreview(null);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [code, open]);

  useEffect(() => {
    if (!open || !scanCamera) {
      stopCamera();
      return undefined;
    }

    const video = videoRef.current;
    if (!video) return undefined;

    let cancelled = false;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      queueMicrotask(() => {
        setCameraErr("Could not start the camera preview.");
        setScanCamera(false);
      });
      return undefined;
    }

    let lastScan = 0;

    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraErr("Camera access is not available in this browser.");
        setScanCamera(false);
        return;
      }
      if (typeof window !== "undefined" && !window.isSecureContext) {
        setCameraErr("Camera requires a secure connection (HTTPS). Try uploading a photo of the QR code instead.");
        setScanCamera(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        video.srcObject = stream;
        video.playsInline = true;
        await video.play();
      } catch {
        if (!cancelled) {
          setCameraErr("Could not access the camera. Check permissions or enter the code manually.");
          setScanCamera(false);
        }
        return;
      }

      function tick(now) {
        if (cancelled) return;
        rafRef.current = requestAnimationFrame(tick);
        if (now - lastScan < 220) return;
        lastScan = now;
        const v = videoRef.current;
        if (!v || v.readyState < v.HAVE_CURRENT_DATA) return;
        const w = v.videoWidth;
        const h = v.videoHeight;
        if (!w || !h) return;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(v, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const result = jsQR(imageData.data, imageData.width, imageData.height);
        if (result?.data) {
          const parsed = parseInviteCodeFromQrText(result.data);
          if (parsed) {
            cancelled = true;
            stopCamera();
            setScanCamera(false);
            setCameraErr(null);
            setCode(parsed);
            setErr(null);
            return;
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    })();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [open, scanCamera, stopCamera]);

  async function onJoin(e) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const body = {
        joinCode: code.trim().toUpperCase(),
        hideAvatar: openCoordination ? false : hideAvatar,
      };
      const trimmed = nickname.trim();
      if (!openCoordination && trimmed.length > 0) body.publicDisplayName = trimmed;

      const data = await apiFetch("/api/registries/join", {
        method: "POST",
        body: JSON.stringify(body),
      });
      onClose();
      const registryPath = `/registry/${data.registryId}`;
      nav(`/success-modal?variant=registry_joined&next=${encodeURIComponent(registryPath)}`);
    } catch (e2) {
      setErr(e2);
    } finally {
      setLoading(false);
    }
  }

  async function onQrFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setQrBusy(true);
    setErr(null);
    try {
      const text = await decodeQrFromImageFile(file);
      const parsed = text ? parseInviteCodeFromQrText(text) : null;
      if (!parsed) {
        setErr({
          message:
            "No join code found in that image. Use a clear photo of the QR code, or type the code above.",
        });
        return;
      }
      setCode(parsed);
    } catch {
      setErr({ message: "Could not read that image. Try another file or enter the code manually." });
    } finally {
      setQrBusy(false);
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Join registry" variant="modal">
      <form className="space-y-5" onSubmit={onJoin}>
        <div className="space-y-3">
          <p
            id={`${hintId}-join-heading`}
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            Enter a registry code or scan a QR code to join
          </p>
          <label className="block text-left">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Join code</span>
            <input
              className="mt-1 min-h-[44px] w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm uppercase tracking-wider outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ABC123"
              required
              autoComplete="off"
              spellCheck="false"
              aria-describedby={`${hintId}-join-heading ${hintId}-before-list`}
            />
          </label>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="secondary"
              className="min-h-[44px] w-full gap-2"
              onClick={() => {
                setErr(null);
                setCameraErr(null);
                setScanCamera((s) => !s);
              }}
            >
              <IconCamera className="h-4 w-4 shrink-0" aria-hidden />
              {scanCamera ? "Stop camera" : "Use camera"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="min-h-[44px] w-full gap-2"
              disabled={qrBusy}
              onClick={() => fileInputRef.current?.click()}
            >
              <IconImageUp className="h-4 w-4 shrink-0" aria-hidden />
              {qrBusy ? "Reading…" : "Upload QR image"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Upload a photo of the invite QR code"
              onChange={onQrFile}
              disabled={qrBusy}
            />
          </div>
        </div>

        {cameraErr ? (
          <div className="rounded-[var(--radius-md)] border border-[rgba(155,28,28,0.2)] bg-[var(--danger-bg)] px-3 py-2 text-sm text-[var(--danger-text)]" role="status">
            {cameraErr}
          </div>
        ) : null}

        {scanCamera ? (
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-neutral-900)] ring-1 ring-[var(--border-subtle)]">
            <video ref={videoRef} className="aspect-[4/3] w-full object-cover" muted playsInline aria-label="Camera preview for QR scanning" />
            <p className="px-3 py-2 text-center text-xs text-white/90">Point at the invite QR code. The code will fill in automatically.</p>
          </div>
        ) : null}

        {!openCoordination ? (
          <section
            className="rounded-[var(--radius-lg)] bg-white p-4 shadow-[var(--shadow-xs)] ring-1 ring-[var(--border-subtle)]"
            aria-labelledby={`${hintId}-appear-title`}
          >
            <h3 id={`${hintId}-appear-title`} className="text-xs font-semibold text-[var(--text-secondary)]">
              How you appear <span className="font-normal text-[var(--text-muted)]">(optional)</span>
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              Your nickname may appear to other participants. The registry owner cannot identify you before reveal.
            </p>
            <label className="mt-4 block text-left">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Nickname</span>
              <input
                className="mt-1 min-h-[40px] w-full rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-card-soft)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Defaults to your account name"
                maxLength={80}
                autoComplete="off"
              />
            </label>
            <label className="mt-3 flex min-h-[44px] cursor-pointer items-center gap-3 text-left">
              <input
                type="checkbox"
                className="h-4 w-4 shrink-0 rounded border-[var(--border-default)] text-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)]"
                checked={hideAvatar}
                onChange={(e) => setHideAvatar(e.target.checked)}
              />
              <span className="text-sm leading-snug text-[var(--text-secondary)]">
                Show initials instead of my profile photo
              </span>
            </label>
          </section>
        ) : null}

        <BevesReminders
          variant="join"
          hintId={hintId}
          termsAccepted={termsAccepted}
          onTermsAcceptedChange={setTermsAccepted}
        />

        {err ? (
          <div className="rounded-[14px] border border-[rgba(155,28,28,0.2)] bg-[var(--danger-bg)] px-3 py-2 text-sm text-[var(--danger-text)]">
            {err.message}
          </div>
        ) : null}

        <Button type="submit" className="min-h-[44px] w-full" disabled={loading || !code.trim() || !termsAccepted}>
          {loading ? "Joining…" : "Join registry"}
        </Button>
      </form>
    </BottomSheet>
  );
}
