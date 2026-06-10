import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { getJob, updateJob, closeJob } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const job = await getJob(params.id);
  if (!job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }
  return Response.json({ data: job });
});

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as {
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
    openingsCount?: number;
  };

  const job = await updateJob(params.id, {
    title: body.title,
    departmentId: body.departmentId,
    location: body.location,
    employmentType: body.employmentType,
    minExperience: body.minExperience,
    maxExperience: body.maxExperience,
    salaryMin: body.salaryMin,
    salaryMax: body.salaryMax,
    description: body.description,
    requirements: body.requirements,
    responsibilities: body.responsibilities,
    openingsCount: body.openingsCount,
  });

  return Response.json({ data: job });
});

export const PATCH = withPermission("workforce.*", async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as { action?: string };
  switch (body.action) {
    case "close":
    case "reopen": {
      const job = await closeJob(params.id, body.action === "close");
      return Response.json({ data: job });
    }
    default:
      return Response.json({ error: `Unknown action: ${body.action}` }, { status: 400 });
  }
});
