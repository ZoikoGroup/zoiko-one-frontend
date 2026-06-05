import { NextResponse, type NextRequest } from "next/server";

import { clearAuthCookies, logout } from "@/app/services/securityService";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  await logout(request);

  const response = NextResponse.redirect(new URL("/login", request.url));
  clearAuthCookies(response);

  return response;
}
