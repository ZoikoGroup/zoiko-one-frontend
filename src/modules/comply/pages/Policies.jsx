import { useState } from "react";
import { usePolicies } from "../hooks/useComply";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/helpers";
import { FileText, Shield, CheckCircle, Clock, AlertTriangle, History, User } from "lucide-react";

export default function Policies() {
  const { data: policies, summary, loading } = usePolicies();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "", status: "" });
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const filtered = (policies || []).filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.owner.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.status && p.status !== filters.status) return false;
    return true;
  });

  if (loading) return <div className="p-6 text-gray-500">Loading policies...</div>;

  const filterConfig = [
    { key: "category", placeholder: "All Categories", value: filters.category, options: [
      { value: "security", label: "Security" }, { value: "data_privacy", label: "Data Privacy" },
      { value: "hr", label: "HR" }, { value: "finance", label: "Finance" },
      { value: "operations", label: "Operations" }, { value: "legal", label: "Legal" },
      { value: "it", label: "IT" },
    ]},
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "draft", label: "Draft" }, { value: "pending_review", label: "Pending Review" },
      { value: "approved", label: "Approved" }, { value: "published", label: "Published" },
      { value: "archived", label: "Archived" },
    ]},
  ];

  if (selectedPolicy) {
    const versions = [
      { version: "4.2", date: "2026-01-15", status: "published", author: "CISO" },
      { version: "4.1", date: "2025-07-01", status: "archived", author: "CISO" },
      { version: "4.0", date: "2025-01-10", status: "archived", author: "IT Director" },
      { version: "3.2", date: "2024-06-15", status: "archived", author: "IT Director" },
    ];
    return (
      <div className="space-y-6 max-w-4xl">
        <button onClick={() => setSelectedPolicy(null)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">← Back to Policies</button>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={selectedPolicy.category} />
                <StatusBadge status={selectedPolicy.status} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">{selectedPolicy.title}</h2>
              <p className="text-xs text-gray-500 mt-1">Version {selectedPolicy.version} | Owner: {selectedPolicy.owner}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Effective: {formatDate(selectedPolicy.effectiveDate)}</p>
              <p>Review: {formatDate(selectedPolicy.reviewDate)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{selectedPolicy.description}</p>
          {selectedPolicy.acknowledgementRequired && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Employee Acknowledgment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2.5 bg-gray-200 rounded-full">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(selectedPolicy.acknowledgedCount / selectedPolicy.totalEmployees) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{selectedPolicy.acknowledgedCount}/{selectedPolicy.totalEmployees}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><History className="w-4 h-4" /> Version History</h3>
          <DataTable
            columns={[
              { key: "version", label: "Version", render: (v) => <span className="font-mono font-medium">{v}</span> },
              { key: "date", label: "Date", render: (v) => formatDate(v) },
              { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
              { key: "author", label: "Author" },
            ]}
            data={versions}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Policies</h1>
        <p className="text-sm text-gray-500 mt-1">Manage enterprise policies, versions, and employee acknowledgments</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Policies" value={summary?.total || 55} icon={FileText} />
        <StatsCard title="Published" value={summary?.byStatus?.published || 0} icon={Shield} trend="up" change={2} />
        <StatsCard title="Draft" value={summary?.byStatus?.draft || 0} icon={Clock} />
        <StatsCard title="Pending Review" value={summary?.byStatus?.pending_review || 0} icon={AlertTriangle} />
        <StatsCard title="Compliance Rate" value={`${summary?.overallComplianceRate || 0}%`} icon={CheckCircle} trend="up" change={3} />
      </div>

      <FilterBar search={search} onSearchChange={setSearch} filters={filterConfig} onFilterChange={updateFilter} />

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={[
            { key: "title", label: "Policy", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
            { key: "category", label: "Category", render: (v) => <StatusBadge status={v} /> },
            { key: "owner", label: "Owner" },
            { key: "version", label: "Version", render: (v) => <span className="font-mono text-xs">{v}</span> },
            { key: "reviewDate", label: "Review Date", render: (v) => formatDate(v) },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
          ]}
          onRowClick={(row) => setSelectedPolicy(row)}
          data={filtered}
        />
      </div>
    </div>
  );
}
