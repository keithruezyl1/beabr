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

function isClosed(registry) {
  return new Date() >= new Date(registry.closeDatetime);
}

function attributionVisible(registry) {
  return registry?.visibilityMode === "open_coordination" || isClosed(registry);
}

/** Align `registries.isRevealed` with `revealDatetime` vs wall clock so the stored flag is not stale after DB edits outside the API. */
async function reconcileRegistryRevealFlag(registry) {
  const expected = isRevealed(registry);
  if (registry.isRevealed === expected) return registry;
  await prisma.registry.update({
    where: { id: registry.id },
    data: { isRevealed: expected },
  });
  return { ...registry, isRevealed: expected };
}

function assertRegistryOpen(registry, message = "This registry is closed.") {
  if (isClosed(registry)) throw httpError(409, message);
}

async function requireRegistryOpen(registryId, message = "This registry is closed.") {
  const registry = await prisma.registry.findUnique({
    where: { id: registryId },
    select: { id: true, closeDatetime: true, archivedAt: true },
  });
  if (!registry || registry.archivedAt) throw httpError(404, "Registry not found.");
  assertRegistryOpen(registry, message);
  return registry;
}

module.exports = {
  requireMembership,
  requireOwner,
  isRevealed,
  isClosed,
  attributionVisible,
  reconcileRegistryRevealFlag,
  assertRegistryOpen,
  requireRegistryOpen,
};
