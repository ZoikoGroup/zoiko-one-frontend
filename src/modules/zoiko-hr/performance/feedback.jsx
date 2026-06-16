import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Star, MessageSquare, User } from "lucide-react";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/performance" },
  { label: "Goals & OKRs", href: "/zoiko-hr/performance/goals" },
  { label: "Performance Reviews", href: "/zoiko-hr/performance/reviews" },
  { label: "Appraisals", href: "/zoiko-hr/performance/appraisals" },
  { label: "Feedback", href: "/zoiko-hr/performance/feedback" },
  { label: "360 Reviews", href: "/zoiko-hr/performance/360-reviews" },
  { label: "KPI Tracking", href: "/zoiko-hr/performance/kpis" },
  { label: "Competencies", href: "/zoiko-hr/performance/competencies" },
  { label: "Analytics", href: "/zoiko-hr/performance/analytics" },
  { label: "Reports", href: "/zoiko-hr/performance/reports" },
  { label: "Settings", href: "/zoiko-hr/performance/settings" },
];

const feedbackList = [
  { id: 1, from: "Alice J.", to: "Bob S.", type: "peer", content: "Great job on the API design. The documentation was very thorough.", date: "2025-03-05", rating: 5 },
  { id: 2, from: "Carol D.", to: "Alice J.", type: "manager", content: "Alice has been consistently delivering high-quality work.", date: "2025-03-03", rating: 5 },
  { id: 3, from: "Bob S.", to: "Carol D.", type: "subordinate", content: "Carol provides clear direction and is always available for guidance.", date: "2025-02-28", rating: 4 },
  { id: 4, from: "Eve M.", to: "Frank L.", type: "peer", content: "Frank's collaboration on the cross-team project was excellent.", date: "2025-02-25", rating: 4 },
  { id: 5, from: "Sarah M.", to: "Eve M.", type: "manager", content: "Eve needs to improve her time management. Several deadlines were missed.", date: "2025-02-20", rating: 3 },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/performance"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${isActive ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const m = { peer: "bg-indigo-100 text-indigo-800", manager: "bg-orange-100 text-orange-800", subordinate: "bg-purple-100 text-purple-800", self: "bg-teal-100 text-teal-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function Feedback() {
  const [search, setSearch] = useState("");
  const filtered = search
    ? feedbackList.filter((f) => f.from.toLowerCase().includes(search.toLowerCase()) || f.to.toLowerCase().includes(search.toLowerCase()))
    : feedbackList;

  return (
    <HRPage title="Continuous Feedback" subtitle="Real-time peer, manager, and self feedback">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Continuous Feedback</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time peer, manager, and self feedback</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> Give Feedback
          </button>
        </div>

        <div className="relative max-w-sm">
          <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>

        <div className="space-y-4">
          {filtered.map((fb) => (
            <div key={fb.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{fb.from} <span className="text-gray-400 font-normal">→</span> {fb.to}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={fb.type} />
                      <span className="text-xs text-gray-400">{formatDate(fb.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= fb.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                <p>"{fb.content}"</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No feedback found</div>
          )}
        </div>
      </div>
    </HRPage>
  );
}
