import { useState } from "react";
import { Search, FileText, Folder, Archive as ArchiveIcon, Download, Trash2, RefreshCw, Calendar } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/helpers";

const archivedDocuments = [
  { id: 1, name: "2024 Employment Contracts.pdf", category: "Contracts", department: "HR", archivedBy: "Admin", archivedDate: "2025-01-15", size: "12.5 MB", retentionUntil: "2030-01-15", status: "permanent" },
  { id: 2, name: "Q4 2024 Reports.xlsx", category: "Reports", department: "Finance", archivedBy: "John Smith", archivedDate: "2025-01-10", size: "3.2 MB", retentionUntil: "2027-01-10", status: "retained" },
  { id: 3, name: "Employee Handbooks 2024.pdf", category: "Policies", department: "HR", archivedBy: "Admin", archivedDate: "2025-02-01", size: "8.7 MB", retentionUntil: "2028-02-01", status: "permanent" },
  { id: 4, name: "Project Alpha Documents.zip", category: "Projects", department: "Engineering", archivedBy: "Mike Chen", archivedDate: "2025-02-15", size: "45.0 MB", retentionUntil: "2026-02-15", status: "retained" },
  { id: 5, name: "Tax Records FY2024.pdf", category: "Financial", department: "Finance", archivedBy: "Accounting", archivedDate: "2025-03-01", size: "5.1 MB", retentionUntil: "2035-03-01", status: "permanent" },
  { id: 6, name: "Old IT Asset Register.xlsx", category: "Assets", department: "IT", archivedBy: "Sarah Lee", archivedDate: "2025-03-10", size: "1.8 MB", retentionUntil: "2026-03-10", status: "retained" },
  { id: 7, name: "Marketing Collateral 2023.zip", category: "Marketing", department: "Marketing", archivedBy: "Emily Clark", archivedDate: "2025-02-20", size: "256.0 MB", retentionUntil: "2027-02-20", status: "retained" },
  { id: 8, name: "Terminated Employee Records", category: "HR Records", department: "HR", archivedBy: "Admin", archivedDate: "2025-01-05", size: "18.3 MB", retentionUntil: "2030-01-05", status: "permanent" },
  { id: 9, name: "Old Training Materials.zip", category: "Training", department: "L&D", archivedBy: "Lisa Brown", archivedDate: "2025-03-15", size: "92.0 MB", retentionUntil: "2026-03-15", status: "expiring" },
  { id: 10, name: "Audit Reports 2023-2024.pdf", category: "Compliance", department: "Legal", archivedBy: "Legal Team", archivedDate: "2025-03-20", size: "6.4 MB", retentionUntil: "2030-03-20", status: "permanent" },
];

const categories = ["All", "Contracts", "Reports", "Policies", "Projects", "Financial", "Assets", "Marketing", "HR Records", "Training", "Compliance"];

export default function Archive() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = archivedDocuments.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || d.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Archive</h1>
          <p className="text-sm text-gray-500 mt-1">Archived document storage and retention management</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search archive..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 w-64" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeCategory === cat ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <ArchiveIcon className="w-5 h-5 text-purple-600" />
              </div>
              <StatusBadge status={doc.status === "permanent" ? "active" : doc.status} />
            </div>
            <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{doc.name}</h3>
            <div className="space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center gap-1"><Folder className="w-3 h-3" />{doc.category}</div>
              <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />Archived: {formatDate(doc.archivedDate)}</div>
              <div className="flex items-center gap-1"><RefreshCw className="w-3 h-3" />Retention: {formatDate(doc.retentionUntil)}</div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">{doc.size}</span>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
