DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'registries'
      AND column_name = 'graduationDate'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'registries'
      AND column_name = 'event_date'
  ) THEN
    ALTER TABLE "registries" RENAME COLUMN "graduationDate" TO "event_date";
  END IF;
END $$;

ALTER TABLE "registries"
  ADD COLUMN IF NOT EXISTS "close_datetime" TIMESTAMP(3);

UPDATE "registries"
SET "close_datetime" = "revealDatetime"
WHERE "close_datetime" IS NULL;

ALTER TABLE "registries"
  ALTER COLUMN "close_datetime" SET NOT NULL;

ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'registry_member_joined';
