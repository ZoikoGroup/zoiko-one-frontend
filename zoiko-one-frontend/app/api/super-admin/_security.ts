import { NextResponse, type NextRequest } from "next/server";

import { AuthorizationError, requirePermission } from "@/app/services/securityService";

export function withPermission(permission: string, handler: (request: NextRequest) => Promise<Response> | Response) {
  return async function protectedHandler(request: NextRequest) {
    try {
      await requirePermission(permission);
      return await handler(request);
    } catch (error) {
      if (error instanceof AuthorizationError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }

      return NextResponse.json({ error: "Security enforcement failed." }, { status: 500 });
    }
  };
}
