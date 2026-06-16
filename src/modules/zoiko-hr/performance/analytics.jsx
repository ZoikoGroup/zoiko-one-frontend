import { NavLink } from "react-router-dom";
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

const metrics = [
  { metric: "Avg Performance Score", value: "87%", change: 3, trend: "up" },
  { metric: "Goal Completion Rate", value: "71%", change: 8, trend: "up" },
  { metric: "Review Completion", value: "64%", change: -5, trend: "down" },
  { metric: "Avg Rating", value: "4.2/5", change: 0.2, trend: "up" },
  { metric: "Feedback Frequency", value: "2.1/employee", change: 0.3, trend: "up" },
  { metric: "High Performers", value: "34%", change: 2, trend: "up" },
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

function StatsCard({ title, value, change, trend }) {
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600";
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {change != null && (
        <p className={`text-sm font-medium mt-2 ${trendColor}`}>{change > 0 ? "+" : ""}{change}% vs last month</p>
      )}
    </div>
  );
}

export default function PerformanceAnalytics() {
  return (
    <HRPage title="Performance Analytics" subtitle="Key performance metrics and trends">
      <SubNav />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Key performance metrics and trends</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m) => (
            <StatsCard key={m.metric} title={m.metric} value={m.value} change={m.change} trend={m.trend} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h2>
            <div className="space-y-3">
              {[
                { range: "4.5 - 5.0 (Excellent)", count: 12, pct: 24 },
                { range: "4.0 - 4.4 (Good)", count: 18, pct: 36 },
                { range: "3.0 - 3.9 (Satisfactory)", count: 14, pct: 28 },
                { range: "Below 3.0 (Needs Improvement)", count: 6, pct: 12 },
              ].map((r) => (
                <div key={r.range}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{r.range}</span>
                    <span className="font-medium text-gray-900">{r.count} ({r.pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h2>
            <div className="space-y-4">
              {[
                { dept: "Engineering", score: 88, change: "+3%" },
                { dept: "Product", score: 92, change: "+5%" },
                { dept: "Design", score: 85, change: "+1%" },
                { dept: "Marketing", score: 79, change: "-2%" },
                { dept: "Sales", score: 82, change: "+4%" },
              ].map((d) => (
                <div key={d.dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{d.dept}</p>
                    <p className="text-xs text-gray-400">{d.change} vs last quarter</p>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{d.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HRPage>
  );
}
