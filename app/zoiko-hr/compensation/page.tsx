"use client";

import { useEffect, useState } from "react";
import { HeartHandshake, ClipboardCheck, TrendingUp, CircleDollarSign, Layers } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import { fetchCompensationDashboard, type CompensationDashboardStats } from "../../lib/workforce-api";

export default function CompensationDashboardPage() {
  const [stats, setStats] = useState<CompensationDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchCompensationDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(val);

  const kpiCards = [
    { title: "Total Compensation Cost", value: stats ? formatCurrency(stats.totalCompensationCost) : "$0", icon: CircleDollarSign, trend: "Annual", description: "Total salary & benefits cost" },
    { title: "Active Salary Structures", value: stats?.activeSalaryStructures ?? 0, icon: Layers, trend: "In Use", description: "Active pay structures" },
    { title: "Benefits Enrolled", value: stats?.benefitsEnrolled ?? 0, icon: HeartHandshake, trend: "Enrolled", description: "Employees in benefit plans" },
    { title: "Pending Reviews", value: stats?.pendingReviews ?? 0, icon: ClipboardCheck, trend: "Awaiting", description: "Compensation reviews pending" },
    { title: "Upcoming Increments", value: stats?.upcomingIncrements ?? 0, icon: TrendingUp, trend: "Scheduled", description: "Approved salary increments" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Compensation & Benefits"
        description="Manage salary structures, pay grades, allowances, deductions, benefits, and compensation reviews."
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {kpiCards.map((card) => (
            <KPICard key={card.title} {...card} />
          ))}
        </div>
      )}
    </SuperAdminShell>
  );
}
