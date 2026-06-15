import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useCandidates } from "../hooks/useRecruitment";
import { formatDate, daysSince } from "../utils/helpers";

export default function Candidates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { data: candidates, loading } = useCandidates({ search, status: statusFilter });

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const columns = [
    { key: "name", label: "Name", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "email", label: "Email" },
    { key: "position", label: "Position" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "appliedDate", label: "Applied", render: (v) => `${daysSince(v)}d ago` },
    { key: "source", label: "Source" },
    { key: "actions", label: "", render: (v, r) => (
      <button onClick={(e) => { e.stopPropagation(); navigate(`/zoiko-hr/recruitment/candidates/${r.id}`); }} className="text-xs text-orange-600 hover:text-orange-800 font-medium">View</button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-sm text-gray-500 mt-1">{candidates.length} total candidates</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Candidate
        </button>
      </div>

      <FilterBar
        search={search} onSearchChange={setSearch}
        filters={[
          { key: "status", value: statusFilter, placeholder: "All Statuses", options: [
            { value: "new", label: "New" }, { value: "screening", label: "Screening" },
            { value: "interviewed", label: "Interviewed" }, { value: "offered", label: "Offered" },
            { value: "hired", label: "Hired" }, { value: "rejected", label: "Rejected" },
          ]},
        ]}
        onFilterChange={(key, val) => setStatusFilter(val)}
      />

      <DataTable columns={columns} data={candidates} onRowClick={(row) => navigate(`/zoiko-hr/recruitment/candidates/${row.id}`)} />
    </div>
  );
}
