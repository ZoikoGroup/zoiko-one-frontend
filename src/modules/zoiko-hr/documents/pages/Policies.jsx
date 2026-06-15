import { useState } from "react";
import { Search, FileText, Shield, Clock, CheckCircle, AlertTriangle, BookOpen, Plus, Download } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/helpers";

const policies = [
  { id: 1, title: "Code of Conduct", category: "Ethics", owner: "Legal Team", version: "3.2", effectiveDate: "2025-01-01", reviewDate: "2025-12-31", status: "active", department: "All" },
  { id: 2, title: "Data Protection Policy", category: "Compliance", owner: "DPO", version: "2.1", effectiveDate: "2025-02-15", reviewDate: "2025-08-15", status: "active", department: "All" },
  { id: 3, title: "Remote Work Policy", category: "HR", owner: "HR Director", version: "1.0", effectiveDate: "2025-03-01", reviewDate: "2025-09-01", status: "active", department: "All" },
  { id: 4, title: "Anti-Harassment Policy", category: "HR", owner: "HR Director", version: "4.0", effectiveDate: "2025-01-15", reviewDate: "2025-07-15", status: "active", department: "All" },
  { id: 5, title: "IT Security Policy", category: "IT", owner: "CTO", version: "5.1", effectiveDate: "2025-04-01", reviewDate: "2025-10-01", status: "active", department: "All" },
  { id: 6, title: "Leave & Time Off Policy", category: "HR", owner: "HR Director", version: "2.3", effectiveDate: "2025-02-01", reviewDate: "2026-02-01", status: "active", department: "All" },
  { id: 7, title: "Social Media Policy", category: "Marketing", owner: "Marketing Head", version: "1.2", effectiveDate: "2025-03-15", reviewDate: "2025-09-15", status: "draft", department: "All" },
  { id: 8, title: "Expense Reimbursement", category: "Finance", owner: "CFO", version: "3.0", effectiveDate: "2025-01-01", reviewDate: "2025-12-31", status: "active", department: "All" },
  { id: 9, title: "Diversity & Inclusion", category: "HR", owner: "HR Director", version: "2.0", effectiveDate: "2025-04-01", reviewDate: "2025-10-01", status: "active", department: "All" },
  { id: 10, title: "Whistleblower Policy", category: "Compliance", owner: "Legal Team", version: "1.0", effectiveDate: "2025-05-01", reviewDate: "2026-05-01", status: "draft", department: "All" },
];

const categories = ["All", "HR", "Compliance", "IT", "Finance", "Marketing", "Ethics"];

export default function Policies() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = policies.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policies</h1>
          <p className="text-sm text-gray-500 mt-1">Manage company policies and procedures</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search policies..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> New Policy
          </button>
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Policy Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Owner</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Version</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Effective</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Review</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((policy) => (
                <tr key={policy.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-gray-900">{policy.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{policy.category}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{policy.owner}</td>
                  <td className="py-3 px-4 text-gray-600">v{policy.version}</td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(policy.effectiveDate)}</td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(policy.reviewDate)}</td>
                  <td className="py-3 px-4"><StatusBadge status={policy.status} /></td>
                  <td className="py-3 px-4">
                    <button className="text-purple-600 hover:text-purple-800 text-xs font-medium flex items-center gap-1">
                      <Download className="w-3 h-3" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
