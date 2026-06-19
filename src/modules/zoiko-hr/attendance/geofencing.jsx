import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, MapPin, ToggleLeft, ToggleRight } from "lucide-react";
import HRPage from "../../../components/HRPage";
import {
  getGeofenceLocations, createGeofenceLocation, updateGeofenceLocation, deleteGeofenceLocation,
} from "../../../service/hrService";





const initialForm = {
  name: "", latitude: "", longitude: "", radius_meters: "100", address: "",
};

export default function Geofencing() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editLocation, setEditLocation] = useState(null);
  const [form, setForm] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getGeofenceLocations();
        if (mounted) setLocations(Array.isArray(data) ? data : data?.locations || []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load geofence locations");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const openCreate = () => {
    setEditLocation(null);
    setForm({ ...initialForm });
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (loc) => {
    setEditLocation(loc);
    setForm({
      name: loc.name || "",
      latitude: loc.latitude?.toString() || "",
      longitude: loc.longitude?.toString() || "",
      radius_meters: loc.radius_meters?.toString() || "100",
      address: loc.address || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = (d) => {
    const e = {};
    if (!d.name?.trim()) e.name = "Name is required";
    if (!d.latitude || isNaN(Number(d.latitude))) e.latitude = "Valid latitude is required";
    if (!d.longitude || isNaN(Number(d.longitude))) e.longitude = "Valid longitude is required";
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
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        radius_meters: form.radius_meters ? Number(form.radius_meters) : 100,
        address: form.address?.trim() || null,
      };
      if (editLocation) {
        await updateGeofenceLocation(editLocation.id, payload);
      } else {
        await createGeofenceLocation(payload);
      }
      setShowModal(false);
      const data = await getGeofenceLocations();
      setLocations(Array.isArray(data) ? data : data?.locations || []);
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to save location" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    try {
      await deleteGeofenceLocation(id);
      const data = await getGeofenceLocations();
      setLocations(Array.isArray(data) ? data : data?.locations || []);
    } catch (err) {
      setError(err.message || "Failed to delete location");
    }
  };

  const handleToggleStatus = async (loc) => {
    try {
      await updateGeofenceLocation(loc.id, { is_active: !loc.is_active });
      const data = await getGeofenceLocations();
      setLocations(Array.isArray(data) ? data : data?.locations || []);
    } catch (err) {
      setError(err.message || "Failed to toggle status");
    }
  };

  if (loading) {
    return (
      <HRPage title="Geofencing" subtitle="Manage geofence locations for attendance tracking">
                <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading geofence locations...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Geofencing" subtitle="Manage geofence locations for attendance tracking">
            <div className="space-y-6">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Geofence Locations</h1>
            <p className="text-sm text-gray-500 mt-1">Define geographic boundaries for attendance check-ins</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Create Location
          </button>
        </div>

        {locations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No geofence locations defined</p>
            <p className="text-gray-400 text-sm mt-1">Create your first geofence location to enable location-based attendance.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Latitude</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Longitude</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Radius</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {locations.map((loc) => (
                    <tr key={loc.id} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{loc.name}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-700">{loc.latitude}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-700">{loc.longitude}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{loc.radius_meters ? `${loc.radius_meters}m` : "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{loc.address || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          loc.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {loc.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleToggleStatus(loc)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors rounded hover:bg-indigo-50" title="Toggle Status">
                            {loc.is_active ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          <button onClick={() => openEdit(loc)}
                            className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors rounded hover:bg-amber-50" title="Edit">&#9998;</button>
                          <button onClick={() => handleDelete(loc.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Coordinates Preview</h2>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <MapPin className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Map integration placeholder</p>
            <p className="text-xs text-gray-400 mt-1">Coordinates will be displayed on an interactive map</p>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">{editLocation ? "Edit Location" : "Create Location"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {formErrors.submit && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{formErrors.submit}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full border ${formErrors.name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                    <input type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                      className={`w-full border ${formErrors.latitude ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                    {formErrors.latitude && <p className="text-red-500 text-xs mt-1">{formErrors.latitude}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                    <input type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                      className={`w-full border ${formErrors.longitude ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                    {formErrors.longitude && <p className="text-red-500 text-xs mt-1">{formErrors.longitude}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Radius (meters)</label>
                    <input type="number" value={form.radius_meters} onChange={(e) => setForm({ ...form, radius_meters: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors">
                    {submitting ? "Saving..." : editLocation ? "Update Location" : "Create Location"}
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

