export function getReports() {
  return [
    { id: 1, type: "compliance_summary", title: "Enterprise Compliance Summary - Q2 2026", description: "Comprehensive compliance posture overview across all regulatory frameworks including GDPR, SOC 2, ISO 27001, PCI DSS, HIPAA, and SOX.", generatedDate: "2026-06-15", generatedBy: "Compliance Director", status: "completed", format: "pdf", framework: "Multi-Framework", pages: 45 },
    { id: 2, type: "risk_analysis", title: "Enterprise Risk Analysis Report - H1 2026", description: "Detailed risk analysis covering all identified risks, heat map, mitigation status, and residual risk assessment.", generatedDate: "2026-06-10", generatedBy: "CRO", status: "completed", format: "pdf", framework: "Enterprise Risk", pages: 62 },
    { id: 3, type: "audit_findings", title: "Audit Findings Summary - Q2 2026", description: "Consolidated audit findings from all active and completed audits in Q2 2026, including severity distribution and remediation tracking.", generatedDate: "2026-06-30", generatedBy: "Internal Audit Director", status: "pending", format: "excel", framework: "Multi-Audit", pages: 28 },
    { id: 4, type: "incident_trends", title: "Security Incident Trend Analysis - H1 2026", description: "Analysis of security incidents reported in H1 2026 including trends by severity, category, mean time to detect, and mean time to resolve.", generatedDate: "2026-06-20", generatedBy: "SOC Manager", status: "pending", format: "pdf", framework: "Incident Response", pages: 35 },
    { id: 5, type: "policy_compliance", title: "Policy Compliance & Acknowledgement Report", description: "Organization-wide policy compliance metrics including acknowledgement rates, coverage by department, and overdue acknowledgements.", generatedDate: "2026-06-12", generatedBy: "Compliance Analyst", status: "completed", format: "csv", framework: "Policy Management", pages: 18 },
    { id: 6, type: "executive_pack", title: "Executive Compliance Pack - Q2 2026", description: "Executive summary of compliance posture, key risks, audit status, and strategic recommendations for Board of Directors.", generatedDate: "2026-07-01", generatedBy: "CCO", status: "pending", format: "pdf", framework: "Executive", pages: 20 },
    { id: 7, type: "compliance_summary", title: "SOC 2 Compliance Status Report", description: "SOC 2 Type II readiness assessment status, control testing results, and remediation progress.", generatedDate: "2026-06-08", generatedBy: "Compliance Director", status: "completed", format: "pdf", framework: "SOC 2", pages: 38 },
    { id: 8, type: "risk_analysis", title: "Third-Party Risk Assessment Report", description: "Risk assessment results for all critical and high-risk vendors including scores, findings, and remediation plans.", generatedDate: "2026-06-05", generatedBy: "Risk Manager", status: "completed", format: "excel", framework: "Third-Party Risk", pages: 55 },
    { id: 9, type: "audit_findings", title: "ISO 27001 Internal Audit Report", description: "Findings from annual ISO 27001 internal audit including non-conformities, observations, and opportunities for improvement.", generatedDate: "2026-07-05", generatedBy: "Quality Manager", status: "pending", format: "pdf", framework: "ISO 27001", pages: 42 },
    { id: 10, type: "compliance_summary", title: "GDPR Compliance Assessment Report", description: "GDPR compliance maturity assessment covering data mapping, consent management, DSAR processing, breach response, and cross-border transfers.", generatedDate: "2026-06-18", generatedBy: "DPO", status: "completed", format: "pdf", framework: "GDPR", pages: 50 },
    { id: 11, type: "policy_compliance", title: "Policy Effectiveness Metrics Dashboard", description: "Metrics dashboard showing policy effectiveness, review completion rates, and policy lifecycle status.", generatedDate: "2026-06-14", generatedBy: "Policy Manager", status: "completed", format: "pdf", framework: "Policy Management", pages: 22 },
    { id: 12, type: "incident_trends", title: "Phishing Simulation Results Report", description: "Quarterly phishing simulation results including click rates, department comparisons, and improvement trends.", generatedDate: "2026-06-07", generatedBy: "Security Awareness Manager", status: "completed", format: "excel", framework: "Security Awareness", pages: 15 },
    { id: 13, type: "executive_pack", title: "Board Risk Committee Report - Q2 2026", description: "Quarterly risk report for Board Risk Committee covering top risks, KRI dashboard, and risk appetite compliance.", generatedDate: "2026-06-25", generatedBy: "CRO", status: "pending", format: "pdf", framework: "Executive", pages: 30 },
    { id: 14, type: "compliance_summary", title: "PCI DSS Compliance Status Report", description: "PCI DSS 4.0 compliance status including SAQ progress, ASV scan results, and CDE scope documentation.", generatedDate: "2026-06-22", generatedBy: "Compliance Analyst", status: "completed", format: "pdf", framework: "PCI DSS", pages: 33 },
    { id: 15, type: "risk_analysis", title: "IT Risk Assessment Report", description: "IT risk assessment covering infrastructure, applications, cloud, and security operations risk areas.", generatedDate: "2026-06-03", generatedBy: "IT Risk Manager", status: "completed", format: "pdf", framework: "IT Risk", pages: 48 },
    { id: 16, type: "audit_findings", title: "Financial Controls Audit Report - Q2", description: "Q2 2026 financial controls audit findings including revenue recognition, procurement, and payroll control testing results.", generatedDate: "2026-06-28", generatedBy: "Internal Audit", status: "pending", format: "pdf", framework: "SOX", pages: 36 },
    { id: 17, type: "incident_trends", title: "Cyber Threat Intelligence Report - June 2026", description: "Monthly threat intelligence report covering industry-specific threats, actor profiles, and recommended mitigations.", generatedDate: "2026-06-30", generatedBy: "Threat Intel Lead", status: "pending", format: "pdf", framework: "Threat Intelligence", pages: 25 },
    { id: 18, type: "executive_pack", title: "Annual Compliance Report - FY2026 (Preliminary)", description: "Preliminary annual compliance report covering all regulatory obligations, compliance initiatives, and forward-looking strategy.", generatedDate: "2026-07-15", generatedBy: "CCO", status: "pending", format: "pdf", framework: "Executive", pages: 60 },
    { id: 19, type: "compliance_summary", title: "HIPAA Compliance Assessment Report", description: "HIPAA privacy and security compliance assessment results including gap analysis, remediation plan, and milestone tracking.", generatedDate: "2026-06-25", generatedBy: "Privacy Officer", status: "pending", format: "pdf", framework: "HIPAA", pages: 44 },
    { id: 20, type: "policy_compliance", title: "Policy Acknowledgment Compliance Report", description: "Department-level policy acknowledgment compliance tracking with aging analysis and escalation recommendations.", generatedDate: "2026-06-11", generatedBy: "HR Director", status: "completed", format: "csv", framework: "Policy Management", pages: 12 },
  ];
}

export function getReportsSummary() {
  const reports = getReports();
  return {
    total: reports.length,
    byType: {
      compliance_summary: reports.filter(r => r.type === "compliance_summary").length,
      risk_analysis: reports.filter(r => r.type === "risk_analysis").length,
      audit_findings: reports.filter(r => r.type === "audit_findings").length,
      incident_trends: reports.filter(r => r.type === "incident_trends").length,
      policy_compliance: reports.filter(r => r.type === "policy_compliance").length,
      executive_pack: reports.filter(r => r.type === "executive_pack").length,
    },
    byStatus: {
      completed: reports.filter(r => r.status === "completed").length,
      pending: reports.filter(r => r.status === "pending").length,
    },
  };
}
