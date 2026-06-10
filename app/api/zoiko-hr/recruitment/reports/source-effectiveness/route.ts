import { withPermission } from "../../../_security";
import { getSourceEffectivenessReport } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const report = await getSourceEffectivenessReport();
  return Response.json({ data: report });
});
