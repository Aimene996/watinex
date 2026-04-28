import { NextResponse } from "next/server";

export const runtime = "edge";

type CreateConfirmatricePayload = {
  email?: string;
  password?: string;
  niche?: string;
  experienceLevel?: "beginner" | "professional";
};

type UpdateConfirmatricePayload = {
  id?: string;
  authUserId?: string;
  niche?: string;
  password?: string;
  experienceLevel?: "beginner" | "professional";
};

type DeleteConfirmatricePayload = {
  id?: string;
  authUserId?: string;
};

type AdminIdentity = {
  id?: string;
  email?: string;
  user_metadata?: { role?: string };
};

function getEnv() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    throw new Error("Missing Supabase environment configuration.");
  }

  return { supabaseUrl: supabaseUrl.replace(/\/+$/, ""), serviceRoleKey, anonKey };
}

async function requireAdmin(request: Request, supabaseUrl: string, anonKey: string) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }), admin: null };
  }

  const accessToken = authHeader.slice("Bearer ".length).trim();

  const meResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!meResponse.ok) {
    return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }), admin: null };
  }

  const mePayload = (await meResponse.json()) as AdminIdentity;

  if (mePayload.user_metadata?.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden." }, { status: 403 }), admin: null };
  }

  return { error: null, admin: mePayload };
}

export async function GET(request: Request) {
  try {
    const { supabaseUrl, serviceRoleKey, anonKey } = getEnv();
    const auth = await requireAdmin(request, supabaseUrl, anonKey);
    if (auth.error) return auth.error;

    const listResponse = await fetch(
      `${supabaseUrl}/rest/v1/confirmatrice_credentials?select=id,auth_user_id,email,temporary_password,niche,experience_level,created_at,created_by_admin_email&order=created_at.desc`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    );

    const payload = await listResponse.json().catch(() => []);
    if (!listResponse.ok) {
      const message =
        (payload as { message?: string; details?: string }).message ??
        (payload as { message?: string; details?: string }).details ??
        "Failed to fetch confirmatrice accounts.";
      return NextResponse.json({ error: message }, { status: listResponse.status });
    }

    return NextResponse.json({ ok: true, items: payload });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { supabaseUrl, serviceRoleKey, anonKey } = getEnv();
    const auth = await requireAdmin(request, supabaseUrl, anonKey);
    if (auth.error) return auth.error;
    const mePayload = auth.admin as AdminIdentity;

    const body = (await request.json()) as CreateConfirmatricePayload;
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const niche = body.niche?.trim() || null;
    const experienceLevel = body.experienceLevel;

    if (!email || !password || !experienceLevel) {
      return NextResponse.json(
        { error: "Email, password, and experience level are required." },
        { status: 400 },
      );
    }

    const createResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
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
          niches: niche ? [niche] : [],
          experienceLevel,
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

    const createdUserId = (createPayload as { id?: string }).id ?? null;
    let credentialSaved = false;
    let credentialSaveError: string | null = null;

    if (createdUserId) {
      const insertCredentialsResponse = await fetch(
        `${supabaseUrl}/rest/v1/confirmatrice_credentials`,
        {
          method: "POST",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            auth_user_id: createdUserId,
            email,
            temporary_password: password,
            niche: niche ?? "",
            experience_level: experienceLevel,
            created_by_admin_id: mePayload.id ?? null,
            created_by_admin_email: mePayload.email ?? null,
          }),
        },
      );

      if (insertCredentialsResponse.ok) {
        credentialSaved = true;
      } else {
        const credentialsErrorPayload = await insertCredentialsResponse.json().catch(() => ({}));
        credentialSaveError =
          (credentialsErrorPayload as { message?: string; details?: string }).message ??
          (credentialsErrorPayload as { message?: string; details?: string }).details ??
          "Created user but failed to save credentials.";
      }
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: createdUserId,
        email: (createPayload as { email?: string }).email ?? email,
        role: "confirmatrice",
        niches: niche ? [niche] : [],
        experienceLevel,
      },
      credentials: {
        email,
        password,
        niche,
        experienceLevel,
        saved: credentialSaved,
        saveError: credentialSaveError,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabaseUrl, serviceRoleKey, anonKey } = getEnv();
    const auth = await requireAdmin(request, supabaseUrl, anonKey);
    if (auth.error) return auth.error;

    const body = (await request.json()) as UpdateConfirmatricePayload;
    const id = body.id?.trim();
    const authUserId = body.authUserId?.trim();
    const niche = body.niche?.trim();
    const password = body.password?.trim();
    const experienceLevel = body.experienceLevel;

    if (!id || !authUserId || !niche || !experienceLevel) {
      return NextResponse.json(
        { error: "id, authUserId, niche and experienceLevel are required." },
        { status: 400 },
      );
    }

    const authUpdateResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${authUserId}`, {
      method: "PUT",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(password ? { password } : {}),
        user_metadata: {
          role: "confirmatrice",
          niches: [niche],
          experienceLevel,
        },
      }),
    });

    const authUpdatePayload = await authUpdateResponse.json().catch(() => ({}));
    if (!authUpdateResponse.ok) {
      const message =
        (authUpdatePayload as { msg?: string; message?: string }).msg ??
        (authUpdatePayload as { msg?: string; message?: string }).message ??
        "Failed to update confirmatrice auth account.";
      return NextResponse.json({ error: message }, { status: authUpdateResponse.status });
    }

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/confirmatrice_credentials?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        niche,
        experience_level: experienceLevel,
        ...(password ? { temporary_password: password } : {}),
      }),
    });

    const updatePayload = await updateResponse.json().catch(() => []);
    if (!updateResponse.ok) {
      const message =
        (updatePayload as { message?: string; details?: string }).message ??
        (updatePayload as { message?: string; details?: string }).details ??
        "Failed to update confirmatrice record.";
      return NextResponse.json({ error: message }, { status: updateResponse.status });
    }

    return NextResponse.json({ ok: true, item: Array.isArray(updatePayload) ? updatePayload[0] : null });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabaseUrl, serviceRoleKey, anonKey } = getEnv();
    const auth = await requireAdmin(request, supabaseUrl, anonKey);
    if (auth.error) return auth.error;

    const body = (await request.json()) as DeleteConfirmatricePayload;
    const id = body.id?.trim();
    const authUserId = body.authUserId?.trim();

    if (!id || !authUserId) {
      return NextResponse.json(
        { error: "id and authUserId are required." },
        { status: 400 },
      );
    }

    const deleteCredentialResponse = await fetch(`${supabaseUrl}/rest/v1/confirmatrice_credentials?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });
    if (!deleteCredentialResponse.ok) {
      const credentialPayload = await deleteCredentialResponse.json().catch(() => ({}));
      const message =
        (credentialPayload as { message?: string; details?: string }).message ??
        (credentialPayload as { message?: string; details?: string }).details ??
        "Failed to delete confirmatrice credentials.";
      return NextResponse.json({ error: message }, { status: deleteCredentialResponse.status });
    }

    const deleteAuthResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${authUserId}`, {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });
    if (!deleteAuthResponse.ok) {
      const authPayload = await deleteAuthResponse.json().catch(() => ({}));
      const message =
        (authPayload as { msg?: string; message?: string }).msg ??
        (authPayload as { msg?: string; message?: string }).message ??
        "Failed to delete confirmatrice auth account.";
      return NextResponse.json({ error: message }, { status: deleteAuthResponse.status });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 },
    );
  }
}
