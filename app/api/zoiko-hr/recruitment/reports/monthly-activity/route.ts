import { withPermission } from "../../../_security";
import { getMonthlyActivityReport } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const report = await getMonthlyActivityReport();
  return Response.json({ data: report });
});
