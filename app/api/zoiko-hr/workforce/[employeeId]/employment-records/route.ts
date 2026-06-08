import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { listEmploymentRecords, createEmploymentRecord } from "@/app/services/workforceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
  const records = await listEmploymentRecords(employeeId);
  return Response.json({ data: records });
});

export const POST = withPermission("workforce.*", async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
  const body = (await request.json()) as {
    jobTitle?: string;
    jobLevel?: string;
    designationId?: string;
    departmentId?: string;
    reportingToId?: string;
    divisionId?: string;
    businessUnitId?: string;
    locationId?: string;
    costCenterId?: string;
    employmentType?: string;
    employmentStatus?: string;
    wfhEligible?: boolean;
    wfhDays?: number;
    salaryAmount?: number;
    salaryCurrency?: string;
    paymentFrequency?: string;
    changeReason?: string;
    notes?: string;
  };

  const record = await createEmploymentRecord(employeeId, {
    jobTitle: body.jobTitle,
    jobLevel: body.jobLevel,
    designationId: body.designationId,
    departmentId: body.departmentId,
    reportingToId: body.reportingToId,
    divisionId: body.divisionId,
    businessUnitId: body.businessUnitId,
    locationId: body.locationId,
    costCenterId: body.costCenterId,
    employmentType: body.employmentType,
    employmentStatus: body.employmentStatus,
    wfhEligible: body.wfhEligible,
    wfhDays: body.wfhDays,
    salaryAmount: body.salaryAmount,
    salaryCurrency: body.salaryCurrency,
    paymentFrequency: body.paymentFrequency,
    changeReason: body.changeReason ?? "",
    notes: body.notes,
  });

  return Response.json({ data: record }, { status: 201 });
});
