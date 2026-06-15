export function getLeaveDashboard() {
  return {
    stats: {
      total: 45,
      pending: 8,
      approved: 28,
      rejected: 6,
      cancelled: 3,
      totalDays: 187,
    },
    balances: [
      { type: "annual", total: 20, used: 12, remaining: 8 },
      { type: "sick", total: 12, used: 4, remaining: 8 },
      { type: "casual", total: 10, used: 6, remaining: 4 },
      { type: "earned", total: 15, used: 5, remaining: 10 },
      { type: "maternity", total: 90, used: 0, remaining: 90 },
      { type: "paternity", total: 10, used: 0, remaining: 10 },
      { type: "unpaid", total: 30, used: 2, remaining: 28 },
      { type: "study", total: 10, used: 1, remaining: 9 },
      { type: "emergency", total: 5, used: 2, remaining: 3 },
    ],
    upcomingLeave: [
      { employee: "Alice Johnson", type: "annual", start: "2025-07-10", end: "2025-07-14", days: 5, status: "approved" },
      { employee: "Bob Smith", type: "sick", start: "2025-06-20", end: "2025-06-21", days: 2, status: "approved" },
      { employee: "Carol Davis", type: "casual", start: "2025-06-25", end: "2025-06-25", days: 1, status: "pending" },
      { employee: "David Lee", type: "annual", start: "2025-07-01", end: "2025-07-05", days: 5, status: "approved" },
      { employee: "Eve Wilson", type: "study", start: "2025-08-01", end: "2025-08-10", days: 10, status: "pending" },
    ],
    teamOverview: {
      total: 60,
      onLeave: 4,
      working: 48,
      wfh: 6,
      pending: 2,
    },
  };
}

export function getMyLeave() {
  return [
    { id: 1, employee_name: "You", leave_type: "annual", start_date: "2025-06-01", end_date: "2025-06-05", days: 5, reason: "Family vacation", status: "approved", created_at: "2025-05-15T10:30:00Z" },
    { id: 2, employee_name: "You", leave_type: "sick", start_date: "2025-05-10", end_date: "2025-05-11", days: 2, reason: "Flu", status: "approved", created_at: "2025-05-09T08:00:00Z" },
    { id: 3, employee_name: "You", leave_type: "casual", start_date: "2025-04-20", end_date: "2025-04-20", days: 1, reason: "Personal errand", status: "approved", created_at: "2025-04-18T14:00:00Z" },
    { id: 4, employee_name: "You", leave_type: "annual", start_date: "2025-03-15", end_date: "2025-03-19", days: 5, reason: "Spring break", status: "approved", created_at: "2025-03-01T09:00:00Z" },
    { id: 5, employee_name: "You", leave_type: "emergency", start_date: "2025-02-28", end_date: "2025-02-28", days: 1, reason: "Family emergency", status: "approved", created_at: "2025-02-28T07:00:00Z" },
    { id: 6, employee_name: "You", leave_type: "sick", start_date: "2025-02-10", end_date: "2025-02-12", days: 3, reason: "Medical procedure", status: "approved", created_at: "2025-02-09T11:00:00Z" },
    { id: 7, employee_name: "You", leave_type: "study", start_date: "2025-01-20", end_date: "2025-01-24", days: 5, reason: "Professional development course", status: "rejected", created_at: "2025-01-05T16:00:00Z" },
    { id: 8, employee_name: "You", leave_type: "unpaid", start_date: "2025-07-01", end_date: "2025-07-03", days: 3, reason: "Personal time off", status: "pending", created_at: "2025-06-14T10:00:00Z" },
    { id: 9, employee_name: "You", leave_type: "annual", start_date: "2025-08-15", end_date: "2025-08-18", days: 4, reason: "Weekend getaway", status: "pending", created_at: "2025-06-10T13:00:00Z" },
    { id: 10, employee_name: "You", leave_type: "casual", start_date: "2025-06-25", end_date: "2025-06-25", days: 1, reason: "Doctor appointment", status: "pending", created_at: "2025-06-12T09:30:00Z" },
  ];
}

export function getLeaveRequests() {
  return [
    { id: 1, employee_id: 101, employee_name: "Alice Johnson", department: "Engineering", leave_type: "annual", start_date: "2025-07-10", end_date: "2025-07-14", days: 5, reason: "Family vacation", status: "approved", reviewed_by: "HR Manager", reviewed_at: "2025-06-12T10:00:00Z", comments: "Enjoy your vacation!", created_at: "2025-06-10T08:30:00Z" },
    { id: 2, employee_id: 102, employee_name: "Bob Smith", department: "Marketing", leave_type: "sick", start_date: "2025-06-20", end_date: "2025-06-21", days: 2, reason: "Medical appointment", status: "approved", reviewed_by: "HR Manager", reviewed_at: "2025-06-13T09:00:00Z", comments: "Get well soon", created_at: "2025-06-12T14:00:00Z" },
    { id: 3, employee_id: 103, employee_name: "Carol Davis", department: "Sales", leave_type: "casual", start_date: "2025-06-25", end_date: "2025-06-25", days: 1, reason: "Personal errand", status: "pending", reviewed_by: null, reviewed_at: null, comments: null, created_at: "2025-06-14T09:00:00Z" },
    { id: 4, employee_id: 104, employee_name: "David Lee", department: "Engineering", leave_type: "annual", start_date: "2025-07-01", end_date: "2025-07-05", days: 5, reason: "International trip", status: "approved", reviewed_by: "HR Manager", reviewed_at: "2025-06-11T11:00:00Z", comments: "Approved", created_at: "2025-06-09T10:00:00Z" },
    { id: 5, employee_id: 105, employee_name: "Eve Wilson", department: "HR", leave_type: "study", start_date: "2025-08-01", end_date: "2025-08-10", days: 10, reason: "Leadership certification course", status: "pending", reviewed_by: null, reviewed_at: null, comments: null, created_at: "2025-06-14T16:00:00Z" },
    { id: 6, employee_id: 106, employee_name: "Frank Brown", department: "Finance", leave_type: "maternity", start_date: "2025-09-01", end_date: "2025-11-29", days: 90, reason: "Maternity leave", status: "approved", reviewed_by: "HR Manager", reviewed_at: "2025-06-10T15:00:00Z", comments: "Wishing you all the best", created_at: "2025-06-01T08:00:00Z" },
    { id: 7, employee_id: 107, employee_name: "Grace Taylor", department: "Engineering", leave_type: "sick", start_date: "2025-06-15", end_date: "2025-06-16", days: 2, reason: "Recovery from surgery", status: "rejected", reviewed_by: "HR Manager", reviewed_at: "2025-06-13T14:00:00Z", comments: "Please provide medical certificate", created_at: "2025-06-12T10:00:00Z" },
    { id: 8, employee_id: 108, employee_name: "Henry Martinez", department: "Sales", leave_type: "annual", start_date: "2025-07-20", end_date: "2025-07-25", days: 6, reason: "Family reunion", status: "pending", reviewed_by: null, reviewed_at: null, comments: null, created_at: "2025-06-15T11:00:00Z" },
    { id: 9, employee_id: 109, employee_name: "Ivy Anderson", department: "Marketing", leave_type: "emergency", start_date: "2025-06-18", end_date: "2025-06-18", days: 1, reason: "Family emergency", status: "approved", reviewed_by: "HR Manager", reviewed_at: "2025-06-14T09:00:00Z", comments: "Hope everything is okay", created_at: "2025-06-14T07:30:00Z" },
    { id: 10, employee_id: 110, employee_name: "Jack Thomas", department: "Engineering", leave_type: "paternity", start_date: "2025-08-01", end_date: "2025-08-10", days: 10, reason: "Birth of child", status: "approved", reviewed_by: "HR Manager", reviewed_at: "2025-06-12T16:00:00Z", comments: "Congratulations!", created_at: "2025-06-10T12:00:00Z" },
    { id: 11, employee_id: 111, employee_name: "Kate White", department: "HR", leave_type: "casual", start_date: "2025-06-28", end_date: "2025-06-28", days: 1, reason: "Half day personal", status: "pending", reviewed_by: null, reviewed_at: null, comments: null, created_at: "2025-06-15T08:00:00Z" },
    { id: 12, employee_id: 112, employee_name: "Leo Garcia", department: "Finance", leave_type: "annual", start_date: "2025-06-10", end_date: "2025-06-12", days: 3, reason: "Short break", status: "rejected", reviewed_by: "HR Manager", reviewed_at: "2025-06-08T10:00:00Z", comments: "Team has critical deliverables this week", created_at: "2025-06-05T09:00:00Z" },
    { id: 13, employee_id: 113, employee_name: "Mia Robinson", department: "Engineering", leave_type: "sick", start_date: "2025-06-17", end_date: "2025-06-19", days: 3, reason: "Viral infection", status: "pending", reviewed_by: null, reviewed_at: null, comments: null, created_at: "2025-06-16T07:00:00Z" },
    { id: 14, employee_id: 114, employee_name: "Noah Clark", department: "Sales", leave_type: "unpaid", start_date: "2025-07-05", end_date: "2025-07-07", days: 3, reason: "Personal reasons", status: "cancelled", reviewed_by: "Employee", reviewed_at: "2025-06-14T12:00:00Z", comments: "Cancelled by employee", created_at: "2025-06-10T14:00:00Z" },
    { id: 15, employee_id: 115, employee_name: "Olivia Hall", department: "Marketing", leave_type: "study", start_date: "2025-09-01", end_date: "2025-09-05", days: 5, reason: "Marketing certification exam", status: "pending", reviewed_by: null, reviewed_at: null, comments: null, created_at: "2025-06-15T15:00:00Z" },
    { id: 16, employee_id: 116, employee_name: "Peter Young", department: "Engineering", leave_type: "annual", start_date: "2025-08-20", end_date: "2025-08-22", days: 3, reason: "Mini vacation", status: "pending", reviewed_by: null, reviewed_at: null, comments: null, created_at: "2025-06-14T10:30:00Z" },
    { id: 17, employee_id: 117, employee_name: "Quinn Adams", department: "Finance", leave_type: "casual", start_date: "2025-06-22", end_date: "2025-06-22", days: 1, reason: "Bank appointment", status: "approved", reviewed_by: "HR Manager", reviewed_at: "2025-06-15T09:00:00Z", comments: "Approved", created_at: "2025-06-13T11:00:00Z" },
    { id: 18, employee_id: 118, employee_name: "Rachel Baker", department: "HR", leave_type: "emergency", start_date: "2025-06-19", end_date: "2025-06-20", days: 2, reason: "Urgent family matter", status: "approved", reviewed_by: "HR Manager", reviewed_at: "2025-06-15T10:00:00Z", comments: "Take care", created_at: "2025-06-15T08:00:00Z" },
    { id: 19, employee_id: 119, employee_name: "Sam Carter", department: "Engineering", leave_type: "sick", start_date: "2025-06-23", end_date: "2025-06-24", days: 2, reason: "Dental surgery", status: "rejected", reviewed_by: "HR Manager", reviewed_at: "2025-06-15T11:00:00Z", comments: "Please resubmit with proper documentation", created_at: "2025-06-12T09:00:00Z" },
    { id: 20, employee_id: 120, employee_name: "Tina Diaz", department: "Sales", leave_type: "annual", start_date: "2025-07-15", end_date: "2025-07-19", days: 5, reason: "Family wedding", status: "pending", reviewed_by: null, reviewed_at: null, comments: null, created_at: "2025-06-15T14:00:00Z" },
  ];
}

export function getLeaveCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const makeDate = (d) => {
    const dt = new Date(year, month, d);
    return dt.toISOString().split("T")[0];
  };
  return [
    { id: 1, employee_name: "Alice Johnson", department: "Engineering", leave_type: "annual", start_date: makeDate(10), end_date: makeDate(14), days: 5, status: "approved" },
    { id: 2, employee_name: "Bob Smith", department: "Marketing", leave_type: "sick", start_date: makeDate(20), end_date: makeDate(21), days: 2, status: "approved" },
    { id: 3, employee_name: "Carol Davis", department: "Sales", leave_type: "casual", start_date: makeDate(25), end_date: makeDate(25), days: 1, status: "pending" },
    { id: 4, employee_name: "David Lee", department: "Engineering", leave_type: "annual", start_date: makeDate(1), end_date: makeDate(5), days: 5, status: "approved" },
    { id: 5, employee_name: "Eve Wilson", department: "HR", leave_type: "study", start_date: makeDate(1), end_date: makeDate(10), days: 10, status: "pending" },
    { id: 6, employee_name: "Frank Brown", department: "Finance", leave_type: "maternity", start_date: makeDate(1), end_date: makeDate(30), days: 30, status: "approved" },
    { id: 7, employee_name: "Grace Taylor", department: "Engineering", leave_type: "sick", start_date: makeDate(15), end_date: makeDate(16), days: 2, status: "rejected" },
    { id: 8, employee_name: "Henry Martinez", department: "Sales", leave_type: "annual", start_date: makeDate(20), end_date: makeDate(25), days: 6, status: "pending" },
    { id: 9, employee_name: "Ivy Anderson", department: "Marketing", leave_type: "emergency", start_date: makeDate(18), end_date: makeDate(18), days: 1, status: "approved" },
    { id: 10, employee_name: "Jack Thomas", department: "Engineering", leave_type: "paternity", start_date: makeDate(1), end_date: makeDate(10), days: 10, status: "approved" },
    { id: 11, employee_name: "Kate White", department: "HR", leave_type: "casual", start_date: makeDate(28), end_date: makeDate(28), days: 1, status: "pending" },
    { id: 12, employee_name: "Leo Garcia", department: "Finance", leave_type: "annual", start_date: makeDate(10), end_date: makeDate(12), days: 3, status: "rejected" },
    { id: 13, employee_name: "Mia Robinson", department: "Engineering", leave_type: "sick", start_date: makeDate(17), end_date: makeDate(19), days: 3, status: "pending" },
    { id: 14, employee_name: "Noah Clark", department: "Sales", leave_type: "unpaid", start_date: makeDate(5), end_date: makeDate(7), days: 3, status: "cancelled" },
    { id: 15, employee_name: "Olivia Hall", department: "Marketing", leave_type: "study", start_date: makeDate(1), end_date: makeDate(5), days: 5, status: "pending" },
  ];
}

export function getLeaveTypes() {
  return [
    { id: 1, name: "Annual Leave", code: "annual", default_days: 20, carry_forward: true, min_notice: 7, max_consecutive: 15, requires_approval: true, status: "active" },
    { id: 2, name: "Sick Leave", code: "sick", default_days: 12, carry_forward: false, min_notice: 0, max_consecutive: 5, requires_approval: true, status: "active" },
    { id: 3, name: "Casual Leave", code: "casual", default_days: 10, carry_forward: false, min_notice: 1, max_consecutive: 3, requires_approval: true, status: "active" },
    { id: 4, name: "Earned Leave", code: "earned", default_days: 15, carry_forward: true, min_notice: 3, max_consecutive: 10, requires_approval: true, status: "active" },
    { id: 5, name: "Maternity Leave", code: "maternity", default_days: 90, carry_forward: false, min_notice: 30, max_consecutive: 90, requires_approval: true, status: "active" },
    { id: 6, name: "Paternity Leave", code: "paternity", default_days: 10, carry_forward: false, min_notice: 7, max_consecutive: 10, requires_approval: true, status: "active" },
    { id: 7, name: "Unpaid Leave", code: "unpaid", default_days: 30, carry_forward: false, min_notice: 3, max_consecutive: 15, requires_approval: true, status: "active" },
    { id: 8, name: "Study Leave", code: "study", default_days: 10, carry_forward: false, min_notice: 14, max_consecutive: 10, requires_approval: true, status: "active" },
    { id: 9, name: "Emergency Leave", code: "emergency", default_days: 5, carry_forward: false, min_notice: 0, max_consecutive: 3, requires_approval: false, status: "active" },
  ];
}

export function getLeaveReports() {
  return {
    total_requests: 45,
    approval_rate: 73.3,
    avg_days: 4.2,
    department_breakdown: [
      { dept: "Engineering", requests: 14, approved: 10, rejected: 2, pending: 2 },
      { dept: "Marketing", requests: 8, approved: 5, rejected: 1, pending: 2 },
      { dept: "Sales", requests: 10, approved: 6, rejected: 2, pending: 2 },
      { dept: "HR", requests: 6, approved: 4, rejected: 0, pending: 2 },
      { dept: "Finance", requests: 7, approved: 3, rejected: 2, pending: 2 },
    ],
    monthly_trend: [
      { month: "Jan", requests: 5, approved: 4 },
      { month: "Feb", requests: 3, approved: 3 },
      { month: "Mar", requests: 7, approved: 5 },
      { month: "Apr", requests: 6, approved: 4 },
      { month: "May", requests: 8, approved: 6 },
      { month: "Jun", requests: 10, approved: 6 },
      { month: "Jul", requests: 4, approved: 0 },
      { month: "Aug", requests: 2, approved: 0 },
    ],
    type_distribution: [
      { type: "annual", count: 18 },
      { type: "sick", count: 8 },
      { type: "casual", count: 6 },
      { type: "study", count: 3 },
      { type: "maternity", count: 2 },
      { type: "paternity", count: 2 },
      { type: "emergency", count: 3 },
      { type: "unpaid", count: 3 },
    ],
  };
}
