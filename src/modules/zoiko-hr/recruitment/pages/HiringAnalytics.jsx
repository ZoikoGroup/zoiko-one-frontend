import { useHiringAnalytics, useDashboardStats } from "../hooks/useRecruitment";
import StatsCard from "../components/StatsCard";

export default function HiringAnalytics() {
  const { data: metrics, loading: mLoad } = useHiringAnalytics();
  const { data: stats, loading: sLoad } = useDashboardStats();

  if (mLoad || sLoad) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hiring Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Key hiring metrics and trends</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <StatsCard key={m.metric} title={m.metric} value={m.value} change={m.change} trend={m.trend} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Source Breakdown</h2>
          <div className="space-y-3">
            {stats.sourceBreakdown.map((s) => {
              const total = stats.sourceBreakdown.reduce((a, b) => a + b.count, 0);
              const pct = Math.round((s.count / total) * 100);
              return (
                <div key={s.source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{s.source}</span>
                    <span className="font-medium text-gray-900">{s.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hiring Funnel</h2>
          <div className="space-y-4">
            {[
              { stage: "Applications", count: 142, pct: 100 },
              { stage: "Screening", count: 89, pct: 63 },
              { stage: "Interviews", count: 58, pct: 41 },
              { stage: "Offers", count: 12, pct: 8 },
              { stage: "Hires", count: 7, pct: 5 },
            ].map((stage) => (
              <div key={stage.stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{stage.stage}</span>
                  <span className="font-medium text-gray-900">{stage.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full" style={{ width: `${stage.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
