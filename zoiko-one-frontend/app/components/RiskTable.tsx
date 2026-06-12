import StatusBadge from "./StatusBadge";
import ReusableTable, { type TableColumn } from "./ReusableTable";
import type { OrganizationRow } from "../services/superAdminService";

interface RiskTableProps {
  organizations: OrganizationRow[];
}

function formatRiskScore(organization: OrganizationRow) {
  const base = organization.employeesCount;
  const multiplier = organization.status === "ACTIVE" ? 0.9 : organization.status === "SUSPENDED" ? 1.3 : 1.1;
  return Math.min(100, Math.max(18, Math.round((base / 10) * multiplier))).toString();
}

export default function RiskTable({ organizations }: RiskTableProps) {
  const riskRows = organizations.slice(0, 6).map((organization) => ({
    ...organization,
    country: organization.tenantName,
    riskScore: `${formatRiskScore(organization)}%`,
    complianceStatus: organization.status === "ACTIVE" ? "Compliant" : "Monitor",
  }));

  const columns: TableColumn<(typeof riskRows)[number]>[] = [
    { key: "name", header: "Organization" },
    { key: "country", header: "Country" },
    { key: "plan", header: "Plan" },
    { key: "employeesCount", header: "Employees" },
    { key: "riskScore", header: "Risk Score" },
    {
      key: "complianceStatus",
      header: "Compliance Status",
      render: (row) => <StatusBadge status={row.complianceStatus} />,
    },
  ];

  return (
    <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Risk table</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Top Risk Organizations</h2>
        </div>
      </div>
      <ReusableTable columns={columns} data={riskRows} title="" />
    </section>
  );
}
