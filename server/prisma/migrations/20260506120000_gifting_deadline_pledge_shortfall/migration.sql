-- Add optional gifting deadline to registries
ALTER TABLE "registries" ADD COLUMN "gifting_closes_at" TIMESTAMP(3);

-- Add pledge_goal_not_reached to NotificationType enum
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'pledge_goal_not_reached';
