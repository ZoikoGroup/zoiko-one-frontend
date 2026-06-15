export function getAudits() {
  return [
    { id: 1, title: "Q1 Financial Audit", scope: "Financial records and reporting", auditor: "Deloitte", scheduledDate: "2026-03-15", completedDate: "2026-03-30", findings: 3, status: "completed", score: 87 },
    { id: 2, title: "IT Security Audit", scope: "Network infrastructure and access controls", auditor: "Internal Audit", scheduledDate: "2026-04-10", completedDate: "2026-04-25", findings: 5, status: "completed", score: 72 },
    { id: 3, title: "Data Privacy Compliance", scope: "GDPR and CCPA compliance review", auditor: "External Consultant", scheduledDate: "2026-05-01", completedDate: null, findings: 0, status: "in_progress", score: 0 },
    { id: 4, title: "Q2 Financial Audit", scope: "Quarterly financial statements", auditor: "Deloitte", scheduledDate: "2026-06-15", completedDate: null, findings: 0, status: "planned", score: 0 },
    { id: 5, title: "HR Compliance Audit", scope: "Employment practices and policies", auditor: "Internal Audit", scheduledDate: "2026-07-01", completedDate: null, findings: 0, status: "planned", score: 0 },
    { id: 6, title: "Vendor Security Assessment", scope: "Third-party vendor security review", auditor: "IT Security", scheduledDate: "2026-02-01", completedDate: "2026-02-20", findings: 7, status: "completed", score: 65 },
    { id: 7, title: "Operational Audit", scope: "Business process efficiency", auditor: "Internal Audit", scheduledDate: "2026-05-20", completedDate: null, findings: 2, status: "in_progress", score: 0 },
    { id: 8, title: "Environmental Compliance", scope: "Waste management and emissions", auditor: "External Agency", scheduledDate: "2026-08-01", completedDate: null, findings: 0, status: "planned", score: 0 },
  ];
}
