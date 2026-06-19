import { useState, useEffect } from "react";
import { getControls, getControlsLibrary, getControlById } from "../../service/complyService";
import { Shield, CheckCircle, AlertTriangle, Clock, Activity, Target, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

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
    active: "bg-emerald-100 text-emerald-800",
    inactive: "bg-gray-100 text-gray-800",
    not_implemented: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export default function Controls() {
  const [controls, setControls] = useState([]);
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ framework: "", status: "" });
  const [selectedControl, setSelectedControl] = useState(null);

  useEffect(() => {
    Promise.all([getControls(), getControlsLibrary()])
      .then(([c, lib]) => { setControls(c); setLibrary(lib); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const filtered = (controls || []).filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.framework?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.framework && c.framework !== filters.framework) return false;
    if (filters.status && c.status !== filters.status) return false;
    return true;
  });

  if (loading) return <div className="p-6 text-gray-500">Loading controls...</div>;

  const filterConfig = [
    { key: "framework", placeholder: "All Frameworks", value: filters.framework, options: [
      { value: "ISO 27001", label: "ISO 27001" }, { value: "SOC 2", label: "SOC 2" },
      { value: "PCI DSS", label: "PCI DSS" }, { value: "GDPR", label: "GDPR" },
      { value: "HIPAA", label: "HIPAA" }, { value: "NIST", label: "NIST" },
    ]},
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" },
      { value: "not_implemented", label: "Not Implemented" },
    ]},
  ];

  const statusColors = { active: "#22c55e", inactive: "#6b7280", not_implemented: "#ef4444" };
  const libStatusData = library ? Object.entries(library.statusDistribution || {}).map(([name, value]) => ({ name, value, color: statusColors[name] || "#6b7280" })) : [];

  if (selectedControl) {
    return (
      <div className="space-y-6 max-w-4xl">
        <button onClick={() => setSelectedControl(null)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">← Back to Controls</button>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={selectedControl.status} />
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">{selectedControl.framework}</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">{selectedControl.name}</h2>
              <p className="text-xs text-gray-500 mt-1">ID: {selectedControl.controlId} | Owner: {selectedControl.owner}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{selectedControl.description}</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Last Tested</p>
              <p className="text-sm font-medium text-gray-900">{selectedControl.lastTested ? formatDate(selectedControl.lastTested) : "Never"}</p>
            </div>
            {selectedControl.testingFrequency && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Testing Frequency</p>
                <p className="text-sm font-medium text-gray-900">{selectedControl.testingFrequency}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-1">Evidence</p>
              {selectedControl.evidenceCount > 0 ? (
                <p className="text-sm font-medium text-gray-900">{selectedControl.evidenceCount} item(s)</p>
              ) : (
                <p className="text-sm text-gray-400">No evidence attached</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Controls</h1>
        <p className="text-sm text-gray-500 mt-1">Control library and effectiveness monitoring</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Controls" value={library?.total || controls.length} icon={Shield} />
        <StatsCard title="Active" value={library?.statusDistribution?.active || 0} icon={CheckCircle} trend="up" change={5} />
        <StatsCard title="Inactive" value={library?.statusDistribution?.inactive || 0} icon={Clock} />
        <StatsCard title="Not Implemented" value={library?.statusDistribution?.not_implemented || 0} icon={AlertTriangle} trend="down" change={0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={libStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {libStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Controls Library</h3>
          <FilterBar search={search} onSearchChange={setSearch} filters={filterConfig} onFilterChange={updateFilter} />
          <DataTable
            columns={[
              { key: "name", label: "Control", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
              { key: "controlId", label: "Control ID", render: (v) => <span className="font-mono text-xs text-gray-500">{v}</span> },
              { key: "framework", label: "Framework", render: (v) => <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">{v}</span> },
              { key: "owner", label: "Owner" },
              { key: "lastTested", label: "Last Tested", render: (v) => v ? formatDate(v) : <span className="text-gray-400">Never</span> },
              { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            ]}
            onRowClick={(row) => setSelectedControl(row)}
            data={filtered}
          />
        </div>
      </div>
    </div>
  );
}
