ALTER TABLE "registry_members"
  ADD COLUMN IF NOT EXISTS "ended_modal_seen_at" TIMESTAMP(3);
