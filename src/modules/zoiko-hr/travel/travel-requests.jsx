import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { DataTable } from "./DataTable.jsx";
import { fetchList, createRecord } from "../../../service/hrService.js";

const formatCurrency = (amount) => 
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/travel" },
  { label: "Requests", href: "/zoiko-hr/travel/requests" },
  { label: "Approvals", href: "/zoiko-hr/travel/approvals" },
  { label: "Itineraries", href: "/zoiko-hr/travel/itineraries" },
  { label: "Expenses", href: "/zoiko-hr/travel/expenses" },
  { label: "Reports", href: "/zoiko-hr/travel/reports" },
  { label: "Settings", href: "/zoiko-hr/travel/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/travel/requests"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function TravelRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ employee: "", destination: "", purpose: "", type: "Domestic", amount: "" });

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const res = await fetchList("travel");
        setRequests(res || []);
      } catch (err) {
        console.error("Failed to load requests:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.employee || !form.destination || !form.amount) {
      alert("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount), status: "Pending" };
      const newRecord = await createRecord("travel", payload);
      setRequests(prev => [newRecord, ...prev]);
      setShowModal(false);
      setForm({ employee: "", destination: "", purpose: "", type: "Domestic", amount: "" });
    } catch (err) {
      alert("Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = requests.filter(r => 
    (r.employee || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.destination || "").toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "destination", label: "Destination", render: (v) => <span className="text-gray-700">{v}</span> },
    { key: "type", label: "Type", render: (v) => <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">{v}</span> },
    { key: "amount", label: "Amount", render: (v) => <span className="font-medium text-gray-900">{formatCurrency(v)}</span> },
    { key: "status", label: "Status", render: (v) => <span className="text-xs px-2 py-1 rounded font-semibold bg-orange-100 text-orange-800">{v}</span> },
  ];

  return (
    <HRPage title="Travel Requests" subtitle="Submit and monitor operational items">
      <SubNav />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <input 
            type="text" 
            placeholder="Search requests..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="border p-2 rounded-lg text-sm max-w-xs w-full"
          />
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">New Request</button>
        </div>

        {loading ? <div className="text-center">Loading requests...</div> : <DataTable columns={columns} data={filtered} />}
        
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-lg font-bold">New Travel Request</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <input type="text" placeholder="Employee Name" className="w-full border p-2 rounded" value={form.employee} onChange={e => setForm({...form, employee: e.target.value})} />
                <input type="text" placeholder="Destination" className="w-full border p-2 rounded" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} />
                <input type="number" placeholder="Estimated Amount" className="w-full border p-2 rounded" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowModal(false)} className="border px-4 py-2 rounded">Cancel</button>
                  <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded">{submitting ? "Submitting..." : "Submit"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}