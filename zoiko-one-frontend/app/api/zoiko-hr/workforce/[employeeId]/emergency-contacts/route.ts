import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { listEmergencyContacts, createEmergencyContact } from "@/app/services/workforceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
  const contacts = await listEmergencyContacts(employeeId);
  return Response.json({ data: contacts });
});

export const POST = withPermission("workforce.*", async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
  const body = (await request.json()) as {
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

  const contact = await createEmergencyContact(employeeId, {
    firstName: body.firstName ?? "",
    lastName: body.lastName ?? "",
    relationship: body.relationship ?? "",
    phoneNumber: body.phoneNumber ?? "",
    alternatePhone: body.alternatePhone,
    email: body.email,
    address: body.address,
    city: body.city,
    state: body.state,
    postalCode: body.postalCode,
    country: body.country,
    notes: body.notes,
  });

  return Response.json({ data: contact }, { status: 201 });
});
