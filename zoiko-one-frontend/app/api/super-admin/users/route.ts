import { getUsers } from "@/app/services/superAdminService";
import { withPermission } from "../_security";

export const dynamic = "force-dynamic";

export const GET = withPermission("users.*", async function GET() {
  return Response.json({ data: await getUsers() });
});
