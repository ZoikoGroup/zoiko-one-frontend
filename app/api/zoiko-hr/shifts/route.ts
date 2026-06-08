import { type NextRequest } from "next/server";
import { withPermission } from "../_security";
import { listShifts, createShift } from "@/app/services/shiftService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = { search: searchParams.get("search") ?? undefined };
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const orderBy = searchParams.get("orderBy") ?? "createdAt";
  const orderDir = (searchParams.get("orderDir") ?? "desc") as "asc" | "desc";
  const result = await listShifts({ filters, skip, take, orderBy, orderDir });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name?: string;
    startTime?: string;
    endTime?: string;
    gracePeriod?: number;
    weeklyOff?: string[];
  };
  const shift = await createShift({
    name: body.name ?? "",
    startTime: body.startTime ?? "",
    endTime: body.endTime ?? "",
    gracePeriod: body.gracePeriod,
    weeklyOff: body.weeklyOff,
  });
  return Response.json({ data: shift }, { status: 201 });
});
