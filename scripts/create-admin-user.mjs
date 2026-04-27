#!/usr/bin/env node

const email = process.argv[2]?.trim().toLowerCase();
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: npm run admin:create -- <email> <password>");
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error("Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL).");
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

if (!supabaseUrl.startsWith("http")) {
  console.error("SUPABASE_URL must be a full URL, e.g. https://project.supabase.co");
  process.exit(1);
}

async function createAdminUser() {
  const endpoint = `${supabaseUrl.replace(/\/+$/, "")}/auth/v1/admin/users`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "admin",
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.msg ?? payload?.message ?? `HTTP ${response.status}`;
    throw new Error(`Failed to create admin user: ${message}`);
  }

  console.log(`Admin user created: ${payload?.email ?? email}`);
  console.log("You can now sign in at /login in the admin app.");
}

createAdminUser().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(message);
  process.exit(1);
});
