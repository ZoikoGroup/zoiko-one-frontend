import { useState } from "react";
import { useObligations } from "../hooks/useComply";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import StatusBadge from "../components/StatusBadge";
import { formatDate, daysUntil } from "../utils/helpers";
import { AlertTriangle, CalendarDays, CheckCircle, Clock, FileText } from "lucide-react";

export default function Obligations() {
  const { data: obligations, summary, loading } = useObligations();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "", status: "", riskLevel: "" });
  const [view, setView] = useState("table");

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const filtered = (obligations || []).filter(o => {
    if (search && !o.title.toLowerCase().includes(search.toLowerCase()) && !o.owner.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.category && o.category !== filters.category) return false;
    if (filters.status && o.status !== filters.status) return false;
    if (filters.riskLevel && o.riskLevel !== filters.riskLevel) return false;
    return true;
  });

  if (loading) return <div className="p-6 text-gray-500">Loading obligations...</div>;

  const filterConfig = [
    { key: "category", placeholder: "All Categories", value: filters.category, options: [
      { value: "regulatory", label: "Regulatory" }, { value: "legal", label: "Legal" },
      { value: "contractual", label: "Contractual" }, { value: "internal", label: "Internal" },
      { value: "industry", label: "Industry" },
    ]},
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "active", label: "Active" }, { value: "pending", label: "Pending" },
      { value: "overdue", label: "Overdue" }, { value: "completed", label: "Completed" },
    ]},
    { key: "riskLevel", placeholder: "All Risk Levels", value: filters.riskLevel, options: [
      { value: "critical", label: "Critical" }, { value: "high", label: "High" },
      { value: "medium", label: "Medium" }, { value: "low", label: "Low" },
    ]},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Obligations</h1>
        <p className="text-sm text-gray-500 mt-1">Track regulatory, legal, contractual, and internal compliance obligations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Obligations" value={summary?.totalObligations || 100} icon={FileText} />
        <StatsCard title="Active" value={obligations.filter(o => o.status === "active").length} icon={Clock} trend="up" change={5} />
        <StatsCard title="Overdue" value={obligations.filter(o => o.status === "overdue").length} icon={AlertTriangle} trend="down" change={-20} />
        <StatsCard title="Due Soon (30 days)" value={obligations.filter(o => { const d = daysUntil(o.dueDate); return d !== null && d >= 0 && d <= 30; }).length} icon={CalendarDays} trend="up" change={12} />
        <StatsCard title="Completed" value={summary?.completedObligations || 210} icon={CheckCircle} trend="up" change={8} />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => setView("table")} className={`px-3 py-1.5 text-sm rounded-lg ${view === "table" ? "bg-emerald-100 text-emerald-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Table</button>
        <button onClick={() => setView("calendar")} className={`px-3 py-1.5 text-sm rounded-lg ${view === "calendar" ? "bg-emerald-100 text-emerald-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Calendar</button>
        <button onClick={() => setView("kanban")} className={`px-3 py-1.5 text-sm rounded-lg ${view === "kanban" ? "bg-emerald-100 text-emerald-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Kanban</button>
      </div>

      <FilterBar search={search} onSearchChange={setSearch} filters={filterConfig} onFilterChange={updateFilter} />

      {view === "table" && (
        <div className="bg-white rounded-xl border border-gray-200">
          <DataTable
            columns={[
              { key: "title", label: "Obligation", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
              { key: "category", label: "Category", render: (v) => <StatusBadge status={v} /> },
              { key: "owner", label: "Owner" },
              { key: "dueDate", label: "Due Date", render: (v) => {
                const d = daysUntil(v);
                return <span className={d !== null && d < 0 ? "text-red-600 font-medium" : ""}>{formatDate(v)}{d !== null && d >= 0 && d <= 7 ? <span className="ml-1 text-xs text-red-500">({d}d)</span> : ""}</span>;
              }},
              { key: "riskLevel", label: "Risk", render: (v) => <StatusBadge status={v} /> },
              { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            ]}
            data={filtered}
          />
        </div>
      )}

      {view === "calendar" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.filter(o => o.status !== "completed").sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).map(o => (
              <div key={o.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <StatusBadge status={o.status} />
                  <StatusBadge status={o.riskLevel} />
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{o.title}</h4>
                <p className="text-xs text-gray-500 mb-2">Owner: {o.owner}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{formatDate(o.dueDate)}</span>
                  <span className={daysUntil(o.dueDate) !== null && daysUntil(o.dueDate) < 0 ? "text-red-500 font-medium" : "text-gray-500"}>
                    {daysUntil(o.dueDate) !== null ? (daysUntil(o.dueDate) < 0 ? `${Math.abs(daysUntil(o.dueDate))}d overdue` : `${daysUntil(o.dueDate)}d remaining`) : "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "kanban" && (
        <div className="grid gap-4 sm:grid-cols-3">
          {["active", "pending", "overdue"].map(status => (
            <div key={status} className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 capitalize mb-3 flex items-center gap-2">
                <StatusBadge status={status} />
                <span className="text-xs text-gray-400">({filtered.filter(o => o.status === status).length})</span>
              </h3>
              <div className="space-y-3">
                {filtered.filter(o => o.status === status).map(o => (
                  <div key={o.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-1">
                      <StatusBadge status={o.riskLevel} />
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{o.title}</h4>
                    <p className="text-xs text-gray-500">{o.owner}</p>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <StatusBadge status={o.category} />
                      <span className="text-gray-400">{formatDate(o.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
