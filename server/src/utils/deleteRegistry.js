const { prisma } = require("../prisma");
const { removeStoragePaths } = require("../services/supabaseStorage");
const { normalizeItemImagePaths } = require("./itemImages");

async function collectRegistryStoragePaths(registryId) {
  const paths = new Set();
  const [items, funds, inits, contribs] = await Promise.all([
    prisma.registryItem.findMany({ where: { registryId }, select: { imagePath: true, imagePaths: true } }),
    prisma.cashFund.findMany({ where: { registryId }, select: { imagePath: true } }),
    prisma.pledgeInitiation.findMany({ where: { registryId }, select: { qrImagePath: true } }),
    prisma.pledgeContribution.findMany({ where: { registryId }, select: { receiptImagePath: true } }),
  ]);
  for (const row of items) {
    for (const p of normalizeItemImagePaths(row)) {
      paths.add(p);
    }
  }
  for (const row of funds) {
    if (row.imagePath) paths.add(row.imagePath);
  }
  for (const row of inits) {
    if (row.qrImagePath) paths.add(row.qrImagePath);
  }
  for (const row of contribs) {
    if (row.receiptImagePath) paths.add(row.receiptImagePath);
  }
  return [...paths];
}

/**
 * Permanently deletes a registry and all related rows. Does not delete User accounts.
 * Removes uploaded files referenced from the DB (best effort).
 */
async function deleteRegistryCompletely(registryId) {
  const paths = await collectRegistryStoragePaths(registryId);
  await removeStoragePaths(paths);

  await prisma.$transaction(async (tx) => {
    await tx.thankYouMessage.deleteMany({ where: { registryId } });
    await tx.pledgeContribution.deleteMany({ where: { registryId } });
    await tx.pledgeInitiation.deleteMany({ where: { registryId } });
    await tx.cashPledge.deleteMany({ where: { registryId } });
    await tx.itemReservation.deleteMany({ where: { registryId } });
    await tx.itemAttribute.deleteMany({ where: { item: { registryId } } });
    await tx.registryItem.deleteMany({ where: { registryId } });
    await tx.cashFund.deleteMany({ where: { registryId } });
    await tx.registryMember.deleteMany({ where: { registryId } });
    await tx.notification.deleteMany({
      where: { payloadJson: { path: ["registryId"], equals: registryId } },
    });
    await tx.registry.delete({ where: { id: registryId } });
  });
}

module.exports = { deleteRegistryCompletely };
