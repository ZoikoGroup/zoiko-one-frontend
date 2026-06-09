"use client";

import { useEffect, useState } from "react";
import { Briefcase, CheckCircle2, Circle, Package, Undo2, Wrench, TrendingUp } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import { fetchAssetDashboard, type AssetDashboardStats } from "../../lib/workforce-api";

export default function AssetDashboardPage() {
  const [stats, setStats] = useState<AssetDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchAssetDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    { title: "Total Assets", value: stats?.totalAssets ?? 0, icon: Briefcase, trend: "Registry", description: "All registered assets" },
    { title: "Allocated Assets", value: stats?.allocatedAssets ?? 0, icon: Package, trend: "In Use", description: "Currently allocated" },
    { title: "Available Assets", value: stats?.availableAssets ?? 0, icon: Circle, trend: "Ready", description: "Available for allocation" },
    { title: "Assets Under Maintenance", value: stats?.assetsUnderMaintenance ?? 0, icon: Wrench, trend: "In Repair", description: "Under maintenance" },
    { title: "Returned Assets", value: stats?.returnedAssets ?? 0, icon: Undo2, trend: "This Period", description: "Returned to inventory" },
    { title: "Asset Utilization", value: `${stats?.assetUtilizationPercent ?? 0}%`, icon: TrendingUp, trend: "Overall", description: "Allocation rate" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Asset Management"
        description="Monitor company assets, allocations, maintenance, and returns."
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
