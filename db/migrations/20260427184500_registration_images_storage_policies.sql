DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'authenticated_upload_registration_images'
  ) THEN
    CREATE POLICY "authenticated_upload_registration_images"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'registration-images');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'authenticated_read_registration_images'
  ) THEN
    CREATE POLICY "authenticated_read_registration_images"
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (bucket_id = 'registration-images');
  END IF;
END $$;
