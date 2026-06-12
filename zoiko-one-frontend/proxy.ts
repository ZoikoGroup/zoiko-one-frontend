import { NextResponse, type NextRequest } from "next/server";

import { accessTokenCookie } from "@/app/services/securityService";

const publicPaths = ["/login", "/api/auth/login", "/api/auth/refresh"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (isPublicPath || pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const hasAccessToken = Boolean(request.cookies.get(accessTokenCookie)?.value);
  if (!hasAccessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
