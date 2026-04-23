-- Enable Row Level Security on registrations and define access policies.
-- - Public (anon) can INSERT new booking registrations from the website form.
-- - Authenticated users (admin dashboard logs in via Supabase Auth) can read,
--   update, and delete rows.
-- The service_role key bypasses RLS automatically and is unaffected.

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "registrations_insert_anon" ON registrations;
CREATE POLICY "registrations_insert_anon"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "registrations_insert_authenticated" ON registrations;
CREATE POLICY "registrations_insert_authenticated"
  ON registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "registrations_select_authenticated" ON registrations;
CREATE POLICY "registrations_select_authenticated"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "registrations_update_authenticated" ON registrations;
CREATE POLICY "registrations_update_authenticated"
  ON registrations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "registrations_delete_authenticated" ON registrations;
CREATE POLICY "registrations_delete_authenticated"
  ON registrations
  FOR DELETE
  TO authenticated
  USING (true);
