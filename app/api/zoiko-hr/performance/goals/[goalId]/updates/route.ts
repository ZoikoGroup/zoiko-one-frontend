import { type NextRequest } from "next/server";
import { withPermission } from "../../../../_security";
import { createGoalUpdate } from "@/app/services/performanceService";

export const dynamic = "force-dynamic";

export const POST = withPermission("workforce.*", async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ goalId: string }> },
) {
  const { goalId } = await params;
  const body = (await request.json()) as {
    updateText: string; previousProgress?: number; newProgress?: number;
  };
  const update = await createGoalUpdate(goalId, body);
  return Response.json({ data: update }, { status: 201 });
});
