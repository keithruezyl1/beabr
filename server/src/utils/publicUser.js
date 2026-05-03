/** Fields safe to expose when showing another member’s identity in-app (no public profile). */
function publicGiverUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl ?? null,
  };
}

module.exports = { publicGiverUser };
