import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/recruitment" },
  { label: "Job Requisitions", href: "/zoiko-hr/recruitment/job-requisitions" },
  { label: "Open Positions", href: "/zoiko-hr/recruitment/open-positions" },
  { label: "Candidates", href: "/zoiko-hr/recruitment/candidates" },
  { label: "Interview Pipeline", href: "/zoiko-hr/recruitment/interview-pipeline" },
  { label: "Offer Management", href: "/zoiko-hr/recruitment/offers" },
  { label: "Hiring Schedule", href: "/zoiko-hr/recruitment/hiring-schedule" },
  { label: "Analytics", href: "/zoiko-hr/recruitment/analytics" },
  { label: "Reports", href: "/zoiko-hr/recruitment/reports" },
  { label: "Settings", href: "/zoiko-hr/recruitment/settings" },
];

const jobs = [
  { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "San Francisco, CA", openings: 2, filled: 1, priority: "high", status: "open", createdDate: "2025-03-15" },
  { id: 2, title: "Backend Engineer", department: "Engineering", location: "Remote", openings: 3, filled: 0, priority: "urgent", status: "open", createdDate: "2025-03-20" },
  { id: 3, title: "Product Designer", department: "Design", location: "New York, NY", openings: 1, filled: 0, priority: "medium", status: "open", createdDate: "2025-03-22" },
  { id: 4, title: "DevOps Engineer", department: "Engineering", location: "Remote", openings: 2, filled: 1, priority: "high", status: "open", createdDate: "2025-03-10" },
  { id: 5, title: "Data Analyst", department: "Data", location: "Chicago, IL", openings: 1, filled: 0, priority: "medium", status: "draft", createdDate: "2025-03-25" },
  { id: 6, title: "QA Engineer", department: "Engineering", location: "Remote", openings: 2, filled: 2, priority: "low", status: "closed", createdDate: "2025-02-01" },
  { id: 7, title: "Product Manager", department: "Product", location: "San Francisco, CA", openings: 1, filled: 0, priority: "high", status: "open", createdDate: "2025-03-28" },
  { id: 8, title: "Marketing Lead", department: "Marketing", location: "New York, NY", openings: 1, filled: 0, priority: "medium", status: "on_hold", createdDate: "2025-03-01" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/recruitment"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${isActive ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const m = { open: "bg-green-100 text-green-800", closed: "bg-gray-100 text-gray-800", draft: "bg-gray-100 text-gray-800", on_hold: "bg-yellow-100 text-yellow-800", high: "bg-red-100 text-red-800", urgent: "bg-red-100 text-red-800", medium: "bg-yellow-100 text-yellow-800", low: "bg-green-100 text-green-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function JobRequisitions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = jobs.filter((j) => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <HRPage title="Job Requisitions" subtitle="Manage job openings and hiring requests">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Requisitions</h1>
            <p className="text-sm text-gray-500 mt-1">Manage job openings and hiring requests</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> New Requisition
          </button>
        </div>

        <div className="flex gap-3">
          <input type="text" placeholder="Search by title or department..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-3 py-3 font-medium text-left">Position</th>
                <th className="px-3 py-3 font-medium text-left">Department</th>
                <th className="px-3 py-3 font-medium text-left">Location</th>
                <th className="px-3 py-3 font-medium text-left">Filled</th>
                <th className="px-3 py-3 font-medium text-left">Priority</th>
                <th className="px-3 py-3 font-medium text-left">Status</th>
                <th className="px-3 py-3 font-medium text-left">Created</th>
                <th className="px-3 py-3 font-medium text-left"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr key={j.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-3 py-3 font-medium text-gray-900">{j.title}</td>
                  <td className="px-3 py-3 text-gray-500">{j.department}</td>
                  <td className="px-3 py-3 text-gray-500">{j.location}</td>
                  <td className="px-3 py-3">{j.filled}/{j.openings}</td>
                  <td className="px-3 py-3"><StatusBadge status={j.priority} /></td>
                  <td className="px-3 py-3"><StatusBadge status={j.status} /></td>
                  <td className="px-3 py-3 text-xs text-gray-500">{formatDate(j.createdDate)}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-orange-600 hover:text-orange-800 font-medium">Edit</button>
                      <button className="text-xs text-red-600 hover:text-red-800 font-medium">Close</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">No requisitions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
