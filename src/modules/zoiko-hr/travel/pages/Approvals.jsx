import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useApprovals } from "../hooks/useTravel";
import { formatDate, formatCurrency } from "../utils/helpers";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function TravelApprovals() {
  const { data: approvals, loading } = useApprovals();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    let result = approvals;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.employee?.toLowerCase().includes(q) || a.destination?.toLowerCase().includes(q));
    }
    if (statusFilter) result = result.filter((a) => a.status === statusFilter);
    return result;
  }, [approvals, search, statusFilter]);

  const handleApprove = async (id) => {
    try {
      const { approveRequest } = await import("../services/travelService");
      await approveRequest(id);
      window.location.reload();
    } catch (e) { console.error(e); }
  };

  const handleReject = async (id) => {
    try {
      const { rejectRequest } = await import("../services/travelService");
      await rejectRequest(id);
      window.location.reload();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading approvals...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Travel Approvals</h1>
        <p className="text-sm text-gray-500 mt-1">Review and manage travel request approvals</p>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        onFilterChange={(key, val) => setStatusFilter(val)}
        filters={[{ key: "status", placeholder: "All Statuses", options: STATUS_OPTIONS, value: statusFilter }]}
      />

      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{item.employee}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Destination:</span> {item.destination}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Purpose:</span> {item.purpose}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(item.startDate)} &rarr; {formatDate(item.endDate)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Budget:</span> {formatCurrency(item.budget)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Requested by {item.requestedBy} on {formatDate(item.requestedOn)}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Details">
                    <Eye className="w-5 h-5" />
                  </button>
                  {item.status === "pending" && (
                    <>
                      <button onClick={() => handleApprove(item.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors">
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={() => handleReject(item.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {expanded === item.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">Request ID:</span> <span className="font-mono text-gray-700">#{item.id}</span></div>
                    <div><span className="text-gray-500">Duration:</span> <span className="text-gray-700">{item.startDate} to {item.endDate}</span></div>
                    <div><span className="text-gray-500">Budget:</span> <span className="text-gray-700">{formatCurrency(item.budget)}</span></div>
                    <div><span className="text-gray-500">Status:</span> <span className="text-gray-700 capitalize">{item.status}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No approval requests found</div>
        )}
      </div>
    </div>
  );
}
