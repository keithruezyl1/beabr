const express = require("express");
const { z } = require("zod");

const { prisma } = require("../prisma");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { httpError } = require("../utils/httpErrors");
const { isRevealed, requireOwner } = require("../utils/registryAccess");

const thankYouRouter = express.Router();

const createSchema = z
  .object({
    registryId: z.string().uuid(),
    giverId: z.string().uuid(),
    itemReservationId: z.string().uuid().optional().nullable(),
    cashPledgeId: z.string().uuid().optional().nullable(),
    message: z.string().min(1).max(1000),
    status: z.enum(["draft", "sent"]).optional(),
  })
  .refine((v) => Boolean(v.itemReservationId) !== Boolean(v.cashPledgeId), {
    message: "Provide exactly one of itemReservationId or cashPledgeId.",
  });

thankYouRouter.post("/", requireAuth, validateBody(createSchema), async (req, res) => {
  await requireOwner(req.body.registryId, req.user.id);

  const registry = await prisma.registry.findUnique({ where: { id: req.body.registryId } });
  if (!registry) throw httpError(404, "Registry not found.");
  if (!isRevealed(registry)) throw httpError(403, "Thank-you messages are available after reveal.");

  // ensure reference exists in this registry
  if (req.body.itemReservationId) {
    const r = await prisma.itemReservation.findUnique({ where: { id: req.body.itemReservationId } });
    if (!r || r.registryId !== req.body.registryId) throw httpError(400, "Invalid reservation reference.");
    if (r.status !== "prepared") throw httpError(409, "You can only thank a prepared gift.");
    if (r.userId !== req.body.giverId) throw httpError(400, "Giver does not match reservation.");
  }

  if (req.body.cashPledgeId) {
    const p = await prisma.cashPledge.findUnique({ where: { id: req.body.cashPledgeId } });
    if (!p || p.registryId !== req.body.registryId) throw httpError(400, "Invalid pledge reference.");
    if (p.userId !== req.body.giverId) throw httpError(400, "Giver does not match pledge.");
  }

  const status = req.body.status ?? "sent";
  const msg = await prisma.thankYouMessage.create({
    data: {
      registryId: req.body.registryId,
      ownerId: req.user.id,
      giverId: req.body.giverId,
      itemReservationId: req.body.itemReservationId ?? null,
      cashPledgeId: req.body.cashPledgeId ?? null,
      message: req.body.message,
      status,
      sentAt: status === "sent" ? new Date() : null,
    },
  });

  res.status(201).json({ message: msg });
});

thankYouRouter.get("/inbox", requireAuth, async (req, res) => {
  const sinceRaw = typeof req.query.since === "string" ? req.query.since.trim() : "";
  const sinceDate = sinceRaw ? new Date(sinceRaw) : null;
  const since = sinceDate && Number.isFinite(sinceDate.getTime()) ? sinceDate : null;

  const messages = await prisma.thankYouMessage.findMany({
    where: {
      giverId: req.user.id,
      status: { in: ["sent", "seen"] },
      ...(since ? { createdAt: { gt: since } } : {}),
    },
    include: {
      registry: { select: { id: true, title: true, ownerDisplayName: true } },
      itemReservation: { include: { item: { select: { id: true, title: true } } } },
      cashPledge: { include: { fund: { select: { id: true, title: true } } } },
    },
    orderBy: [{ seenAt: "asc" }, { sentAt: "desc" }],
  });

  res.json({
    messages: messages.map((m) => ({
      id: m.id,
      registry: m.registry,
      message: m.message,
      status: m.status,
      createdAt: m.createdAt,
      sentAt: m.sentAt,
      seenAt: m.seenAt,
      item: m.itemReservation?.item
        ? { id: m.itemReservation.item.id, title: m.itemReservation.item.title }
        : null,
      fund: m.cashPledge?.fund
        ? { id: m.cashPledge.fund.id, title: m.cashPledge.fund.title }
        : null,
    })),
  });
});

thankYouRouter.patch("/:messageId/seen", requireAuth, async (req, res) => {
  const { messageId } = req.params;
  const msg = await prisma.thankYouMessage.findUnique({ where: { id: messageId } });
  if (!msg) throw httpError(404, "Message not found.");
  if (msg.giverId !== req.user.id) throw httpError(403, "Not allowed.");

  const updated = await prisma.thankYouMessage.update({
    where: { id: messageId },
    data: { status: "seen", seenAt: new Date() },
  });

  res.json({ message: updated });
});

module.exports = { thankYouRouter };

