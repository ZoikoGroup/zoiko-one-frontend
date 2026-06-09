"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users, CheckCircle2, Award, ClipboardList, TrendingUp } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import { fetchLMSDashboard, type LMSDashboardStats } from "../../lib/workforce-api";

export default function LearningDashboardPage() {
  const [stats, setStats] = useState<LMSDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchLMSDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    { title: "Total Courses", value: stats?.totalCourses ?? 0, icon: BookOpen, trend: "Available", description: "Active and draft courses" },
    { title: "Active Learners", value: stats?.activeLearners ?? 0, icon: Users, trend: "Enrolled", description: "Currently enrolled" },
    { title: "Completed Courses", value: stats?.completedCourses ?? 0, icon: CheckCircle2, trend: "Finished", description: "Courses completed" },
    { title: "Certifications Earned", value: stats?.certificationsEarned ?? 0, icon: Award, trend: "Active", description: "Active certifications" },
    { title: "Pending Assessments", value: stats?.pendingAssessments ?? 0, icon: ClipboardList, trend: "Pending", description: "Awaiting evaluation" },
    { title: "Learning Completion Rate", value: `${stats?.learningCompletionRate ?? 0}%`, icon: TrendingUp, trend: "Overall", description: "Completion rate" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Learning & Development"
        description="Manage courses, learning paths, certifications, assessments, and employee development."
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpiCards.map((card) => (
            <KPICard key={card.title} {...card} />
          ))}
        </div>
      )}
    </SuperAdminShell>
  );
}
