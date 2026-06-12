import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { deleteFeedback } from "@/app/services/performanceService";

export const dynamic = "force-dynamic";

export const DELETE = withPermission("workforce.*", async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ feedbackId: string }> },
) {
  const { feedbackId } = await params;
  const { searchParams } = new URL(request.url);
  const reason = searchParams.get("reason") ?? undefined;
  await deleteFeedback(feedbackId, reason);
  return Response.json({ ok: true });
});
