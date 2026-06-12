import { type NextRequest } from "next/server";
import { withPermission } from "../_security";
import { listAttendances, createAttendance } from "@/app/services/attendanceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    employeeId: searchParams.get("employeeId") ?? undefined,
    departmentId: searchParams.get("departmentId") ?? undefined,
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
  };
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const orderBy = searchParams.get("orderBy") ?? "date";
  const orderDir = (searchParams.get("orderDir") ?? "desc") as "asc" | "desc";
  const result = await listAttendances({ filters, skip, take, orderBy, orderDir });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    employeeId?: string;
    date?: string;
    checkIn?: string;
    checkOut?: string;
    status?: string;
    remarks?: string;
  };
  const attendance = await createAttendance({
    employeeId: body.employeeId ?? "",
    date: body.date ?? "",
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    status: body.status ?? "PRESENT",
    remarks: body.remarks,
  });
  return Response.json({ data: attendance }, { status: 201 });
});
