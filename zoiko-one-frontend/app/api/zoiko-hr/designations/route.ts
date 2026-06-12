import { type NextRequest } from "next/server";
import { withPermission } from "../_security";
import { listDesignations, createDesignation } from "@/app/services/designationService";
import { getCurrentSecurityContext } from "@/app/services/securityService";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    level: searchParams.get("level") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    departmentId: searchParams.get("departmentId") ?? undefined,
  };

  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const orderBy = searchParams.get("orderBy") ?? "createdAt";
  const orderDir = (searchParams.get("orderDir") ?? "desc") as "asc" | "desc";

  const result = await listDesignations({ filters, skip, take, orderBy, orderDir });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    organizationId?: string;
    title?: string;
    code?: string;
    level?: string;
    category?: string;
    grade?: string;
    description?: string;
    minSalary?: number;
    maxSalary?: number;
    departmentId?: string;
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

  const designation = await createDesignation({
    organizationId: organizationId ?? "",
    title: body.title ?? "",
    code: body.code ?? "",
    level: body.level ?? "",
    category: body.category ?? "",
    grade: body.grade,
    description: body.description,
    minSalary: body.minSalary,
    maxSalary: body.maxSalary,
    departmentId: body.departmentId,
  });

  return Response.json({ data: designation }, { status: 201 });
});
