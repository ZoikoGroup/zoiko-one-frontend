import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { DataTable } from "./DataTable.jsx";

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
          end={item.href === "/zoiko-hr/travel"}
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

const mockItinerariesData = [
  { id: 1, employee: "Alice Johnson", destination: "New York", startDate: "2025-04-01", endDate: "2025-04-05", purpose: "Business Meeting", type: "Domestic", status: "confirmed" },
  { id: 2, employee: "Bob Smith", destination: "London", startDate: "2025-04-02", endDate: "2025-04-06", purpose: "Conference", type: "International", status: "confirmed" },
  { id: 3, employee: "Carol Davis", destination: "Paris", startDate: "2025-04-03", endDate: "2025-04-07", purpose: "Client Visit", type: "International", status: "pending" },
  { id: 4, employee: "David Lee", destination: "Tokyo", startDate: "2025-04-04", endDate: "2025-04-08", purpose: "Training", type: "International", status: "pending" },
  { id: 5, employee: "Eva Martinez", destination: "Singapore", startDate: "2025-04-05", endDate: "2025-04-09", purpose: "Partnership", type: "International", status: "confirmed" },
  { id: 6, employee: "Frank Wilson", destination: "Berlin", startDate: "2025-04-06", endDate: "2025-04-10", purpose: "Business Trip", type: "Domestic", status: "pending" },
  { id: 7, employee: "Grace Kim", destination: "Sydney", startDate: "2025-04-07", endDate: "2025-04-11", purpose: "Conference", type: "International", status: "confirmed" },
  { id: 8, employee: "Henry Brown", destination: "Dubai", startDate: "2025-04-08", endDate: "2025-04-12", purpose: "Client Meeting", type: "International", status: "pending" },
];

export default function TravelItineraries() {
  const [itineraries] = useState(mockItinerariesData);

  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "destination", label: "Destination", render: (v) => <span className="text-gray-700">{v}</span> },
    { key: "startDate", label: "Start Date", render: (v) => <span className="text-gray-500">{v}</span> },
    { key: "endDate", label: "End Date", render: (v) => <span className="text-gray-500">{v}</span> },
    { key: "purpose", label: "Purpose", render: (v) => <span className="text-gray-500 truncate max-w-[200px] block">{v}</span> },
    { key: "type", label: "Type", render: (v) => <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{v}</span> },
    { key: "status", label: "Status", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[v]}`}>{v}</span> },
  ];

  return (
    <HRPage title="Travel" subtitle="Manage travel itineraries and schedules">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Itineraries</h1>
          <p className="text-sm text-gray-500 mt-1">Manage travel itineraries and schedules</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Itineraries</h2>
          <DataTable columns={columns} data={itineraries} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Status Summary</h3>
            <div className="space-y-3">
              {Object.entries(
                itineraries.reduce((acc, i) => {
                  acc[i.status] = (acc[i.status] || 0) + 1;
                  return acc;
                }, {})
              ).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{status}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Type Summary</h3>
            <div className="space-y-3">
              {Object.entries(
                itineraries.reduce((acc, i) => {
                  acc[i.type] = (acc[i.type] || 0) + 1;
                  return acc;
                }, {})
              ).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{type}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HRPage>
  );
}
