import { getComplianceCenter, type ComplianceCenterRow } from "../services/superAdminService";
import SuperAdminShell from "../components/SuperAdminShell";
import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";

export const dynamic = "force-dynamic";

export default async function ComplyPage() {
  const reports = await getComplianceCenter();

  const columns: TableColumn<ComplianceCenterRow>[] = [
    { key: "packName", header: "Pack" },
    { key: "tenantName", header: "Tenant" },
    { key: "jurisdiction", header: "Jurisdiction" },
    { key: "score", header: "Score" },
    { key: "alerts", header: "Alerts" },
    { key: "status", header: "Status" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Zoiko Comply" description="Compliance reports and governance across tenants." />
      <ReusableTable title="Compliance Center" columns={columns} data={reports} />
    </SuperAdminShell>
  );
}
