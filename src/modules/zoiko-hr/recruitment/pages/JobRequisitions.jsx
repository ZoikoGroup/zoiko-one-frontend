import { useState } from "react";
import { Plus } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useJobRequisitions } from "../hooks/useRecruitment";
import { formatDate } from "../utils/helpers";

export default function JobRequisitions() {
  const { data: jobs, loading } = useJobRequisitions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const filtered = jobs.filter((j) => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: "title", label: "Position", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "department", label: "Department" },
    { key: "location", label: "Location" },
    { key: "openings", label: "Openings", render: (v, r) => `${r.filled}/${v} filled` },
    { key: "priority", label: "Priority", render: (v) => <StatusBadge status={v} /> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "createdDate", label: "Created", render: (v) => formatDate(v) },
    { key: "actions", label: "", render: (v, r) => (
      <div className="flex gap-2">
        <button className="text-xs text-orange-600 hover:text-orange-800 font-medium">Edit</button>
        <button className="text-xs text-red-600 hover:text-red-800 font-medium">Close</button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Requisitions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage job openings and hiring requests</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> New Requisition
        </button>
      </div>

      <FilterBar
        search={search} onSearchChange={setSearch}
        filters={[
          { key: "status", value: statusFilter, placeholder: "All Statuses", options: [
            { value: "open", label: "Open" }, { value: "closed", label: "Closed" },
            { value: "draft", label: "Draft" }, { value: "on_hold", label: "On Hold" },
          ]},
        ]}
        onFilterChange={(key, val) => setStatusFilter(val)}
      />

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
