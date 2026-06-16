import { useState } from "react";
import { NavLink } from "react-router-dom";
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

const analyticsData = {
  totalCandidates: 248,
  activeRequisitions: 12,
  interviewsThisMonth: 45,
  offersExtended: 18,
  hireRate: 68,
  avgTimeToHire: 32,
  topSources: [
    { source: "LinkedIn", count: 85 },
    { source: "Indeed", count: 62 },
    { source: "Referral", count: 48 },
    { source: "Company Site", count: 35 },
    { source: "Other", count: 18 },
  ],
  monthlyTrends: [
    { month: "Nov", applications: 45, interviews: 18, hires: 3 },
    { month: "Dec", applications: 38, interviews: 15, hires: 2 },
    { month: "Jan", applications: 52, interviews: 22, hires: 5 },
    { month: "Feb", applications: 48, interviews: 20, hires: 4 },
    { month: "Mar", applications: 65, interviews: 28, hires: 6 },
  ],
  stageConversion: [
    { stage: "Applied", count: 248, rate: 100 },
    { stage: "Screened", count: 186, rate: 75 },
    { stage: "Interviewed", count: 124, rate: 50 },
    { stage: "Offered", count: 62, rate: 25 },
    { stage: "Hired", count: 42, rate: 17 },
  ],
};

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

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color || "text-gray-900"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("monthly");

  return (
    <HRPage title="Recruitment Analytics" subtitle="Measure and optimize your hiring funnel">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruitment Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Key metrics and hiring performance</p>
          </div>
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Total Candidates" value={analyticsData.totalCandidates} sub="All time" color="text-orange-600" />
          <StatCard label="Active Requisitions" value={analyticsData.activeRequisitions} sub="Open positions" />
          <StatCard label="Interviews This Month" value={analyticsData.interviewsThisMonth} sub="Scheduled" />
          <StatCard label="Offers Extended" value={analyticsData.offersExtended} sub="This quarter" />
          <StatCard label="Avg Time to Hire" value={`${analyticsData.avgTimeToHire}d`} sub="Days" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h2>
            <div className="space-y-3">
              {analyticsData.monthlyTrends.map((m) => (
                <div key={m.month}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{m.month}</span>
                    <span className="text-gray-400">{m.applications} apps · {m.interviews} intvs · {m.hires} hires</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-orange-400" style={{ width: `${(m.applications / Math.max(...analyticsData.monthlyTrends.map((x) => x.applications))) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Sources</h2>
            <div className="space-y-3">
              {analyticsData.topSources.map((s) => (
                <div key={s.source}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{s.source}</span>
                    <span className="text-gray-400">{s.count} ({Math.round((s.count / analyticsData.totalCandidates) * 100)}%)</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(s.count / analyticsData.topSources[0].count) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Funnel Conversion</h2>
          <div className="space-y-0">
            {analyticsData.stageConversion.map((s, i) => (
              <div key={s.stage} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                <span className="text-sm font-medium text-gray-700 w-24">{s.stage}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${s.rate}%` }} />
                </div>
                <span className="text-sm text-gray-500 w-16 text-right">{s.count}</span>
                <span className="text-sm font-medium text-gray-700 w-12 text-right">{s.rate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HRPage>
  );
}
