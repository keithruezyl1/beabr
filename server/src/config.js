require("dotenv").config();

function mustGetEnv(name) {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

function normalizeOrigin(url) {
  return url.replace(/\/$/, "");
}

/** Dev-only CORS allowlist so we do not reflect arbitrary Origins while using credentials (see docs/security remediation). */
function buildDevelopmentCorsOrigins(clientUrl) {
  const base = normalizeOrigin(clientUrl || "http://localhost:5173");
  /** @type {Set<string>} */
  const origins = new Set([
    base,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
  ]);

  const extra = mustGetEnv("DEV_CORS_ORIGINS");
  if (extra) {
    for (const part of extra.split(",")) {
      const trimmed = part.trim();
      if (trimmed.length > 0) origins.add(trimmed);
    }
  }
  return [...origins];
}

const rawClientUrl = mustGetEnv("CLIENT_URL") || "http://localhost:5173";

const config = {
  env: mustGetEnv("NODE_ENV") || "development",
  databaseUrl: mustGetEnv("DATABASE_URL"),
  googleClientId: mustGetEnv("GOOGLE_CLIENT_ID"),
  googleClientSecret: mustGetEnv("GOOGLE_CLIENT_SECRET"),
  jwtSecret: mustGetEnv("JWT_SECRET"),
  clientUrl: rawClientUrl,
  /** Canonical web origin without trailing slash (share links and CORS in production). */
  publicClientOrigin: normalizeOrigin(rawClientUrl),
  serverUrl: mustGetEnv("SERVER_URL") || "http://localhost:5000",
  supabaseUrl: mustGetEnv("SUPABASE_URL"),
  supabaseServiceRoleKey: mustGetEnv("SUPABASE_SERVICE_ROLE_KEY"),
  supabaseStorageBucket: mustGetEnv("SUPABASE_STORAGE_BUCKET") || "beabr-pledges",
  /** AES-256 key for payout field + pledge QR payloads (base64-encoded 32 random bytes); see server/.env.example. */
  pledgeEncryptionKeyBase64: mustGetEnv("BEABR_PLEDGE_ENCRYPTION_KEY"),
  corsDevelopmentOrigins: buildDevelopmentCorsOrigins(rawClientUrl),
  /** Set to `1` or `true` when Express runs behind a reverse proxy so rate-limit and IPs are correct. */
  trustProxy: mustGetEnv("TRUST_PROXY") === "1" || /^true$/i.test(mustGetEnv("TRUST_PROXY")),
};

config.isGoogleOAuthConfigured =
  Boolean(config.googleClientId) && Boolean(config.googleClientSecret);

config.isJwtConfigured = Boolean(config.jwtSecret);

const supabaseUrlLooksLikeDb =
  typeof config.supabaseUrl === "string" &&
  config.supabaseUrl.toLowerCase().startsWith("postgresql://");

config.isSupabaseConfigured =
  Boolean(config.supabaseUrl) &&
  Boolean(config.supabaseServiceRoleKey) &&
  !supabaseUrlLooksLikeDb;

module.exports = { config };

