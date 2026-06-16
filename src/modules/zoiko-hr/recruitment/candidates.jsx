import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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

const candidates = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", position: "Senior Frontend Dev", status: "interviewed", appliedDate: "2025-03-20", source: "LinkedIn" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", position: "Backend Engineer", status: "screening", appliedDate: "2025-03-22", source: "Referral" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", position: "Product Designer", status: "new", appliedDate: "2025-03-25", source: "Indeed" },
  { id: 4, name: "David Lee", email: "david@example.com", position: "DevOps Engineer", status: "interviewed", appliedDate: "2025-03-18", source: "LinkedIn" },
  { id: 5, name: "Eva Martinez", email: "eva@example.com", position: "Senior Frontend Dev", status: "offered", appliedDate: "2025-03-15", source: "Company Site" },
  { id: 6, name: "Frank Wilson", email: "frank@example.com", position: "Data Analyst", status: "screening", appliedDate: "2025-03-28", source: "Indeed" },
  { id: 7, name: "Grace Kim", email: "grace@example.com", position: "Backend Engineer", status: "hired", appliedDate: "2025-03-10", source: "Referral" },
  { id: 8, name: "Henry Brown", email: "henry@example.com", position: "Product Manager", status: "rejected", appliedDate: "2025-03-05", source: "LinkedIn" },
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
  const m = { new: "bg-blue-100 text-blue-800", screening: "bg-yellow-100 text-yellow-800", interviewed: "bg-purple-100 text-purple-800", offered: "bg-orange-100 text-orange-800", hired: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function daysSince(dateStr) {
  if (!dateStr) return "-";
  try { return Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24)); }
  catch { return "-"; }
}

export default function Candidates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = candidates.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.position.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <HRPage title="Candidates" subtitle="Manage candidate profiles and applications">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
            <p className="text-sm text-gray-500 mt-1">{candidates.length} total candidates</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Candidate
          </button>
        </div>

        <div className="flex gap-3">
          <input type="text" placeholder="Search by name, email, position..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="screening">Screening</option>
            <option value="interviewed">Interviewed</option>
            <option value="offered">Offered</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-3 py-3 font-medium text-left">Name</th>
                <th className="px-3 py-3 font-medium text-left">Email</th>
                <th className="px-3 py-3 font-medium text-left">Position</th>
                <th className="px-3 py-3 font-medium text-left">Status</th>
                <th className="px-3 py-3 font-medium text-left">Applied</th>
                <th className="px-3 py-3 font-medium text-left">Source</th>
                <th className="px-3 py-3 font-medium text-left"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/zoiko-hr/recruitment/candidates/${c.id}`)}>
                  <td className="px-3 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-3 py-3 text-gray-500">{c.email}</td>
                  <td className="px-3 py-3 text-gray-500">{c.position}</td>
                  <td className="px-3 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-3 py-3 text-xs text-gray-500">{daysSince(c.appliedDate)}d ago</td>
                  <td className="px-3 py-3 text-xs text-gray-500">{c.source}</td>
                  <td className="px-3 py-3">
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/zoiko-hr/recruitment/candidates/${c.id}`); }} className="text-xs text-orange-600 hover:text-orange-800 font-medium">View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">No candidates found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
