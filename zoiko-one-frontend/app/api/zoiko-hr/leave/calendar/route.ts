import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { getLeaveCalendar } from "@/app/services/leaveService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const startDate = searchParams.get("startDate") ?? startOfMonth.toISOString();
  const endDate = searchParams.get("endDate") ?? endOfMonth.toISOString();
  const employeeId = searchParams.get("employeeId") ?? undefined;

  const events = await getLeaveCalendar(startDate, endDate, employeeId);
  return Response.json(events);
});
