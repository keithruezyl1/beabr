const rateLimit = require("express-rate-limit");

/** Broad limit for authenticated + anonymous `/api/*` traffic. */
function createApiLimiter() {
  return rateLimit({
    windowMs: 60 * 1000,
    limit: Number(process.env.RATE_LIMIT_PER_MIN ?? 240),
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: { message: "Too many requests. Wait a moment and try again.", code: "RATE_LIMIT" },
    },
    skip(req) {
      return (
        req.method === "GET" &&
        (req.path === "/health" ||
          req.originalUrl === "/api/health" ||
          req.originalUrl.endsWith("/api/health"))
      );
    },
  });
}

/** Tighter gate for guessing join codes. */
function createJoinLimiter() {
  return rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: Number(process.env.RATE_LIMIT_JOIN_PER_10M ?? 50),
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: { message: "Too many join attempts. Wait and try again.", code: "RATE_LIMIT_JOIN" },
    },
  });
}

module.exports = { createApiLimiter, createJoinLimiter };
