import { useState, useEffect } from "react";
import { getRisks, getRiskRegister, updateRisk } from "../../service/complyService";
import { AlertTriangle, TrendingUp, Target, Shield, ArrowUpCircle } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

// ==========================================
// INTERNAL MOCKED COMPONENTS (NO DEPENDENCIES)
// ==========================================

const StatsCard = ({ title, value, icon: Icon, trend, change }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      {change !== undefined && change !== 0 && (
        <span className={`text-xs font-medium mt-1 inline-block ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {change}%
        </span>
      )}
    </div>
    {Icon && (
      <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-400">
        <Icon size={20} />
      </div>
    )}
  </div>
);

const DataTable = ({ columns = [], data = [], onRowClick }) => (
  <div className="overflow-x-auto w-full border border-gray-100 rounded-lg">
    <table className="w-full text-left border-collapse text-sm">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
          {columns.map((col, idx) => (
            <th key={idx} className="p-3">{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((row, rIdx) => (
            <tr 
              key={rIdx} 
              onClick={() => onRowClick && onRowClick(row)}
              className={`border-b border-gray-100 hover:bg-gray-50 text-gray-700 ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col, cIdx) => (
                <td key={cIdx} className="p-3">
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? "-"}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="p-8 text-center text-gray-400">
              No risks identified yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const FilterBar = ({ search, onSearchChange, filters = [], onFilterChange }) => (
  <div className="flex flex-col sm:flex-row gap-3 mb-4 items-center justify-between">
    <div className="relative w-full sm:w-72">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-4 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
      />
    </div>
    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
      {filters.map((f) => (
        <select
          key={f.key}
          value={f.value}
          onChange={(e) => onFilterChange(f.key, e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:border-blue-500"
        >
          <option value="">{f.placeholder}</option>
          {f.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const normalized = String(status).toLowerCase();
  const badgeStyles = {
    critical: "bg-red-100 text-red-800 border-red-200 font-semibold",
    high: "bg-red-50 text-red-700 border-red-100",
    medium: "bg-orange-50 text-orange-700 border-orange-100",
    low: "bg-green-50 text-green-700 border-green-100",
    identified: "bg-blue-50 text-blue-700 border-blue-100",
    assessed: "bg-purple-50 text-purple-700 border-purple-100",
    mitigated: "bg-emerald-50 text-emerald-700 border-emerald-100",
    monitored: "bg-cyan-50 text-cyan-700 border-cyan-100",
    closed: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const style = badgeStyles[normalized] || "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${style}`}>
      {normalized.replace("_", " ")}
    </span>
  );
};

// ==========================================
// MAIN MODULE EXPORT
// ==========================================

export default function RiskManagement() {
  const [risks, setRisks] = useState([]);
  const [register, setRegister] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "", status: "" });
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState("");

  useEffect(() => {
    Promise.all([getRisks(), getRiskRegister()])
      .then(([r, reg]) => { setRisks(r); setRegister(reg); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const filtered = (risks || []).filter(r => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.owner?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.category && r.category !== filters.category) return false;
    if (filters.status && r.status !== filters.status) return false;
    return true;
  });

  const handleAddTreatment = () => {
    if (!treatmentPlan.trim() || !selectedRisk) return;
    updateRisk(selectedRisk.id, { treatmentPlan });
    setSelectedRisk(prev => ({ ...prev, treatmentPlan }));
    setTreatmentPlan("");
  };

  if (loading) return <div className="p-6 text-gray-500">Loading risk data...</div>;

  const filterConfig = [
    { key: "category", placeholder: "All Categories", value: filters.category, options: [
      { value: "strategic", label: "Strategic" }, { value: "operational", label: "Operational" },
      { value: "financial", label: "Financial" }, { value: "compliance", label: "Compliance" },
      { value: "reputational", label: "Reputational" },
    ]},
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "identified", label: "Identified" }, { value: "assessed", label: "Assessed" },
      { value: "mitigated", label: "Mitigated" }, { value: "monitored", label: "Monitored" },
      { value: "closed", label: "Closed" },
    ]},
  ];

  const severityColors = {
    critical: "#ef4444", high: "#f97316", medium: "#eab308", low: "#22c55e",
  };

  const riskDistData = register ? Object.entries(register.severityDistribution || {}).map(([name, value]) => ({ name, value, color: severityColors[name] || "#6b7280" })) : [];

  if (selectedRisk) {
    return (
      <div className="space-y-6 max-w-4xl">
        <button onClick={() => setSelectedRisk(null)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">← Back to Risk Register</button>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={selectedRisk.severity} />
                <StatusBadge status={selectedRisk.status} />
                <StatusBadge status={selectedRisk.category} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">{selectedRisk.title}</h2>
              <p className="text-xs text-gray-500 mt-1">Score: {selectedRisk.score} | Owner: {selectedRisk.owner || "Unassigned"}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{selectedRisk.description}</p>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Likelihood</p>
              <p className="font-medium text-gray-900">{selectedRisk.likelihood || "N/A"}/5</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Impact</p>
              <p className="font-medium text-gray-900">{selectedRisk.impact || "N/A"}/5</p>
            </div>
          </div>
          {selectedRisk.mitigation && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Current Mitigation</p>
              <p className="text-sm text-gray-700">{selectedRisk.mitigation}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Treatment Plan</h3>
          {selectedRisk.treatmentPlan ? (
            <div className="p-3 bg-blue-50 rounded-lg mb-4">
              <p className="text-sm text-blue-800">{selectedRisk.treatmentPlan}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-3">No treatment plan defined yet.</p>
          )}
          <div className="flex gap-2">
            <input type="text" value={treatmentPlan} onChange={e => setTreatmentPlan(e.target.value)} placeholder="Add treatment plan..." className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" onKeyDown={e => { if (e.key === "Enter") handleAddTreatment(); }} />
            <button onClick={handleAddTreatment} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"><ArrowUpCircle className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Risk Management</h1>
        <p className="text-sm text-gray-500 mt-1">Identify, assess, and mitigate compliance risks</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Risks" value={register?.total || risks.length} icon={AlertTriangle} />
        <StatsCard title="Critical" value={register?.severityDistribution?.critical || 0} icon={Target} trend="down" change={0} />
        <StatsCard title="High" value={register?.severityDistribution?.high || 0} icon={TrendingUp} />
        <StatsCard title="Mitigated" value={risks.filter(r => ["mitigated", "monitored", "closed"].includes(r.status)).length} icon={Shield} trend="up" change={8} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={riskDistData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {riskDistData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Risk Register</h3>
          <FilterBar search={search} onSearchChange={setSearch} filters={filterConfig} onFilterChange={updateFilter} />
          <DataTable
            columns={[
              { key: "title", label: "Risk", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
              { key: "category", label: "Category", render: (v) => <StatusBadge status={v} /> },
              { key: "score", label: "Score", render: (v, r) => <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${v >= 15 ? "bg-red-100 text-red-700" : v >= 10 ? "bg-orange-100 text-orange-700" : v >= 5 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{v}</span> },
              { key: "owner", label: "Owner" },
              { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            ]}
            onRowClick={(row) => setSelectedRisk(row)}
            data={filtered}
          />
        </div>
      </div>
    </div>
  );
}