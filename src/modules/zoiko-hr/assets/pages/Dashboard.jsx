import { Package, UserCheck, Archive, Wrench, PlusCircle, Monitor, MonitorDown, Sofa, Car, Layers } from "lucide-react";
import StatsCard from "../components/StatsCard";
import { useAssetsDashboard } from "../hooks/useAssets";
import { formatDate } from "../utils/helpers";

const categoryIcons = {
  Hardware: Monitor,
  Software: Layers,
  Furniture: Sofa,
  Electronics: MonitorDown,
  Vehicle: Car,
  Other: Package,
};

export default function AssetsDashboard() {
  const { data, loading } = useAssetsDashboard();

  if (loading) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const { stats, categoryBreakdown, statusDistribution } = data;
  const maxCategory = Math.max(...categoryBreakdown.map((c) => c.count));
  const maxStatus = Math.max(...statusDistribution.map((s) => s.count));

  const statCards = [
    { title: "Total Assets", value: stats.totalAssets, icon: Package, change: 4, trend: "up" },
    { title: "Assigned", value: stats.assigned, icon: UserCheck, change: 6, trend: "up" },
    { title: "Available", value: stats.available, icon: Archive, change: -2, trend: "down" },
    { title: "Under Maintenance", value: stats.maintenance, icon: Wrench, change: 1, trend: "up" },
    { title: "Recently Added", value: stats.recentlyAdded, icon: PlusCircle, change: 3, trend: "up" },
  ];

  const recentAdditions = [
    { name: "Mac Mini M2 Pro", tag: "AST-017", added: "2025-03-10" },
    { name: "LG UltraFine 32\" 4K", tag: "AST-020", added: "2025-03-15" },
    { name: "MacBook Air M3", tag: "AST-021", added: "2025-03-05" },
    { name: "Standing Desk - Jarvis", tag: "AST-009", added: "2025-03-01" },
    { name: "ThinkPad X1 Carbon", tag: "AST-006", added: "2025-02-15" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assets Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of company asset inventory and status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h2>
          <div className="space-y-3">
            {categoryBreakdown.map((item) => {
              const Icon = categoryIcons[item.category] || Package;
              const pct = (item.count / maxCategory) * 100;
              return (
                <div key={item.category} className="flex items-center gap-3">
                  <div className="p-1.5 bg-amber-50 rounded-lg"><Icon className="w-4 h-4 text-amber-600" /></div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{item.category}</span>
                      <span className="text-gray-500">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-amber-500 rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
          <div className="space-y-3">
            {statusDistribution.map((item) => {
              const pct = (item.count / maxStatus) * 100;
              const colors = {
                assigned: "bg-blue-500",
                available: "bg-green-500",
                maintenance: "bg-orange-500",
                retired: "bg-gray-500",
                lost: "bg-red-500",
              };
              const barColor = colors[item.status] || "bg-gray-500";
              return (
                <div key={item.status} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 capitalize w-28">{item.status.replace(/_/g, " ")}</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className={`${barColor} rounded-full h-3 transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Added Assets</h2>
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
              {recentAdditions.map((a) => (
                <tr key={a.tag} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-amber-600">{a.tag}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(a.added)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
