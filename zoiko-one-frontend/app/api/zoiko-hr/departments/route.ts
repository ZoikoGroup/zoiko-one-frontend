import { type NextRequest } from "next/server";
import { withPermission } from "../_security";
import { listDepartments, createDepartment } from "@/app/services/departmentService";
import { getCurrentSecurityContext } from "@/app/services/securityService";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  };

  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const orderBy = searchParams.get("orderBy") ?? "createdAt";
  const orderDir = (searchParams.get("orderDir") ?? "desc") as "asc" | "desc";

  const result = await listDepartments({ filters, skip, take, orderBy, orderDir });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    organizationId?: string;
    name?: string;
    code?: string;
    description?: string;
    parentDeptId?: string;
    headEmployeeId?: string;
    budget?: number;
  };

  let organizationId = body.organizationId;
  if (!organizationId) {
    const ctx = await getCurrentSecurityContext();
    if (ctx) {
      const org = await prisma.organization.findFirst({
        where: { tenantId: ctx.tenantId, status: "ACTIVE" },
        orderBy: { createdAt: "asc" },
      });
      if (org) organizationId = org.id;
    }
  }

  const department = await createDepartment({
    organizationId: organizationId ?? "",
    name: body.name ?? "",
    code: body.code ?? "",
    description: body.description,
    parentDeptId: body.parentDeptId,
    headEmployeeId: body.headEmployeeId,
    budget: body.budget,
  });

  return Response.json({ data: department }, { status: 201 });
});
