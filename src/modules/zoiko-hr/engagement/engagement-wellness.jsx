import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/engagement" },
  { label: "Wellness Programs", href: "/zoiko-hr/engagement/wellness" },
  { label: "CSR Activities", href: "/zoiko-hr/engagement/csr" },
  { label: "Communications", href: "/zoiko-hr/engagement/communications" },
  { label: "Announcements", href: "/zoiko-hr/engagement/announcements" },
  { label: "NPS Surveys", href: "/zoiko-hr/engagement/nps" },
  { label: "Analytics", href: "/zoiko-hr/engagement/analytics" },
  { label: "Reports", href: "/zoiko-hr/engagement/reports" },
  { label: "Settings", href: "/zoiko-hr/engagement/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/engagement"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50"
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

export default function EngagementWellness() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/engagement/wellness");
        const data = await res.json();
        setPrograms(data);
      } catch {
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading wellness programs...</div>;

  return (
    <HRPage title="Employee Engagement" subtitle="Wellness programs and employee benefits">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wellness Programs</h1>
          <p className="text-sm text-gray-500 mt-1">Health and wellness initiatives for employees</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <div key={p.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>{p.status}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{p.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Participants:</span>
                  <span className="font-medium">{p.participants}</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget:</span>
                  <span className="font-medium">${p.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <span className="font-medium">{p.startDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!programs.length && (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center text-gray-500">
            No wellness programs available yet. Start by creating a new program.
          </div>
        )}
      </div>
    </HRPage>
  );
}
