const { prisma } = require("../prisma");

async function getItemQuantitySummary(itemId) {
  const grouped = await prisma.itemReservation.groupBy({
    by: ["status"],
    where: {
      itemId,
      status: { in: ["reserved", "prepared"] },
    },
    _sum: { quantity: true },
  });

  const totalReserved =
    grouped.find((g) => g.status === "reserved")?._sum?.quantity ?? 0;
  const totalPrepared =
    grouped.find((g) => g.status === "prepared")?._sum?.quantity ?? 0;

  return {
    totalReserved,
    totalPrepared,
    totalClaimed: totalReserved + totalPrepared,
  };
}

function getItemDisplayStatus({ quantityNeeded, totalReserved, totalPrepared }) {
  const totalClaimed = totalReserved + totalPrepared;
  if (totalClaimed <= 0) return "Available";
  if (totalPrepared >= quantityNeeded) return "Prepared";
  if (totalPrepared > 0) return "Partially Prepared";
  if (totalReserved >= quantityNeeded) return "Reserved";
  return "Partially Reserved";
}

module.exports = { getItemQuantitySummary, getItemDisplayStatus };

