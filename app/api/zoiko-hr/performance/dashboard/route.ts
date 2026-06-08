import { withPermission } from "../../_security";
import { getPerformanceDashboard } from "@/app/services/performanceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const data = await getPerformanceDashboard();
  return Response.json({ data });
});
