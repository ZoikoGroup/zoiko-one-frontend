export function getRiskAssessments() {
  return [
    { id: 1, title: "Data Breach Risk", category: "security", likelihood: 4, impact: 5, riskScore: 20, mitigation: "Implement encryption at rest and in transit, regular security audits", owner: "IT Security", status: "open" },
    { id: 2, title: "Regulatory Non-Compliance", category: "legal", likelihood: 3, impact: 4, riskScore: 12, mitigation: "Engage legal counsel, implement compliance monitoring", owner: "Legal Team", status: "open" },
    { id: 3, title: "Vendor Data Exposure", category: "data_privacy", likelihood: 3, impact: 4, riskScore: 12, mitigation: "Vendor risk assessments, contractual data protection clauses", owner: "Procurement", status: "mitigated" },
    { id: 4, title: "Insider Threat", category: "security", likelihood: 2, impact: 5, riskScore: 10, mitigation: "Access controls, monitoring, awareness training", owner: "IT Security", status: "open" },
    { id: 5, title: "Financial Misstatement", category: "financial", likelihood: 2, impact: 4, riskScore: 8, mitigation: "Automated controls, regular reconciliations, external audit", owner: "Finance", status: "mitigated" },
    { id: 6, title: "Operational Disruption", category: "operational", likelihood: 3, impact: 3, riskScore: 9, mitigation: "Business continuity planning, disaster recovery", owner: "Operations", status: "open" },
    { id: 7, title: "Reputational Damage", category: "reputational", likelihood: 2, impact: 5, riskScore: 10, mitigation: "Crisis communication plan, brand monitoring", owner: "Marketing", status: "closed" },
    { id: 8, title: "Health & Safety Incident", category: "operational", likelihood: 2, impact: 3, riskScore: 6, mitigation: "Safety training, regular inspections, reporting system", owner: "Facilities", status: "closed" },
  ];
}
