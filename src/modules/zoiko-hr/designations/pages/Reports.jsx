import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { useDesignationReports } from "../hooks/useDesignation";
import { levelColor, formatCurrency } from "../utils/helpers";

export default function DesignationReports() {
  const { data, loading } = useDesignationReports();
  const [search, setSearch] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading reports...</div>;

  const { level_distribution, dept_distribution, salary_analysis, trend } = data;

  const maxLevelCount = Math.max(...level_distribution.map((l) => l.count));
  const maxSalary = Math.max(...salary_analysis.map((s) => s.max));

  const allLevels = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Designation Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Analytics and insights on designation structure</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Levels</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{level_distribution.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Designations</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{level_distribution.reduce((a, b) => a + b.count, 0)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Departments</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{dept_distribution.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Avg Salary Spread</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(salary_analysis.reduce((a, b) => a + b.avg_salary, 0) / salary_analysis.length)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Level Distribution</h2>
          <div className="flex items-end gap-2 h-48">
            {allLevels.map((lvl) => {
              const ld = level_distribution.find((d) => d.level === lvl);
              const count = ld ? ld.count : 0;
              const pct = maxLevelCount > 0 ? (count / maxLevelCount) * 100 : 0;
              return (
                <div key={lvl} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500 font-medium">{count}</span>
                  <div className={`w-full rounded-t transition-all ${levelColor(lvl).split(" ")[0]} opacity-80`} style={{ height: `${Math.max(pct, 4)}%` }} />
                  <span className="text-xs text-gray-500">{lvl}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h2>
          <div className="space-y-3">
            {dept_distribution.map((d) => {
              const maxDept = Math.max(...dept_distribution.map((x) => x.count));
              const pct = (d.count / maxDept) * 100;
              return (
                <div key={d.dept} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-24 font-medium">{d.dept}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${pct}%` }}>
                      <span className="text-xs text-white font-medium">{d.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Salary Analysis by Level</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Level</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Average Salary</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Min</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Max</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Range Visualization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {salary_analysis.map((s) => {
                const minPct = (s.min / maxSalary) * 100;
                const maxPct = (s.max / maxSalary) * 100;
                return (
                  <tr key={s.level} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${levelColor(s.level)}`}>{s.level}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(s.avg_salary)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(s.min)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(s.max)}</td>
                    <td className="px-4 py-3 w-48">
                      <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="absolute h-full bg-orange-400 rounded-full opacity-70" style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }} />
                        <div className="absolute h-full w-0.5 bg-orange-700 rounded-full" style={{ left: `${(minPct + maxPct) / 2}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Designation Trend</h2>
        <div className="flex items-end gap-3 h-40">
          {trend.map((t) => {
            const maxTrend = Math.max(...trend.map((x) => x.total));
            const pct = (t.total / maxTrend) * 100;
            return (
              <div key={t.quarter} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex gap-0.5 w-full h-full items-end">
                  <div className="flex-1 bg-orange-400 rounded-t" style={{ height: `${(t.new_designations / maxTrend) * 100}%` }} />
                  <div className="flex-1 bg-orange-200 rounded-t" style={{ height: `${((t.total - t.new_designations) / maxTrend) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-500">{t.quarter}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> New</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-200" /> Existing</span>
        </div>
      </div>
    </div>
  );
}
