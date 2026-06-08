import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { listEmployeeAddresses, createEmployeeAddress } from "@/app/services/workforceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
  const addresses = await listEmployeeAddresses(employeeId);
  return Response.json({ data: addresses });
});

export const POST = withPermission("workforce.*", async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
  const body = (await request.json()) as {
    type?: string;
    isPrimary?: boolean;
    address?: string;
    apt?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  const address = await createEmployeeAddress(employeeId, {
    type: body.type ?? "",
    isPrimary: body.isPrimary,
    address: body.address,
    apt: body.apt,
    city: body.city,
    state: body.state,
    postalCode: body.postalCode,
    country: body.country ?? "",
  });

  return Response.json({ data: address }, { status: 201 });
});
