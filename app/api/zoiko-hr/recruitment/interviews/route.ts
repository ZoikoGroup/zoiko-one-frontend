import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { listInterviews, createInterview } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    candidateId: searchParams.get("candidateId") ?? undefined,
    jobId: searchParams.get("jobId") ?? undefined,
    interviewerId: searchParams.get("interviewerId") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  };
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const result = await listInterviews({ filters, skip, take });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    organizationId?: string;
    candidateId?: string;
    jobId?: string;
    interviewerId?: string;
    scheduledAt?: string;
    type?: string;
    duration?: number;
    location?: string;
    meetingLink?: string;
    notes?: string;
  };

  const interview = await createInterview({
    organizationId: body.organizationId,
    candidateId: body.candidateId,
    jobId: body.jobId,
    interviewerId: body.interviewerId,
    scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
    type: body.type,
    duration: body.duration,
    location: body.location,
    meetingLink: body.meetingLink,
    notes: body.notes,
  });

  return Response.json({ data: interview }, { status: 201 });
});
