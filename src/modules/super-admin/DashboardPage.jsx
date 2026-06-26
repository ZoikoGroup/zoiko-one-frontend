import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import {
  LayoutDashboard, Building2, Users, CreditCard, AlertTriangle,
  Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Package, Clock
} from "lucide-react";
import { superAdminService } from "../../service/superAdminService";

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setError(null);
      const data = await superAdminService.getDashboardStats();
      setStats(data);
    } catch (e) {
      console.error("Failed to load dashboard stats", e);
      setError(e.message || "Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Total Organizations", value: stats?.total_organizations ?? 0, change: "", isPositive: true, icon: Building2, color: "text-[#FF7A00] bg-[#FF7A00]/10 border-[#FF7A00]/25" },
    { title: "Active Organizations", value: stats?.active_organizations ?? 0, change: "", isPositive: true, icon: Users, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/25" },
    { title: "Trial Organizations", value: stats?.trial_organizations ?? 0, change: "", isPositive: true, icon: CreditCard, color: "text-blue-600 bg-blue-500/10 border-blue-500/25" },
    { title: "Suspended", value: stats?.suspended_organizations ?? 0, change: "", isPositive: false, icon: AlertTriangle, color: "text-red-600 bg-red-500/10 border-red-500/25" },
    { title: "Total Users", value: stats?.total_users ?? 0, change: "", isPositive: true, icon: Users, color: "text-purple-600 bg-purple-500/10 border-purple-500/25" },
    { title: "HR Admins", value: stats?.hr_admin_count ?? 0, change: "", isPositive: true, icon: Users, color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/25" },
    { title: "Employees", value: stats?.employee_count ?? 0, change: "", isPositive: true, icon: Users, color: "text-teal-600 bg-teal-500/10 border-teal-500/25" },
    { title: "Active Products", value: stats?.active_products ?? 0, change: "", isPositive: true, icon: Package, color: "text-amber-600 bg-amber-500/10 border-amber-500/25" },
  ];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader title="Super Admin Dashboard" description="Comprehensive platform overview across all organizations and products." />

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={loadStats} className="ml-auto text-red-600 underline hover:text-red-800 text-xs font-semibold">Retry</button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s, idx) => (
          <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#FF7A00]/40 transition duration-255">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">{s.title}</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-800">{s.value}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  {s.change && s.change !== "" && (
                    s.isPositive ? <ArrowUpRight className="h-4 w-4 text-emerald-600" /> : <ArrowDownRight className="h-4 w-4 text-slate-400" />
                  )}
                  <span className={`text-xs font-semibold ${s.isPositive ? "text-emerald-600" : "text-slate-500"}`}>
                    {s.change}
                  </span>
                </div>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Platform Statistics</h3>
          {stats?.platform_stats && Object.keys(stats.platform_stats).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.platform_stats).map(([plan, count]) => (
                <div key={plan} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-sm font-semibold text-slate-700 capitalize">{plan}</span>
                  <span className="text-sm font-bold text-slate-800">{count} organizations</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No subscription data available</p>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Platform Activity</h3>
          {stats?.recent_activity && stats.recent_activity.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_activity.map((act) => (
                <div key={act.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7A00]/10 text-[#FF7A00]">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 capitalize truncate">{act.action} {act.entity_type}</p>
                    <p className="text-[10px] text-slate-400 truncate">{act.performed_by_email}</p>
                  </div>
                  <Clock className="h-3 w-3 text-slate-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
