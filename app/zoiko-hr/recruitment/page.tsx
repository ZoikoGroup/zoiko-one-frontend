"use client";

import { useEffect, useState } from "react";
import { Briefcase, Users, Calendar, BadgeCheck, Percent, TrendingUp } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import { fetchRecruitmentDashboard, type RecruitmentDashboardStats } from "../../lib/workforce-api";

export default function RecruitmentDashboardPage() {
  const [stats, setStats] = useState<RecruitmentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchRecruitmentDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    { title: "Total Open Positions", value: stats?.totalOpenPositions ?? 0, icon: Briefcase, trend: "Active", description: "Positions currently open" },
    { title: "Active Candidates", value: stats?.activeCandidates ?? 0, icon: Users, trend: "In pipeline", description: "Candidates in process" },
    { title: "Interviews Scheduled", value: stats?.interviewsScheduled ?? 0, icon: Calendar, trend: "Upcoming", description: "Scheduled interviews" },
    { title: "Offers Sent", value: stats?.offersSent ?? 0, icon: BadgeCheck, trend: "Pending", description: "Offers awaiting response" },
    { title: "Offers Accepted", value: stats?.offersAccepted ?? 0, icon: TrendingUp, trend: "Hired", description: "Offers accepted" },
    { title: "Hiring Success Rate", value: `${stats?.hiringSuccessRate ?? 0}%`, icon: Percent, trend: "Overall", description: "Offer to hire conversion" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Recruitment Management"
        description="Monitor job openings, candidates, interviews, and hiring metrics."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-400">Loading recruitment dashboard...</span>
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
