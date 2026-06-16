import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, Download, Send, CheckCircle, XCircle } from "lucide-react";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/recruitment" },
  { label: "Job Requisitions", href: "/zoiko-hr/recruitment/job-requisitions" },
  { label: "Open Positions", href: "/zoiko-hr/recruitment/open-positions" },
  { label: "Candidates", href: "/zoiko-hr/recruitment/candidates" },
  { label: "Interview Pipeline", href: "/zoiko-hr/recruitment/interview-pipeline" },
  { label: "Offer Management", href: "/zoiko-hr/recruitment/offers" },
  { label: "Hiring Schedule", href: "/zoiko-hr/recruitment/hiring-schedule" },
  { label: "Analytics", href: "/zoiko-hr/recruitment/analytics" },
  { label: "Reports", href: "/zoiko-hr/recruitment/reports" },
  { label: "Settings", href: "/zoiko-hr/recruitment/settings" },
];

const initialOffers = [
  { id: 1, candidate: "Alice Johnson", position: "Senior Frontend Dev", amount: 145000, status: "pending", sentDate: "2025-04-01", expiryDate: "2025-04-15", notes: "" },
  { id: 2, candidate: "Bob Smith", position: "Backend Engineer", amount: 130000, status: "accepted", sentDate: "2025-03-28", expiryDate: "2025-04-11", notes: "Negotiated start date" },
  { id: 3, candidate: "Carol Davis", position: "Product Designer", amount: 125000, status: "negotiating", sentDate: "2025-04-02", expiryDate: "2025-04-16", notes: "Requested higher equity" },
  { id: 4, candidate: "David Lee", position: "DevOps Engineer", amount: 140000, status: "pending", sentDate: "2025-04-03", expiryDate: "2025-04-17", notes: "" },
  { id: 5, candidate: "Eva Martinez", position: "Senior Frontend Dev", amount: 150000, status: "accepted", sentDate: "2025-03-25", expiryDate: "2025-04-08", notes: "Start date: May 1" },
  { id: 6, candidate: "Frank Wilson", position: "Data Analyst", amount: 95000, status: "rejected", sentDate: "2025-04-01", expiryDate: "2025-04-15", notes: "Counter offer declined" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/recruitment"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${isActive ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const m = { pending: "bg-yellow-100 text-yellow-800 capitalize", accepted: "bg-green-100 text-green-800 capitalize", negotiating: "bg-blue-100 text-blue-800 capitalize", rejected: "bg-red-100 text-red-800 capitalize" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${m[status] || "bg-gray-100 text-gray-800 capitalize"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function OfferManagement() {
  const [search, setSearch] = useState("");
  const [offers, setOffers] = useState(initialOffers);

  const filtered = search
    ? offers.filter((o) => o.candidate.toLowerCase().includes(search.toLowerCase()) || o.position.toLowerCase().includes(search.toLowerCase()))
    : offers;

  const updateStatus = (id, status) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const counts = offers.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
  const totalOffers = offers.length;

  return (
    <HRPage title="Offer Management" subtitle="Create and manage job offers">
      <SubNav />
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Offers</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalOffers}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{counts.pending || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Accepted</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{counts.accepted || 0}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Negotiating</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{counts.negotiating || 0}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search offers..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
            <Download className="w-4 h-4" /> Export Offers
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Candidate</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Position</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sent Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Expiry</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((offer) => (
                <tr key={offer.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{offer.candidate}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{offer.position}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">${offer.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={offer.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(offer.sentDate)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(offer.expiryDate)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {offer.status === "pending" && (
                        <>
                          <button onClick={() => updateStatus(offer.id, "accepted")} className="p-1 hover:bg-green-50 rounded text-green-600" title="Accept"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => updateStatus(offer.id, "negotiating")} className="p-1 hover:bg-blue-50 rounded text-blue-600" title="Negotiate"><Send className="w-4 h-4" /></button>
                          <button onClick={() => updateStatus(offer.id, "rejected")} className="p-1 hover:bg-red-50 rounded text-red-600" title="Reject"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                      <span className="text-xs text-gray-400">{offer.notes}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
