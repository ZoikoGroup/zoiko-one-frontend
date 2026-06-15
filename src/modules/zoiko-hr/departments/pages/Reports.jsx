import { useState } from "react";
import { FileText, Download, TrendingUp, Users, Building2, CircleDollarSign, Calendar } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import { useDepartmentReports } from "../hooks/useDepartment";
import { formatCurrency } from "../utils/helpers";

export default function DepartmentReports() {
  const { data, loading } = useDepartmentReports();
  const [exporting, setExporting] = useState(false);

  if (loading) return <div className="p-6 text-gray-400">Loading reports...</div>;

  const { headcount_trend, budget_by_dept, department_growth } = data;

  const maxHeadcount = Math.max(...headcount_trend.map((h) => h.count));
  const maxBudget = Math.max(...budget_by_dept.map((b) => b.budget));
  const totalBudget = budget_by_dept.reduce((s, b) => s + b.budget, 0);
  const totalUtilized = budget_by_dept.reduce((s, b) => s + b.utilized, 0);
  const totalEmployees = headcount_trend[headcount_trend.length - 1]?.count || 0;
  const startEmployees = headcount_trend[0]?.count || 0;
  const growth = ((totalEmployees - startEmployees) / startEmployees * 100).toFixed(1);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      const csv = [
        ["Report Type", "Department", "Metric", "Value"],
        ...headcount_trend.map((h) => ["Headcount Trend", "", h.month, h.count]),
        ...budget_by_dept.map((b) => ["Budget by Dept", b.dept, "Budget", b.budget, "Utilized", b.utilized]),
        ...department_growth.map((g) => ["Dept Growth", "", g.quarter, `New: ${g.new_depts}, Total: ${g.total}`]),
      ].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "department-reports.csv";
      a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
    }, 500);
  };

  const statCards = [
    { title: "Total Departments", value: budget_by_dept.length, icon: Building2, change: null, trend: null },
    { title: "Total Headcount", value: totalEmployees, icon: Users, change: Number(growth), trend: "up" },
    { title: "Total Budget", value: formatCurrency(totalBudget), icon: CircleDollarSign, change: null, trend: null },
    { title: "Utilized Budget", value: formatCurrency(totalUtilized), icon: TrendingUp, change: Math.round((totalUtilized / totalBudget) * 100), trend: "up" },
  ];

  const budgetColumns = [
    { key: "dept", label: "Department", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "budget", label: "Budget", render: (v) => formatCurrency(v) },
    { key: "utilized", label: "Utilized", render: (v) => <span className="font-medium">{formatCurrency(v)}</span> },
    { key: "remaining", label: "Remaining", render: (_, row) => {
      const rem = row.budget - row.utilized;
      return <span className={`font-medium ${rem < 0 ? "text-red-600" : "text-green-600"}`}>{formatCurrency(rem)}</span>;
    }},
    { key: "utilPct", label: "Utilization", render: (_, row) => {
      const pct = Math.round((row.utilized / row.budget) * 100);
      return (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-gray-100 rounded-full h-2">
            <div className={`h-2 rounded-full ${pct > 90 ? "bg-red-500" : pct > 75 ? "bg-orange-500" : "bg-green-500"}`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-gray-500">{pct}%</span>
        </div>
      );
    }},
  ];

  const budgetData = budget_by_dept.map((b) => ({ ...b, remaining: b.budget - b.utilized }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Analytics and insights across all departments</p>
        </div>
        <button onClick={handleExport} disabled={exporting} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm font-medium disabled:bg-rose-400">
          <Download className="w-4 h-4" /> {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Headcount Trend</h2>
          <div className="flex items-end gap-2 h-48">
            {headcount_trend.map((h) => {
              const pct = (h.count / maxHeadcount) * 100;
              return (
                <div key={h.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] text-gray-500 font-medium">{h.count}</span>
                  <div className="w-full bg-rose-200 rounded-t" style={{ height: `${Math.max(pct, 3)}%` }} />
                  <span className="text-[10px] text-gray-400 -rotate-45 origin-right whitespace-nowrap">{h.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Growth</h2>
          <div className="space-y-4">
            {department_growth.map((g) => (
              <div key={g.quarter} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-rose-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{g.quarter}</p>
                    <p className="text-xs text-gray-500">{g.total} total departments</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-semibold ${g.new_depts > 0 ? "text-green-600" : "text-gray-400"}`}>
                    {g.new_depts > 0 ? `+${g.new_depts}` : g.new_depts === 0 ? "0" : g.new_depts}
                  </span>
                  <p className="text-[10px] text-gray-400">new</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Budget by Department</h2>
          <span className="text-xs text-gray-400">{budgetData.length} departments</span>
        </div>
        <DataTable columns={budgetColumns} data={budgetData} />
      </div>
    </div>
  );
}
