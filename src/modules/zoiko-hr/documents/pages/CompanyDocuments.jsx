import { useState } from "react";
import { Plus, Download, FileText } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { useCompanyDocuments } from "../hooks/useDocuments";
import { formatDate } from "../utils/helpers";

export default function CompanyDocuments() {
  const { data: docs, loading } = useCompanyDocuments();
  const [search, setSearch] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const filtered = search
    ? docs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase()))
    : docs;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Policies, manuals, and company-wide documents</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Upload
        </button>
      </div>

      <div className="relative max-w-sm">
        <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-purple-50 rounded-lg"><FileText className="w-5 h-5 text-purple-600" /></div>
              <StatusBadge status={doc.status} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
            <div className="space-y-1 text-xs text-gray-500">
              <p>Type: {doc.type} | Version: {doc.version}</p>
              <p>Updated: {formatDate(doc.updatedDate)}</p>
              <p>Size: {doc.size}</p>
            </div>
            <button className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
