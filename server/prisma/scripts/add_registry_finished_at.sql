-- Adds a "finished" state without deleting registries.
-- Safe to run multiple times.

ALTER TABLE "registries"
ADD COLUMN IF NOT EXISTS "finished_at" TIMESTAMPTZ;

