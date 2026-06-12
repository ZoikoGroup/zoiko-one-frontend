import { type NextRequest } from "next/server";
import { withPermission } from "../../../../_security";
import { updateEmployeeAddress, deleteEmployeeAddress } from "@/app/services/workforceService";

export const dynamic = "force-dynamic";

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string; addressId: string }> },
) {
  const { addressId } = await params;
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

  const address = await updateEmployeeAddress(addressId, body);
  return Response.json({ data: address });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ employeeId: string; addressId: string }> },
) {
  const { addressId } = await params;
  const result = await deleteEmployeeAddress(addressId);
  return Response.json(result);
});
