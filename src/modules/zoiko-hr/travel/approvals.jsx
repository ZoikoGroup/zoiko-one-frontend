import { useState, useEffect } from "react";
import HRPage from "../../../components/HRPage";
import { DataTable } from "./DataTable.jsx";
import { fetchList, updateRecord } from "../../../service/hrService.js";

const formatCurrency = (amount) => 
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);

export default function TravelApprovals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getApprovals() {
      try {
        const res = await fetchList("travel");
        setApprovals(res || []);
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    }
    getApprovals();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await updateRecord("travel", id, { status });
      setApprovals(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      alert("Action execution failed.");
    }
  };

  const columns = [
    { key: "employee", label: "Employee" },
    { key: "destination", label: "Destination" },
    { key: "amount", label: "Amount", render: (v) => formatCurrency(v) },
    { key: "status", label: "Status" },
    {
      key: "id",
      label: "Actions",
      render: (id, row) => row.status?.toLowerCase() === "pending" && (
        <div className="flex gap-2">
          <button onClick={() => handleAction(id, "Approved")} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Approve</button>
          <button onClick={() => handleAction(id, "Rejected")} className="text-xs bg-red-600 text-white px-2 py-1 rounded">Reject</button>
        </div>
      )
    }
  ];

  return (
    <HRPage title="Travel Approvals" subtitle="Review incoming travel authorizations">
      {loading ? <p className="text-center py-5">Loading records...</p> : <DataTable columns={columns} data={approvals} />}
    </HRPage>
  );
}