import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { getShift, updateShift, deleteShift } from "@/app/services/shiftService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shiftId: string }> },
) {
  const { shiftId } = await params;
  const data = await getShift(shiftId);
  return Response.json({ data });
});

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ shiftId: string }> },
) {
  const { shiftId } = await params;
  const body = (await request.json()) as {
    name?: string;
    startTime?: string;
    endTime?: string;
    gracePeriod?: number;
    weeklyOff?: string[];
  };
  const data = await updateShift(shiftId, body);
  return Response.json({ data });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ shiftId: string }> },
) {
  const { shiftId } = await params;
  const { searchParams } = new URL(request.url);
  const reason = searchParams.get("reason") ?? undefined;
  await deleteShift(shiftId, reason);
  return Response.json({ ok: true });
});
