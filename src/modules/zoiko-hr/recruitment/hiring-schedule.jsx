import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
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

const events = [
  { id: 1, title: "Phone Screen - Alice Johnson", type: "phone", date: "2025-04-01", time: "10:00 AM", assignee: "Sarah M.", status: "scheduled" },
  { id: 2, title: "Technical Interview - Bob Smith", type: "technical", date: "2025-04-02", time: "2:00 PM", assignee: "Mike R.", status: "completed" },
  { id: 3, title: "Panel Interview - Carol Davis", type: "panel", date: "2025-04-03", time: "11:00 AM", assignee: "Lisa K.", status: "scheduled" },
  { id: 4, title: "Cultural Fit - David Lee", type: "cultural", date: "2025-04-04", time: "3:00 PM", assignee: "James P.", status: "completed" },
  { id: 5, title: "Final Round - Eva Martinez", type: "final", date: "2025-04-05", time: "9:00 AM", assignee: "Tom H.", status: "cancelled" },
  { id: 6, title: "Phone Screen - Frank Wilson", type: "phone", date: "2025-04-06", time: "1:00 PM", assignee: "Sarah M.", status: "scheduled" },
  { id: 7, title: "Technical Interview - Grace Kim", type: "technical", date: "2025-04-07", time: "10:30 AM", assignee: "Mike R.", status: "scheduled" },
  { id: 8, title: "Panel Interview - Henry Brown", type: "panel", date: "2025-04-08", time: "2:30 PM", assignee: "Lisa K.", status: "completed" },
  { id: 9, title: "Phone Screen - Ivy Chen", type: "phone", date: "2025-04-09", time: "11:30 AM", assignee: "Sarah M.", status: "scheduled" },
  { id: 10, title: "Technical Interview - Jack Wilson", type: "technical", date: "2025-04-10", time: "3:30 PM", assignee: "Mike R.", status: "scheduled" },
  { id: 11, title: "Cultural Fit - Karen Lee", type: "cultural", date: "2025-04-11", time: "10:00 AM", assignee: "James P.", status: "scheduled" },
  { id: 12, title: "Offer Meeting - Eva Martinez", type: "offer", date: "2025-04-12", time: "2:00 PM", assignee: "Tom H.", status: "completed" },
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

const typeColors = {
  phone: "bg-blue-100 text-blue-800",
  technical: "bg-purple-100 text-purple-800",
  panel: "bg-orange-100 text-orange-800",
  cultural: "bg-green-100 text-green-800",
  final: "bg-red-100 text-red-800",
  offer: "bg-yellow-100 text-yellow-800",
};

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function HiringSchedule() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const filtered = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.assignee.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || e.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <HRPage title="Hiring Schedule" subtitle="Manage interviews and hiring events">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-64" />
            </div>
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
              <option value="all">All Types</option>
              <option value="phone">Phone Screen</option>
              <option value="technical">Technical</option>
              <option value="panel">Panel</option>
              <option value="cultural">Cultural Fit</option>
              <option value="final">Final Round</option>
              <option value="offer">Offer</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">Schedule New</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((event) => (
            <div key={event.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${typeColors[event.type] || "bg-gray-100 text-gray-800"}`}>{event.type.replace(/_/g, " ")} Interview</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${event.status === "completed" ? "bg-green-100 text-green-800" : event.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{event.status}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{event.title}</h3>
              <div className="space-y-1 text-xs text-gray-500">
                <p>{formatDate(event.date)} at {event.time}</p>
                <p>Assignee: {event.assignee}</p>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </HRPage>
  );
}
