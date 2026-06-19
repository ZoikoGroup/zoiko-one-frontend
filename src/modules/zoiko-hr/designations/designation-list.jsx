import { useState, useMemo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Download, RefreshCw } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { 
  getDesignations, 
  createDesignation, 
  updateDesignation, 
  deleteDesignation 
} from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/designations" },
  { label: "Designation List", href: "/zoiko-hr/designations/list" },
  { label: "Designation Structure", href: "/zoiko-hr/designations/levels" },
  { label: "Reports", href: "/zoiko-hr/designations/reports" },
  { label: "Settings", href: "/zoiko-hr/designations/settings" },
];

const LEVEL_OPTIONS = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10"].map((l) => ({ value: l, label: l }));
const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
];
const DEPT_OPTIONS = [
  { value: "Engineering", label: "Engineering" },
  { value: "Product", label: "Product" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "HR", label: "Human Resources" },
  { value: "Finance", label: "Finance" },
];

// Initial form schema adjusted to use department_name
const initialForm = {
  title: "",
  department_name: "", 
  level: "L1",
  description: "",
  status: "active",
};

export default function DesignationList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [detailItem, setDetailItem] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchRecords = () => {
    setLoading(true);
    getDesignations()
      .then((res) => setRecords(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (item, e) => {
    e.stopPropagation();
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      department_name: item.department_name || "",
      level: item.level || "L1",
      description: item.description || "",
      status: item.status || "active",
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editingId 
      ? updateDesignation(editingId, formData)
      : createDesignation(formData);

    action
      .then(() => {
        setShowModal(false);
        fetchRecords();
      })
      .catch((err) => console.error("Error saving record:", err));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this designation?")) {
      deleteDesignation(id)
        .then(() => fetchRecords())
        .catch((err) => console.error(err));
    }
  };

  return (
    <HRPage title="Designation List" breadcrumbs={[{ label: "HR" }, { label: "Designations", href: "/zoiko-hr/designations" }, { label: "List" }]}>
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} to={item.href} className={({ isActive }) => `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${isActive ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50" : "text-gray-500 hover:text-gray-700"}`}>{item.label}</NavLink>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button onClick={handleOpenCreate} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"><Plus className="w-4 h-4" /> Add Designation</button>
          <button onClick={fetchRecords} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"><RefreshCw className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {records.map((item) => (
                <tr key={item.id} onClick={() => { setDetailItem(item); setShowDetail(true); }} className="hover:bg-gray-50/80 cursor-pointer transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.title}</td>
                  {/* Updated item table rendering to match backend key */}
                  <td className="px-4 py-3 text-sm text-gray-600">{item.department_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.level}</td>
                  <td className="px-4 py-3 text-sm flex gap-2">
                    <button onClick={(e) => handleOpenEdit(item, e)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={(e) => handleDelete(item.id, e)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Sidebar details mapping updated */}
      {showDetail && detailItem && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 shadow-xl overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{detailItem.title}</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Department</label>
                <p className="text-sm text-gray-900 font-medium">{detailItem.department_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Hierarchy Level</label>
                <p className="text-sm text-gray-900 font-medium">{detailItem.level}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Description</label>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border">{detailItem.description || "N/A"}</p>
              </div>
            </div>
            <button onClick={() => setShowDetail(false)} className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium">Close Panel</button>
          </div>
        </div>
      )}

      {/* Creation/Editing Modal state binding fixed */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50"><h3 className="text-base font-semibold text-gray-900">{editingId ? "Edit Designation" : "Add New Designation"}</h3></div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Designation Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" required placeholder="e.g. Senior Software Engineer" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Department Name</label>
                <select value={formData.department_name} onChange={(e) => setFormData({ ...formData, department_name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" required>
                  <option value="">Select Department</option>
                  {DEPT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hierarchy Level</label>
                  <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" required>
                    {LEVEL_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" placeholder="Brief details about responsibilities..."></textarea>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">Save Designation</button>
            </div>
          </form>
        </div>
      )}
    </HRPage>
  );
}