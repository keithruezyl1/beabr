-- Optional URL pointer for the pledge initiator's QR image (alternative to uploading a file).
ALTER TABLE "pledge_initiations" ADD COLUMN "qrImageUrl" TEXT;
