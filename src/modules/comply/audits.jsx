import { useState, useEffect } from "react";
import { getAudits, getAuditFindings, getAuditsSummary } from "../../service/complyService";
import StatsCard from "../../components/comply/StatsCard";
import DataTable from "../../components/comply/DataTable";
import FilterBar from "../../components/comply/FilterBar";
import StatusBadge from "../../components/comply/StatusBadge";
import { formatDate } from "../../components/comply/helpers";
import { Search, FileCheck, ClipboardCheck, Clock, CheckCircle } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function Audits() {
  const [audits, setAudits] = useState([]);
  const [findings, setFindings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auditId, setAuditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", type: "" });
  const [selectedAudit, setSelectedAudit] = useState(null);

  useEffect(() => {
    if (auditId) {
      getAuditFindings(auditId).then(setFindings).catch(() => {}).finally(() => setLoading(false));
    } else {
      Promise.all([getAudits(), getAuditsSummary()])
        .then(([a, s]) => { setAudits(a); setSummary(s); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [auditId]);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const filtered = (audits || []).filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.lead.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.status && a.status !== filters.status) return false;
    if (filters.type && a.type !== filters.type) return false;
    return true;
  });

  if (loading) return <div className="p-6 text-gray-500">Loading audits...</div>;

  const filterConfig = [
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "planning", label: "Planning" }, { value: "active", label: "Active" },
      { value: "review", label: "Review" }, { value: "closed", label: "Closed" },
    ]},
    { key: "type", placeholder: "All Types", value: filters.type, options: [
      { value: "internal", label: "Internal" }, { value: "external", label: "External" },
      { value: "regulatory", label: "Regulatory" },
    ]},
  ];

  const auditStatusData = summary ? [
    { name: "Planning", value: summary.byStatus.planning, color: "#6b7280" },
    { name: "Active", value: summary.byStatus.active, color: "#3b82f6" },
    { name: "Review", value: summary.byStatus.review, color: "#eab308" },
    { name: "Closed", value: summary.byStatus.closed, color: "#22c55e" },
  ] : [];

  if (selectedAudit) {
    const auditFindings = findings.length > 0 ? findings : [];
    return (
      <div className="space-y-6">
        <button onClick={() => { setSelectedAudit(null); setAuditId(null); }} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          ← Back to Audits
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={selectedAudit.type === "internal" ? "internal_audit" : selectedAudit.type === "external" ? "external_audit" : "regulatory_audit"} />
                <StatusBadge status={selectedAudit.status} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">{selectedAudit.title}</h2>
              <p className="text-sm text-gray-500 mt-1">Lead: {selectedAudit.lead} | {formatDate(selectedAudit.startDate)} - {formatDate(selectedAudit.endDate)}</p>
            </div>
            {selectedAudit.progress != null && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Progress</p>
                <p className="text-lg font-bold text-emerald-600">{selectedAudit.progress}%</p>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-4">{selectedAudit.scope}</p>
          {selectedAudit.team && <p className="text-xs text-gray-500">Team: {selectedAudit.team.join(", ")}</p>}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Findings ({auditFindings.length})</h3>
          {auditFindings.length > 0 ? (
            <DataTable
              columns={[
                { key: "title", label: "Finding", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
                { key: "severity", label: "Severity", render: (v) => <StatusBadge status={v} /> },
                { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
                { key: "owner", label: "Owner" },
                { key: "dueDate", label: "Due Date", render: (v) => formatDate(v) },
              ]}
              data={auditFindings}
            />
          ) : (
            <p className="text-sm text-gray-400 py-8 text-center">No findings recorded for this audit</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audits</h1>
        <p className="text-sm text-gray-500 mt-1">Manage audit programs, findings, and corrective actions</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Audits" value={summary?.total || 20} icon={Search} />
        <StatsCard title="Active" value={summary?.byStatus?.active || 0} icon={ClipboardCheck} trend="up" change={15} />
        <StatsCard title="In Review" value={summary?.byStatus?.review || 0} icon={Clock} />
        <StatsCard title="Completed" value={summary?.byStatus?.closed || 0} icon={CheckCircle} trend="up" change={10} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Audit Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={auditStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {auditStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Audit Programs</h3>
          <FilterBar search={search} onSearchChange={setSearch} filters={filterConfig} onFilterChange={updateFilter} />
          <DataTable
            columns={[
              { key: "title", label: "Audit", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
              { key: "lead", label: "Lead" },
              { key: "type", label: "Type", render: (v) => <StatusBadge status={`${v}_audit`} /> },
              { key: "startDate", label: "Start", render: (v) => formatDate(v) },
              { key: "progress", label: "Progress", render: (v) => <div className="flex items-center gap-2"><div className="w-16 h-2 bg-gray-200 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${v || 0}%` }} /></div><span className="text-xs text-gray-500">{v || 0}%</span></div> },
              { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            ]}
            onRowClick={(row) => { setSelectedAudit(row); setAuditId(row.id); }}
            data={filtered}
          />
        </div>
      </div>
    </div>
  );
}
