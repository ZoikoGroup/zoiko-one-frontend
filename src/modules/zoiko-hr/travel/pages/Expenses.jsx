import { useState, useMemo } from "react";
import { Plus, Receipt } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useExpenses } from "../hooks/useTravel";
import { formatDate, formatCurrency } from "../utils/helpers";

const CATEGORY_OPTIONS = [
  { value: "flight", label: "Flight" },
  { value: "hotel", label: "Hotel" },
  { value: "transport", label: "Transport" },
  { value: "meals", label: "Meals" },
  { value: "supplies", label: "Supplies" },
  { value: "other", label: "Other" },
];

export default function TravelExpenses() {
  const { data: expenses, loading } = useExpenses();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    let result = expenses;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.employee?.toLowerCase().includes(q) || e.tripRef?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q));
    }
    if (categoryFilter) result = result.filter((e) => e.category === categoryFilter);
    return result;
  }, [expenses, search, categoryFilter]);

  const totalAmount = useMemo(() => filtered.reduce((sum, e) => sum + e.amount, 0), [filtered]);

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "tripRef", label: "Trip Ref", render: (v) => <span className="font-mono text-xs text-gray-500">{v}</span> },
    { key: "category", label: "Category", render: (v) => <span className="capitalize">{v}</span> },
    { key: "amount", label: "Amount", render: (v) => <span className="font-medium">{formatCurrency(v)}</span> },
    { key: "date", label: "Date", render: (v) => formatDate(v) },
    { key: "description", label: "Description" },
    { key: "receipt", label: "Receipt", render: (v) => <a href={v} className="text-purple-600 hover:text-purple-800 text-xs font-medium">View</a> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading expenses...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Expenses</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage travel-related expenses</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
        <Receipt className="w-5 h-5 text-purple-600" />
        <span className="text-gray-500">Total Filtered Expenses:</span>
        <span className="text-lg font-bold text-gray-900">{formatCurrency(totalAmount)}</span>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        onFilterChange={(key, val) => setCategoryFilter(val)}
        filters={[{ key: "category", placeholder: "All Categories", options: CATEGORY_OPTIONS, value: categoryFilter }]}
      />

      <DataTable columns={columns} data={filtered} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Add Expense</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Select category...</option>
                  {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">Add Expense</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
