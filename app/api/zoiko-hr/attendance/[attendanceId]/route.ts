import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { getAttendance, updateAttendance, deleteAttendance } from "@/app/services/attendanceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ attendanceId: string }> },
) {
  const { attendanceId } = await params;
  const data = await getAttendance(attendanceId);
  return Response.json({ data });
});

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ attendanceId: string }> },
) {
  const { attendanceId } = await params;
  const body = (await request.json()) as {
    checkIn?: string;
    checkOut?: string;
    status?: string;
    remarks?: string;
  };
  const data = await updateAttendance(attendanceId, body);
  return Response.json({ data });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ attendanceId: string }> },
) {
  const { attendanceId } = await params;
  const { searchParams } = new URL(request.url);
  const reason = searchParams.get("reason") ?? undefined;
  await deleteAttendance(attendanceId, reason);
  return Response.json({ ok: true });
});
