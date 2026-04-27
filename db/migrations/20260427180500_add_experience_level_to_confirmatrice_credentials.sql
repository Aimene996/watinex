ALTER TABLE confirmatrice_credentials
ADD COLUMN IF NOT EXISTS experience_level TEXT;

UPDATE confirmatrice_credentials
SET experience_level = COALESCE(experience_level, 'beginner')
WHERE experience_level IS NULL;

ALTER TABLE confirmatrice_credentials
ALTER COLUMN experience_level SET DEFAULT 'beginner';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'confirmatrice_credentials_experience_level_check'
  ) THEN
    ALTER TABLE confirmatrice_credentials
    ADD CONSTRAINT confirmatrice_credentials_experience_level_check
    CHECK (experience_level IN ('beginner', 'professional'));
  END IF;
END $$;
