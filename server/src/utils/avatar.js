const path = require("path");
const { config } = require("../config");

const DEFAULT_AVATAR_PATH = "/assets/default_pfp.png";
const DEFAULT_AVATAR_FILE = path.join(process.cwd(), "client", "src", "assets", "default_pfp.png");

function defaultAvatarUrl() {
  return `${String(config.serverUrl || "").replace(/\/$/, "")}${DEFAULT_AVATAR_PATH}`;
}

function isDefaultAvatarUrl(value) {
  const raw = String(value || "").trim();
  return raw.endsWith(DEFAULT_AVATAR_PATH) || raw === defaultAvatarUrl();
}

function normalizeAvatarInput(value) {
  const raw = String(value || "").trim();
  if (!raw || isDefaultAvatarUrl(raw)) return null;
  return raw;
}

function resolveAvatarUrl(value) {
  return normalizeAvatarInput(value) || defaultAvatarUrl();
}

function extractSupabaseAvatarUrl(sUser) {
  const metadata = sUser?.user_metadata || {};
  const identities = Array.isArray(sUser?.identities) ? sUser.identities : [];
  const identityData = identities.flatMap((identity) => {
    const data = identity?.identity_data;
    return data && typeof data === "object" ? [data] : [];
  });

  const candidates = [
    metadata.avatar_url,
    metadata.picture,
    metadata.picture_url,
    metadata.photo_url,
    ...identityData.map((data) => data.avatar_url),
    ...identityData.map((data) => data.picture),
    ...identityData.map((data) => data.picture_url),
    ...identityData.map((data) => data.photo_url),
  ];

  for (const candidate of candidates) {
    const normalized = normalizeAvatarInput(candidate);
    if (normalized) return normalized;
  }
  return null;
}

module.exports = {
  DEFAULT_AVATAR_FILE,
  DEFAULT_AVATAR_PATH,
  defaultAvatarUrl,
  isDefaultAvatarUrl,
  normalizeAvatarInput,
  resolveAvatarUrl,
  extractSupabaseAvatarUrl,
};
