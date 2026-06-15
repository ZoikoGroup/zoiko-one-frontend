import { useState } from "react";
import { Plus, Download, Trash2 } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useEmployeeDocuments } from "../hooks/useDocuments";
import { formatDate } from "../utils/helpers";

export default function EmployeeDocuments() {
  const { data: docs, loading } = useEmployeeDocuments();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const filtered = docs.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.employee.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: "name", label: "Document", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "employee", label: "Employee" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "uploadedDate", label: "Uploaded", render: (v) => formatDate(v) },
    { key: "size", label: "Size" },
    { key: "actions", label: "", render: () => (
      <div className="flex gap-2">
        <button className="text-xs text-purple-600 hover:text-purple-800"><Download className="w-3.5 h-3.5" /></button>
        <button className="text-xs text-red-600 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Documents</h1>
          <p className="text-sm text-gray-500 mt-1">{docs.length} employee documents</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <FilterBar search={search} onSearchChange={setSearch}
        filters={[{ key: "status", value: statusFilter, placeholder: "All Statuses", options: [
          { value: "approved", label: "Approved" }, { value: "pending_approval", label: "Pending" },
          { value: "draft", label: "Draft" }, { value: "rejected", label: "Rejected" },
        ]}]}
        onFilterChange={(key, val) => setStatusFilter(val)}
      />

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
