import { Plus } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useOffers } from "../hooks/useRecruitment";
import { formatDate, formatCurrency } from "../utils/helpers";

export default function OfferManagement() {
  const { data: offers, loading } = useOffers();

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const columns = [
    { key: "candidate", label: "Candidate", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "position", label: "Position" },
    { key: "amount", label: "Amount", render: (v) => <span className="font-mono font-medium">{formatCurrency(v)}</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "sentDate", label: "Sent Date", render: (v) => v ? formatDate(v) : "-" },
    { key: "expiryDate", label: "Expiry", render: (v) => v ? <span className="text-red-600 font-medium">{formatDate(v)}</span> : "-" },
    { key: "notes", label: "Notes", render: (v) => v ? <span className="text-gray-400 text-xs truncate max-w-[150px] inline-block">{v}</span> : "-" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offer Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage offer letters</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> New Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{offers.filter((o) => o.status === "draft").length}</p>
          <p className="text-xs text-gray-500 mt-1">Draft</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{offers.filter((o) => o.status === "approved").length}</p>
          <p className="text-xs text-gray-500 mt-1">Approved</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{offers.filter((o) => o.status === "accepted").length}</p>
          <p className="text-xs text-gray-500 mt-1">Accepted</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{offers.filter((o) => o.status === "declined" || o.status === "expired").length}</p>
          <p className="text-xs text-gray-500 mt-1">Declined/Expired</p>
        </div>
      </div>

      <DataTable columns={columns} data={offers} />
    </div>
  );
}
