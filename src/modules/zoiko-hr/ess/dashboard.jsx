import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/ess" },
  { label: "Profile", href: "/zoiko-hr/ess/profile" },
  { label: "Leave Management", href: "/zoiko-hr/ess/leave" },
  { label: "Attendance", href: "/zoiko-hr/ess/attendance" },
  { label: "My Documents", href: "/zoiko-hr/ess/my-documents" },
  { label: "Requests", href: "/zoiko-hr/ess/requests" },
  { label: "Settings", href: "/zoiko-hr/ess/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/ess"}
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

const mockDashboardData = {
  totalLeaveBalance: 25,
  pendingRequests: 3,
  pendingApprovals: 2,
  attendanceToday: {
    status: "Present",
    checkIn: "09:00 AM",
    checkOut: "05:30 PM",
    hoursWorked: 8.5,
  },
  summary: {
    annual: { used: 12, total: 20 },
    sick: { used: 2, total: 5 },
    personal: { used: 1, total: 3 },
    unpaid: { used: 0, total: 2 },
  },
  recentRequests: [
    { id: 1, type: "Annual Leave", description: "Request for vacation", status: "pending", date: "2025-04-01" },
    { id: 2, type: "Sick Leave", description: "Doctor's appointment", status: "approved", date: "2025-03-28" },
    { id: 3, type: "Personal Leave", description: "Family event", status: "pending", date: "2025-04-05" },
  ],
  upcomingEvents: [
    { id: 1, title: "Team Meeting", date: "2025-04-02", time: "10:00 AM" },
    { id: 2, title: "Performance Review", date: "2025-04-05", time: "02:00 PM" },
  ],
  quickLinks: [
    { label: "Apply Leave", href: "/zoiko-hr/ess/leave" },
    { label: "Request Time Off", href: "/zoiko-hr/ess/requests" },
    { label: "View Documents", href: "/zoiko-hr/ess/my-documents" },
    { label: "Update Profile", href: "/zoiko-hr/ess/profile" },
  ],
};

export default function EssDashboard() {
  const [dashboard] = useState(mockDashboardData);

  if (!dashboard) {
    return (
      <HRPage title="Employee Self Service" subtitle="Overview of your ESS portal">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading dashboard...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Employee Self Service" subtitle="Overview of your ESS portal">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ESS Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your employee self-service portal</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Leave Balance</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{dashboard.totalLeaveBalance} days</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{dashboard.pendingRequests}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7 0v18m0-13H6" />
                </svg>
                2 from last month
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{dashboard.pendingApprovals}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h10L9 13H7l8-10h-2M7 7L5 3m2 4l-2 4m0 0L2 11l4 2m0 0l2-4" />
                </svg>
                -1 from last month
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Today's Attendance</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{dashboard.attendanceToday.status}</p>
              <p className="text-xs text-gray-400 mt-1">Hours worked: {dashboard.attendanceToday.hoursWorked}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{dashboard.upcomingEvents.length}</p>
              <p className="text-xs text-gray-400 mt-1">This week</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Leave Balance Summary</h2>
              <span className="text-xs text-blue-600 font-medium">View all</span>
            </div>
            <div className="space-y-3">
              {Object.entries(dashboard.summary).map(([key, val]) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{key.replace(/\s/g, " ").replace(/\w/g, (l) => l.toUpperCase().slice(0, 1))}</span>
                    <span className="text-gray-400">{val.remaining}/{val.total}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(val.used / val.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Attendance</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {dashboard.attendanceToday.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Check In</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{dashboard.attendanceToday.checkIn}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Check Out</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{dashboard.attendanceToday.checkOut}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">Hours worked: <span className="font-medium text-gray-900">{dashboard.attendanceToday.hoursWorked}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
              <span className="text-xs text-blue-600 font-medium">View all</span>
            </div>
            <div className="space-y-3">
              {dashboard.recentRequests.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.type}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{r.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${r.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                      {r.status}
                    </span>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
              <span className="text-xs text-blue-600 font-medium">View all</span>
            </div>
            <div className="space-y-3">
              {dashboard.upcomingEvents.map((e) => (
                <div key={e.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{e.title}</p>
                    <p className="text-xs text-gray-500">{e.date} at {e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {dashboard.quickLinks.map((link) => (
              <div key={link.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                <span className="text-sm font-medium text-gray-700">{link.label}</span>
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HRPage>
  );
}
