"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, Clock3, Calendar, UserCheck } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import { fetchAttendanceDashboard, type AttendanceDashboardStats } from "../../lib/workforce-api";

export default function AttendanceDashboardPage() {
  const [stats, setStats] = useState<AttendanceDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchAttendanceDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    { title: "Present Today", value: stats?.present ?? 0, icon: CheckCircle2, trend: "On Time", description: "Employees present today" },
    { title: "Absent", value: stats?.absent ?? 0, icon: XCircle, trend: "Absent", description: "Employees absent today" },
    { title: "Half Day", value: stats?.halfDay ?? 0, icon: Clock3, trend: "Partial", description: "Employees on half day" },
    { title: "On Leave", value: stats?.onLeave ?? 0, icon: Calendar, trend: "Planned", description: "Employees on leave" },
    { title: "Late Arrivals", value: stats?.lateArrivals ?? 0, icon: Clock, trend: "Late", description: "Late arrivals today" },
    { title: "Attendance %", value: `${stats?.attendancePct ?? 0}%`, icon: UserCheck, trend: "Overall", description: "Overall attendance rate" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Attendance Management"
        description="Dashboard overview of employee attendance, check-ins, and absence tracking."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-400">Loading dashboard...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpiCards.map((card) => (
            <KPICard key={card.title} {...card} />
          ))}
        </div>
      )}
    </SuperAdminShell>
  );
}
