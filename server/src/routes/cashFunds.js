const express = require("express");
const { z } = require("zod");

const { prisma } = require("../prisma");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { httpError } = require("../utils/httpErrors");
const { requireMembership, requireOwner, isRevealed } = require("../utils/registryAccess");
const { publicGiverUser } = require("../utils/publicUser");

const cashFundsRouter = express.Router();

const createFundSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(600).optional().nullable(),
  targetAmount: z.number().min(0).max(999999).optional().nullable(),
  suggestedAmount: z.number().min(0).max(999999).optional().nullable(),
  instructions: z.string().max(600).optional().nullable(),
  sortOrder: z.number().int().min(0).max(100000).optional(),
});

cashFundsRouter.post(
  "/registries/:registryId/cash-funds",
  requireAuth,
  validateBody(createFundSchema),
  async (req, res) => {
    const { registryId } = req.params;
    await requireOwner(registryId, req.user.id);
    throw httpError(403, "Owners add gift items only. Cash funds are not available.");
  }
);

const patchFundSchema = createFundSchema.partial().refine((v) => Object.keys(v).length > 0, {
  message: "No changes provided.",
});

cashFundsRouter.patch(
  "/cash-funds/:fundId",
  requireAuth,
  validateBody(patchFundSchema),
  async (req, res) => {
    const { fundId } = req.params;
    const fund = await prisma.cashFund.findUnique({ where: { id: fundId } });
    if (!fund || fund.archivedAt) throw httpError(404, "Cash fund not found.");
    await requireOwner(fund.registryId, req.user.id);
    throw httpError(403, "Cash funds cannot be edited.");
  }
);

cashFundsRouter.delete("/cash-funds/:fundId", requireAuth, async (req, res) => {
  const { fundId } = req.params;
  const fund = await prisma.cashFund.findUnique({ where: { id: fundId } });
  if (!fund || fund.archivedAt) throw httpError(404, "Cash fund not found.");
  await requireOwner(fund.registryId, req.user.id);
  throw httpError(403, "Cash funds cannot be archived.");
});

cashFundsRouter.post("/cash-funds/:fundId/pledge", requireAuth, async (_req, _res) => {
  throw httpError(403, "Fund pledges are disabled. Use group pledges on a gift item.");
});

// For viewers: show their pledges. For owners: only after reveal.
cashFundsRouter.get("/registries/:registryId/pledges", requireAuth, async (req, res) => {
  const { registryId } = req.params;
  const member = await requireMembership(registryId, req.user.id);

  const registry = await prisma.registry.findUnique({ where: { id: registryId } });
  if (!registry) throw httpError(404, "Registry not found.");

  const revealed = isRevealed(registry);
  if (member.role === "owner" && !revealed) {
    throw httpError(403, "Pledge details are hidden until reveal.");
  }

  const pledges = await prisma.cashPledge.findMany({
    where:
      member.role === "viewer"
        ? { registryId, userId: req.user.id }
        : { registryId },
    include: {
      fund: { select: { id: true, title: true } },
      user:
        member.role === "owner"
          ? { select: { id: true, name: true, avatarUrl: true } }
          : undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    pledges: pledges.map((p) => ({
      id: p.id,
      fund: p.fund,
      amount: p.amount,
      privateNote: member.role === "owner" ? p.privateNote : undefined,
      giver: member.role === "owner" ? publicGiverUser(p.user) : undefined,
      createdAt: p.createdAt,
    })),
  });
});

module.exports = { cashFundsRouter };

