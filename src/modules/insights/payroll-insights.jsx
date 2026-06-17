import { useState, useEffect } from "react";
import { getPayrollAnalytics } from "../../service/insightsService";
import StatsCard from "../../components/insights/StatsCard";
import DataTable from "../../components/insights/DataTable";
import { formatCurrency, formatPercent } from "../../components/insights/helpers";
import { CHART_COLORS } from "../../components/insights/chartColors";
import { DollarSign, Users, Clock, TrendingUp, Building2, Wallet } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function PayrollInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState("");
  useEffect(() => { getPayrollAnalytics().then(setData).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { summary, departmentPayroll, monthlyTrend } = data;

  const stats = [
    { title: "Gross Payroll", value: formatCurrency(summary.grossPayroll), change: summary.yoyChange, trend: "up", icon: DollarSign, subtitle: "Annual" },
    { title: "Net Payroll", value: formatCurrency(summary.netPayroll), change: 5.8, trend: "up", icon: Wallet, subtitle: "After deductions" },
    { title: "Total Benefits", value: formatCurrency(summary.totalBenefits), change: 4.2, trend: "up", icon: Users, subtitle: "Health, 401k, etc." },
    { title: "Total Overtime", value: formatCurrency(summary.totalOvertime), change: -2.1, trend: "down", icon: Clock, subtitle: "Year to date" },
    { title: "Avg Salary", value: formatCurrency(summary.avgSalary), change: 3.5, trend: "up", icon: TrendingUp, subtitle: "Company-wide" },
    { title: "Payroll/Revenue", value: formatPercent(summary.payrollToRevenue), change: -0.8, trend: "down", icon: Building2, subtitle: "Efficiency ratio" },
  ];

  const columns = [
    { key: "name", label: "Department", render: (v) => <span className="font-medium">{v}</span> },
    { key: "headcount", label: "Headcount" },
    { key: "gross", label: "Gross Payroll", render: (v) => formatCurrency(v) },
    { key: "net", label: "Net Payroll", render: (v) => formatCurrency(v) },
    { key: "benefits", label: "Benefits", render: (v) => formatCurrency(v) },
    { key: "overtime", label: "Overtime", render: (v) => formatCurrency(v) },
  ];

  let filteredDepts = departmentPayroll;
  if (selectedDept) filteredDepts = departmentPayroll.filter(d => d.name === selectedDept);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payroll Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Payroll cost breakdown and trend analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Department Payroll Comparison</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={departmentPayroll} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" width={90} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="gross" fill={CHART_COLORS.primary} name="Gross" barSize={12} />
              <Bar dataKey="net" fill={CHART_COLORS.success} name="Net" barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Monthly Payroll Trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="gross" stroke={CHART_COLORS.primary} strokeWidth={2} name="Gross Payroll" dot={false} />
              <Line type="monotone" dataKey="net" stroke={CHART_COLORS.success} strokeWidth={2} name="Net Payroll" dot={false} />
              <Line type="monotone" dataKey="overtime" stroke={CHART_COLORS.warning} strokeWidth={2} name="Overtime" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Benefits vs Overtime by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentPayroll}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}K`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="benefits" fill={CHART_COLORS.info} name="Benefits" barSize={12} />
              <Bar dataKey="overtime" fill={CHART_COLORS.warning} name="Overtime" barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Payroll Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={departmentPayroll} cx="50%" cy="50%" outerRadius={100} label={({ name, gross }) => `${name}: ${formatCurrency(gross)}`} dataKey="gross">
                {departmentPayroll.map((e, i) => (
                  <Cell key={e.name} fill={[CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.info, CHART_COLORS.secondary, CHART_COLORS.gray, "#f97316", "#ec4899", "#14b8a6", "#84cc16", "#a855f7"][i % 12]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Department Payroll Detail</h3>
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="">All Departments</option>
            {departmentPayroll.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
        </div>
        <DataTable columns={columns} data={filteredDepts} />
      </div>
    </div>
  );
}
