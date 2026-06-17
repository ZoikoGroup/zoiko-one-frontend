import { useState, useEffect } from "react";
import { getCustomReportsData, getSavedReportsData } from "../../service/insightsService";
import StatsCard from "../../components/insights/StatsCard";
import FilterBar from "../../components/insights/FilterBar";
import DataTable from "../../components/insights/DataTable";
import StatusBadge from "../../components/insights/StatusBadge";
import { formatDate } from "../../components/insights/helpers";
import { CHART_COLORS } from "../../components/insights/chartColors";
import { FileText, Plus, BarChart3, Star, Clock, Download, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const tabs = [
  { id: "custom", label: "Custom Reports" },
  { id: "saved", label: "Saved Reports" },
];

export default function Reports({ defaultTab = "custom" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [customData, setCustomData] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ type: "", format: "", status: "" });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCustomReportsData().then(setCustomData).catch(() => {}),
      getSavedReportsData().then(setSavedData).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Create, manage and view report templates and generated reports</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab === "custom" && customData && <CustomReportsContent data={customData} search={search} onSearchChange={setSearch} filters={filters} onFilterChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))} />}
      {activeTab === "saved" && savedData && <SavedReportsContent data={savedData} search={search} onSearchChange={setSearch} filters={filters} onFilterChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))} />}
    </div>
  );
}

function CustomReportsContent({ data, search, onSearchChange, filters, onFilterChange }) {
  const { templates, reportTypes } = data;

  const stats = [
    { title: "Total Templates", value: templates.length, change: 4, trend: "up", icon: FileText, subtitle: `${templates.filter(t => t.status === "active").length} active` },
    { title: "Report Types", value: reportTypes.length, change: 0, trend: "stable", icon: BarChart3, subtitle: "Categories" },
    { title: "Active Reports", value: templates.filter(t => t.status === "active").length, change: 3, trend: "up", icon: Eye, subtitle: "Scheduled + ad-hoc" },
    { title: "Archived", value: templates.filter(t => t.status === "archived").length, change: -1, trend: "down", icon: Clock, subtitle: "Inactive templates" },
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
          <h3 className="text-lg font-semibold text-gray-900">Custom Reports</h3>
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
              <button key={type} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left">
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
          onSearchChange={onSearchChange}
          filters={[
            { key: "type", placeholder: "All Types", value: filters.type, options: ["Financial", "Workforce", "Compliance", "Project", "Inventory", "Payroll"].map(t => ({ value: t, label: t })) },
            { key: "format", placeholder: "All Formats", value: filters.format, options: ["pdf", "excel", "csv"].map(f => ({ value: f, label: f.toUpperCase() })) },
            { key: "status", placeholder: "All Statuses", value: filters.status, options: [{ value: "active", label: "Active" }, { value: "archived", label: "Archived" }] },
          ]}
          onFilterChange={onFilterChange}
        />
        <DataTable columns={columns} data={filtered} />
      </div>
    </div>
  );
}

function SavedReportsContent({ data, search, onSearchChange, filters, onFilterChange }) {
  const { reports, recentGenerations } = data;

  const stats = [
    { title: "Saved Reports", value: reports.length, change: 3, trend: "up", icon: FileText, subtitle: `${reports.filter(r => r.starred).length} starred` },
    { title: "Starred", value: reports.filter(r => r.starred).length, change: 1, trend: "up", icon: Star, subtitle: "Favorites" },
    { title: "Scheduled", value: reports.filter(r => r.frequency !== "One-time").length, change: 2, trend: "up", icon: Clock, subtitle: "Auto-generated" },
    { title: "Recent (30d)", value: recentGenerations.length, change: 5, trend: "up", icon: Eye, subtitle: "Last 30 days" },
  ];

  const columns = [
    { key: "name", label: "Report", render: (v, r) => (
      <div className="flex items-center gap-2">
        {r.starred && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
        <div>
          <span className="font-medium">{v}</span>
          <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
            <span>{r.type}</span>
            {r.tags.map((t, i) => <span key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{t}</span>)}
          </div>
        </div>
      </div>
    )},
    { key: "format", label: "Format", render: (v) => <StatusBadge status={v} /> },
    { key: "generatedAt", label: "Generated", render: (v) => formatDate(v) },
    { key: "generatedBy", label: "By" },
    { key: "size", label: "Size" },
    { key: "frequency", label: "Frequency" },
    { key: "lastViewed", label: "Last Viewed", render: (v) => formatDate(v) },
  ];

  let filtered = [...reports];
  if (search) filtered = filtered.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
  if (filters.type) filtered = filtered.filter(r => r.type === filters.type);
  if (filters.format) filtered = filtered.filter(r => r.format === filters.format);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Saved Reports</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Generations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentGenerations.map(r => (
            <div key={r.id} className="border border-gray-100 rounded-lg p-3 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{r.name}</span>
                <StatusBadge status={r.format} />
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(r.generatedAt)}</span>
                <span>{r.size}</span>
                {r.scheduled && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">Scheduled</span>}
              </div>
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-50">
                <button className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"><Eye className="w-3 h-3" /> Preview</button>
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"><Download className="w-3 h-3" /> Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">All Saved Reports</h3>
        </div>
        <FilterBar
          search={search}
          onSearchChange={onSearchChange}
          filters={[
            { key: "type", placeholder: "All Types", value: filters.type, options: ["Financial", "Workforce", "Compliance", "Project", "Inventory", "Payroll"].map(t => ({ value: t, label: t })) },
            { key: "format", placeholder: "All Formats", value: filters.format, options: ["pdf", "excel", "csv"].map(f => ({ value: f, label: f.toUpperCase() })) },
          ]}
          onFilterChange={onFilterChange}
        />
        <DataTable columns={columns} data={filtered} />
      </div>
    </div>
  );
}
