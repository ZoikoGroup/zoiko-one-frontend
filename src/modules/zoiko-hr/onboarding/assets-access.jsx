import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import {
  getOnboardingAssetAllocations,
  createOnboardingAssetAllocation,
  updateOnboardingAssetAllocation,
  deleteOnboardingAssetAllocation,
  getOnboardingAccessRequests,
  createOnboardingAccessRequest,
  updateOnboardingAccessRequest,
  deleteOnboardingAccessRequest,
  getOnboardingRecords,
} from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/onboarding" },
  { label: "New Hires", href: "/zoiko-hr/onboarding/new-hires" },
  { label: "Pre-Onboarding", href: "/zoiko-hr/onboarding/pre-onboarding" },
  { label: "Documents", href: "/zoiko-hr/onboarding/documents" },
  { label: "Checklists", href: "/zoiko-hr/onboarding/checklists" },
  { label: "Dept Assignment", href: "/zoiko-hr/onboarding/department-assignment" },
  { label: "Manager Assignment", href: "/zoiko-hr/onboarding/manager-assignment" },
  { label: "Assets & Access", href: "/zoiko-hr/onboarding/assets-access" },
  { label: "Orientation", href: "/zoiko-hr/onboarding/orientation" },
  { label: "Training", href: "/zoiko-hr/onboarding/training" },
  { label: "Progress", href: "/zoiko-hr/onboarding/progress" },
  { label: "Reports", href: "/zoiko-hr/onboarding/reports" },
  { label: "Settings", href: "/zoiko-hr/onboarding/settings" },
];

function OnboardingSubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/onboarding"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

const ASSET_TYPES = ["Laptop", "Monitor", "Phone", "Keyboard", "Mouse", "Headset", "Docking Station", "Other"];

const ASSET_STATUS_OPTIONS = [
  { value: "allocated", label: "Allocated" },
  { value: "pending_return", label: "Pending Return" },
  { value: "returned", label: "Returned" },
];

const ASSET_STATUS_COLORS = {
  allocated: "bg-green-100 text-green-800",
  pending_return: "bg-yellow-100 text-yellow-800",
  returned: "bg-gray-100 text-gray-800",
};

const ACCESS_TYPES = ["Email", "System Access", "Software Access", "VPN", "Database", "Network Drive", "Slack/Teams", "Other"];

const ACCESS_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "provisioned", label: "Provisioned" },
];

const ACCESS_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  provisioned: "bg-green-100 text-green-800",
};

const initialAssetForm = {
  onboarding_record_id: "",
  asset_type: "Laptop",
  asset_tag: "",
  serial_number: "",
  status: "allocated",
  notes: "",
};

const initialAccessForm = {
  onboarding_record_id: "",
  access_type: "Email",
  status: "pending",
  notes: "",
};

export default function OnboardingAssetsAccess() {
  const [activeTab, setActiveTab] = useState("assets");

  const [records, setRecords] = useState([]);
  const [assets, setAssets] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState({ type: "", text: "" });

  const [showAssetForm, setShowAssetForm] = useState(false);
  const [editAssetId, setEditAssetId] = useState(null);
  const [assetForm, setAssetForm] = useState({ ...initialAssetForm });
  const [assetSaving, setAssetSaving] = useState(false);

  const [showAccessForm, setShowAccessForm] = useState(false);
  const [editAccessId, setEditAccessId] = useState(null);
  const [accessForm, setAccessForm] = useState({ ...initialAccessForm });
  const [accessSaving, setAccessSaving] = useState(false);

  const showAction = (type, text) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg({ type: "", text: "" }), 4000);
  };

  const fetchRecords = async () => {
    try {
      const data = await getOnboardingRecords();
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      setRecords([]);
    }
  };

  const fetchAssets = async (recordId) => {
    try {
      const data = await getOnboardingAssetAllocations(recordId || undefined);
      setAssets(Array.isArray(data) ? data : []);
    } catch {
      setAssets([]);
    }
  };

  const fetchAccessRequests = async (recordId) => {
    try {
      const data = await getOnboardingAccessRequests(recordId || undefined);
      setAccessRequests(Array.isArray(data) ? data : []);
    } catch {
      setAccessRequests([]);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchRecords(), fetchAssets(), fetchAccessRequests()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetAssetForm = () => {
    setAssetForm({ ...initialAssetForm });
    setEditAssetId(null);
    setShowAssetForm(false);
  };

  const resetAccessForm = () => {
    setAccessForm({ ...initialAccessForm });
    setEditAccessId(null);
    setShowAccessForm(false);
  };

  const openCreateAsset = () => {
    resetAssetForm();
    setShowAssetForm(true);
  };

  const openEditAsset = (asset) => {
    setEditAssetId(asset.id);
    setAssetForm({
      onboarding_record_id: asset.onboarding_record_id ? String(asset.onboarding_record_id) : "",
      asset_type: asset.asset_type || "Laptop",
      asset_tag: asset.asset_tag || "",
      serial_number: asset.serial_number || "",
      status: asset.status || "allocated",
      notes: asset.notes || "",
    });
    setShowAssetForm(true);
  };

  const handleSaveAsset = async () => {
    if (!assetForm.onboarding_record_id) {
      showAction("error", "Please select an employee");
      return;
    }
    if (!assetForm.asset_type) {
      showAction("error", "Asset type is required");
      return;
    }
    setAssetSaving(true);
    try {
      const payload = {
        onboarding_record_id: Number(assetForm.onboarding_record_id),
        asset_type: assetForm.asset_type,
        asset_tag: assetForm.asset_tag || null,
        serial_number: assetForm.serial_number || null,
        status: assetForm.status,
        notes: assetForm.notes || null,
      };
      if (editAssetId) {
        await updateOnboardingAssetAllocation(editAssetId, payload);
        showAction("success", "Asset allocation updated");
      } else {
        await createOnboardingAssetAllocation(payload);
        showAction("success", "Asset allocation created");
      }
      resetAssetForm();
      await fetchAssets();
    } catch (err) {
      showAction("error", err.message || "Failed to save asset allocation");
    } finally {
      setAssetSaving(false);
    }
  };

  const handleDeleteAsset = async (id) => {
    if (!window.confirm("Delete this asset allocation?")) return;
    try {
      await deleteOnboardingAssetAllocation(id);
      showAction("success", "Asset allocation deleted");
      await fetchAssets();
    } catch (err) {
      showAction("error", err.message || "Failed to delete asset allocation");
    }
  };

  const openCreateAccess = () => {
    resetAccessForm();
    setShowAccessForm(true);
  };

  const openEditAccess = (req) => {
    setEditAccessId(req.id);
    setAccessForm({
      onboarding_record_id: req.onboarding_record_id ? String(req.onboarding_record_id) : "",
      access_type: req.access_type || "Email",
      status: req.status || "pending",
      notes: req.notes || "",
    });
    setShowAccessForm(true);
  };

  const handleSaveAccess = async () => {
    if (!accessForm.onboarding_record_id) {
      showAction("error", "Please select an employee");
      return;
    }
    if (!accessForm.access_type) {
      showAction("error", "Access type is required");
      return;
    }
    setAccessSaving(true);
    try {
      const payload = {
        onboarding_record_id: Number(accessForm.onboarding_record_id),
        access_type: accessForm.access_type,
        status: accessForm.status,
        notes: accessForm.notes || null,
      };
      if (editAccessId) {
        await updateOnboardingAccessRequest(editAccessId, payload);
        showAction("success", "Access request updated");
      } else {
        await createOnboardingAccessRequest(payload);
        showAction("success", "Access request created");
      }
      resetAccessForm();
      await fetchAccessRequests();
    } catch (err) {
      showAction("error", err.message || "Failed to save access request");
    } finally {
      setAccessSaving(false);
    }
  };

  const handleDeleteAccess = async (id) => {
    if (!window.confirm("Delete this access request?")) return;
    try {
      await deleteOnboardingAccessRequest(id);
      showAction("success", "Access request deleted");
      await fetchAccessRequests();
    } catch (err) {
      showAction("error", err.message || "Failed to delete access request");
    }
  };

  const handleQuickStatusAccess = async (id, status) => {
    try {
      await updateOnboardingAccessRequest(id, { status });
      showAction("success", `Status updated to ${ACCESS_STATUS_OPTIONS.find((s) => s.value === status)?.label || status}`);
      await fetchAccessRequests();
    } catch (err) {
      showAction("error", err.message || "Failed to update status");
    }
  };

  const getRecordName = (recordId) => {
    const rec = records.find((r) => r.id === recordId || r.id === Number(recordId));
    return rec ? rec.candidate_name || rec.name || `Record #${recordId}` : `Record #${recordId}`;
  };

  const TAB_LABELS = [
    { key: "assets", label: "Assets" },
    { key: "access", label: "Access" },
  ];

  if (loading && assets.length === 0 && accessRequests.length === 0) {
    return (
      <HRPage title="Assets & Access" subtitle="Manage asset allocation and access requests for onboarding employees.">
        <OnboardingSubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Assets & Access" subtitle="Manage asset allocation and access requests for onboarding employees.">
      <OnboardingSubNav />

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      {actionMsg.text && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
            actionMsg.type === "error"
              ? "bg-red-50 border border-red-200 text-red-700"
              : actionMsg.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-blue-50 border border-blue-200 text-blue-700"
          }`}
        >
          {actionMsg.text}
        </div>
      )}

      <div className="flex gap-1 mb-6 border-b border-gray-100">
        {TAB_LABELS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "assets" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Asset Allocations</h3>
              <p className="text-sm text-gray-500">Track laptop, monitor, phone, and other equipment allocations.</p>
            </div>
            <button
              onClick={openCreateAsset}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Allocate Asset
            </button>
          </div>

          {assets.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">No asset allocations yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-3 py-3 font-semibold text-gray-600">Employee</th>
                      <th className="text-left px-3 py-3 font-semibold text-gray-600">Asset Type</th>
                      <th className="text-left px-3 py-3 font-semibold text-gray-600">Asset Tag</th>
                      <th className="text-left px-3 py-3 font-semibold text-gray-600">Serial</th>
                      <th className="text-left px-3 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-left px-3 py-3 font-semibold text-gray-600">Notes</th>
                      <th className="text-right px-3 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {assets.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3 font-medium text-gray-800">{getRecordName(a.onboarding_record_id)}</td>
                        <td className="px-3 py-3 text-gray-700">{a.asset_type}</td>
                        <td className="px-3 py-3 text-gray-500 font-mono text-xs">{a.asset_tag || "-"}</td>
                        <td className="px-3 py-3 text-gray-500 font-mono text-xs">{a.serial_number || "-"}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ASSET_STATUS_COLORS[a.status] || ""}`}>
                            {ASSET_STATUS_OPTIONS.find((s) => s.value === a.status)?.label || a.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-400 max-w-[160px] truncate">{a.notes || "-"}</td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEditAsset(a)} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1">Edit</button>
                            <button onClick={() => handleDeleteAsset(a.id)} className="text-red-400 hover:text-red-600 text-xs px-1">Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "access" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Access Requests</h3>
              <p className="text-sm text-gray-500">Manage email provisioning, system access, software, VPN, and database access.</p>
            </div>
            <button
              onClick={openCreateAccess}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + New Access Request
            </button>
          </div>

          {accessRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">No access requests yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-3 py-3 font-semibold text-gray-600">Employee</th>
                      <th className="text-left px-3 py-3 font-semibold text-gray-600">Access Type</th>
                      <th className="text-left px-3 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-left px-3 py-3 font-semibold text-gray-600">Notes</th>
                      <th className="text-right px-3 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {accessRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3 font-medium text-gray-800">{getRecordName(req.onboarding_record_id)}</td>
                        <td className="px-3 py-3 text-gray-700">{req.access_type}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ACCESS_STATUS_COLORS[req.status] || ""}`}>
                            {ACCESS_STATUS_OPTIONS.find((s) => s.value === req.status)?.label || req.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-400 max-w-[160px] truncate">{req.notes || "-"}</td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            <button onClick={() => openEditAccess(req)} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1">Edit</button>
                            {req.status !== "approved" && (
                              <button onClick={() => handleQuickStatusAccess(req.id, "approved")} className="text-green-600 hover:text-green-800 text-xs font-medium px-1">Approve</button>
                            )}
                            {req.status !== "rejected" && (
                              <button onClick={() => handleQuickStatusAccess(req.id, "rejected")} className="text-red-400 hover:text-red-600 text-xs px-1">Reject</button>
                            )}
                            {req.status !== "provisioned" && req.status === "approved" && (
                              <button onClick={() => handleQuickStatusAccess(req.id, "provisioned")} className="text-purple-600 hover:text-purple-800 text-xs font-medium px-1">Provision</button>
                            )}
                            <button onClick={() => handleDeleteAccess(req.id)} className="text-red-400 hover:text-red-600 text-xs px-1">Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {showAssetForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editAssetId ? "Edit Asset Allocation" : "Allocate Asset"}</h2>
              <button onClick={resetAssetForm} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); handleSaveAsset(); }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
                <select
                  value={assetForm.onboarding_record_id}
                  onChange={(e) => setAssetForm({ ...assetForm, onboarding_record_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select employee...</option>
                  {records.map((r) => (
                    <option key={r.id} value={r.id}>{r.candidate_name || r.name || `Record #${r.id}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type *</label>
                <select
                  value={assetForm.asset_type}
                  onChange={(e) => setAssetForm({ ...assetForm, asset_type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ASSET_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag</label>
                  <input
                    type="text"
                    value={assetForm.asset_tag}
                    onChange={(e) => setAssetForm({ ...assetForm, asset_tag: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={assetForm.serial_number}
                    onChange={(e) => setAssetForm({ ...assetForm, serial_number: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={assetForm.status}
                  onChange={(e) => setAssetForm({ ...assetForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ASSET_STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={assetForm.notes}
                  onChange={(e) => setAssetForm({ ...assetForm, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={resetAssetForm} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={assetSaving} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {assetSaving ? "Saving..." : editAssetId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAccessForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editAccessId ? "Edit Access Request" : "New Access Request"}</h2>
              <button onClick={resetAccessForm} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); handleSaveAccess(); }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
                <select
                  value={accessForm.onboarding_record_id}
                  onChange={(e) => setAccessForm({ ...accessForm, onboarding_record_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select employee...</option>
                  {records.map((r) => (
                    <option key={r.id} value={r.id}>{r.candidate_name || r.name || `Record #${r.id}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Type *</label>
                <select
                  value={accessForm.access_type}
                  onChange={(e) => setAccessForm({ ...accessForm, access_type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ACCESS_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={accessForm.status}
                  onChange={(e) => setAccessForm({ ...accessForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ACCESS_STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={accessForm.notes}
                  onChange={(e) => setAccessForm({ ...accessForm, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={resetAccessForm} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={accessSaving} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {accessSaving ? "Saving..." : editAccessId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
