export function getViolations() {
  return [
    { id: 1, employee: "John Smith", policy: "Data Protection Policy", violation: "Unauthorized data export to personal device", severity: "high", date: "2026-06-10", reportedBy: "IT Security", status: "investigating", resolution: null },
    { id: 2, employee: "Sarah Lee", policy: "IT Security Policy", violation: "Shared system admin credentials with contractor", severity: "critical", date: "2026-06-08", reportedBy: "System Alert", status: "open", resolution: null },
    { id: 3, employee: "Mike Chen", policy: "Code of Conduct", violation: "Inappropriate communication with colleague", severity: "medium", date: "2026-06-05", reportedBy: "HR", status: "resolved", resolution: "Verbal warning issued, mandatory training completed" },
    { id: 4, employee: "Emma Wilson", policy: "Financial Compliance", violation: "Expense report submitted without receipts", severity: "low", date: "2026-06-01", reportedBy: "Finance", status: "closed", resolution: "Expense denied, policy refresher sent" },
    { id: 5, employee: "Tom Baker", policy: "Anti-Bribery Policy", violation: "Accepted gift from vendor exceeding limit", severity: "high", date: "2026-05-28", reportedBy: "Legal", status: "investigating", resolution: null },
    { id: 6, employee: "Lisa Park", policy: "Data Protection Policy", violation: "Email containing PII sent to wrong recipient", severity: "critical", date: "2026-05-25", reportedBy: "IT Security", status: "resolved", resolution: "Data recall initiated, impact assessment completed" },
    { id: 7, employee: "James Wright", policy: "Remote Work Policy", violation: "Working from unauthorized location", severity: "low", date: "2026-05-20", reportedBy: "Manager", status: "closed", resolution: "Policy clarified, location approved" },
    { id: 8, employee: "Anna Kim", policy: "IT Security Policy", violation: "Failed to install security update on time", severity: "medium", date: "2026-05-15", reportedBy: "System Alert", status: "open", resolution: null },
  ];
}
