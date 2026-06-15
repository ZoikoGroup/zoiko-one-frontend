import { useState, useMemo } from "react";
import { FileText, Download, BarChart3, ClipboardList, FileSearch, Archive } from "lucide-react";
import { useAssetReports } from "../hooks/useAssets";
import { formatDate } from "../utils/helpers";

const typeIcons = {
  inventory: Archive,
  depreciation: BarChart3,
  assignment: ClipboardList,
  audit_trail: FileSearch,
};

const typeColors = {
  inventory: "bg-blue-50 text-blue-700 border-blue-200",
  depreciation: "bg-purple-50 text-purple-700 border-purple-200",
  assignment: "bg-green-50 text-green-700 border-green-200",
  audit_trail: "bg-orange-50 text-orange-700 border-orange-200",
};

const typeLabels = {
  inventory: "Inventory",
  depreciation: "Depreciation",
  assignment: "Assignment",
  audit_trail: "Audit Trail",
};

export default function AssetReports() {
  const { data: reports, loading } = useAssetReports();
  const [categoryFilter, setCategoryFilter] = useState("");

  const categories = useMemo(() => {
    const types = new Set(reports.map((r) => r.type));
    return [...types];
  }, [reports]);

  const filtered = categoryFilter ? reports.filter((r) => r.type === categoryFilter) : reports;

  if (loading) return <div className="p-6 text-gray-400">Loading reports...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Asset Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Generate and download asset management reports</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCategoryFilter("")}
          className={`px-4 py-1.5 text-sm rounded-lg border transition-colors ${!categoryFilter ? "bg-amber-600 text-white border-amber-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
          All
        </button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-1.5 text-sm rounded-lg border capitalize transition-colors ${categoryFilter === cat ? "bg-amber-600 text-white border-amber-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
            {typeLabels[cat] || cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((report) => {
          const Icon = typeIcons[report.type] || FileText;
          return (
            <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg border ${typeColors[report.type] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{report.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{formatDate(report.date)}</span>
                      <span>|</span>
                      <span>{report.size}</span>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No reports found for this category.</p>
        </div>
      )}
    </div>
  );
}
