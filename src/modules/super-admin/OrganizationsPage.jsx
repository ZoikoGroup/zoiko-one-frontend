import { useState, useEffect, useCallback } from "react";
import PageHeader from "../../components/PageHeader";
import { Search, Building, Edit3, ShieldAlert, CheckCircle, Trash2, X, ChevronLeft, ChevronRight, Eye, Save } from "lucide-react";
import { superAdminService } from "../../service/superAdminService";

export default function SuperAdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingOrg, setEditingOrg] = useState(null);
  const [viewingOrg, setViewingOrg] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", is_active: true });

  const loadOrgs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, page_size: pageSize };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const data = await superAdminService.getOrganizations(params);
      setOrganizations(data.organizations || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error("Failed to load organizations", e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => { loadOrgs(); }, [loadOrgs]);

  const handleSuspend = async (id) => {
    try {
      await superAdminService.suspendOrganization(id);
      loadOrgs();
    } catch (e) { console.error(e); }
  };

  const handleActivate = async (id) => {
    try {
      await superAdminService.activateOrganization(id);
      loadOrgs();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;
    try {
      await superAdminService.deleteOrganization(id);
      loadOrgs();
    } catch (e) { console.error(e); }
  };

  const openEdit = (org) => {
    setEditingOrg(org);
    setEditForm({ name: org.name, is_active: org.is_active });
  };

  const handleSaveEdit = async () => {
    if (!editingOrg) return;
    try {
      await superAdminService.updateOrganization(editingOrg.id, editForm);
      setEditingOrg(null);
      loadOrgs();
    } catch (e) { console.error(e); }
  };

  const openView = (org) => setViewingOrg(org);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 font-sans">
      <PageHeader title="Organizations" description="Manage all organizations on the platform. View, edit, suspend, or delete organizations." />

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">All Organizations ({total})</h3>
          <div className="flex gap-3 items-center">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="rounded-full border border-slate-200 bg-slate-50 py-2 px-4 text-sm text-slate-700 outline-none focus:border-[#FF7A00]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:bg-white focus:border-[#FF7A00]"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Users</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {organizations.map((o) => (
                    <tr key={o.id} className="text-sm text-slate-650 hover:bg-slate-50/50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-550 border border-slate-200/50">
                            <Building className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-850">{o.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{o.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          o.subscription_plan === "enterprise" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                          o.subscription_plan === "professional" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          o.subscription_plan === "basic" ? "bg-[#FF7A00]/5 text-[#FF7A00] border border-[#FF7A00]/10" :
                          o.subscription_plan === "trial" ? "bg-purple-50 text-purple-600 border border-purple-100" :
                          "bg-slate-50 text-slate-600 border border-slate-100"
                        }`}>
                          {o.subscription_plan}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{o.user_count}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          o.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                        }`}>
                          {o.is_active ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2 text-slate-400">
                          <button onClick={() => openView(o)} className="p-1.5 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="View"><Eye className="h-4 w-4" /></button>
                          <button onClick={() => openEdit(o)} className="p-1.5 hover:text-[#FF7A00] hover:bg-slate-50 rounded-lg transition" title="Edit"><Edit3 className="h-4 w-4" /></button>
                          {o.is_active ? (
                            <button onClick={() => handleSuspend(o.id)} className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Suspend"><ShieldAlert className="h-4 w-4" /></button>
                          ) : (
                            <button onClick={() => handleActivate(o.id)} className="p-1.5 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition" title="Activate"><CheckCircle className="h-4 w-4" /></button>
                          )}
                          <button onClick={() => handleDelete(o.id)} className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">{total} total organizations</span>
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

      {/* Edit Modal */}
      {editingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Edit Organization</h3>
              <button onClick={() => setEditingOrg(null)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                <input
                  type="text" value={editForm.name}
                  onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm text-slate-800 outline-none focus:border-[#FF7A00]"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox" id="is_active" checked={editForm.is_active}
                  onChange={(e) => setEditForm(f => ({ ...f, is_active: e.target.checked }))}
                  className="rounded border-slate-300 text-[#FF7A00] focus:ring-[#FF7A00]"
                />
                <label htmlFor="is_active" className="text-sm text-slate-700">Active</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setEditingOrg(null)} className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSaveEdit} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF7A00] text-white text-sm font-semibold hover:bg-[#e56e00]"><Save className="h-4 w-4" /> Save</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">{viewingOrg.name}</h3>
              <button onClick={() => setViewingOrg(null)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-slate-400">Code:</span><span className="ml-2 font-semibold text-slate-700">{viewingOrg.code}</span></div>
                <div><span className="text-slate-400">Plan:</span><span className="ml-2 font-semibold text-slate-700 capitalize">{viewingOrg.subscription_plan}</span></div>
                <div><span className="text-slate-400">Users:</span><span className="ml-2 font-semibold text-slate-700">{viewingOrg.user_count}</span></div>
                <div><span className="text-slate-400">Status:</span>
                  <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${viewingOrg.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {viewingOrg.is_active ? "Active" : "Suspended"}
                  </span>
                </div>
                <div className="col-span-2"><span className="text-slate-400">Created:</span><span className="ml-2 text-slate-700">{new Date(viewingOrg.created_at).toLocaleString()}</span></div>
              </div>
            </div>
            <div className="flex mt-6 justify-end">
              <button onClick={() => setViewingOrg(null)} className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
