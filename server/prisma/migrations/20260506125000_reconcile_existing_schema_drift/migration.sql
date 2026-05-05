-- Reconcile schema changes that already exist in the Supabase database but were
-- not represented by the applied migration chain. Statements are idempotent so
-- fresh shadow databases and existing deployments converge to the Prisma schema.

ALTER TABLE IF EXISTS "users"
  ADD COLUMN IF NOT EXISTS "supabaseId" TEXT;

ALTER TABLE IF EXISTS "users"
  ALTER COLUMN "googleId" DROP NOT NULL;

UPDATE "users"
SET "supabaseId" = COALESCE("supabaseId", "googleId", "id"::TEXT)
WHERE "supabaseId" IS NULL;

ALTER TABLE IF EXISTS "users"
  ALTER COLUMN "supabaseId" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "users_supabaseId_key" ON "users"("supabaseId");

ALTER TABLE IF EXISTS "registry_items"
  ADD COLUMN IF NOT EXISTS "imagePath" TEXT;

ALTER TABLE IF EXISTS "cash_funds"
  ADD COLUMN IF NOT EXISTS "imagePath" TEXT;

ALTER TABLE IF EXISTS "registries"
  ADD COLUMN IF NOT EXISTS "finished_at" TIMESTAMP(3);

ALTER TABLE IF EXISTS "registries"
  ALTER COLUMN "finished_at" TYPE TIMESTAMP(3)
  USING "finished_at" AT TIME ZONE 'UTC';

ALTER TABLE IF EXISTS "registries"
  DROP COLUMN IF EXISTS "gifting_closes_at";
