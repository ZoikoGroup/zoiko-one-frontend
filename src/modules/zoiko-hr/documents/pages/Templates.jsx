import { Plus, FileText, Download } from "lucide-react";
import DataTable from "../components/DataTable";
import { useTemplates } from "../hooks/useDocuments";
import { formatDate } from "../utils/helpers";

export default function Templates() {
  const { data: templates, loading } = useTemplates();

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const columns = [
    { key: "name", label: "Template", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "category", label: "Category" },
    { key: "usage", label: "Times Used", render: (v) => <span className="font-medium">{v}</span> },
    { key: "lastUsed", label: "Last Used", render: (v) => formatDate(v) },
    { key: "actions", label: "", render: () => (
      <button className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium">
        <Download className="w-3 h-3" /> Download
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-sm text-gray-500 mt-1">{templates.length} document templates</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {["Legal", "HR", "Finance"].map((cat) => (
          <div key={cat} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">{cat}</p>
            <p className="text-sm text-gray-500">{templates.filter((t) => t.category === cat).length} templates</p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={templates} />
    </div>
  );
}
