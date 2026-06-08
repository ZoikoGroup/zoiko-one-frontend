import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { assignShiftToEmployee } from "@/app/services/shiftService";

export const dynamic = "force-dynamic";

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    shiftId?: string;
    employeeId?: string;
    effectiveFrom?: string;
    effectiveTo?: string;
  };
  const data = await assignShiftToEmployee({
    shiftId: body.shiftId ?? "",
    employeeId: body.employeeId ?? "",
    effectiveFrom: body.effectiveFrom ?? "",
    effectiveTo: body.effectiveTo,
  });
  return Response.json({ data }, { status: 201 });
});
