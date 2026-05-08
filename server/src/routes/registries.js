const express = require("express");
const { z } = require("zod");

const { config } = require("../config");
const { prisma } = require("../prisma");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { httpError } = require("../utils/httpErrors");
const { makeJoinCode } = require("../utils/joinCode");
const { createJoinLimiter } = require("../middleware/rateLimits");
const {
  attributionVisible,
  isRevealed,
  requireMembership,
  requireOwner,
  reconcileRegistryRevealFlag,
} = require("../utils/registryAccess");

const joinLimiter = createJoinLimiter();
const { buildViewerRoster } = require("../utils/viewerRoster");
const { getItemDisplayStatus, getItemQuantitySummary } = require("../utils/itemQuantities");
const { signUrl } = require("../services/supabaseStorage");
const { normalizeItemImagePaths } = require("../utils/itemImages");
const { registryEventCategorySchema } = require("../constants/registryEventCategories");
const { deleteRegistryCompletely } = require("../utils/deleteRegistry");
const { publicGiverUser } = require("../utils/publicUser");

const registriesRouter = express.Router();

const ENDED_SUCCESS_MODAL_COPY = Object.freeze({
  Celebration: {
    title: "Celebration wrapped up",
    subtitle: "The registry is now closed. You can still look back at the gifts and coordination details.",
  },
  Graduation: {
    title: "Graduation registry wrapped up",
    subtitle: "The registry is now closed. Everyone's help is ready to look back on as the milestone wraps.",
  },
  Wedding: {
    title: "Wedding registry wrapped up",
    subtitle: "The registry is now closed. Gift coordination is complete and the details remain available.",
  },
  Birthday: {
    title: "Birthday registry wrapped up",
    subtitle: "The registry is now closed. The celebration details and gift activity remain available.",
  },
  "Baby shower": {
    title: "Baby shower registry wrapped up",
    subtitle: "The registry is now closed. Loved ones' prepared gifts and support are ready to review.",
  },
  Housewarming: {
    title: "Housewarming registry wrapped up",
    subtitle: "The registry is now closed. The home-starting gift coordination is complete.",
  },
  Retirement: {
    title: "Retirement registry wrapped up",
    subtitle: "The registry is now closed. The sendoff support and gift details remain available.",
  },
  Farewell: {
    title: "Farewell registry wrapped up",
    subtitle: "The registry is now closed. The farewell gift coordination is complete.",
  },
  Fundraiser: {
    title: "Fundraiser registry wrapped up",
    subtitle: "The registry is now closed. Contributions and coordination details remain available.",
  },
  Other: {
    title: "Registry wrapped up",
    subtitle: "The registry is now closed. Gift coordination is complete and the details remain available.",
  },
});

function endedSuccessModalForCategory(eventCategory) {
  const copy = ENDED_SUCCESS_MODAL_COPY[eventCategory] || ENDED_SUCCESS_MODAL_COPY.Other;
  return { ...copy, ctaLabel: "Back to registry" };
}

function resolveRegistryRevealDatetime({ visibilityMode, revealDatetime }) {
  if (revealDatetime) return new Date(revealDatetime);
  if (visibilityMode === "open_coordination") return new Date();
  throw httpError(400, "Reveal date and time is required for private surprise registries.");
}

function resolveRegistryCloseDatetime({ visibilityMode, revealDatetime, closeDatetime }) {
  if (visibilityMode === "private_until_reveal") {
    if (!revealDatetime) {
      throw httpError(400, "Reveal date and time is required for private surprise registries.");
    }
    return new Date(revealDatetime);
  }
  if (!closeDatetime) throw httpError(400, "Closing date and time is required for open coordination registries.");
  return new Date(closeDatetime);
}

function itemShownToMember(item, member, registry) {
  if (member.role === "owner") return true;
  return (
    item.ownerStatus === "confirmed" ||
    (item.ownerStatus === "considering" && registry.showConsideringItems)
  );
}

function publicRegistryMemberUser(memberRow) {
  if (!memberRow?.user) return null;
  const displayName =
    (memberRow.publicDisplayName && String(memberRow.publicDisplayName).trim()) ||
    memberRow.user.name ||
    "Member";
  return {
    id: memberRow.user.id,
    name: displayName,
    avatarUrl: memberRow.hideAvatar ? null : memberRow.user.avatarUrl ?? null,
  };
}

const createRegistrySchema = z.object({
  title: z.string().min(1).max(120),
  ownerDisplayName: z.string().min(1).max(80),
  message: z.string().max(600).optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  eventCategory: registryEventCategorySchema.default("Celebration"),
  eventDate: z.string().datetime().optional().nullable(),
  revealDatetime: z.string().datetime().optional().nullable(),
  closeDatetime: z.string().datetime().optional().nullable(),
  showPledgeTotalBeforeReveal: z.boolean().optional(),
  showConsideringItems: z.boolean().optional(),
  visibilityMode: z.enum(["private_until_reveal", "open_coordination"]).default("private_until_reveal"),
});

registriesRouter.post(
  "/",
  requireAuth,
  validateBody(createRegistrySchema),
  async (req, res) => {
    // ensure unique join code (try a few times)
    let joinCode = makeJoinCode();
    for (let i = 0; i < 5; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const exists = await prisma.registry.findUnique({ where: { joinCode } });
      if (!exists) break;
      joinCode = makeJoinCode();
    }

    const revealDt = resolveRegistryRevealDatetime({
      visibilityMode: req.body.visibilityMode,
      revealDatetime: req.body.revealDatetime,
    });
    const closeDt = resolveRegistryCloseDatetime({
      visibilityMode: req.body.visibilityMode,
      revealDatetime: req.body.revealDatetime,
      closeDatetime: req.body.closeDatetime,
    });
    const registry = await prisma.registry.create({
      data: {
        ownerId: req.user.id,
        title: req.body.title,
        ownerDisplayName: req.body.ownerDisplayName,
        message: req.body.message ?? null,
        coverImageUrl: req.body.coverImageUrl ?? null,
        joinCode,
        eventCategory: req.body.eventCategory,
        eventDate: req.body.eventDate ? new Date(req.body.eventDate) : null,
        revealDatetime: revealDt,
        closeDatetime: closeDt,
        isRevealed: new Date() >= revealDt,
        showPledgeTotalBeforeReveal: req.body.showPledgeTotalBeforeReveal ?? true,
        showConsideringItems: req.body.showConsideringItems ?? false,
        visibilityMode: req.body.visibilityMode,
        members: {
          create: { userId: req.user.id, role: "owner" },
        },
      },
    });

    res.status(201).json({
      registry: {
        id: registry.id,
        title: registry.title,
        ownerDisplayName: registry.ownerDisplayName,
        joinCode: registry.joinCode,
        visibilityMode: registry.visibilityMode,
        eventDate: registry.eventDate,
        closeDatetime: registry.closeDatetime,
        closed: new Date() >= new Date(registry.closeDatetime),
        revealDatetime: registry.revealDatetime,
        shareLink: `${config.publicClientOrigin}/registry/join/${registry.joinCode}`,
      },
    });
  }
);

registriesRouter.get("/", requireAuth, async (req, res) => {
  const memberships = await prisma.registryMember.findMany({
    where: { userId: req.user.id },
    include: {
      registry: {
        select: {
          id: true,
          title: true,
          ownerDisplayName: true,
          joinCode: true,
          eventCategory: true,
          eventDate: true,
          visibilityMode: true,
          finishedAt: true,
          closeDatetime: true,
          revealDatetime: true,
          createdAt: true,
          archivedAt: true,
          owner: { select: { avatarUrl: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const active = memberships.filter((m) => !m.registry.archivedAt);
  const registryIds = active.map((m) => m.registry.id);

  const viewerRowsByRegistry = new Map();
  if (registryIds.length > 0) {
    const viewerRows = await prisma.registryMember.findMany({
      where: { registryId: { in: registryIds }, role: "viewer" },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: [{ registryId: "asc" }, { joinedAt: "asc" }],
    });
    for (const row of viewerRows) {
      if (!viewerRowsByRegistry.has(row.registryId)) viewerRowsByRegistry.set(row.registryId, []);
      viewerRowsByRegistry.get(row.registryId).push(row);
    }
  }

  const currentUserId = req.user.id;

  res.json({
    registries: active.map((m) => {
      const revealed = new Date() >= new Date(m.registry.revealDatetime);
      const showAttribution = attributionVisible(m.registry);
      const rosterRows = viewerRowsByRegistry.get(m.registry.id) || [];
      const viewerRoster = buildViewerRoster(rosterRows, {
        role: m.role,
        revealed: showAttribution,
        currentUserId,
      });
      return {
        id: m.registry.id,
        title: m.registry.title,
        ownerDisplayName: m.registry.ownerDisplayName,
        ownerAvatarUrl: m.registry.owner?.avatarUrl ?? null,
        joinCode: m.registry.joinCode,
        eventCategory: m.registry.eventCategory,
        eventDate: m.registry.eventDate,
        visibilityMode: m.registry.visibilityMode,
        attributionVisible: showAttribution,
        role: m.role,
        finishedAt: m.registry.finishedAt,
        finished: Boolean(m.registry.finishedAt),
        closeDatetime: m.registry.closeDatetime,
        closed: new Date() >= new Date(m.registry.closeDatetime),
        revealDatetime: m.registry.revealDatetime,
        revealed,
        viewerRoster,
      };
    }),
  });
});

const joinSchema = z.object({
  joinCode: z
    .string()
    .transform((s) => s.trim().replace(/\s+/g, "").toUpperCase())
    .pipe(z.string().min(3).max(14)),
  publicDisplayName: z.union([z.string().max(80), z.literal("")]).optional(),
  hideAvatar: z.boolean().optional(),
});

const joinPreviewSchema = z.object({
  joinCode: z
    .string()
    .transform((s) => s.trim().replace(/\s+/g, "").toUpperCase())
    .pipe(z.string().min(3).max(14)),
});

registriesRouter.post("/join/preview", requireAuth, validateBody(joinPreviewSchema), async (req, res) => {
  const registry = await prisma.registry.findUnique({
    where: { joinCode: req.body.joinCode },
    select: { id: true, visibilityMode: true, archivedAt: true },
  });
  if (!registry || registry.archivedAt) throw httpError(404, "Registry not found.");
  res.json({
    registry: {
      visibilityMode: registry.visibilityMode,
    },
  });
});

registriesRouter.post("/join", joinLimiter, requireAuth, validateBody(joinSchema), async (req, res) => {
  const registry = await prisma.registry.findUnique({
    where: { joinCode: req.body.joinCode },
  });
  if (!registry || registry.archivedAt) throw httpError(404, "Registry not found.");

  const rawName = req.body.publicDisplayName;
  const publicDisplayName =
    typeof rawName === "string" && rawName.trim().length > 0 ? rawName.trim() : null;
  const hideAvatar = req.body.hideAvatar === true;
  const existingMember = await prisma.registryMember.findUnique({
    where: { registryId_userId: { registryId: registry.id, userId: req.user.id } },
    select: { id: true, role: true },
  });

  const membership = await prisma.registryMember.upsert({
    where: { registryId_userId: { registryId: registry.id, userId: req.user.id } },
    create: {
      registryId: registry.id,
      userId: req.user.id,
      role: "viewer",
      publicDisplayName,
      hideAvatar,
    },
    update: {
      ...(typeof rawName !== "undefined"
        ? { publicDisplayName }
        : {}),
      ...(typeof req.body.hideAvatar === "boolean" ? { hideAvatar } : {}),
    },
  });

  if (
    !existingMember &&
    registry.visibilityMode === "open_coordination" &&
    registry.ownerId !== req.user.id
  ) {
    await prisma.notification.create({
      data: {
        userId: registry.ownerId,
        type: "registry_member_joined",
        payloadJson: {
          registryId: registry.id,
          registryTitle: registry.title,
          joinedUserId: req.user.id,
          joinedDisplayName: publicDisplayName || req.user.name || "Someone",
        },
      },
    });
  }

  res.json({ ok: true, registryId: registry.id, role: membership.role });
});

const patchMemberMeSchema = z
  .object({
    publicDisplayName: z.union([z.string().trim().min(1).max(80), z.literal(""), z.null()]).optional(),
    hideAvatar: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, "No changes provided.");

registriesRouter.patch(
  "/:registryId/members/me",
  requireAuth,
  validateBody(patchMemberMeSchema),
  async (req, res) => {
    const { registryId } = req.params;
    await requireMembership(registryId, req.user.id);

    const data = {};
    if (Object.prototype.hasOwnProperty.call(req.body, "publicDisplayName")) {
      const v = req.body.publicDisplayName;
      data.publicDisplayName = v === "" || v === null ? null : v;
    }
    if (typeof req.body.hideAvatar === "boolean") data.hideAvatar = req.body.hideAvatar;

    await prisma.registryMember.update({
      where: { registryId_userId: { registryId, userId: req.user.id } },
      data,
    });

    res.json({ ok: true });
  }
);

registriesRouter.get("/:registryId", requireAuth, async (req, res) => {
  const { registryId } = req.params;
  const member = await requireMembership(registryId, req.user.id);

  let registry = await prisma.registry.findUnique({
    where: { id: registryId },
    include: {
      items: {
        where: { archivedAt: null },
        include: { attributes: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
      funds: {
        where: { archivedAt: null },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
    },
  });
  if (!registry || registry.archivedAt) throw httpError(404, "Registry not found.");

  registry = await reconcileRegistryRevealFlag(registry);
  const closed = new Date() >= new Date(registry.closeDatetime);
  let endedSuccessModal = null;
  let finishedAt = registry.finishedAt;

  if (closed && !finishedAt) {
    const updatedFinished = await prisma.registry.update({
      where: { id: registryId },
      data: { finishedAt: new Date() },
      select: { finishedAt: true },
    });
    finishedAt = updatedFinished.finishedAt;
    registry = { ...registry, finishedAt };
  }

  if (closed && !member.endedModalSeenAt) {
    endedSuccessModal = endedSuccessModalForCategory(registry.eventCategory);
    await prisma.registryMember.update({
      where: { registryId_userId: { registryId, userId: req.user.id } },
      data: { endedModalSeenAt: new Date() },
      select: { id: true },
    });
  }

  const revealed = isRevealed(registry);
  const showAttribution = attributionVisible(registry);

  const visibleItemIds = registry.items.filter((item) => itemShownToMember(item, member, registry)).map((i) => i.id);

  let pledgeInitiationItemIds = new Set();
  /** @type {Map<string, { id: string, name: string, avatarUrl: string | null }>} */
  const pledgeInitiatorByItemId = new Map();
  /** @type {Map<string, number>} */
  const gatheredByItemId = new Map();
  let pledgeInits = [];
  if (visibleItemIds.length > 0) {
    pledgeInits = await prisma.pledgeInitiation.findMany({
      where: { itemId: { in: visibleItemIds } },
      select: {
        itemId: true,
        initiatorUserId: true,
        initiator: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
    pledgeInitiationItemIds = new Set(pledgeInits.map((r) => r.itemId));
    for (const r of pledgeInits) {
      if (r?.itemId && r?.initiator) pledgeInitiatorByItemId.set(r.itemId, r.initiator);
    }
    if ((member.role === "viewer" || showAttribution) && pledgeInitiationItemIds.size > 0) {
      const withInit = [...pledgeInitiationItemIds];
      const pledgeSums = await prisma.pledgeContribution.groupBy({
        by: ["itemId"],
        where: {
          registryId,
          itemId: { in: withInit },
          status: { in: ["receipt_uploaded", "confirmed"] },
        },
        _sum: { amount: true },
      });
      for (const s of pledgeSums) {
        gatheredByItemId.set(s.itemId, s._sum.amount != null ? Number(s._sum.amount) : 0);
      }
    }
  }

  // per-item computed quantities + viewer's own reservations
  const viewerReservationByItem = new Map();
  if (member.role === "viewer") {
    const myReservations = await prisma.itemReservation.findMany({
      where: {
        registryId,
        userId: req.user.id,
        status: { in: ["reserved", "prepared"] },
      },
      select: { id: true, itemId: true, quantity: true, status: true, privateNote: true, createdAt: true },
    });
    for (const r of myReservations) viewerReservationByItem.set(r.itemId, r);
  }

  const memberByUserId = new Map();
  const reservationsByItemId = new Map();
  const pledgeContributionsByItemId = new Map();
  if (showAttribution && visibleItemIds.length > 0) {
    const [memberRows, reservationRows, contributionRows] = await Promise.all([
      prisma.registryMember.findMany({
        where: { registryId },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      }),
      prisma.itemReservation.findMany({
        where: {
          registryId,
          itemId: { in: visibleItemIds },
          status: { in: ["reserved", "prepared"] },
        },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      }),
      prisma.pledgeContribution.findMany({
        where: {
          registryId,
          itemId: { in: visibleItemIds },
        },
        include: { contributor: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: [{ createdAt: "desc" }],
      }),
    ]);

    for (const row of memberRows) memberByUserId.set(row.userId, row);
    for (const row of pledgeInits) {
      const initiator =
        publicRegistryMemberUser(memberByUserId.get(row.initiatorUserId)) ||
        publicGiverUser(row.initiator);
      if (row?.itemId && initiator) pledgeInitiatorByItemId.set(row.itemId, initiator);
    }
    for (const row of reservationRows) {
      if (!reservationsByItemId.has(row.itemId)) reservationsByItemId.set(row.itemId, []);
      const giver = publicRegistryMemberUser(memberByUserId.get(row.userId)) || publicGiverUser(row.user);
      reservationsByItemId.get(row.itemId).push({
        id: row.id,
        quantity: row.quantity,
        status: row.status,
        createdAt: row.createdAt,
        preparedAt: row.preparedAt,
        giver,
      });
    }
    for (const row of contributionRows) {
      if (!pledgeContributionsByItemId.has(row.itemId)) pledgeContributionsByItemId.set(row.itemId, []);
      const giver =
        publicRegistryMemberUser(memberByUserId.get(row.contributorUserId)) ||
        publicGiverUser(row.contributor);
      pledgeContributionsByItemId.get(row.itemId).push({
        id: row.id,
        amount: row.amount,
        status: row.status,
        createdAt: row.createdAt,
        contributor: giver,
      });
    }
  }

  const items = [];
  for (const item of registry.items) {
    // eslint-disable-next-line no-await-in-loop
    const qty = await getItemQuantitySummary(item.id);
    const availableQuantity = Math.max(0, item.quantityNeeded - qty.totalClaimed);
    const displayStatus = getItemDisplayStatus({
      quantityNeeded: item.quantityNeeded,
      totalReserved: qty.totalReserved,
      totalPrepared: qty.totalPrepared,
    });

    if (!itemShownToMember(item, member, registry)) continue;

    const storagePaths = normalizeItemImagePaths(item);
    let imageUrls = [];
    if (storagePaths.length > 0) {
      // eslint-disable-next-line no-await-in-loop -- bounded to ≤3 paths per item
      imageUrls = (await Promise.all(storagePaths.map((p) => signUrl(p)))).filter(Boolean);
    } else if (item.imageUrl) {
      imageUrls = [item.imageUrl];
    }
    const primaryImageUrl = imageUrls[0] ?? null;

    const base = {
      id: item.id,
      title: item.title,
      category: item.category,
      description: item.description,
      quantityNeeded: item.quantityNeeded,
      totals: {
        reserved: qty.totalReserved,
        prepared: qty.totalPrepared,
        claimed: qty.totalClaimed,
        available: availableQuantity,
      },
      hasPledge: pledgeInitiationItemIds.has(item.id),
      externalLink: item.externalLink,
      storeName: item.storeName,
      priceReference: item.priceReference,
      imageUrls,
      imageUrl: primaryImageUrl,
      preferredOption: item.preferredOption,
      acceptableAlternatives: item.acceptableAlternatives,
      viewerInstruction: item.viewerInstruction,
      ownerStatus: member.role === "owner" ? item.ownerStatus : undefined,
      ownerPrivateNote: member.role === "owner" ? item.ownerPrivateNote : undefined,
      attributes: item.attributes.map((a) => ({
        key: a.attributeKey,
        value: a.attributeValue,
      })),
      attributionVisible: showAttribution,
    };

    if (showAttribution) {
      base.attribution = {
        reservations: reservationsByItemId.get(item.id) || [],
        pledgeInitiator: pledgeInitiatorByItemId.get(item.id) || null,
        pledgeContributors: pledgeContributionsByItemId.get(item.id) || [],
      };
      if (pledgeInitiationItemIds.has(item.id)) {
        base.groupPledge = {
          gatheredAmount: gatheredByItemId.get(item.id) ?? 0,
          goalAmount: item.priceReference != null ? Number(item.priceReference) : null,
          initiator: pledgeInitiatorByItemId.get(item.id) || null,
        };
      }
    }

    if (member.role !== "owner" || showAttribution) {
      base.displayStatus = displayStatus;
    }

    if (member.role === "viewer") {
      const my = viewerReservationByItem.get(item.id) || null;
      base.myReservation = my
        ? { id: my.id, quantity: my.quantity, status: my.status, privateNote: my.privateNote, createdAt: my.createdAt }
        : null;
      if (pledgeInitiationItemIds.has(item.id)) {
        base.groupPledge = {
          gatheredAmount: gatheredByItemId.get(item.id) ?? 0,
          goalAmount: item.priceReference != null ? Number(item.priceReference) : null,
          initiator: pledgeInitiatorByItemId.get(item.id) || null,
        };
      }
    }

    items.push(base);
  }

  // cash funds: before reveal owner can optionally see total pledged only
  let pledgeTotalsByFund = new Map();
  if (member.role === "owner" && !revealed && registry.showPledgeTotalBeforeReveal) {
    const grouped = await prisma.cashPledge.groupBy({
      by: ["fundId"],
      where: { registryId },
      _sum: { amount: true },
    });
    pledgeTotalsByFund = new Map(
      grouped.map((g) => [g.fundId, g._sum.amount ? String(g._sum.amount) : "0"])
    );
  }

  res.json({
    registry: {
      id: registry.id,
      title: registry.title,
      ownerDisplayName: registry.ownerDisplayName,
      message: registry.message,
      coverImageUrl: registry.coverImageUrl,
      joinCode: registry.joinCode,
      eventCategory: registry.eventCategory,
      visibilityMode: registry.visibilityMode,
      attributionVisible: showAttribution,
      eventDate: registry.eventDate,
      finishedAt,
      finished: Boolean(finishedAt),
      closeDatetime: registry.closeDatetime,
      closed,
      revealDatetime: registry.revealDatetime,
      revealed,
      showPledgeTotalBeforeReveal: registry.showPledgeTotalBeforeReveal,
      showConsideringItems: registry.showConsideringItems,
      role: member.role,
      endedSuccessModal,
    },
    items,
    cashFunds: await Promise.all(
      registry.funds.map(async (f) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        imageUrl: f.imagePath ? await signUrl(f.imagePath) : null,
        targetAmount: f.targetAmount,
        suggestedAmount: f.suggestedAmount,
        instructions: f.instructions,
        sortOrder: f.sortOrder,
        totalPledgedBeforeReveal:
          member.role === "owner" && !revealed && registry.showPledgeTotalBeforeReveal
            ? pledgeTotalsByFund.get(f.id) ?? "0"
            : undefined,
      }))
    ),
  });
});

const patchRegistrySchema = z
  .object({
    title: z.string().min(1).max(120).optional(),
    ownerDisplayName: z.string().min(1).max(80).optional(),
    message: z.string().max(600).optional().nullable(),
    coverImageUrl: z.string().url().optional().nullable(),
    eventCategory: registryEventCategorySchema.optional(),
    eventDate: z.string().datetime().optional().nullable(),
    revealDatetime: z.string().datetime().optional(),
    closeDatetime: z.string().datetime().optional(),
    showPledgeTotalBeforeReveal: z.boolean().optional(),
    showConsideringItems: z.boolean().optional(),
    visibilityMode: z.never().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, "No changes provided.");

registriesRouter.patch(
  "/:registryId",
  requireAuth,
  validateBody(patchRegistrySchema),
  async (req, res) => {
    const { registryId } = req.params;
    await requireOwner(registryId, req.user.id);
    const existing = await prisma.registry.findUnique({
      where: { id: registryId },
      select: { id: true, visibilityMode: true, revealDatetime: true, closeDatetime: true },
    });
    if (!existing) throw httpError(404, "Registry not found.");

    const nextRevealDatetime = req.body.revealDatetime ? new Date(req.body.revealDatetime) : existing.revealDatetime;
    const nextCloseDatetime =
      existing.visibilityMode === "private_until_reveal"
        ? nextRevealDatetime
        : req.body.closeDatetime
          ? new Date(req.body.closeDatetime)
          : existing.closeDatetime;

    const updated = await prisma.registry.update({
      where: { id: registryId },
      data: {
        ...(req.body.title ? { title: req.body.title } : {}),
        ...(req.body.ownerDisplayName ? { ownerDisplayName: req.body.ownerDisplayName } : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "message") ? { message: req.body.message } : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "coverImageUrl") ? { coverImageUrl: req.body.coverImageUrl } : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "eventDate")
          ? { eventDate: req.body.eventDate ? new Date(req.body.eventDate) : null }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(req.body, "eventCategory")
          ? { eventCategory: req.body.eventCategory }
          : {}),
        ...(req.body.revealDatetime ? { revealDatetime: nextRevealDatetime } : {}),
        ...(req.body.revealDatetime || req.body.closeDatetime ? { closeDatetime: nextCloseDatetime } : {}),
        ...(typeof req.body.showPledgeTotalBeforeReveal === "boolean"
          ? { showPledgeTotalBeforeReveal: req.body.showPledgeTotalBeforeReveal }
          : {}),
        ...(typeof req.body.showConsideringItems === "boolean"
          ? { showConsideringItems: req.body.showConsideringItems }
          : {}),
      },
      select: {
        id: true,
        title: true,
        ownerDisplayName: true,
        message: true,
        eventCategory: true,
        eventDate: true,
        revealDatetime: true,
        closeDatetime: true,
        isRevealed: true,
        showPledgeTotalBeforeReveal: true,
        showConsideringItems: true,
        visibilityMode: true,
      },
    });

    const synced = await reconcileRegistryRevealFlag(updated);
    const { isRevealed: _persistedReveal, ...rest } = synced;
    res.json({ registry: { ...rest, closed: new Date() >= new Date(rest.closeDatetime) } });
  }
);

registriesRouter.delete("/:registryId", requireAuth, async (req, res) => {
  const { registryId } = req.params;
  await requireOwner(registryId, req.user.id);
  const registry = await prisma.registry.findFirst({
    where: { id: registryId, ownerId: req.user.id },
    select: { id: true },
  });
  if (!registry) throw httpError(404, "Registry not found.");
  await deleteRegistryCompletely(registryId);
  res.json({ ok: true });
});

registriesRouter.post("/:registryId/finish", requireAuth, async (req, res) => {
  const { registryId } = req.params;
  await requireOwner(registryId, req.user.id);

  const registry = await prisma.registry.findUnique({
    where: { id: registryId },
    select: { id: true, closeDatetime: true, finishedAt: true, archivedAt: true },
  });
  if (!registry || registry.archivedAt) throw httpError(404, "Registry not found.");

  const closed = new Date() >= new Date(registry.closeDatetime);
  if (!closed) {
    throw httpError(400, "You can finish a registry after it closes.");
  }

  if (!registry.finishedAt) {
    await prisma.registry.update({
      where: { id: registryId },
      data: { finishedAt: new Date() },
      select: { id: true },
    });
  }

  res.json({ ok: true });
});

registriesRouter.get("/:registryId/reveal", requireAuth, async (req, res) => {
  const { registryId } = req.params;
  await requireOwner(registryId, req.user.id);

  let registry = await prisma.registry.findUnique({
    where: { id: registryId },
    select: {
      id: true,
      title: true,
      ownerDisplayName: true,
      revealDatetime: true,
      closeDatetime: true,
      isRevealed: true,
      visibilityMode: true,
      showPledgeTotalBeforeReveal: true,
    },
  });
  if (!registry) throw httpError(404, "Registry not found.");

  registry = await reconcileRegistryRevealFlag(registry);

  const revealed = new Date() >= new Date(registry.revealDatetime);
  const showAttribution = attributionVisible(registry);
  if (!showAttribution) {
    return res.json({
      revealed: false,
      revealDatetime: registry.revealDatetime,
      closeDatetime: registry.closeDatetime,
      closed: new Date() >= new Date(registry.closeDatetime),
      message: "Reveal is not available yet.",
    });
  }

  const preparedReservations = await prisma.itemReservation.findMany({
    where: { registryId, status: "prepared" },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      item: { select: { id: true, title: true, category: true } },
    },
    orderBy: [{ preparedAt: "desc" }, { createdAt: "desc" }],
  });

  const pledges = await prisma.cashPledge.findMany({
    where: { registryId },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      fund: { select: { id: true, title: true } },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  // Fire pledge shortfall notifications (idempotent — skips if already sent)
  const pledgeInits = await prisma.pledgeInitiation.findMany({
    where: { registryId },
    include: { item: { select: { id: true, title: true, priceReference: true } } },
  });

  if (pledgeInits.length > 0) {
    const pledgeItemIds = pledgeInits.map((pi) => pi.itemId);
    const pledgeSums = await prisma.pledgeContribution.groupBy({
      by: ["itemId"],
      where: {
        registryId,
        itemId: { in: pledgeItemIds },
        status: { in: ["receipt_uploaded", "confirmed"] },
      },
      _sum: { amount: true },
    });
    const gatheredMap = new Map(
      pledgeSums.map((s) => [s.itemId, s._sum.amount != null ? Number(s._sum.amount) : 0])
    );

    for (const pi of pledgeInits) {
      const goal = pi.item.priceReference != null ? Number(pi.item.priceReference) : null;
      if (goal === null) continue;
      const gathered = gatheredMap.get(pi.itemId) ?? 0;
      if (gathered >= goal) continue;

      const alreadyNotified = await prisma.notification.findFirst({
        where: {
          userId: pi.initiatorUserId,
          type: "pledge_goal_not_reached",
          payloadJson: { path: ["itemId"], equals: pi.itemId },
        },
      });
      if (alreadyNotified) continue;

      await prisma.notification.create({
        data: {
          userId: pi.initiatorUserId,
          type: "pledge_goal_not_reached",
          payloadJson: {
            registryId,
            itemId: pi.itemId,
            itemTitle: pi.item.title,
            gatheredAmount: String(gathered),
            goalAmount: String(goal),
          },
        },
      });
    }
  }

  res.json({
    revealed,
    closed: new Date() >= new Date(registry.closeDatetime),
    attributionVisible: showAttribution,
    revealDatetime: registry.revealDatetime,
    closeDatetime: registry.closeDatetime,
    prepared: preparedReservations.map((r) => ({
      id: r.id,
      item: r.item,
      giver: publicGiverUser(r.user),
      quantity: r.quantity,
      privateNote: r.privateNote,
      preparedAt: r.preparedAt,
    })),
    pledges: pledges.map((p) => ({
      id: p.id,
      fund: p.fund,
      giver: publicGiverUser(p.user),
      amount: p.amount,
      privateNote: p.privateNote,
      createdAt: p.createdAt,
    })),
  });
});

module.exports = { registriesRouter };
