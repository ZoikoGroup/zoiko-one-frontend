export function getTravelDashboard() {
  return {
    stats: {
      pendingRequests: 8,
      approvedTrips: 24,
      monthlyExpenses: 45280,
      teamMembers: 12,
    },
    upcomingTrips: [
      { id: 1, employee: "Sarah Chen", destination: "Berlin, DE", startDate: "2026-06-20", endDate: "2026-06-24", purpose: "Tech Summit 2026", status: "approved" },
      { id: 2, employee: "Mike Johnson", destination: "Tokyo, JP", startDate: "2026-06-25", endDate: "2026-07-02", purpose: "Client Meeting", status: "approved" },
      { id: 3, employee: "Emily Davis", destination: "London, UK", startDate: "2026-07-05", endDate: "2026-07-08", purpose: "Conference", status: "pending" },
      { id: 4, employee: "Alex Rivera", destination: "Paris, FR", startDate: "2026-07-10", endDate: "2026-07-14", purpose: "Workshop", status: "approved" },
      { id: 5, employee: "Lisa Park", destination: "Sydney, AU", startDate: "2026-07-15", endDate: "2026-07-22", purpose: "Training", status: "pending" },
    ],
    recentActivity: [
      { id: 1, action: "Trip Approved", employee: "Sarah Chen", destination: "Berlin, DE", date: "2026-06-15T10:30:00" },
      { id: 2, action: "Expense Report Submitted", employee: "Mike Johnson", destination: "Tokyo, JP", date: "2026-06-14T14:00:00" },
      { id: 3, action: "Travel Request Created", employee: "Emily Davis", destination: "London, UK", date: "2026-06-13T09:15:00" },
      { id: 4, action: "Reimbursement Completed", employee: "Tom Wilson", destination: "Chicago, US", date: "2026-06-12T16:45:00" },
      { id: 5, action: "Trip Completed", employee: "Alex Rivera", destination: "Paris, FR", date: "2026-06-11T11:00:00" },
      { id: 6, action: "Expense Approved", employee: "Lisa Park", destination: "Sydney, AU", date: "2026-06-10T08:30:00" },
    ],
  };
}
