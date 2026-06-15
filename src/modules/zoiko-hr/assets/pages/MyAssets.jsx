import { useState } from "react";
import { Package, Tag, Calendar, AlertCircle, Search } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { useMyAssets } from "../hooks/useAssets";
import { formatDate, conditionColor } from "../utils/helpers";

export default function MyAssets() {
  const { data: assets, loading } = useMyAssets();
  const [search, setSearch] = useState("");

  const filtered = assets.filter((a) =>
    !search || a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.assetTag?.toLowerCase().includes(search.toLowerCase()) ||
    a.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6 text-gray-400">Loading your assets...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Assets</h1>
        <p className="text-sm text-gray-500 mt-1">Assets assigned to you</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search your assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            {assets.length === 0 ? "No assets assigned to you yet." : "No assets match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((asset) => (
            <div key={asset.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <StatusBadge status={asset.status} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{asset.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="font-mono text-xs text-amber-600 font-semibold">{asset.assetTag}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="w-3.5 h-3.5 inline-flex items-center justify-center text-xs font-bold">#</span>
                  <span>{asset.category}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Assigned: {formatDate(asset.assignedDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${conditionColor(asset.condition)}`}>
                    {asset.condition}
                  </span>
                </div>
              </div>
              {asset.notes && (
                <p className="mt-3 text-xs text-gray-400 italic border-t border-gray-100 pt-2">{asset.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
