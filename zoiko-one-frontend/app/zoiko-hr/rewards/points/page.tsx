"use client";

import { useEffect, useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, X, WalletCards, TrendingUp, TrendingDown, Award } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchRewardPointsBalances, fetchRewardPointTransactions, awardPoints, RewardPointBalance, RewardPointTransaction } from "../../../lib/workforce-api";

const tiers = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

interface BalanceWithName extends RewardPointBalance {
  employeeName: string;
}

interface TransactionWithName extends RewardPointTransaction {
  employeeName: string;
}

export default function RewardPointsPage() {
  const [activeTab, setActiveTab] = useState<"balances" | "transactions">("balances");

  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const [balances, setBalances] = useState<BalanceWithName[]>([]);
  const [transactions, setTransactions] = useState<TransactionWithName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ employeeId: "", points: "", reason: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [balRes, txRes] = await Promise.all([
        fetchRewardPointsBalances({ search: search || undefined, tier: tierFilter || undefined }),
        fetchRewardPointTransactions({}),
      ]);
      setBalances(
        balRes.data.map((b) => ({
          ...b,
          employeeName: b.employee ? `${b.employee.firstName} ${b.employee.lastName}` : b.employeeId,
        })),
      );
      const filteredTx = txRes.data.filter((t) => {
        if (!search) return true;
        const name = t.employee ? `${t.employee.firstName} ${t.employee.lastName}` : "";
        return name.toLowerCase().includes(search.toLowerCase()) || t.reason.toLowerCase().includes(search.toLowerCase());
      });
      setTransactions(
        filteredTx.map((t) => ({
          ...t,
          employeeName: t.employee ? `${t.employee.firstName} ${t.employee.lastName}` : t.employeeId,
        })),
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, tierFilter]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAwardPoints = async () => {
    setFormError("");
    if (!formData.employeeId || !formData.points || !formData.reason) {
      setFormError("Employee, Points, and Reason are required.");
      return;
    }
    setSaving(true);
    try {
      await awardPoints({
        employeeId: formData.employeeId,
        points: Number(formData.points),
        reason: formData.reason,
      });
      showToast("success", "Points awarded successfully.");
      setShowForm(false);
      await loadData();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Failed to award points");
    } finally {
      setSaving(false);
    }
  };

  const currentItems = activeTab === "balances" ? balances : transactions;
  const totalPages = Math.ceil(currentItems.length / pageSize);
  const start = currentItems.length > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, currentItems.length);
  const pagedBalances = balances.slice(page * pageSize, (page + 1) * pageSize);
  const pagedTransactions = transactions.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Reward Points"
        description="Track reward point balances, view transaction history, and award points to employees."
        action={
          <button type="button" onClick={() => { setShowForm(true); setFormError(""); setFormData({ employeeId: "", points: "", reason: "" }); }}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition">
            <Plus className="h-4 w-4" /> Award Points
          </button>
        }
      />

      {toast && (
        <div className={`mb-4 rounded-2xl px-5 py-3 text-sm font-medium shadow-lg transition-all ${
          toast.type === "success" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" : "bg-rose-500/15 text-rose-300 border border-rose-500/20"
        }`}>
          {toast.message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">{error}</div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search employees..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        {activeTab === "balances" && (
          <select value={tierFilter} onChange={(e) => { setTierFilter(e.target.value); setPage(0); }}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
            <option value="">All Tiers</option>
            {tiers.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
        <div className="flex rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden">
          <button type="button" onClick={() => { setActiveTab("balances"); setPage(0); }}
            className={`px-4 py-2.5 text-sm transition ${activeTab === "balances" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>Balances</button>
          <button type="button" onClick={() => { setActiveTab("transactions"); setPage(0); }}
            className={`px-4 py-2.5 text-sm transition ${activeTab === "transactions" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>Transactions</button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : activeTab === "balances" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pagedBalances.map((b) => (
            <div key={b.id} className="relative overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-white">{b.employeeName}</p>
                  <p className="text-xs text-slate-500">{b.employeeId}</p>
                </div>
                <StatusBadge status={b.tier} />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-slate-900/80 p-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
                  <p className="text-lg font-bold text-white">{b.totalPoints.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 p-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Used</p>
                  <p className="text-lg font-bold text-rose-400">{b.usedPoints.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 p-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Available</p>
                  <p className="text-lg font-bold text-emerald-400">{b.availablePoints.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
          {pagedBalances.length === 0 && (
            <div className="col-span-full py-12 text-center text-sm text-slate-500">No balances found.</div>
          )}
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Transaction History <span className="ml-2 text-sm font-normal text-slate-400">({transactions.length})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Employee</th>
                  <th className="px-5 py-3 font-semibold">Points</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Reason</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pagedTransactions.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-500">No transactions found.</td></tr>
                ) : (
                  pagedTransactions.map((t) => (
                    <tr key={t.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <p className="text-white">{t.employeeName}</p>
                        <p className="text-xs text-slate-500">{t.employeeId}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1 font-semibold ${
                          t.type === "EARNED" ? "text-emerald-400" : t.type === "REDEEMED" ? "text-rose-400" : "text-slate-400"
                        }`}>
                          {t.type === "EARNED" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {t.type === "EARNED" ? "+" : "-"}{t.points}
                        </span>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={t.type} /></td>
                      <td className="px-5 py-4 text-slate-400 max-w-[250px] truncate">{t.reason}</td>
                      <td className="px-5 py-4 text-slate-400 text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
              <p className="text-xs text-slate-500">Showing {start}&ndash;{end} of {currentItems.length}</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}
                  className="rounded-3xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                <span className="text-xs text-slate-400">Page {page + 1} of {totalPages}</span>
                <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}
                  className="rounded-3xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">Award Points</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            {formError && <p className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{formError}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Employee ID *</label>
                <input type="text" value={formData.employeeId} onChange={(e) => setFormData((f) => ({ ...f, employeeId: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="EMP-001" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Points *</label>
                <input type="number" min={1} value={formData.points} onChange={(e) => setFormData((f) => ({ ...f, points: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Reason *</label>
                <textarea value={formData.reason} onChange={(e) => setFormData((f) => ({ ...f, reason: e.target.value }))} rows={3}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 resize-none"
                  placeholder="Why are these points being awarded?" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">Cancel</button>
              <button type="button" onClick={handleAwardPoints} disabled={saving}
                className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition inline-flex items-center gap-2">
                {saving ? <><Award className="h-4 w-4 animate-spin" /> Awarding...</> : "Award Points"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}