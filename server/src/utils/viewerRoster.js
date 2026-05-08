const { resolveAvatarUrl } = require("./avatar");

/**
 * Build dashboard roster payload for gift givers (viewers) on a registry.
 * When the current user is the owner and the registry is not yet revealed,
 * we only expose count (no names/photos) to protect giver identity (PRD §25).
 */

function initialsFromName(name) {
  const t = String(name || "").trim();
  if (!t) return "?";
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function accentHueFromId(id) {
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i += 1) h = (h + s.charCodeAt(i) * (i + 1)) % 360;
  return h;
}

/**
 * @param {Array<import("@prisma/client").RegistryMember & { user: { id: string; name: string; avatarUrl: string | null } }>} viewerRows
 * @param {{ role: "owner" | "viewer"; revealed: boolean; currentUserId: string }} perspective
 */
function buildViewerRoster(viewerRows, perspective) {
  const { role, revealed, currentUserId } = perspective;
  const viewerCount = viewerRows.length;

  if (viewerCount === 0) {
    return {
      viewerCount: 0,
      identityHidden: false,
      faces: [],
    };
  }

  if (role === "owner" && !revealed) {
    return {
      viewerCount,
      identityHidden: true,
      faces: [],
    };
  }

  const faces = viewerRows.map((row) => {
    const dn =
      (row.publicDisplayName && String(row.publicDisplayName).trim()) || row.user.name || "Member";
    const hidePhoto = row.hideAvatar === true;
    return {
      userId: row.user.id,
      displayName: dn,
      photoUrl: hidePhoto ? null : resolveAvatarUrl(row.user.avatarUrl),
      initials: initialsFromName(dn),
      accentHue: accentHueFromId(row.user.id),
      isYou: row.user.id === currentUserId,
    };
  });

  return {
    viewerCount,
    identityHidden: false,
    faces,
  };
}

module.exports = {
  buildViewerRoster,
  initialsFromName,
  accentHueFromId,
};
