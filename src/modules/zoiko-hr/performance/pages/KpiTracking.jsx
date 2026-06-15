import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useKPIs } from "../hooks/usePerformance";

export default function KpiTracking() {
  const { data: kpis, loading } = useKPIs();

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const columns = [
    { key: "name", label: "KPI", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "target", label: "Target" },
    { key: "current", label: "Current", render: (v, r) => (
      <span className={`font-mono font-medium ${v >= r.target ? "text-green-600" : v < r.target * 0.8 ? "text-red-600" : "text-yellow-600"}`}>{v}</span>
    )},
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "owner", label: "Owner" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KPI Tracking</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor key performance indicators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-600 font-medium">On Track</p>
          <p className="text-2xl font-bold text-green-700">{kpis.filter((k) => k.status === "on_track" || k.status === "completed").length}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-xs text-yellow-600 font-medium">At Risk</p>
          <p className="text-2xl font-bold text-yellow-700">{kpis.filter((k) => k.status === "at_risk").length}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-xs text-red-600 font-medium">Off Track</p>
          <p className="text-2xl font-bold text-red-700">{kpis.filter((k) => k.status === "not_started").length}</p>
        </div>
      </div>

      <DataTable columns={columns} data={kpis} />
    </div>
  );
}
