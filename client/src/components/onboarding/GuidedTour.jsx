import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import celebrate from "../../assets/celebrate.png";
import talking1 from "../../assets/talking_1.png";
import talking2 from "../../assets/talking_2.png";
import { apiFetch } from "../../services/api";
import { useAuth } from "../../state/AuthProvider.jsx";
import { Button } from "../ui/Button.jsx";

const APP_TOUR_ROUTES = ["/dashboard", "/registries/new", "/registry/", "/success-modal"];
const TOUR_PROGRESS_KEY = "last_tour_step";
const REGISTRY_FIELD_STEP_TARGETS = new Set([
  "registry-event-type",
  "registry-display-name",
  "registry-short-message",
  "registry-main-event-date",
  "registry-reveal-date",
]);
const ADD_ITEM_STEP_TARGETS = new Set([
  "registry-add-item",
  "registry-item-photo",
  "registry-item-name",
  "registry-item-price",
  "registry-item-category",
  "registry-item-category-details",
  "registry-item-submit",
]);

const ADD_ITEM_LOWER_BUBBLE_TARGETS = new Set([
  "registry-item-price",
  "registry-item-category",
  "registry-item-category-details",
]);

const ADD_ITEM_GIFT_NAME_MOBILE_BUBBLE_CLASS = "mb-[18vh] sm:mb-[16vh]";

const steps = [
  {
    body: "I'm Beve, your gifting companion. I'll walk you through everything real quick.",
  },
  {
    kind: "name",
    body: "Before we start, what should I call you?",
  },
  {
    body: "Nice to meet you, {name}. Ready to start the tour?",
  },
  {
    body: "Here's the idea: Beabr helps you list the things you actually need, then lets invited friends and loved ones prepare gifts without guessing or duplicating.",
  },
  {
    body: "Let's make your first registry. Go ahead and click Create registry.",
    targetId: "dashboard-create-registry",
    route: "/dashboard",
    waitForClick: true,
    cta: "Go to dashboard",
  },
  {
    body: "This is where we set everything up. First, let's add a registry name. Let's do one for your birthday, or another big event that you have coming up!",
    targetId: "registry-form-basics",
    route: "/registries/new",
    cta: "Go to form",
  },
  {
    body: "Next, choose the event type so the registry fits what you're celebrating.",
    targetId: "registry-event-type",
    route: "/registries/new",
    cta: "Go to form",
  },
  {
    body: "Add the display name that the people you invite will see on this registry.",
    targetId: "registry-display-name",
    route: "/registries/new",
    cta: "Go to form",
  },
  {
    body: "Write a short message if you want to add context, thanks, or a note about the occasion.",
    targetId: "registry-short-message",
    route: "/registries/new",
    cta: "Go to form",
  },
  {
    body: "Next, let's set the event date so people understand when the celebration is happening!",
    targetId: "registry-main-event-date",
    route: "/registries/new",
    cta: "Go to form",
  },
  {
    body: "Now choose your reveal date and time. This marks when the registry reaches its celebration moment.",
    targetId: "registry-reveal-date",
    route: "/registries/new",
    cta: "Go to form",
  },
  {
    body: "Next, let's set up group visibility. Choosing Private Surprise hides names until reveal, while Open Coordination shows everyone participating. Choose whichever you'd prefer.",
    targetId: "registry-visibility",
    route: "/registries/new",
    cta: "Go to form",
  },
  {
    body: "Quick note: making a registry doesn't mean anyone has to give you something. It's just a guide, and even in Open Coordination, private notes, payout details, receipts, and hidden system records stay protected.",
    placement: "registry-visibility",
  },
  {
    body: "Alright, looks good. Accept the terms of use and click create registry when you're ready!",
    targetId: "registry-create-submit",
    highlightIds: ["registry-terms-checkbox", "registry-create-submit"],
    route: "/registries/new",
    waitForClick: true,
    cta: "Go to form",
  },
  {
    body: "Nice, this is your registry. Let's add your first item. Click Add Item.",
    targetId: "registry-add-item",
    routeMatch: "/registry/",
    waitForClick: true,
  },
  {
    body: "Let's add your first item on the registry!",
    routeMatch: "/registry/",
    dimGradient: true,
    closeAddItemOnBack: true,
    nextLabel: "Next",
  },
  {
    body: "Start by adding a photo if you have one. A clear photo helps others recognize the exact item.",
    targetId: "registry-item-photo",
    routeMatch: "/registry/",
  },
  {
    body: "Now add the gift name so people know what to look for.",
    targetId: "registry-item-name",
    routeMatch: "/registry/",
  },
  {
    body: "Add a price estimate. It helps people plan and compare options.",
    targetId: "registry-item-price",
    routeMatch: "/registry/",
  },
  {
    body: "Choose the category that best fits this item.",
    targetId: "registry-item-category",
    routeMatch: "/registry/",
  },
  {
    body: "Add the details that matter for this category, like size, color, or brand.",
    targetId: "registry-item-category-details",
    routeMatch: "/registry/",
  },
  {
    body: "When everything looks good, click Add Item.",
    targetId: "registry-item-submit",
    routeMatch: "/registry/",
    waitForClick: true,
  },
  {
    body: "Great job adding your first item. Now let's get people in. Click the share button above.",
    targetId: "registry-share",
    routeMatch: "/registry/",
    waitForClick: true,
  },
  {
    body: "This is how you can invite people in the registry. Copy the invite code, a direct link, or download your unique QR code and share it on social media!",
    targetId: "share-copy-link",
    highlightIds: ["share-invite-modal"],
    routeMatch: "/registry/",
    closeShareInviteOnNext: true,
    closeShareInviteOnBack: true,
    noDim: true,
  },
  {
    body: "We're at the end of the tour! Now you've got your first registry, added your first item, and ready to share your list to anyone you'd like.\nIf you need me, I can always give you another tour! Just click Profile > Settings > Guided Tour whenever you need to.\n\nThank you for using Beabr, {name}!",
    character: "celebrate",
    finish: true,
  },
];

function isAppTourPath(pathname) {
  return APP_TOUR_ROUTES.some((p) => (p.endsWith("/") ? pathname.startsWith(p) : pathname === p));
}

function routeMatches(step, pathname) {
  if (step.route) return pathname === step.route;
  if (step.routeMatch) return pathname.startsWith(step.routeMatch);
  return true;
}

function findTarget(targetId) {
  if (!targetId) return null;
  const el = document.querySelector(`[data-tour-id="${targetId}"]`);
  if (!el) return null;
  if (el.dataset.tourHighlight === "self") return el;
  if (el.matches("input, select, textarea")) return el.closest("label") || el;
  const control = el.querySelector("input, select, textarea");
  if (control) return control.closest("label") || control;
  return el.querySelector("button, a, [role='button']") || el;
}

function clampStepIndex(value) {
  const index = Number(value);
  if (!Number.isInteger(index)) return 0;
  return Math.min(Math.max(0, index), steps.length - 1);
}

function readTourProgress() {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(TOUR_PROGRESS_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return null;
    return {
      stepIndex: clampStepIndex(parsed.stepIndex),
      path: typeof parsed.path === "string" ? parsed.path : null,
    };
  } catch {
    return null;
  }
}

function writeTourProgress(stepIndex, path) {
  try {
    window.localStorage.setItem(
      TOUR_PROGRESS_KEY,
      JSON.stringify({
        stepIndex: clampStepIndex(stepIndex),
        path,
      })
    );
  } catch {
    // Tour progress is a convenience only; storage failures should not block onboarding.
  }
}

function clearTourProgress() {
  try {
    window.localStorage.removeItem(TOUR_PROGRESS_KEY);
  } catch {
    // Ignore storage failures.
  }
}

function pathForRouteMatch(savedPath, routeMatch) {
  if (!savedPath || !routeMatch) return null;
  try {
    const url = new URL(savedPath, window.location.origin);
    return url.pathname.startsWith(routeMatch) ? `${url.pathname}${url.search}` : null;
  } catch {
    return savedPath.startsWith(routeMatch) ? savedPath : null;
  }
}

function restorePathForStep(step, savedPath) {
  if (step.route) return step.route;
  if (step.routeMatch) return pathForRouteMatch(savedPath, step.routeMatch);
  return null;
}

function renderDialogue(body, name) {
  const tokens = body.split(/(\{name\}|Beve|Private Surprise|Open Coordination|download your unique QR code|first registry|share your list|Profile > Settings > Guided Tour)/g);
  return tokens.map((token, index) => {
    if (token === "{name}") {
      return (
        <span key={`name-${index}`} className="font-semibold text-[var(--color-primary-700)]">
          {name}
        </span>
      );
    }
    if (token === "Beve") {
      return (
        <span key={`beve-${index}`} className="font-semibold text-[var(--color-primary-700)]">
          Beve
        </span>
      );
    }
    if (token === "Private Surprise" || token === "Open Coordination") {
      return (
        <span key={`visibility-${index}`} className="font-semibold text-[var(--color-primary-700)]">
          {token}
        </span>
      );
    }
    if (
      token === "download your unique QR code" ||
      token === "first registry" ||
      token === "share your list" ||
      token === "Profile > Settings > Guided Tour"
    ) {
      return (
        <span key={`highlight-${index}`} className="font-semibold text-[var(--color-primary-700)]">
          {token}
        </span>
      );
    }
    return <span key={`text-${index}`}>{token}</span>;
  });
}

export function GuidedTour() {
  const { user, refresh } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(() => readTourProgress()?.stepIndex ?? 0);
  const [targetRect, setTargetRect] = useState(null);
  const [targetMissing, setTargetMissing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [nameDirty, setNameDirty] = useState(false);
  const [skipConfirmOpen, setSkipConfirmOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const open = Boolean(user && user.hadTour === false && !dismissed);
  const step = steps[stepIndex] || steps[steps.length - 1];
  const savedName = user?.name?.trim() || "";
  const currentNameDraft = nameDirty ? nameDraft : savedName;
  const displayName = currentNameDraft.trim() || savedName || "there";
  const firstName = displayName.split(" ")?.[0] || "there";
  const isNameStep = step.kind === "name";
  const highlightTargetId = step.highlightId || step.targetId;
  const highlightTargetIds = useMemo(() => {
    if (step.targetId === "share-copy-link") {
      return ["share-invite-qr-code", "share-download-qr-code"];
    }
    return step.highlightIds || (highlightTargetId ? [highlightTargetId] : []);
  }, [highlightTargetId, step.highlightIds, step.targetId]);
  const isRegistryCreateSubmitStep = step.targetId === "registry-create-submit";
  const isCenteredPairStep = Boolean(step.dimGradient && highlightTargetIds.length === 0);
  const canSkip = stepIndex > 1;
  const characterSrc = step.character === "celebrate" ? celebrate : stepIndex % 2 === 0 ? talking1 : talking2;

  useEffect(() => {
    function resetGuidedTour() {
      clearTourProgress();
      setStepIndex(0);
      setTargetRect(null);
      setTargetMissing(false);
      setErr(null);
      setDismissed(false);
      setSkipConfirmOpen(false);
    }

    window.addEventListener("beabr:reset-guided-tour", resetGuidedTour);
    return () => window.removeEventListener("beabr:reset-guided-tour", resetGuidedTour);
  }, []);

  useEffect(() => {
    if (!open) return;

    function syncSuccessModalState() {
      setSuccessModalOpen(document.body.classList.contains("beabr-success-modal-open"));
    }

    syncSuccessModalState();
    const observer = new MutationObserver(syncSuccessModalState);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const savedPath = readTourProgress()?.path;
    const stepPath = restorePathForStep(step, savedPath);

    if (stepPath && !routeMatches(step, location.pathname)) {
      navigate(stepPath, { replace: true });
      return;
    }

    if (!isAppTourPath(location.pathname)) {
      navigate(stepPath || "/dashboard", { replace: true });
    }
  }, [location.pathname, navigate, open, step]);

  useEffect(() => {
    if (!open) return;
    const currentPath = `${location.pathname}${location.search}`;
    const currentStepMatchesRoute = routeMatches(step, location.pathname);
    const path = isAppTourPath(location.pathname) && currentStepMatchesRoute ? currentPath : readTourProgress()?.path;
    writeTourProgress(stepIndex, path || null);
  }, [location.pathname, location.search, open, step, stepIndex]);

  useEffect(() => {
    if (!open || highlightTargetIds.length === 0 || !routeMatches(step, location.pathname)) {
      const id = window.setTimeout(() => {
        setTargetRect(null);
        setTargetMissing(Boolean(open && highlightTargetIds.length > 0 && !routeMatches(step, location.pathname)));
      }, 0);
      return () => window.clearTimeout(id);
    }

    let raf = 0;
    let retryTimer = 0;
    let observer = null;
    let restore = null;

    function elevateTargets(elements) {
      if (restore) {
        restore();
        restore = null;
      }

      const snapshots = elements.map((el) => {
        const prevPosition = el.style.position;
        const prevZIndex = el.style.zIndex;
        const prevPointerEvents = el.style.pointerEvents;
        const computedPosition = window.getComputedStyle(el).position;

        if (computedPosition === "static") el.style.position = "relative";
        el.style.zIndex = "220";
        el.style.pointerEvents = "auto";

        return { el, prevPosition, prevZIndex, prevPointerEvents };
      });
      restore = () => {
        snapshots.forEach(({ el, prevPosition, prevZIndex, prevPointerEvents }) => {
          el.style.position = prevPosition;
          el.style.zIndex = prevZIndex;
          el.style.pointerEvents = prevPointerEvents;
        });
      };
    }

    function updateRect() {
      const elements = highlightTargetIds.map((targetId) => findTarget(targetId));
      if (elements.some((el) => !el)) {
        setTargetRect(null);
        setTargetMissing(true);
        window.clearTimeout(retryTimer);
        retryTimer = window.setTimeout(updateRect, 250);
        if (restore) {
          restore();
          restore = null;
        }
        return;
      }
      const targets = Array.from(new Set(elements));
      const scrollTarget = targets[targets.length - 1];
      setTargetMissing(false);
      elevateTargets(targets);
      if (step.targetId === "registry-visibility" && window.matchMedia("(max-width: 767px)").matches) {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      } else {
        scrollTarget.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
      raf = window.requestAnimationFrame(() => {
        const rects = targets.map((target) => target.getBoundingClientRect());
        const left = Math.min(...rects.map((rect) => rect.left));
        const top = Math.min(...rects.map((rect) => rect.top));
        const right = Math.max(...rects.map((rect) => rect.right));
        const bottom = Math.max(...rects.map((rect) => rect.bottom));
        setTargetRect({
          left,
          top,
          width: right - left,
          height: bottom - top,
        });
      });
    }

    const timer = window.setTimeout(updateRect, 120);
    observer = new MutationObserver(updateRect);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(retryTimer);
      window.cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
      if (restore) restore();
    };
  }, [highlightTargetIds, location.pathname, open, step]);

  useEffect(() => {
    if (!open || !step.waitForClick || !step.targetId) return;
    function onClick(e) {
      const target = e.target instanceof Element ? e.target.closest(`[data-tour-id="${step.targetId}"]`) : null;
      if (target) {
        window.setTimeout(() => setStepIndex((i) => Math.min(i + 1, steps.length - 1)), 80);
      }
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [open, step]);

  const targetStyle = useMemo(() => {
    if (!targetRect) return null;
    const pad = 8;
    return {
      left: Math.max(8, targetRect.left - pad),
      top: Math.max(8, targetRect.top - pad),
      width: targetRect.width + pad * 2,
      height: targetRect.height + pad * 2,
    };
  }, [targetRect]);

  const bubblePlacementClass = useMemo(() => {
    if (isCenteredPairStep) {
      return `${ADD_ITEM_GIFT_NAME_MOBILE_BUBBLE_CLASS} sm:!w-[72%] md:!ml-auto md:!mr-[44%] md:mb-[12vh] md:!w-[34%] lg:!mr-[44%] lg:mb-[12vh] lg:!w-[34%]`;
    }

    if (step.targetId === "registry-create-submit") {
      return "mb-[26vh] sm:mb-[26vh] md:mb-[18vh] md:ml-[5%] lg:mb-[16vh] lg:ml-[7%]";
    }

    if (step.targetId === "registry-visibility" || step.placement === "registry-visibility") {
      return "mb-[16vh] sm:mb-[16vh] md:mb-[2vh] lg:mb-[4vh]";
    }

    if (REGISTRY_FIELD_STEP_TARGETS.has(step.targetId)) {
      return "mb-[18vh] sm:mb-[18vh] md:mb-[8vh] lg:mb-[8vh]";
    }

    if (ADD_ITEM_LOWER_BUBBLE_TARGETS.has(step.targetId)) {
      return `${ADD_ITEM_GIFT_NAME_MOBILE_BUBBLE_CLASS} md:mb-[18vh] md:ml-[5%] lg:mb-[16vh] lg:ml-[6%]`;
    }

    if (step.targetId === "registry-share") {
      return "mb-[18vh] sm:mb-[16vh] md:mb-[8vh] md:ml-[5%] lg:ml-[6%]";
    }

    if (step.targetId === "share-copy-link") {
      return "mb-[18vh] !mx-auto !w-[86%] sm:mb-[16vh] sm:!w-[82%] md:mb-[8vh] md:!ml-[5%] md:!w-[58%] lg:!ml-[6%] lg:!w-[60%]";
    }

    if (ADD_ITEM_STEP_TARGETS.has(step.targetId)) {
      if (step.targetId === "registry-item-submit") {
        return "mb-[19vh] sm:mb-[17vh] md:mb-[18vh] md:ml-[5%] lg:mb-[16vh] lg:ml-[6%]";
      }

      return targetRect?.top + targetRect?.height / 2 > (typeof window === "undefined" ? 800 : window.innerHeight) * 0.42
        ? "mb-[34vh] sm:mb-[32vh] md:mb-[18vh] md:ml-[5%] lg:mb-[16vh] lg:ml-[6%]"
        : "mb-[18vh] sm:mb-[16vh] md:mb-[8vh] md:ml-[5%] lg:ml-[6%]";
    }

    if (stepIndex < 4) {
      return "mb-[18vh] sm:mb-[16vh] md:mb-[10vh]";
    }

    if (!targetRect) {
      return "mb-[22vh] sm:mb-[20vh] md:mb-[10vh]";
    }

    const viewportHeight = typeof window === "undefined" ? 800 : window.innerHeight;
    const targetMidpoint = targetRect.top + targetRect.height / 2;

    if (targetMidpoint > viewportHeight * 0.42) {
      return "mb-[34vh] sm:mb-[32vh] md:mb-[18vh] lg:mb-[16vh]";
    }

    return "mb-[18vh] sm:mb-[16vh] md:mb-[8vh]";
  }, [isCenteredPairStep, step.placement, step.targetId, stepIndex, targetRect]);

  if (!open) return null;

  async function completeTour() {
    setSaving(true);
    setErr(null);
    try {
      await apiFetch("/api/auth/me/tour", { method: "PATCH" });
      clearTourProgress();
      setDismissed(true);
      await refresh({ silent: true });
    } catch (e) {
      setErr(e);
    } finally {
      setSaving(false);
    }
  }

  function requestSkipTour() {
    setErr(null);
    setSkipConfirmOpen(true);
  }

  function cancelSkipTour() {
    if (saving) return;
    setSkipConfirmOpen(false);
  }

  async function confirmSkipTour() {
    setSkipConfirmOpen(false);
    await completeTour();
  }

  function goToStepRoute() {
    const targetRoute = step.route || (step.routeMatch === "/registry/" ? null : step.routeMatch);
    setErr(null);
    if (targetRoute) navigate(targetRoute);
  }

  function next() {
    setErr(null);
    if (step.closeShareInviteOnNext) {
      window.dispatchEvent(new CustomEvent("beabr:close-share-invite-modal"));
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  async function saveNameAndNext(e) {
    e?.preventDefault();
    const nextName = currentNameDraft.trim();
    if (!nextName) {
      setErr(new Error("Enter the name you want Beve to use."));
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      if (nextName !== savedName) {
        await apiFetch("/api/auth/me", {
          method: "PATCH",
          body: JSON.stringify({ name: nextName }),
        });
        await refresh({ silent: true });
      }
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    } catch (e2) {
      setErr(e2);
    } finally {
      setSaving(false);
    }
  }

  function back() {
    setErr(null);
    if (step.closeAddItemOnBack) {
      window.dispatchEvent(new CustomEvent("beabr:close-add-item-modal"));
    }
    if (step.closeShareInviteOnBack) {
      window.dispatchEvent(new CustomEvent("beabr:close-share-invite-modal"));
    }
    setStepIndex((i) => Math.max(0, i - 1));
  }

  const body = renderDialogue(step.body, firstName);
  const canNavigate = Boolean(step.route && location.pathname !== step.route);
  const waitingForRegistryTarget = Boolean(step.routeMatch === "/registry/" && targetMissing && !canNavigate);
  const autoAdvanceOnClick = Boolean(step.waitForClick && !canNavigate);
  const waitingForCreatedRegistry = Boolean(step.routeMatch === "/registry/" && location.pathname === "/success-modal");
  const shouldSuppressDim = Boolean(step.noDim && step.targetId !== "share-copy-link");
  if (waitingForCreatedRegistry || successModalOpen) return null;

  return createPortal(
    <>
      {!targetStyle && step.dimGradient ? (
        <div
          className="pointer-events-none fixed inset-0 z-[160] bg-[linear-gradient(to_top,rgba(29,33,26,0.58)_0%,rgba(29,33,26,0.38)_42%,rgba(29,33,26,0.12)_78%,rgba(29,33,26,0.04)_100%)]"
          aria-hidden
        />
      ) : null}
      {!targetStyle && !step.dimGradient && !shouldSuppressDim ? (
        <div
          className="pointer-events-none fixed inset-0 z-[160] bg-[rgba(29,33,26,0.46)]"
          aria-hidden
        />
      ) : null}
      {targetStyle ? (
        <div
          className={`pointer-events-none fixed z-[230] rounded-[22px] border-2 border-[var(--color-primary-500)] transition-all duration-200 ${
            shouldSuppressDim
              ? "shadow-[0_0_0_6px_rgba(255,255,255,0.75),0_10px_30px_rgba(29,33,26,0.18)]"
              : "shadow-[0_0_0_6px_rgba(255,255,255,0.75),0_0_0_9999px_rgba(29,33,26,0.46),0_10px_30px_rgba(29,33,26,0.18)]"
          }`}
          style={targetStyle}
          aria-hidden
        />
      ) : null}
      <div className="pointer-events-none fixed inset-0 z-[300] flex items-end justify-center overflow-hidden px-3 pb-3 pt-20 sm:px-6 sm:pb-8 lg:pb-10" aria-live="polite">
        <section
          role="dialog"
          aria-modal="false"
          aria-label="Guided tour"
          className="relative grid h-full w-full max-w-6xl grid-cols-1 items-end gap-3 sm:gap-5"
        >
          <div className={`pointer-events-auto relative z-[4] order-1 mx-auto w-[90%] min-w-0 rounded-[20px] bg-white px-4 py-3.5 text-left shadow-[var(--shadow-lg)] ring-1 ring-[var(--border-subtle)] sm:w-[86%] sm:px-5 sm:py-5 md:ml-0 md:mr-auto md:w-[58%] md:rounded-[26px] lg:w-[60%] ${bubblePlacementClass}`}>
            <span
              className={`absolute bottom-[-0.72rem] right-10 h-6 w-6 rotate-45 rounded-br-[6px] bg-white md:bottom-8 md:right-[-0.65rem] md:h-8 md:w-8 ${
                isRegistryCreateSubmitStep ? "hidden md:block" : ""
              }`}
              aria-hidden
            />
            <div className="relative z-[1]">
              <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">{body}</p>
              {isNameStep ? (
                <form className="mt-4" onSubmit={saveNameAndNext}>
                  <label className="block text-left">
                    <span className="sr-only">Name</span>
                    <input
                      className="w-full rounded-[14px] border border-[var(--border-default)] bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(129,160,63,0.18)]"
                      value={currentNameDraft}
                      onChange={(e) => {
                        setNameDirty(true);
                        setNameDraft(e.target.value);
                      }}
                      autoComplete="name"
                      maxLength={80}
                      placeholder="Enter your name"
                      disabled={saving}
                    />
                  </label>
                </form>
              ) : null}
              {targetMissing && !canNavigate ? (
                <p className="mt-3 text-sm leading-relaxed text-[var(--warning-text)]">
                  I can't see that control yet. Finish the current screen action, then this step will highlight it.
                </p>
              ) : null}
              {err ? <p className="mt-3 text-sm text-[var(--danger-text)]">{err.message}</p> : null}
            </div>
            <div className="relative z-[1] mt-4 flex items-end justify-between gap-3">
              {canSkip ? (
                <button
                  type="button"
                  className="min-h-[44px] shrink-0 self-end rounded-full bg-transparent px-0 py-3 text-left text-sm font-semibold text-[var(--text-secondary)] transition hover:text-[var(--color-primary-700)] active:text-[var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={requestSkipTour}
                  disabled={saving}
                >
                  Skip tour
                </button>
              ) : (
                <span aria-hidden />
              )}
              <div className="flex min-w-0 flex-wrap justify-end gap-2">
                {stepIndex > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-h-[44px]"
                    onClick={back}
                    disabled={saving}
                  >
                    Back
                  </Button>
                ) : null}
                {isNameStep ? (
                  <Button type="button" className="min-h-[44px]" onClick={saveNameAndNext} disabled={saving || !currentNameDraft.trim()}>
                    {saving ? "Saving..." : "Continue"}
                  </Button>
                ) : canNavigate ? (
                  <Button type="button" className="min-h-[44px]" onClick={goToStepRoute} disabled={saving}>
                    {step.cta || "Go there"}
                  </Button>
                ) : step.finish ? (
                  <Button type="button" className="min-h-[44px]" onClick={completeTour} disabled={saving}>
                    {saving ? "Finishing..." : "Finish"}
                  </Button>
                ) : autoAdvanceOnClick ? null : (
                  <Button type="button" className="min-h-[44px]" onClick={next} disabled={saving || waitingForRegistryTarget}>
                    {waitingForRegistryTarget ? "Waiting..." : step.nextLabel || "Continue"}
                  </Button>
                )}
              </div>
            </div>
          </div>
            <img
            src={characterSrc}
            alt=""
            className={`pointer-events-none absolute bottom-[-12vh] left-[78%] z-[3] h-[25vh] max-h-[15rem] w-auto -translate-x-1/2 object-contain drop-shadow-[0_18px_28px_rgba(29,33,26,0.28)] sm:bottom-[-12vh] sm:left-[62%] sm:h-[30vh] sm:max-h-[17rem] md:bottom-[-16vh] md:left-auto md:h-[38vh] md:max-h-[25rem] md:translate-x-0 lg:h-[40vh] lg:max-h-[29rem] ${
              isCenteredPairStep ? "md:right-[3%]" : "md:right-0"
            } ${
              isRegistryCreateSubmitStep ? "hidden md:block" : ""
            }`}
            aria-hidden
          />
        </section>
      </div>
      {skipConfirmOpen ? (
        <div className="fixed inset-0 z-[400] flex items-center justify-center px-4" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(29,33,26,0.52)] backdrop-blur-sm"
            aria-label="Cancel skipping tour"
            onClick={cancelSkipTour}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="skip-tour-title"
            aria-describedby="skip-tour-description"
            className="pointer-events-auto relative z-[1] w-full max-w-sm rounded-[22px] bg-white p-5 text-left shadow-[var(--shadow-lg)] ring-1 ring-[var(--border-subtle)]"
          >
            <h2 id="skip-tour-title" className="text-base font-semibold text-[var(--text-primary)]">
              Skip guided tour?
            </h2>
            <p id="skip-tour-description" className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              You can retake this tour anytime from{" "}
              <span className="whitespace-nowrap font-semibold text-[var(--color-primary-700)]">Profile &gt; Settings</span>.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" className="w-full sm:flex-1" onClick={cancelSkipTour} disabled={saving}>
                Keep going
              </Button>
              <Button type="button" className="w-full sm:flex-1" onClick={confirmSkipTour} disabled={saving}>
                {saving ? "Skipping..." : "Skip tour"}
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </>,
    document.body
  );
}
