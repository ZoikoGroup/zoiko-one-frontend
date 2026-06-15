import { getAttendanceDashboard as mockDashboard } from "../mock-data/dashboardData";
import { getDailyRecords as mockDailyRecords } from "../mock-data/dailyRecords";
import { getMyAttendance as mockMyAttendance } from "../mock-data/myAttendanceData";
import { getCorrections as mockCorrections } from "../mock-data/correctionsData";
import { getSchedule as mockSchedule } from "../mock-data/scheduleData";
import { getAttendanceReports as mockReports } from "../mock-data/reportsData";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getAttendanceDashboard() {
  await delay();
  return mockDashboard();
}

export async function getDailyRecords(filters = {}) {
  await delay();
  let result = [...mockDailyRecords()];
  if (filters.status) result = result.filter((r) => r.status === filters.status);
  if (filters.department) result = result.filter((r) => r.department === filters.department);
  if (filters.date) result = result.filter((r) => r.date === filters.date);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((r) => r.employee.toLowerCase().includes(q) || r.department.toLowerCase().includes(q));
  }
  return result;
}

export async function getMyAttendance() {
  await delay();
  return mockMyAttendance();
}

export async function clockIn() {
  await delay();
  return { success: true, message: "Clocked in successfully" };
}

export async function clockOut() {
  await delay();
  return { success: true, message: "Clocked out successfully" };
}

export async function getCorrections() {
  await delay();
  return [...mockCorrections()];
}

export async function createCorrection(data) {
  await delay();
  return { success: true, id: Date.now(), ...data, status: "pending" };
}

export async function approveCorrection(id) {
  await delay();
  return { success: true, message: "Correction approved" };
}

export async function rejectCorrection(id) {
  await delay();
  return { success: true, message: "Correction rejected" };
}

export async function getSchedule() {
  await delay();
  return mockSchedule();
}

export async function createShift(data) {
  await delay();
  return { success: true, id: Date.now(), ...data };
}

export async function assignShift(data) {
  await delay();
  return { success: true, id: Date.now(), ...data };
}

export async function getAttendanceReports() {
  await delay();
  return [...mockReports()];
}
