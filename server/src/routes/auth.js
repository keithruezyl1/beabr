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
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
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
      const updated = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...(typeof req.body.name === "string" ? { name: req.body.name } : {}),
          ...(typeof req.body.avatarUrl !== "undefined" ? { avatarUrl: req.body.avatarUrl } : {}),
        },
        select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true, lastLoginAt: true },
      });
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

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl },
      select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true, lastLoginAt: true },
    });

    res.json({ user: updated, avatarUrl });
  } catch (e) {
    next(e);
  }
});

authRouter.get("/whoami", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, avatarUrl: true },
  });
  res.json({ user });
});

module.exports = { authRouter };

