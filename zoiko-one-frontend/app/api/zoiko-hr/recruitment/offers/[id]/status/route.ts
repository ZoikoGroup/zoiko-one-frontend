import { type NextRequest } from "next/server";
import { withPermission } from "../../../../_security";
import { updateOfferStatus } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const PATCH = withPermission("workforce.*", async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as { status?: string; rejectionReason?: string };

  if (!body.status) {
    return Response.json({ error: "status is required" }, { status: 400 });
  }

  const offer = await updateOfferStatus(params.id, body.status,);
  return Response.json({ data: offer });
});
