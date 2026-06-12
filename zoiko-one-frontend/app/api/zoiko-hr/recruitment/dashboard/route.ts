import { withPermission } from "../../_security";
import { getRecruitmentDashboard } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const stats = await getRecruitmentDashboard();
  return Response.json({ data: stats });
});
