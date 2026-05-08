import defaultPfp from "../assets/default_pfp.png";

export function getDisplayAvatarUrl(value) {
  return String(value || "").trim() || defaultPfp;
}
