-- Explicit deny-all RLS policies for Supabase JWT roles (`anon`, `authenticated`).
-- Beabr reads/writes data only via Prisma + a privileged database role that bypasses RLS.
-- This removes the ambiguous "RLS enabled, no policies" posture for PostgREST and documents intent.

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = ANY(ARRAY[
      'users',
      'registries',
      'registry_members',
      'registry_items',
      'item_attributes',
      'item_reservations',
      'cash_funds',
      'cash_pledges',
      'pledge_initiations',
      'pledge_contributions',
      'notifications',
      'thank_you_messages',
      '_prisma_migrations'
    ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS beabr_anon_blocked ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS beabr_authenticated_blocked ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY beabr_anon_blocked ON public.%I FOR ALL TO anon USING (false) WITH CHECK (false)',
      t
    );
    EXECUTE format(
      'CREATE POLICY beabr_authenticated_blocked ON public.%I FOR ALL TO authenticated USING (false) WITH CHECK (false)',
      t
    );
  END LOOP;
END $$;
