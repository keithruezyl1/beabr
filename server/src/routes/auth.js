const express = require("express");
const { z } = require("zod");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { prisma } = require("../prisma");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { config } = require("../config");

const authRouter = express.Router();

const baseUserSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  createdAt: true,
  lastLoginAt: true,
};

function mapUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatarUrl: row.avatarUrl,
    authProvider: row.googleId ? "google" : "email",
    hadTour: Boolean(row.hadTour),
    createdAt: row.createdAt,
    lastLoginAt: row.lastLoginAt,
  };
}

async function findUserProfile(userId) {
  const rows = await prisma.$queryRaw`
    SELECT
      id::text AS id,
      name,
      email,
      "googleId",
      "avatarUrl",
      had_tour AS "hadTour",
      "createdAt",
      "lastLoginAt"
    FROM users
    WHERE id = ${userId}::uuid
    LIMIT 1
  `;
  return mapUserRow(rows[0]);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});

authRouter.get("/me", async (req, res) => {
  if (!req.user) return res.json({ user: null });

  // If we couldn't sync to DB (e.g. DB unreachable), still return a profile so the client
  // can stay logged in, but DB-backed pages will fail until the DB is reachable.
  if (!req.user.id && req.user.profile) {
    return res.json({ user: req.user.profile, dbOk: false });
  }

  if (!req.user?.id) return res.json({ user: null });

  try {
    const user = await findUserProfile(req.user.id);
    res.json({ user, dbOk: true });
  } catch (_e) {
    // If DB errors happen after a valid Supabase session, keep the session on the client.
    res.json({ user: req.user.profile ?? null, dbOk: false });
  }
});

authRouter.post("/logout", (_req, res) => res.json({ ok: true }));

authRouter.patch(
  "/me",
  requireAuth,
  validateBody(
    z
      .object({
        name: z.string().trim().min(1).max(80).optional(),
        avatarUrl: z
          .string()
          .trim()
          .url()
          .optional()
          .or(z.literal(""))
          .transform((v) => (v ? v : null)),
      })
      .strict()
  ),
  async (req, res, next) => {
    try {
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...(typeof req.body.name === "string" ? { name: req.body.name } : {}),
          ...(typeof req.body.avatarUrl !== "undefined" ? { avatarUrl: req.body.avatarUrl } : {}),
        },
        select: baseUserSelect,
      });
      const updated = await findUserProfile(req.user.id);
      res.json({ user: updated });
    } catch (e) {
      next(e);
    }
  }
);

authRouter.post("/me/avatar", requireAuth, upload.single("avatar"), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: { message: "Missing avatar file." } });
    if (!file.mimetype?.startsWith("image/")) {
      return res.status(400).json({ error: { message: "Avatar must be an image." } });
    }

    const uploadsDir = path.join(process.cwd(), "uploads", "avatars");
    fs.mkdirSync(uploadsDir, { recursive: true });

    const ext =
      file.mimetype === "image/png"
        ? "png"
        : file.mimetype === "image/webp"
        ? "webp"
        : file.mimetype === "image/gif"
        ? "gif"
        : "jpg";

    const filename = `${crypto.randomUUID()}.${ext}`;
    const absPath = path.join(uploadsDir, filename);
    fs.writeFileSync(absPath, file.buffer);

    const publicPath = `/uploads/avatars/${filename}`;
    const avatarUrl = `${config.serverUrl}${publicPath}`;

    await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl },
      select: baseUserSelect,
    });
    const updated = await findUserProfile(req.user.id);

    res.json({ user: updated, avatarUrl });
  } catch (e) {
    next(e);
  }
});

authRouter.patch("/me/tour", requireAuth, async (req, res, next) => {
  try {
    const hadTour = typeof req.body?.hadTour === "boolean" ? req.body.hadTour : true;
    const rows = await prisma.$queryRaw`
      UPDATE users
      SET had_tour = ${hadTour}, "updatedAt" = now()
      WHERE id = ${req.user.id}::uuid
      RETURNING
        id::text AS id,
        name,
        email,
        "googleId",
        "avatarUrl",
        had_tour AS "hadTour",
        "createdAt",
        "lastLoginAt"
    `;
    res.json({ user: mapUserRow(rows[0]) });
  } catch (e) {
    next(e);
  }
});

authRouter.get("/whoami", requireAuth, async (req, res) => {
  const user = await findUserProfile(req.user.id);
  res.json({ user });
});

module.exports = { authRouter };
