import { NextResponse, type NextRequest } from "next/server";

import { assignPermission, AuthorizationError } from "@/app/services/securityService";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { userId?: string; permissionKey?: string };
    if (!body.userId || !body.permissionKey) {
      return NextResponse.json({ error: "userId and permissionKey are required." }, { status: 400 });
    }

    return NextResponse.json({ data: await assignPermission({ targetUserId: body.userId, permissionKey: body.permissionKey }) });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to assign permission." }, { status: 500 });
  }
}
