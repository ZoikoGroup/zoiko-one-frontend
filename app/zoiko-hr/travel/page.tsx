"use client";

import { useEffect, useState } from "react";
import { Receipt, ClipboardCheck, CheckCircle2, XCircle, CircleDollarSign, Plane } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import { fetchTravelDashboard, type TravelDashboardStats } from "../../lib/workforce-api";

export default function TravelDashboardPage() {
  const [stats, setStats] = useState<TravelDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchTravelDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(val);

  const kpiCards = [
    { title: "Total Claims", value: stats?.totalClaims ?? 0, icon: Receipt, trend: "All Time", description: "Total expense claims submitted" },
    { title: "Pending Approvals", value: stats?.pendingApprovals ?? 0, icon: ClipboardCheck, trend: "Awaiting", description: "Approvals pending review" },
    { title: "Approved Claims", value: stats?.approvedClaims ?? 0, icon: CheckCircle2, trend: "Approved", description: "Claims approved" },
    { title: "Rejected Claims", value: stats?.rejectedClaims ?? 0, icon: XCircle, trend: "Rejected", description: "Claims rejected" },
    { title: "Reimbursement Amount", value: stats ? formatCurrency(stats.reimbursementAmount) : "$0", icon: CircleDollarSign, trend: "Total", description: "Amount reimbursed" },
    { title: "Travel Requests", value: stats?.travelRequests ?? 0, icon: Plane, trend: "Submitted", description: "Total travel requests" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Travel & Expense Management"
        description="Manage travel requests, expense claims, corporate travel, and reimbursement workflows."
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
