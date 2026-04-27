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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'registration_images'
      AND policyname = 'authenticated_select_registration_images'
  ) THEN
    CREATE POLICY "authenticated_select_registration_images" ON registration_images
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'registration_images'
      AND policyname = 'authenticated_insert_registration_images'
  ) THEN
    CREATE POLICY "authenticated_insert_registration_images" ON registration_images
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;
