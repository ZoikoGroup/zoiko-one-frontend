import { useState } from "react";
import { useIncidents } from "../hooks/useComply";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import StatusBadge from "../components/StatusBadge";
import { formatDate, formatDateTime } from "../utils/helpers";
import { AlertTriangle, Bug, Activity, CheckCircle, Clock, Eye } from "lucide-react";

export default function Incidents() {
  const { data: incidents, summary, loading } = useIncidents();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ severity: "", status: "", category: "" });
  const [selectedIncident, setSelectedIncident] = useState(null);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const filtered = (incidents || []).filter(inc => {
    if (search && !inc.title.toLowerCase().includes(search.toLowerCase()) && !inc.assignee.toLowerCase().includes(search.toLowerCase()) && !inc.reportedBy.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.severity && inc.severity !== filters.severity) return false;
    if (filters.status && inc.status !== filters.status) return false;
    if (filters.category && inc.category !== filters.category) return false;
    return true;
  });

  if (loading) return <div className="p-6 text-gray-500">Loading incidents...</div>;

  const filterConfig = [
    { key: "severity", placeholder: "All Severities", value: filters.severity, options: [
      { value: "critical", label: "Critical" }, { value: "high", label: "High" },
      { value: "medium", label: "Medium" }, { value: "low", label: "Low" },
    ]},
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "reported", label: "Reported" }, { value: "investigating", label: "Investigating" },
      { value: "remediation", label: "Remediation" }, { value: "resolved", label: "Resolved" },
      { value: "closed", label: "Closed" },
    ]},
    { key: "category", placeholder: "All Categories", value: filters.category, options: [
      { value: "phishing", label: "Phishing" }, { value: "unauthorized_access", label: "Unauthorized Access" },
      { value: "misconfiguration", label: "Misconfiguration" }, { value: "malware", label: "Malware" },
      { value: "data_leakage", label: "Data Leakage" }, { value: "ransomware", label: "Ransomware" },
      { value: "third_party", label: "Third Party" }, { value: "policy_violation", label: "Policy Violation" },
    ]},
  ];

  const statusFlow = ["reported", "investigating", "remediation", "resolved", "closed"];

  if (selectedIncident) {
    const currentIdx = statusFlow.indexOf(selectedIncident.status);
    return (
      <div className="space-y-6 max-w-4xl">
        <button onClick={() => setSelectedIncident(null)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">← Back to Incidents</button>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400 font-mono">INC-{String(selectedIncident.id).padStart(4, "0")}</span>
                <StatusBadge status={selectedIncident.severity} />
                <StatusBadge status={selectedIncident.status} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">{selectedIncident.title}</h2>
              <p className="text-xs text-gray-500 mt-1">Reported by {selectedIncident.reportedBy} on {formatDateTime(selectedIncident.reportedDate)} | Assignee: {selectedIncident.assignee}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-1 mb-4">
              {statusFlow.map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${i <= currentIdx ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                    {i < currentIdx ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < statusFlow.length - 1 && <div className={`w-12 h-0.5 ${i < currentIdx ? "bg-emerald-400" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600">{selectedIncident.description}</p>
          </div>

          {selectedIncident.rootCause && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Root Cause</h3>
              <p className="text-sm text-gray-600">{selectedIncident.rootCause}</p>
            </div>
          )}

          {selectedIncident.resolution && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Resolution Actions</h3>
              <p className="text-sm text-gray-600">{selectedIncident.resolution}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
        <p className="text-sm text-gray-500 mt-1">Report, investigate, and resolve security and compliance incidents</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Incidents" value={summary?.total || 30} icon={AlertTriangle} />
        <StatsCard title="Critical" value={summary?.bySeverity?.critical || 0} icon={Bug} trend="up" change={5} />
        <StatsCard title="Investigating" value={summary?.byStatus?.investigating || 0} icon={Activity} />
        <StatsCard title="Remediation" value={summary?.byStatus?.remediation || 0} icon={Clock} />
        <StatsCard title="Resolved/Closed" value={(summary?.byStatus?.resolved || 0) + (summary?.byStatus?.closed || 0)} icon={CheckCircle} trend="up" change={10} />
      </div>

      <FilterBar search={search} onSearchChange={setSearch} filters={filterConfig} onFilterChange={updateFilter} />

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={[
            { key: "id", label: "ID", render: (v) => <span className="font-mono text-xs text-gray-400">INC-{String(v).padStart(4, "0")}</span> },
            { key: "title", label: "Incident", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
            { key: "severity", label: "Severity", render: (v) => <StatusBadge status={v} /> },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            { key: "assignee", label: "Assignee" },
            { key: "reportedDate", label: "Reported", render: (v) => formatDate(v) },
            { key: "category", label: "Category", render: (v) => <StatusBadge status={v} /> },
          ]}
          onRowClick={(row) => setSelectedIncident(row)}
          data={filtered}
        />
      </div>
    </div>
  );
}
