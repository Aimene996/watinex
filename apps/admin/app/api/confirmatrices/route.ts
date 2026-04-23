import { NextResponse } from "next/server";

type CreateConfirmatricePayload = {
  email?: string;
  password?: string;
  niche?: string;
};

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    return NextResponse.json(
      { error: "Missing Supabase environment configuration." },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const accessToken = authHeader.slice("Bearer ".length);

  const meResponse = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!meResponse.ok) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const mePayload = (await meResponse.json()) as {
    user_metadata?: { role?: string };
  };

  if (mePayload.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = (await request.json()) as CreateConfirmatricePayload;
  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const niche = body.niche?.trim();

  if (!email || !password || !niche) {
    return NextResponse.json(
      { error: "Email, password, and niche are required." },
      { status: 400 },
    );
  }

  const createResponse = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/auth/v1/admin/users`, {
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
        role: "confirmatrice",
        niches: [niche],
      },
    }),
  });

  const createPayload = await createResponse.json().catch(() => ({}));
  if (!createResponse.ok) {
    const message =
      (createPayload as { msg?: string; message?: string }).msg ??
      (createPayload as { msg?: string; message?: string }).message ??
      "Failed to create confirmatrice account.";
    return NextResponse.json({ error: message }, { status: createResponse.status });
  }

  return NextResponse.json({
    ok: true,
    user: {
      id: (createPayload as { id?: string }).id,
      email: (createPayload as { email?: string }).email ?? email,
      role: "confirmatrice",
      niches: [niche],
    },
  });
}
