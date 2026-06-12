import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { listLeaveRequests, createLeaveRequest } from "@/app/services/leaveService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    leaveTypeId: searchParams.get("leaveTypeId") ?? undefined,
    employeeId: searchParams.get("employeeId") ?? undefined,
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
  };
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const orderBy = searchParams.get("orderBy") ?? "createdAt";
  const orderDir = (searchParams.get("orderDir") ?? "desc") as "asc" | "desc";
  const result = await listLeaveRequests({ filters, skip, take, orderBy, orderDir });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    employeeId?: string;
    leaveTypeId?: string;
    startDate?: string;
    endDate?: string;
    workingDaysRequested?: number;
    reason?: string;
    attachmentUrl?: string;
  };

  const leaveRequest = await createLeaveRequest({
    employeeId: body.employeeId ?? "",
    leaveTypeId: body.leaveTypeId ?? "",
    startDate: body.startDate ?? "",
    endDate: body.endDate ?? "",
    workingDaysRequested: body.workingDaysRequested,
    reason: body.reason,
    attachmentUrl: body.attachmentUrl,
  });

  return Response.json({ data: leaveRequest }, { status: 201 });
});
