import { useState } from "react";
import { useCustomReports } from "../hooks/useInsights.js";
import StatsCard from "../components/StatsCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import DataTable from "../components/DataTable.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatDate } from "../utils/helpers.js";
import { CHART_COLORS } from "../types/index.js";
import { FileText, Download, Eye, Calendar, Plus, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function CustomReports() {
  const { data, loading } = useCustomReports();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ type: "", format: "", status: "" });

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { templates, reportTypes } = data;

  const stats = [
    { title: "Total Templates", value: templates.length, change: 4, trend: "up", icon: FileText, subtitle: `${templates.filter(t => t.status === "active").length} active` },
    { title: "Report Types", value: reportTypes.length, change: 0, trend: "stable", icon: BarChart3, subtitle: "Categories" },
    { title: "Active Reports", value: templates.filter(t => t.status === "active").length, change: 3, trend: "up", icon: Eye, subtitle: "Scheduled + ad-hoc" },
    { title: "Archived", value: templates.filter(t => t.status === "archived").length, change: -1, trend: "down", icon: Calendar, subtitle: "Inactive templates" },
  ];

  const columns = [
    { key: "name", label: "Report Name", render: (v, r) => <div><span className="font-medium">{v}</span><div className="text-xs text-gray-400">{r.type} &middot; {r.category}</div></div> },
    { key: "format", label: "Format", render: (v) => <StatusBadge status={v} /> },
    { key: "frequency", label: "Frequency", render: (v) => <StatusBadge status={v} /> },
    { key: "lastGenerated", label: "Last Generated", render: (v) => formatDate(v) },
    { key: "createdBy", label: "Created By" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  let filtered = [...templates];
  if (search) filtered = filtered.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
  if (filters.type) filtered = filtered.filter(r => r.type === filters.type);
  if (filters.format) filtered = filtered.filter(r => r.format === filters.format);
  if (filters.status) filtered = filtered.filter(r => r.status === filters.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Create, manage and schedule custom report templates</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          New Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Reports by Type</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={reportTypes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill={CHART_COLORS.primary} barSize={16} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {["Financial", "Workforce", "Compliance", "Project", "Inventory", "Payroll"].map(type => (
              <button
                key={type}
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left"
              >
                <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{type}</p>
                  <p className="text-xs text-gray-500">Generate report</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Report Templates</h3>
        </div>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          filters={[
            { key: "type", placeholder: "All Types", value: filters.type, options: ["Financial", "Workforce", "Compliance", "Project", "Inventory", "Payroll"].map(t => ({ value: t, label: t })) },
            { key: "format", placeholder: "All Formats", value: filters.format, options: ["pdf", "excel", "csv"].map(f => ({ value: f, label: f.toUpperCase() })) },
            { key: "status", placeholder: "All Statuses", value: filters.status, options: [{ value: "active", label: "Active" }, { value: "archived", label: "Archived" }] },
          ]}
          onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        />
        <DataTable columns={columns} data={filtered} />
      </div>
    </div>
  );
}
