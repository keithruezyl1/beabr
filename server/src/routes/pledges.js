const express = require("express");
const multer = require("multer");
const { z } = require("zod");

const { prisma } = require("../prisma");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { httpError } = require("../utils/httpErrors");
const { requireMembership } = require("../utils/registryAccess");
const { getItemQuantitySummary } = require("../utils/itemQuantities");
const {
  resolveImageFormat,
  uploadEncryptedPledgeQrBlob,
  downloadBucketObject,
  uploadReceipt,
  signUrl,
} = require("../services/supabaseStorage");
const {
  sealPayoutUtf8String,
  openPayoutUtf8String,
  sealQrImageBuffer,
  openQrStorageBlob,
} = require("../utils/pledgeFieldEncryption");
const { publicGiverUser } = require("../utils/publicUser");

const MAX_IMAGE_UPLOAD_BYTES = 8 * 1024 * 1024;

const pledgesRouter = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_UPLOAD_BYTES },
});

/** Decrypt initiation fields; never exposes private Storage paths to JSON. */
function initiationSharedFields(initiation) {
  if (!initiation) return null;
  return {
    id: initiation.id,
    itemId: initiation.itemId,
    initiatorUserId: initiation.initiatorUserId,
    payoutMethod: initiation.payoutMethod,
    payoutName: openPayoutUtf8String(initiation.payoutName),
    payoutAccount: openPayoutUtf8String(initiation.payoutAccount),
    payoutInstitution: openPayoutUtf8String(initiation.payoutInstitution),
    payoutNotes: openPayoutUtf8String(initiation.payoutNotes),
    hasQrImage: Boolean(initiation.qrImagePath),
  };
}

async function getItemOr404(itemId) {
  const item = await prisma.registryItem.findUnique({
    where: { id: itemId },
    include: { registry: true },
  });
  if (!item || item.archivedAt || item.registry.archivedAt) throw httpError(404, "Item not found.");
  return item;
}

async function getAvailableQuantityForItem(item) {
  const qty = await getItemQuantitySummary(item.id);
  return Math.max(0, item.quantityNeeded - qty.totalClaimed);
}

/** Group pledges are for gifts that still have unclaimed quantity (no full reservation/preparation lock). */
async function assertGroupPledgeAllowedForItem(item) {
  const available = await getAvailableQuantityForItem(item);
  if (available <= 0) {
    throw httpError(
      409,
      "This gift is already fully reserved or prepared. A group pledge can’t be used for it."
    );
  }
}

const initiateSchema = z.object({
  payoutMethod: z.enum(["bank", "gcash", "other"]),
  payoutName: z.string().max(120).optional().nullable(),
  payoutAccount: z.string().max(120).optional().nullable(),
  payoutInstitution: z.string().max(120).optional().nullable(),
  payoutNotes: z.string().max(600).optional().nullable(),
});

// Decrypting QR gateway (bucket stores AES-GCM ciphertext; no public signed URLs for QR).
pledgesRouter.get("/items/:itemId/pledge/qr-image", requireAuth, async (req, res) => {
  const { itemId } = req.params;
  const item = await getItemOr404(itemId);
  const member = await requireMembership(item.registryId, req.user.id);
  if (member.role !== "viewer") throw httpError(403, "Only pledge participants may access this.");

  const initiation = await prisma.pledgeInitiation.findUnique({ where: { itemId } });
  if (!initiation?.qrImagePath) throw httpError(404, "No QR uploaded for this pledge.");

  const encrypted = await downloadBucketObject(initiation.qrImagePath);
  const { contentType, buffer } = openQrStorageBlob(encrypted, initiation.qrImagePath);

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "private, no-store");
  res.send(buffer);
});

// Create/update a pledge initiation (initiator payout details + optional QR upload)
pledgesRouter.post(
  "/items/:itemId/pledge/initiate",
  requireAuth,
  upload.single("qr"),
  (_req, _res, next) => {
    next();
  },
  async (req, res) => {
    const { itemId } = req.params;
    const item = await getItemOr404(itemId);
    const member = await requireMembership(item.registryId, req.user.id);
    if (member.role !== "viewer") throw httpError(403, "Only viewers can initiate pledges.");

    await assertGroupPledgeAllowedForItem(item);

    const parsed = initiateSchema.parse({
      payoutMethod: req.body.payoutMethod,
      payoutName: req.body.payoutName ?? null,
      payoutAccount: req.body.payoutAccount ?? null,
      payoutInstitution: req.body.payoutInstitution ?? null,
      payoutNotes: req.body.payoutNotes ?? null,
    });

    const existing = await prisma.pledgeInitiation.findUnique({ where: { itemId } });

    if (existing && existing.initiatorUserId !== req.user.id) {
      throw httpError(409, "This item already has a pledge initiator.");
    }

    let qrImagePath = existing?.qrImagePath ?? null;
    if (req.file) {
      const { contentType } = resolveImageFormat(req.file);
      const sealed = sealQrImageBuffer(req.file.buffer, contentType);
      qrImagePath = await uploadEncryptedPledgeQrBlob({
        registryId: item.registryId,
        itemId,
        userId: req.user.id,
        sealedBuffer: sealed,
      });
    }

    const initiation = await prisma.pledgeInitiation.upsert({
      where: { itemId },
      create: {
        registryId: item.registryId,
        itemId,
        initiatorUserId: req.user.id,
        payoutMethod: parsed.payoutMethod,
        payoutName: sealPayoutUtf8String(parsed.payoutName),
        payoutAccount: sealPayoutUtf8String(parsed.payoutAccount),
        payoutInstitution: sealPayoutUtf8String(parsed.payoutInstitution),
        payoutNotes: sealPayoutUtf8String(parsed.payoutNotes),
        qrImagePath,
      },
      update: {
        payoutMethod: parsed.payoutMethod,
        payoutName: sealPayoutUtf8String(parsed.payoutName),
        payoutAccount: sealPayoutUtf8String(parsed.payoutAccount),
        payoutInstitution: sealPayoutUtf8String(parsed.payoutInstitution),
        payoutNotes: sealPayoutUtf8String(parsed.payoutNotes),
        ...(req.file ? { qrImagePath } : {}),
      },
    });

    res.status(201).json({
      initiation: initiationSharedFields(initiation),
    });
  }
);

// Get pledge state: gathered amounts + initiation details
pledgesRouter.get("/items/:itemId/pledge", requireAuth, async (req, res) => {
  const { itemId } = req.params;
  const item = await getItemOr404(itemId);
  const member = await requireMembership(item.registryId, req.user.id);
  if (member.role !== "viewer") throw httpError(403, "Only viewers can view pledge flow details.");

  const initiation = await prisma.pledgeInitiation.findUnique({
    where: { itemId },
    include: {
      initiator: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  const contributionAgg = await prisma.pledgeContribution.aggregate({
    where: {
      itemId,
      registryId: item.registryId,
      status: { in: ["receipt_uploaded", "confirmed"] },
    },
    _sum: { amount: true },
  });
  const gathered = contributionAgg._sum.amount ?? 0;

  const myContribution = await prisma.pledgeContribution.findFirst({
    where: { itemId, registryId: item.registryId, contributorUserId: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  const isInitiator = initiation?.initiatorUserId === req.user.id;

  const availableQuantity = await getAvailableQuantityForItem(item);
  const groupPledgeAllowed = availableQuantity > 0;

  let contributionsForInitiator = [];
  let myContributions = [];
  if (isInitiator && initiation) {
    const rows = await prisma.pledgeContribution.findMany({
      where: { initiationId: initiation.id },
      include: {
        contributor: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    contributionsForInitiator = await Promise.all(
      rows.map(async (c) => ({
        id: c.id,
        amount: c.amount,
        status: c.status,
        createdAt: c.createdAt,
        contributor: publicGiverUser(c.contributor),
        receiptSignedUrl: c.receiptImagePath ? await signUrl(c.receiptImagePath) : null,
      }))
    );
  } else if (initiation) {
    const rows = await prisma.pledgeContribution.findMany({
      where: {
        initiationId: initiation.id,
        contributorUserId: req.user.id,
        status: { in: ["receipt_uploaded", "confirmed"] },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    });
    myContributions = await Promise.all(
      rows.map(async (c) => ({
        id: c.id,
        amount: c.amount,
        status: c.status,
        createdAt: c.createdAt,
        receiptSignedUrl: c.receiptImagePath ? await signUrl(c.receiptImagePath) : null,
      }))
    );
  }

  res.json({
    groupPledgeAllowed,
    availableQuantity,
    item: {
      id: item.id,
      title: item.title,
      priceReference: item.priceReference,
    },
    initiation: initiation
      ? {
          ...initiationSharedFields(initiation),
          initiator: initiation.initiator,
        }
      : null,
    gatheredAmount: gathered,
    isInitiator,
    myContribution: myContribution
      ? {
          id: myContribution.id,
          amount: myContribution.amount,
          status: myContribution.status,
          receiptUploaded: Boolean(myContribution.receiptImagePath),
        }
      : null,
    contributions: contributionsForInitiator,
    myContributions,
  });
});

const contributeSchema = z.object({
  amount: z.number().min(1).max(999999),
});

pledgesRouter.post(
  "/items/:itemId/pledge/contribute",
  requireAuth,
  validateBody(contributeSchema),
  async (req, res) => {
    // Deprecated: creating a DB record before the receipt upload causes abandoned rows if a user cancels mid-flow.
    // Use the receipt-first endpoint instead.
    res.status(410).json({
      error: {
        message: "Contribution creation moved. Upload your receipt to submit a contribution.",
        code: "PLEDGE_CONTRIBUTE_MOVED",
      },
    });
  }
);

const contributeWithReceiptSchema = z.object({
  amount: z
    .string()
    .transform((s) => String(s ?? "").replace(/[^\d]/g, ""))
    .pipe(z.string().min(1))
    .transform((s) => Number(s))
    .refine((n) => Number.isFinite(n) && n >= 1 && n <= 999999, { message: "Invalid amount." }),
});

pledgesRouter.post(
  "/items/:itemId/pledge/contribute-with-receipt",
  requireAuth,
  upload.single("receipt"),
  async (req, res) => {
    const { itemId } = req.params;
    if (!req.file) throw httpError(400, "Receipt image is required.");

    const item = await getItemOr404(itemId);
    const member = await requireMembership(item.registryId, req.user.id);
    if (member.role !== "viewer") throw httpError(403, "Only viewers can contribute.");

    await assertGroupPledgeAllowedForItem(item);

    const parsed = contributeWithReceiptSchema.safeParse({ amount: req.body.amount });
    if (!parsed.success) {
      throw httpError(400, "Invalid amount.");
    }

    const initiation = await prisma.pledgeInitiation.findUnique({ where: { itemId } });
    if (!initiation) throw httpError(409, "No pledge initiator yet.");

    if (initiation.initiatorUserId === req.user.id) {
      throw httpError(409, "Initiator cannot contribute to their own pledge.");
    }

    const receiptImagePath = await uploadReceipt({
      registryId: item.registryId,
      itemId,
      contributorUserId: req.user.id,
      file: req.file,
    });

    const created = await prisma.pledgeContribution.create({
      data: {
        registryId: item.registryId,
        itemId,
        initiationId: initiation.id,
        contributorUserId: req.user.id,
        amount: parsed.data.amount,
        status: "receipt_uploaded",
        receiptImagePath,
      },
    });

    await prisma.notification.create({
      data: {
        userId: initiation.initiatorUserId,
        type: "pledge_receipt_uploaded",
        payloadJson: {
          registryId: item.registryId,
          itemId,
          contributionId: created.id,
          amount: String(created.amount),
        },
      },
    });

    res.status(201).json({
      contribution: {
        id: created.id,
        status: created.status,
      },
    });
  }
);

pledgesRouter.post(
  "/pledge-contributions/:contributionId/receipt",
  requireAuth,
  upload.single("receipt"),
  async (req, res) => {
    const { contributionId } = req.params;
    if (!req.file) throw httpError(400, "Receipt image is required.");

    const contrib = await prisma.pledgeContribution.findUnique({
      where: { id: contributionId },
      include: { initiation: true },
    });
    if (!contrib) throw httpError(404, "Contribution not found.");
    if (contrib.contributorUserId !== req.user.id) {
      throw httpError(403, "You can only upload your own receipt.");
    }
    if (contrib.status !== "pending_receipt") {
      throw httpError(409, "Receipt upload is not allowed for this contribution.");
    }

    await requireMembership(contrib.registryId, req.user.id);

    const receiptImagePath = await uploadReceipt({
      registryId: contrib.registryId,
      itemId: contrib.itemId,
      contributorUserId: req.user.id,
      file: req.file,
    });

    const updated = await prisma.pledgeContribution.update({
      where: { id: contributionId },
      data: { status: "receipt_uploaded", receiptImagePath },
    });

    await prisma.notification.create({
      data: {
        userId: contrib.initiation.initiatorUserId,
        type: "pledge_receipt_uploaded",
        payloadJson: {
          registryId: contrib.registryId,
          itemId: contrib.itemId,
          contributionId: updated.id,
          amount: String(updated.amount),
        },
      },
    });

    res.json({
      contribution: {
        id: updated.id,
        status: updated.status,
      },
    });
  }
);

pledgesRouter.get("/notifications", requireAuth, async (req, res) => {
  const sinceRaw = typeof req.query.since === "string" ? req.query.since.trim() : "";
  const sinceDate = sinceRaw ? new Date(sinceRaw) : null;
  const since = sinceDate && Number.isFinite(sinceDate.getTime()) ? sinceDate : null;

  const rows = await prisma.notification.findMany({
    where: {
      userId: req.user.id,
      ...(since ? { createdAt: { gt: since } } : {}),
    },
    orderBy: since ? [{ createdAt: "desc" }] : [{ seenAt: "asc" }, { createdAt: "desc" }],
    take: since ? 200 : 50,
  });

  res.json({
    notifications: rows.map((n) => ({
      id: n.id,
      type: n.type,
      payload: n.payloadJson,
      createdAt: n.createdAt,
      seenAt: n.seenAt,
    })),
  });
});

pledgesRouter.patch("/notifications/:id/seen", requireAuth, async (req, res) => {
  const { id } = req.params;
  const n = await prisma.notification.findUnique({ where: { id } });
  if (!n) throw httpError(404, "Notification not found.");
  if (n.userId !== req.user.id) throw httpError(403, "Not allowed.");

  const updated = await prisma.notification.update({
    where: { id },
    data: { seenAt: new Date() },
  });
  res.json({ notification: { id: updated.id, seenAt: updated.seenAt } });
});

module.exports = { pledgesRouter };
