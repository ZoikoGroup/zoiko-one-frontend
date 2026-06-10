import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { updatePolicy, deletePolicy } from "@/app/services/complianceService";

export const dynamic = "force-dynamic";

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const policy = await updatePolicy(params.id, body);
  return Response.json({ data: policy });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await deletePolicy(params.id);
  return Response.json({ ok: true });
});
