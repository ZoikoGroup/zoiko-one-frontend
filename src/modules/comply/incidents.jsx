import { useState, useEffect } from "react";
import { getIncidents, getIncidentsSummary, getIncidentById, updateIncident } from "../../service/complyService";
import StatsCard from "../../components/comply/StatsCard";
import DataTable from "../../components/comply/DataTable";
import FilterBar from "../../components/comply/FilterBar";
import StatusBadge from "../../components/comply/StatusBadge";
import { formatDate } from "../../components/comply/helpers";
import { AlertTriangle, AlertCircle, CheckCircle, Clock, MessageSquare } from "lucide-react";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ severity: "", status: "" });
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (selectedIncident) {
      getIncidentById(selectedIncident.id).then(setSelectedIncident).catch(() => {});
    } else {
      setLoading(true);
      Promise.all([getIncidents(), getIncidentsSummary()])
        .then(([i, s]) => { setIncidents(i); setSummary(s); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [selectedIncident?.id]);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const filtered = (incidents || []).filter(inc => {
    if (search && !inc.title.toLowerCase().includes(search.toLowerCase()) && !inc.assignee?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.severity && inc.severity !== filters.severity) return false;
    if (filters.status && inc.status !== filters.status) return false;
    return true;
  });

  const handleAddComment = () => {
    if (!comment.trim()) return;
    setSelectedIncident(prev => ({
      ...prev,
      comments: [...(prev.comments || []), { author: "Current User", text: comment, date: new Date().toISOString().split("T")[0] }]
    }));
    setComment("");
  };

  const handleStatusChange = (newStatus) => {
    updateIncident(selectedIncident.id, { status: newStatus });
    setSelectedIncident(prev => ({ ...prev, status: newStatus }));
  };

  if (loading && !selectedIncident) return <div className="p-6 text-gray-500">Loading incidents...</div>;

  const filterConfig = [
    { key: "severity", placeholder: "All Severities", value: filters.severity, options: [
      { value: "critical", label: "Critical" }, { value: "high", label: "High" },
      { value: "medium", label: "Medium" }, { value: "low", label: "Low" },
    ]},
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "reported", label: "Reported" }, { value: "investigating", label: "Investigating" },
      { value: "contained", label: "Contained" }, { value: "resolved", label: "Resolved" },
      { value: "closed", label: "Closed" },
    ]},
  ];

  if (selectedIncident) {
    return (
      <div className="space-y-6 max-w-4xl">
        <button onClick={() => setSelectedIncident(null)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">← Back to Incidents</button>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={selectedIncident.severity} />
                <StatusBadge status={selectedIncident.status} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">{selectedIncident.title}</h2>
              <p className="text-xs text-gray-500 mt-1">Reported: {formatDate(selectedIncident.reportedDate)} | Assignee: {selectedIncident.assignee || "Unassigned"}</p>
            </div>
            <div className="flex gap-2">
              {selectedIncident.status === "reported" && <button onClick={() => handleStatusChange("investigating")} className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">Start Investigation</button>}
              {selectedIncident.status === "investigating" && <button onClick={() => handleStatusChange("contained")} className="px-3 py-1.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200">Contain</button>}
              {selectedIncident.status === "contained" && <button onClick={() => handleStatusChange("resolved")} className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200">Resolve</button>}
              {!["closed", "resolved"].includes(selectedIncident.status) && <button onClick={() => handleStatusChange("closed")} className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Close</button>}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{selectedIncident.description}</p>
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
            <div><span className="font-medium text-gray-700">Impact:</span> {selectedIncident.impact}</div>
            <div><span className="font-medium text-gray-700">Root Cause:</span> {selectedIncident.rootCause || "Under investigation"}</div>
            <div><span className="font-medium text-gray-700">Regulatory:</span> {selectedIncident.regulatoryReporting ? "Required" : "Not Required"}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Comments & Updates</h3>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {(selectedIncident.comments || []).length === 0 && <p className="text-sm text-gray-400">No comments yet.</p>}
            {(selectedIncident.comments || []).map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">{c.author}</span>
                  <span className="text-xs text-gray-400">{formatDate(c.date)}</span>
                </div>
                <p className="text-sm text-gray-600">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" onKeyDown={e => { if (e.key === "Enter") handleAddComment(); }} />
            <button onClick={handleAddComment} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"><MessageSquare className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage compliance incidents throughout their lifecycle</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Open Incidents" value={summary?.open || 0} icon={AlertCircle} />
        <StatsCard title="Critical" value={summary?.bySeverity?.critical || 0} icon={AlertTriangle} trend="down" change={0} />
        <StatsCard title="Investigating" value={summary?.byStatus?.investigating || 0} icon={Clock} />
        <StatsCard title="Resolved" value={summary?.byStatus?.resolved || 0} icon={CheckCircle} trend="up" change={12} />
      </div>

      <FilterBar search={search} onSearchChange={setSearch} filters={filterConfig} onFilterChange={updateFilter} />

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={[
            { key: "title", label: "Incident", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
            { key: "severity", label: "Severity", render: (v) => <StatusBadge status={v} /> },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            { key: "assignee", label: "Assignee" },
            { key: "reportedDate", label: "Reported", render: (v) => formatDate(v) },
            { key: "regulatoryReporting", label: "Regulatory", render: (v) => v ? <StatusBadge status="required" /> : <span className="text-xs text-gray-400">Not Required</span> },
          ]}
          onRowClick={(row) => setSelectedIncident(row)}
          data={filtered}
        />
      </div>
    </div>
  );
}
