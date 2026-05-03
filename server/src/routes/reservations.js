const express = require("express");
const { z } = require("zod");

const { prisma } = require("../prisma");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { httpError } = require("../utils/httpErrors");
const { requireMembership } = require("../utils/registryAccess");
const { getItemQuantitySummary } = require("../utils/itemQuantities");

const reservationsRouter = express.Router();

const reserveSchema = z.object({
  quantity: z.number().int().min(1).max(999),
  privateNote: z.string().max(500).optional().nullable(),
});

reservationsRouter.post(
  "/items/:itemId/reserve",
  requireAuth,
  validateBody(reserveSchema),
  async (req, res) => {
    const { itemId } = req.params;
    const item = await prisma.registryItem.findUnique({
      where: { id: itemId },
      select: { id: true, registryId: true, quantityNeeded: true, archivedAt: true, ownerStatus: true },
    });
    if (!item || item.archivedAt || item.ownerStatus === "removed")
      throw httpError(404, "Item not found.");

    const member = await requireMembership(item.registryId, req.user.id);
    if (member.role !== "viewer") throw httpError(403, "Only viewers can reserve items.");

    const qty = await getItemQuantitySummary(itemId);
    const available = Math.max(0, item.quantityNeeded - qty.totalClaimed);
    if (req.body.quantity > available) {
      throw httpError(409, "Not enough quantity available to reserve.", {
        available,
      });
    }

    const reservation = await prisma.itemReservation.create({
      data: {
        registryId: item.registryId,
        itemId,
        userId: req.user.id,
        quantity: req.body.quantity,
        status: "reserved",
        privateNote: req.body.privateNote ?? null,
      },
    });

    res.status(201).json({ reservation });
  }
);

reservationsRouter.post("/reservations/:reservationId/prepare", requireAuth, async (req, res) => {
  const { reservationId } = req.params;
  const r = await prisma.itemReservation.findUnique({ where: { id: reservationId } });
  if (!r) throw httpError(404, "Reservation not found.");
  if (r.userId !== req.user.id) throw httpError(403, "You can only prepare your own reservation.");
  if (r.status !== "reserved") throw httpError(409, "Only reserved items can be marked as prepared.");

  const updated = await prisma.itemReservation.update({
    where: { id: reservationId },
    data: { status: "prepared", preparedAt: new Date() },
  });

  res.json({ reservation: updated });
});

reservationsRouter.post("/reservations/:reservationId/cancel", requireAuth, async (req, res) => {
  const { reservationId } = req.params;
  const r = await prisma.itemReservation.findUnique({ where: { id: reservationId } });
  if (!r) throw httpError(404, "Reservation not found.");
  if (r.userId !== req.user.id) throw httpError(403, "You can only cancel your own reservation.");
  if (r.status === "cancelled") return res.json({ reservation: r });
  if (r.status === "prepared") throw httpError(409, "Prepared reservations cannot be cancelled.");

  const updated = await prisma.itemReservation.update({
    where: { id: reservationId },
    data: { status: "cancelled" },
  });

  res.json({ reservation: updated });
});

module.exports = { reservationsRouter };

