import { useState } from "react";
import { Plus, FileText } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useAppraisals } from "../hooks/usePerformance";

export default function Appraisals() {
  const { data: appraisals, loading } = useAppraisals();
  const [filter, setFilter] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const filtered = filter ? appraisals.filter((a) => a.status === filter) : appraisals;

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "year", label: "Period" },
    { key: "selfScore", label: "Self Score", render: (v) => v ? `${v}/5` : "-" },
    { key: "managerScore", label: "Manager Score", render: (v) => v ? `${v}/5` : "-" },
    { key: "finalScore", label: "Final Score", render: (v) => v ? <span className="font-bold text-gray-900">{v}/5</span> : "-" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "actions", label: "", render: () => (
      <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
        <FileText className="w-3 h-3" /> View
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appraisals</h1>
          <p className="text-sm text-gray-500 mt-1">Annual and periodic appraisal records</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> New Appraisal
        </button>
      </div>

      <div className="flex gap-2">
        {["", "draft", "submitted", "approved"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {s ? s.replace(/\b\w/g, (l) => l.toUpperCase()) : "All"}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
