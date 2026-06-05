import { auditLogsToCsv, getAuditLogs, getAuditTimeline } from "@/app/services/superAdminService";
import { withPermission } from "../_security";

export const dynamic = "force-dynamic";

export const GET = withPermission("audit.*", async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filters = {
    search: searchParams.get("search") ?? undefined,
    eventType: searchParams.get("eventType") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    outcome: searchParams.get("outcome") ?? undefined,
  };

  if (searchParams.get("view") === "timeline") {
    return Response.json({ data: await getAuditTimeline(filters) });
  }

  const logs = await getAuditLogs(filters);
  if (searchParams.get("export") === "csv") {
    return new Response(auditLogsToCsv(logs), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": "attachment; filename=zoiko-one-audit-events.csv",
      },
    });
  }

  return Response.json({ data: logs });
});
