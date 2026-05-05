CREATE TYPE "RegistryVisibilityMode" AS ENUM ('private_until_reveal', 'open_coordination');

ALTER TABLE "registries"
  ADD COLUMN "visibility_mode" "RegistryVisibilityMode" NOT NULL DEFAULT 'private_until_reveal';
