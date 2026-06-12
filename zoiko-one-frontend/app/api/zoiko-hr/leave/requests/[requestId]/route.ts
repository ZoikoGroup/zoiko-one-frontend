import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { getLeaveRequest, cancelLeaveRequest } from "@/app/services/leaveService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  const { requestId } = await params;
  const leaveRequest = await getLeaveRequest(requestId);
  return Response.json({ data: leaveRequest });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  const { requestId } = await params;
  const result = await cancelLeaveRequest(requestId);
  return Response.json(result);
});
