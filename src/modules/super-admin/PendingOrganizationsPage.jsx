import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  AlertTriangle, Search, Building, CheckCircle, XCircle, ShieldAlert,
  RotateCcw, Eye, ChevronLeft, ChevronRight, Clock, Mail, Phone,
  User, MessageSquare, RefreshCw, FileText, ThumbsUp, ThumbsDown
} from "lucide-react";
import { superAdminService } from "../../service/superAdminService";

export default function PendingOrganizationsPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [suspended, setSuspended] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [confirmModal, setConfirmModal] = useState(null);
  const [detailOrg, setDetailOrg] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const params = { page, page_size: pageSize };
      const [pendingData, approvedData, rejectedData, suspendedData] = await Promise.all([
        superAdminService.getPendingOrganizations(params),
        superAdminService.getApprovedOrganizations(params),
        superAdminService.getRejectedOrganizations(params),
        superAdminService.getSuspendedOrganizations(params),
      ]);
      setPending(pendingData.organizations || []);
      setApproved(approvedData.organizations || []);
      setRejected(rejectedData.organizations || []);
      setSuspended(suspendedData.organizations || []);
    } catch (e) {
      console.error("Failed to load", e);
      setError(e.message || "Failed to load organizations.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => { loadData(); }, [loadData]);

  const getList = () => {
    switch (activeTab) {
      case "pending": return pending;
      case "approved": return approved;
      case "rejected": return rejected;
      case "suspended": return suspended;
      default: return pending;
    }
  };

  const handleApprove = async (org) => {
    setConfirmModal({ org, action: "approve" });
  };

  const confirmApprove = async () => {
    if (!confirmModal) return;
    const { org } = confirmModal;
    setActionLoading(org.id);
    try {
      await superAdminService.approveOrganization(org.id);
      setConfirmModal(null);
      loadData();
    } catch (e) {
      setError(e.message || "Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (org) => {
    setRejectModal(org);
    setRejectReason("");
  };

  const confirmReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    setActionLoading(rejectModal.id);
    try {
      await superAdminService.rejectOrganization(rejectModal.id, { reason: rejectReason });
      setRejectModal(null);
      setRejectReason("");
      loadData();
    } catch (e) {
      setError(e.message || "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async (org) => {
    setConfirmModal({ org, action: "reactivate" });
  };

  const confirmReactivate = async () => {
    if (!confirmModal) return;
    const { org } = confirmModal;
    setActionLoading(org.id);
    try {
      await superAdminService.reactivateOrganization(org.id);
      setConfirmModal(null);
      loadData();
    } catch (e) {
      setError(e.message || "Failed to reactivate");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (org) => {
    if (!confirm(`Suspend organization "${org.name}"? This will block all user logins.`)) return;
    setActionLoading(org.id);
    try {
      await superAdminService.suspendOrganization(org.id);
      loadData();
    } catch (e) {
      setError(e.message || "Failed to suspend");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (org) => {
    if (!confirm(`Delete registration for "${org.name}"? This cannot be undone.`)) return;
    setActionLoading(org.id);
    try {
      await superAdminService.deleteOrganization(org.id);
      loadData();
    } catch (e) {
      setError(e.message || "Failed to delete");
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = [
    { key: "pending", label: "Pending", count: pending.length },
    { key: "approved", label: "Approved", count: approved.length },
    { key: "rejected", label: "Rejected", count: rejected.length },
    { key: "suspended", label: "Suspended", count: suspended.length },
  ];

  const StatusBadge = ({ status }) => {
    const map = {
      PENDING: "bg-amber-50 text-amber-700 border-amber-200",
      ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
      REJECTED: "bg-red-50 text-red-700 border-red-200",
      SUSPENDED: "bg-slate-50 text-slate-700 border-slate-200",
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${map[status] || "bg-slate-50 text-slate-600"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader title="Organization Approvals" description="Review, approve, or reject organization registration requests." />

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => { setError(null); loadData(); }} className="ml-auto text-red-600 underline hover:text-red-800 text-xs font-semibold">Retry</button>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex gap-2 mb-6 border-b border-slate-100 pb-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === t.key
                  ? "bg-[#FF7A00] text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
          <button onClick={loadData} className="ml-auto p-2 text-slate-400 hover:text-[#FF7A00] hover:bg-slate-50 rounded-lg transition" title="Refresh">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : getList().length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Building className="h-10 w-10 mx-auto mb-3 opacity-40" />
            No {activeTab} organizations
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Users</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getList().map((o) => (
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
                        <div className="text-xs text-slate-600">
                          <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {o.admin_email || "—"}</div>
                          <div className="flex items-center gap-1 mt-0.5"><User className="h-3 w-3" /> {o.admin_name || "—"}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          o.subscription_plan === "enterprise" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                          o.subscription_plan === "professional" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          o.subscription_plan === "basic" ? "bg-[#FF7A00]/5 text-[#FF7A00] border border-[#FF7A00]/10" :
                          "bg-slate-50 text-slate-600 border border-slate-100"
                        }`}>{o.subscription_plan}</span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{o.user_count}</td>
                      <td className="py-4 px-4"><StatusBadge status={o.status} /></td>
                      <td className="py-4 px-4 text-slate-500 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-1 text-slate-400">
                          <button onClick={() => setDetailOrg(o)} className="p-1.5 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="View Details"><Eye className="h-4 w-4" /></button>
                          {o.status === "PENDING" && (
                            <>
                              <button onClick={() => handleApprove(o)} disabled={actionLoading === o.id}
                                className="p-1.5 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition disabled:opacity-40" title="Approve">
                                <ThumbsUp className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleRejectClick(o)} disabled={actionLoading === o.id}
                                className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-40" title="Reject">
                                <ThumbsDown className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {o.status === "ACTIVE" && (
                            <button onClick={() => handleSuspend(o)} disabled={actionLoading === o.id}
                              className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-40" title="Suspend">
                              <ShieldAlert className="h-4 w-4" />
                            </button>
                          )}
                          {o.status === "SUSPENDED" && (
                            <button onClick={() => handleReactivate(o)} disabled={actionLoading === o.id}
                              className="p-1.5 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition disabled:opacity-40" title="Reactivate">
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                          {o.status === "REJECTED" && (
                            <>
                              <button onClick={() => navigate(`/super-admin/organizations/${o.id}`)}
                                className="p-1.5 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="View Details">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDelete(o)} disabled={actionLoading === o.id}
                                className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40" title="Delete Registration">
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {o.rejection_reason && (
                            <button onClick={() => setDetailOrg(o)} className="p-1.5 hover:text-slate-500 hover:bg-slate-50 rounded-lg transition" title="View Reason">
                              <MessageSquare className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">{getList().length} organizations</span>
              <div className="flex gap-2 items-center">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-slate-600">Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={getList().length < pageSize}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirm Approve/Reactivate Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                {confirmModal.action === "approve" ? <CheckCircle className="h-5 w-5 text-emerald-600" /> : <RotateCcw className="h-5 w-5 text-emerald-600" />}
              </div>
              <h3 className="text-lg font-bold text-slate-800 capitalize">{confirmModal.action} Organization</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to {confirmModal.action} <strong>{confirmModal.org.name}</strong>?
              {confirmModal.action === "approve" && " The organization admin will be able to log in."}
              {confirmModal.action === "reactivate" && " All users will be able to log in again."}
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={confirmModal.action === "approve" ? confirmApprove : confirmReactivate}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
                <CheckCircle className="h-4 w-4" /> Confirm {confirmModal.action}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Reject Organization</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Reject <strong>{rejectModal.name}</strong> registration. Provide a reason (required):
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm text-slate-800 outline-none focus:border-red-400 min-h-[100px] resize-y"
            />
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setRejectModal(null)}
                className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={confirmReject} disabled={!rejectReason.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50">
                <XCircle className="h-4 w-4" /> Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl border border-slate-200 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">{detailOrg.name}</h3>
              <button onClick={() => setDetailOrg(null)} className="p-1 hover:bg-slate-100 rounded-lg"><XCircle className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-slate-400">Code:</span><span className="ml-2 font-semibold text-slate-700">{detailOrg.code}</span></div>
                <div><StatusBadge status={detailOrg.status} /></div>
                <div><span className="text-slate-400">Plan:</span><span className="ml-2 font-semibold text-slate-700 capitalize">{detailOrg.subscription_plan}</span></div>
                <div><span className="text-slate-400">Users:</span><span className="ml-2 font-semibold text-slate-700">{detailOrg.user_count}</span></div>
                <div><span className="text-slate-400">Admin:</span><span className="ml-2 text-slate-700">{detailOrg.admin_name || "—"}</span></div>
                <div><span className="text-slate-400">Email:</span><span className="ml-2 text-slate-700">{detailOrg.admin_email || "—"}</span></div>
                {detailOrg.approved_by_name && (
                  <div className="col-span-2"><span className="text-slate-400">Approved By:</span><span className="ml-2 text-slate-700">{detailOrg.approved_by_name}</span></div>
                )}
                {detailOrg.approved_at && (
                  <div className="col-span-2"><span className="text-slate-400">Approved At:</span><span className="ml-2 text-slate-700">{new Date(detailOrg.approved_at).toLocaleString()}</span></div>
                )}
                {detailOrg.rejection_reason && (
                  <div className="col-span-2"><span className="text-slate-400">Rejection Reason:</span>
                    <p className="mt-1 text-red-600 bg-red-50 rounded-xl p-3">{detailOrg.rejection_reason}</p>
                  </div>
                )}
                {detailOrg.suspended_at && (
                  <div className="col-span-2"><span className="text-slate-400">Suspended At:</span><span className="ml-2 text-slate-700">{new Date(detailOrg.suspended_at).toLocaleString()}</span></div>
                )}
                {detailOrg.reactivated_at && (
                  <div className="col-span-2"><span className="text-slate-400">Reactivated At:</span><span className="ml-2 text-slate-700">{new Date(detailOrg.reactivated_at).toLocaleString()}</span></div>
                )}
                <div className="col-span-2"><span className="text-slate-400">Created:</span><span className="ml-2 text-slate-700">{new Date(detailOrg.created_at).toLocaleString()}</span></div>
              </div>
            </div>
            <div className="flex mt-6 justify-end">
              <button onClick={() => setDetailOrg(null)}
                className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
