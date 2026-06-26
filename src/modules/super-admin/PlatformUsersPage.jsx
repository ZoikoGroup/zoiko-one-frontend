import { useState, useEffect, useCallback } from "react";
import PageHeader from "../../components/PageHeader";
import { Search, Users, ChevronLeft, ChevronRight, Building2, Shield, UserCheck } from "lucide-react";
import { superAdminService } from "../../service/superAdminService";

const ROLE_COLORS = {
  super_admin: "bg-red-50 text-red-600 border border-red-100",
  admin: "bg-[#FF7A00]/5 text-[#FF7A00] border border-[#FF7A00]/10",
  hr_admin: "bg-blue-50 text-blue-600 border border-blue-100",
  hr_manager: "bg-purple-50 text-purple-600 border border-purple-100",
  manager: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  employee: "bg-slate-50 text-slate-600 border border-slate-100",
};

export default function PlatformUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, page_size: pageSize };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const data = await superAdminService.getUsers(params);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error("Failed to load users", e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, roleFilter]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 font-sans">
      <PageHeader title="Platform Users" description="View all users across every organization on the platform." />

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
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-4">Status</th>
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
                      <td className="py-4 px-4 text-slate-500">{u.job_title || "-"}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          u.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                        }`}>
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
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
