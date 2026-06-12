import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { updatePolicyCategory } from "@/app/services/complianceService";

export const dynamic = "force-dynamic";

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const cat = await updatePolicyCategory(params.id, body);
  return Response.json({ data: cat });
});
