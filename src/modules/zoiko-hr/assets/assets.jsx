import { useState, useEffect } from "react";
import { Laptop, Package, HardDrive, Monitor, Smartphone, AlertCircle, Check } from "lucide-react";
import * as hr from "../../../service/hrService";

const categoryIcons = {
  Hardware: Laptop,
  Software: HardDrive,
  Peripherals: Monitor,
  Mobile: Smartphone,
  Other: Package,
};

export default function ZoikoHRAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assetStates, setAssetStates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    let mounted = true;
    hr.fetchList("assets")
      .then((data) => {
        if (mounted) {
          setAssets(data);
          const initialStates = {};
          data.forEach((asset) => {
            initialStates[asset.id] = asset.condition || "Excellent";
          });
          setAssetStates(initialStates);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Failed to load assets");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  const toggleCondition = (assetId) => {
    setAssetStates((prev) => ({
      ...prev,
      [assetId]: prev[assetId] === "Excellent" ? "Damaged" : "Excellent",
    }));
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || asset.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(assets.map((a) => a.category))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-gray-500">Loading assets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
        <p className="text-gray-600 mt-1">
          Manage and track company hardware and software inventory
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <input
          type="text"
          placeholder="Search by asset tag, item name, serial number, or assigned user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Asset Tag</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Item Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Serial Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assigned To</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date Assigned</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Condition</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No assets found
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const IconComponent = categoryIcons[asset.category] || Package;
                  const condition = assetStates[asset.id] || asset.condition;
                  return (
                    <tr
                      key={asset.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                        {asset.assetTag}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <IconComponent size={18} className="text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {asset.itemName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          {asset.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                        {asset.serialNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {asset.assignedTo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(asset.dateAssigned).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleCondition(asset.id)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            condition === "Excellent"
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                          }`}
                        >
                          {condition === "Excellent" ? (
                            <Check size={16} />
                          ) : (
                            <AlertCircle size={16} />
                          )}
                          {condition}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-sm text-gray-600">
          Showing {filteredAssets.length} of {assets.length} assets
        </div>
      </div>
    </div>
  );
}
