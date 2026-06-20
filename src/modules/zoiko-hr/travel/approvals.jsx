import { useState, useEffect } from "react";
import { Check, X, ShieldCheck, AlertCircle } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getTravel, updateTravel } from "../../../service/hrService.js";

const formatCurrency = (amount) => 
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);

export default function TravelApprovals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getApprovals() {
      try {
        setLoading(true);
        const res = await getTravel();
        const dataList = res?.data || res || [];
        setApprovals(dataList);
      } catch (e) { 
        console.error("Authorization fetch failed:", e); 
      } finally { 
        setLoading(false); 
      }
    }
    getApprovals();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await updateTravel(id, { status });
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      alert("Action execution failed. Verify authorization states.");
    }
  };

  return (
    <HRPage title="Travel Approvals" subtitle="Review incoming travel authorizations">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 font-medium">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          Syncing systemic review log...
        </div>
      ) : approvals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-400 text-sm font-medium">
          No pending review items available.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 bg-white rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-600">
                <th className="p-4">Employee Identity</th>
                <th className="p-4">Target Destination</th>
                <th className="p-4">Financial Amount</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-right">Actions Queue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {approvals.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-4 font-semibold text-gray-900">{row.employee_name || row.employee || `Employee ID: ${row.employee_id}`}</td>
                  <td className="p-4 text-gray-600">{row.destination}</td>
                  <td className="p-4 font-semibold text-gray-900">{formatCurrency(row.amount)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                      row.status?.toLowerCase() === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>{row.status || "Pending"}</span>
                  </td>
                  <td className="p-4 text-right">
                    {(!row.status || row.status.toLowerCase() === "pending") ? (
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleAction(row.id, "Approved")} 
                          className="inline-flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 font-bold rounded-lg shadow-sm transition-colors"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button 
                          onClick={() => handleAction(row.id, "Rejected")} 
                          className="inline-flex items-center gap-1 text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 font-bold rounded-lg shadow-sm transition-colors"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic">Handled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </HRPage>
  );
}