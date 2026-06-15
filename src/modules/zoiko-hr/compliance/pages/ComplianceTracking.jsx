import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import DataTable from "../components/DataTable";
import { useComplianceTracking, usePolicies } from "../hooks/useCompliance";
import { formatDate } from "../utils/helpers";

export default function ComplianceTracking() {
  const { data: tracking, loading } = useComplianceTracking();
  const { data: policies } = usePolicies();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    let result = tracking;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.employee.toLowerCase().includes(q) || t.policy.toLowerCase().includes(q));
    }
    if (statusFilter) result = result.filter((t) => t.status === statusFilter);
    return result;
  }, [tracking, search, statusFilter]);

  const completionRate = tracking.length > 0
    ? Math.round((tracking.filter((t) => t.status === "acknowledged").length / tracking.length) * 100)
    : 0;

  const overdueCount = tracking.filter((t) => t.status === "overdue").length;

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "policy", label: "Policy", render: (v) => <span className="text-gray-700">{v}</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "acknowledgedDate", label: "Acknowledged", render: (v) => formatDate(v) },
    { key: "dueDate", label: "Due Date", render: (v) => formatDate(v) },
    { key: "score", label: "Score", render: (v) => v > 0 ? <span className="text-emerald-600 font-medium">{v}%</span> : <span className="text-gray-400">—</span> },
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading compliance tracking...</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Records</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{tracking.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Completion Rate</p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-2xl font-bold text-emerald-600">{completionRate}%</p>
            <div className="flex-1 bg-gray-100 rounded-full h-2.5">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Overdue</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{overdueCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Search employee or policy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
