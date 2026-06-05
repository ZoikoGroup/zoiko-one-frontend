import { NextResponse, type NextRequest } from "next/server";

import { assignRole, AuthorizationError } from "@/app/services/securityService";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { userId?: string; roleKey?: string };
    if (!body.userId || !body.roleKey) {
      return NextResponse.json({ error: "userId and roleKey are required." }, { status: 400 });
    }

    return NextResponse.json({ data: await assignRole({ targetUserId: body.userId, roleKey: body.roleKey }) });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to assign role." }, { status: 500 });
  }
}
