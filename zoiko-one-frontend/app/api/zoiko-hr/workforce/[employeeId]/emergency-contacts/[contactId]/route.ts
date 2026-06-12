import { type NextRequest } from "next/server";
import { withPermission } from "../../../../_security";
import { updateEmergencyContact, deleteEmergencyContact } from "@/app/services/workforceService";

export const dynamic = "force-dynamic";

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string; contactId: string }> },
) {
  const { contactId } = await params;
  const body = (await request.json()) as {
    priority?: number;
    firstName?: string;
    lastName?: string;
    relationship?: string;
    phoneNumber?: string;
    alternatePhone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    notes?: string;
  };

  const contact = await updateEmergencyContact(contactId, body);
  return Response.json({ data: contact });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ employeeId: string; contactId: string }> },
) {
  const { contactId } = await params;
  const result = await deleteEmergencyContact(contactId);
  return Response.json(result);
});
