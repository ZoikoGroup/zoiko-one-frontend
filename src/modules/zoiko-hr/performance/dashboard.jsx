import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Trophy, Target, MessageSquare, Star } from "lucide-react";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/performance" },
  { label: "Goals & OKRs", href: "/zoiko-hr/performance/goals" },
  { label: "Performance Reviews", href: "/zoiko-hr/performance/reviews" },
  { label: "Appraisals", href: "/zoiko-hr/performance/appraisals" },
  { label: "Feedback", href: "/zoiko-hr/performance/feedback" },
  { label: "360 Reviews", href: "/zoiko-hr/performance/360-reviews" },
  { label: "KPI Tracking", href: "/zoiko-hr/performance/kpis" },
  { label: "Competencies", href: "/zoiko-hr/performance/competencies" },
  { label: "Analytics", href: "/zoiko-hr/performance/analytics" },
  { label: "Reports", href: "/zoiko-hr/performance/reports" },
  { label: "Settings", href: "/zoiko-hr/performance/settings" },
];

const stats = { overallScore: 87, goalsCompleted: 34, goalsTotal: 48, reviewsPending: 12, feedbackGiven: 156, avgRating: 4.2, teamScores: [{ team: "Engineering", score: 88 }, { team: "Product", score: 92 }, { team: "Design", score: 85 }, { team: "Marketing", score: 79 }, { team: "Sales", score: 82 }] };

const goals = [
  { id: 1, title: "Increase product adoption by 20%", owner: "Sarah M.", quarter: "Q1 2025", progress: 75, status: "on_track", dueDate: "2025-03-31" },
  { id: 2, title: "Reduce customer churn to under 5%", owner: "Mike R.", quarter: "Q1 2025", progress: 60, status: "on_track", dueDate: "2025-03-31" },
  { id: 3, title: "Launch mobile app v2.0", owner: "Tom K.", quarter: "Q2 2025", progress: 25, status: "on_track", dueDate: "2025-06-30" },
  { id: 4, title: "Complete SOC 2 certification", owner: "Jane D.", quarter: "Q1 2025", progress: 90, status: "at_risk", dueDate: "2025-03-15" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/performance"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${isActive ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, change, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        {Icon && <div className="p-2 bg-blue-50 rounded-lg"><Icon className="w-5 h-5 text-blue-600" /></div>}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {change != null && (
        <p className={`text-sm font-medium mt-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {change > 0 ? "+" : ""}{change}% vs last month
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const m = { not_started: "bg-gray-100 text-gray-800", on_track: "bg-green-100 text-green-800", at_risk: "bg-red-100 text-red-800", completed: "bg-blue-100 text-blue-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

export default function PerformanceDashboard() {
  return (
    <HRPage title="Performance Dashboard" subtitle="Team performance overview and metrics">
      <SubNav />
      <div className="space-y-6">
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
              {goals.map((g) => (
                <div key={g.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900 truncate max-w-[200px]">{g.title}</span>
                    <StatusBadge status={g.status} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${g.status === "completed" ? "bg-green-500" : g.status === "at_risk" ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${g.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{g.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HRPage>
  );
}
