import { withPermission } from "../../../_security";
import { getSourceEffectiveness } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const report = await getSourceEffectiveness();
  return Response.json({ data: report });
});
