"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchAssets, updateAssetItemStatus,
  type AssetItem, type AssetItemStatus,
} from "../../../lib/workforce-api";

const CATEGORIES = ["All", "Laptops", "Monitors", "Mobiles", "Access Cards", "Software Licenses", "Other Equipment"];

export default function InventoryPage() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchAssets({
        search: search || undefined,
        category: categoryFilter !== "All" ? categoryFilter : undefined,
        status: statusFilter || undefined,
        skip: page * pageSize, take: pageSize,
      });
      setAssets(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assets.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [search, categoryFilter, statusFilter, page]);

  const handleStatusChange = async (id: string, status: AssetItemStatus) => {
    try {
      await updateAssetItemStatus(id, status);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update asset status.");
    }
  };

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Asset Inventory"
        description="View and manage all registered company assets."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text" placeholder="Search by name, ID, brand..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[140px]">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[140px]">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="UNDER_REPAIR">Under Repair</option>
          <option value="RETIRED">Retired</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Assets <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Asset ID</th>
                  <th className="px-5 py-3 font-semibold">Asset Name</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Brand</th>
                  <th className="px-5 py-3 font-semibold">Model</th>
                  <th className="px-5 py-3 font-semibold">Purchase Date</th>
                  <th className="px-5 py-3 font-semibold">Assigned To</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {assets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-sm text-slate-500">No assets found.</td>
                  </tr>
                ) : (
                  assets.map((a) => (
                    <tr key={a.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4 text-indigo-400 font-mono text-xs">{a.assetId}</td>
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{a.assetName}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{a.category}</td>
                      <td className="px-5 py-4 text-slate-400">{a.brand}</td>
                      <td className="px-5 py-4 text-slate-400">{a.model}</td>
                      <td className="px-5 py-4 text-slate-400">{a.purchaseDate}</td>
                      <td className="px-5 py-4 text-slate-400">{a.assignedTo ?? "—"}</td>
                      <td className="px-5 py-4">
                        <select value={a.status} onChange={(e) => handleStatusChange(a.id, e.target.value as AssetItemStatus)}
                          className="rounded-3xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300 outline-none focus:border-indigo-500">
                          <option value="ACTIVE">Active</option>
                          <option value="UNDER_REPAIR">Under Repair</option>
                          <option value="RETIRED">Retired</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
              <p className="text-xs text-slate-500">Showing {start}–{end} of {total}</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}
                  className="rounded-3xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-slate-400">Page {page + 1} of {totalPages}</span>
                <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}
                  className="rounded-3xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </SuperAdminShell>
  );
}
