import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { getDepartment, updateDepartment, deleteDepartment } from "@/app/services/departmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ departmentId: string }> },
) {
  const { departmentId } = await params;
  const department = await getDepartment(departmentId);
  return Response.json({ data: department });
});

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ departmentId: string }> },
) {
  const { departmentId } = await params;
  const body = (await request.json()) as {
    name?: string;
    code?: string;
    description?: string;
    parentDeptId?: string;
    headEmployeeId?: string;
    budget?: number;
    status?: string;
  };

  const department = await updateDepartment(departmentId, {
    name: body.name,
    code: body.code,
    description: body.description,
    parentDeptId: body.parentDeptId,
    headEmployeeId: body.headEmployeeId,
    budget: body.budget,
    status: body.status,
  });

  return Response.json({ data: department });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ departmentId: string }> },
) {
  const { departmentId } = await params;
  const { searchParams } = new URL(request.url);
  const reason = searchParams.get("reason") ?? undefined;
  const result = await deleteDepartment(departmentId, reason);
  return Response.json(result);
});
