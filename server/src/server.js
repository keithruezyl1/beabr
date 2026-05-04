const { createApp } = require("./app");
const { config } = require("./config");

const app = createApp();

const port = (() => {
  const fromEnv = Number(process.env.PORT);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;
  try {
    const u = new URL(config.serverUrl);
    return Number(u.port) || 5000;
  } catch {
    return 5000;
  }
})();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Beabr API listening on ${config.serverUrl} (port ${port})`);
  if (!config.databaseUrl) {
    // eslint-disable-next-line no-console
    console.warn("DATABASE_URL is missing. API routes using DB will fail.");
  }
  if (!config.isSupabaseConfigured) {
    // eslint-disable-next-line no-console
    console.warn(
      "Supabase API auth is incomplete (set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY). The API cannot validate Bearer tokens until then."
    );
  }
});

