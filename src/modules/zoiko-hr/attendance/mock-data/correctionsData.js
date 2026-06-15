export function getCorrections() {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  return [
    { id: 1, employee: "Alice Johnson", date: yesterday, type: "missed_clock_in", reason: "Forgot to clock in when arriving", requestedOn: today, status: "pending", approvedBy: null, resolution: null },
    { id: 2, employee: "Bob Smith", date: yesterday, type: "incorrect_time", reason: "Clock out time was incorrect, left at 5:00 not 6:00", requestedOn: today, status: "approved", approvedBy: "HR Manager", resolution: "Corrected to 5:00 PM" },
    { id: 3, employee: "Carol Davis", date: yesterday, type: "wrong_status", reason: "Should be marked as WFH, not absent", requestedOn: today, status: "rejected", approvedBy: "HR Manager", resolution: "No proof of work from home" },
    { id: 4, employee: "David Lee", date: yesterday, type: "missed_clock_out", reason: "Left early for emergency, forgot to clock out", requestedOn: yesterday, status: "approved", approvedBy: "Team Lead", resolution: "Clock out set to 4:00 PM" },
    { id: 5, employee: "Eve Wilson", date: yesterday, type: "incorrect_time", reason: "Arrived at 8:30 but system shows 9:00", requestedOn: yesterday, status: "pending", approvedBy: null, resolution: null },
  ];
}
