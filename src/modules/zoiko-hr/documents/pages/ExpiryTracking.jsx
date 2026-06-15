import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useExpiryTracking } from "../hooks/useDocuments";
import { formatDate, daysUntil } from "../utils/helpers";

export default function ExpiryTracking() {
  const { data: items, loading } = useExpiryTracking();

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const columns = [
    { key: "document", label: "Document", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "type", label: "Type" },
    { key: "expiryDate", label: "Expiry Date", render: (v) => formatDate(v) },
    { key: "daysLeft", label: "Days Left", render: (v, r) => {
      const days = daysUntil(r.expiryDate);
      return <span className={`font-mono font-bold ${days <= 0 ? "text-red-600" : days <= 30 ? "text-orange-600" : "text-green-600"}`}>{days <= 0 ? "Expired" : `${days} days`}</span>;
    }},
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "owner", label: "Owner" },
    { key: "actions", label: "", render: () => (
      <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">Renew</button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Expiry Tracking</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor document expirations and renewals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-600 font-medium">Valid</p>
          <p className="text-2xl font-bold text-green-700">{items.filter((i) => i.status === "valid").length}</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
          <p className="text-xs text-orange-600 font-medium">Expiring Soon</p>
          <p className="text-2xl font-bold text-orange-700">{items.filter((i) => i.status === "expiring_soon").length}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-xs text-red-600 font-medium">Expired</p>
          <p className="text-2xl font-bold text-red-700">{items.filter((i) => i.status === "expired").length}</p>
        </div>
      </div>

      <DataTable columns={columns} data={items} />
    </div>
  );
}
