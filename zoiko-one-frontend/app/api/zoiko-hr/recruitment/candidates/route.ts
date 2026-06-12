import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { listCandidates, updateCandidateStage } from "@/app/services/recruitmentService";

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

export const PATCH = withPermission("workforce.*", async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const candidateId = searchParams.get("id");
  if (!candidateId) {
    return Response.json({ error: "Missing candidate ID" }, { status: 400 });
  }

  const body = (await request.json()) as {
    stage: string;
  };

  const candidate = await updateCandidateStage(candidateId, body.stage);
  return Response.json({ data: candidate }, { status: 200 });
});
