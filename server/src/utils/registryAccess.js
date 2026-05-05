const { prisma } = require("../prisma");
const { httpError } = require("./httpErrors");

async function requireMembership(registryId, userId) {
  const member = await prisma.registryMember.findUnique({
    where: { registryId_userId: { registryId, userId } },
  });
  if (!member) throw httpError(403, "You are not a member of this registry.");
  return member;
}

async function requireOwner(registryId, userId) {
  const member = await requireMembership(registryId, userId);
  if (member.role !== "owner") throw httpError(403, "Owner access required.");
  return member;
}

function isRevealed(registry) {
  return new Date() >= new Date(registry.revealDatetime);
}

function attributionVisible(registry) {
  return registry?.visibilityMode === "open_coordination" || isRevealed(registry);
}

/** Align `registries.isRevealed` with `revealDatetime` vs wall clock so the stored flag is not stale after DB edits outside the API. */
async function reconcileRegistryRevealFlag(registry) {
  const expected = new Date() >= new Date(registry.revealDatetime);
  if (registry.isRevealed === expected) return registry;
  await prisma.registry.update({
    where: { id: registry.id },
    data: { isRevealed: expected },
  });
  return { ...registry, isRevealed: expected };
}

module.exports = {
  requireMembership,
  requireOwner,
  isRevealed,
  attributionVisible,
  reconcileRegistryRevealFlag,
};
