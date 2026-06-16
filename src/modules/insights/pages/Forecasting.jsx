import { useState } from "react";
import { useForecastingData } from "../hooks/useInsights.js";
import StatsCard from "../components/StatsCard.jsx";
import { formatCurrency, formatPercent } from "../utils/helpers.js";
import { CHART_COLORS } from "../types/index.js";
import { TrendingUp, TrendingDown, DollarSign, Users, BarChart3, Target } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function Forecasting() {
  const { data, loading } = useForecastingData();

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { summary, revenueForecast, expenseForecast, workforceForecast, scenarioAnalysis, trends } = data;

  const stats = [
    { title: "Next Qtr Revenue", value: formatCurrency(summary.nextQuarterRevenue), change: 8.5, trend: "up", icon: DollarSign, subtitle: "Q4 2026 forecast" },
    { title: "Projected Growth", value: formatPercent(summary.projectedGrowth), change: 0.5, trend: "up", icon: TrendingUp, subtitle: `${summary.confidenceInterval}% confidence` },
    { title: "Next Qtr Expenses", value: formatCurrency(summary.nextQuarterExpenses), change: 6.3, trend: "up", icon: TrendingDown, subtitle: "Q4 2026 forecast" },
    { title: "Workforce Projection", value: summary.workforceProjection, change: 3.4, trend: "up", icon: Users, subtitle: "End of 2026" },
    { title: "Avg Salary Proj.", value: formatCurrency(summary.avgSalaryProjection), change: 4.1, trend: "up", icon: BarChart3, subtitle: "2027 projection" },
    { title: "Confidence Level", value: `${summary.confidenceInterval}%`, change: 2, trend: "up", icon: Target, subtitle: "Model accuracy" },
  ];

  const scenarioColumns = [
    { key: "scenario", label: "Scenario", render: (v) => <span className="font-medium capitalize">{v}</span> },
    { key: "probability", label: "Probability", render: (v) => `${v}%` },
    { key: "revenue", label: "Projected Revenue", render: (v) => formatCurrency(v) },
    { key: "expenses", label: "Projected Expenses", render: (v) => formatCurrency(v) },
    { key: "margin", label: "Margin %", render: (v) => `${v}%` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Forecasting</h1>
        <p className="text-sm text-gray-500 mt-1">Revenue, expense and workforce projections with scenario analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Revenue Forecast with Confidence Intervals</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
              <Tooltip formatter={(v) => v ? formatCurrency(v) : "-"} />
              <Legend />
              <Area type="monotone" dataKey="upper" stroke="transparent" fill={CHART_COLORS.primary} fillOpacity={0.1} name="Upper Bound" />
              <Area type="monotone" dataKey="lower" stroke="transparent" fill={CHART_COLORS.primary} fillOpacity={0.1} name="Lower Bound" />
              <Line type="monotone" dataKey="forecast" stroke={CHART_COLORS.primary} strokeWidth={2} name="Forecast" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="actual" stroke={CHART_COLORS.success} strokeWidth={2} name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Expense Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={expenseForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
              <Tooltip formatter={(v) => v ? formatCurrency(v) : "-"} />
              <Legend />
              <Area type="monotone" dataKey="upper" stroke="transparent" fill={CHART_COLORS.danger} fillOpacity={0.1} name="Upper Bound" />
              <Area type="monotone" dataKey="lower" stroke="transparent" fill={CHART_COLORS.danger} fillOpacity={0.1} name="Lower Bound" />
              <Line type="monotone" dataKey="forecast" stroke={CHART_COLORS.danger} strokeWidth={2} name="Forecast" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="actual" stroke={CHART_COLORS.success} strokeWidth={2} name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Workforce Forecast</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={workforceForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke={CHART_COLORS.primary} strokeWidth={2} name="Actual" />
              <Line type="monotone" dataKey="forecast" stroke={CHART_COLORS.warning} strokeWidth={2} name="Forecast" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Historical Growth Trends</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trends.revenueGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Line type="monotone" dataKey="value" stroke={CHART_COLORS.primary} strokeWidth={2} name="Revenue" dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Margin Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trends.marginTrend}>
              <defs>
                <linearGradient id="marginGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.2}/><stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis domain={[25, 40]} tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Area type="monotone" dataKey="value" stroke={CHART_COLORS.success} fill="url(#marginGrad)" strokeWidth={2} name="Margin" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Scenario Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Scenario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prob.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Expenses</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {scenarioAnalysis.map((s) => (
                  <tr key={s.scenario} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">{s.scenario}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.probability}%</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(s.revenue)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(s.expenses)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.margin}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Revenue vs Expense Forecast</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenueForecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="quarter" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
            <Tooltip formatter={(v) => v ? formatCurrency(v) : "-"} />
            <Legend />
            <Bar dataKey="actual" fill={CHART_COLORS.success} name="Actual Revenue" barSize={12} />
            <Bar dataKey="forecast" fill={CHART_COLORS.primary} name="Forecast Revenue" barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
