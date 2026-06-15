import { Users, Briefcase, Calendar, FileCheck2, UserPlus, Clock, TrendingUp } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useDashboardStats, useJobRequisitions, useInterviews } from "../hooks/useRecruitment";
import { formatDate } from "../utils/helpers";

export default function RecruitmentDashboard() {
  const { data: stats, loading: sLoad } = useDashboardStats();
  const { data: jobs, loading: jLoad } = useJobRequisitions();
  const { data: interviews, loading: iLoad } = useInterviews();

  if (sLoad || jLoad || iLoad) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const statCards = [
    { title: "Open Positions", value: stats.totalOpenPositions, icon: Briefcase, change: 2, trend: "up" },
    { title: "Active Candidates", value: stats.activeCandidates, icon: Users, change: 8, trend: "up" },
    { title: "Interviews Scheduled", value: stats.interviewsScheduled, icon: Calendar, change: 5, trend: "up" },
    { title: "Offers Pending", value: stats.offersPending, icon: FileCheck2, change: -1, trend: "down" },
    { title: "Hired This Month", value: stats.hiredThisMonth, icon: UserPlus, change: 3, trend: "up" },
    { title: "Time to Hire", value: `${stats.timeToHire} days`, icon: Clock, change: -3, trend: "up" },
  ];

  const jobColumns = [
    { key: "title", label: "Position", render: (v, r) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "department", label: "Department" },
    { key: "location", label: "Location" },
    { key: "openings", label: "Openings", render: (v, r) => `${r.filled}/${v} filled` },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "priority", label: "Priority", render: (v) => <StatusBadge status={v} /> },
  ];

  const interviewColumns = [
    { key: "candidate", label: "Candidate", render: (v) => <span className="font-medium">{v}</span> },
    { key: "position", label: "Position" },
    { key: "date", label: "Date", render: (v) => formatDate(v) },
    { key: "time", label: "Time" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recruitment Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of hiring activities and metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Job Requisitions</h2>
            <span className="text-xs text-orange-600 font-medium">View all</span>
          </div>
          <DataTable columns={jobColumns} data={jobs.slice(0, 4)} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
            <span className="text-xs text-orange-600 font-medium">View all</span>
          </div>
          <DataTable columns={interviewColumns} data={interviews.slice(0, 4)} />
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
  );
}
