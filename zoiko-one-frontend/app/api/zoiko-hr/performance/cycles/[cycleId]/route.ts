import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { getCycle, updateCycle, deleteCycle } from "@/app/services/performanceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ cycleId: string }> },
) {
  const { cycleId } = await params;
  const data = await getCycle(cycleId);
  return Response.json({ data });
});

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ cycleId: string }> },
) {
  const { cycleId } = await params;
  const body = (await request.json()) as {
    name?: string; description?: string; startDate?: string; endDate?: string; status?: string;
  };
  const data = await updateCycle(cycleId, body);
  return Response.json({ data });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cycleId: string }> },
) {
  const { cycleId } = await params;
  const { searchParams } = new URL(request.url);
  const reason = searchParams.get("reason") ?? undefined;
  await deleteCycle(cycleId, reason);
  return Response.json({ ok: true });
});
