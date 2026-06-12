import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getComplianceCenter, type ComplianceCenterRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function ComplianceCenterPage() {
  const reports = await getComplianceCenter();
  const columns: TableColumn<ComplianceCenterRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "packName", header: "Compliance Pack" },
    { key: "jurisdiction", header: "Jurisdiction" },
    { key: "score", header: "Score" },
    { key: "alerts", header: "Alerts" },
    { key: "violations", header: "Violations" },
    { key: "reviewedAt", header: "Reviewed" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Compliance Center" description="Compliance packs, jurisdiction coverage, regulatory alerts, and violation posture." />
      <ReusableTable title="Compliance Posture" columns={columns} data={reports} />
    </SuperAdminShell>
  );
}
