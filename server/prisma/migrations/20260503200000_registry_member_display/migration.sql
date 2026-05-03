-- Optional per-registry display preferences for gift givers (viewers).
ALTER TABLE "registry_members" ADD COLUMN "public_display_name" VARCHAR(80),
ADD COLUMN "hide_avatar" BOOLEAN NOT NULL DEFAULT false;
