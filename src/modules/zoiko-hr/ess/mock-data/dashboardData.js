export function getEssDashboard() {
  return {
    totalLeaveBalance: 18,
    pendingRequests: 4,
    pendingApprovals: 2,
    attendanceToday: {
      date: "2026-06-15",
      checkIn: "08:52 AM",
      checkOut: "05:08 PM",
      status: "present",
      hoursWorked: "8h 16m",
    },
    upcomingEvents: [
      { id: 1, title: "Team Sync Meeting", date: "2026-06-16", time: "10:00 AM" },
      { id: 2, title: "Quarterly Review", date: "2026-06-20", time: "02:00 PM" },
      { id: 3, title: "HR Policy Townhall", date: "2026-06-25", time: "11:00 AM" },
    ],
    quickLinks: [
      { label: "Apply Leave", path: "/hr/ess/leaves" },
      { label: "View Payslips", path: "/hr/ess/documents" },
      { label: "Submit Request", path: "/hr/ess/requests" },
      { label: "My Profile", path: "/hr/ess/profile" },
    ],
    summary: {
      annual: { total: 20, used: 12, remaining: 8 },
      sick: { total: 12, used: 4, remaining: 8 },
      personal: { total: 5, used: 2, remaining: 3 },
      unpaid: { total: 10, used: 1, remaining: 9 },
    },
  };
}

export const recentRequests = [
  { id: 1, type: "Leave", description: "Annual leave - Family vacation", status: "approved", date: "2026-06-10" },
  { id: 2, type: "IT Support", description: "Laptop keyboard replacement", status: "pending", date: "2026-06-12" },
  { id: 3, type: "HR Request", description: "Name change in HR system", status: "pending", date: "2026-06-13" },
  { id: 4, type: "Facilities", description: "Desk relocation request", status: "completed", date: "2026-06-08" },
  { id: 5, type: "Leave", description: "Sick leave", status: "approved", date: "2026-06-05" },
];
