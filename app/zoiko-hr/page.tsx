import { getUsers, type UserRow } from "../services/superAdminService";
import SuperAdminShell from "../components/SuperAdminShell";
import PageHeader from "../components/PageHeader";
import KPICard from "../components/KPICard";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import GrowthLineChart from "../components/GrowthLineChart";
import { Users, UserCheck, UserPlus, TrendingUp, AlertCircle, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ZoikoHRPage() {
  const users = await getUsers();

  const columns: TableColumn<UserRow>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "tenantName", header: "Tenant" },
    { key: "status", header: "Status" },
    { key: "emailVerified", header: "Email Verified" },
    { key: "createdAt", header: "Joined" },
  ];

  // Dummy HR metrics data
  const hrMetrics = {
    totalEmployees: 2847,
    activeEmployees: 2651,
    newHires: 156,
    employeeEngagementScore: 78,
    turnoverRate: 12.4,
    performanceAverage: 85,
  };

  // Dummy trend data
  const employeeGrowthTrend = [
    { month: "Jan", value: 2200 },
    { month: "Feb", value: 2280 },
    { month: "Mar", value: 2400 },
    { month: "Apr", value: 2520 },
    { month: "May", value: 2610 },
    { month: "Jun", value: 2651 },
  ];

  const engagementTrend = [
    { month: "Jan", value: 72 },
    { month: "Feb", value: 74 },
    { month: "Mar", value: 75 },
    { month: "Apr", value: 76 },
    { month: "May", value: 77 },
    { month: "Jun", value: 78 },
  ];

  const performanceTrend = [
    { month: "Jan", value: 82 },
    { month: "Feb", value: 83 },
    { month: "Mar", value: 84 },
    { month: "Apr", value: 84 },
    { month: "May", value: 85 },
    { month: "Jun", value: 85 },
  ];

  return (
    <SuperAdminShell>
      <PageHeader 
        title="Zoiko HR" 
        description="Workforce management, analytics, and strategic HR operations." 
      />

      {/* KPI Cards Section */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <KPICard 
          title="Total Employees" 
          value={hrMetrics.totalEmployees.toLocaleString()} 
          icon={Users} 
          trend="+8.3% this month"
          description="Across all departments"
        />
        <KPICard 
          title="Active Employees" 
          value={hrMetrics.activeEmployees.toLocaleString()} 
          icon={UserCheck} 
          trend="+2.1% from last month"
          description="Currently employed"
        />
        <KPICard 
          title="New Hires" 
          value={hrMetrics.newHires} 
          icon={UserPlus} 
          trend="+24% YoY"
          description="This quarter"
        />
        <KPICard 
          title="Engagement Score" 
          value={`${hrMetrics.employeeEngagementScore}%`} 
          icon={Award} 
          trend="+6 points"
          description="Employee satisfaction"
        />
        <KPICard 
          title="Turnover Rate" 
          value={`${hrMetrics.turnoverRate}%`} 
          icon={AlertCircle} 
          trend="-1.2% from last year"
          description="Annual attrition"
        />
        <KPICard 
          title="Avg Performance" 
          value={`${hrMetrics.performanceAverage}/100`} 
          icon={TrendingUp} 
          trend="+3 points"
          description="Performance rating"
        />
      </section>

      {/* Charts Section */}
      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <GrowthLineChart
          title="Employee Growth"
          data={employeeGrowthTrend}
          dataKey="value"
          stroke="#38bdf8"
        />
        <GrowthLineChart
          title="Engagement Score Trend"
          data={engagementTrend}
          dataKey="value"
          stroke="#8b5cf6"
        />
        <GrowthLineChart
          title="Performance Trend"
          data={performanceTrend}
          dataKey="value"
          stroke="#10b981"
        />
      </section>

      {/* Users Table Section */}
      <section className="mt-8">
        <ReusableTable title="User Directory" columns={columns} data={users} />
      </section>
    </SuperAdminShell>
  );
}
