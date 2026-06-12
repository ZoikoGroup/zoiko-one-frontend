export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: "IT" | "HR" | "Payroll" | "Facilities" | "Other";
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeRequest {
  id: string;
  employeeName: string;
  employeeEmail: string;
  requestType: "Leave" | "Equipment" | "Training" | "Transfer" | "Resignation" | "Other";
  description: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  resolvedAt: string;
  notes: string;
}

export interface HelpdeskCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  relatedTicketId: string;
  relatedTicketTitle: string;
  status: "New" | "Investigating" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  assignedTo: string;
  createdAt: string;
  resolvedAt: string;
  resolution: string;
}

export interface SLA {
  id: string;
  name: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  targetResponse: number;
  targetResolution: number;
  breachCount: number;
  overallCompliance: number;
  status: "Active" | "Inactive";
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: "IT" | "HR" | "Payroll" | "Onboarding" | "Policy" | "Facilities";
  tags: string[];
  content: string;
  views: number;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  author: string;
}

const today = new Date();
const d = (offset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
};

export const initialTickets: Ticket[] = [
  {
    id: "tkt-1",
    ticketNumber: "HRT-001",
    title: "Laptop keyboard malfunction",
    description: "My Dell laptop keyboard keys 'E', 'R', and 'T' are unresponsive. Need a replacement keyboard or laptop.",
    category: "IT",
    priority: "High",
    status: "In Progress",
    assignedTo: "James Thompson",
    createdBy: "Alice Morrison",
    createdAt: d(-5),
    updatedAt: d(-2),
  },
  {
    id: "tkt-2",
    ticketNumber: "HRT-002",
    title: "Update emergency contact details",
    description: "I recently moved and need to update my emergency contact information in the system.",
    category: "HR",
    priority: "Low",
    status: "Resolved",
    assignedTo: "Sarah Chen",
    createdBy: "Robert Kim",
    createdAt: d(-10),
    updatedAt: d(-8),
  },
  {
    id: "tkt-3",
    ticketNumber: "HRT-003",
    title: "Payroll discrepancy in March",
    description: "My March paycheck is missing the overtime component. I worked 12 extra hours during the project sprint.",
    category: "Payroll",
    priority: "Critical",
    status: "Open",
    assignedTo: "Michael Torres",
    createdBy: "David Park",
    createdAt: d(-1),
    updatedAt: d(-1),
  },
  {
    id: "tkt-4",
    ticketNumber: "HRT-004",
    title: "Access badge not working",
    description: "My security badge stopped working for the parking garage entrance. It works for the main lobby but not the garage.",
    category: "Facilities",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "James Thompson",
    createdBy: "Emily Watson",
    createdAt: d(-3),
    updatedAt: d(-2),
  },
  {
    id: "tkt-5",
    ticketNumber: "HRT-005",
    title: "VPN access for remote work",
    description: "I need VPN credentials configured for my new laptop so I can work from home on Fridays.",
    category: "IT",
    priority: "Medium",
    status: "Open",
    assignedTo: "Unassigned",
    createdBy: "Nina Patel",
    createdAt: d(0),
    updatedAt: d(0),
  },
  {
    id: "tkt-6",
    ticketNumber: "HRT-006",
    title: "Benefits enrollment question",
    description: "I need clarification on the dental insurance options available for the new plan year starting July 1st.",
    category: "HR",
    priority: "Low",
    status: "Open",
    assignedTo: "Sarah Chen",
    createdBy: "Thomas Wright",
    createdAt: d(0),
    updatedAt: d(0),
  },
  {
    id: "tkt-7",
    ticketNumber: "HRT-007",
    title: "Monitor flickering issue",
    description: "My secondary monitor (LG 27-inch) is flickering intermittently. It started this morning after the power outage.",
    category: "IT",
    priority: "High",
    status: "In Progress",
    assignedTo: "James Thompson",
    createdBy: "Rachel Green",
    createdAt: d(-2),
    updatedAt: d(-1),
  },
  {
    id: "tkt-8",
    ticketNumber: "HRT-008",
    title: "Wrong tax deduction code",
    description: "My payslip shows tax code 1257L but I believe it should be 1257L M1 due to my mid-month start date.",
    category: "Payroll",
    priority: "High",
    status: "Resolved",
    assignedTo: "Michael Torres",
    createdBy: "Chris Evans",
    createdAt: d(-12),
    updatedAt: d(-9),
  },
];

export const initialEmployeeRequests: EmployeeRequest[] = [
  {
    id: "req-1",
    employeeName: "Olivia Hart",
    employeeEmail: "olivia.hart@zoiko.com",
    requestType: "Leave",
    description: "Requesting annual leave from June 20 to June 27 for a family wedding.",
    status: "Pending",
    createdAt: d(-2),
    resolvedAt: "",
    notes: "",
  },
  {
    id: "req-2",
    employeeName: "Liam Scott",
    employeeEmail: "liam.scott@zoiko.com",
    requestType: "Equipment",
    description: "Requesting a standing desk conversion kit for better ergonomics in my home office setup.",
    status: "Approved",
    createdAt: d(-8),
    resolvedAt: d(-6),
    notes: "Standing desk kit ordered and will be delivered by June 15th.",
  },
  {
    id: "req-3",
    employeeName: "Zara Ahmed",
    employeeEmail: "zara.ahmed@zoiko.com",
    requestType: "Training",
    description: "Would like to enroll in the AWS Solutions Architect certification course this quarter.",
    status: "Approved",
    createdAt: d(-15),
    resolvedAt: d(-12),
    notes: "Approved under L&D budget. Course registration confirmed.",
  },
  {
    id: "req-4",
    employeeName: "Noah Bennett",
    employeeEmail: "noah.bennett@zoiko.com",
    requestType: "Transfer",
    description: "Requesting inter-department transfer from Sales to Product Marketing team effective next month.",
    status: "Pending",
    createdAt: d(-3),
    resolvedAt: "",
    notes: "",
  },
  {
    id: "req-5",
    employeeName: "Emma Lopez",
    employeeEmail: "emma.lopez@zoiko.com",
    requestType: "Resignation",
    description: "Submitting my formal resignation. Last working day proposed as June 30th.",
    status: "Rejected",
    createdAt: d(-20),
    resolvedAt: d(-18),
    notes: "Counter-offer proposed and accepted. Emma will remain in her role with revised compensation.",
  },
  {
    id: "req-6",
    employeeName: "Jack Turner",
    employeeEmail: "jack.turner@zoiko.com",
    requestType: "Equipment",
    description: "Need a second monitor and a wireless keyboard/mouse combo for the new office desk.",
    status: "Pending",
    createdAt: d(-1),
    resolvedAt: "",
    notes: "",
  },
  {
    id: "req-7",
    employeeName: "Sophie Martin",
    employeeEmail: "sophie.martin@zoiko.com",
    requestType: "Training",
    description: "Interested in attending the Figma Config 2026 conference in San Francisco.",
    status: "Approved",
    createdAt: d(-25),
    resolvedAt: d(-22),
    notes: "Conference registration and travel approved. Budget code: L&D-2026-042.",
  },
  {
    id: "req-8",
    employeeName: "Ethan Clark",
    employeeEmail: "ethan.clark@zoiko.com",
    requestType: "Other",
    description: "Requesting a corporate parking spot near the building entrance due to a recent leg injury.",
    status: "Pending",
    createdAt: d(0),
    resolvedAt: "",
    notes: "",
  },
];

export const initialCases: HelpdeskCase[] = [
  {
    id: "case-1",
    caseNumber: "CASE-001",
    title: "Investigate payroll discrepancy batch",
    description: "Multiple employees from the Engineering team reported incorrect overtime calculations in the March payroll run.",
    relatedTicketId: "tkt-3",
    relatedTicketTitle: "Payroll discrepancy in March",
    status: "Investigating",
    priority: "Critical",
    assignedTo: "Michael Torres",
    createdAt: d(-1),
    resolvedAt: "",
    resolution: "",
  },
  {
    id: "case-2",
    caseNumber: "CASE-002",
    title: "Office access system upgrade",
    description: "The badge reader system needs a firmware upgrade. Several tickets raised about access failures in the west wing.",
    relatedTicketId: "tkt-4",
    relatedTicketTitle: "Access badge not working",
    status: "New",
    priority: "Medium",
    assignedTo: "James Thompson",
    createdAt: d(0),
    resolvedAt: "",
    resolution: "",
  },
  {
    id: "case-3",
    caseNumber: "CASE-003",
    title: "Laptop refresh cycle for Q3",
    description: "Coordinating the replacement of 25 laptops that are due for refresh this quarter. Consolidating tickets for bulk replacement.",
    relatedTicketId: "tkt-1",
    relatedTicketTitle: "Laptop keyboard malfunction",
    status: "New",
    priority: "High",
    assignedTo: "James Thompson",
    createdAt: d(0),
    resolvedAt: "",
    resolution: "",
  },
  {
    id: "case-4",
    caseNumber: "CASE-004",
    title: "Benefits documentation audit",
    description: "Annual review of benefits enrollment documentation to ensure compliance with new regulatory requirements.",
    relatedTicketId: "tkt-6",
    relatedTicketTitle: "Benefits enrollment question",
    status: "Resolved",
    priority: "Medium",
    assignedTo: "Sarah Chen",
    createdAt: d(-14),
    resolvedAt: d(-2),
    resolution: "All benefits documents reviewed and updated. New summaries posted to the employee portal.",
  },
  {
    id: "case-5",
    caseNumber: "CASE-005",
    title: "Remote work policy implementation",
    description: "Creating a structured framework for remote work requests including VPN provisioning, equipment setup, and compliance checks.",
    relatedTicketId: "tkt-5",
    relatedTicketTitle: "VPN access for remote work",
    status: "Closed",
    priority: "High",
    assignedTo: "Sarah Chen",
    createdAt: d(-30),
    resolvedAt: d(-5),
    resolution: "Remote work policy published. VPN provisioning automated via IT service catalog.",
  },
  {
    id: "case-6",
    caseNumber: "CASE-006",
    title: "Monitor replacement program",
    description: "Addressing multiple monitor-related tickets with a standardized replacement process for faulty displays.",
    relatedTicketId: "tkt-7",
    relatedTicketTitle: "Monitor flickering issue",
    status: "Investigating",
    priority: "High",
    assignedTo: "James Thompson",
    createdAt: d(-1),
    resolvedAt: "",
    resolution: "",
  },
];

export const initialSLAs: SLA[] = [
  {
    id: "sla-1",
    name: "Critical Incident Response",
    description: "Immediate response required for critical system outages or payroll-impacting issues.",
    priority: "Critical",
    targetResponse: 1,
    targetResolution: 4,
    breachCount: 2,
    overallCompliance: 96.7,
    status: "Active",
  },
  {
    id: "sla-2",
    name: "High Priority Resolution",
    description: "High priority hardware and software issues requiring prompt attention.",
    priority: "High",
    targetResponse: 4,
    targetResolution: 24,
    breachCount: 5,
    overallCompliance: 91.2,
    status: "Active",
  },
  {
    id: "sla-3",
    name: "Standard Support",
    description: "Medium priority tickets including general IT support and HR inquiries.",
    priority: "Medium",
    targetResponse: 8,
    targetResolution: 48,
    breachCount: 8,
    overallCompliance: 88.5,
    status: "Active",
  },
  {
    id: "sla-4",
    name: "Low Priority Queue",
    description: "Non-urgent requests such as information updates and documentation changes.",
    priority: "Low",
    targetResponse: 24,
    targetResolution: 72,
    breachCount: 12,
    overallCompliance: 82.3,
    status: "Active",
  },
  {
    id: "sla-5",
    name: "Legacy SLA Tier",
    description: "Deprecated SLA model for grandfathered support contracts.",
    priority: "Low",
    targetResponse: 48,
    targetResolution: 120,
    breachCount: 3,
    overallCompliance: 94.1,
    status: "Inactive",
  },
  {
    id: "sla-6",
    name: "Executive Support",
    description: "Premium support for C-suite and executive leadership with expedited handling.",
    priority: "Critical",
    targetResponse: 0.5,
    targetResolution: 2,
    breachCount: 0,
    overallCompliance: 100,
    status: "Active",
  },
];

export const initialKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: "kb-1",
    title: "How to Reset Your Password",
    category: "IT",
    tags: ["password", "login", "account", "security"],
    content: "To reset your Zoiko One password:\n\n1. Go to the login page and click 'Forgot Password'\n2. Enter your registered email address\n3. Check your inbox for a password reset link (valid for 30 minutes)\n4. Click the link and enter your new password\n5. Confirm the new password and submit\n\nIf you don't receive the email within 5 minutes, check your spam folder or contact IT support.",
    views: 1247,
    helpfulCount: 112,
    createdAt: d(-180),
    updatedAt: d(-30),
    author: "IT Team",
  },
  {
    id: "kb-2",
    title: "Annual Leave Policy & Entitlement",
    category: "HR",
    tags: ["leave", "vacation", "holiday", "policy", "PTO"],
    content: "Employees are entitled to 25 working days of annual leave per calendar year, plus public holidays.\n\nKey points:\n- Leave must be requested at least 2 weeks in advance via the HR portal\n- Maximum 10 consecutive days can be taken at one time\n- Unused leave can be carried forward (max 5 days) until March 31st\n- Sick leave during vacation requires a doctor's note for days 2+\n\nFor the current year's leave calendar, check the Leave Balances page.",
    views: 892,
    helpfulCount: 76,
    createdAt: d(-150),
    updatedAt: d(-45),
    author: "HR Team",
  },
  {
    id: "kb-3",
    title: "Setting Up VPN Access",
    category: "IT",
    tags: ["VPN", "remote", "work from home", "security"],
    content: "To set up VPN access for remote work:\n\n1. Submit an IT ticket requesting VPN access\n2. Install the Cisco AnyConnect client from the software portal\n3. Use the VPN server address: vpn.zoiko.com\n4. Log in with your Zoiko credentials\n5. Complete the two-factor authentication via the authenticator app\n\nVPN sessions time out after 8 hours for security purposes. Reconnect if disconnected.",
    views: 654,
    helpfulCount: 89,
    createdAt: d(-120),
    updatedAt: d(-20),
    author: "IT Team",
  },
  {
    id: "kb-4",
    title: "Expense Reimbursement Process",
    category: "Payroll",
    tags: ["expenses", "reimbursement", "travel", "claims"],
    content: "Follow these steps to claim expense reimbursement:\n\n1. Collect all original receipts (digital scans accepted)\n2. Log in to the Expense Portal\n3. Create a new expense report and categorize each item\n4. Attach receipts to each line item\n5. Submit for manager approval\n6. Finance team processes approved claims within 14 working days\n\nMileage is reimbursed at £0.45 per mile. International travel requires pre-approval.",
    views: 445,
    helpfulCount: 38,
    createdAt: d(-100),
    updatedAt: d(-15),
    author: "Finance Team",
  },
  {
    id: "kb-5",
    title: "New Employee Onboarding Checklist",
    category: "Onboarding",
    tags: ["onboarding", "new hire", "orientation", "welcome"],
    content: "Welcome to Zoiko! Here's your first-week checklist:\n\nDay 1:\n- Collect laptop and accessories from IT\n- Complete HR induction with your People Partner\n- Set up your workstation and log in\n- Review the Employee Handbook\n\nDay 2-3:\n- Complete mandatory compliance training (2 hours)\n- Meet your team and department head\n- Set up 1:1 recurring meetings with your manager\n\nDay 4-5:\n- Complete IT security awareness training\n- Review department-specific processes\n- Submit any required documents to HR\n\nYour onboarding buddy will be assigned on Day 1.",
    views: 378,
    helpfulCount: 52,
    createdAt: d(-200),
    updatedAt: d(-60),
    author: "HR Team",
  },
  {
    id: "kb-6",
    title: "Understanding Your Payslip",
    category: "Payroll",
    tags: ["payslip", "salary", "tax", "deductions", "net pay"],
    content: "Your monthly payslip contains the following sections:\n\nGROSS PAY: Your base salary plus any overtime, bonuses, or commissions\n\nDEDUCTIONS:\n- Income Tax (PAYE): Calculated based on your tax code\n- National Insurance: Class 1 contributions\n- Pension: 5% employee contribution (matched by employer at 8%)\n- Student Loan Plan 2: If applicable\n\nNET PAY: Gross pay minus all deductions = take-home amount\n\nPayslips are available on the 25th of each month via the employee portal.",
    views: 567,
    helpfulCount: 63,
    createdAt: d(-90),
    updatedAt: d(-10),
    author: "Payroll Team",
  },
  {
    id: "kb-7",
    title: "Code of Conduct Policy",
    category: "Policy",
    tags: ["conduct", "ethics", "compliance", "behavior"],
    content: "All employees must adhere to the Zoiko Code of Conduct:\n\n- Treat all colleagues with respect and dignity\n- Maintain confidentiality of company and client data\n- Avoid conflicts of interest\n- Use company resources responsibly\n- Report any policy violations to your manager or HR\n\nViolations may result in disciplinary action up to and including termination.\n\nFor the full policy document, visit the Compliance Center.",
    views: 234,
    helpfulCount: 29,
    createdAt: d(-250),
    updatedAt: d(-90),
    author: "Legal Team",
  },
  {
    id: "kb-8",
    title: "How to Book a Meeting Room",
    category: "Facilities",
    tags: ["meeting", "room", "booking", "calendar", "conference"],
    content: "To book a meeting room:\n\n1. Open your Outlook Calendar\n2. Click 'New Meeting' or 'New Event'\n3. Click 'Add Location' and select 'Room Finder'\n4. Filter by building, floor, capacity, and equipment\n5. Choose an available room and add it to your event\n6. Send the invitation\n\nRooms can be booked up to 30 days in advance. Maximum booking duration is 4 hours.\n\nTip: If you need a room for a full day, book two consecutive 4-hour slots.",
    views: 712,
    helpfulCount: 84,
    createdAt: d(-160),
    updatedAt: d(-40),
    author: "Facilities Team",
  },
];
