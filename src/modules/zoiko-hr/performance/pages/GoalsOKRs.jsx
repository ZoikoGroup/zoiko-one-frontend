import { useState } from "react";
import { Plus, Target } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useGoalsOKRs } from "../hooks/usePerformance";
import { formatDate } from "../utils/helpers";

export default function GoalsOKRs() {
  const { data: goals, loading } = useGoalsOKRs();
  const [filter, setFilter] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const filtered = filter ? goals.filter((g) => g.status === filter) : goals;

  const columns = [
    { key: "title", label: "Objective", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "owner", label: "Owner" },
    { key: "quarter", label: "Quarter" },
    { key: "progress", label: "Progress", render: (v, r) => (
      <div className="flex items-center gap-2">
        <div className="w-24 bg-gray-100 rounded-full h-2"><div className={`h-2 rounded-full ${r.status === "completed" ? "bg-green-500" : r.status === "at_risk" ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${v}%` }} /></div>
        <span className="text-xs font-medium">{v}%</span>
      </div>
    )},
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "dueDate", label: "Due Date", render: (v) => formatDate(v) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goals & OKRs</h1>
          <p className="text-sm text-gray-500 mt-1">Track team objectives and key results</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      <div className="flex gap-2">
        {["", "not_started", "on_track", "at_risk", "completed"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {s ? s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "All"}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
