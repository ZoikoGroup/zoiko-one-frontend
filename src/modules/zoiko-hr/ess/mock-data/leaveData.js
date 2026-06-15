export function getLeaveBalance() {
  return {
    annual: { total: 20, used: 12, remaining: 8 },
    sick: { total: 12, used: 4, remaining: 8 },
    personal: { total: 5, used: 2, remaining: 3 },
    unpaid: { total: 10, used: 1, remaining: 9 },
  };
}

export function getLeaveRequests() {
  return [
    { id: 1, type: "annual", startDate: "2026-07-10", endDate: "2026-07-14", days: 5, reason: "Family vacation to Hawaii", status: "pending", appliedOn: "2026-06-01" },
    { id: 2, type: "sick", startDate: "2026-06-05", endDate: "2026-06-06", days: 2, reason: "Medical appointment", status: "approved", appliedOn: "2026-06-04" },
    { id: 3, type: "personal", startDate: "2026-05-20", endDate: "2026-05-20", days: 1, reason: "Personal errand", status: "approved", appliedOn: "2026-05-18" },
    { id: 4, type: "annual", startDate: "2026-04-10", endDate: "2026-04-14", days: 5, reason: "Spring break trip", status: "completed", appliedOn: "2026-03-15" },
    { id: 5, type: "unpaid", startDate: "2026-08-01", endDate: "2026-08-05", days: 5, reason: "Extended personal leave", status: "pending", appliedOn: "2026-07-01" },
    { id: 6, type: "sick", startDate: "2026-03-10", endDate: "2026-03-11", days: 2, reason: "Flu", status: "completed", appliedOn: "2026-03-10" },
    { id: 7, type: "annual", startDate: "2026-02-15", endDate: "2026-02-19", days: 5, reason: "Winter vacation", status: "approved", appliedOn: "2026-01-20" },
    { id: 8, type: "personal", startDate: "2026-06-30", endDate: "2026-06-30", days: 1, reason: "Family event", status: "pending", appliedOn: "2026-06-15" },
    { id: 9, type: "sick", startDate: "2026-01-12", endDate: "2026-01-13", days: 2, reason: "Dental surgery", status: "rejected", appliedOn: "2026-01-11" },
    { id: 10, type: "annual", startDate: "2026-09-01", endDate: "2026-09-05", days: 5, reason: "Fall vacation", status: "pending", appliedOn: "2026-08-01" },
  ];
}
