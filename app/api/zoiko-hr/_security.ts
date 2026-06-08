import { NextResponse, type NextRequest } from "next/server";

import { AuthorizationError, requirePermission } from "@/app/services/securityService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteHandler = (...args: any[]) => Promise<Response> | Response;

export function withPermission(permission: string, handler: RouteHandler) {
  return async function protectedHandler(request: NextRequest, context?: { params: Promise<Record<string, string>> }) {
    try {
      await requirePermission(permission);
      return await handler(request, context);
    } catch (error) {
      if (error instanceof AuthorizationError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }

      return NextResponse.json({ error: "Security enforcement failed." }, { status: 500 });
    }
  };
}
