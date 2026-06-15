export function getCorrectiveActions() {
  return [
    { id: 1, title: "Update Firewall Configurations", violation: "IT Security Audit Finding #3", assignedTo: "IT Security Team", deadline: "2026-06-30", priority: "high", status: "in_progress", description: "Reconfigure firewall rules to block unauthorized outbound traffic.", resolution: null },
    { id: 2, title: "Data Classification Training", violation: "Data Breach Incident", assignedTo: "All Staff", deadline: "2026-07-15", priority: "critical", status: "open", description: "Mandatory training on data classification and handling procedures.", resolution: null },
    { id: 3, title: "Update Vendor Contracts", violation: "Vendor Risk Assessment Findings", assignedTo: "Legal Team", deadline: "2026-06-20", priority: "medium", status: "in_progress", description: "Add data protection clauses to all vendor contracts.", resolution: null },
    { id: 4, title: "Implement Access Review Process", violation: "Q1 Financial Audit", assignedTo: "IT Security", deadline: "2026-05-30", priority: "high", status: "completed", description: "Monthly access review process for critical systems.", resolution: "Process implemented, first review completed" },
    { id: 5, title: "Update Code of Conduct", violation: "Legal Compliance Review", assignedTo: "HR", deadline: "2026-08-01", priority: "low", status: "open", description: "Revise Code of Conduct to reflect new regulatory requirements.", resolution: null },
    { id: 6, title: "Patch Management Policy", violation: "IT Security Audit Finding #5", assignedTo: "IT Security Team", deadline: "2026-06-15", priority: "high", status: "completed", description: "Create formal patch management policy and procedures.", resolution: "Policy approved and published" },
    { id: 7, title: "GDPR Compliance Gap Analysis", violation: "Data Privacy Audit", assignedTo: "Legal Team", deadline: "2026-07-30", priority: "medium", status: "open", description: "Conduct comprehensive gap analysis against GDPR requirements.", resolution: null },
    { id: 8, title: "Update Incident Response Plan", violation: "Security Incident", assignedTo: "IT Security", deadline: "2026-06-25", priority: "critical", status: "in_progress", description: "Revise incident response plan based on lessons learned.", resolution: null },
  ];
}
