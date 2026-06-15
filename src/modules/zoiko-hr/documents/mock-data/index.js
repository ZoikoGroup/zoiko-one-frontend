export const dashboardStats = {
  totalDocuments: 284,
  pendingApprovals: 12,
  expiringSoon: 8,
  expired: 3,
  templates: 24,
  complianceDocs: 45,
};

export const employeeDocuments = [
  { id: 1, name: "Employment Contract", employee: "Alice J.", type: "Contract", status: "approved", uploadedDate: "2025-01-15", size: "245 KB" },
  { id: 2, name: "NDA Agreement", employee: "Bob S.", type: "Legal", status: "approved", uploadedDate: "2025-02-01", size: "180 KB" },
  { id: 3, name: "Performance Review Q1", employee: "Carol D.", type: "Review", status: "draft", uploadedDate: "2025-03-10", size: "320 KB" },
  { id: 4, name: "Training Certificate", employee: "David W.", type: "Certification", status: "approved", uploadedDate: "2024-11-20", size: "1.2 MB" },
  { id: 5, name: "Travel Reimbursement", employee: "Eve M.", type: "Finance", status: "pending_approval", uploadedDate: "2025-03-05", size: "450 KB" },
  { id: 6, name: "Insurance Claim", employee: "Frank L.", type: "Benefits", status: "approved", uploadedDate: "2025-02-15", size: "780 KB" },
  { id: 7, name: "Resignation Letter", employee: "Grace C.", type: "HR", status: "pending_approval", uploadedDate: "2025-03-12", size: "120 KB" },
  { id: 8, name: "Promotion Letter", employee: "Henry B.", type: "HR", status: "approved", uploadedDate: "2025-02-28", size: "200 KB" },
];

export const companyDocuments = [
  { id: 1, name: "Employee Handbook 2025", type: "Policy", status: "approved", updatedDate: "2025-01-01", version: "v3.2", size: "2.4 MB" },
  { id: 2, name: "Code of Conduct", type: "Policy", status: "approved", updatedDate: "2024-12-15", version: "v2.1", size: "1.1 MB" },
  { id: 3, name: "IT Security Policy", type: "Policy", status: "approved", updatedDate: "2025-02-01", version: "v4.0", size: "890 KB" },
  { id: 4, name: "Remote Work Policy", type: "Policy", status: "draft", updatedDate: "2025-03-01", version: "v1.0", size: "650 KB" },
  { id: 5, name: "Company Overview Deck", type: "Presentation", status: "approved", updatedDate: "2025-01-20", version: "v5.0", size: "5.2 MB" },
  { id: 6, name: "Onboarding Guide", type: "Manual", status: "approved", updatedDate: "2025-02-10", version: "v2.3", size: "3.5 MB" },
  { id: 7, name: "Brand Guidelines", type: "Design", status: "approved", updatedDate: "2024-11-01", version: "v1.5", size: "8.1 MB" },
  { id: 8, name: "Benefits Summary 2025", type: "HR", status: "approved", updatedDate: "2025-01-05", version: "v1.0", size: "1.8 MB" },
];

export const templates = [
  { id: 1, name: "Employment Contract", category: "Legal", usage: 45, lastUsed: "2025-03-10" },
  { id: 2, name: "Performance Review", category: "HR", usage: 32, lastUsed: "2025-03-08" },
  { id: 3, name: "Offer Letter", category: "HR", usage: 28, lastUsed: "2025-03-05" },
  { id: 4, name: "NDA Agreement", category: "Legal", usage: 22, lastUsed: "2025-03-01" },
  { id: 5, name: "Invoice Template", category: "Finance", usage: 18, lastUsed: "2025-02-28" },
  { id: 6, name: "Meeting Minutes", category: "General", usage: 15, lastUsed: "2025-02-25" },
];

export const approvals = [
  { id: 1, document: "Travel Reimbursement", requester: "Eve M.", type: "Expense", status: "pending", requestedDate: "2025-03-05", approver: "Jane D." },
  { id: 2, document: "Resignation Letter", requester: "Grace C.", type: "HR", status: "pending", requestedDate: "2025-03-12", approver: "Sarah M." },
  { id: 3, document: "Remote Work Policy", requester: "Tom K.", type: "Policy", status: "pending", requestedDate: "2025-03-01", approver: "Mike R." },
  { id: 4, document: "Training Budget", requester: "Alice J.", type: "Finance", status: "approved", requestedDate: "2025-02-28", approver: "Carol D." },
  { id: 5, document: "Equipment Purchase", requester: "Bob S.", type: "Procurement", status: "rejected", requestedDate: "2025-02-20", approver: "Lisa P." },
  { id: 6, document: "Time Off Request", requester: "Frank L.", type: "HR", status: "approved", requestedDate: "2025-03-10", approver: "Mike R." },
];

export const expiryTracking = [
  { id: 1, document: "Employment Contract - Alice J.", type: "Contract", expiryDate: "2025-06-15", status: "valid", owner: "Alice J." },
  { id: 2, document: "NDA - Bob S.", type: "Legal", expiryDate: "2025-04-01", status: "expiring_soon", owner: "Bob S." },
  { id: 3, document: "Training Cert - David W.", type: "Certification", expiryDate: "2025-03-20", status: "expiring_soon", owner: "David W." },
  { id: 4, document: "Insurance Policy", type: "Insurance", expiryDate: "2025-08-01", status: "valid", owner: "Company" },
  { id: 5, document: "Vendor Contract - XYZ Corp", type: "Contract", expiryDate: "2025-03-15", status: "expired", owner: "Sarah M." },
  { id: 6, document: "Compliance Certificate", type: "Compliance", expiryDate: "2025-05-01", status: "valid", owner: "Compliance Team" },
];

export const complianceDocuments = [
  { id: 1, name: "SOC 2 Report", regulation: "SOC 2", status: "approved", expiryDate: "2025-12-31", owner: "Security Team" },
  { id: 2, name: "ISO 27001 Certificate", regulation: "ISO 27001", status: "approved", expiryDate: "2025-09-15", owner: "Compliance Team" },
  { id: 3, name: "GDPR Compliance Statement", regulation: "GDPR", status: "approved", expiryDate: "2025-06-30", owner: "Legal Team" },
  { id: 4, name: "HIPAA Compliance Report", regulation: "HIPAA", status: "draft", expiryDate: null, owner: "Security Team" },
  { id: 5, name: "Data Processing Agreement", regulation: "GDPR", status: "approved", expiryDate: "2025-08-01", owner: "Legal Team" },
  { id: 6, name: "Business Continuity Plan", regulation: "ISO 22301", status: "pending_approval", expiryDate: null, owner: "Operations Team" },
];

export const documentsAnalytics = [
  { metric: "Total Documents", value: 284, change: 12, trend: "up" },
  { metric: "Pending Approvals", value: 12, change: -3, trend: "down" },
  { metric: "Expiring This Month", value: 8, change: 2, trend: "up" },
  { metric: "Compliance Rate", value: "94%", change: 2, trend: "up" },
  { metric: "Avg Approval Time", value: "2.4 days", change: -0.5, trend: "up" },
  { metric: "Storage Used", value: "4.2 GB", change: 0.3, trend: "up" },
];
