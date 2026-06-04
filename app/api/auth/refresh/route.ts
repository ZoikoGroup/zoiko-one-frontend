import { NextResponse, type NextRequest } from "next/server";

import { AuthorizationError, refreshSession, setLoginCookies } from "@/app/services/securityService";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const tokens = await refreshSession(request);
    const response = NextResponse.json({ ok: true });
    setLoginCookies(response, tokens);

    return response;
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to refresh session." }, { status: 500 });
  }
}
