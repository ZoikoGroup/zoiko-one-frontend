import { useState, useEffect, useMemo } from "react";
import { Search, Download, Eye } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getAttendanceAuditLogs } from "../../../service/hrService";



const ACTION_OPTIONS = ["created", "updated", "deleted", "approved", "rejected", "resolved", "escalated", "synced", "imported"];

const ACTION_COLORS = {
  created: "bg-green-100 text-green-800",
  updated: "bg-blue-100 text-blue-800",
  deleted: "bg-red-100 text-red-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  resolved: "bg-green-100 text-green-800",
  escalated: "bg-orange-100 text-orange-800",
  synced: "bg-purple-100 text-purple-800",
  imported: "bg-indigo-100 text-indigo-800",
};



function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ChangeDetails({ changes }) {
  const [open, setOpen] = useState(false);
  if (!changes) return <span className="text-gray-400">-</span>;

  let parsed = changes;
  if (typeof changes === "string") {
    try { parsed = JSON.parse(changes); } catch { return <span className="text-xs text-gray-500 truncate max-w-[200px] block">{changes}</span>; }
  }

  const entries = Array.isArray(parsed) ? parsed : Object.entries(parsed).map(([field, vals]) => {
    if (typeof vals === "object" && vals !== null && !Array.isArray(vals)) {
      return { field, from: vals.from ?? vals.old ?? "-", to: vals.to ?? vals.new ?? "-" };
    }
    return { field, from: Array.isArray(vals) ? (vals[0] ?? "-") : "-", to: Array.isArray(vals) ? (vals[1] ?? "-") : "-" };
  });

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
        <Eye className="w-3 h-3" /> {entries.length} change{entries.length > 1 ? "s" : ""}
      </button>
      {open && (
        <div className="absolute left-0 top-6 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[280px]">
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {entries.map((e, i) => (
              <div key={i} className="text-xs">
                <span className="font-semibold text-gray-700">{e.field}:</span>{" "}
                <span className="text-red-600 line-through">{String(e.from).substring(0, 50)}</span>{" "}
                <span className="text-green-600">{String(e.to).substring(0, 50)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AttendanceAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAttendanceAuditLogs();
        if (mounted) setLogs(Array.isArray(data) ? data : data?.items || data?.logs || []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load audit logs");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const entityTypes = useMemo(() => {
    const types = new Set(logs.map((l) => l.entity_type || l.entityType).filter(Boolean));
    return [...types].sort();
  }, [logs]);

  const filtered = useMemo(() => {
    let result = logs;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        (r.employee_name || r.employee || "").toLowerCase().includes(q) ||
        (r.performed_by || r.performedBy || "").toLowerCase().includes(q) ||
        (r.ip_address || r.ipAddress || "").toLowerCase().includes(q)
      );
    }
    if (actionFilter) result = result.filter((r) => (r.action || "") === actionFilter);
    if (entityFilter) result = result.filter((r) => (r.entity_type || r.entityType || "") === entityFilter);
    if (dateRange.from) result = result.filter((r) => (r.created_at || r.timestamp || r.createdAt) >= dateRange.from);
    if (dateRange.to) result = result.filter((r) => (r.created_at || r.timestamp || r.createdAt) <= dateRange.to);
    return result;
  }, [logs, search, actionFilter, entityFilter, dateRange]);

  if (loading) {
    return (
      <HRPage title="Audit Logs" subtitle="Track attendance record changes and user activity">
                <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading audit logs...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Audit Logs" subtitle="Track attendance record changes and user activity">
            <div className="space-y-6">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-sm text-gray-500 mt-1">Attendance audit trail — read-only view</p>
          </div>
          <button onClick={async () => {
            try {
              const csvRows = [["Timestamp", "Employee", "Action", "Entity Type", "Entity ID", "Changes", "Performed By", "IP Address"]];
              filtered.forEach((r) => {
                csvRows.push([
                  r.created_at || r.timestamp || "",
                  r.employee_name || r.employee || "",
                  r.action || "",
                  r.entity_type || r.entityType || "",
                  (r.entity_id || r.entityId || "").toString(),
                  typeof r.changes === "string" ? r.changes : JSON.stringify(r.changes || ""),
                  r.performed_by || r.performedBy || "",
                  r.ip_address || r.ipAddress || "",
                ]);
              });
              const csv = csvRows.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "attendance_audit_logs.csv"; a.click();
              URL.revokeObjectURL(url);
            } catch {
              // silent
            }
          }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by employee, user, or IP..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            <option value="">All Actions</option>
            {ACTION_OPTIONS.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
          <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            <option value="">All Entities</option>
            {entityTypes.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
          <input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="From" />
          <input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="To" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium">
              {logs.length === 0 ? "No audit logs available yet." : "No logs match your filters."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Changes</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Performed By</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filtered.map((r, i) => {
                    const action = r.action || "unknown";
                    const actionColor = ACTION_COLORS[action] || "bg-gray-100 text-gray-800";
                    return (
                      <tr key={r.id || i} className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{formatDateTime(r.created_at || r.timestamp || r.createdAt)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.employee_name || r.employee || "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${actionColor}`}>{action}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{r.entity_type || r.entityType || "-"}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-500">{r.entity_id || r.entityId || "-"}</td>
                        <td className="px-4 py-3 text-sm">
                          <ChangeDetails changes={r.changes} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{r.performed_by || r.performedBy || "-"}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-400">{r.ip_address || r.ipAddress || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400 text-center">
          Showing {filtered.length} of {logs.length} audit log entries
        </div>
      </div>
    </HRPage>
  );
}

