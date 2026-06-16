import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/ess" },
  { label: "Profile", href: "/zoiko-hr/ess/profile" },
  { label: "Leave Management", href: "/zoiko-hr/ess/leave" },
  { label: "Attendance", href: "/zoiko-hr/ess/attendance" },
  { label: "My Documents", href: "/zoiko-hr/ess/my-documents" },
  { label: "Requests", href: "/zoiko-hr/ess/requests" },
  { label: "Settings", href: "/zoiko-hr/ess/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/ess"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

const mockDocumentsData = [
  { id: 1, name: "January 2025 Payslip", category: "Payslips", size: "2.4 MB", status: "available", uploadDate: "2025-01-15" },
  { id: 2, name: "Q4 2024 Tax Forms", category: "Tax Forms", size: "1.8 MB", status: "available", uploadDate: "2024-12-20" },
  { id: 3, name: "Employee ID Card", category: "Certificates", size: "0.5 MB", status: "available", uploadDate: "2025-01-10" },
  { id: 4, name: "Offer Letter - Senior Engineer", category: "Offer Letter", size: "1.2 MB", status: "available", uploadDate: "2025-01-05" },
  { id: 5, name: "Health Insurance", category: "Certificates", size: "0.8 MB", status: "available", uploadDate: "2025-01-12" },
  { id: 6, name: "Retirement Plan", category: "Certificates", size: "0.6 MB", status: "available", uploadDate: "2025-01-08" },
  { id: 7, name: "Performance Review 2024", category: "Certificates", size: "1.5 MB", status: "available", uploadDate: "2025-01-25" },
  { id: 8, name: "Expense Report 2024", category: "Other", size: "2.1 MB", status: "pending", uploadDate: "2025-01-30" },
  { id: 9, name: "Travel Authorization", category: "Other", size: "0.9 MB", status: "pending", uploadDate: "2025-01-28" },
  { id: 10, name: "Training Certificate", category: "Certificates", size: "0.7 MB", status: "available", uploadDate: "2025-01-22" },
];

export default function EssMyDocuments() {
  const [documents] = useState(mockDocumentsData);
  const [search, setSearch] = useState("");

  const filtered = documents.filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  const categoryIcons = {
    Payslips: "💰",
    "Tax Forms": "📋",
    Certificates: "🏆",
    "Offer Letter": "📄",
    Other: "📁",
  };

  const categoryColors = {
    Payslips: "bg-blue-50 text-blue-600",
    "Tax Forms": "bg-orange-50 text-orange-600",
    Certificates: "bg-purple-50 text-purple-600",
    "Offer Letter": "bg-green-50 text-green-600",
    Other: "bg-gray-50 text-gray-600",
  };

  return (
    <HRPage title="Employee Self Service" subtitle="Access your payslips, tax forms, certificates and more">
      <SubNav />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
            <p className="text-sm text-gray-500 mt-1">Access your payslips, tax forms, certificates and more</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Upload Document
          </button>
        </div>

        <div className="relative max-w-sm">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">
            🔍
          </div>
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {Object.entries(grouped).map(([category, docs]) => {
          const icon = categoryIcons[category] || "📁";
          const colorCls = categoryColors[category] || "bg-gray-50 text-gray-600";
          return (
            <div key={category} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${colorCls}`}>
                  <span className="text-lg">{icon}</span>
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
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 010 2H7v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-400">{doc.size}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        doc.status === "available" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>{doc.status}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <span className="text-xs text-gray-400">Uploaded {doc.uploadDate}</span>
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Download
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
    </HRPage>
  );
}
