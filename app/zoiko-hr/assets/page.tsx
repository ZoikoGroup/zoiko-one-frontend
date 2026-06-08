"use client";

import { useState } from "react";
import { Workflow, Search, Plus, Trash2, Edit2, X, Users, AlertCircle, Laptop, Calendar } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";

interface Asset {
  id: string;
  assetTag: string;
  name: string;
  category: "Laptops" | "Monitors" | "Peripherals" | "Software Licenses";
  serialNumber: string;
  assignedTo: string;
  dateAssigned: string;
  value: number;
  status: "Assigned" | "Available" | "In Repair" | "Retired";
}

const initialAssets: Asset[] = [
  {
    id: "asset-1",
    assetTag: "AST-001",
    name: "MacBook Pro 16\" (M3 Max, 32GB)",
    category: "Laptops",
    serialNumber: "C02F84HJQ05D",
    assignedTo: "Sarah Jenkins",
    dateAssigned: "2026-01-20",
    value: 2400,
    status: "Assigned"
  },
  {
    id: "asset-2",
    assetTag: "AST-002",
    name: "MacBook Pro 16\" (M3 Max, 32GB)",
    category: "Laptops",
    serialNumber: "C02F85HJQ05E",
    assignedTo: "None",
    dateAssigned: "—",
    value: 2400,
    status: "Available"
  },
  {
    id: "asset-3",
    assetTag: "AST-003",
    name: "Dell UltraSharp 27\" 4K USB-C Monitor",
    category: "Monitors",
    serialNumber: "MX-048D7S-CN",
    assignedTo: "Alex Rivera",
    dateAssigned: "2026-02-15",
    value: 450,
    status: "Assigned"
  },
  {
    id: "asset-4",
    assetTag: "AST-004",
    name: "Dell UltraSharp 27\" 4K USB-C Monitor",
    category: "Monitors",
    serialNumber: "MX-048D8T-CN",
    assignedTo: "None",
    dateAssigned: "—",
    value: 450,
    status: "Available"
  },
  {
    id: "asset-5",
    assetTag: "AST-005",
    name: "Keychron K2 Mechanical Keyboard",
    category: "Peripherals",
    serialNumber: "KC-2026A-88",
    assignedTo: "Michael Chang",
    dateAssigned: "2026-03-10",
    value: 120,
    status: "Assigned"
  },
  {
    id: "asset-6",
    assetTag: "AST-006",
    name: "Slack Enterprise License",
    category: "Software Licenses",
    serialNumber: "SLK-LIC-9982-A",
    assignedTo: "Sarah Jenkins",
    dateAssigned: "2026-01-15",
    value: 240,
    status: "Assigned"
  },
  {
    id: "asset-7",
    assetTag: "AST-007",
    name: "MacBook Air 13\" (M2, 16GB)",
    category: "Laptops",
    serialNumber: "M2-MBA-2022-FX",
    assignedTo: "None",
    dateAssigned: "—",
    value: 1200,
    status: "In Repair"
  }
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "Laptops" as Asset["category"],
    serialNumber: "",
    value: 1200,
    status: "Available" as Asset["status"]
  });

  const [assignForm, setAssignForm] = useState({
    employeeName: "",
    dateAssigned: new Date().toISOString().split("T")[0]
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      category: "Laptops",
      serialNumber: "",
      value: 1200,
      status: "Available"
    });
    setSelectedAsset(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({
      name: asset.name,
      category: asset.category,
      serialNumber: asset.serialNumber,
      value: asset.value,
      status: asset.status
    });
    setShowAddModal(true);
  };

  const handleOpenAssign = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssignForm({
      employeeName: asset.assignedTo === "None" ? "" : asset.assignedTo,
      dateAssigned: asset.dateAssigned === "—" ? new Date().toISOString().split("T")[0] : asset.dateAssigned
    });
    setShowAssignModal(true);
  };

  const handleUnassign = (id: string) => {
    if (confirm("Are you sure you want to unassign this asset from the current employee? It will return to available stock.")) {
      setAssets(
        assets.map((ast) =>
          ast.id === id
            ? { ...ast, assignedTo: "None", dateAssigned: "—", status: "Available" }
            : ast
        )
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this asset from the registry?")) {
      setAssets(assets.filter((ast) => ast.id !== id));
    }
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.serialNumber.trim()) {
      alert("Please enter a name and serial number.");
      return;
    }

    if (selectedAsset) {
      // Edit
      setAssets(
        assets.map((ast) =>
          ast.id === selectedAsset.id
            ? {
                ...ast,
                ...formData,
                name: formData.name.trim(),
                serialNumber: formData.serialNumber.trim(),
                assignedTo: formData.status === "Available" ? "None" : ast.assignedTo,
                dateAssigned: formData.status === "Available" ? "—" : ast.dateAssigned
              }
            : ast
        )
      );
    } else {
      // Add
      const newTagNum = assets.length + 1;
      const tagStr = `AST-${newTagNum.toString().padStart(3, "0")}`;
      const newAsset: Asset = {
        id: `asset-${Date.now()}`,
        assetTag: tagStr,
        name: formData.name.trim(),
        category: formData.category,
        serialNumber: formData.serialNumber.trim(),
        assignedTo: "None",
        dateAssigned: "—",
        value: formData.value,
        status: formData.status
      };
      setAssets([...assets, newAsset]);
    }
    setShowAddModal(false);
  };

  const handleSubmitAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    const name = assignForm.employeeName.trim();

    if (!name) {
      // Unassign
      setAssets(
        assets.map((ast) =>
          ast.id === selectedAsset.id
            ? { ...ast, assignedTo: "None", dateAssigned: "—", status: "Available" }
            : ast
        )
      );
    } else {
      // Assign
      setAssets(
        assets.map((ast) =>
          ast.id === selectedAsset.id
            ? { ...ast, assignedTo: name, dateAssigned: assignForm.dateAssigned, status: "Assigned" }
            : ast
        )
      );
    }
    setShowAssignModal(false);
  };

  // Filtering
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "All" || asset.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || asset.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate Metrics
  const totalAssets = assets.length;
  const assignedCount = assets.filter((a) => a.status === "Assigned").length;
  const availableCount = assets.filter((a) => a.status === "Available").length;
  const totalValue = assets.reduce((sum, a) => sum + a.value, 0).toLocaleString();

  return (
    <SuperAdminShell>
      <PageHeader
        title="Asset Management"
        description="Track hardware inventory, manage device allocations, and coordinate IT resources for employees."
        action={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Register Asset
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 font-sans">Total Assets</p>
            <h3 className="mt-2 text-3xl font-bold text-white">{totalAssets}</h3>
            <p className="mt-1 text-xs text-slate-400">Items currently cataloged</p>
          </div>
          <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400">
            <Laptop className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 font-sans">Assigned Devices</p>
            <h3 className="mt-2 text-3xl font-bold text-emerald-455">{assignedCount}</h3>
            <p className="mt-1 text-xs text-slate-400">In hands of employees</p>
          </div>
          <div className="rounded-2xl bg-emerald-550/10 p-3 text-emerald-450">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 font-sans">Available in Stock</p>
            <h3 className="mt-2 text-3xl font-bold text-amber-400">{availableCount}</h3>
            <p className="mt-1 text-xs text-slate-400">Ready for onboarding</p>
          </div>
          <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
            <Laptop className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 font-sans">Total Asset Value</p>
            <h3 className="mt-2 text-3xl font-bold text-indigo-400">${totalValue}</h3>
            <p className="mt-1 text-xs text-slate-400">Current active investment</p>
          </div>
          <div className="rounded-2xl bg-indigo-650/10 p-3 text-indigo-400">
            <Workflow className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search assets by name, tag, serial, or employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />
          </div>

          <div className="min-w-[150px]">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Laptops">Laptops</option>
              <option value="Monitors">Monitors</option>
              <option value="Peripherals">Peripherals</option>
              <option value="Software Licenses">Software Licenses</option>
            </select>
          </div>

          <div className="min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Assigned">Assigned</option>
              <option value="Available">Available</option>
              <option value="In Repair">In Repair</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Inventory Table */}
      <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
        <div className="overflow-x-auto rounded-[20px] border border-slate-850">
          <table className="w-full min-w-[750px] text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Tag ID</th>
                <th className="px-4 py-3">Asset Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Serial / Key</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Allocation Date</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    No hardware or software assets found.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-950/40 transition">
                    <td className="px-4 py-3 font-semibold text-slate-400 font-mono">
                      {asset.assetTag}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{asset.name}</td>
                    <td className="px-4 py-3 text-slate-300">{asset.category}</td>
                    <td className="px-4 py-3 text-slate-450 font-mono">{asset.serialNumber}</td>
                    <td className="px-4 py-3 text-white">
                      {asset.assignedTo !== "None" ? (
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-indigo-400" />
                          {asset.assignedTo}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{asset.dateAssigned}</td>
                    <td className="px-4 py-3 text-slate-300 font-semibold">${asset.value}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          asset.status === "Assigned"
                            ? "bg-indigo-500/10 text-indigo-400"
                            : asset.status === "Available"
                            ? "bg-emerald-500/10 text-emerald-450"
                            : asset.status === "In Repair"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenAssign(asset)}
                          title="Assign to employee"
                          className="rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-300 hover:text-white transition"
                        >
                          Assign
                        </button>
                        {asset.status === "Assigned" && (
                          <button
                            onClick={() => handleUnassign(asset.id)}
                            title="Return device to inventory"
                            className="rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-amber-500 hover:text-amber-400 transition"
                          >
                            Return
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(asset)}
                          title="Edit details"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          title="Delete asset"
                          className="rounded-lg p-1.5 text-rose-450 hover:bg-slate-900 hover:text-rose-350 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register/Edit Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0B1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-semibold text-white">
                {selectedAsset ? "Edit Asset Details" : "Register Hardware/Software Asset"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                  Asset Name / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder={"e.g. Dell UltraSharp 27\" Monitor"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-650 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as Asset["category"] })
                    }
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Monitors">Monitors</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Software Licenses">Software Licenses</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                    Value (USD)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white outline-none transition focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                    Serial Number / License Key
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SN-99824XJ-CN"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-650 outline-none transition focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                    Asset Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as Asset["status"] })
                    }
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned (allocate via table)</option>
                    <option value="In Repair">In Repair</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-3xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
                >
                  {selectedAsset ? "Save Changes" : "Confirm Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Asset Modal */}
      {showAssignModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[28px] border border-slate-800 bg-[#0B1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-semibold text-white">
                Allocate Device: {selectedAsset.assetTag}
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAssign} className="mt-4 space-y-4">
              <div className="rounded-2xl bg-indigo-950/30 border border-slate-850 p-4">
                <p className="text-slate-400 text-xs font-medium">Asset Details</p>
                <h4 className="text-white text-sm font-semibold mt-1">{selectedAsset.name}</h4>
                <p className="text-slate-550 text-[10px] uppercase font-mono mt-0.5">SN: {selectedAsset.serialNumber}</p>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                  Assign To Employee
                </label>
                <input
                  type="text"
                  placeholder="e.g. Robert Johnson (Leave blank to make available)"
                  value={assignForm.employeeName}
                  onChange={(e) => setAssignForm({ ...assignForm, employeeName: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-650 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                  Allocation Date
                </label>
                <input
                  type="date"
                  required
                  value={assignForm.dateAssigned}
                  onChange={(e) => setAssignForm({ ...assignForm, dateAssigned: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-3xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
