export function getProfile() {
  return {
    id: 1,
    name: "John Doe",
    email: "john.doe@zoikone.com",
    phone: "+1-555-1234",
    address: "123 Main Street, Apt 4B, New York, NY 10001",
    department: "Engineering",
    designation: "Senior Software Engineer",
    employeeId: "EMP-001",
    joinDate: "2022-03-15",
    manager: "Jane Smith",
    workEmail: "john.d@zoikone.com",
    workPhone: "+1-555-5678",
    dateOfBirth: "1990-07-22",
    bloodGroup: "O+",
    emergencyContacts: [
      { id: 1, name: "Mary Doe", relationship: "Spouse", phone: "+1-555-9876", email: "mary.doe@email.com" },
      { id: 2, name: "Robert Doe", relationship: "Father", phone: "+1-555-5432", email: "robert.doe@email.com" },
    ],
  };
}

export function getMyDocuments() {
  return [
    { id: 1, name: "Payslip - June 2026", type: "payslip", category: "Payslips", uploadDate: "2026-06-15", size: "245 KB", status: "available" },
    { id: 2, name: "Payslip - May 2026", type: "payslip", category: "Payslips", uploadDate: "2026-05-15", size: "238 KB", status: "available" },
    { id: 3, name: "Payslip - April 2026", type: "payslip", category: "Payslips", uploadDate: "2026-04-15", size: "241 KB", status: "available" },
    { id: 4, name: "Form W-2 2025", type: "tax_form", category: "Tax Forms", uploadDate: "2026-01-31", size: "512 KB", status: "available" },
    { id: 5, name: "Form 1099 2025", type: "tax_form", category: "Tax Forms", uploadDate: "2026-01-31", size: "198 KB", status: "available" },
    { id: 6, name: "Tax Statement 2025", type: "tax_form", category: "Tax Forms", uploadDate: "2026-02-15", size: "320 KB", status: "available" },
    { id: 7, name: "Completion Certificate - AWS Training", type: "certificate", category: "Certificates", uploadDate: "2026-04-10", size: "156 KB", status: "available" },
    { id: 8, name: "Employment Certificate", type: "certificate", category: "Certificates", uploadDate: "2025-06-01", size: "420 KB", status: "available" },
    { id: 9, name: "Offer Letter - ZoikoOne", type: "offer_letter", category: "Offer Letter", uploadDate: "2022-03-01", size: "1.2 MB", status: "available" },
    { id: 10, name: "Appointment Letter", type: "offer_letter", category: "Offer Letter", uploadDate: "2022-03-10", size: "890 KB", status: "available" },
    { id: 11, name: "Confidentiality Agreement", type: "other", category: "Other", uploadDate: "2022-03-01", size: "345 KB", status: "available" },
  ];
}

export const ESS_REQUEST_CATEGORIES = ["IT", "HR", "Facilities", "Admin"];

export function getEssRequests() {
  return [
    { id: 1, category: "IT", subject: "Laptop keyboard replacement", description: "My laptop keyboard has several non-functional keys (E, R, T, Y). Requesting a replacement.", priority: "high", status: "pending", createdOn: "2026-06-12", updatedOn: "2026-06-12" },
    { id: 2, category: "HR", subject: "Name change request", description: "Legally changed my last name due to marriage. Please update HR records.", priority: "medium", status: "pending", createdOn: "2026-06-10", updatedOn: "2026-06-10" },
    { id: 3, category: "Facilities", subject: "Desk relocation", description: "Requesting a move to the quiet zone on floor 4 for better focus.", priority: "low", status: "completed", createdOn: "2026-06-01", updatedOn: "2026-06-05" },
    { id: 4, category: "Admin", subject: "Office supplies request", description: "Need a new monitor stand, ergonomic mouse, and notebook set.", priority: "low", status: "approved", createdOn: "2026-05-28", updatedOn: "2026-05-30" },
    { id: 5, category: "IT", subject: "VPN access issue", description: "Unable to connect to corporate VPN from home. Error code: VPN-1024.", priority: "urgent", status: "pending", createdOn: "2026-06-14", updatedOn: "2026-06-14" },
    { id: 6, category: "HR", subject: "Training enrollment", description: "Requesting enrollment in the Advanced React Workshop scheduled for July.", priority: "medium", status: "approved", createdOn: "2026-05-20", updatedOn: "2026-05-22" },
    { id: 7, category: "Facilities", subject: "AC temperature adjustment", description: "The temperature in zone B is too cold. Please adjust to 72F.", priority: "medium", status: "completed", createdOn: "2026-05-15", updatedOn: "2026-05-16" },
    { id: 8, category: "Admin", subject: "Visitor parking pass", description: "Need a visitor parking pass for client meeting on June 20.", priority: "medium", status: "pending", createdOn: "2026-06-08", updatedOn: "2026-06-08" },
    { id: 9, category: "IT", subject: "Software installation request", description: "Need Figma and Adobe XD installed on my workstation.", priority: "low", status: "rejected", createdOn: "2026-04-20", updatedOn: "2026-04-22" },
    { id: 10, category: "HR", subject: "Health insurance claim", description: "Submitting documents for dental insurance reimbursement.", priority: "high", status: "pending", createdOn: "2026-06-13", updatedOn: "2026-06-13" },
    { id: 11, category: "Admin", subject: "Business card reorder", description: "Running out of business cards. Need to reorder 100 cards.", priority: "low", status: "completed", createdOn: "2026-03-10", updatedOn: "2026-03-12" },
    { id: 12, category: "Facilities", subject: "Security badge reissue", description: "Lost my security badge. Please issue a replacement.", priority: "high", status: "pending", createdOn: "2026-06-14", updatedOn: "2026-06-14" },
  ];
}
