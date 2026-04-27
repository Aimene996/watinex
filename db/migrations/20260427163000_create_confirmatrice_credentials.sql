  -- Stores created confirmatrice credentials snapshot for admin recovery.
  -- NOTE: This keeps temporary passwords in plain text for operational recovery.
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
