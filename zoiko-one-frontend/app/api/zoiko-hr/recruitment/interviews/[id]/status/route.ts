import { type NextRequest } from "next/server";
import { withPermission } from "../../../../_security";
import { updateInterviewStatus } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const PATCH = withPermission("workforce.*", async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as { status?: string; feedback?: string; rating?: number };

  if (!body.status) {
    return Response.json({ error: "status is required" }, { status: 400 });
  }

  const interview = await updateInterviewStatus(params.id, body.status, body.feedback, body.rating);
  return Response.json({ data: interview });
});
