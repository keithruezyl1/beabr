-- The restored tables missed the earlier explicit deny-all RLS policy migration.
-- Beabr accesses data through Prisma, not direct Supabase Data API table access.

DROP POLICY IF EXISTS beabr_anon_blocked ON "registries";
DROP POLICY IF EXISTS beabr_authenticated_blocked ON "registries";
CREATE POLICY beabr_anon_blocked ON "registries" FOR ALL TO anon USING (false) WITH CHECK (false);
CREATE POLICY beabr_authenticated_blocked ON "registries" FOR ALL TO authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS beabr_anon_blocked ON "notifications";
DROP POLICY IF EXISTS beabr_authenticated_blocked ON "notifications";
CREATE POLICY beabr_anon_blocked ON "notifications" FOR ALL TO anon USING (false) WITH CHECK (false);
CREATE POLICY beabr_authenticated_blocked ON "notifications" FOR ALL TO authenticated USING (false) WITH CHECK (false);
