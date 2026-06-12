"use client";

import { useEffect, useState } from "react";
import { Package, CheckCircle2, Wrench, Undo2, TrendingUp, Layers } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import { fetchAssetDashboard, type AssetDashboardStats } from "../../lib/workforce-api";

export default function AssetManagementDashboardPage() {
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
    { title: "Total Assets", value: stats?.totalAssets ?? 0, icon: Package, trend: "All Assets", description: "Total registered assets" },
    { title: "Allocated", value: stats?.allocatedAssets ?? 0, icon: CheckCircle2, trend: "In Use", description: "Assets currently allocated" },
    { title: "Available", value: stats?.availableAssets ?? 0, icon: Layers, trend: "Ready", description: "Assets available for allocation" },
    { title: "Under Maintenance", value: stats?.assetsUnderMaintenance ?? 0, icon: Wrench, trend: "In Service", description: "Assets under repair" },
    { title: "Returned", value: stats?.returnedAssets ?? 0, icon: Undo2, trend: "Processed", description: "Assets returned this period" },
    { title: "Utilization", value: `${stats?.assetUtilizationPercent ?? 0}%`, icon: TrendingUp, trend: "Overall", description: "Asset utilization rate" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Asset Management"
        description="Dashboard overview of all company assets, allocations, maintenance, and utilization."
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

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Link
          href="/zoiko-hr/assets/inventory"
          className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] transition hover:border-indigo-500/50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#141d2f]">
              <Package className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Inventory</h3>
              <p className="text-sm text-slate-400">View and manage all asset inventory</p>
            </div>
          </div>
        </Link>

        <Link
          href="/zoiko-hr/assets/allocation"
          className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] transition hover:border-indigo-500/50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#141d2f]">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Allocations</h3>
              <p className="text-sm text-slate-400">Track asset allocation records</p>
            </div>
          </div>
        </Link>

        <Link
          href="/zoiko-hr/assets/returns"
          className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] transition hover:border-indigo-500/50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#141d2f]">
              <Undo2 className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Returns</h3>
              <p className="text-sm text-slate-400">Manage returned assets</p>
            </div>
          </div>
        </Link>

        <Link
          href="/zoiko-hr/assets/maintenance"
          className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] transition hover:border-indigo-500/50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#141d2f]">
              <Wrench className="h-6 w-6 text-rose-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Maintenance</h3>
              <p className="text-sm text-slate-400">Track asset maintenance records</p>
            </div>
          </div>
        </Link>
      </div>
    </SuperAdminShell>
  );
}
