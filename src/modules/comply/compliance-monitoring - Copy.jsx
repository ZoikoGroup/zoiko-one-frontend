import { useState, useEffect } from "react";
import { getObligations, getEvidence, uploadEvidence } from "../../service/complyService";
import { CalendarDays, Upload, CheckCircle, Clock, AlertTriangle, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function StatsCard({ title, value, change, trend, icon: Icon }) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-gray-400";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {Icon && <div className="p-2 bg-emerald-50 rounded-lg"><Icon className="w-5 h-5 text-emerald-600" /></div>}
      </div>
      {change != null && (
        <div className="flex items-center gap-1 mt-3">
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span className={`text-sm font-medium ${trendColor}`}>
            {change > 0 ? "+" : ""}{change}%
          </span>
          <span className="text-sm text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
}

function FilterBar({ search, onSearchChange, filters = [], onFilterChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>
      {filters.map((f) => (
        <select
          key={f.key}
          value={f.value}
          onChange={(e) => onFilterChange(f.key, e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="">{f.placeholder}</option>
          {f.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}
    </div>
  );
}

function DataTable({ columns, data, onRowClick }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-gray-400 text-sm">No data available</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              className={`hover:bg-emerald-50/50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const colorClass = statusColor(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
      {status ? status.replace(/_/g, " ") : "N/A"}
    </span>
  );
}

function statusColor(status) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-blue-100 text-blue-800",
    overdue: "bg-red-100 text-red-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    regulatory: "bg-purple-100 text-purple-800",
    contractual: "bg-cyan-100 text-cyan-800",
    internal: "bg-slate-100 text-slate-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export default function ComplianceMonitoring() {
  const [activeTab, setActiveTab] = useState("obligations");
  const [obligations, setObligations] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", type: "" });

  useEffect(() => {
    setLoading(true);
    const p = activeTab === "obligations" ? getObligations() : getEvidence();
    p.then(setEvidence).catch(() => {}).finally(() => setLoading(false));
    if (activeTab === "obligations") getObligations().then(setObligations).catch(() => {});
  }, [activeTab]);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const [selectedObligation, setSelectedObligation] = useState(null);

  const filtered = ((activeTab === "obligations" ? obligations : evidence) || []).filter(item => {
    if (search && !(item.title || item.name || "").toLowerCase().includes(search.toLowerCase()) && !(item.owner || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.type && item.type !== filters.type) return false;
    return true;
  });

  const filterConfig = activeTab === "obligations" ? [
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "pending", label: "Pending" }, { value: "in_progress", label: "In Progress" },
      { value: "completed", label: "Completed" }, { value: "overdue", label: "Overdue" },
    ]},
    { key: "type", placeholder: "All Types", value: filters.type, options: [
      { value: "regulatory", label: "Regulatory" }, { value: "contractual", label: "Contractual" },
      { value: "internal", label: "Internal" },
    ]},
  ] : [
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "pending", label: "Pending" }, { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
    ]},
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadEvidence({ name: file.name, type: file.type, size: file.size });
    setEvidence(prev => [...prev, { id: Date.now(), name: file.name, status: "pending", uploadedBy: "Current User", uploadedDate: new Date().toISOString().split("T")[0] }]);
    e.target.value = "";
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  const tabContent = activeTab === "obligations" ? (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Obligations" value={obligations.length} icon={CalendarDays} />
        <StatsCard title="Overdue" value={obligations.filter(o => o.status === "overdue").length} icon={AlertTriangle} trend="down" change={0} />
        <StatsCard title="In Progress" value={obligations.filter(o => o.status === "in_progress").length} icon={Clock} />
        <StatsCard title="Completed" value={obligations.filter(o => o.status === "completed").length} icon={CheckCircle} trend="up" change={5} />
      </div>
      <FilterBar search={search} onSearchChange={setSearch} filters={filterConfig} onFilterChange={updateFilter} />
      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={[
            { key: "title", label: "Obligation", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
            { key: "type", label: "Type", render: (v) => <StatusBadge status={v} /> },
            { key: "owner", label: "Owner" },
            { key: "dueDate", label: "Due Date", render: (v) => formatDate(v) },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
          ]}
          onRowClick={(row) => setSelectedObligation(row)}
          data={filtered}
        />
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg cursor-pointer hover:bg-emerald-100">
            <Upload className="w-4 h-4" /> Upload Evidence
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={[
            { key: "name", label: "File Name", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
            { key: "uploadedBy", label: "Uploaded By" },
            { key: "uploadedDate", label: "Date", render: (v) => formatDate(v) },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
          ]}
          data={filtered}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Monitoring</h1>
        <p className="text-sm text-gray-500 mt-1">Track obligations and manage evidence repository</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveTab("obligations")} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "obligations" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Obligations</button>
        <button onClick={() => setActiveTab("evidence")} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "evidence" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Evidence Repository</button>
      </div>

      {tabContent}
    </div>
  );
}
