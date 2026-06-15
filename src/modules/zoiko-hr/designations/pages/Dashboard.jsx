import { BadgeCheck, Layers, Building2, CircleDollarSign, Users } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useDesignationDashboard } from "../hooks/useDesignation";
import { levelColor, formatCurrency } from "../utils/helpers";

export default function DesignationsDashboard() {
  const { data, loading } = useDesignationDashboard();

  if (loading) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const { stats, levelDistribution, departmentDistribution, recentDesignations } = data;

  const statCards = [
    { title: "Total Designations", value: stats.total, icon: BadgeCheck, change: 2, trend: "up" },
    { title: "Active Designations", value: stats.active, icon: Layers, change: 1, trend: "up" },
    { title: "Departments Covered", value: departmentDistribution.length, icon: Building2, change: 0, trend: "flat" },
    { title: "Avg Salary Range", value: "$60K - $180K", icon: CircleDollarSign, change: null, trend: null },
    { title: "Employees in Designations", value: `${stats.withEmployees} depts`, icon: Users, change: 3, trend: "up" },
  ];

  const maxLevelCount = Math.max(...levelDistribution.map((l) => l.count));

  const deptColumns = [
    { key: "dept", label: "Department", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "count", label: "Designations", render: (v) => <span className="text-orange-600 font-medium">{v}</span> },
  ];

  const recentColumns = [
    { key: "title", label: "Title", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "department", label: "Department" },
    { key: "level", label: "Level", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${levelColor(v)}`}>{v}</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const allLevels = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Designations Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of job titles, levels, and organizational structure</p>
      </div>

      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Active Designations</p>
            <p className="text-4xl font-bold font-mono mt-1">{stats.active}</p>
            <p className="text-orange-100 mt-1">{stats.total} total across {departmentDistribution.length} departments</p>
          </div>
          <div className="text-right">
            <p className="text-orange-100 text-sm">Level Coverage</p>
            <p className="text-3xl font-bold">{levelDistribution.length}/10</p>
            <p className="text-orange-100 text-sm mt-1">L1 through L10</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Level Distribution</h2>
          <div className="flex items-end gap-2 h-40">
            {allLevels.map((lvl) => {
              const ld = levelDistribution.find((d) => d.level === lvl);
              const count = ld ? ld.count : 0;
              const pct = maxLevelCount > 0 ? (count / maxLevelCount) * 100 : 0;
              return (
                <div key={lvl} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500 font-medium">{count}</span>
                  <div
                    className={`w-full rounded-t ${levelColor(lvl).split(" ")[0]} opacity-80`}
                    style={{ height: `${Math.max(pct, 4)}%` }}
                  />
                  <span className="text-xs text-gray-500">{lvl}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Entry to Mid</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> Senior</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Leadership</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Salary Range by Level</h2>
          <div className="space-y-3">
            {levelDistribution.map((ld) => {
              const maxSalary = 410000;
              const minPct = (ld.minSalary / maxSalary) * 100;
              const maxPct = (ld.maxSalary / maxSalary) * 100;
              return (
                <div key={ld.level} className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-8 justify-center ${levelColor(ld.level)}`}>{ld.level}</span>
                  <div className="flex-1 relative h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute h-full bg-orange-200 rounded-full" style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }} />
                    <div className="absolute h-full bg-orange-500 rounded-full opacity-60" style={{ left: `${(minPct + maxPct) / 2}%`, width: "4px" }} />
                  </div>
                  <span className="text-xs text-gray-500 w-20 text-right">{formatCurrency(ld.minSalary)} - {formatCurrency(ld.maxSalary)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Department Distribution</h2>
          </div>
          <DataTable columns={deptColumns} data={departmentDistribution} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Designations</h2>
          </div>
          <DataTable columns={recentColumns} data={recentDesignations} />
        </div>
      </div>
    </div>
  );
}
