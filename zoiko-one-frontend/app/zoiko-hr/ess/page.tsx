"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck, CalendarCheck, Clock, WalletCards, TrendingUp, Bell } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import { fetchESSDashboard, type ESSDashboardStats } from "../../lib/workforce-api";

export default function ESSDashboardPage() {
  const [stats, setStats] = useState<ESSDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchESSDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    { title: "Pending Tasks", value: stats?.pendingTasks ?? 0, icon: ClipboardCheck, trend: "Active", description: "Requests awaiting action" },
    { title: "Upcoming Leave", value: stats?.upcomingLeave ?? 0, icon: CalendarCheck, trend: "Scheduled", description: "Approved or pending leave" },
    { title: "Attendance (This Month)", value: stats?.attendanceThisMonth ?? 0, icon: Clock, trend: "Days Present", description: "Days attended this month" },
    { title: "Payslips Available", value: stats?.payslipsAvailable ?? 0, icon: WalletCards, trend: "Ready", description: "Payslips issued" },
    { title: "Learning Progress", value: `${stats?.learningProgress ?? 0}%`, icon: TrendingUp, trend: "Overall", description: "Course completion rate" },
    { title: "Unread Notifications", value: stats?.unreadNotifications ?? 0, icon: Bell, trend: "New", description: "Notifications to review" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Employee Self Service"
        description="View your profile, attendance, leave, documents, learning, and more."
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
