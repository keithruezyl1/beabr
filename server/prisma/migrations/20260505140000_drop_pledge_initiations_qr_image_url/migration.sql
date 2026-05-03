-- Revert optional external QR URL; only Supabase-stored paths (qrImagePath) are used.
ALTER TABLE "pledge_initiations" DROP COLUMN IF EXISTS "qrImageUrl";
