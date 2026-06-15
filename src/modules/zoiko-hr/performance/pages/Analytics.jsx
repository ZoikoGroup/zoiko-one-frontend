import { usePerformanceAnalytics } from "../hooks/usePerformance";
import StatsCard from "../components/StatsCard";

export default function PerformanceAnalytics() {
  const { data: metrics, loading } = usePerformanceAnalytics();

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
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
  );
}
