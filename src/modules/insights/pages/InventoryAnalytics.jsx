import { useState } from "react";
import { useInventoryAnalytics } from "../hooks/useInsights.js";
import StatsCard from "../components/StatsCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import DataTable from "../components/DataTable.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatCurrency } from "../utils/helpers.js";
import { CHART_COLORS } from "../types/index.js";
import { Package, AlertTriangle, Truck, TrendingDown, Store, DollarSign } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function InventoryAnalytics() {
  const { data, loading } = useInventoryAnalytics();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "", location: "" });

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

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
    { key: "location", label: "Location" },
    { key: "quantity", label: "Qty" },
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Inventory tracking, stock levels and value analysis</p>
      </div>

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
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600">{a.current} / {a.min} min</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Inventory Items</h3>
        </div>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          filters={[
            { key: "category", placeholder: "All Categories", value: filters.category, options: ["Electronics", "Office Supplies", "Software Licenses", "Furniture", "Networking", "Security", "Peripherals", "Consumables"].map(c => ({ value: c, label: c })) },
            { key: "location", placeholder: "All Locations", value: filters.location, options: ["HQ - Floor 1", "HQ - Floor 2", "HQ - Floor 3", "Warehouse A", "Warehouse B", "Remote"].map(l => ({ value: l, label: l })) },
          ]}
          onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        />
        <DataTable columns={columns} data={filteredItems} />
      </div>
    </div>
  );
}
