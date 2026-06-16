import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/documents" },
  { label: "Employee Documents", href: "/zoiko-hr/documents/employee-documents" },
  { label: "Company Documents", href: "/zoiko-hr/documents/company-documents" },
  { label: "Templates", href: "/zoiko-hr/documents/templates" },
  { label: "Policies", href: "/zoiko-hr/documents/policies" },
  { label: "Compliance Documents", href: "/zoiko-hr/documents/compliance" },
  { label: "Approval Workflow", href: "/zoiko-hr/documents/approvals" },
  { label: "Expiring Documents", href: "/zoiko-hr/documents/expiring-documents" },
  { label: "Archive", href: "/zoiko-hr/documents/archive" },
  { label: "Reports", href: "/zoiko-hr/documents/reports" },
  { label: "Settings", href: "/zoiko-hr/documents/settings" },
];

const MOCK_EXPIRING = [
  { id: 1, document: "Employment Contract - Alice J.", type: "Contract", expiryDate: "2025-06-15", status: "valid", owner: "Alice J." },
  { id: 2, document: "NDA - Bob S.", type: "Legal", expiryDate: "2025-04-01", status: "expiring_soon", owner: "Bob S." },
  { id: 3, document: "Training Cert - David W.", type: "Certification", expiryDate: "2025-03-20", status: "expiring_soon", owner: "David W." },
  { id: 4, document: "Insurance Policy", type: "Insurance", expiryDate: "2025-08-01", status: "valid", owner: "Company" },
  { id: 5, document: "Vendor Contract - XYZ Corp", type: "Contract", expiryDate: "2025-03-15", status: "expired", owner: "Sarah M." },
  { id: 6, document: "Compliance Certificate", type: "Compliance", expiryDate: "2025-05-01", status: "valid", owner: "Compliance Team" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/documents"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const m = { valid: "bg-green-100 text-green-800", expiring_soon: "bg-orange-100 text-orange-800", expired: "bg-red-100 text-red-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

function daysUntil(dateStr) {
  if (!dateStr) return Infinity;
  return Math.ceil((new Date(dateStr) - new Date()) / (86400000));
}

export default function ExpiringDocuments() {
  const items = MOCK_EXPIRING;

  return (
    <HRPage title="Expiring Documents" subtitle="Monitor document expirations and renewals">
      <SubNav />
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

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Document", "Type", "Expiry Date", "Days Left", "Status", "Owner", ""].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => {
                const days = daysUntil(i.expiryDate);
                return (
                  <tr key={i.id || idx} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                    <td className="px-3 py-3 font-medium text-gray-900">{i.document}</td>
                    <td className="px-3 py-3">{i.type}</td>
                    <td className="px-3 py-3">{formatDate(i.expiryDate)}</td>
                    <td className="px-3 py-3">
                      <span className={`font-mono font-bold ${days <= 0 ? "text-red-600" : days <= 30 ? "text-orange-600" : "text-green-600"}`}>
                        {days <= 0 ? "Expired" : `${days} days`}
                      </span>
                    </td>
                    <td className="px-3 py-3"><StatusBadge status={i.status} /></td>
                    <td className="px-3 py-3 text-gray-500">{i.owner}</td>
                    <td className="px-3 py-3">
                      <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">Renew</button>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">No items found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
