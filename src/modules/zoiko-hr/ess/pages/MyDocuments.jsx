import { useState } from "react";
import { FileText, Download, Upload, Search, File, FileSpreadsheet, Award, FileCheck } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { useMyDocuments } from "../hooks/useEss";
import { formatDate } from "../utils/helpers";

const categoryIcons = {
  Payslips: FileText,
  "Tax Forms": FileSpreadsheet,
  Certificates: Award,
  "Offer Letter": FileCheck,
  Other: File,
};

const categoryColors = {
  Payslips: "bg-blue-50 text-blue-600",
  "Tax Forms": "bg-orange-50 text-orange-600",
  Certificates: "bg-purple-50 text-purple-600",
  "Offer Letter": "bg-green-50 text-green-600",
  Other: "bg-gray-50 text-gray-600",
};

export default function EssMyDocuments() {
  const { data: documents, loading } = useMyDocuments();
  const [search, setSearch] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading documents...</div>;

  const filtered = documents.filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Access your payslips, tax forms, certificates and more</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      {Object.entries(grouped).map(([category, docs]) => {
        const Icon = categoryIcons[category] || File;
        const colorCls = categoryColors[category] || "bg-gray-50 text-gray-600";
        return (
          <div key={category} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${colorCls}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
              <span className="text-xs text-gray-400">({docs.length} files)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {docs.map((doc) => (
                <div key={doc.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.size}</p>
                      </div>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">{formatDate(doc.uploadDate)}</span>
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium">
                      <Download className="w-3 h-3" /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">No documents found matching your search.</div>
      )}
    </div>
  );
}
