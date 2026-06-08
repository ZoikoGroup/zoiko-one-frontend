import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { getLeaveBalances, initializeLeaveBalance } from "@/app/services/leaveService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const balances = await getLeaveBalances({
    employeeId: searchParams.get("employeeId") ?? undefined,
    leaveTypeId: searchParams.get("leaveTypeId") ?? undefined,
    year: searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : undefined,
  });
  return Response.json(balances);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    employeeId?: string;
    leaveTypeId?: string;
    year?: number;
    allocatedDays?: number;
  };

  const balance = await initializeLeaveBalance({
    employeeId: body.employeeId ?? "",
    leaveTypeId: body.leaveTypeId ?? "",
    year: body.year ?? new Date().getFullYear(),
    allocatedDays: body.allocatedDays ?? 0,
  });

  return Response.json({ data: balance }, { status: 201 });
});
