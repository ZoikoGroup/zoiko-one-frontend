import { withPermission } from "../../../_security";
import { getTimeToHireReport } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const report = await getTimeToHireReport();
  return Response.json({ data: report });
});
