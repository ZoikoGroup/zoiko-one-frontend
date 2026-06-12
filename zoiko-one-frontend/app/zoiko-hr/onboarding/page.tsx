"use client";

import { useEffect, useState } from "react";
import { UserPlus, Users, FileText, Briefcase, Calendar, CheckCircle } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import { fetchOnboardingDashboard, type OnboardingDashboardStats } from "../../lib/workforce-api";

export default function OnboardingDashboardPage() {
  const [stats, setStats] = useState<OnboardingDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchOnboardingDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    { title: "Pending Joiners", value: stats?.pendingJoiners ?? 0, icon: UserPlus, trend: "Yet to join", description: "Employees pending onboarding" },
    { title: "Joining This Week", value: stats?.joiningThisWeek ?? 0, icon: Users, trend: "Upcoming", description: "Scheduled to join this week" },
    { title: "Documents Pending", value: stats?.documentsPending ?? 0, icon: FileText, trend: "Needs action", description: "Documents awaiting verification" },
    { title: "Assets Pending", value: stats?.assetsPending ?? 0, icon: Briefcase, trend: "Needs allocation", description: "Assets pending allocation" },
    { title: "Active Probations", value: stats?.activeProbations ?? 0, icon: Calendar, trend: "In progress", description: "Employees under probation" },
    { title: "Completed Onboarding", value: stats?.completedOnboarding ?? 0, icon: CheckCircle, trend: "Done", description: "Fully onboarded employees" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Onboarding Management"
        description="Manage employee onboarding, document verification, asset allocation, and probation tracking."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-400">Loading onboarding dashboard...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpiCards.map((card) => (
            <KPICard key={card.title} {...card} />
          ))}
        </div>
      )}
    </SuperAdminShell>
  );
}
