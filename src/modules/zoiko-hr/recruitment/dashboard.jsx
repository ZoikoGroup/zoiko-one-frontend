import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Trophy, Target, MessageSquare, Star, Users, Briefcase, Calendar, FileCheck2, UserPlus, Clock } from "lucide-react";
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

const stats = { totalOpenPositions: 12, activeCandidates: 48, interviewsScheduled: 18, offersPending: 4, hiredThisMonth: 7, timeToHire: 23, sourceBreakdown: [{ source: "LinkedIn", count: 45 }, { source: "Indeed", count: 32 }, { source: "Referral", count: 28 }, { source: "Company Site", count: 22 }, { source: "Other", count: 15 }] };

const recentJobs = [
  { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "San Francisco, CA", openings: 2, filled: 1, status: "open", priority: "high" },
  { id: 2, title: "Backend Engineer", department: "Engineering", location: "Remote", openings: 3, filled: 0, status: "open", priority: "urgent" },
  { id: 3, title: "Product Designer", department: "Design", location: "New York, NY", openings: 1, filled: 0, status: "open", priority: "medium" },
  { id: 4, title: "DevOps Engineer", department: "Engineering", location: "Remote", openings: 2, filled: 1, status: "open", priority: "high" },
];

const upcomingInterviews = [
  { id: 1, candidate: "Alice Johnson", position: "Senior Frontend Dev", date: "2025-04-01", time: "10:00 AM", type: "Technical", status: "confirmed" },
  { id: 2, candidate: "Bob Smith", position: "Backend Engineer", date: "2025-04-01", time: "2:00 PM", type: "Phone Screen", status: "confirmed" },
  { id: 3, candidate: "Carol Davis", position: "Product Designer", date: "2025-04-02", time: "11:00 AM", type: "Portfolio Review", status: "pending" },
  { id: 4, candidate: "David Lee", position: "DevOps Engineer", date: "2025-04-02", time: "3:30 PM", type: "Technical", status: "confirmed" },
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

function StatsCard({ title, value, icon: Icon, change, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        {Icon && <div className="p-2 bg-orange-50 rounded-lg"><Icon className="w-5 h-5 text-orange-600" /></div>}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {change != null && (
        <p className={`text-sm font-medium mt-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {change > 0 ? "+" : ""}{change}% vs last month
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const m = { open: "bg-green-100 text-green-800", closed: "bg-gray-100 text-gray-800", draft: "bg-gray-100 text-gray-800", on_hold: "bg-yellow-100 text-yellow-800", high: "bg-red-100 text-red-800", urgent: "bg-red-100 text-red-800", medium: "bg-yellow-100 text-yellow-800", low: "bg-green-100 text-green-800", confirmed: "bg-green-100 text-green-800", pending: "bg-yellow-100 text-yellow-800", completed: "bg-blue-100 text-blue-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function RecruitmentDashboard() {
  const statCards = [
    { title: "Open Positions", value: stats.totalOpenPositions, icon: Briefcase, change: 2, trend: "up" },
    { title: "Active Candidates", value: stats.activeCandidates, icon: Users, change: 8, trend: "up" },
    { title: "Interviews Scheduled", value: stats.interviewsScheduled, icon: Calendar, change: 5, trend: "up" },
    { title: "Offers Pending", value: stats.offersPending, icon: FileCheck2, change: -1, trend: "down" },
    { title: "Hired This Month", value: stats.hiredThisMonth, icon: UserPlus, change: 3, trend: "up" },
    { title: "Time to Hire", value: `${stats.timeToHire} days`, icon: Clock, change: -3, trend: "up" },
  ];

  return (
    <HRPage title="Recruitment Dashboard" subtitle="Overview of hiring activities and metrics">
      <SubNav />
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Job Requisitions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-3 font-medium text-left">Position</th>
                    <th className="px-3 py-3 font-medium text-left">Dept</th>
                    <th className="px-3 py-3 font-medium text-left">Filled</th>
                    <th className="px-3 py-3 font-medium text-left">Status</th>
                    <th className="px-3 py-3 font-medium text-left">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((j) => (
                    <tr key={j.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-3 py-3 font-medium text-gray-900">{j.title}</td>
                      <td className="px-3 py-3 text-gray-500">{j.department}</td>
                      <td className="px-3 py-3">{j.filled}/{j.openings}</td>
                      <td className="px-3 py-3"><StatusBadge status={j.status} /></td>
                      <td className="px-3 py-3"><StatusBadge status={j.priority} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-3 font-medium text-left">Candidate</th>
                    <th className="px-3 py-3 font-medium text-left">Position</th>
                    <th className="px-3 py-3 font-medium text-left">Date</th>
                    <th className="px-3 py-3 font-medium text-left">Type</th>
                    <th className="px-3 py-3 font-medium text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingInterviews.map((i) => (
                    <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-3 py-3 font-medium text-gray-900">{i.candidate}</td>
                      <td className="px-3 py-3 text-gray-500">{i.position}</td>
                      <td className="px-3 py-3 text-xs">{formatDate(i.date)}</td>
                      <td className="px-3 py-3 text-xs text-gray-500">{i.type}</td>
                      <td className="px-3 py-3"><StatusBadge status={i.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Source Breakdown</h2>
          <div className="flex items-end gap-6 h-40">
            {stats.sourceBreakdown.map((s) => {
              const max = Math.max(...stats.sourceBreakdown.map((x) => x.count));
              const pct = (s.count / max) * 100;
              return (
                <div key={s.source} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{s.count}</span>
                  <div className="w-full bg-orange-100 rounded-t-lg" style={{ height: `${Math.max(pct, 4)}%` }}>
                    <div className="w-full bg-orange-500 rounded-t-lg h-full opacity-80" />
                  </div>
                  <span className="text-xs text-gray-500 text-center">{s.source}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </HRPage>
  );
}
