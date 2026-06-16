import { useState } from "react";
import { useRisks } from "../hooks/useComply";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import StatusBadge from "../components/StatusBadge";
import { riskScoreColor } from "../utils/helpers";
import { AlertTriangle, Shield, Target, TrendingUp, Gauge } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function RiskRegister() {
  const { data: risks, summary, loading } = useRisks();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", category: "" });
  const [view, setView] = useState("table");

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const filtered = (risks || []).filter(r => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.owner.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.category && r.category !== filters.category) return false;
    return true;
  });

  if (loading) return <div className="p-6 text-gray-500">Loading risk register...</div>;

  const filterConfig = [
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "identified", label: "Identified" }, { value: "assessed", label: "Assessed" },
      { value: "mitigating", label: "Mitigating" }, { value: "accepted", label: "Accepted" },
      { value: "transferred", label: "Transferred" },
    ]},
    { key: "category", placeholder: "All Categories", value: filters.category, options: [
      { value: "security", label: "Security" }, { value: "operational", label: "Operational" },
      { value: "regulatory", label: "Regulatory" }, { value: "financial", label: "Financial" },
      { value: "legal", label: "Legal" }, { value: "strategic", label: "Strategic" },
      { value: "reputational", label: "Reputational" }, { value: "third_party", label: "Third Party" },
    ]},
  ];

  const heatmapData = [];
  for (let p = 1; p <= 5; p++) {
    for (let i = 1; i <= 5; i++) {
      const count = risks.filter(r => r.probability === p && r.impact === i).length;
      const score = p * i;
      heatmapData.push({ probability: p, impact: i, score, count });
    }
  }

  const riskLevelData = summary ? [
    { name: "Critical (15-25)", value: summary.byLevel.critical, color: "#ef4444" },
    { name: "High (10-14)", value: summary.byLevel.high, color: "#f97316" },
    { name: "Medium (5-9)", value: summary.byLevel.medium, color: "#eab308" },
    { name: "Low (1-4)", value: summary.byLevel.low, color: "#22c55e" },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Risk Register</h1>
        <p className="text-sm text-gray-500 mt-1">Identify, assess, and manage enterprise risks</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Risks" value={summary?.total || 75} icon={AlertTriangle} />
        <StatsCard title="Critical" value={summary?.byLevel?.critical || 0} icon={Target} trend="up" change={10} />
        <StatsCard title="High" value={summary?.byLevel?.high || 0} icon={TrendingUp} />
        <StatsCard title="Medium" value={summary?.byLevel?.medium || 0} icon={Shield} />
        <StatsCard title="Low" value={summary?.byLevel?.low || 0} icon={Gauge} />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => setView("table")} className={`px-3 py-1.5 text-sm rounded-lg ${view === "table" ? "bg-emerald-100 text-emerald-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Table</button>
        <button onClick={() => setView("heatmap")} className={`px-3 py-1.5 text-sm rounded-lg ${view === "heatmap" ? "bg-emerald-100 text-emerald-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Heat Map</button>
        <button onClick={() => setView("dashboard")} className={`px-3 py-1.5 text-sm rounded-lg ${view === "dashboard" ? "bg-emerald-100 text-emerald-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Dashboard</button>
      </div>

      <FilterBar search={search} onSearchChange={setSearch} filters={filterConfig} onFilterChange={updateFilter} />

      {view === "table" && (
        <div className="bg-white rounded-xl border border-gray-200">
          <DataTable
            columns={[
              { key: "title", label: "Risk", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
              { key: "category", label: "Category", render: (v) => <StatusBadge status={v} /> },
              { key: "probability", label: "Prob", render: (v) => <span className="text-sm">{v}/5</span> },
              { key: "impact", label: "Impact", render: (v) => <span className="text-sm">{v}/5</span> },
              { key: "score", label: "Score", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${riskScoreColor(v)}`}>{v}</span> },
              { key: "owner", label: "Owner" },
              { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            ]}
            data={filtered}
          />
        </div>
      )}

      {view === "heatmap" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Risk Heat Map</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-xs text-gray-500 font-medium text-center">Impact ↓ / Probability →</th>
                  {[1, 2, 3, 4, 5].map(p => <th key={p} className="p-2 text-xs text-gray-500 font-medium text-center w-20">Very Low ({p})</th>)}
                </tr>
              </thead>
              <tbody>
                {[5, 4, 3, 2, 1].map(i => (
                  <tr key={i}>
                    <td className="p-2 text-xs text-gray-500 font-medium text-center whitespace-nowrap">{i === 5 ? "Very High (5)" : i === 4 ? "High (4)" : i === 3 ? "Medium (3)" : i === 2 ? "Low (2)" : "Very Low (1)"}</td>
                    {[1, 2, 3, 4, 5].map(p => {
                      const cell = heatmapData.find(d => d.probability === p && d.impact === i);
                      const score = cell ? cell.score : p * i;
                      const count = cell ? cell.count : 0;
                      let bgColor = "bg-gray-100";
                      if (score >= 15) bgColor = "bg-red-500";
                      else if (score >= 10) bgColor = "bg-orange-400";
                      else if (score >= 5) bgColor = "bg-yellow-300";
                      else bgColor = "bg-emerald-200";
                      return <td key={p} className={`p-3 text-center ${bgColor} ${score >= 10 ? "text-white" : "text-gray-700"}`}>
                        <span className="font-bold text-sm">{count}</span>
                        <span className="block text-xs opacity-75">{score}</span>
                      </td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-200" /> Low (1-4)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-300" /> Medium (5-9)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-400" /> High (10-14)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /> Critical (15-25)</span>
          </div>
        </div>
      )}

      {view === "dashboard" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Risk Distribution by Level</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={riskLevelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                  {riskLevelData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Risk Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: "Identified", value: summary?.byStatus?.identified || 0 },
                { name: "Assessed", value: summary?.byStatus?.assessed || 0 },
                { name: "Mitigating", value: summary?.byStatus?.mitigating || 0 },
                { name: "Accepted", value: summary?.byStatus?.accepted || 0 },
                { name: "Transferred", value: summary?.byStatus?.transferred || 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Top 10 Risks by Score</h3>
            <DataTable
              columns={[
                { key: "title", label: "Risk", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
                { key: "category", label: "Category", render: (v) => <StatusBadge status={v} /> },
                { key: "score", label: "Score", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${riskScoreColor(v)}`}>{v}</span> },
                { key: "owner", label: "Owner" },
                { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
              ]}
              data={[...risks].sort((a, b) => b.score - a.score).slice(0, 10)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
