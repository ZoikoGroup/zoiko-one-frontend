import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useControls } from "../hooks/useComply";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import FilterBar from "../components/FilterBar";
import StatusBadge from "../components/StatusBadge";
import { Shield, CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

export default function ControlsLibrary() {
  const { data: controls, summary, loading } = useControls();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "", status: "", effectiveness: "", frequency: "" });

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const filtered = (controls || []).filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase()) && !c.owner.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.category && c.category !== filters.category) return false;
    if (filters.status && c.status !== filters.status) return false;
    if (filters.effectiveness && c.effectiveness !== filters.effectiveness) return false;
    if (filters.frequency && c.frequency !== filters.frequency) return false;
    return true;
  });

  if (loading) return <div className="p-6 text-gray-500">Loading controls library...</div>;

  const filterConfig = [
    { key: "category", placeholder: "All Categories", value: filters.category, options: [
      { value: "preventive", label: "Preventive" }, { value: "detective", label: "Detective" },
      { value: "corrective", label: "Corrective" }, { value: "directive", label: "Directive" },
    ]},
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "operating", label: "Operating" }, { value: "implemented", label: "Implemented" },
      { value: "not_operating", label: "Not Operating" }, { value: "remediating", label: "Remediating" },
      { value: "not_applicable", label: "N/A" },
    ]},
    { key: "effectiveness", placeholder: "All Effectiveness", value: filters.effectiveness, options: [
      { value: "effective", label: "Effective" }, { value: "partially_effective", label: "Partially Effective" },
      { value: "not_effective", label: "Not Effective" }, { value: "not_tested", label: "Not Tested" },
    ]},
    { key: "frequency", placeholder: "All Frequencies", value: filters.frequency, options: [
      { value: "monthly", label: "Monthly" }, { value: "quarterly", label: "Quarterly" },
      { value: "annually", label: "Annually" }, { value: "weekly", label: "Weekly" },
    ]},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Controls Library</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and monitor internal controls framework</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Controls" value={summary?.total || 120} icon={Shield} />
        <StatsCard title="Operating" value={summary?.byStatus?.operating || 0} icon={CheckCircle} trend="up" change={2} />
        <StatsCard title="Partially Effective" value={summary?.byEffectiveness?.partially_effective || 0} icon={AlertTriangle} />
        <StatsCard title="Not Effective" value={summary?.byEffectiveness?.not_effective || 0} icon={XCircle} trend="down" change={-5} />
        <StatsCard title="Not Tested" value={summary?.byEffectiveness?.not_tested || 0} icon={HelpCircle} />
      </div>

      <FilterBar search={search} onSearchChange={setSearch} filters={filterConfig} onFilterChange={updateFilter} />

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={[
            { key: "code", label: "Control ID", render: (v) => <span className="font-mono text-sm font-medium text-gray-900">{v}</span> },
            { key: "title", label: "Control Title", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
            { key: "category", label: "Category", render: (v) => <StatusBadge status={v} /> },
            { key: "owner", label: "Owner" },
            { key: "frequency", label: "Frequency", render: (v) => <StatusBadge status={v} /> },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            { key: "effectiveness", label: "Effectiveness", render: (v) => <StatusBadge status={v} /> },
          ]}
          onRowClick={(row) => navigate(`/comply/controls/${row.id}`)}
          data={filtered}
        />
      </div>
    </div>
  );
}
