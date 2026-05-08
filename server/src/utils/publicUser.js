const { resolveAvatarUrl } = require("./avatar");

/** Fields safe to expose when showing another member's identity in-app (no public profile). */
function publicGiverUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    avatarUrl: resolveAvatarUrl(user.avatarUrl),
  };
}

module.exports = { publicGiverUser };
