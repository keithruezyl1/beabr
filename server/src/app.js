const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");

const { config } = require("./config");
const { getSessionUser } = require("./middleware/auth");
const { createApiLimiter } = require("./middleware/rateLimits");

const { authRouter } = require("./routes/auth");
const { registriesRouter } = require("./routes/registries");
const { itemsRouter } = require("./routes/items");
const { reservationsRouter } = require("./routes/reservations");
const { cashFundsRouter } = require("./routes/cashFunds");
const { thankYouRouter } = require("./routes/thankYou");
const { pledgesRouter } = require("./routes/pledges");

const apiLimiter = createApiLimiter();

function createApp() {
  const app = express();

  if (config.trustProxy) {
    app.set("trust proxy", 1);
  }

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  const corsAllowed =
    config.env === "production"
      ? [config.publicClientOrigin]
      : config.corsDevelopmentOrigins;

  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true);
        if (corsAllowed.includes(origin)) return cb(null, true);
        return cb(null, false);
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(config.env === "production" ? morgan("common") : morgan("dev"));

  app.use("/api", apiLimiter);

  // Serve uploaded assets (e.g., user avatars)
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // attach session user if present
  app.use(async (req, _res, next) => {
    try {
      const user = await getSessionUser(req);
      if (user) req.user = user;
      next();
    } catch (err) {
      // Never hard-fail the entire request due to auth hydration.
      // If token verification or DB sync fails, treat request as unauthenticated.
      next();
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, name: "beabr-api" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/registries", registriesRouter);
  app.use("/api", itemsRouter);
  app.use("/api", reservationsRouter);
  app.use("/api", cashFundsRouter);
  app.use("/api", pledgesRouter);
  app.use("/api/thank-you", thankYouRouter);

  const isProd = config.env === "production";

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err?.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: { message: "File too large.", code: "FILE_TOO_LARGE" },
      });
    }

    const prismaCode = typeof err?.code === "string" && /^P\d{4}$/.test(err.code) ? err.code : null;
    const prismaMessage = typeof err?.message === "string" ? err.message : "";

    const isDbUnreachable =
      prismaCode === "P1001" ||
      prismaMessage.includes("P1001") ||
      prismaMessage.toLowerCase().includes("can't reach database server");

    const status = isDbUnreachable ? 503 : err.status || err.statusCode || 500;

    let clientMessage =
      typeof err.message === "string" && err.message.trim().length > 0 ? err.message : "Server error";

    if (isDbUnreachable && isProd) {
      clientMessage =
        "Database is unreachable from the server. Check Supabase network restrictions / DB status.";
    } else if (status >= 500 && isProd && !err.exposeInProduction) {
      if (prismaMessage.includes("ECONNRESET") || prismaMessage.includes("ETIMEDOUT")) {
        clientMessage = "An upstream dependency failed temporarily. Try again shortly.";
      } else {
        clientMessage = "Something went wrong.";
      }
    }

    const payload = { error: { message: clientMessage } };

    if (status < 500 || isProd !== true || err.exposeInProduction) {
      if (err.details) payload.error.details = err.details;
    }

    if (isDbUnreachable) {
      payload.error.code = "DB_UNREACHABLE";
    } else if (prismaCode && (!isProd || err.exposeInProduction || status < 500)) {
      payload.error.code = prismaCode;
    }

    console.error(`[${status}]`, prismaMessage || err.message, isProd ? "" : err.stack ?? "");

    if (!isProd && err.stack) payload.error.stack = err.stack;

    res.status(status).json(payload);
  });

  return app;
}

module.exports = { createApp };
