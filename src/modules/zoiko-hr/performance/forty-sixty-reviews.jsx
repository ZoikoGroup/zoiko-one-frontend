import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Users } from "lucide-react";
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

const reviewCycles = [
  { id: 1, employee: "Alice J.", type: "360 Review", period: "Q1 2025", status: "in_progress", participants: 6, completed: 3 },
  { id: 2, employee: "Bob S.", type: "360 Review", period: "Q1 2025", status: "pending", participants: 5, completed: 0 },
  { id: 3, employee: "Carol D.", type: "360 Review", period: "Q1 2025", status: "completed", participants: 7, completed: 7 },
  { id: 4, employee: "David W.", type: "360 Review", period: "Q1 2025", status: "pending", participants: 5, completed: 0 },
  { id: 5, employee: "Eve M.", type: "360 Review", period: "Q1 2025", status: "in_progress", participants: 6, completed: 2 },
];

const feedbackResponses = [
  { id: 1, reviewer: "Tom K.", relationship: "Peer", rating: 4, comment: "Alice is a great team player and consistently delivers quality work.", date: "2025-03-05" },
  { id: 2, reviewer: "Sarah M.", relationship: "Manager", rating: 5, comment: "Alice has shown exceptional leadership skills this quarter.", date: "2025-03-04" },
  { id: 3, reviewer: "Mike R.", relationship: "Peer", rating: 4, comment: "Easy to collaborate with and always willing to help others.", date: "2025-03-03" },
  { id: 4, reviewer: "Lisa P.", relationship: "Subordinate", rating: 5, comment: "Alice provides clear guidance and mentorship to the team.", date: "2025-03-02" },
  { id: 5, reviewer: "Jane D.", relationship: "Peer", rating: 4, comment: "Great communication skills and technical expertise.", date: "2025-03-01" },
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
  const m = { pending: "bg-yellow-100 text-yellow-800", in_progress: "bg-purple-100 text-purple-800", completed: "bg-green-100 text-green-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

export default function FortySixtyReviews() {
  const [selected, setSelected] = useState(reviewCycles[0].id);
  const active = reviewCycles.find((r) => r.id === selected);

  return (
    <HRPage title="360 Reviews" subtitle="Multi-source feedback from peers, managers, and reports">
      <SubNav />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">360 Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Multi-source feedback from peers, managers, and reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Review Cycles</h2>
            {reviewCycles.map((r) => (
              <button key={r.id} onClick={() => setSelected(r.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${selected === r.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{r.employee}</p>
                    <p className="text-xs text-gray-400">{r.period}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{r.completed}/{r.participants} responses</span>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {active && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{active.employee}</h2>
                    <p className="text-sm text-gray-500">{active.period} - {active.type}</p>
                  </div>
                  <StatusBadge status={active.status} />
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Feedback Responses</span>
                    <span>{active.completed}/{active.participants}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(active.completed / active.participants) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-4">
                  {feedbackResponses.map((fb) => (
                    <div key={fb.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-900">{fb.reviewer}</span>
                          <span className="text-xs text-gray-400">({fb.relationship})</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className={`w-2 h-2 rounded-full ${s <= fb.rating ? "bg-yellow-400" : "bg-gray-200"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">"{fb.comment}"</p>
                      <p className="text-xs text-gray-400 mt-1">{fb.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </HRPage>
  );
}
