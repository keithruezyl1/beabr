const express = require("express");
const { z } = require("zod");

const { prisma } = require("../prisma");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { httpError } = require("../utils/httpErrors");
const { requireOwner } = require("../utils/registryAccess");
const multer = require("multer");
const { uploadItemImage, signUrl, removeStoragePaths } = require("../services/supabaseStorage");
const { normalizeItemImagePaths, isValidImageOrder, MAX_ITEM_IMAGES } = require("../utils/itemImages");

const MAX_IMAGE_UPLOAD_BYTES = 8 * 1024 * 1024;

const itemsRouter = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_UPLOAD_BYTES },
});

async function serializeItemImages(item) {
  const paths = normalizeItemImagePaths(item);
  /** @type {string[]} */
  let imageUrls = [];
  if (paths.length > 0) {
    imageUrls = (await Promise.all(paths.map((p) => signUrl(p)))).filter(Boolean);
  } else if (item.imageUrl) {
    imageUrls = [item.imageUrl];
  }
  return { imageUrls, imageUrl: imageUrls[0] ?? null };
}

const attributeSchema = z.object({
  key: z.string().min(1).max(40),
  value: z.string().min(1).max(120),
});

const itemBaseSchema = z.object({
  title: z.string().min(1).max(120),
  category: z.string().min(1).max(40),
  description: z.string().max(800).optional().nullable(),
  quantityNeeded: z.number().int().min(1).max(999).optional(),
  ownerStatus: z.enum(["confirmed", "considering", "removed"]).optional(),
  externalLink: z.string().url().optional().nullable(),
  storeName: z.string().max(80).optional().nullable(),
  priceReference: z.number().min(0).max(999999).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  preferredOption: z.string().max(200).optional().nullable(),
  acceptableAlternatives: z.string().max(280).optional().nullable(),
  ownerPrivateNote: z.string().max(800).optional().nullable(),
  viewerInstruction: z.string().max(500).optional().nullable(),
  sortOrder: z.number().int().min(0).max(100000).optional(),
  attributes: z.array(attributeSchema).optional(),
});

itemsRouter.post(
  "/registries/:registryId/items",
  requireAuth,
  validateBody(itemBaseSchema),
  async (req, res) => {
    const { registryId } = req.params;
    await requireOwner(registryId, req.user.id);

    const item = await prisma.registryItem.create({
      data: {
        registryId,
        title: req.body.title,
        category: req.body.category,
        description: req.body.description ?? null,
        quantityNeeded: req.body.quantityNeeded ?? 1,
        ownerStatus: req.body.ownerStatus ?? "confirmed",
        externalLink: req.body.externalLink ?? null,
        storeName: req.body.storeName ?? null,
        priceReference:
          typeof req.body.priceReference === "number" ? req.body.priceReference : null,
        imageUrl: req.body.imageUrl ?? null,
        preferredOption: req.body.preferredOption ?? null,
        acceptableAlternatives: req.body.acceptableAlternatives ?? null,
        ownerPrivateNote: req.body.ownerPrivateNote ?? null,
        viewerInstruction: req.body.viewerInstruction ?? null,
        sortOrder: req.body.sortOrder ?? 0,
        attributes: req.body.attributes?.length
          ? {
              create: req.body.attributes.map((a) => ({
                attributeKey: a.key,
                attributeValue: a.value,
              })),
            }
          : undefined,
      },
      include: { attributes: true },
    });

    const { imageUrls, imageUrl } = await serializeItemImages(item);
    res.status(201).json({
      item: {
        ...item,
        imageUrls,
        imageUrl,
        attributes: item.attributes.map((a) => ({ key: a.attributeKey, value: a.attributeValue })),
      },
    });
  }
);

const patchItemSchema = itemBaseSchema
  .partial()
  .merge(z.object({ imageOrder: z.array(z.number().int().min(0)).min(2).max(MAX_ITEM_IMAGES).optional() }))
  .refine((v) => Object.keys(v).length > 0, {
    message: "No changes provided.",
  });

itemsRouter.patch("/items/:itemId", requireAuth, validateBody(patchItemSchema), async (req, res) => {
  const { itemId } = req.params;
  const item = await prisma.registryItem.findUnique({ where: { id: itemId } });
  if (!item || item.archivedAt) throw httpError(404, "Item not found.");

  await requireOwner(item.registryId, req.user.id);

  if (Array.isArray(req.body.imageOrder)) {
    const paths = normalizeItemImagePaths(item);
    if (paths.length < 2) throw httpError(400, "At least two images are required to reorder.");
    if (!isValidImageOrder(req.body.imageOrder, paths.length)) throw httpError(400, "Invalid image order.");
    const nextPaths = req.body.imageOrder.map((i) => paths[i]);
    await prisma.registryItem.update({
      where: { id: itemId },
      data: { imagePaths: nextPaths, imagePath: nextPaths[0] ?? null },
    });
  }

  const otherKeys = Object.keys(req.body).filter((k) => k !== "imageOrder");
  if (otherKeys.length === 0 && Array.isArray(req.body.imageOrder)) {
    const final = await prisma.registryItem.findUnique({
      where: { id: itemId },
      include: { attributes: true },
    });
    const { imageUrls, imageUrl } = await serializeItemImages(final);
    return res.json({
      item: {
        ...final,
        imageUrls,
        imageUrl,
        attributes: final.attributes.map((a) => ({ key: a.attributeKey, value: a.attributeValue })),
      },
    });
  }

  if (otherKeys.length === 0) {
    throw httpError(400, "No changes provided.");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.registryItem.update({
      where: { id: itemId },
      data: {
        ...(req.body.title ? { title: req.body.title } : {}),
        ...(req.body.category ? { category: req.body.category } : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "description") ? { description: req.body.description } : {}),
        ...(typeof req.body.quantityNeeded === "number" ? { quantityNeeded: req.body.quantityNeeded } : {}),
        ...(req.body.ownerStatus ? { ownerStatus: req.body.ownerStatus } : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "externalLink") ? { externalLink: req.body.externalLink } : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "storeName") ? { storeName: req.body.storeName } : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "priceReference")
          ? { priceReference: typeof req.body.priceReference === "number" ? req.body.priceReference : null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "imageUrl") ? { imageUrl: req.body.imageUrl } : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "preferredOption") ? { preferredOption: req.body.preferredOption } : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "acceptableAlternatives")
          ? { acceptableAlternatives: req.body.acceptableAlternatives }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "ownerPrivateNote")
          ? { ownerPrivateNote: req.body.ownerPrivateNote }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "viewerInstruction")
          ? { viewerInstruction: req.body.viewerInstruction }
          : {}),
        ...(typeof req.body.sortOrder === "number" ? { sortOrder: req.body.sortOrder } : {}),
      },
    });

    if (Array.isArray(req.body.attributes)) {
      await tx.itemAttribute.deleteMany({ where: { itemId } });
      if (req.body.attributes.length) {
        await tx.itemAttribute.createMany({
          data: req.body.attributes.map((a) => ({
            itemId,
            attributeKey: a.key,
            attributeValue: a.value,
          })),
        });
      }
    }

    const withAttrs = await tx.registryItem.findUnique({
      where: { id: itemId },
      include: { attributes: true },
    });
    return withAttrs;
  });

  const { imageUrls, imageUrl } = await serializeItemImages(updated);
  res.json({
    item: {
      ...updated,
      imageUrls,
      imageUrl,
      attributes: updated.attributes.map((a) => ({ key: a.attributeKey, value: a.attributeValue })),
    },
  });
});

itemsRouter.post("/items/:itemId/photo", requireAuth, upload.single("image"), async (req, res) => {
  const { itemId } = req.params;
  const item = await prisma.registryItem.findUnique({ where: { id: itemId } });
  if (!item || item.archivedAt) throw httpError(404, "Item not found.");

  await requireOwner(item.registryId, req.user.id);
  if (!req.file) throw httpError(400, "Missing image file.");

  const current = normalizeItemImagePaths(item);
  if (current.length >= MAX_ITEM_IMAGES) {
    throw httpError(400, `You can upload at most ${MAX_ITEM_IMAGES} images per item.`);
  }

  const path = await uploadItemImage({ registryId: item.registryId, itemId, file: req.file });
  const nextPaths = [...current, path];
  const updated = await prisma.registryItem.update({
    where: { id: itemId },
    data: { imagePaths: nextPaths, imagePath: nextPaths[0] ?? null },
  });
  const { imageUrls, imageUrl } = await serializeItemImages(updated);
  res.json({ imageUrl, imageUrls, imagePaths: nextPaths });
});

itemsRouter.delete("/items/:itemId/photos/:index", requireAuth, async (req, res) => {
  const { itemId } = req.params;
  const idx = Number(req.params.index);
  if (!Number.isInteger(idx) || idx < 0 || idx >= MAX_ITEM_IMAGES) {
    throw httpError(400, "Invalid photo index.");
  }

  const item = await prisma.registryItem.findUnique({ where: { id: itemId } });
  if (!item || item.archivedAt) throw httpError(404, "Item not found.");
  await requireOwner(item.registryId, req.user.id);

  const paths = normalizeItemImagePaths(item);
  const removed = paths[idx];
  if (!removed) throw httpError(404, "Photo not found.");

  const nextPaths = paths.filter((_, i) => i !== idx);
  await removeStoragePaths([removed]);
  const updated = await prisma.registryItem.update({
    where: { id: itemId },
    data: { imagePaths: nextPaths, imagePath: nextPaths[0] ?? null },
  });
  const { imageUrls, imageUrl } = await serializeItemImages(updated);
  res.json({ imageUrl, imageUrls });
});

itemsRouter.delete("/items/:itemId", requireAuth, async (req, res) => {
  const { itemId } = req.params;
  const item = await prisma.registryItem.findUnique({ where: { id: itemId } });
  if (!item || item.archivedAt) throw httpError(404, "Item not found.");

  await requireOwner(item.registryId, req.user.id);

  const [activeReservationCount, pledgeInitiation] = await Promise.all([
    prisma.itemReservation.count({
      where: { itemId, status: { in: ["reserved", "prepared"] } },
    }),
    prisma.pledgeInitiation.findUnique({ where: { itemId }, select: { id: true } }),
  ]);

  if (activeReservationCount > 0 || pledgeInitiation) {
    throw httpError(
      409,
      "This item has active reservations or a group pledge and cannot be archived. Ask participants to cancel first."
    );
  }

  await prisma.registryItem.update({
    where: { id: itemId },
    data: { archivedAt: new Date(), ownerStatus: "removed" },
  });

  res.json({ ok: true });
});

const reorderSchema = z.object({ sortOrder: z.number().int().min(0).max(100000) });

itemsRouter.patch(
  "/items/:itemId/reorder",
  requireAuth,
  validateBody(reorderSchema),
  async (req, res) => {
    const { itemId } = req.params;
    const item = await prisma.registryItem.findUnique({ where: { id: itemId } });
    if (!item || item.archivedAt) throw httpError(404, "Item not found.");
    await requireOwner(item.registryId, req.user.id);

    const updated = await prisma.registryItem.update({
      where: { id: itemId },
      data: { sortOrder: req.body.sortOrder },
      select: { id: true, sortOrder: true },
    });

    res.json({ item: updated });
  }
);

module.exports = { itemsRouter };

