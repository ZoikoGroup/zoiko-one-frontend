import { getRolePermissions } from "@/app/services/superAdminService";
import { withPermission } from "../_security";

export const dynamic = "force-dynamic";

export const GET = withPermission("system.*", async function GET() {
  return Response.json({ data: await getRolePermissions() });
});
