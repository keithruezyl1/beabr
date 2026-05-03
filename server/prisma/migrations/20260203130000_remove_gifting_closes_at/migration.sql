-- Remove optional gifting deadline (no longer used).
ALTER TABLE "registries" DROP COLUMN IF EXISTS "gifting_closes_at";
