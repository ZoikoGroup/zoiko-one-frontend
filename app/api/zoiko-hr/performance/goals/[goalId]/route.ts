import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { getGoal, updateGoal, deleteGoal } from "@/app/services/performanceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ goalId: string }> },
) {
  const { goalId } = await params;
  const data = await getGoal(goalId);
  return Response.json({ data });
});

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ goalId: string }> },
) {
  const { goalId } = await params;
  const body = (await request.json()) as {
    title?: string; description?: string; category?: string;
    startDate?: string; targetDate?: string; completedDate?: string;
    status?: string; progress?: number; notes?: string;
  };
  const data = await updateGoal(goalId, body);
  return Response.json({ data });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ goalId: string }> },
) {
  const { goalId } = await params;
  const { searchParams } = new URL(request.url);
  const reason = searchParams.get("reason") ?? undefined;
  await deleteGoal(goalId, reason);
  return Response.json({ ok: true });
});
