import { useState, useEffect, useCallback } from "react";
import PageHeader from "../../components/PageHeader";
import {
  AlertTriangle, Search, Users, ChevronLeft, ChevronRight,
  Building2, Shield, UserCheck, CheckCircle,
  XCircle, Lock, Unlock, Clock, Eye, Edit3,
} from "lucide-react";
import { superAdminService } from "../../service/superAdminService";

const ROLE_COLORS = {
  super_admin: "bg-red-50 text-red-600 border border-red-100",
  admin: "bg-[#FF7A00]/5 text-[#FF7A00] border border-[#FF7A00]/10",
  hr_admin: "bg-blue-50 text-blue-600 border border-blue-100",
  hr_manager: "bg-purple-50 text-purple-600 border border-purple-100",
  manager: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  employee: "bg-slate-50 text-slate-600 border border-slate-100",
};

const STATUS_BADGES = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  locked: "bg-amber-50 text-amber-700 border border-amber-100",
  deactivated: "bg-red-50 text-red-700 border border-red-100",
};

export default function PlatformUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const params = { page, page_size: pageSize };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const data = await superAdminService.getUsers(params);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (e) {
      setError(e.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, roleFilter]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  useEffect(() => {
    if (actionMsg) {
      const t = setTimeout(() => setActionMsg(null), 3000);
      return () => clearTimeout(t);
    }
  }, [actionMsg]);

  const doAction = async (label, fn) => {
    setError(null);
    try {
      await fn();
      setActionMsg(`${label} successful`);
      await loadUsers();
    } catch (e) {
      setError(`${label} failed: ${e.message}`);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 font-sans">
      <PageHeader title="Platform Users" description="User Lifecycle Management — manage users across every organization." />

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={loadUsers} className="ml-auto text-red-600 underline hover:text-red-800 text-xs font-semibold">Retry</button>
        </div>
      )}

      {actionMsg && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 text-sm flex items-center gap-3">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">All Users ({total})</h3>
          <div className="flex gap-3 items-center">
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="rounded-full border border-slate-200 bg-slate-50 py-2 px-4 text-sm text-slate-700 outline-none focus:border-[#FF7A00]"
            >
              <option value="">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Organization Admin</option>
              <option value="hr_admin">HR Admin</option>
              <option value="hr_manager">HR Manager</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:bg-white focus:border-[#FF7A00]"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
            No users found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="text-sm text-slate-650 hover:bg-slate-50/50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] text-xs font-bold">
                            {u.first_name?.[0]}{u.last_name?.[0]}
                          </div>
                          <span className="font-semibold text-slate-800">{u.first_name} {u.last_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-500">{u.email}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[u.role] || ROLE_COLORS.employee}`}>
                          {u.role === "super_admin" ? <Shield className="h-3 w-3" /> : u.role === "admin" ? <Building2 className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                          {u.role.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{u.organization_name}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGES[u.status] || STATUS_BADGES.active}`}>
                          {u.status === "locked" ? "Locked" : u.status === "deactivated" ? "Deactivated" : "Active"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1.5 flex-wrap">
                          <button
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                            title="View User"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                            title="Edit User"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          {u.is_active && u.status !== "locked" && u.status !== "deactivated" && (
                            <button
                              onClick={() => doAction("Disable", () => superAdminService.disableUser(u.id))}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                              title="Disable User"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {(!u.is_active || u.status === "deactivated") && (
                            <button
                              onClick={() => doAction("Enable", () => superAdminService.enableUser(u.id))}
                              className="p-1.5 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition"
                              title="Enable User"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {u.status !== "locked" && u.is_active && (
                            <button
                              onClick={() => doAction("Lock", () => superAdminService.lockUser(u.id))}
                              className="p-1.5 rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 transition"
                              title="Lock User"
                            >
                              <Lock className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {u.status === "locked" && (
                            <button
                              onClick={() => doAction("Unlock", () => superAdminService.unlockUser(u.id))}
                              className="p-1.5 rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 transition"
                              title="Unlock User"
                            >
                              <Unlock className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              try {
                                const hist = await superAdminService.getUserAuditHistory(u.id);
                                alert(`Audit History for ${u.first_name} ${u.last_name} (${u.email}):\n\n` +
                                  (hist.history || []).map(h =>
                                    `[${h.created_at}] ${h.action} by ${h.performed_by_email}\n  ${JSON.stringify(h.details)}`
                                  ).join("\n\n") || "No history found");
                              } catch (e) {
                                setError("Failed to load audit history: " + e.message);
                              }
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                            title="View Audit History"
                          >
                            <Clock className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">{total} total users</span>
                <div className="flex gap-2 items-center">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                  <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
