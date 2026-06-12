import { withPermission } from "../../../_security";
import { getMonthlyActivity } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const report = await getMonthlyActivity();
  return Response.json({ data: report });
});
