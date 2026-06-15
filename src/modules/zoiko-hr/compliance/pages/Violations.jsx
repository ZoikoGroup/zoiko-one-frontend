import { useState, useMemo } from "react";
import { Search, X, FileText } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import DataTable from "../components/DataTable";
import { useViolations } from "../hooks/useCompliance";
import { formatDate } from "../utils/helpers";

export default function Violations() {
  const { data: violations, loading } = useViolations();
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedViolation, setSelectedViolation] = useState(null);

  const filtered = useMemo(() => {
    let result = violations;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((v) => v.employee.toLowerCase().includes(q) || v.violation.toLowerCase().includes(q) || v.policy.toLowerCase().includes(q));
    }
    if (severityFilter) result = result.filter((v) => v.severity === severityFilter);
    if (statusFilter) result = result.filter((v) => v.status === statusFilter);
    return result;
  }, [violations, search, severityFilter, statusFilter]);

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "policy", label: "Policy" },
    { key: "violation", label: "Violation", render: (v) => <span className="text-gray-500 max-w-[200px] truncate block">{v}</span> },
    { key: "severity", label: "Severity", render: (v) => <StatusBadge status={v} /> },
    { key: "date", label: "Date", render: (v) => formatDate(v) },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "reportedBy", label: "Reported By" },
    {
      key: "actions", label: "", render: (_, row) => (
        <button onClick={() => setSelectedViolation(row)} className="text-emerald-600 hover:text-emerald-800 text-xs font-medium">View</button>
      ),
    },
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading violations...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Search violations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
          <option value="">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <DataTable columns={columns} data={filtered} />

      {selectedViolation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Violation Details</h2>
              <button onClick={() => setSelectedViolation(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 rounded-lg"><FileText size={20} className="text-red-600" /></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedViolation.employee}</p>
                  <p className="text-xs text-gray-500">{selectedViolation.policy}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Violation</p>
                <p className="text-sm text-gray-900 mt-0.5">{selectedViolation.violation}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Severity</p>
                  <StatusBadge status={selectedViolation.severity} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <StatusBadge status={selectedViolation.status} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm text-gray-900">{formatDate(selectedViolation.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reported By</p>
                  <p className="text-sm text-gray-900">{selectedViolation.reportedBy}</p>
                </div>
              </div>
              {selectedViolation.resolution && (
                <div>
                  <p className="text-xs text-gray-500">Resolution</p>
                  <p className="text-sm text-gray-900 mt-0.5 bg-gray-50 rounded-lg p-3">{selectedViolation.resolution}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
