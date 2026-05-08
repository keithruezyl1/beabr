import defaultPfp from "../assets/default_pfp.png";

export function getDisplayAvatarUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return defaultPfp;
  if (raw.endsWith("/assets/default_pfp.png") || raw === "/assets/default_pfp.png") {
    return defaultPfp;
  }
  return raw;
}
