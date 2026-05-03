-- Align pledge tables with item-scoped group pledges (replaces cash_fund fundId with registry_items itemId).
-- Safe when pledge_initiations and pledge_contributions are empty or fundIds are not migrated to valid item ids.

ALTER TABLE "pledge_contributions" DROP CONSTRAINT IF EXISTS "pledge_contributions_fundId_fkey";
ALTER TABLE "pledge_initiations" DROP CONSTRAINT IF EXISTS "pledge_initiations_fundId_fkey";

DROP INDEX IF EXISTS "pledge_initiations_fundId_key";

ALTER TABLE "pledge_initiations" RENAME COLUMN "fundId" TO "itemId";
ALTER TABLE "pledge_contributions" RENAME COLUMN "fundId" TO "itemId";

ALTER INDEX IF EXISTS "pledge_contributions_fundId_idx" RENAME TO "pledge_contributions_itemId_idx";

CREATE UNIQUE INDEX "pledge_initiations_itemId_key" ON "pledge_initiations" ("itemId");

ALTER TABLE "pledge_initiations"
  ADD CONSTRAINT "pledge_initiations_itemId_fkey"
  FOREIGN KEY ("itemId") REFERENCES "registry_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "pledge_contributions"
  ADD CONSTRAINT "pledge_contributions_itemId_fkey"
  FOREIGN KEY ("itemId") REFERENCES "registry_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
