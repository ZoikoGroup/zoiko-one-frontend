import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { listOffers, createOffer } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    candidateId: searchParams.get("candidateId") ?? undefined,
    jobId: searchParams.get("jobId") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  };
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const result = await listOffers({ filters, skip, take });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    organizationId?: string;
    candidateId?: string;
    jobId?: string;
    salary?: number;
    benefits?: string;
    startDate?: string;
    expiresAt?: string;
    notes?: string;
  };

  const { candidateId, jobId } = body;
  if (!candidateId || !jobId) {
    return Response.json({ error: "candidateId and jobId are required." }, { status: 400 });
  }

  const offer = await createOffer({
    organizationId: body.organizationId,
    candidateId,
    jobOpeningId: jobId,
    salaryOffered: body.salary,
    benefits: body.benefits,
    offerLetterUrl: body.startDate,
    expiryDate: body.expiresAt,
    notes: body.notes,
  });

  return Response.json({ data: offer }, { status: 201 });
});
