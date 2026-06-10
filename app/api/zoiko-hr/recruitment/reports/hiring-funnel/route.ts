import { withPermission } from "../../../_security";
import { getHiringFunnelReport } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const report = await getHiringFunnelReport();
  return Response.json({ data: report });
});
