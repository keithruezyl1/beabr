import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthProvider.jsx";
import { SuccessModal } from "../components/ui/SuccessModal.jsx";
import { resolveSuccessModalVariant } from "../utils/successModalVariants.js";

export function SuccessModalPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const nextPath = useMemo(() => {
    const raw = new URLSearchParams(location.search).get("next");
    if (!raw) return null;
    try {
      const decoded = decodeURIComponent(raw);
      if (!decoded.startsWith("/")) return null;
      if (decoded.startsWith("//")) return null;
      return decoded;
    } catch {
      return null;
    }
  }, [location.search]);

  const variantKey = useMemo(() => new URLSearchParams(location.search).get("variant") || "", [location.search]);
  const variant = useMemo(() => resolveSuccessModalVariant(variantKey), [variantKey]);

  const primaryHref = user ? nextPath || "/dashboard" : "/login";
  const ctaLabel = variant?.ctaLabel || (user ? "Continue" : "Log in to continue");

  return (
    <SuccessModal
      open
      badgeLabel={variant?.badgeLabel || "Success"}
      title={variant?.title || "You’re all set"}
      subtitle={variant?.subtitle || "Your changes are saved. You can keep going, or close this screen anytime."}
      ctaLabel={ctaLabel}
      ctaTo={primaryHref}
      onClose={() => nav(-1)}
    />
  );
}

