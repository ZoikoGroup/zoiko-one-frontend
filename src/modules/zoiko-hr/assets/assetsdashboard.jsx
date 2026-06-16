import { useState, useEffect, useMemo } from "react";
import { Package, UserCheck, Archive, Wrench, PlusCircle, Monitor, Layers, Sofa, MonitorDown, Car } from "lucide-react";
import * as hr from "../../../service/hrService";

const categoryIcons = {
  Hardware: Monitor, Software: Layers, Furniture: Sofa, Electronics: MonitorDown, Vehicle: Car, Other: Package,
};

function StatCard({ title, value, icon: Icon, change, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change !== undefined && (
          <p className={`text-xs mt-1 flex items-center gap-1 ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
            {trend === "up" ? "\u2191" : "\u2193"} {Math.abs(change)} from last month
          </p>
        )}
      </div>
      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
        <Icon size={20} className="text-amber-600" />
      </div>
    </div>
  );
}

function SimpleBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600 w-8 text-right">{value}</span>
    </div>
  );
}

export default function AssetsDashboard() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await hr.getAssets();
        if (mounted) setAssets(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => {
    const total = assets.length;
    const assigned = assets.filter((a) => a.status === "assigned").length;
    const available = assets.filter((a) => a.status === "available").length;
    const maintenance = assets.filter((a) => a.status === "maintenance").length;
    const recentlyAdded = assets.filter((a) => {
      const d = a.created_at || a.assigned_date || a.purchaseDate || "";
      return d && new Date(d) > new Date(Date.now() - 30 * 86400000);
    }).length;
    return { total, assigned, available, maintenance, recentlyAdded };
  }, [assets]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    assets.forEach((a) => {
      const cat = a.category || "Other";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).map(([category, count]) => ({ category, count }));
  }, [assets]);

  const statusDistribution = useMemo(() => {
    const map = {};
    assets.forEach((a) => {
      const s = a.status || "unknown";
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  }, [assets]);

  const recentAdditions = useMemo(() => {
    return [...assets]
      .sort((a, b) => new Date(b.created_at || b.assigned_date || 0) - new Date(a.created_at || a.assigned_date || 0))
      .slice(0, 5)
      .map((a) => ({ name: a.name || a.itemName || "", tag: a.asset_tag || a.assetTag || "", added: a.created_at || a.assigned_date || "" }));
  }, [assets]);

  const maxCategory = Math.max(...categoryBreakdown.map((c) => c.count), 1);
  const maxStatus = Math.max(...statusDistribution.map((s) => s.count), 1);

  const statusBarColors = {
    assigned: "bg-blue-500", available: "bg-green-500", maintenance: "bg-orange-500", retired: "bg-gray-500", lost: "bg-red-500",
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assets Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of company asset inventory and status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Total Assets" value={stats.total} icon={Package} change={4} trend="up" />
        <StatCard title="Assigned" value={stats.assigned} icon={UserCheck} change={6} trend="up" />
        <StatCard title="Available" value={stats.available} icon={Archive} change={-2} trend="down" />
        <StatCard title="Under Maintenance" value={stats.maintenance} icon={Wrench} change={1} trend="up" />
        <StatCard title="Recently Added" value={stats.recentlyAdded} icon={PlusCircle} change={3} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h2>
          {categoryBreakdown.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No data available</p>
          ) : (
            <div className="space-y-3">
              {categoryBreakdown.map((item) => {
                const Icon = categoryIcons[item.category] || Package;
                return (
                  <div key={item.category} className="flex items-center gap-3">
                    <div className="p-1.5 bg-amber-50 rounded-lg"><Icon size={16} className="text-amber-600" /></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{item.category}</span>
                        <span className="text-gray-500">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-amber-500 rounded-full h-2 transition-all" style={{ width: `${(item.count / maxCategory) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
          {statusDistribution.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No data available</p>
          ) : (
            <div className="space-y-3">
              {statusDistribution.map((item) => (
                <div key={item.status} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 capitalize w-28">{item.status.replace(/_/g, " ")}</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className={`${statusBarColors[item.status] || "bg-gray-500"} rounded-full h-3 transition-all`} style={{ width: `${(item.count / maxStatus) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Added Assets</h2>
        {recentAdditions.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">No recent additions</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Asset Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Asset Tag</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Added Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentAdditions.map((a, i) => (
                  <tr key={a.tag || i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-amber-600">{a.tag}</td>
                    <td className="px-4 py-3 text-gray-500">{a.added ? new Date(a.added).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
