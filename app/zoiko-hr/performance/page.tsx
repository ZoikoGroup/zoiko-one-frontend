"use client";

import { useEffect, useState } from "react";
import { Users, ClipboardCheck, Target, MessageSquare, TrendingUp, TrendingDown, FileText, Sparkles } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import {
  fetchPerformanceDashboard, fetchReviews, fetchGoals, fetchFeedbacks,
  type PerformanceDashboardStats, type PerformanceReviewRecord, type GoalRecord, type FeedbackRecord,
} from "../../lib/workforce-api";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function PerformanceDashboardPage() {
  const [stats, setStats] = useState<PerformanceDashboardStats | null>(null);
  const [recentReviews, setRecentReviews] = useState<PerformanceReviewRecord[]>([]);
  const [recentGoals, setRecentGoals] = useState<GoalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashRes, revRes, goalRes] = await Promise.all([
        fetchPerformanceDashboard(),
        fetchReviews({ take: 5, orderBy: "createdAt", orderDir: "desc" }),
        fetchGoals({ take: 5, orderBy: "createdAt", orderDir: "desc" }),
      ]);
      setStats(dashRes.data);
      setRecentReviews(revRes.data);
      setRecentGoals(goalRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load performance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const reviewStatCards = [
    { label: "Total Reviews", value: stats?.totalReviews ?? 0, icon: <ClipboardCheck className="h-6 w-6" />, gradient: "from-indigo-600/40 to-indigo-900/20" },
    { label: "Draft", value: stats?.draftReviews ?? 0, icon: <FileText className="h-6 w-6" />, gradient: "from-slate-600/40 to-slate-900/20" },
    { label: "Submitted", value: stats?.submittedReviews ?? 0, icon: <TrendingUp className="h-6 w-6" />, gradient: "from-blue-600/40 to-blue-900/20" },
    { label: "Acknowledged", value: stats?.acknowledgedReviews ?? 0, icon: <TrendingDown className="h-6 w-6" />, gradient: "from-emerald-600/40 to-emerald-900/20" },
  ];

  const goalStatCards = [
    { label: "Active Cycles", value: stats?.activeCycles ?? 0, icon: <Sparkles className="h-6 w-6" />, gradient: "from-violet-600/40 to-violet-900/20" },
    { label: "Total Goals", value: stats?.totalGoals ?? 0, icon: <Target className="h-6 w-6" />, gradient: "from-amber-600/40 to-amber-900/20" },
    { label: "In Progress", value: stats?.inProgressGoals ?? 0, icon: <TrendingUp className="h-6 w-6" />, gradient: "from-blue-600/40 to-blue-900/20" },
    { label: "Completed", value: stats?.completedGoals ?? 0, icon: <TrendingDown className="h-6 w-6" />, gradient: "from-emerald-600/40 to-emerald-900/20" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Performance Management"
        description="Monitor performance reviews, goals, and feedback across the organization."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-400">Loading performance dashboard...</span>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Reviews</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {reviewStatCards.map((card) => (
                <div key={card.label} className={`relative overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] bg-gradient-to-br ${card.gradient} p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wider text-slate-400">{card.label}</p>
                    <span className="text-slate-500">{card.icon}</span>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Goals</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {goalStatCards.map((card) => (
                <div key={card.label} className={`relative overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] bg-gradient-to-br ${card.gradient} p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wider text-slate-400">{card.label}</p>
                    <span className="text-slate-500">{card.icon}</span>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <div className="border-b border-slate-800 px-5 py-4">
                <h2 className="text-lg font-semibold text-white">Recent Reviews</h2>
              </div>
              <div className="divide-y divide-slate-800">
                {recentReviews.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-500">No reviews yet.</p>
                ) : (
                  recentReviews.map((r) => (
                    <div key={r.id} className="flex items-center justify-between px-5 py-3 transition hover:bg-slate-900/80">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : r.employeeId}
                        </p>
                        <p className="text-xs text-slate-500">{r.cycle?.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {r.overallRating && (
                          <span className="text-sm font-semibold text-amber-400">{r.overallRating}/5</span>
                        )}
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <div className="border-b border-slate-800 px-5 py-4">
                <h2 className="text-lg font-semibold text-white">Recent Goals</h2>
              </div>
              <div className="divide-y divide-slate-800">
                {recentGoals.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-500">No goals yet.</p>
                ) : (
                  recentGoals.map((g) => (
                    <div key={g.id} className="flex items-center justify-between px-5 py-3 transition hover:bg-slate-900/80">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{g.title}</p>
                        <p className="text-xs text-slate-500">
                          {g.employee ? `${g.employee.firstName} ${g.employee.lastName}` : g.employeeId}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-3">
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-16 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${g.progress}%` }} />
                          </div>
                          <span className="text-xs text-slate-400">{g.progress}%</span>
                        </div>
                        <StatusBadge status={g.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">Top Rated Reviews</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Employee</th>
                    <th className="px-5 py-3 font-semibold">Cycle</th>
                    <th className="px-5 py-3 font-semibold">Rating</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {stats?.topRated && stats.topRated.length > 0 ? (
                    stats.topRated.map((r) => (
                      <tr key={r.id} className="transition duration-200 hover:bg-slate-900/80">
                        <td className="px-5 py-4">
                          <p className="text-white">{r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : r.employeeId}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-400">{r.cycle?.name}</td>
                        <td className="px-5 py-4">
                          <span className="text-amber-400 font-semibold">{r.overallRating}/5</span>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500">No reviews yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </SuperAdminShell>
  );
}
