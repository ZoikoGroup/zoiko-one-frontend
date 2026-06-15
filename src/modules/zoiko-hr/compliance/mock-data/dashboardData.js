export function getComplianceDashboard() {
  return {
    stats: {
      totalPolicies: 24,
      pendingAcknowledgment: 8,
      openViolations: 5,
      upcomingAudits: 3,
      completedAudits: 12,
      riskScore: 42,
    },
    recentViolations: [
      { id: 1, employee: "John Smith", policy: "Data Protection Policy", severity: "high", date: "2026-06-10", status: "investigating" },
      { id: 2, employee: "Sarah Lee", policy: "IT Security Policy", severity: "critical", date: "2026-06-08", status: "open" },
      { id: 3, employee: "Mike Chen", policy: "Code of Conduct", severity: "medium", date: "2026-06-05", status: "resolved" },
      { id: 4, employee: "Emma Wilson", policy: "Financial Compliance", severity: "low", date: "2026-06-01", status: "closed" },
    ],
    pendingItems: [
      { id: 1, type: "Policy Acknowledgment", description: "Data Protection Policy v3.2", dueDate: "2026-06-20", assignee: "All Employees" },
      { id: 2, type: "Audit Scheduled", description: "Q2 Financial Audit", dueDate: "2026-06-25", assignee: "Finance Team" },
      { id: 3, type: "Corrective Action", description: "Update firewall configurations", dueDate: "2026-06-18", assignee: "IT Security" },
      { id: 4, type: "Risk Assessment", description: "Annual security risk review", dueDate: "2026-07-01", assignee: "Risk Team" },
      { id: 5, type: "Regulatory Filing", description: "GDPR compliance report", dueDate: "2026-06-30", assignee: "Legal" },
    ],
  };
}
