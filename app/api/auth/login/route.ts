import { NextResponse, type NextRequest } from "next/server";

import { AuthorizationError, login, setLoginCookies } from "@/app/services/securityService";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { tenantSlug?: string; email?: string; password?: string };
    const tokens = await login({
      tenantSlug: body.tenantSlug?.trim() ?? "",
      email: body.email?.trim() ?? "",
      password: body.password ?? "",
      request,
    });
    const response = NextResponse.json({ ok: true });
    setLoginCookies(response, tokens);

    return response;
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Authentication failed." }, { status: 500 });
  }
}
