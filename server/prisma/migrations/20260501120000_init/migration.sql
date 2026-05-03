-- Initial schema for Beabr (includes pledge receipts + notifications)

-- CreateEnum
CREATE TYPE "RegistryMemberRole" AS ENUM ('owner', 'viewer');

-- CreateEnum
CREATE TYPE "RegistryItemOwnerStatus" AS ENUM ('confirmed', 'considering', 'removed');

-- CreateEnum
CREATE TYPE "ItemReservationStatus" AS ENUM ('reserved', 'prepared', 'cancelled');

-- CreateEnum
CREATE TYPE "ThankYouStatus" AS ENUM ('draft', 'sent', 'seen');

-- CreateEnum
CREATE TYPE "PledgePayoutMethod" AS ENUM ('bank', 'gcash', 'other');

-- CreateEnum
CREATE TYPE "PledgeContributionStatus" AS ENUM ('pending_receipt', 'receipt_uploaded', 'confirmed');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('pledge_receipt_uploaded');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "googleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registries" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "ownerDisplayName" TEXT NOT NULL,
    "message" TEXT,
    "coverImageUrl" TEXT,
    "joinCode" TEXT NOT NULL,
    "graduationDate" TIMESTAMP(3),
    "revealDatetime" TIMESTAMP(3) NOT NULL,
    "showPledgeTotalBeforeReveal" BOOLEAN NOT NULL DEFAULT true,
    "showConsideringItems" BOOLEAN NOT NULL DEFAULT false,
    "isRevealed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    CONSTRAINT "registries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registry_members" (
    "id" UUID NOT NULL,
    "registryId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "RegistryMemberRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "registry_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registry_items" (
    "id" UUID NOT NULL,
    "registryId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "quantityNeeded" INTEGER NOT NULL DEFAULT 1,
    "ownerStatus" "RegistryItemOwnerStatus" NOT NULL DEFAULT 'confirmed',
    "externalLink" TEXT,
    "storeName" TEXT,
    "priceReference" DECIMAL(12,2),
    "imageUrl" TEXT,
    "preferredOption" TEXT,
    "acceptableAlternatives" TEXT,
    "ownerPrivateNote" TEXT,
    "viewerInstruction" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    CONSTRAINT "registry_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_attributes" (
    "id" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "attributeKey" TEXT NOT NULL,
    "attributeValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "item_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_reservations" (
    "id" UUID NOT NULL,
    "registryId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "ItemReservationStatus" NOT NULL DEFAULT 'reserved',
    "privateNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "preparedAt" TIMESTAMP(3),
    CONSTRAINT "item_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_funds" (
    "id" UUID NOT NULL,
    "registryId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetAmount" DECIMAL(12,2),
    "suggestedAmount" DECIMAL(12,2),
    "instructions" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    CONSTRAINT "cash_funds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_pledges" (
    "id" UUID NOT NULL,
    "registryId" UUID NOT NULL,
    "fundId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "privateNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "cash_pledges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pledge_initiations" (
    "id" UUID NOT NULL,
    "registryId" UUID NOT NULL,
    "fundId" UUID NOT NULL,
    "initiatorUserId" UUID NOT NULL,
    "payoutMethod" "PledgePayoutMethod" NOT NULL,
    "payoutName" TEXT,
    "payoutAccount" TEXT,
    "payoutInstitution" TEXT,
    "payoutNotes" TEXT,
    "qrImagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "pledge_initiations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pledge_contributions" (
    "id" UUID NOT NULL,
    "registryId" UUID NOT NULL,
    "fundId" UUID NOT NULL,
    "initiationId" UUID NOT NULL,
    "contributorUserId" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "PledgeContributionStatus" NOT NULL DEFAULT 'pending_receipt',
    "receiptImagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "pledge_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seenAt" TIMESTAMP(3),
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thank_you_messages" (
    "id" UUID NOT NULL,
    "registryId" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "giverId" UUID NOT NULL,
    "itemReservationId" UUID,
    "cashPledgeId" UUID,
    "message" TEXT NOT NULL,
    "status" "ThankYouStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "seenAt" TIMESTAMP(3),
    CONSTRAINT "thank_you_messages_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "registries_joinCode_key" ON "registries"("joinCode");
CREATE INDEX "registries_ownerId_idx" ON "registries"("ownerId");
CREATE INDEX "registry_members_userId_idx" ON "registry_members"("userId");
CREATE UNIQUE INDEX "registry_members_registryId_userId_key" ON "registry_members"("registryId", "userId");
CREATE INDEX "registry_items_registryId_sortOrder_idx" ON "registry_items"("registryId", "sortOrder");
CREATE INDEX "item_attributes_attributeKey_idx" ON "item_attributes"("attributeKey");
CREATE UNIQUE INDEX "item_attributes_itemId_attributeKey_key" ON "item_attributes"("itemId", "attributeKey");
CREATE INDEX "item_reservations_registryId_idx" ON "item_reservations"("registryId");
CREATE INDEX "item_reservations_itemId_idx" ON "item_reservations"("itemId");
CREATE INDEX "item_reservations_userId_idx" ON "item_reservations"("userId");
CREATE INDEX "cash_funds_registryId_sortOrder_idx" ON "cash_funds"("registryId", "sortOrder");
CREATE INDEX "cash_pledges_registryId_idx" ON "cash_pledges"("registryId");
CREATE INDEX "cash_pledges_fundId_idx" ON "cash_pledges"("fundId");
CREATE INDEX "cash_pledges_userId_idx" ON "cash_pledges"("userId");
CREATE UNIQUE INDEX "pledge_initiations_fundId_key" ON "pledge_initiations"("fundId");
CREATE INDEX "pledge_initiations_registryId_idx" ON "pledge_initiations"("registryId");
CREATE INDEX "pledge_initiations_initiatorUserId_idx" ON "pledge_initiations"("initiatorUserId");
CREATE INDEX "pledge_contributions_registryId_idx" ON "pledge_contributions"("registryId");
CREATE INDEX "pledge_contributions_fundId_idx" ON "pledge_contributions"("fundId");
CREATE INDEX "pledge_contributions_initiationId_idx" ON "pledge_contributions"("initiationId");
CREATE INDEX "pledge_contributions_contributorUserId_idx" ON "pledge_contributions"("contributorUserId");
CREATE INDEX "notifications_userId_seenAt_idx" ON "notifications"("userId", "seenAt");
CREATE INDEX "thank_you_messages_registryId_idx" ON "thank_you_messages"("registryId");
CREATE INDEX "thank_you_messages_giverId_idx" ON "thank_you_messages"("giverId");
CREATE INDEX "thank_you_messages_ownerId_idx" ON "thank_you_messages"("ownerId");

-- Foreign keys
ALTER TABLE "registries" ADD CONSTRAINT "registries_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "registry_members" ADD CONSTRAINT "registry_members_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "registries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "registry_members" ADD CONSTRAINT "registry_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "registry_items" ADD CONSTRAINT "registry_items_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "registries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "item_attributes" ADD CONSTRAINT "item_attributes_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "registry_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "item_reservations" ADD CONSTRAINT "item_reservations_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "registries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "item_reservations" ADD CONSTRAINT "item_reservations_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "registry_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "item_reservations" ADD CONSTRAINT "item_reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "cash_funds" ADD CONSTRAINT "cash_funds_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "registries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "cash_pledges" ADD CONSTRAINT "cash_pledges_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "registries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "cash_pledges" ADD CONSTRAINT "cash_pledges_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "cash_funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "cash_pledges" ADD CONSTRAINT "cash_pledges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pledge_initiations" ADD CONSTRAINT "pledge_initiations_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "registries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pledge_initiations" ADD CONSTRAINT "pledge_initiations_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "cash_funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pledge_initiations" ADD CONSTRAINT "pledge_initiations_initiatorUserId_fkey" FOREIGN KEY ("initiatorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pledge_contributions" ADD CONSTRAINT "pledge_contributions_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "registries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pledge_contributions" ADD CONSTRAINT "pledge_contributions_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "cash_funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pledge_contributions" ADD CONSTRAINT "pledge_contributions_initiationId_fkey" FOREIGN KEY ("initiationId") REFERENCES "pledge_initiations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pledge_contributions" ADD CONSTRAINT "pledge_contributions_contributorUserId_fkey" FOREIGN KEY ("contributorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "thank_you_messages" ADD CONSTRAINT "thank_you_messages_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "registries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "thank_you_messages" ADD CONSTRAINT "thank_you_messages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "thank_you_messages" ADD CONSTRAINT "thank_you_messages_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "thank_you_messages" ADD CONSTRAINT "thank_you_messages_itemReservationId_fkey" FOREIGN KEY ("itemReservationId") REFERENCES "item_reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "thank_you_messages" ADD CONSTRAINT "thank_you_messages_cashPledgeId_fkey" FOREIGN KEY ("cashPledgeId") REFERENCES "cash_pledges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

