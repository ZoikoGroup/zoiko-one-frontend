export function getAudits() {
  return [
    { id: 1, title: "Q2 2026 Internal Financial Audit", type: "internal", lead: "Sarah Chen", team: ["James Wilson", "Lisa Park", "Tom Bradley"], startDate: "2026-06-01", endDate: "2026-06-28", status: "active", progress: 65, scope: "Financial reporting controls for Q2 2026 including revenue recognition, accounts payable, and payroll processing." },
    { id: 2, title: "SOC 2 Type II Readiness Assessment", type: "external", lead: "Deloitte", team: ["John Masters", "Rachel Kim"], startDate: "2026-05-15", endDate: "2026-07-30", status: "active", progress: 40, scope: "Readiness assessment for SOC 2 Type II certification covering security, availability, and confidentiality trust services criteria." },
    { id: 3, title: "ISO 27001 Internal Surveillance Audit", type: "internal", lead: "Mike Johnson", team: ["Anna Petrova", "David Chen"], startDate: "2026-06-10", endDate: "2026-07-05", status: "active", progress: 30, scope: "Annual ISO 27001 internal audit covering clauses 4-10 and Annex A controls." },
    { id: 4, title: "PCI DSS Compliance Review", type: "regulatory", lead: "QSA Assessor", team: ["Security Team"], startDate: "2026-06-15", endDate: "2026-08-01", status: "active", progress: 25, scope: "PCI DSS 4.0 compliance assessment for cardholder data environment." },
    { id: 5, title: "Annual Vendor Security Assessment", type: "external", lead: "SecurityScorecard", team: ["Procurement Team"], startDate: "2026-06-05", endDate: "2026-07-15", status: "active", progress: 50, scope: "Security assessment of top 25 critical vendors including penetration testing and controls review." },
    { id: 6, title: "GDPR Compliance Audit", type: "regulatory", lead: "DPO", team: ["Legal Team", "IT Security"], startDate: "2026-06-20", endDate: "2026-08-15", status: "planning", progress: 10, scope: "Comprehensive GDPR compliance audit covering data mapping, consent management, DSAR processing, and cross-border transfers." },
    { id: 7, title: "IT General Controls Review", type: "internal", lead: "IT Audit Manager", team: ["Alex Rivera", "Jessica Tan"], startDate: "2026-07-01", endDate: "2026-07-31", status: "planning", progress: 5, scope: "Review of ITGC controls including access management, change management, and computer operations." },
    { id: 8, title: "Cloud Security Posture Assessment", type: "internal", lead: "Cloud Security Architect", team: ["CloudOps Team"], startDate: "2026-07-10", endDate: "2026-08-10", status: "planning", progress: 0, scope: "Assessment of cloud security posture across AWS, Azure, and GCP environments." },
    { id: 9, title: "Financial Statement Audit - FY2026", type: "external", lead: "PwC", team: ["Audit Partners"], startDate: "2026-01-15", endDate: "2026-03-30", status: "closed", progress: 100, scope: "Annual financial statement audit for fiscal year 2026." },
    { id: 10, title: "SOX 404 Internal Control Testing - Q1", type: "internal", lead: "Internal Audit Director", team: ["Audit Team"], startDate: "2026-02-01", endDate: "2026-03-15", status: "closed", progress: 100, scope: "Quarterly SOX 404 testing of internal controls over financial reporting." },
    { id: 11, title: "ISO 27001 Recertification Audit", type: "external", lead: "BSI", team: ["Quality Team"], startDate: "2026-03-01", endDate: "2026-03-30", status: "closed", progress: 100, scope: "Triennial ISO 27001 recertification audit covering all clauses and controls." },
    { id: 12, title: "Data Privacy Impact Assessment Review", type: "internal", lead: "Privacy Officer", team: ["DPO Office"], startDate: "2026-04-01", endDate: "2026-04-30", status: "closed", progress: 100, scope: "Review of all DPIAs conducted in FY2025 for completeness and regulatory compliance." },
    { id: 13, title: "Business Continuity Plan Audit", type: "internal", lead: "BCM Director", team: ["BCM Team"], startDate: "2026-04-15", endDate: "2026-05-15", status: "closed", progress: 100, scope: "Audit of business continuity and disaster recovery plans, tests, and maintenance activities." },
    { id: 14, title: "SOC 2 Type I Report - Bridge Period", type: "external", lead: "Deloitte", team: ["Compliance Team"], startDate: "2026-05-01", endDate: "2026-05-30", status: "closed", progress: 100, scope: "SOC 2 Type I bridge letter covering controls design during the period between Type II reports." },
    { id: 15, title: "Incident Response Tabletop Exercise", type: "internal", lead: "CISO", team: ["SOC Team", "Legal", "PR"], startDate: "2026-05-20", endDate: "2026-05-20", status: "closed", progress: 100, scope: "Tabletop exercise simulating ransomware attack to test incident response procedures and cross-functional coordination." },
    { id: 16, title: "HIPAA Privacy & Security Audit", type: "regulatory", lead: "HIPAA Officer", team: ["Privacy Team"], startDate: "2026-07-15", endDate: "2026-08-30", status: "planning", progress: 0, scope: "HIPAA compliance audit covering administrative, physical, and technical safeguards for ePHI." },
    { id: 17, title: "Application Security Penetration Test", type: "internal", lead: "AppSec Lead", team: ["Security Engineers"], startDate: "2026-06-01", endDate: "2026-07-01", status: "active", progress: 60, scope: "Penetration testing of customer-facing web applications, mobile apps, and API endpoints." },
    { id: 18, title: "Annual SOX 404 Testing - Q3", type: "internal", lead: "Internal Audit", team: ["Audit Team"], startDate: "2026-08-01", endDate: "2026-09-15", status: "planning", progress: 0, scope: "Quarterly SOX 404 testing of internal controls over financial reporting - Q3 cycle." },
    { id: 19, title: "Network Security Architecture Review", type: "internal", lead: "Network Security Architect", team: ["Network Team"], startDate: "2026-05-01", endDate: "2026-06-15", status: "review", progress: 90, scope: "Review of network security architecture including segmentation, firewall rules, IDS/IPS, and zero trust controls." },
    { id: 20, title: "Anti-Bribery & Corruption Compliance Audit", type: "external", lead: "EY Forensics", team: ["Legal Team"], startDate: "2026-06-15", endDate: "2026-07-30", status: "active", progress: 35, scope: "FCPA and UK Bribery Act compliance audit covering high-risk markets, third-party due diligence, and gift/entertainment records." },
  ];
}

export function getAuditFindings(auditId) {
  const findings = {
    1: [
      { id: 101, auditId: 1, title: "Revenue recognition documentation incomplete", severity: "high", status: "open", owner: "Finance Manager", dueDate: "2026-07-15", description: "Supporting documentation for revenue recognition under ASC 606 is insufficient for three major contracts." },
      { id: 102, auditId: 1, title: "Segregation of duties in accounts payable", severity: "medium", status: "open", owner: "AP Manager", dueDate: "2026-07-20", description: "Same individual can create vendor records and process payments in the AP system." },
      { id: 103, auditId: 1, title: "Payroll reconciliation not performed timely", severity: "low", status: "open", owner: "Payroll Manager", dueDate: "2026-07-10", description: "Monthly payroll reconciliations are completed 15 days after month-end instead of 5 days per policy." },
    ],
    2: [
      { id: 201, auditId: 2, title: "Incident response playbooks incomplete", severity: "high", status: "open", owner: "SOC Manager", dueDate: "2026-08-15", description: "SOC 2 readiness assessment identified gaps in incident response documentation for specific scenarios." },
      { id: 202, auditId: 2, title: "Vendor management program documentation", severity: "high", status: "open", owner: "Procurement Director", dueDate: "2026-08-01", description: "Vendor risk assessment program lacks formalized documentation for ongoing monitoring." },
      { id: 203, auditId: 2, title: "Capacity planning documentation", severity: "medium", status: "open", owner: "Infrastructure Director", dueDate: "2026-07-30", description: "Formal capacity planning process not consistently documented for all critical systems." },
    ],
    3: [
      { id: 301, auditId: 3, title: "Asset management inventory incomplete", severity: "medium", status: "open", owner: "IT Asset Manager", dueDate: "2026-07-20", description: "Internal audit found 15 unregistered assets connected to the network per ISO 27001 A.8.1.1." },
      { id: 302, auditId: 3, title: "Supplier security review overdue", severity: "high", status: "open", owner: "Procurement", dueDate: "2026-07-15", description: "Annual security reviews for 5 critical suppliers have not been completed per ISO 27001 A.15." },
    ],
    4: [
      { id: 401, auditId: 4, title: "Quarterly ASV scan results review", severity: "high", status: "open", owner: "Security Engineer", dueDate: "2026-08-15", description: "Last quarterly ASV scan identified 3 medium severity findings not yet remediated within SLA." },
      { id: 402, auditId: 4, title: "Cardholder data discovery scan", severity: "critical", status: "open", owner: "Security Engineer", dueDate: "2026-07-20", description: "Initial CDE scope discovery identified potential cardholder data in unexpected storage locations." },
    ],
    5: [
      { id: 501, auditId: 5, title: "Vendor A - SOC 2 report expired", severity: "critical", status: "open", owner: "Procurement Manager", dueDate: "2026-07-10", description: "Critical vendor's SOC 2 report expired 45 days ago. No updated report available." },
      { id: 502, auditId: 5, title: "Vendor B - Pen test report gaps", severity: "high", status: "open", owner: "Security Engineer", dueDate: "2026-07-30", description: "Vendor penetration test report does not cover critical API endpoints identified in data flow mapping." },
      { id: 503, auditId: 5, title: "Vendor C - No security questionnaire on file", severity: "medium", status: "open", owner: "Procurement Analyst", dueDate: "2026-07-15", description: "New vendor onboarded without completing required security assessment questionnaire." },
    ],
    9: [
      { id: 901, auditId: 9, title: "Revenue recognition timing difference", severity: "medium", status: "closed", owner: "Controller", dueDate: "2026-04-15", description: "PwC identified $2.3M in revenue recognized in wrong period due to contract terms interpretation." },
    ],
    10: [
      { id: 1001, auditId: 10, title: "User access recertification delay", severity: "medium", status: "closed", owner: "IAM Manager", dueDate: "2026-04-01", description: "Quarterly user access recertification completed 7 days past due date." },
    ],
    17: [
      { id: 1701, auditId: 17, title: "API authentication bypass vulnerability", severity: "critical", status: "open", owner: "Backend Lead", dueDate: "2026-07-05", description: "Internal API endpoint lacks proper authentication, allowing unauthorized data access." },
      { id: 1702, auditId: 17, title: "SQL injection in search endpoint", severity: "high", status: "open", owner: "Backend Developer", dueDate: "2026-07-10", description: "User search endpoint vulnerable to SQL injection via unsanitized input parameter." },
      { id: 1703, auditId: 17, title: "Insecure direct object reference", severity: "high", status: "open", owner: "Full Stack Developer", dueDate: "2026-07-10", description: "Document download endpoint allows IDOR attacks by manipulating document ID parameter." },
    ],
    19: [
      { id: 1901, auditId: 19, title: "Unrestricted east-west traffic", severity: "high", status: "open", owner: "Network Engineer", dueDate: "2026-07-01", description: "Limited network segmentation allows unrestricted lateral movement between application tiers." },
      { id: 1902, auditId: 19, title: "Legacy firewall rules not reviewed", severity: "medium", status: "open", owner: "Network Admin", dueDate: "2026-07-15", description: "Over 200 firewall rules have not been reviewed in the past 12 months." },
    ],
    20: [
      { id: 2001, auditId: 20, title: "Gift register not maintained", severity: "high", status: "open", owner: "Legal Counsel", dueDate: "2026-08-01", description: "Central gift and entertainment register not consistently maintained across all departments." },
      { id: 2002, auditId: 20, title: "Third-party due diligence gaps", severity: "high", status: "open", owner: "Compliance Officer", dueDate: "2026-08-15", description: "Enhanced due diligence not completed for high-risk market intermediaries." },
    ],
  };
  return findings[auditId] || [];
}

export function getAuditsSummary() {
  const audits = getAudits();
  return {
    total: audits.length,
    byStatus: {
      planning: audits.filter(a => a.status === "planning").length,
      active: audits.filter(a => a.status === "active").length,
      review: audits.filter(a => a.status === "review").length,
      closed: audits.filter(a => a.status === "closed").length,
    },
    byType: {
      internal: audits.filter(a => a.type === "internal").length,
      external: audits.filter(a => a.type === "external").length,
      regulatory: audits.filter(a => a.type === "regulatory").length,
    },
  };
}
