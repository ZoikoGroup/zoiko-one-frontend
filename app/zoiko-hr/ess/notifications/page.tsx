"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import {
  fetchESSNotifications, markNotificationRead,
  type Notification,
} from "../../../lib/workforce-api";

const typeIcons: Record<string, React.ReactNode> = {
  INFO: <Info className="h-5 w-5 text-blue-400" />,
  WARNING: <AlertTriangle className="h-5 w-5 text-amber-400" />,
  SUCCESS: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
  ERROR: <XCircle className="h-5 w-5 text-rose-400" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchESSNotifications();
      let filtered = res.data;
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter((n) => n.message.toLowerCase().includes(s));
      }
      if (filter === "unread") filtered = filtered.filter((n) => !n.read);
      if (filter === "read") filtered = filtered.filter((n) => n.read);
      setTotal(filtered.length);
      setNotifications(filtered.slice(page * pageSize, (page + 1) * pageSize));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notifications.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [search, filter, page]);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark notification as read.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Notifications"
        description="View all your notifications and alerts."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search notifications..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <div className="flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-950 p-1">
          {(["all", "unread", "read"] as const).map((f) => (
            <button key={f} type="button" onClick={() => { setFilter(f); setPage(0); }}
              className={`rounded-2xl px-4 py-1.5 text-xs font-medium transition capitalize ${
                filter === f ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}>
              {f}{f === "unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Notifications <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="divide-y divide-slate-800">
            {notifications.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">No notifications found.</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`flex items-start gap-4 px-5 py-4 transition hover:bg-slate-900/60 ${!n.read ? "bg-slate-900/40" : ""}`}>
                  <div className="mt-0.5 shrink-0">{typeIcons[n.type]}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? "text-white font-medium" : "text-slate-400"}`}>{n.message}</p>
                    <p className="mt-1 text-xs text-slate-600">{n.date}</p>
                  </div>
                  {!n.read && (
                    <button type="button" onClick={() => handleMarkRead(n.id)}
                      className="shrink-0 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700 transition">
                      Mark read
                    </button>
                  )}
                </div>
              ))
            )}
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
