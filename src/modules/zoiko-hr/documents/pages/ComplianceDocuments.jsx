import { useState } from "react";
import { Plus, Shield } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useComplianceDocuments } from "../hooks/useDocuments";
import { formatDate } from "../utils/helpers";

export default function ComplianceDocuments() {
  const { data: docs, loading } = useComplianceDocuments();
  const [filter, setFilter] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const filtered = filter ? docs.filter((d) => d.regulation === filter) : docs;

  const regulations = [...new Set(docs.map((d) => d.regulation))];

  const columns = [
    { key: "name", label: "Document", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "regulation", label: "Regulation" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "expiryDate", label: "Expiry", render: (v) => v ? <span className={new Date(v) < new Date() ? "text-red-600 font-medium" : ""}>{formatDate(v)}</span> : "-" },
    { key: "owner", label: "Owner" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Regulatory and compliance documentation</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Upload Compliance Doc
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setFilter("")} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${!filter ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"}`}>All</button>
        {regulations.map((r) => (
          <button key={r} onClick={() => setFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === r ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{r}</button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
