"use client";

import { useEffect, useState } from "react";
import { FileText, AlertTriangle, ClipboardList, Users, TrendingUp, Clock } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import StatusBadge from "../../components/StatusBadge";
import ReusableTable from "../../components/ReusableTable";
import { fetchComplianceDashboard, fetchViolations, type ComplianceDashboardStats, type Violation } from "../../lib/workforce-api";

export default function ComplianceDashboardPage() {
  const [stats, setStats] = useState<ComplianceDashboardStats | null>(null);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetchComplianceDashboard(),
      fetchViolations({ take: 5, orderBy: "createdAt", orderDir: "desc" }),
    ])
      .then(([statsRes, violRes]) => {
        setStats(statsRes.data);
        setViolations(violRes.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load compliance dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    { title: "Active Policies", value: stats?.activePolicies ?? 0, icon: FileText, trend: "Published", description: "Currently enforced policies" },
    { title: "Pending Acknowledgements", value: stats?.pendingAcknowledgements ?? 0, icon: Users, trend: "Pending", description: "Employees who haven't acknowledged" },
    { title: "Open Violations", value: stats?.openViolations ?? 0, icon: AlertTriangle, trend: "Open", description: "Violations requiring action" },
    { title: "Upcoming Audits", value: stats?.upcomingAudits ?? 0, icon: ClipboardList, trend: "Scheduled", description: "Audits due this quarter" },
    { title: "Overdue Requirements", value: stats?.overdueRequirements ?? 0, icon: Clock, trend: "Overdue", description: "Past-due compliance requirements" },
    { title: "Training Compliance", value: `${stats?.trainingComplianceRate ?? 0}%`, icon: TrendingUp, trend: "Overall", description: "Employee training completion rate" },
  ];

  const violationColumns = [
    { key: "employee", header: "Employee", render: (row: Violation) => row.employeeName },
    { key: "policy", header: "Policy", render: (row: Violation) => row.policyName },
    { key: "severity", header: "Severity", render: (row: Violation) => <StatusBadge status={row.severity} /> },
    { key: "status", header: "Status", render: (row: Violation) => <StatusBadge status={row.status} /> },
    { key: "createdAt", header: "Date", render: (row: Violation) => new Date(row.createdAt).toLocaleDateString() },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Compliance & Policy Management"
        description="Manage policies, track compliance requirements, audits, violations, and training compliance across the organization."
      />
      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-400">Loading dashboard...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {kpiCards.map((card) => (
              <KPICard key={card.title} {...card} />
            ))}
          </div>

          <div className="mt-6">
            <ReusableTable
              title="Recent Violations"
              description="Latest compliance violations requiring attention."
              columns={violationColumns}
              data={violations}
              emptyState="No violations found."
            />
          </div>
        </>
      )}
    </SuperAdminShell>
  );
}
