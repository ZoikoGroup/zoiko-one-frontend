import { useDocumentsAnalytics } from "../hooks/useDocuments";
import StatsCard from "../components/StatsCard";

export default function DocumentsAnalytics() {
  const { data: metrics, loading } = useDocumentsAnalytics();

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Document management metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <StatsCard key={m.metric} title={m.metric} value={m.value} change={m.change} trend={m.trend} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents by Category</h2>
          <div className="space-y-3">
            {[
              { category: "Employee Documents", count: 120, pct: 42 },
              { category: "Company Documents", count: 65, pct: 23 },
              { category: "Compliance Documents", count: 45, pct: 16 },
              { category: "Templates", count: 24, pct: 8 },
              { category: "Other", count: 30, pct: 11 },
            ].map((c) => (
              <div key={c.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{c.category}</span>
                  <span className="font-medium text-gray-900">{c.count} ({c.pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Metrics</h2>
          <div className="space-y-4">
            {[
              { label: "Average Approval Time", value: "2.4 days", target: "< 3 days", status: "good" },
              { label: "Approval Rate", value: "85%", target: "> 90%", status: "warning" },
              { label: "Documents per Employee", value: "4.2", target: "> 5", status: "warning" },
              { label: "Compliance Score", value: "94%", target: "> 95%", status: "good" },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{m.label}</p>
                  <p className="text-xs text-gray-400">Target: {m.target}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{m.value}</span>
                  <div className={`w-2 h-2 rounded-full ${m.status === "good" ? "bg-green-500" : "bg-yellow-500"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
