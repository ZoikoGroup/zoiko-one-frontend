"use client";

import { useEffect, useState } from "react";
import { FileText, BarChart3, MessageSquare, Heart, Users, Award } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import StatusBadge from "../../components/StatusBadge";
import ReusableTable from "../../components/ReusableTable";
import { fetchEngagementDashboard, fetchSurveys, type EngagementDashboardStats, type Survey } from "../../lib/workforce-api";

export default function EngagementDashboardPage() {
  const [stats, setStats] = useState<EngagementDashboardStats | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetchEngagementDashboard(),
      fetchSurveys({ status: "ACTIVE", take: 5 }),
    ])
      .then(([statsRes, surveyRes]) => {
        setStats(statsRes.data);
        setSurveys(surveyRes.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load engagement dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    { title: "Total Surveys", value: stats?.totalSurveys ?? 0, icon: FileText, trend: "Created", description: "All surveys created" },
    { title: "Active Surveys", value: stats?.activeSurveys ?? 0, icon: BarChart3, trend: "Live", description: "Currently active surveys" },
    { title: "Responses Received", value: stats?.totalResponses ?? 0, icon: MessageSquare, trend: "Collected", description: "Total responses collected" },
    { title: "Engagement Score", value: `${stats?.engagementScore ?? 0}%`, icon: Heart, trend: "Overall", description: "Organization engagement score" },
    { title: "Participation Rate", value: `${stats?.participationRate ?? 0}%`, icon: Users, trend: "Rate", description: "Average participation rate" },
    { title: "Recognition Count", value: stats?.recognitionCount ?? 0, icon: Award, trend: "Given", description: "Total employee recognitions" },
  ];

  const surveyColumns = [
    { key: "title", header: "Survey", render: (row: Survey) => <span className="text-white font-medium">{row.title}</span> },
    { key: "surveyType", header: "Type", render: (row: Survey) => row.surveyType.replace(/_/g, " ") },
    { key: "totalResponses", header: "Responses", render: (row: Survey) => `${row.totalResponses} / ${row.targetResponses}` },
    { key: "status", header: "Status", render: (row: Survey) => <StatusBadge status={row.status} /> },
    { key: "publishedAt", header: "Published", render: (row: Survey) => row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : "-" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Employee Engagement & Surveys"
        description="Manage surveys, track engagement scores, recognition programs, and sentiment analysis across the organization."
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
              title="Active Surveys"
              description="Currently active surveys requiring responses."
              columns={surveyColumns}
              data={surveys}
              emptyState="No active surveys found."
            />
          </div>
        </>
      )}
    </SuperAdminShell>
  );
}
