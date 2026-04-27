-- ============================================================
-- WATINEX – Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Registrations table (from the 4-step booking form)
CREATE TABLE IF NOT EXISTS registrations (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name       TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT NOT NULL,
  imported_before BOOLEAN DEFAULT false,
  niche           TEXT[] DEFAULT '{}',
  service_type    TEXT NOT NULL CHECK (service_type IN ('SHIPPING', 'SOURCING')),
  status          TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'CONFIRMED', 'REJECTED')),
  admin_notes     TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 2. Indexes for fast dashboard queries
CREATE INDEX IF NOT EXISTS idx_reg_status     ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_reg_service    ON registrations(service_type);
CREATE INDEX IF NOT EXISTS idx_reg_created    ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reg_phone      ON registrations(phone);
CREATE INDEX IF NOT EXISTS idx_reg_email      ON registrations(email);

-- 3. Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 4. Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (public booking form)
CREATE POLICY "public_insert" ON registrations
  FOR INSERT WITH CHECK (true);

-- Only authenticated users (admins) can SELECT
CREATE POLICY "admin_select" ON registrations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users (admins) can UPDATE
CREATE POLICY "admin_update" ON registrations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 4.b Registration images uploaded by confirmatrice/admin
CREATE TABLE IF NOT EXISTS registration_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  image_data_url TEXT NOT NULL,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_registration_images_registration_id
  ON registration_images (registration_id);

ALTER TABLE registration_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_select_registration_images" ON registration_images
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_registration_images" ON registration_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. Saved confirmatrice credentials (for admin recovery)
CREATE TABLE IF NOT EXISTS confirmatrice_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL,
  email TEXT NOT NULL,
  temporary_password TEXT NOT NULL,
  niche TEXT NOT NULL,
  experience_level TEXT NOT NULL DEFAULT 'beginner',
  created_by_admin_id UUID,
  created_by_admin_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT confirmatrice_credentials_email_check CHECK (position('@' IN email) > 1),
  CONSTRAINT confirmatrice_credentials_experience_level_check CHECK (experience_level IN ('beginner', 'professional'))
);

CREATE INDEX IF NOT EXISTS idx_confirmatrice_credentials_created_at
  ON confirmatrice_credentials (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_confirmatrice_credentials_auth_user_id
  ON confirmatrice_credentials (auth_user_id);

-- ============================================================
-- DONE! Now create an admin user in Supabase Auth:
--   Dashboard → Authentication → Users → Add user
--   Email: your-admin@email.com  /  Password: your-password
-- ============================================================
