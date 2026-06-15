export function getRegulations() {
  return [
    { id: 1, name: "GDPR", jurisdiction: "European Union", category: "data_privacy", effectiveDate: "2018-05-25", lastUpdated: "2025-01-15", status: "active", description: "General Data Protection Regulation governing data privacy in the EU." },
    { id: 2, name: "CCPA", jurisdiction: "California, USA", category: "data_privacy", effectiveDate: "2020-01-01", lastUpdated: "2025-06-01", status: "active", description: "California Consumer Privacy Act." },
    { id: 3, name: "SOX", jurisdiction: "United States", category: "financial", effectiveDate: "2002-07-30", lastUpdated: "2024-12-01", status: "active", description: "Sarbanes-Oxley Act for financial reporting and corporate governance." },
    { id: 4, name: "HIPAA", jurisdiction: "United States", category: "security", effectiveDate: "1996-08-21", lastUpdated: "2025-03-01", status: "active", description: "Health Insurance Portability and Accountability Act." },
    { id: 5, name: "PCI DSS v4.0", jurisdiction: "Global", category: "security", effectiveDate: "2024-03-31", lastUpdated: "2025-06-15", status: "active", description: "Payment Card Industry Data Security Standard." },
    { id: 6, name: "EU AI Act", jurisdiction: "European Union", category: "other", effectiveDate: "2026-08-01", lastUpdated: "2025-05-20", status: "pending", description: "EU regulation on artificial intelligence." },
    { id: 7, name: "FLSA", jurisdiction: "United States", category: "labor", effectiveDate: "1938-06-25", lastUpdated: "2025-02-01", status: "active", description: "Fair Labor Standards Act governing wages and hours." },
    { id: 8, name: "ISO 27001:2022", jurisdiction: "Global", category: "security", effectiveDate: "2022-10-25", lastUpdated: "2025-04-01", status: "active", description: "International standard for information security management." },
    { id: 9, name: "California Prop 24", jurisdiction: "California, USA", category: "data_privacy", effectiveDate: "2023-01-01", lastUpdated: "2025-01-01", status: "active", description: "California Privacy Rights Act (CPRA) amendments." },
    { id: 10, name: "AML Directive", jurisdiction: "European Union", category: "financial", effectiveDate: "2020-06-30", lastUpdated: "2025-03-15", status: "active", description: "EU Anti-Money Laundering Directive." },
  ];
}
