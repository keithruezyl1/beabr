const { config } = require("../config");
const { httpError } = require("../utils/httpErrors");
const { createClient } = require("@supabase/supabase-js");
const { prisma } = require("../prisma");
const { extractSupabaseAvatarUrl, resolveAvatarUrl } = require("../utils/avatar");

function getBearerToken(req) {
  const h = req.headers.authorization || "";
  if (!h.toLowerCase().startsWith("bearer ")) return null;
  return h.slice(7).trim();
}

function getSupabaseAdmin() {
  if (!config.isSupabaseConfigured) {
    throw httpError(
      500,
      "Supabase is not configured on the server.",
      { requiredEnv: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] },
      { exposeInProduction: true }
    );
  }
  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}

async function getSessionUser(req) {
  const token = getBearerToken(req);
  if (!token) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user?.id) return null;

  const sUser = data.user;
  const email = sUser.email;
  const avatarUrl = extractSupabaseAvatarUrl(sUser);

  /** Google OAuth subject (`sub`), not Supabase Auth user UUID. */
  const googleIdentity = Array.isArray(sUser.identities)
    ? sUser.identities.find((i) => i.provider === "google")
    : null;
  const googleIdResolved = googleIdentity?.identity_id ?? null;

  const profile = {
    id: null,
    supabaseId: sUser.id,
    name: "",
    email: email || `${sUser.id}@users.local`,
    avatarUrl: resolveAvatarUrl(avatarUrl),
    authProvider: googleIdResolved ? "google" : "email",
  };

  try {
    const appUser = await prisma.user.upsert({
      where: { supabaseId: sUser.id },
      create: {
        supabaseId: sUser.id,
        googleId: googleIdResolved,
        email: email || `${sUser.id}@users.local`,
        name: "",
        avatarUrl,
        lastLoginAt: new Date(),
      },
      update: {
        email: email || `${sUser.id}@users.local`,
        lastLoginAt: new Date(),
        ...(googleIdResolved ? { googleId: googleIdResolved } : {}),
        ...(avatarUrl ? { avatarUrl } : {}),
      },
    });

    return { id: appUser.id, supabaseId: sUser.id, profile, dbOk: true };
  } catch (_e) {
    return { id: null, supabaseId: sUser.id, profile, dbOk: false };
  }
}

async function requireAuth(req, _res, next) {
  const user = await getSessionUser(req);
  if (!user) return next(httpError(401, "Not authenticated."));
  if (!user.id || user.dbOk === false) {
    return next(
      httpError(
        503,
        "We couldn’t sync your account with Beabr yet. Try again shortly.",
        { code: "ACCOUNT_SYNC_UNAVAILABLE" },
        { exposeInProduction: true }
      )
    );
  }
  req.user = user;
  next();
}

module.exports = {
  getSessionUser,
  requireAuth,
};
