import { Plane, CheckCircle2, DollarSign, Users, Calendar, Clock } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useTravelDashboard } from "../hooks/useTravel";
import { formatDate, formatCurrency } from "../utils/helpers";

export default function TravelDashboard() {
  const { data, loading } = useTravelDashboard();

  if (loading) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const statCards = [
    { title: "Pending Requests", value: data.stats.pendingRequests, icon: Plane, change: 12, trend: "up" },
    { title: "Approved Trips", value: data.stats.approvedTrips, icon: CheckCircle2, change: 8, trend: "up" },
    { title: "Expenses This Month", value: formatCurrency(data.stats.monthlyExpenses), icon: DollarSign, change: -3, trend: "down" },
    { title: "Team Members", value: data.stats.teamMembers, icon: Users, change: 0, trend: "neutral" },
  ];

  const tripColumns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "destination", label: "Destination" },
    { key: "startDate", label: "Start", render: (v) => formatDate(v) },
    { key: "endDate", label: "End", render: (v) => formatDate(v) },
    { key: "purpose", label: "Purpose" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const activityColumns = [
    { key: "action", label: "Action", render: (v) => <span className="font-medium">{v}</span> },
    { key: "employee", label: "Employee" },
    { key: "destination", label: "Destination" },
    { key: "date", label: "Date", render: (v) => formatDate(v) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Travel Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of travel activities and metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Trips</h2>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <DataTable columns={tripColumns} data={data.upcomingTrips} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <DataTable columns={activityColumns} data={data.recentActivity} />
        </div>
      </div>
    </div>
  );
}
