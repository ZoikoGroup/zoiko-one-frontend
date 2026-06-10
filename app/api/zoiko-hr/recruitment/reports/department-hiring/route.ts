import { withPermission } from "../../../_security";
import { getDepartmentHiringReport } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const report = await getDepartmentHiringReport();
  return Response.json({ data: report });
});
