import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { getLeaveType, updateLeaveType, deleteLeaveType } from "@/app/services/leaveService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ typeId: string }> },
) {
  const { typeId } = await params;
  const leaveType = await getLeaveType(typeId);
  return Response.json({ data: leaveType });
});

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ typeId: string }> },
) {
  const { typeId } = await params;
  const body = (await request.json()) as {
    name?: string; code?: string; description?: string; category?: string;
    maxDaysPerYear?: number; minDaysRequired?: number;
    requiresApproval?: boolean; requiresMedicalCert?: boolean; attachmentRequired?: boolean; isActive?: boolean;
  };
  const leaveType = await updateLeaveType(typeId, body);
  return Response.json({ data: leaveType });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ typeId: string }> },
) {
  const { typeId } = await params;
  const { searchParams } = new URL(request.url);
  const result = await deleteLeaveType(typeId, searchParams.get("reason") ?? undefined);
  return Response.json(result);
});
