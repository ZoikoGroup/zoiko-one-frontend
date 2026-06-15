import { Trophy, Target, MessageSquare, Star, Users } from "lucide-react";
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";
import { usePerformanceDashboard, useGoalsOKRs } from "../hooks/usePerformance";

export default function PerformanceDashboard() {
  const { data: stats, loading: sLoad } = usePerformanceDashboard();
  const { data: goals, loading: gLoad } = useGoalsOKRs();

  if (sLoad || gLoad) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Team performance overview and metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard title="Overall Score" value={`${stats.overallScore}%`} icon={Trophy} change={2} trend="up" />
        <StatsCard title="Goals Completed" value={`${stats.goalsCompleted}/${stats.goalsTotal}`} icon={Target} change={8} trend="up" />
        <StatsCard title="Reviews Pending" value={stats.reviewsPending} icon={Star} change={-3} trend="down" />
        <StatsCard title="Feedback Given" value={stats.feedbackGiven} icon={MessageSquare} change={12} trend="up" />
        <StatsCard title="Avg Rating" value={stats.avgRating} icon={Star} change={0.2} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Scores</h2>
          <div className="space-y-3">
            {stats.teamScores.map((t) => (
              <div key={t.team}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{t.team}</span>
                  <span className="font-medium text-gray-900">{t.score}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${t.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</h2>
          <div className="space-y-4">
            {goals.slice(0, 4).map((g) => (
              <div key={g.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-900 truncate max-w-[200px]">{g.title}</span>
                  <StatusBadge status={g.status} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${g.status === "completed" ? "bg-green-500" : g.status === "at_risk" ? "bg-red-500" : "bg-blue-500"}`}
                      style={{ width: `${g.progress}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{g.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
