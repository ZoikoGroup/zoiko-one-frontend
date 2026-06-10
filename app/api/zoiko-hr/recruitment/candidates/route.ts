import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { listCandidates, createCandidate } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    search: searchParams.get("search") ?? undefined,
    stage: searchParams.get("stage") ?? undefined,
    jobId: searchParams.get("jobId") ?? undefined,
  };
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const orderBy = searchParams.get("orderBy") ?? "createdAt";
  const orderDir = (searchParams.get("orderDir") ?? "desc") as "asc" | "desc";
  const result = await listCandidates({ filters, skip, take, orderBy, orderDir });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    organizationId?: string;
    jobId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    resumeUrl?: string;
    coverLetter?: string;
    source?: string;
    stage?: string;
  };

  const candidate = await createCandidate({
    organizationId: body.organizationId,
    jobId: body.jobId,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    resumeUrl: body.resumeUrl,
    coverLetter: body.coverLetter,
    source: body.source,
    stage: body.stage,
  });

  return Response.json({ data: candidate }, { status: 201 });
});
