import { type NextRequest } from "next/server";
import { withPermission } from "../../../../_security";
import { updateCandidateStage } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const PATCH = withPermission(
  "workforce.*",
  async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } },
  ) {
    const body = (await request.json()) as { stage?: string; reason?: string };
    if (!body.stage) {
      return Response.json({ error: "stage is required" }, { status: 400 });
    }

    const candidate = await updateCandidateStage(params.id, body.stage);
    return Response.json({ data: candidate });
  },
);
