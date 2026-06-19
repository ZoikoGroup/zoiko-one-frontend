import { useState, useEffect, useMemo } from "react";
import { Plus, RefreshCw, Download, Activity, Trash2, Monitor, Fingerprint, Scan, Wifi } from "lucide-react";
import HRPage from "../../../components/HRPage";
import {
  getBiometricDevices, createBiometricDevice, updateBiometricDevice, deleteBiometricDevice,
  syncBiometricLogs, importBiometricLogs, checkBiometricDeviceHealth,
} from "../../../service/hrService";





const DEVICE_TYPE_ICONS = {
  Fingerprint: Fingerprint, Face_Recognition: Scan, RFID: Wifi,
};

const DEVICE_TYPE_OPTIONS = ["Fingerprint", "Face_Recognition", "RFID"];

const initialForm = {
  name: "", device_type: "Fingerprint", ip_address: "", port: "", location: "", model: "",
};

export default function BiometricIntegration() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editDevice, setEditDevice] = useState(null);
  const [form, setForm] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(null);
  const [success, setSuccess] = useState(null);
  const [healthChecks, setHealthChecks] = useState({});

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBiometricDevices();
        if (mounted) setDevices(Array.isArray(data) ? data : data?.devices || []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load biometric devices");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const openCreate = () => {
    setEditDevice(null);
    setForm({ ...initialForm });
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (device) => {
    setEditDevice(device);
    setForm({
      name: device.name || "",
      device_type: device.device_type || "Fingerprint",
      ip_address: device.ip_address || "",
      port: device.port?.toString() || "",
      location: device.location || "",
      model: device.model || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = (d) => {
    const e = {};
    if (!d.name?.trim()) e.name = "Name is required";
    if (!d.ip_address?.trim()) e.ip_address = "IP address is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        device_type: form.device_type,
        ip_address: form.ip_address.trim(),
        port: form.port ? Number(form.port) : null,
        location: form.location?.trim() || null,
        model: form.model?.trim() || null,
      };
      if (editDevice) {
        await updateBiometricDevice(editDevice.id, payload);
      } else {
        await createBiometricDevice(payload);
      }
      setShowModal(false);
      const data = await getBiometricDevices();
      setDevices(Array.isArray(data) ? data : data?.devices || []);
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to save device" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this device?")) return;
    try {
      await deleteBiometricDevice(id);
      const data = await getBiometricDevices();
      setDevices(Array.isArray(data) ? data : data?.devices || []);
    } catch (err) {
      setError(err.message || "Failed to delete device");
    }
  };

  const handleSync = async (id) => {
    setSyncing(id);
    try {
      await syncBiometricLogs({ device_id: id });
      setSuccess("Sync completed successfully");
    } catch (err) {
      setError(err.message || "Sync failed");
    } finally {
      setSyncing(null);
    }
  };

  const handleImport = async () => {
    try {
      await importBiometricLogs({});
      setSuccess("Import completed successfully");
    } catch (err) {
      setError(err.message || "Import failed");
    }
  };

  const handleHealthCheck = async (id) => {
    setHealthChecks((prev) => ({ ...prev, [id]: "checking" }));
    try {
      const res = await checkBiometricDeviceHealth(id);
      const status = res?.status || res?.data?.status || "offline";
      setHealthChecks((prev) => ({ ...prev, [id]: status }));
    } catch {
      setHealthChecks((prev) => ({ ...prev, [id]: "offline" }));
    }
  };

  if (loading) {
    return (
      <HRPage title="Biometric Integration" subtitle="Manage biometric devices and sync attendance logs">
                <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading devices...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Biometric Integration" subtitle="Manage biometric devices and sync attendance logs">
            <div className="space-y-6">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}
        {success && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700 font-bold">&times;</button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Biometric Devices</h1>
            <p className="text-sm text-gray-500 mt-1">Integrate and manage biometric attendance devices</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleImport}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> Import Logs
            </button>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Register Device
            </button>
          </div>
        </div>

        {devices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Monitor className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No biometric devices registered</p>
            <p className="text-gray-400 text-sm mt-1">Register your first device to start capturing attendance.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Device Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Sync</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {devices.map((d) => {
                    const deviceType = d.device_type || "Fingerprint";
                    const Icon = DEVICE_TYPE_ICONS[deviceType] || Monitor;
                    const health = healthChecks[d.id];
                    const isOnline = health === "online" || (health === undefined && d.status === "online");
                    return (
                      <tr key={d.id} className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.name}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            <Icon className="w-3.5 h-3.5" /> {deviceType.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">{d.ip_address || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{d.location || "-"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
                            <span className={`text-xs font-medium ${isOnline ? "text-green-700" : "text-red-700"}`}>
                              {health === "checking" ? "Checking..." : isOnline ? "Online" : "Offline"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{d.last_sync ? new Date(d.last_sync).toLocaleString() : "-"}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleHealthCheck(d.id)}
                              className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded hover:bg-green-50" title="Health Check">
                              <Activity className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleSync(d.id)} disabled={syncing === d.id}
                              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50 disabled:opacity-40" title="Sync Logs">
                              <RefreshCw className={`w-4 h-4 ${syncing === d.id ? "animate-spin" : ""}`} />
                            </button>
                            <button onClick={() => openEdit(d)}
                              className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors rounded hover:bg-amber-50" title="Edit">&#9998;</button>
                            <button onClick={() => handleDelete(d.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">{editDevice ? "Edit Device" : "Register Device"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {formErrors.submit && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{formErrors.submit}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full border ${formErrors.name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                    <select value={form.device_type} onChange={(e) => setForm({ ...form, device_type: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {DEVICE_TYPE_OPTIONS.map((v) => (<option key={v} value={v}>{v.replace(/_/g, " ")}</option>))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IP Address *</label>
                    <input type="text" value={form.ip_address} onChange={(e) => setForm({ ...form, ip_address: e.target.value })}
                      className={`w-full border ${formErrors.ip_address ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                    {formErrors.ip_address && <p className="text-red-500 text-xs mt-1">{formErrors.ip_address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                    <input type="number" value={form.port} onChange={(e) => setForm({ ...form, port: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input type="text" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors">
                    {submitting ? "Saving..." : editDevice ? "Update Device" : "Register Device"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}

