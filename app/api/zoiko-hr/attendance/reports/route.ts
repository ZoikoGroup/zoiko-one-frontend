import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { getAttendanceReport } from "@/app/services/attendanceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = await getAttendanceReport({
    type: (searchParams.get("type") as "daily" | "weekly" | "monthly" | "department" | "employee") ?? "daily",
    startDate: searchParams.get("startDate") ?? "",
    endDate: searchParams.get("endDate") ?? "",
    employeeId: searchParams.get("employeeId") ?? undefined,
    departmentId: searchParams.get("departmentId") ?? undefined,
  });
  return Response.json(result);
});
