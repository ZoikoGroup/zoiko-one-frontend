import { withPermission } from "../../_security";
import { getDashboardStats } from "@/app/services/attendanceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const data = await getDashboardStats();
  return Response.json({ data });
});
