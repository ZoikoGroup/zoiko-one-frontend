import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { getDesignation, updateDesignation, deleteDesignation } from "@/app/services/designationService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ designationId: string }> },
) {
  const { designationId } = await params;
  const designation = await getDesignation(designationId);
  return Response.json({ data: designation });
});

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ designationId: string }> },
) {
  const { designationId } = await params;
  const body = (await request.json()) as {
    title?: string;
    code?: string;
    level?: string;
    category?: string;
    grade?: string;
    description?: string;
    minSalary?: number;
    maxSalary?: number;
    departmentId?: string;
    status?: string;
  };

  const designation = await updateDesignation(designationId, {
    title: body.title,
    code: body.code,
    level: body.level,
    category: body.category,
    grade: body.grade,
    description: body.description,
    minSalary: body.minSalary,
    maxSalary: body.maxSalary,
    departmentId: body.departmentId,
    status: body.status,
  });

  return Response.json({ data: designation });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ designationId: string }> },
) {
  const { designationId } = await params;
  const { searchParams } = new URL(request.url);
  const reason = searchParams.get("reason") ?? undefined;
  const result = await deleteDesignation(designationId, reason);
  return Response.json(result);
});
