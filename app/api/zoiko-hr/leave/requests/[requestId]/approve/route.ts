import { type NextRequest } from "next/server";
import { withPermission } from "../../../../_security";
import { approveLeaveRequest } from "@/app/services/leaveService";

export const dynamic = "force-dynamic";

export const POST = withPermission("workforce.*", async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  const { requestId } = await params;
  const body = (await request.json()) as { action?: string; reason?: string };

  if (!body.action || !["APPROVED", "REJECTED"].includes(body.action)) {
    return Response.json({ error: "Action must be APPROVED or REJECTED." }, { status: 400 });
  }

  const result = await approveLeaveRequest(requestId, body.action as "APPROVED" | "REJECTED", body.reason);
  return Response.json(result);
});
