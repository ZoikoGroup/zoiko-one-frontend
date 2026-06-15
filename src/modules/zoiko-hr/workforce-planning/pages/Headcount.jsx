import { useState } from "react";
import { Users, UserCheck, TrendingDown, DollarSign } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useHeadcountData } from "../hooks/useWorkforce";
import { percentageColor } from "../utils/helpers";

export default function HeadcountPlanning() {
  const { data: headcounts, loading } = useHeadcountData();
  const [search, setSearch] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading headcount data...</div>;

  const filtered = search
    ? headcounts.filter((h) => h.department.toLowerCase().includes(search.toLowerCase()))
    : headcounts;

  const totalCurrent = headcounts.reduce((s, h) => s + h.currentHeadcount, 0);
  const totalApproved = headcounts.reduce((s, h) => s + h.approvedHeadcount, 0);
  const totalHired = headcounts.reduce((s, h) => s + h.hiredThisQuarter, 0);
  const avgAttrition = (headcounts.reduce((s, h) => s + h.attritionRate, 0) / headcounts.length).toFixed(1);

  const columns = [
    { key: "department", label: "Department", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "currentHeadcount", label: "Current" },
    { key: "approvedHeadcount", label: "Approved" },
    { key: "budgetedHeadcount", label: "Budgeted" },
    { key: "hiredThisQuarter", label: "Hired (Q)" },
    { key: "attritionRate", label: "Attrition %", render: (v) => <span className={percentageColor(v)}>{v}%</span> },
    {
      key: "budgetUtilization", label: "Budget Utilization", render: (_, row) => {
        const pct = Math.round((row.currentHeadcount / row.budgetedHeadcount) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-100 rounded-full h-2">
              <div className={`h-2 rounded-full ${pct >= 90 ? "bg-green-500" : pct >= 75 ? "bg-teal-500" : "bg-yellow-500"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <span className={`text-xs font-medium ${percentageColor(pct)}`}>{pct}%</span>
          </div>
        );
      },
    },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Headcount Planning</h1>
        <p className="text-sm text-gray-500 mt-1">Department-wise headcount tracking and budget utilization</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Current" value={totalCurrent} icon={Users} change={3} trend="up" />
        <StatsCard title="Total Approved" value={totalApproved} icon={UserCheck} change={5} trend="up" />
        <StatsCard title="Hired This Quarter" value={totalHired} icon={TrendingDown} change={2} trend="up" />
        <StatsCard title="Avg Attrition Rate" value={`${avgAttrition}%`} icon={DollarSign} change={-0.5} trend="down" />
      </div>

      <div className="relative max-w-sm">
        <input type="text" placeholder="Search department..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
