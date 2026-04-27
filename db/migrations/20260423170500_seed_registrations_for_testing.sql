-- Seed records for local frontend/admin testing.
INSERT INTO registrations (
  full_name,
  phone,
  email,
  imported_before,
  niche,
  service_type,
  status,
  admin_notes
)
VALUES
  (
    'Amine Benali',
    '+213555000111',
    'amine@example.com',
    true,
    ARRAY['electronics', 'home'],
    'SHIPPING',
    'CONTACTED',
    'Interested in monthly container rates.'
  ),
  (
    'Sara Mansouri',
    '+213666000222',
    'sara@example.com',
    false,
    ARRAY['beauty'],
    'SOURCING',
    'NEW',
    ''
  ),
  (
    'Youssef Haddad',
    '+213777000333',
    'youssef@example.com',
    true,
    ARRAY['auto', 'sports'],
    'SHIPPING',
    'CONFIRMED',
    'Requested quote approved for Q2 shipment.'
  )
ON CONFLICT DO NOTHING;
