"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, Briefcase, AlertTriangle, ShieldCheck, DollarSign, TrendingUp, Activity } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import { fetchWFDashboard, type WFDashboardStats } from "../../lib/workforce-api";

export default function WorkforcePlanningDashboardPage() {
  const [stats, setStats] = useState<WFDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWFDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    { title: "Current Headcount", value: stats?.currentHeadcount ?? 0, icon: Users, trend: "Active", description: "Total employees across departments" },
    { title: "Planned Headcount", value: stats?.plannedHeadcount ?? 0, icon: UserPlus, trend: "Target", description: "Forecasted workforce size" },
    { title: "Open Positions", value: stats?.openPositions ?? 0, icon: Briefcase, trend: "To Fill", description: "Active hiring requirements" },
    { title: "Critical Skill Gaps", value: stats?.criticalSkillGaps ?? 0, icon: AlertTriangle, trend: "Gaps", description: "Skills needing immediate attention" },
    { title: "Successor Coverage", value: `${stats?.successorCoverage ?? 0}%`, icon: ShieldCheck, trend: "Coverage", description: "Roles with ready successors" },
    { title: "Workforce Budget", value: `$${((stats?.workforceBudget ?? 0) / 1000000).toFixed(1)}M`, icon: DollarSign, trend: "Forecast", description: "Total workforce budget" },
    { title: "Forecast Accuracy", value: `${stats?.forecastAccuracy ?? 0}%`, icon: TrendingUp, trend: "Accuracy", description: "Forecast vs actual variance" },
    { title: "Capacity Utilization", value: `${stats?.capacityUtilization ?? 0}%`, icon: Activity, trend: "Utilization", description: "Current vs required capacity" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Workforce Planning"
        description="Strategic workforce planning, headcount management, forecasting, succession planning, and budget optimization."
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((card) => (
            <KPICard key={card.title} {...card} />
          ))}
        </div>
      )}
    </SuperAdminShell>
  );
}
