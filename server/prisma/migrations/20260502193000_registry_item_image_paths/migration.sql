-- Ordered gallery paths for registry items (max 3 enforced in app).
ALTER TABLE "registry_items" ADD COLUMN IF NOT EXISTS "imagePaths" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

DO $$
BEGIN
  -- Some environments may have created `registry_items` before `imagePath` existed.
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'registry_items'
      AND column_name = 'imagePath'
  ) THEN
    UPDATE "registry_items"
    SET "imagePaths" = ARRAY["imagePath"]::TEXT[]
    WHERE "imagePath" IS NOT NULL
      AND BTRIM("imagePath") <> ''
      AND COALESCE(cardinality("imagePaths"), 0) = 0;
  END IF;
END $$;
