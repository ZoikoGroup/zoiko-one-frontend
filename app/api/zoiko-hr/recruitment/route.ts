import { type NextRequest } from "next/server";
import { withPermission } from "../_security";
import { listJobs, createJob } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    departmentId: searchParams.get("departmentId") ?? undefined,
  };
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const orderBy = searchParams.get("orderBy") ?? "createdAt";
  const orderDir = (searchParams.get("orderDir") ?? "desc") as "asc" | "desc";
  const result = await listJobs({ filters, skip, take, orderBy, orderDir });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    organizationId?: string;
    title?: string;
    departmentId?: string;
    location?: string;
    employmentType?: string;
    minExperience?: number;
    maxExperience?: number;
    salaryMin?: number;
    salaryMax?: number;
    description?: string;
    requirements?: string;
    responsibilities?: string;
    status?: string;
    openingsCount?: number;
  };

  const job = await createJob({
    organizationId: body.organizationId,
    title: body.title ?? "",
    departmentId: body.departmentId ?? "",
    location: body.location,
    employmentType: body.employmentType,
    minExperience: body.minExperience,
    maxExperience: body.maxExperience,
    salaryMin: body.salaryMin,
    salaryMax: body.salaryMax,
    description: body.description,
    requirements: body.requirements,
    responsibilities: body.responsibilities,
    status: body.status,
    openingsCount: body.openingsCount,
  });

  return Response.json({ data: job }, { status: 201 });
});
