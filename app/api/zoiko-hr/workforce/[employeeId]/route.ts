import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { getEmployee, updateEmployee, deleteEmployee } from "@/app/services/workforceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
  const employee = await getEmployee(employeeId);
  return Response.json({ data: employee });
});

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
  const body = (await request.json()) as {
    firstName?: string;
    lastName?: string;
    email?: string;
    personalEmail?: string;
    phoneNumber?: string;
    personalPhone?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    profilePhotoUrl?: string;
  };

  const employee = await updateEmployee(employeeId, {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    personalEmail: body.personalEmail,
    phoneNumber: body.phoneNumber,
    personalPhone: body.personalPhone,
    dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
    gender: body.gender,
    nationality: body.nationality,
    profilePhotoUrl: body.profilePhotoUrl,
  });

  return Response.json({ data: employee });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
  const { searchParams } = new URL(request.url);
  const reason = searchParams.get("reason") ?? undefined;
  const result = await deleteEmployee(employeeId, reason);
  return Response.json(result);
});
