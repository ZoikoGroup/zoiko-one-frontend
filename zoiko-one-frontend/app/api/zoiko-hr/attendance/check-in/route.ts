import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { checkIn } from "@/app/services/attendanceService";

export const dynamic = "force-dynamic";

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as { employeeId?: string; date?: string };
  const data = await checkIn(body.employeeId ?? "", body.date);
  return Response.json({ data }, { status: 201 });
});
