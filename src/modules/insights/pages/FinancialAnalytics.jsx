import { useState } from "react";
import { useFinancialAnalytics } from "../hooks/useInsights.js";
import StatsCard from "../components/StatsCard.jsx";
import DataTable from "../components/DataTable.jsx";
import { formatCurrency, formatPercent } from "../utils/helpers.js";
import { CHART_COLORS } from "../types/index.js";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, FileText, Building2 } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from "recharts";

export default function FinancialAnalytics() {
  const { data, loading } = useFinancialAnalytics();

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { summary, revenueVsExpense, cashFlow, expenseBreakdown, revenueByStream, accountsReceivable } = data;

  const stats = [
    { title: "Total Revenue", value: formatCurrency(summary.totalRevenue), change: summary.yoyRevenueGrowth, trend: "up", icon: DollarSign, subtitle: "Last 12 months" },
    { title: "Net Profit", value: formatCurrency(summary.netProfit), change: summary.yoyProfitGrowth, trend: "up", icon: PiggyBank, subtitle: `Margin ${summary.profitMargin}%` },
    { title: "Total Expenses", value: formatCurrency(summary.totalExpenses), change: 5.2, trend: "up", icon: TrendingDown, subtitle: "Operating + COGS" },
    { title: "Outstanding AR", value: formatCurrency(summary.outstandingInvoices), change: -3.8, trend: "down", icon: FileText, subtitle: `${summary.collectionsRate}% collected` },
    { title: "Vendor Spend", value: formatCurrency(summary.vendorSpend), change: 2.1, trend: "up", icon: Building2, subtitle: "Annual" },
    { title: "Operating Exp", value: formatCurrency(summary.operatingExpenses), change: 4.5, trend: "up", icon: TrendingUp, subtitle: "SG&A" },
  ];

  const arColumns = [
    { key: "age", label: "Age" },
    { key: "amount", label: "Amount", render: (v) => formatCurrency(v) },
    { key: "count", label: "Invoices" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Revenue, expenses, cash flow and profitability analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueVsExpense}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.2}/><stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0}/></linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.2}/><stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.success} fill="url(#rev)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke={CHART_COLORS.danger} fill="url(#exp)" strokeWidth={2} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Cash Flow</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}K`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="operating" fill={CHART_COLORS.success} name="Operating" stackId="a" />
              <Bar dataKey="investing" fill={CHART_COLORS.warning} name="Investing" stackId="a" />
              <Bar dataKey="financing" fill={CHART_COLORS.info} name="Financing" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${formatCurrency(value)}`}>
                {expenseBreakdown.map((e, i) => (
                  <Cell key={e.name} fill={[CHART_COLORS.primary, CHART_COLORS.danger, CHART_COLORS.warning, CHART_COLORS.info, CHART_COLORS.success, CHART_COLORS.secondary, CHART_COLORS.gray, "#f97316"][i % 8]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Revenue by Stream</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByStream} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" width={140} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="value" fill={CHART_COLORS.primary} barSize={16} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Profit Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueVsExpense}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}K`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Line type="monotone" dataKey="profit" stroke={CHART_COLORS.success} strokeWidth={2} name="Net Profit" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Accounts Receivable Aging</h3>
          <DataTable columns={arColumns} data={accountsReceivable} />
        </div>
      </div>
    </div>
  );
}
