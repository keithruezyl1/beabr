-- Restore tables that the application and Prisma schema expect in production.
-- Registries are represented by one canonical table: "registries".

CREATE TABLE IF NOT EXISTS "registries" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "ownerDisplayName" TEXT NOT NULL,
    "message" TEXT,
    "coverImageUrl" TEXT,
    "joinCode" TEXT NOT NULL,
    "event_category" VARCHAR(48) NOT NULL DEFAULT 'Graduation',
    "event_date" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "revealDatetime" TIMESTAMP(3) NOT NULL,
    "close_datetime" TIMESTAMP(3) NOT NULL,
    "showPledgeTotalBeforeReveal" BOOLEAN NOT NULL DEFAULT true,
    "showConsideringItems" BOOLEAN NOT NULL DEFAULT false,
    "visibility_mode" "RegistryVisibilityMode" NOT NULL DEFAULT 'private_until_reveal',
    "isRevealed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    CONSTRAINT "registries_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "registries_joinCode_key" ON "registries"("joinCode");
CREATE INDEX IF NOT EXISTS "registries_ownerId_idx" ON "registries"("ownerId");

CREATE TABLE IF NOT EXISTS "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seenAt" TIMESTAMP(3),
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "notifications_userId_seenAt_idx" ON "notifications"("userId", "seenAt");

ALTER TABLE "registries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;


DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'registries_ownerId_fkey'
  ) THEN
    ALTER TABLE "registries"
      ADD CONSTRAINT "registries_ownerId_fkey"
      FOREIGN KEY ("ownerId") REFERENCES "users"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'registry_members_registryId_fkey'
  ) THEN
    ALTER TABLE "registry_members"
      ADD CONSTRAINT "registry_members_registryId_fkey"
      FOREIGN KEY ("registryId") REFERENCES "registries"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'registry_items_registryId_fkey'
  ) THEN
    ALTER TABLE "registry_items"
      ADD CONSTRAINT "registry_items_registryId_fkey"
      FOREIGN KEY ("registryId") REFERENCES "registries"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'item_reservations_registryId_fkey'
  ) THEN
    ALTER TABLE "item_reservations"
      ADD CONSTRAINT "item_reservations_registryId_fkey"
      FOREIGN KEY ("registryId") REFERENCES "registries"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cash_funds_registryId_fkey'
  ) THEN
    ALTER TABLE "cash_funds"
      ADD CONSTRAINT "cash_funds_registryId_fkey"
      FOREIGN KEY ("registryId") REFERENCES "registries"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cash_pledges_registryId_fkey'
  ) THEN
    ALTER TABLE "cash_pledges"
      ADD CONSTRAINT "cash_pledges_registryId_fkey"
      FOREIGN KEY ("registryId") REFERENCES "registries"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pledge_initiations_registryId_fkey'
  ) THEN
    ALTER TABLE "pledge_initiations"
      ADD CONSTRAINT "pledge_initiations_registryId_fkey"
      FOREIGN KEY ("registryId") REFERENCES "registries"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pledge_contributions_registryId_fkey'
  ) THEN
    ALTER TABLE "pledge_contributions"
      ADD CONSTRAINT "pledge_contributions_registryId_fkey"
      FOREIGN KEY ("registryId") REFERENCES "registries"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'thank_you_messages_registryId_fkey'
  ) THEN
    ALTER TABLE "thank_you_messages"
      ADD CONSTRAINT "thank_you_messages_registryId_fkey"
      FOREIGN KEY ("registryId") REFERENCES "registries"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'notifications_userId_fkey'
  ) THEN
    ALTER TABLE "notifications"
      ADD CONSTRAINT "notifications_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;


