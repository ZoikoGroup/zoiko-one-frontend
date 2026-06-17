import { useState, useEffect } from "react";
import { getFinancialAnalytics, getComplianceAnalytics, getInventoryAnalytics, getProjectAnalytics, getForecastingData } from "../../service/insightsService";
import StatsCard from "../../components/insights/StatsCard";
import DataTable from "../../components/insights/DataTable";
import StatusBadge from "../../components/insights/StatusBadge";
import { formatCurrency, formatPercent, formatDate } from "../../components/insights/helpers";
import { CHART_COLORS } from "../../components/insights/chartColors";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, FileText, Building2, ShieldCheck, AlertTriangle, CheckCircle, Clock, Scale, Package, Truck, Store, Briefcase, BarChart3, Target } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const tabs = [
  { id: "financial", label: "Financial" },
  { id: "compliance", label: "Compliance" },
  { id: "inventory", label: "Inventory" },
  { id: "projects", label: "Projects" },
  { id: "forecasting", label: "Forecasting" },
];

export default function Analytics({ defaultTab = "financial" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [financial, setFinancial] = useState(null);
  const [compliance, setCompliance] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [projects, setProjects] = useState(null);
  const [forecasting, setForecasting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getFinancialAnalytics().then(setFinancial).catch(() => {}),
      getComplianceAnalytics().then(setCompliance).catch(() => {}),
      getInventoryAnalytics().then(setInventory).catch(() => {}),
      getProjectAnalytics().then(setProjects).catch(() => {}),
      getForecastingData().then(setForecasting).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Comprehensive business analytics across all domains</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab === "financial" && financial && <FinancialContent data={financial} />}
      {activeTab === "compliance" && compliance && <ComplianceContent data={compliance} />}
      {activeTab === "inventory" && inventory && <InventoryContent data={inventory} />}
      {activeTab === "projects" && projects && <ProjectsContent data={projects} />}
      {activeTab === "forecasting" && forecasting && <ForecastingContent data={forecasting} />}
    </div>
  );
}

function FinancialContent({ data }) {
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

function ComplianceContent({ data }) {
  const { summary, frameworkScores, monthlyTrend, findingsBySeverity, findingsByDepartment, upcomingDeadlines } = data;
  const stats = [
    { title: "Overall Score", value: `${summary.overallScore}%`, change: 3.5, trend: "up", icon: ShieldCheck, subtitle: "Compliance health" },
    { title: "Passed Controls", value: summary.passedControls, change: 8, trend: "up", icon: CheckCircle, subtitle: `${summary.failedControls} failed` },
    { title: "Open Findings", value: summary.openFindings, change: -5, trend: "down", icon: AlertTriangle, subtitle: `${summary.overdueActions} overdue` },
    { title: "Pending Reviews", value: summary.pendingReviews, change: 2, trend: "up", icon: Clock, subtitle: "Awaiting review" },
    { title: "Frameworks", value: summary.frameworks, change: 0, trend: "stable", icon: Scale, subtitle: "Active certifications" },
    { title: "Next Assessment", value: formatDate(summary.nextAssessment), change: null, trend: "stable", icon: FileText, subtitle: `Last: ${formatDate(summary.lastAssessment)}` },
  ];
  const columns = [
    { key: "title", label: "Deadline", render: (v) => <span className="font-medium">{v}</span> },
    { key: "deadline", label: "Due Date", render: (v) => formatDate(v) },
    { key: "owner", label: "Owner" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];
  const deptColumns = [
    { key: "name", label: "Department" },
    { key: "open", label: "Open", render: (v) => <span className={v > 2 ? "text-red-600 font-medium" : ""}>{v}</span> },
    { key: "closed", label: "Closed", render: (v) => <span className="text-emerald-600">{v}</span> },
    { key: "critical", label: "Critical", render: (v) => <span className={v > 0 ? "text-red-600 font-bold" : "text-gray-400"}>{v}</span> },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Framework Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={frameworkScores} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" width={100} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="score" fill={CHART_COLORS.primary} barSize={16} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Compliance Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrend}>
              <defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2}/><stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis domain={[60, 90]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Area type="monotone" dataKey="score" stroke={CHART_COLORS.primary} fill="url(#scoreGrad)" strokeWidth={2} name="Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Findings by Severity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={findingsBySeverity} cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`} dataKey="value">
                {findingsBySeverity.map((e, i) => <Cell key={e.name} fill={[CHART_COLORS.danger, CHART_COLORS.warning, CHART_COLORS.info, CHART_COLORS.success][i % 4]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Findings by Department</h3>
          <DataTable columns={deptColumns} data={findingsByDepartment} />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Upcoming Compliance Deadlines</h3>
        <DataTable columns={columns} data={upcomingDeadlines} />
      </div>
    </div>
  );
}

function InventoryContent({ data }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "", location: "" });
  const { summary, items, valueByCategory, stockTrend, lowStockAlerts } = data;
  const stats = [
    { title: "Total Items", value: summary.totalItems.toLocaleString(), change: 2.3, trend: "up", icon: Package, subtitle: `${summary.distinctItems} SKUs` },
    { title: "Total Value", value: formatCurrency(summary.totalValue), change: 4.1, trend: "up", icon: DollarSign, subtitle: "Inventory value" },
    { title: "Low Stock Items", value: summary.lowStockItems, change: 5, trend: "up", icon: AlertTriangle, subtitle: "Below minimum" },
    { title: "Pending Orders", value: summary.pendingOrders, change: -3, trend: "down", icon: Truck, subtitle: "On order" },
    { title: "Stockout Risk", value: `${summary.stockoutRisk}%`, change: 1.2, trend: "up", icon: TrendingDown, subtitle: "Items at risk" },
    { title: "Avg Turnover", value: `${summary.avgTurnoverDays} days`, change: -2, trend: "down", icon: Store, subtitle: "Inventory turnover" },
  ];
  const columns = [
    { key: "name", label: "Item", render: (v, r) => <div><span className="font-medium">{v}</span><div className="text-xs text-gray-400">{r.category}</div></div> },
    { key: "location", label: "Location" }, { key: "quantity", label: "Qty" },
    { key: "unitCost", label: "Unit Cost", render: (v) => formatCurrency(v) },
    { key: "totalValue", label: "Total Value", render: (v) => formatCurrency(v) },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "lastRestocked", label: "Last Restocked" },
  ];
  let filteredItems = [...items];
  if (search) filteredItems = filteredItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  if (filters.category) filteredItems = filteredItems.filter(i => i.category === filters.category);
  if (filters.location) filteredItems = filteredItems.filter(i => i.location === filters.location);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Inventory Value by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={valueByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}K`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="value" fill={CHART_COLORS.primary} name="Value" barSize={12} />
              <Bar dataKey="count" fill={CHART_COLORS.info} name="Count" barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Stock Movement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="incoming" stroke={CHART_COLORS.success} strokeWidth={2} name="Incoming" dot={false} />
              <Line type="monotone" dataKey="outgoing" stroke={CHART_COLORS.danger} strokeWidth={2} name="Outgoing" dot={false} />
              <Line type="monotone" dataKey="damaged" stroke={CHART_COLORS.warning} strokeWidth={2} name="Damaged" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {lowStockAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Low Stock Alerts</h3>
            <span className="text-sm text-red-600 ml-2">{lowStockAlerts.length} items below minimum threshold</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockAlerts.map(a => (
              <div key={a.id} className="bg-white rounded-lg border border-red-100 p-3 flex items-center justify-between">
                <div><p className="text-sm font-medium text-gray-900">{a.name}</p><p className="text-xs text-gray-500">{a.location}</p></div>
                <div className="text-right"><p className="text-sm font-semibold text-red-600">{a.current} / {a.min} min</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4"><h3 className="text-base font-semibold text-gray-900">Inventory Items</h3></div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full max-w-sm pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          <select value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option value="">All Categories</option>{["Electronics", "Office Supplies", "Software Licenses", "Furniture", "Networking", "Security"].map(c => <option key={c} value={c}>{c}</option>)}</select>
          <select value={filters.location} onChange={e => setFilters(p => ({ ...p, location: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option value="">All Locations</option>{["HQ - Floor 1", "HQ - Floor 2", "Warehouse A", "Warehouse B"].map(l => <option key={l} value={l}>{l}</option>)}</select>
        </div>
        <DataTable columns={columns} data={filteredItems} />
      </div>
    </div>
  );
}

function ProjectsContent({ data }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", category: "" });
  const { summary, projects, statusDistribution, budgetByCategory, timeline } = data;
  const stats = [
    { title: "Total Projects", value: summary.totalProjects, change: 8.2, trend: "up", icon: Briefcase, subtitle: `${summary.activeProjects} active` },
    { title: "Completed (YTD)", value: summary.completedThisYear, change: 14.3, trend: "up", icon: CheckCircle, subtitle: "This year" },
    { title: "At Risk", value: summary.atRisk, change: 2, trend: "up", icon: AlertTriangle, subtitle: "Needs attention" },
    { title: "Over Budget", value: summary.overBudget, change: -1, trend: "down", icon: DollarSign, subtitle: "Exceeding budget" },
    { title: "Total Budget", value: formatCurrency(summary.totalBudget), change: 5.5, trend: "up", icon: TrendingUp, subtitle: `${summary.avgCompletion}% avg completion` },
    { title: "Total Spent", value: formatCurrency(summary.totalSpent), change: 7.2, trend: "up", icon: Clock, subtitle: `${((summary.totalSpent / summary.totalBudget) * 100).toFixed(0)}% utilized` },
  ];
  const columns = [
    { key: "name", label: "Project", render: (v, r) => <div><span className="font-medium">{v}</span><div className="text-xs text-gray-400">{r.category}</div></div> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "budget", label: "Budget", render: (v) => formatCurrency(v) },
    { key: "spent", label: "Spent", render: (v) => formatCurrency(v) },
    { key: "progress", label: "Progress", render: (v) => <div className="flex items-center gap-2"><div className="w-24 bg-gray-100 rounded-full h-2"><div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${v}%` }} /></div><span className="text-xs">{v}%</span></div> },
    { key: "teamSize", label: "Team" }, { key: "deadline", label: "Deadline" },
    { key: "priority", label: "Priority", render: (v) => <span className={`capitalize text-xs font-medium px-2 py-0.5 rounded-full ${v === "critical" ? "bg-red-100 text-red-700" : v === "high" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>{v}</span> },
  ];
  let filteredProjects = [...projects];
  if (search) filteredProjects = filteredProjects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (filters.status) filteredProjects = filteredProjects.filter(p => p.status === filters.status);
  if (filters.category) filteredProjects = filteredProjects.filter(p => p.category === filters.category);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusDistribution} cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`} dataKey="value">
                {statusDistribution.map((e, i) => <Cell key={e.name} fill={[CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger][i % 3]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Budget by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={budgetByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="budget" fill={CHART_COLORS.primary} name="Budget" barSize={16} />
              <Bar dataKey="spent" fill={CHART_COLORS.warning} name="Spent" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Project Timeline</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip /><Legend />
            <Line type="monotone" dataKey="started" stroke={CHART_COLORS.primary} strokeWidth={2} name="Started" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="completed" stroke={CHART_COLORS.success} strokeWidth={2} name="Completed" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4"><h3 className="text-base font-semibold text-gray-900">All Projects</h3></div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full max-w-sm pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          <select value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option value="">All Statuses</option>{["on_track", "at_risk", "over_budget", "completed"].map(s => <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}</select>
          <select value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"><option value="">All Categories</option>{["Internal", "Client", "R&D", "Maintenance"].map(c => <option key={c} value={c}>{c}</option>)}</select>
        </div>
        <DataTable columns={columns} data={filteredProjects} />
      </div>
    </div>
  );
}

function ForecastingContent({ data }) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Revenue Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueForecast}>
              <defs><linearGradient id="revFcast" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/><stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/></linearGradient></defs>
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
              <defs><linearGradient id="expFcast" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.1}/><stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0}/></linearGradient></defs>
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
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="actual" stroke={CHART_COLORS.primary} strokeWidth={2} name="Actual" />
              <Line type="monotone" dataKey="forecast" stroke={CHART_COLORS.warning} strokeWidth={2} name="Forecast" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Growth Trends</h3>
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
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Scenario Analysis</h3>
        <DataTable columns={scenarioColumns} data={scenarioAnalysis} />
      </div>
    </div>
  );
}
