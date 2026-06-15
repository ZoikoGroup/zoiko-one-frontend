import { api } from "./api";

const mockData = {
  overview: { message: "Zoiko HR overview (mock)" },
  departments: [
    { id: 1, name: "Engineering" },
    { id: 2, name: "Sales" },
    { id: 3, name: "HR" },
  ],
  attendance: [
    {
      id: 1,
      user: "Alice Johnson",
      date: "2026-06-11",
      checkInTime: "09:00:15 AM",
      checkOutTime: "05:45:30 PM",
      totalHours: "8.76",
      status: "Present",
    },
    {
      id: 2,
      user: "Alice Johnson",
      date: "2026-06-10",
      checkInTime: "09:15:45 AM",
      checkOutTime: "06:00:00 PM",
      totalHours: "8.74",
      status: "Late",
    },
    {
      id: 3,
      user: "Alice Johnson",
      date: "2026-06-09",
      checkInTime: "08:58:20 AM",
      checkOutTime: "05:30:45 PM",
      totalHours: "8.54",
      status: "Present",
    },
    {
      id: 4,
      user: "Alice Johnson",
      date: "2026-06-08",
      checkInTime: "09:30:00 AM",
      checkOutTime: "05:50:15 PM",
      totalHours: "8.34",
      status: "Late",
    },
    {
      id: 5,
      user: "Alice Johnson",
      date: "2026-06-07",
      checkInTime: "09:05:10 AM",
      checkOutTime: "05:45:00 PM",
      totalHours: "8.67",
      status: "Present",
    },
    {
      id: 6,
      user: "Alice Johnson",
      date: "2026-06-06",
      checkInTime: null,
      checkOutTime: null,
      totalHours: null,
      status: "Absent",
    },
    {
      id: 7,
      user: "Alice Johnson",
      date: "2026-06-05",
      checkInTime: "09:00:00 AM",
      checkOutTime: "05:45:30 PM",
      totalHours: "8.76",
      status: "Present",
    },
    {
      id: 8,
      user: "Alice Johnson",
      date: "2026-06-04",
      checkInTime: "08:59:45 AM",
      checkOutTime: "05:30:20 PM",
      totalHours: "8.51",
      status: "Present",
    },
    {
      id: 9,
      user: "Alice Johnson",
      date: "2026-06-03",
      checkInTime: "09:22:00 AM",
      checkOutTime: "06:15:30 PM",
      totalHours: "8.89",
      status: "Late",
    },
    {
      id: 10,
      user: "Alice Johnson",
      date: "2026-06-02",
      checkInTime: "09:00:30 AM",
      checkOutTime: "05:45:15 PM",
      totalHours: "8.75",
      status: "Present",
    },
    {
      id: 11,
      user: "Alice Johnson",
      date: "2026-06-01",
      checkInTime: "09:10:20 AM",
      checkOutTime: "05:50:45 PM",
      totalHours: "8.67",
      status: "Present",
    },
  ],
  leave: [
    { id: 1, user: "Charlie", type: "Annual", days: 5 },
  ],
  assets: [
    {
      id: 1,
      assetTag: "AST-001",
      itemName: "MacBook Pro 16\" 2024",
      category: "Hardware",
      serialNumber: "C02YQ0ZRWL",
      assignedTo: "Alice Johnson",
      dateAssigned: "2024-03-15",
      condition: "Excellent",
    },
    {
      id: 2,
      assetTag: "AST-002",
      itemName: "Dell XPS 13",
      category: "Hardware",
      serialNumber: "DWFWF4KQ4",
      assignedTo: "Bob Smith",
      dateAssigned: "2024-01-20",
      condition: "Excellent",
    },
    {
      id: 3,
      assetTag: "AST-003",
      itemName: "Microsoft Office 365",
      category: "Software",
      serialNumber: "MSO-365-2024",
      assignedTo: "Charlie Brown",
      dateAssigned: "2024-06-01",
      condition: "Excellent",
    },
    {
      id: 4,
      assetTag: "AST-004",
      itemName: "Dell Monitor 27\"",
      category: "Peripherals",
      serialNumber: "FD4BF7K9L",
      assignedTo: "Diana Prince",
      dateAssigned: "2023-11-10",
      condition: "Excellent",
    },
    {
      id: 5,
      assetTag: "AST-005",
      itemName: "Logitech MX Master 3",
      category: "Peripherals",
      serialNumber: "LOGO-MXM3-567",
      assignedTo: "Eve Davis",
      dateAssigned: "2024-02-14",
      condition: "Damaged",
    },
    {
      id: 6,
      assetTag: "AST-006",
      itemName: "iPhone 15 Pro",
      category: "Mobile",
      serialNumber: "DNPL9QYMQ4J9",
      assignedTo: "Frank Wilson",
      dateAssigned: "2024-05-22",
      condition: "Excellent",
    },
    {
      id: 7,
      assetTag: "AST-007",
      itemName: "Adobe Creative Cloud",
      category: "Software",
      serialNumber: "ACC-CC-2024",
      assignedTo: "Grace Lee",
      dateAssigned: "2024-04-10",
      condition: "Excellent",
    },
    {
      id: 8,
      assetTag: "AST-008",
      itemName: "iPad Pro 12.9\"",
      category: "Mobile",
      serialNumber: "IPAD-12-9-24",
      assignedTo: "Henry Martinez",
      dateAssigned: "2023-09-05",
      condition: "Excellent",
    },
    {
      id: 9,
      assetTag: "AST-009",
      itemName: "Slack Pro License",
      category: "Software",
      serialNumber: "SLACK-PRO-2024",
      assignedTo: "Ivy Thompson",
      dateAssigned: "2024-01-15",
      condition: "Excellent",
    },
    {
      id: 10,
      assetTag: "AST-010",
      itemName: "Mechanical Keyboard RGB",
      category: "Peripherals",
      serialNumber: "MECH-KB-4521",
      assignedTo: "Jack Anderson",
      dateAssigned: "2024-03-01",
      condition: "Damaged",
    },
  ],
  workforce: [
    { id: 1, name: "Alice", role: "Engineer" },
  ],
  compensation: [
    {
      id: 1,
      month: "June 2026",
      grossPay: 9000,
      netPay: 7200,
      status: "Paid",
    },
    {
      id: 2,
      month: "May 2026",
      grossPay: 8900,
      netPay: 7120,
      status: "Paid",
    },
    {
      id: 3,
      month: "April 2026",
      grossPay: 8800,
      netPay: 7040,
      status: "Paid",
    },
    {
      id: 4,
      month: "March 2026",
      grossPay: 8700,
      netPay: 6960,
      status: "Paid",
    },
  ],
  payrollSummary: {
    totalMonthlyPayout: 245000,
    pendingBonuses: 15000,
    employeeCount: 32,
    employees: [
      { id: 1, name: "Alice Johnson", baseSalary: 7200, proposedAdjustment: 0, adjustedSalary: 7200 },
      { id: 2, name: "Bob Smith", baseSalary: 6800, proposedAdjustment: 0, adjustedSalary: 6800 },
      { id: 3, name: "Charlie Brown", baseSalary: 7400, proposedAdjustment: 0, adjustedSalary: 7400 },
      { id: 4, name: "Diana Prince", baseSalary: 7800, proposedAdjustment: 0, adjustedSalary: 7800 },
    ],
  },
  recruitment: [],
  learning: [],
};


export async function fetchList(resource) {
  const url = `/hr/${resource}`;
  try {
    return await api.get(url);
  } catch (err) {
    console.warn(`hrService: fetch failed for ${url}, falling back to mock:`, err.message || err);
  }

  // Return mock data if available, otherwise empty array
  const fallback = mockData[resource];
  if (fallback !== undefined) return Promise.resolve(fallback);
  return Promise.resolve([]);
}

export const getOverview = () => fetchList("overview");
export const getDepartments = () => fetchList("departments");
export const getAttendance = () => fetchList("attendance");
export const getLeave = () => fetchList("leave");
export const getAssets = () => fetchList("assets");
export const getWorkforce = () => fetchList("workforce");
export const getCompensation = () => fetchList("compensation");
export const getPayrollSummary = () => fetchList("payrollSummary");
export const getRecruitment = () => fetchList("recruitment");
export const getLearning = () => fetchList("learning");

export const createRecord = (resource, payload) => api.post(`/hr/${resource}`, payload);
export const updateRecord = (resource, id, payload) => api.put(`/hr/${resource}/${id}`, payload);
export const deleteRecord = (resource, id) => api.delete(`/hr/${resource}/${id}`);
// Add more helpers as needed
