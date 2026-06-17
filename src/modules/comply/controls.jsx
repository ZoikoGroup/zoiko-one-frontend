import { useState, useEffect } from "react";
import { getControls, getControlsLibrary, getControlById } from "../../service/complyService";
import StatsCard from "../../components/comply/StatsCard";
import DataTable from "../../components/comply/DataTable";
import FilterBar from "../../components/comply/FilterBar";
import StatusBadge from "../../components/comply/StatusBadge";
import { formatDate } from "../../components/comply/helpers";
import { Shield, CheckCircle, AlertTriangle, Clock, Activity, Target } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

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
