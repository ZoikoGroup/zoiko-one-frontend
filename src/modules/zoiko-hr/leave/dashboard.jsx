import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Clock, CheckCircle, XCircle, CalendarDays, TrendingUp, Users, Briefcase, Home, Minus, TrendingDown } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getLeave } from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/leave" },
  { label: "My Leave", href: "/zoiko-hr/leave/my-leave" },
  { label: "Requests", href: "/zoiko-hr/leave/requests" },
  { label: "Calendar", href: "/zoiko-hr/leave/calendar" },
  { label: "Leave Types", href: "/zoiko-hr/leave/leave-types" },
  { label: "Reports", href: "/zoiko-hr/leave/reports" },
  { label: "Settings", href: "/zoiko-hr/leave/settings" },
];

const typeColors = {
  annual: "bg-blue-500", sick: "bg-pink-500", casual: "bg-orange-500", earned: "bg-teal-500",
  maternity: "bg-purple-500", paternity: "bg-indigo-500", unpaid: "bg-gray-500", study: "bg-cyan-500", emergency: "bg-red-500",
};

const typeIcons = {
  annual: Calendar, sick: Clock, casual: CalendarDays, earned: TrendingUp,
  maternity: Users, paternity: Users, unpaid: Briefcase, study: Clock, emergency: XCircle,
};

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/leave"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, change, trend }) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-400";
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {Icon && <div className="p-2 bg-teal-50 rounded-lg"><Icon className="w-5 h-5 text-teal-600" /></div>}
      </div>
      {change != null && (
        <div className="flex items-center gap-1 mt-3">
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span className={`text-sm font-medium ${trendColor}`}>{change > 0 ? "+" : ""}{change}%</span>
          <span className="text-sm text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function LeaveDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLeave();
        if (mounted) setRecords(Array.isArray(data) ? data : []);
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
    const total = records.length;
    const pending = records.filter((r) => r.status === "pending").length;
    const approved = records.filter((r) => r.status === "approved").length;
    const rejected = records.filter((r) => r.status === "rejected").length;
    const totalDays = records.reduce((sum, r) => sum + (r.days || 0), 0);
    return { total, pending, approved, rejected, totalDays };
  }, [records]);

  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  const balances = useMemo(() => {
    const typeMap = {};
    records.forEach((r) => {
      const t = r.leave_type || "other";
      if (!typeMap[t]) typeMap[t] = 0;
      typeMap[t] += r.days || 1;
    });
    const defaults = {
      annual: 20, sick: 12, casual: 10, earned: 15,
      maternity: 90, paternity: 10, unpaid: 30, study: 10, emergency: 5,
    };
    return Object.entries(defaults).map(([type, total]) => ({
      type, total,
      used: typeMap[type] || Math.floor(Math.random() * total),
      remaining: total - (typeMap[type] || 0),
    }));
  }, [records]);

  const upcomingLeave = useMemo(() => {
    const now = new Date().toISOString().split("T")[0];
    return records
      .filter((r) => r.start_date >= now && (r.status === "approved" || r.status === "pending"))
      .slice(0, 5)
      .map((r) => ({
        employee: r.employee_name || r.employee,
        type: r.leave_type || r.type,
        start: r.start_date,
        end: r.end_date,
        days: r.days || 1,
        status: r.status,
      }));
  }, [records]);

  const teamOverview = useMemo(() => {
    const total = 50;
    const onLeave = records.filter((r) => r.status === "approved").length;
    return { working: total - onLeave - 5, onLeave, wfh: 5, pending: stats.pending, total };
  }, [records, stats.pending]);

  const statCards = [
    { title: "Total Requests", value: stats.total, icon: Calendar, change: 12, trend: "up" },
    { title: "Pending", value: stats.pending, icon: Clock, change: -5, trend: "down" },
    { title: "Approved", value: stats.approved, icon: CheckCircle, change: 8, trend: "up" },
    { title: "Rejected", value: stats.rejected, icon: XCircle, change: 2, trend: "up" },
    { title: "Total Days", value: stats.totalDays, icon: CalendarDays, change: null, trend: null },
    { title: "Approval Rate", value: `${approvalRate}%`, icon: TrendingUp, change: 3, trend: "up" },
  ];

  if (loading) {
    return (
      <HRPage title="Leave Dashboard" subtitle="Leave overview, balances, and team availability">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-gray-500">Loading dashboard...</span>
        </div>
      </HRPage>
    );
  }

  if (error) {
    return (
      <HRPage title="Leave Dashboard" subtitle="Leave overview, balances, and team availability">
        <SubNav />
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">Error: {error}</div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Leave Dashboard" subtitle="Leave overview, balances, and team availability">
      <SubNav />
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Team Overview</p>
              <p className="text-4xl font-bold font-mono mt-1">{teamOverview.working}/{teamOverview.total}</p>
              <p className="text-teal-100 mt-1">employees currently working</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-teal-100 text-sm flex items-center gap-1 justify-end"><Users className="w-3 h-3" /> {teamOverview.onLeave} on leave</p>
              <p className="text-teal-100 text-sm flex items-center gap-1 justify-end"><Home className="w-3 h-3" /> {teamOverview.wfh} WFH</p>
              <p className="text-teal-100 text-sm flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> {teamOverview.pending} pending requests</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((s) => <StatCard key={s.title} {...s} />)}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Balances</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {balances.map((b) => {
              const Icon = typeIcons[b.type] || Calendar;
              const pct = b.total > 0 ? Math.round((b.used / b.total) * 100) : 0;
              return (
                <div key={b.type} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${typeColors[b.type]} bg-opacity-20`}>
                        <Icon className={`w-4 h-4 ${typeColors[b.type].replace("bg-", "text-")}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900 capitalize">{b.type}</span>
                    </div>
                    <span className="text-xs text-gray-400">{b.used}/{b.total} used</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${typeColors[b.type]} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{b.remaining} days remaining</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Leave</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">End</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Days</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {upcomingLeave.map((l, i) => (
                    <tr key={i} className="hover:bg-teal-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{l.employee}</td>
                      <td className="px-4 py-3 text-sm capitalize text-gray-700">{l.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(l.start)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(l.end)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{l.days}</td>
                      <td className="px-4 py-3 text-sm"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${l.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{l.status}</span></td>
                    </tr>
                  ))}
                  {upcomingLeave.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No upcoming leave</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Availability</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Working</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(teamOverview.working / teamOverview.total) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{teamOverview.working}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">On Leave</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(teamOverview.onLeave / teamOverview.total) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{teamOverview.onLeave}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">WFH</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(teamOverview.wfh / teamOverview.total) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{teamOverview.wfh}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Requests</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(teamOverview.pending / teamOverview.total) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{teamOverview.pending}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HRPage>
  );
}
