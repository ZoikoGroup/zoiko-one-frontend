import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Search, Calendar, MapPin, DollarSign, Briefcase, User, X } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getTravel, createTravel, getHrEmployees } from "../../../service/hrService.js";

const formatCurrency = (amount) => 
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/travel" },
  { label: "Requests", href: "/zoiko-hr/travel/requests" },
  { label: "Approvals", href: "/zoiko-hr/travel/approvals" },
  { label: "Expenses", href: "/zoiko-hr/travel/expenses" },
  { label: "Settings", href: "/zoiko-hr/travel/settings" }
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
            `whitespace-nowrap px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-200 ${
              isActive ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ employee_id: "", destination: "", purpose: "", type: "Domestic", amount: "" });

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [travelRes, empRes] = await Promise.all([getTravel(), getHrEmployees()]);
        
        setRequests(travelRes?.data || travelRes || []);
        setEmployees(empRes?.data || empRes || []);
      } catch (err) {
        console.error("Failed to load initial modules:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.destination || !form.amount) {
      alert("Please accurately fill all mandatory input parameters.");
      return;
    }
    setSubmitting(true);
    try {
      const selectedEmp = employees.find(emp => emp.id.toString() === form.employee_id.toString());
      const payload = { 
        ...form, 
        employee_id: parseInt(form.employee_id),
        employee_name: selectedEmp ? `${selectedEmp.first_name || ""} ${selectedEmp.last_name || ""}`.trim() : "Unknown",
        amount: parseFloat(form.amount), 
        status: "Pending" 
      };
      
      const newRecordResponse = await createTravel(payload);
      const addedItem = newRecordResponse?.data || newRecordResponse;
      
      setRequests(prev => [addedItem, ...prev]);
      setShowModal(false);
      setForm({ employee_id: "", destination: "", purpose: "", type: "Domestic", amount: "" });
    } catch (err) {
      alert("Failed to securely deploy your travel registration request.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = requests.filter(r => 
    (r.employee_name || r.employee || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.destination || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <HRPage title="Travel Requests" subtitle="Submit and monitor operational items">
      <SubNav />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter workflows..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
            />
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Issue Request
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Syncing database entries...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-400 text-sm font-medium">No records found matching search queries.</div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-600">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Destination Target</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Category Type</th>
                  <th className="p-4">Budget Provision</th>
                  <th className="p-4">Status Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {filtered.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-gray-50/40 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">{row.employee_name || row.employee || `ID: ${row.employee_id}`}</td>
                    <td className="p-4">{row.destination}</td>
                    <td className="p-4 text-gray-500">{row.purpose || "—"}</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">{row.type}</span></td>
                    <td className="p-4 text-gray-900 font-semibold">{formatCurrency(row.amount)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide capitalize ${
                        row.status?.toLowerCase() === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>{row.status || "Pending"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Modal form container */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-900">New Travel Request</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Active Employee</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select 
                      className="w-full border border-gray-200 pl-9 pr-4 py-2.5 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      value={form.employee_id} 
                      onChange={e => setForm({...form, employee_id: e.target.value})}
                      required
                    >
                      <option value="">Choose employee...</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name} ({emp.email || emp.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Destination Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="e.g. San Francisco Office" className="w-full border border-gray-200 pl-9 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Jurisdiction Type</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <select className="w-full border border-gray-200 pl-9 pr-4 py-2.5 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Amount</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input type="number" placeholder="0.00" className="w-full border border-gray-200 pl-9 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Purpose of Travel</label>
                  <textarea placeholder="Specify strategic goals..." rows="2" className="w-full border border-gray-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} />
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                  <button type="button" onClick={() => setShowModal(false)} className="border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600">Cancel</button>
                  <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50">
                    {submitting ? "Processing..." : "Deploy Workspace"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}