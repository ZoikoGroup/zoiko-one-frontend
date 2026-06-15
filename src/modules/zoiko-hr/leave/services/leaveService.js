import { getLeaveDashboard as mockDashboard } from "../mock-data/leaveData";
import { getMyLeave as mockMyLeave } from "../mock-data/leaveData";
import { getLeaveRequests as mockRequests } from "../mock-data/leaveData";
import { getLeaveCalendar as mockCalendar } from "../mock-data/leaveData";
import { getLeaveTypes as mockTypes } from "../mock-data/leaveData";
import { getLeaveReports as mockReports } from "../mock-data/leaveData";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getLeaveDashboard() {
  await delay();
  return mockDashboard();
}

export async function getMyLeave() {
  await delay();
  return [...mockMyLeave()];
}

export async function getLeaveRequests(filters = {}) {
  await delay();
  let result = [...mockRequests()];
  if (filters.status) result = result.filter((r) => r.status === filters.status);
  if (filters.department) result = result.filter((r) => r.department === filters.department);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((r) => r.employee_name.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.leave_type.toLowerCase().includes(q));
  }
  return result;
}

export async function getLeaveCalendar(filters = {}) {
  await delay();
  let result = [...mockCalendar()];
  if (filters.department) result = result.filter((r) => r.department === filters.department);
  if (filters.leave_type) result = result.filter((r) => r.leave_type === filters.leave_type);
  return result;
}

export async function getLeaveTypes() {
  await delay();
  return [...mockTypes()];
}

export async function getLeaveReports() {
  await delay();
  return mockReports();
}

export async function createLeaveRequest(data) {
  await delay();
  return { success: true, id: Date.now(), ...data, status: "pending", created_at: new Date().toISOString() };
}

export async function reviewLeaveRequest(id, data) {
  await delay();
  return { success: true, message: "Leave request reviewed", id, ...data };
}
